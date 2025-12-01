下面这一条，我会把你问的重点完整给出：

> **Database Driver（真正执行 SQL、事务、连接数据库的底层驱动）到底在 NestJS 项目里在哪里引入？怎么引入？用代码举例？**

并且覆盖：

* TypeORM（MySQL / PostgreSQL / SQLite / SQL Server）
* Mongoose / MongoDB
* Prisma（它内部也有 driver）
* 手动使用底层 driver（mysql2 / pg）
* NestJS 官方 DatabaseModule 的引入位置与结构

全部讲透，让你彻底理解“驱动在哪里”和“ORM在哪里”的分工。

---

# 🎯 一句话总结（最关键）

> **在 NestJS 中，Database Driver 并不是你手动 new 出来的，而是通过“数据库模块（TypeOrmModule、MongooseModule、PrismaModule 等）在 AppModule 中注册时自动加载并初始化的”。**

换句话说：

```
你在 AppModule 中的 Database Module = 真正加载 Driver 的入口
```

代码就是：

```ts
TypeOrmModule.forRoot({ type: 'mysql', ... })
```

或

```ts
MongooseModule.forRoot('mongodb://...')
```

你只配置，Nest + ORM 自动连接 + 加载驱动。

---

# 🌐 1. TypeORM Database Driver 在哪里引入？（MySQL / Postgres）

## ✔ driver 安装（MySQL 示例）

```bash
npm install @nestjs/typeorm typeorm mysql2
```

这里的 **mysql2** 就是真正执行 SQL 的 Driver。

## ✔ Driver 的引入位置（AppModule → forRoot）

```ts
// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',                   // ⭐ 指定 Driver → 用 mysql2
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'demo',
      entities: [User],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
```

👉 这里的 `type: 'mysql'` 就指定了真正使用哪个驱动：

| type     | 真实 driver 包 |
| -------- | ----------- |
| mysql    | mysql2      |
| postgres | pg          |
| mariadb  | mariadb     |
| sqlite   | sqlite3     |
| mssql    | tedious     |
| mongodb  | mongodb     |

TypeORM 根据 type 自动加载对应 driver。

## ✔ 你能看到驱动在哪里被使用吗？（可以）

在任何 Service 中注入 DataSource：

```ts
constructor(private readonly dataSource: DataSource) {}

async rawSql() {
  return this.dataSource.query(`SELECT 1`); // ⭐ MySQL driver 执行 SQL
}
```

---

# 🌐 2. Mongoose（MongoDB）Driver 在哪里引入？

## ✔ driver 安装

```bash
npm install @nestjs/mongoose mongoose
```

这里的 **mongoose** 是 ORM，底层是 **mongodb driver**。

## ✔ Driver 引入点（AppModule → MongooseModule.forRoot）

```ts
// app.module.ts
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/mydb'), // ⭐ driver 加载点
  ],
})
export class AppModule {}
```

MongoDB 的底层驱动是：

```
mongodb
```

NestJS + Mongoose 会自动加载。

---

# 🌐 3. Prisma（PostgreSQL / MySQL / MongoDB / SQLite）Driver 在哪里引入？

Prisma 底层 driver 在 Prisma Engine 里，不需要你手动管理。

## ✔ 安装

```bash
npm install prisma @prisma/client
npx prisma init
```

## ✔ Prisma 连接 driver 的位置（prisma/schema.prisma）

例如：

```prisma
datasource db {
  provider = "postgresql"     // ⭐ 决定 Driver = pg
  url      = env("DATABASE_URL")
}
```

Prisma 会根据 provider 加载对应 driver：

| provider   | driver  |
| ---------- | ------- |
| postgresql | pg      |
| mysql      | mysql   |
| mongodb    | mongodb |

## ✔ NestJS PrismaModule（驱动初始化处）

```ts
// prisma/prisma.module.ts
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

PrismaService 执行连接：

```ts
// prisma/prisma.service.ts
@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super();  // ⭐ PrismaClient 内部初始化 driver
  }
}
```

你只用 super() 就行，驱动在 Prisma 内部。

---

# 🌐 4. Knex（或 QueryBuilder）等 Database driver 引入

如果你用 Knex：

```bash
npm install knex mysql2
```

DbModule：

```ts
// db/db.module.ts
import * as Knex from 'knex';

@Module({
  providers: [
    {
      provide: 'KNEX_CONNECTION',
      useFactory: () => {
        return Knex({
          client: 'mysql2',    // ⭐ Driver 入口
          connection: {
            host: 'localhost',
            user: 'root',
            password: '123456',
            database: 'testdb',
          },
        });
      },
    },
  ],
  exports: ['KNEX_CONNECTION'],
})
export class DbModule {}
```

Service 使用：

```ts
@Injectable()
export class UserService {
  constructor(@Inject('KNEX_CONNECTION') private knex) {}

  getUsers() {
    return this.knex('users').select('*');
  }
}
```

这里 driver 是明确指定 `client: 'mysql2'`。

---

# 🌐 5. TypeORM “底层 driver 注入”完整示例（含事务）

你可以直接在 Service 中调用底层 driver 的接口：

```ts
// users.service.ts
@Injectable()
export class UsersService {
  constructor(private dataSource: DataSource) {}

  async testTransaction() {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();  // ⭐ 底层 driver 连接
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.query(
        `INSERT INTO user (name) VALUES ('jack')`,
      );

      await queryRunner.commitTransaction();
      return user;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release(); // ⭐ 底层 driver 释放
    }
  }
}
```

👉 在这里，真正执行 SQL 的就是 `mysql2` 驱动。

---

# 🌐 6. 你真的可以“手动使用底层 driver”

如果你想绕过 ORM，直接用 mysql2（纯驱动）：

## ✔ 安装

```bash
npm install mysql2
```

## ✔ Module 注册 driver（正确位置）

```ts
// db/mysql-driver.module.ts
import * as mysql from 'mysql2/promise';

@Module({
  providers: [
    {
      provide: 'MYSQL_DRIVER',
      useFactory: async () => {
        return mysql.createPool({
          host: 'localhost',
          user: 'root',
          password: '123456',
          database: 'demo',
          connectionLimit: 10,
        });
      },
    },
  ],
  exports: ['MYSQL_DRIVER'],
})
export class MysqlDriverModule {}
```

## ✔ 在 Service 中拿到 driver 干 SQL

```ts
@Injectable()
export class RawSqlService {
  constructor(@Inject('MYSQL_DRIVER') private pool) {}

  async getUsers() {
    const [rows] = await this.pool.query('SELECT * FROM user'); // ⭐ driver执行SQL
    return rows;
  }
}
```

👉 这里没有 ORM，真正运行 SQL 的就是 mysql2 driver。

---

# 🧠 7. 整体脑图总结（非常关键）

### 🚪 Database Driver 引入入口 = “数据库模块的 forRoot()”

| 数据库                | NestJS 引入位置              | 驱动                   |
| ------------------ | ------------------------ | -------------------- |
| TypeORM + MySQL    | TypeOrmModule.forRoot()  | mysql2               |
| TypeORM + Postgres | TypeOrmModule.forRoot()  | pg                   |
| TypeORM + SQLite   | TypeOrmModule.forRoot()  | sqlite3              |
| Mongoose           | MongooseModule.forRoot() | mongodb              |
| Prisma             | schema.prisma            | pg / mysql / mongodb |
| Knex               | 自己 Module 的 provider     | mysql2 / pg          |
| 手写 mysql2 / pg     | 自定义 Module               | mysql2 / pg          |

### 🧩 驱动不能注册在：

* Controller
* Service
* Guard
* Pipe
* Interceptor
* main.ts（❌不能 new driver）

### ✔ 驱动必须注册在：

```
@Module → providers / imports
```

或者 ORM 工具本身自动初始化：

```
TypeOrmModule.forRoot()
MongooseModule.forRoot()
PrismaModule(super())
```

---

# 📦 最终一句话帮你记住

> **Database Driver 永远是在 “数据库模块（TypeOrmModule / MongooseModule / Prisma Module）” 中作为配置项加载，而不是在 Service 或 Controller 中 new 出来的。**

---

如果你愿意，我可以继续给你：

👉 一套 **企业级 Database 层架构：Driver → ORM → Repository → Service → Controller** 的完整代码骨架
（支持 MySQL / Postgres / Mongo / Prisma）

要不要我帮你生成？
