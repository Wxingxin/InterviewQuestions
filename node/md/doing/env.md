这里我们就专门聊：**应用在不同环境（dev/test/staging/prod 等）下如何用 NestJS 做配置管理**，给你一套「知识点大全 + 使用大全 + 经典代码模板」，照抄改名就能用。

---

## 一、为什么要按环境拆配置？

常见环境：

* `local / development`：本地开发
* `test`：自动化测试
* `staging`：预发布
* `production`：生产

不同环境典型差异：

* 数据库地址、账号密码
* 第三方服务（支付、短信、OSS）的 key / endpoint
* 日志级别（dev 输出 debug，prod 只输出 warn/error）
* CORS/Helmet/CSRF 的严格程度
* 端口、特性开关（feature flag）

核心目标：

> **同一套代码，通过环境变量 / 配置文件切换行为，而不是改源码。**

Nest 官方推荐用 `@nestjs/config` 模块来做这一切。([NestJS 文档][1])

---

## 二、基础：用 ConfigModule 读取 `.env`（单环境）

### 1. 安装

```bash
npm i @nestjs/config
```

### 2. 添加到 AppModule

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // 全局可用，不用每个模块再 imports 一次
    }),
  ],
})
export class AppModule {}
```

`forRoot()` 会自动加载项目根目录 `.env` 文件，并和 `process.env` 合并，之后就可以通过 `ConfigService` 读取。([NestJS 文档][1])

### 3. 在业务里使用

```ts
// some.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SomeService {
  constructor(private readonly config: ConfigService) {}

  getDbUser() {
    return this.config.get<string>('DATABASE_USER');
  }

  getPort() {
    // 第二个参数是默认值
    return this.config.get<number>('PORT', 3000);
  }
}
```

---

## 三、多环境：按 NODE_ENV 加载不同 .env 文件

### 1. 约定 env 文件命名

在项目根目录下：

```text
.env.development
.env.test
.env.staging
.env.production
```

内容示例：

```dotenv
# .env.development
NODE_ENV=development
PORT=3000
DATABASE_URL=postgres://dev:pass@localhost:5432/mydb
```

```dotenv
# .env.production
NODE_ENV=production
PORT=8080
DATABASE_URL=postgres://prod:pass@10.0.0.1:5432/mydb
```

### 2. 根据 `NODE_ENV` 动态选择 envFilePath

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

const env = process.env.NODE_ENV || 'development';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${env}`, // 关键：根据环境加载不同文件
    }),
  ],
})
export class AppModule {}
```

`envFilePath` 支持数组（可以做“公共 + 环境覆盖”）([NestJS 文档][1])

```ts
ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: ['.env.common', `.env.${env}`],
});
```

### 3. package.json 中配置启动脚本

```json
{
  "scripts": {
    "start:dev": "cross-env NODE_ENV=development nest start --watch",
    "start:test": "cross-env NODE_ENV=test nest start",
    "start:staging": "cross-env NODE_ENV=staging node dist/main.js",
    "start:prod": "cross-env NODE_ENV=production node dist/main.js"
  }
}
```

> Windows 下建议用 `cross-env` 来设置环境变量。

---

## 四、进阶：使用配置文件 + 命名空间（更干净）

项目结构推荐：

```text
src/
  config/
    app.config.ts
    database.config.ts
    auth.config.ts
  app.module.ts
```

### 1. 定义配置文件（命名空间风格）

```ts
// src/config/app.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  isProd: process.env.NODE_ENV === 'production',
}));
```

```ts
// src/config/database.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL,
  maxConnections: parseInt(process.env.DB_MAX_CONN ?? '10', 10),
}));
```

`registerAs('database', ...)` 会创建一个名字为 `database` 的配置命名空间。([NestJS 文档][1])

### 2. 在 ConfigModule 中加载

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import dbConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      load: [appConfig, dbConfig],  // 关键
    }),
  ],
})
export class AppModule {}
```

`load` 里的每一个函数都会生成一个 config 对象并挂到 ConfigService 上。([NestJS 文档][1])

### 3. 使用命名空间配置

```ts
// 使用 ConfigService + dot notation
const dbUrl = this.config.get<string>('database.url');

// 获取整个命名空间对象
interface DatabaseConfig {
  url: string;
  maxConnections: number;
}

const dbConfig = this.config.get<DatabaseConfig>('database');
```

> 这样业务代码就不再直接写 `process.env`，只面对结构化的配置。([NestJS 文档][1])

---

## 五、在 main.ts 和各模块中使用 ConfigService

### 1. 在 main.ts 里用配置（端口 / CORS 等）

```ts
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const port = config.get<number>('app.port', 3000);
  const isProd = config.get<boolean>('app.isProd', false);

  app.enableCors({
    origin: isProd ? 'https://your-prod-domain.com' : true,
    credentials: true,
  });

  await app.listen(port);
}
bootstrap();
```

Nest 文档也推荐在 `main.ts` 中用 `app.get(ConfigService)` 获取配置。([NestJS 文档][1])

### 2. 在动态模块中用配置：典型例子（数据库 / JWT）

#### 2.1 TypeORM / Mongoose 连接配置

```ts
// database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('database.url'),
        autoLoadEntities: true,
        synchronize: config.get('app.env') !== 'production',
      }),
    }),
  ],
})
export class DatabaseModule {}
```

#### 2.2 JWT 配置

```ts
// auth.module.ts
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('auth.jwtSecret'),
        signOptions: {
          expiresIn: config.get<string>('auth.jwtExpiresIn', '1h'),
        },
      }),
    }),
  ],
})
export class AuthModule {}
```

用 `registerAsync + useFactory` 可以让任何模块根据当前环境动态配置。([NestJS 文档][1])

---

## 六、环境变量校验：启动时就把问题暴露出来

**最佳实践：** 启动时检查环境变量，不合法就直接报错退出。

Nest 的 ConfigModule 支持两种校验方式，常用的是 Joi 模式。([NestJS 文档][1])

### 1. 安装 Joi

```bash
npm i joi
```

### 2. 在 ConfigModule.forRoot 中使用 `validationSchema`

```ts
// app.module.ts
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'test', 'staging', 'production')
          .default('development'),
        PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().uri().required(),
        JWT_SECRET: Joi.string().min(32).required(),
      }),
    }),
  ],
})
export class AppModule {}
```

如果 `.env` 里缺了某个 `required()` 的字段，应用会在启动阶段直接抛错，这比运行时才发现要安全很多。([NestJS 文档][1])

---

## 七、工程实践中的几个关键点

1. **绝不要把 .env 提交到 Git**

   * 把 `.env*`（或至少 `.env.production`）写进 `.gitignore`
   * 生产环境用 CI/CD 或云环境变量管理来注入环境变量([Medium][2])

2. **所有配置都走 ConfigService，不直接在业务里用 process.env**

   * 方便统一管理 & 单元测试
   * 可以加默认值、类型提示、校验

3. **环境区分只出现在“边界”**

   * 例如 main.ts（端口、CORS）、DatabaseModule、AuthModule 等
   * 业务 service/controller 只拿到「已经按环境处理好的配置」

4. **按环境控制特性**

   * dev 开启 swagger / swagger-ui
   * prod 关闭 swagger，只开放必要的健康检查接口等

   示例：

   ```ts
   // main.ts
   import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

   const configService = app.get(ConfigService);
   const isProd = configService.get('app.isProd', false);

   if (!isProd) {
     const swaggerConfig = new DocumentBuilder()
       .setTitle('API')
       .setVersion('1.0')
       .build();
     const document = SwaggerModule.createDocument(app, swaggerConfig);
     SwaggerModule.setup('api', app, document);
   }
   ```

---

## 八、一个可直接拿去用的“多环境完整模板”小结

> 最小可用版本：
>
> * `ConfigModule.forRoot({ isGlobal, envFilePath, load, validationSchema })`
> * config 目录里若干 `registerAs` 配置文件
> * main.ts & 动态模块里通过 ConfigService 决定行为

你可以按下面这个组合快速起一个项目：

1. 建 `.env.development`、`.env.production` 等
2. `ConfigModule.forRoot({ isGlobal: true, envFilePath: \`.env.${NODE_ENV}`, load: [...] , validationSchema })`
3. 创建 `app.config.ts`、`database.config.ts` 等命名空间配置
4. 所有需要环境感知的模块（DB/JWT/Throttle/Helmet/CORS）都接入 `ConfigService`

---

如果你愿意，把你当前项目的 `app.module.ts` 和 `main.ts`（或你现在是怎么用 `.env` 的）贴出来，我可以帮你改成一份**完整的多环境配置版模板**，顺便一起梳理哪些参数该放进环境变量。

