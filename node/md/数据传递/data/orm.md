下面这条，我把你问的：

> **ORM（构建 SQL / 查询逻辑）到底在哪里引入？在 NestJS + TypeORM 中应该写在哪一层？怎么组织？怎么复用？怎么封装复杂 SQL？**

统统讲透，并给你 **可复制使用的完整代码模板**。

你会得到：

* ORM 的正确引入位置（Service? Repository? Module? 还是 entity?）
* CRUD 查询逻辑写在哪里
* 复杂 SQL / QueryBuilder / 原生 SQL 写在哪里
* Repository 层、Service 层、Module 层的最佳实践
* 企业级“DAO/Repository 层”模版

---

# 🎯 一句话核心结论

> **ORM（SQL 构建 / 查询逻辑）只能在 Repository 层 或 Service 层中使用，最终依赖 `TypeOrmModule.forFeature()` 注入的 Repository 来执行。**
>
> **ORM 执行入口永远来自：`Repository`、`DataSource`、`QueryBuilder`。**

换句话说，你要写 SQL 或 ORM 查询，真正的入口是：

```
InjectRepository(Entity)
DataSource.createQueryBuilder()
Repository.createQueryBuilder()
Repository.find()
Repository.save()
```

这些代码只能出现在：

* **Repository 层（推荐）**
* Service 层（轻量项目）
* 特定场景：Module 中通过 async provider 构建 QueryBuilder（不推荐）

绝不能写在：

* Controller（❌ 不允许）
* DTO（❌）
* Guard/Pipe/Interceptor（❌）
* main.ts（❌）

---

# 🧭 ORM 引入位置总览（全部列清楚）

| 层级                            | 是否适合写 ORM 查询     | 用途                       |
| ----------------------------- | ---------------- | ------------------------ |
| **Repository（推荐）**            | ⭐⭐⭐⭐⭐            | 所有 SQL/QueryBuilder/复杂查询 |
| **Service 层**                 | ⭐⭐⭐              | 简单 CRUD、组合 Repository    |
| Controller                    | ❌                | 不允许写 SQL                 |
| Guard/Pipe/Filter/Interceptor | ❌                | 禁止访问数据库                  |
| Module                        | ❌（除非动态 provider） | 不建议                      |
| Entity                        | ❌                | 只能定义结构，不写 SQL            |

---

# 🚀 一、ORM 在 Repository 层引入（最推荐、企业级）

## ✔ Step 1：在 Module 中引入 Repository

```ts
// users/users.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersRepository, UsersService],
  exports: [UsersRepository],
})
export class UsersModule {}
```

---

## ✔ Step 2：Repository 层写 ORM 查询（核心位置）

```ts
// users/users.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  // 标准 CRUD
  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  // 使用 QueryBuilder（复杂 SQL）
  findUserWithPosts(id: number) {
    return this.repo
      .createQueryBuilder('user')     // 主表
      .leftJoinAndSelect('user.posts', 'post')
      .where('user.id = :id', { id })
      .getOne();
  }

  // 使用原生 SQL
  rawQuery() {
    return this.repo.query(`SELECT * FROM user WHERE id > $1`, [10]);
  }
}
```

### 🔥 ORM 最推荐写法就是放在 Repository 里。

企业级项目 100% 采用这种分层方式。

---

# 🚀 二、ORM 在 Service 层引入（中小项目常用）

如果你的项目比较小，也可以直接在 Service 层写 ORM 查询。

```ts
// users/users.service.ts
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  create(dto: any) {
    const user = this.repo.create(dto);
    return this.repo.save(user);
  }

  async findPaged(page: number, pageSize: number) {
    return this.repo.find({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { id: 'DESC' },
    });
  }

  search(keyword: string) {
    return this.repo
      .createQueryBuilder('user')
      .where('user.username LIKE :kw', { kw: `%${keyword}%` })
      .getMany();
  }
}
```

这种模式：

* 控制器不写 SQL
* Service 写少量 SQL
* 以后可随时迁移到 Repository 层

---

# 🚀 三、ORM 在事务（Transaction）中引入

事务场景下，你需要 QueryRunner 或 `DataSource`：

## ✔ 用 QueryRunner

```ts
constructor(private readonly dataSource: DataSource) {}

async createUserWithOrders() {
  const runner = this.dataSource.createQueryRunner();
  await runner.connect();
  await runner.startTransaction();

  try {
    await runner.manager.save(User, { name: 'Alice' });
    await runner.manager.save(Order, { total: 100 });

    await runner.commitTransaction();
  } catch (e) {
    await runner.rollbackTransaction();
    throw e;
  } finally {
    await runner.release();
  }
}
```

---

## ✔ 在 Repository 层用 QueryBuilder + 事务

```ts
async updateWithTransaction() {
  await this.repo.manager.transaction(async manager => {
    const user = await manager.findOne(User, { where: { id: 1 } });
    user.age++;
    await manager.save(user);
  });
}
```

---

# 🚀 四、ORM 在独立 DataSource 中使用

有时你需要直接查询数据库（很少见）：

```ts
constructor(private readonly dataSource: DataSource) {}

findRawUsers() {
  return this.dataSource.query(`SELECT * FROM users`);
}
```

还有 QueryBuilder：

```ts
this.dataSource
  .createQueryBuilder()
  .select('*')
  .from(User, 'u')
  .where('u.id > :id', { id: 10 })
  .getRawMany();
```

---

# 🚨 五、ORM 不该写在哪里（你必须知道）

绝对不能：

| 错误写法               | 原因         |
| ------------------ | ---------- |
| Controller 中写 SQL  | ❌ MVC 分层破坏 |
| Guard 中查询数据库       | ❌ 容易造成性能问题 |
| Pipe 中访问数据库        | ❌ 绝对不允许    |
| Interceptor 中写 SQL | ❌ 不可控      |
| DTO 中写查询           | ❌ 完全错误     |
| main.ts            | ❌          |

---

# 🏛 六、企业级推荐项目结构（完整示例）

```
src/
 ├── app.module.ts
 ├── database/
 │     └── typeorm.config.ts
 ├── users/
 │     ├── entities/user.entity.ts
 │     ├── users.repository.ts   ← ORM 查询逻辑放这里
 │     ├── users.service.ts
 │     ├── users.controller.ts
 │     ├── users.module.ts
 ├── posts/
 │     ├── posts.repository.ts
 │     ├── posts.service.ts
 │     ├── posts.controller.ts
 │     └── posts.module.ts
```

这种组织方式：

* Repository：负责 ORM & SQL
* Service：负责业务组合、规则
* Controller：暴露接口

是 NestJS + TypeORM 最清晰、可维护的架构。

---

# 🏁 七、最终总结（你的问题原答案）

### ❓“ORM（构建 SQL / 查询逻辑）在哪里引入？”

✔ **Repository 层**（最推荐、企业级）
✔ Service 层（小项目常用）
✔ 事务中使用 QueryRunner / DataSource
✘ Controller / Guard / DTO / Module（不允许）

### ORM 实际使用入口：

* `InjectRepository(Entity)`
* `Repository.find() / save() / createQueryBuilder()`
* `DataSource.query()`
* `QueryRunner`

---

# 📦 如果你愿意，我可以继续给你：

👉 **企业级 TypeORM 查询模板（分页、排序、动态条件、between、in、join、子查询）**
👉 **Repository 层最佳架构：基类 Repository + 自动构建 QueryBuilder**

你需要这套吗？
