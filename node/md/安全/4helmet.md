我给你按“三件套 + 实战模板”的结构整理一下：**Helmet、CORS、CSRF 在 NestJS 里的知识点 + 用法 + 经典代码**，你直接照抄改配置就能上。

---

## 一、三个东西分别解决什么问题？

### 1. Helmet：安全 HTTP 头

* 是一个中间件集合，用来帮你自动设置各种安全相关的 HTTP header，比如：

  * `X-Frame-Options`（防点击劫持）
  * `X-Content-Type-Options`
  * `Strict-Transport-Security`
  * `Content-Security-Policy`（CSP，防 XSS 等）([NestJS 文档][1])
* Nest 直接集成：在 `main.ts` 里 `app.use(helmet())` 即可。([ru-nestjs-docs.netlify.app][2])

### 2. CORS：前后端跨域访问控制

* 解决“前端域名 A 调后端域名 B 被浏览器拦截”的问题
* Nest 里通过 `app.enableCors()` 开启，或在 `NestFactory.create(AppModule, { cors: ... })` 里配置([NestJS 文档][3])

### 3. CSRF：跨站请求伪造防护

* 防止“用户已经登录 A 网站时，被恶意页面偷偷发 POST 请求到 A”这种情况
* Nest 官方现在推荐：

  * Express：用 `csrf-csrf` 包（早期文档是 `csurf`）([NestJS 文档][4])
  * Fastify：用 `@fastify/csrf-protection`([NestJS 文档][4])

---

## 二、Helmet：NestJS 中的完整使用模板

### 1. 安装

```bash
npm i helmet
```

### 2. `main.ts` 中开启

**Express 适配器（默认）**：

```ts
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 最基础的 Helmet
  app.use(helmet());

  await app.listen(3000);
}
bootstrap();
```

官方文档就是这么用的，然后你可以按需增强配置。([NestJS 文档][1])

### 3. 带 CSP 的高级配置示例

如果你还要加内容安全策略（CSP）：

```ts
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.example.com'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        imgSrc: ["'self'", 'data:', 'https://images.example.com'],
        connectSrc: ["'self'", 'https://api.example.com'],
      },
    },
    referrerPolicy: { policy: 'no-referrer' },
  }),
);
```

> 注意：CSP 配置不对会导致你的前端静态资源加载失败，通常要结合你实际前端资源域名慢慢调。([helmetjs.github.io][5])

### 4. Fastify + Helmet

如果你用 Fastify 适配：

```bash
npm i fastify-helmet
```

```ts
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyHelmet from '@fastify/helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.register(fastifyHelmet); // 或 fastifyHelmet({ ...options })

  await app.listen(3000);
}
bootstrap();
```

([Dev Genius][6])

---

## 三、CORS：从“能用”到“生产安全配置”

### 1. 一行启用（开发环境）

```ts
// main.ts
const app = await NestFactory.create(AppModule);
app.enableCors();
```

这会使用默认的 cors 配置，允许所有域跨域，适合本地开发。([NestJS 文档][3])

### 2. 创建时配置 cors

```ts
const app = await NestFactory.create(AppModule, {
  cors: true, // 等价于 app.enableCors()
});
```

或：

```ts
const app = await NestFactory.create(AppModule, {
  cors: {
    origin: true,           // 反射请求 origin
    credentials: true,
  },
});
```

([NestJS 文档][3])

### 3. 生产推荐配置（只允许指定域名）

```ts
const app = await NestFactory.create(AppModule);

app.enableCors({
  origin: [
    'https://your-frontend.com',
    'https://admin.your-frontend.com',
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  exposedHeaders: ['Content-Disposition'],
  credentials: true, // 如果你用 cookie / 需要带认证信息
  maxAge: 86400,
});
```

> `origin` 可以传数组、正则、函数；有多域名就用数组（官方 CORS 库支持）([Reddit][7])

### 4. 常见 CORS 报错排查思路

典型报错：`No 'Access-Control-Allow-Origin' header is present ...`

检查：

1. `app.enableCors()` 是否在 `app.listen()` 之前执行
2. `origin` 是否与你浏览器地址一致（包含端口）
3. 预检请求（OPTIONS）是否被框架/网关拦截掉([DEV Community][8])

---

## 四、CSRF：NestJS 的典型实现方式

### 0. 先想清楚：你需不需要 CSRF？

* **如果是前后端分离 + JWT 放在 `Authorization: Bearer` 头里**：

  * 通常不用 CSRF（因为浏览器不会自动带上 Authorization 头）
* **如果使用 Cookie 保存 Session / JWT，并且允许跨站点发请求**：

  * 就要认真考虑 CSRF 防护（例如管理后台 + Cookie 登录）([StackHawk, Inc.][9])

下面以 Express 适配为例：

---

### 1. 用 `csrf-csrf`（Nest 官方推荐新方案）

官方文档推荐：([NestJS 文档][4])

```bash
npm i csrf-csrf cookie-parser express-session
```

#### (1) `main.ts` 配置中间件

```ts
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { doubleCsrf } from 'csrf-csrf';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. 先启用 cookie & session（csrf-csrf 需要）
  app.use(cookieParser());
  app.use(
    session({
      secret: 'very-secret-session-key',
      resave: false,
      saveUninitialized: false,
      cookie: { httpOnly: true, secure: false }, // 生产环境 secure 要改成 true + HTTPS
    }),
  );

  // 2. 配置 csrf-csrf
  const {
    doubleCsrfProtection,
    generateToken,
    invalidCsrfTokenError,
  } = doubleCsrf({
    getSecret: (req) => req.secret,               // 从 session 拿 secret
    cookieName: 'x-csrf-token',                   // 存 token 的 cookie 名
    cookieOptions: { sameSite: 'lax', secure: false },
    getTokenFromRequest: (req) =>
      req.headers['x-csrf-token'] as string | undefined, // 前端发来的 header
  });

  // 3. 提供一个获取 CSRF token 的接口
  app.use('/csrf-token', (req, res, next) => {
    const csrfToken = generateToken(res, req);
    return res.json({ csrfToken });
  });

  // 4. 把 CSRF 保护用作全局中间件（可根据需要只保护有状态的路由）
  app.use((req, res, next) => {
    doubleCsrfProtection(req, res, (err) => {
      if (err && err === invalidCsrfTokenError) {
        return res.status(403).json({ message: 'Invalid CSRF token' });
      }
      return next();
    });
  });

  await app.listen(3000);
}
bootstrap();
```

前端流程（典型）：

1. 首先调用 `GET /csrf-token`，拿到 `{ csrfToken }`
2. 后续有状态操作（POST/PUT/DELETE）请求时，在 header 中带上：

```http
X-CSRF-Token: <csrfToken>
```

---

### 2. 老方案：`csurf`（文档早期版本 & 仍然很多人用）

> **注意**：官方新文档改成 `csrf-csrf` 了，但大量网上文章还是 `csurf`，遇到老项目可能会看到。([8-0-0--docs-nestjs.netlify.app][10])

```bash
npm i csurf cookie-parser
```

```ts
// main.ts (Express)
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.use(
    csurf({
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
      },
    }),
  );

  // 暴露一个返回 csrfToken 的接口
  app.use('/csrf-token', (req, res) => {
    // @ts-ignore
    const token = req.csrfToken();
    res.json({ csrfToken: token });
  });

  await app.listen(3000);
}
```

常见错误：`invalid csrf token` + CORS 报错——通常是 CORS 没设置 `credentials: true` 或 cookie 没带上。([Stack Overflow][11])

---

### 3. Fastify + `@fastify/csrf-protection`

```bash
npm i @fastify/csrf-protection
```

```ts
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCsrf from '@fastify/csrf-protection';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // 在注册 session / cookie 插件后再注册 CSRF
  await app.register(fastifyCsrf);

  await app.listen(3000);
}
bootstrap();
```

([NestJS 文档][4])

---

## 五、三者联动的“安全版 main.ts” 模板

下面给你一个 **集成 Helmet + CORS + CSRF（基于 csrf-csrf）** 的 Express 版本大模板，你可以直接改成自己的域名 / 策略：

```ts
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { doubleCsrf } from 'csrf-csrf';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * 1. CORS - 只允许指定前端域访问
   */
  app.enableCors({
    origin: ['https://frontend.example.com', 'https://admin.example.com'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-CSRF-Token',
    ],
    credentials: true, // 配合 cookie/session
  });

  /**
   * 2. Helmet - 安全 HTTP header
   */
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:'],
        },
      },
      referrerPolicy: { policy: 'no-referrer' },
    }),
  );

  /**
   * 3. Cookie + Session（给 CSRF 用）
   */
  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'session-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      },
    }),
  );

  /**
   * 4. CSRF（双重提交 token 模式）
   */
  const {
    doubleCsrfProtection,
    generateToken,
    invalidCsrfTokenError,
  } = doubleCsrf({
    getSecret: (req) => (req as any).secret,
    cookieName: 'x-csrf-token',
    cookieOptions: {
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
    getTokenFromRequest: (req) =>
      (req.headers['x-csrf-token'] as string | undefined) ||
      (req.body && (req.body._csrf as string | undefined)),
  });

  // 获取 CSRF token 的接口
  app.use('/csrf-token', (req, res) => {
    const csrfToken = generateToken(res, req);
    res.json({ csrfToken });
  });

  // 全局 CSRF 保护
  app.use((req, res, next) => {
    doubleCsrfProtection(req, res, (err) => {
      if (err && err === invalidCsrfTokenError) {
        return res.status(403).json({ message: 'Invalid CSRF token' });
      }
      return next();
    });
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
```

---

## 六、实践中的组合建议

1. **Helmet：强烈建议所有 Nest 项目都开**

   * 把默认配置先打开，然后根据前端情况再微调 CSP

2. **CORS：开发 `app.enableCors()`，生产要“白名单 + credentials 控制”**

   * 多域名 + cookie 场景注意 `credentials: true` 和 `origin` 一致

3. **CSRF：只在“cookie+会话型认证”的项目中启用**

   * 比如传统 SSR + session，或用 cookie 存 JWT 的 SPA
   * 纯 Bearer Token（Authorization 头）方案一般不需要 CSRF，但是更要注意 XSS

---

如果你愿意，可以把你现在的 `main.ts` 和项目场景（比如“前后端端口/域名、用 cookie 还是 JWT”）发给我，我可以帮你改成一份**更贴合你项目的 Helmet + CORS + CSRF 安全版启动文件**。

