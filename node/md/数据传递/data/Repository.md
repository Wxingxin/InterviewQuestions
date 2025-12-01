下面这条，我把 **NestJS + TypeORM 的 Repository（仓储层）到底在哪里引入、怎么注入、如何跨模块使用、Service 怎么优雅地调用、以及企业项目怎么组织 Repository 层** 讲得彻底清楚，并给你 **全套可复制代码模板**。

---

# 🎯 一句话核心答案

> **TypeORM 的 Repository 只能通过 `TypeOrmModule.forFeature()` 注入到某个模块的 Provider 中。**

也就是说，真正“引入 Repository” 的入口只有一个：

```ts
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
})
export class UsersModule {}
```

然后在 Service 里通过：

```ts
@InjectRepository(User) private readonly repo: Repository<User>
```

---

# 🚀 二、基础示例：Repository 的标准引入方式

## ① 定义实体（Entity）

```ts
// src/users/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;
}
```

---

## ② 在模块中引入 `TypeOrmModule.forFeature`

这是 **Repository 的唯一引入入口**：

```ts
// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),  // ⭐ Repository 引入点
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],             // ⭐ 若其他模块需要用
})
export class UsersModule {}
```

---

## ③ 在 Service 中注入 Repository（最常见）

```ts
// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,  // ⭐ 注入
  ) {}

  findAll() {
    return this.usersRepo.find();
  }

  findOne(id: number) {
    return this.usersRepo.findOne({ where: { id } });
  }

  create(data: Partial<User>) {
    const user = this.usersRepo.create(data);
    return this.usersRepo.save(user);
  }
}
```

Repository 只要在当前模块被 `forFeature` 注册，就能自动注入。

---

# 🌈 三、跨模块使用 Repository（必看！）

如果另一个模块（例如 AuthModule）需要操作 Users 的 Repository，有两种方式：

---

## ✔ 方法 1：跨模块 import UsersModule（最推荐）

### ① UsersModule 导出 UsersService

```ts
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  exports: [UsersService],  // ⭐ 导出
})
export class UsersModule {}
```

### ② AuthModule 引入 UsersModule

```ts
@Module({
  imports: [UsersModule], // ⭐ 导入
  providers: [AuthService],
})
export class AuthModule {}
```

AuthService 中即可：

```ts
constructor(private readonly usersService: UsersService) {}
```

---

## ✔ 方法 2：跨模块直接引入相同 entity（不推荐）

```ts
@Module({
  imports: [TypeOrmModule.forFeature([User])], // 在多个模块重复注册
})
```

⚠️ 这样会导致多个 Repository 实例独立存在，不共用事务，不建议。

---

# 🔥 四、Repository 的“独立 Repository 层写法” （企业级）

很多公司会再封一层 “Repository 类”，避免 Service 里直接写 TypeORM 查询。

结构如下：

```
users/
  ├── users.repository.ts
  ├── users.service.ts
  └── users.module.ts
```

---

## ✔ 定义 Repository（不继承 TypeORM Repository，按组合模式）

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

  findAll() {
    return this.repo.find();
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  save(data: Partial<User>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }
}
```

---

## ✔ 在 Service 中使用自定义 Repository

```ts
@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  getUsers() {
    return this.usersRepo.findAll();
  }
}
```

---

## ✔ UsersModule 需要将 Repository 注册为 provider

```ts
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, UsersRepository],  // ⭐
  exports: [UsersService],
})
export class UsersModule {}
```

---

# 🧪 五、Repository 在事务中引入

### ① 手动事务（QueryRunner）

```ts
async createUserWithTransaction() {
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.startTransaction();

  try {
    await queryRunner.manager.save(User, { username: 'jack' });
    await queryRunner.commitTransaction();
  } catch (e) {
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }
}
```

---

### ② 使用 `@Transactional()`（依赖第三方库）

可配合 `typeorm-transactional-cls-hooked` 自动管理事务。

---

# 🧩 六、完整项目结构示例（Reference）

```
src/
 ├── app.module.ts
 ├── database/
 │     └── database.module.ts
 ├── users/
 │     ├── entities/user.entity.ts
 │     ├── users.repository.ts
 │     ├── users.service.ts
 │     ├── users.controller.ts
 │     └── users.module.ts
 └── auth/
       ├── auth.service.ts
       ├── auth.controller.ts
       └── auth.module.ts
```

---

# 🏁 七、总结（你问的重点）

### ❓ Repository（TypeORM Repository 层）在哪里引入？

✔ 只能通过：

```
@Module({
  imports: [TypeOrmModule.forFeature([Entity])]
})
```

### ❓ 在哪里注入？

✔ Service / Repository 类中：

```
@InjectRepository(Entity)
repo: Repository<Entity>
```

### ❓ 跨模块使用？

✔ 导出 Service 或 Repository → 其他模块 import 使用
✔ 不要重复 forFeature 同一个 Entity（会生成多个 Repository 实例）

---

如果你愿意，我还能给你：

👉 **企业级 TypeORM 模板：Repository 层 + Service 层 + DTO + 事务管理 + 分页 + 排序 + 动态查询**
想要吗？
