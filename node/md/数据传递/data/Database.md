下面我把你问的重点 **“Database（MySQL / PostgreSQL / MongoDB）到底在 NestJS 项目中 *哪里引入*？如何引入？每一种数据库的完整代码示例？”** 全部一次性讲透。

> 你会看到：
>
> * 数据库究竟在哪一层注册？
> * 为什么一定是在 **AppModule（根模块）** 引入？
> * 每种数据库（MySQL / PostgreSQL / MongoDB）的标准写法
> * 连接、多数据库、模块化数据库、环境区分的完整示例

内容非常完整，可以整套直接复制到你的项目中。

---

# 🎯 结论：Database（MySQL / PG / Mongo 等）**都是在 AppModule 或 DatabaseModule 中引入的**

---

NestJS 的数据库永远通过“数据库模块”引入：

| 数据库              | NestJS模块      | 引入方法（必须）                    |
| ---------------- | ------------- | --------------------------- |
| MySQL            | TypeORM       | `TypeOrmModule.forRoot()`   |
| PostgreSQL       | TypeORM       | `TypeOrmModule.forRoot()`   |
| MongoDB          | Mongoose      | `MongooseModule.forRoot()`  |
| Prisma           | PrismaModule  | `super()`（PrismaClient内部连接） |
| MongoDB（TypeORM） | TypeOrmModule | `type: 'mongodb'`           |

关键点：

> ❗ **数据库绝不会在 Controller / Service / Guard / Pipe / Interceptor 中直接连接。**
>
> Database 一定在 “Module（模块）” 的 `imports` 中引入。
> Nest 框架自动初始化数据库连接池。

---

# 🚀 第一部分：MySQL 在 NestJS 中哪里引入？

## ✔ 安装依赖

```bash
npm install @nestjs/typeorm typeorm mysql2
```

## ✔ 在 AppModule 中引入（核心）——最标准的方式

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',       // ⭐️ 标识数据库类型（自动加载 mysql2 驱动）
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'demo',
      entities: [User],
      synchronize: true,   // 开发环境自动建表
    }),
  ],
})
export class AppModule {}
```

这就是 **MySQL 在 NestJS 中唯一“正式引入”的地方**。

之后你仅需：

```ts
TypeOrmModule.forFeature([User])
```

即可获得 Repository。

---

# 🚀 第二部分：PostgreSQL 在 NestJS 中哪里引入？

## ✔ 安装依赖

```bash
npm install @nestjs/typeorm typeorm pg
```

## ✔ 在 AppModule 中引入

```ts
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',   // ⭐️ 自动使用 pg driver
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'demo',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
```

Postgres 本质上和 MySQL 用法一样，只是底层驱动不同。

---

# 🚀 第三部分：MongoDB（Mongoose）在哪里引入？

Mongoose 是最常用的 MongoDB ORM。

## ✔ 安装依赖

```bash
npm install @nestjs/mongoose mongoose
```

## ✔ 在 AppModule 中引入

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/nestdb'),  // ⭐️ 核心
  ],
})
export class AppModule {}
```

这个位置就是 Mongo 的正式引入点。

之后可以：

```ts
MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
```

---

# 🚀 第四部分：用 TypeORM 连 MongoDB 的引入方式

TypeORM 本身支持 MongoDB：

```bash
npm install @nestjs/typeorm typeorm mongodb
```

```ts
TypeOrmModule.forRoot({
  type: 'mongodb',
  url: 'mongodb://127.0.0.1:27017/nestdb',
  entities: [User],
  useUnifiedTopology: true,
});
```

这里的 driver 是 `mongodb`。

---

# 🚀 第五部分：Prisma 的 database 引入位置

Prisma 的数据库是通过 `schema.prisma` 引入的，而不是在 app.module.ts 写。

## ✔ 安装

```bash
npm install prisma @prisma/client
npx prisma init
```

## ✔ 数据库驱动引入位置（schema.prisma）

```prisma
datasource db {
  provider = "postgresql"   // ⭐️ database driver 在这里
  url      = env("DATABASE_URL")
}
```

Prisma 的数据库驱动是在 provider 字段中决定的：

| provider   | driver  |
| ---------- | ------- |
| postgresql | pg      |
| mysql      | mysql2  |
| sqlite     | sqlite  |
| mongodb    | mongodb |

## ✔ 在 Nest 中引入 PrismaModule（初始化）

```ts
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

```ts
@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super();   // ⭐️ 这里 PrismaClient 内部初始化 driver
  }
}
```

---

# 🚀 第六部分：连接多个数据库（同时 MySQL + Mongo）

NestJS 完全支持多个数据库：

```ts
@Module({
  imports: [
    // MySQL
    TypeOrmModule.forRoot({
      name: 'mysqlConn',
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'testmysql',
      autoLoadEntities: true,
    }),

    // MongoDB
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/mongo1'),
  ],
})
export class AppModule {}
```

实体模块：

```ts
TypeOrmModule.forFeature([User], 'mysqlConn')
```

---

# 🚀 第七部分：将数据库连接单独放到 DatabaseModule（企业级写法）

更大的项目会将数据库从 AppModule 抽离到 **DatabaseModule**：

```ts
// database/database.module.ts
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PWD,
        database: process.env.DB_NAME,
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
  ],
})
export class DatabaseModule {}
```

AppModule：

```ts
@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
```

这是最常见的企业级架构。

---

# 🎯 最终总表（你可以直接作为笔记）

| 数据库                | NestJS 引入模块                  | 引入代码位置（必须）                                    | Driver  |
| ------------------ | ---------------------------- | --------------------------------------------- | ------- |
| MySQL              | TypeORM                      | `TypeOrmModule.forRoot({ type: 'mysql' })`    | mysql2  |
| PostgreSQL         | TypeORM                      | `TypeOrmModule.forRoot({ type: 'postgres' })` | pg      |
| MariaDB            | TypeORM                      | `type: 'mariadb'`                             | mariadb |
| SQLite             | TypeORM                      | `type: 'sqlite'`                              | sqlite3 |
| MongoDB (Mongoose) | MongooseModule               | `MongooseModule.forRoot()`                    | mongodb |
| MongoDB (TypeORM)  | TypeOrmModule                | `type: 'mongodb'`                             | mongodb |
| Prisma             | PrismaModule / schema.prisma | `provider="postgresql"`                       | pg      |
| Knex（手动）           | 自定义 module                   | `client: 'mysql2'`                            | mysql2  |

**通用规律：**

> **数据库连接永远在 “Module.imports 中的某个 DatabaseModule” 里引入，绝不会在 Controller / Service 中创建连接。**

---

# 📌 如果你希望，我可以继续帮你生成：

### ① 同时包含 MySQL + Redis + Mongo 的 DatabaseModule

### ② 生产级多环境（dev / test / prod）数据库配置

### ③ 企业级 Repository + Service + Module 模板（含事务）

你需要哪一套？
