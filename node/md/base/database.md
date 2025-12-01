下面这份内容专门讲你问的两件事：

1. **Database Driver（真正执行 SQL/事务的底层驱动）**
2. **Database（MySQL / PostgreSQL / MongoDB）在 NestJS 中如何接入 & 哪里引入**

它们常常被混为一谈，但其实是不同层级的东西，我会帮你系统梳理清楚。

内容非常“聚焦”，不会散到 Controller/Service 之外。

---

# 🌊 一、Database Driver 是什么？（真正执行 SQL 的底层引擎）

> **Database Driver = 数据库连接驱动，是最终把 SQL 发给数据库执行的那一层底座。**

比如：

| 数据库     | NestJS（TypeORM）底层使用的 Driver 包 |
| ---------- | ------------------------------------- |
| MySQL      | `mysql` / `mysql2`                    |
| PostgreSQL | `pg`                                  |
| SQLite     | `sqlite3`                             |
| MongoDB    | `mongodb`                             |
| MariaDB    | `mariadb`                             |
| MSSQL      | `tedious`                             |

👉 这些 Driver 是 **TypeORM 或 Prisma 或 Knex** 最终调用的底层库。
👉 它们通过 TCP/Socket/协议和数据库通信。

你平时不直接用它，但 ORM 必须依赖它。

---

# 📍 二、Database Driver 在 NestJS 的哪里被使用？在哪里引入？

> **绝大多数情况下：不需要你手动引入 Driver。**
> ORM（TypeORM / Prisma）会在 `npm install` 或 forRoot 里自动 require。

例如：

```bash
npm install @nestjs/typeorm typeorm mysql2
```

这里的 `mysql2` 就是 Database Driver。
你只要安装就算“引入”了。

然后在 `TypeOrmModule.forRoot()` 指定 TypeORM 用它。

```ts
TypeOrmModule.forRoot({
  type: "mysql", // <--- ORM 自动使用 mysql2
  host: "localhost",
  port: 3306,
  username: "root",
  password: "123456",
  database: "test_db",
});
```

**你不需要写 `import mysql2 from 'mysql2'`，ORM 会自动加载驱动。**

---

# 🧩 三、Database（MySQL、PostgreSQL…）本体在 NestJS 中如何引入？

这是所有 ORM 系统的“入口点”。

Nest 并不直接连接数据库，而是：

```
NestJS → ORM（TypeORM / Prisma）→ Database Driver → DB服务器
```

所以，你只需要配置 ORM（TypeORM 为例），数据库就被引入了。

---

# 🧭 四、Database 在 NestJS 中的引入位置（非常关键）

## ✔ 1. 在 AppModule 中注册数据库（全局连接）

一般放在 **根模块 AppModule**：

```ts
// app.module.ts
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql", // 数据库类型
      host: "localhost",
      port: 3306,
      username: "root",
      password: "123456",
      database: "nest_demo",
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
```

> **记忆点：`TypeOrmModule.forRoot()` 是数据库连接的入口，只写一次。**

这一步做了什么？

- 建立数据库连接池
- 加载 Database Driver
- 创建 QueryRunner
- 初始化 ORM 内部的 EntityManager
- 准备 Repository 映射

---

## ✔ 2. 在 Feature Module 中注册实体（Repository 作用域）

```ts
@Module({
  imports: [TypeOrmModule.forFeature([User, Post])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
```

> **记忆点：每个“功能模块”使用哪些表（实体），就在 `forFeature()` 声明。**

---

# ⚙️ 五、Database Driver（底层驱动）是怎么执行 SQL 的？

你平时看不到，但底层是这样的调用链：

```
Controller
  → Service
    → Repository
      → QueryBuilder / manager
        → Database Driver（mysql2, pg...）
          → 数据库真正执行 SQL
```

举例：Repository 查询

```ts
await this.userRepo.findOne({ where: { id: 1 } });
```

TypeORM 会把它变成 SQL，例如：

```sql
SELECT * FROM user WHERE id = ? LIMIT 1;
```

然后底层调用：

```ts
mysql2Connection.execute(sql, [1]);
```

或者 PostgreSQL 驱动：

```ts
pgClient.query(sql, [1]);
```

你不需要写这些，但它们确实在执行。

---

# 🔥 六、Database Driver & ORM 如何执行事务？

## 方式 1：ORM 自动管理（最常用）

```ts
await this.dataSource.transaction(async (manager) => {
  await manager.save(User, user);
  await manager.save(Profile, profile);
});
```

底层执行链：

```
manager.beginTransaction()
driver.query('BEGIN')
driver.query('INSERT ...')
driver.query('INSERT ...')
driver.query('COMMIT')
```

所以事务是 Driver 层在做，ORM 只是封装。

---

## 方式 2：QueryRunner 手动管理（高级用法）

```ts
const runner = this.dataSource.createQueryRunner();
await runner.connect();
await runner.startTransaction();

try {
  await runner.manager.save(User, user);
  await runner.commitTransaction();
} catch (e) {
  await runner.rollbackTransaction();
} finally {
  await runner.release();
}
```

---

# 🧠 七、常用数据库（MySQL / PostgreSQL / MongoDB）的 NestJS 用法对照

| 数据库类型     | 驱动包    | NestJS ORM 用法                         |
| -------------- | --------- | --------------------------------------- |
| **MySQL**      | `mysql2`  | `type: 'mysql'`                         |
| **PostgreSQL** | `pg`      | `type: 'postgres'`                      |
| **SQLite**     | `sqlite3` | `type: 'sqlite'`                        |
| **MongoDB**    | `mongodb` | `type: 'mongodb'`（TypeORM 不建议使用） |
| **MariaDB**    | `mariadb` | `type: 'mariadb'`                       |

示例：PostgreSQL

```ts
TypeOrmModule.forRoot({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "123456",
  database: "db_demo",
});
```

示例：MongoDB（官方不太推荐使用 TypeORM 操作 Mongo）

```ts
TypeOrmModule.forRoot({
  type: "mongodb",
  url: "mongodb://localhost:27017/test",
  useUnifiedTopology: true,
});
```

---

# 🧱 八、Database & Driver 的最佳实践

### ✔ 1. 不要自己创建数据库连接

永远用 ORM 提供的连接池，不要写：

```ts
new mysql2.createConnection(...)
```

这是反模式！

---

### ✔ 2. 永远在 AppModule 做全局连接

不要在多个 Module 反复写 forRoot()。

---

### ✔ 3. Repository 只能在 forFeature 注册之后才能注入

不要随便 inject repository：

```ts
// ❌ 错误
constructor(private repo: Repository<User>) {}
```

---

### ✔ 4. 强烈建议开启 autoLoadEntities（开发环境）

```ts
autoLoadEntities: true;
```

---

### ✔ 5. 生产环境不要开启 synchronize

避免 ORM 自动改表。

---

# 🗂 九、总结一张图（最关键的结构）

```
         ┌────────────┐
         │ Controller │
         └──────┬─────┘
                │
         ┌──────▼──────┐
         │   Service   │
         └──────┬──────┘
                │
       Inject Repository
                │
         ┌──────▼──────────┐
         │ TypeORM Repo     │
         │ QueryBuilder     │
         │ EntityManager    │
         └──────┬──────────┘
                │
         ┌──────▼──────────┐
         │ Database Driver  │  ← mysql2 / pg / mongodb
         └──────┬──────────┘
                │
        ┌───────▼────────────┐
        │ MySQL/Postgres/etc │
        └─────────────────────┘
```

---

# 💎 十、最终速记版（考试/面试可用）

```
Database Driver
 ├─ 真正执行 SQL 的底层库（mysql2 / pg / sqlite3）
 ├─ 被 ORM 自动调用，开发者不直接接触
 └─ 负责连接池、事务、查询执行

Database（数据库本体）
 ├─ MySQL / PostgreSQL / MongoDB …
 ├─ 通过 ORM 注册连接（TypeOrmModule.forRoot）
 └─ 每个模块通过 forFeature 声明要用的实体

引入位置
 ├─ AppModule：forRoot() 注册 DB 连接
 ├─ FeatureModule：forFeature([Entity]) 注册 Repository
 ├─ Service：@InjectRepository(Entity) 使用 Repository
 └─ ORM 自动加载 Driver，无需手动 import
```

---

如果你愿意，我还可以继续讲：

### ✓ “TypeORM vs Prisma vs Knex”的底层对比

### ✓ “事务（Transaction）”的最佳实践

### ✓ “多数据库连接（主从 / 分库）”在 Nest 中如何实现

告诉我你想继续哪一块？
