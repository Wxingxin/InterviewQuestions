这次我们把 **TypeORM 的 Repository（仓储层）** 在 NestJS 中的用法**系统讲全**：
**是什么 → 怎么用 → 放在哪儿 → 如何注入 → 典型 Query → 高阶用法 → 最佳实践**。
这是项目中最容易用错的一层，这份内容你可以直接当成“实战指南”。

---

# 🧭 一、Repository 是什么？（核心定义）

> **Repository 是 TypeORM 中访问数据库的核心对象，是对某个实体（Entity）的所有数据库操作的集合。**

它封装了：

* `find/findOne`
* `save/update/delete`
* `QueryBuilder`
* 原生 SQL
* 事务管理等能力

在 NestJS 中，Repository 是通过：

```
@nestjs/typeorm  + TypeOrmModule.forFeature()
```

组合使用。

---

# 📍 二、Repository 要在哪里引入？（重点）

Repository 不能直接 new，也不能自动注入。必须通过：

> **在某个 Module 的 `imports` 中使用 `TypeOrmModule.forFeature([Entity])` 引入**

例如：

```ts
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),  // 注册实体，Repository 由 Nest 自动创建
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [TypeOrmModule],            // 如果别的模块也要用这个实体
})
export class UsersModule {}
```

这样，Nest 就会为 `User` 这个实体自动生成：

```
Repository<User>
```

并且允许你在 Service 中注入它。

---

# 🧩 三、Repository 如何注入 & 使用？（典型写法）

在 Service 中注入 Repository：

```ts
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,  // 自动注入
  ) {}
}
```

现在就可以使用它的各种 API：

```ts
this.userRepo.find();
this.userRepo.findOne();
this.userRepo.save();
this.userRepo.update();
this.userRepo.delete();
```

---

# 🧱 四、TypeORM Repository 常用 API 全家桶

下面涵盖了**80% 项目用到的操作**。

---

## 1. 查找（SELECT）

### ✔ find（列表）

```ts
this.userRepo.find();  // 返回所有
```

带条件：

```ts
this.userRepo.find({
  where: { isActive: true },
});
```

分页：

```ts
this.userRepo.find({
  skip: 10,
  take: 20,
});
```

排序：

```ts
this.userRepo.find({
  order: { createdAt: 'DESC' }
});
```

---

## 2. 查找一个（findOne）

```ts
const user = await this.userRepo.findOne({
  where: { id: 1 },
});
```

如果找不到返回 null，常用判断：

```ts
if (!user) throw new NotFoundException();
```

---

## 3. 插入（insert / save）

### 推荐使用 save（更智能）

```ts
await this.userRepo.save({ email: 'a@b.com', name: 'Tom' });
```

save 有智能合并：

* 如果包含 id，会自动执行 update
* 如果没有 id，会自动 insert

---

## 4. 更新（update）

```ts
await this.userRepo.update(id, { name: 'NewName' });
```

注意：`update()` 不会返回更新后的数据，也不会触发 entity 事件。

如果需要最新数据：

```ts
await this.userRepo.save({ id, name: 'NewName' }); // 会触发钩子
```

---

## 5. 删除（delete）

```ts
await this.userRepo.delete(id);
```

软删除：

```ts
await this.userRepo.softDelete(id);
```

恢复：

```ts
await this.userRepo.restore(id);
```

---

## 6. QueryBuilder（复杂查询）

QueryBuilder 是 Repository 的最强能力。

```ts
return this.userRepo
  .createQueryBuilder('u')
  .where('u.age > :age', { age: 18 })
  .andWhere('u.status = :status', { status: 'active' })
  .leftJoinAndSelect('u.profile', 'p')
  .orderBy('u.createdAt', 'DESC')
  .getMany();
```

更复杂的 SQL 都能写。

---

## 7. 原生 SQL

```ts
await this.userRepo.query('SELECT * FROM user WHERE id = $1', [1]);
```

---

# 🧩 五、Repository 与 Entity 的关系

Repository 的本质是 **针对某个 Entity 的数据库访问层对象**。

你必须有一个实体类：

```ts
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  isActive: boolean;
}
```

Repository 专门操作这个表。

---

# 🏛 六、Repository 与 Module 关系（知识重点）

为了让 Repository 在 Service 中可被注入，你必须：

### ✔ 1. 在 Module 中导入相关实体：

```ts
imports: [TypeOrmModule.forFeature([User])]
```

### ✔ 2. 在 Service 中使用 @InjectRepository(Entity)

```ts
@InjectRepository(User)
private repo: Repository<User>
```

### ✔ 3. 想让其他模块用这个 Repository？导出 TypeOrmModule

```ts
exports: [TypeOrmModule]
```

### ✔ 4. Repository 是单例（在模块级别）

在 nest 中，每个 module 都有自己的 DI 容器，Repository 隶属于它。

---

# 🔍 七、Repository 的高阶技能（你一定会用到）

## 1. 事务（Transaction）

方式 A：使用 QueryRunner

```ts
const runner = this.dataSource.createQueryRunner();

await runner.connect();
await runner.startTransaction();

try {
  await runner.manager.save(User, userData);
  await runner.manager.save(Profile, profileData);

  await runner.commitTransaction();
} catch (err) {
  await runner.rollbackTransaction();
} finally {
  await runner.release();
}
```

方式 B：最经典的 TypeORM 简写

```ts
await this.userRepo.manager.transaction(async manager => {
  await manager.save(User, user);
});
```

---

## 2. 自定义 Repository（扩展封装）

你可以自己写一个 Repository 类封装复杂查询：

```ts
@Injectable()
export class UserRepository extends Repository<User> {}
```

组合成 Module：

```ts
@Module({
  imports: [TypeOrmModule.forFeature([User, UserRepository])],
  providers: [UserRepository],
  exports: [UserRepository],
})
```

服务中使用：

```ts
constructor(private userRepo: UserRepository) {}
```

---

## 3. 使用 DataSource 获得动态 Repository

某些情况下你需要获得动态 Repository：

```ts
constructor(private dataSource: DataSource) {}

getDynamicRepo(entity) {
  return this.dataSource.getRepository(entity);
}
```

---

## 4. 多数据库 / 多连接 Repository

如果你配置了多个 DB，需要使用：

```ts
@InjectRepository(User, 'db2Connection')
private repo: Repository<User>
```

---

# 🧱 八、Repository 的最佳实践（非常重要）

### ✔ 1. CRUD 逻辑尽量写在 Service，不要把业务写在 Repository

Repository 是“数据访问层”，应该干：

* 查询
* 插入
* 更新
* 删除
* 封装数据库语句

而不是业务判断。

---

### ✔ 2. 推荐：CRUD 封装 + QueryBuilder 放在 Repository

例如：

```ts
async findActiveUsers() {
  return this.createQueryBuilder('u')
    .where('u.active = true')
    .getMany();
}
```

---

### ✔ 3. 模块的 Repository 必须通过 `forFeature` 注册

很多新手写成：

```ts
constructor(private repo: Repository<User>) {}
```

❌ 会报错，因为没有告诉 Nest 哪个 Repository。

---

### ✔ 4. 查询尽量使用 where 对象，不写字符串

```ts
this.repo.find({ where: { id } })
```

比：

```ts
this.repo.find({ where: "id = " + id })
```

更安全。

---

### ✔ 5. 使用 DTO 把输入层与 Entity 分离

不要直接把 Entity 当 DTO 用。

---

### ✔ 6. 使用软删除（softDelete）代替直接 delete

---

# 🗂 九、Repository 知识点总结（速记版）

```
Repository（TypeORM）
 ├─ 负责：数据库访问（ORM层）
 ├─ 引入方式：
 │     ├─ Module: TypeOrmModule.forFeature([Entity])
 │     ├─ Service: @InjectRepository(Entity)
 ├─ CRUD API
 │     ├─ find / findOne / findBy
 │     ├─ save / insert / update / delete / softDelete
 │     ├─ restore
 │     ├─ query (原生 SQL)
 ├─ QueryBuilder
 │     ├─ where / join / order / limit
 ├─ 事务：QueryRunner / manager.transaction
 ├─ 高阶
 │     ├─ 自定义 Repository
 │     ├─ 动态 Repository
 │     ├─ 多数据库连接
 ├─ 注意事项
 │     ├─ 业务逻辑不要写在 Repository
 │     ├─ Repository 不能直接 new
 │     ├─ 必须放在 providers 中注入
 │     ├─ 必须在 Module 的 imports 中注册实体
 └─ 最佳实践
       ├─ Service 调 Repository
       ├─ DTO 与 Entity 分离
       ├─ 大查询用 QueryBuilder
```

---

如果你愿意，我还能给你：

### ✓ “Service + Repository + Controller + DTO”的标准项目结构示例（最佳实践）

### ✓ TypeORM QueryBuilder 常用查询模板大全（JOIN / 分页 / 模糊查询 / 聚合）

### ✓ 事务（Transaction）最佳实践写法

你想继续哪一块？
