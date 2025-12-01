下面我把 **NestJS 的 Middleware（中间件）** 从“它是什么”到“如何使用、在哪里引入、常见写法、最佳实践、注意点、进阶技巧” **一次性完整讲透**，你读完就能彻底掌握这一块 🔧✨
（内容会很全，但我尽量写得像一张能看懂的地图）

---

# 🌀 一、Middleware 是什么？

在 NestJS 中，**Middleware 就是路由前置函数**。
它会在请求真正到达 Controller 之前先执行一遍。

你可以把它看成：

> “守在路由门口的小门神，凡是经过这里的请求，都会先让它过目。”

它可以做的事情包括：

* 日志（log request）
* 权限检查（简单场景）
* 解析或改写请求体 / headers
* 设置特定 header
* 限流（简单版）
* 请求追踪（trace id）
* 黑名单过滤
* 调用第三方工具（如 session、cookie-parser、body-parser）

本质上和 Express / Koa 的 middleware 类似，因为 Nest 内部默认用 Express（也可以切换到 Fastify）。

---

# 🌱 二、Middleware 的写法（3 种方式）

## **方式 1：类式中间件（最常用）**

```ts
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    console.log(`Request... ${req.method} ${req.url}`);
    next();
  }
}
```

特点：

* 可依赖注入（因为有 `@Injectable()`）
* 最常用、最推荐

---

## **方式 2：函数式中间件**

```ts
export function logger(req, res, next) {
  console.log('Request...');
  next();
}
```

特点：
轻量，无法注入服务（除非另想办法）。适合非常简单的逻辑。

---

## **方式 3：全局中间件（bootstrap 中应用）**

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(logger); // 直接使用函数式中间件
  await app.listen(3000);
}
```

特点：

* 作用域是全局所有路由
* 不需要在模块里配置

---

# 📦 三、Middleware 要在哪里引入？

这是关键部分，很多人刚开始容易搞不清。

## **Middleware 的入口：Module 文件**

类式或函数式 Middleware 要在模块中配置：

> **只能在实现了 `NestModule` 的模块里使用**
> 通过 `configure(consumer: MiddlewareConsumer)` 引入

示例：

```ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './logger.middleware';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(UsersController);  // 对整个 Controller 生效
  }
}
```

---

# 🎯 四、MiddlewareConsumer 的用法大全（所有知识点）

你需要知道的 100% 在这里。

👇👇👇

---

## **1）apply(...middlewares)**

可以一次注册多个：

```ts
consumer.apply(LoggerMiddleware, AuthMiddleware)
```

---

## **2）forRoutes(...) —— 设置 Middleware 的作用范围**

### ⭐ 对控制器

```ts
.forRoutes(UsersController)
```

表示 UsersController 下的所有路由都执行。

---

### ⭐ 对具体路由路径

```ts
.forRoutes('users')
```

匹配：

* GET /users
* POST /users
* ... 所有 /users 路由

---

### ⭐ 对路由配置对象（路径 + method）

```ts
import { RequestMethod } from '@nestjs/common';

.forRoutes({
  path: 'users',
  method: RequestMethod.GET,
})
```

匹配：GET /users

---

### ⭐ 同时匹配多个路由

```ts
.forRoutes(
  UsersController,
  { path: 'cats', method: RequestMethod.ALL },
)
```

---

## **3）exclude() —— 排除路由**

这才能做到“除了 X 全用这个中间件”。

🌰：

```ts
consumer
  .apply(LoggerMiddleware)
  .exclude(
    { path: 'users/login', method: RequestMethod.POST },
    'users/public',
  )
  .forRoutes(UsersController);
```

---

# 🚀 五、全局 Middleware（AppModule 以外的使用方式）

如果你需要**真正的全局中间件**，有两种方式：

---

## **方式 1：main.ts 写 `app.use()`（最常用）**

```ts
app.use(LoggerMiddleware); // 函数式或类式都行
```

注意：这里使用的是 **函数形式**，所以类式中间件要变成实例：

```ts
app.use(new LoggerMiddleware().use);
```

---

## **方式 2：Module 中的 consumer + forRoutes('*')**

```ts
consumer.apply(LoggerMiddleware).forRoutes('*');
```

---

# 🍱 六、Middleware 和 Guard / Interceptor 的区别（超重要）

很多人容易混淆，这里给你一个“脑内导航图”：

| 特性         | Middleware             | Guard                  | Interceptor      |
| ---------- | ---------------------- | ---------------------- | ---------------- |
| 触发时机       | 路由前（最早）                | 路由前，但在 middleware 之后   | 控制器前后            |
| 能否访问 DI？   | 类式可，函数式不可              | 可以                     | 可以               |
| 常用用途       | 日志、解析、Header 操作、简易权限检查 | 权限控制、角色判断、token 校验     | 响应格式包裹、异常映射、数据转换 |
| 是否能直接返回响应？ | 可以                     | 可以                     | 可以               |
| 了解路由信息？    | 不太方便                   | 特别方便（ExecutionContext） | 特别方便             |

一句话：

* **Middleware**：是 Express/HTTP 层面的“最底层入口过滤器”
* **Guards**：是用于“是否允许进入 Controller 的守门人”
* **Interceptors**：是“在进入/出去 controller 过程中加工数据的魔术师”

---

# 🧨 七、常见的 Middleware 场景示例

这里给你几个经典 case（实战必用）：

---

## **1）记录请求日志**

```ts
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req, res, next) {
    const now = Date.now();
    res.on('finish', () => {
      console.log(
        `${req.method} ${req.originalUrl} - ${Date.now() - now}ms`,
      );
    });
    next();
  }
}
```

---

## **2）添加 requestId（请求链追踪）**

```ts
req.requestId = crypto.randomUUID();
next();
```

配合日志做链路追踪。

---

## **3）简单的 IP 黑名单**

```ts
const blacklist = ['1.2.3.4'];
if (blacklist.includes(req.ip)) {
  return res.status(403).send('Forbidden');
}
next();
```

---

## **4）手动解析 Cookie**

```ts
req.cookies = cookie.parse(req.headers.cookie || '');
next();
```

---

## **5）应用第三方库（cookie-parser / body-parser）**

在 main.ts：

```ts
import * as cookieParser from 'cookie-parser';

app.use(cookieParser());
```

NestJS 兼容 Express 中间件，你能用的大概率能直接套。

---

# 🧩 八、Middleware 在 Module 中如何组织？

目录一般这么放：

```
users/
 ├── users.controller.ts
 ├── users.service.ts
 ├── middleware/
 │     └── logger.middleware.ts
 └── users.module.ts
```

在 `users.module.ts` 引入：

```ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(UsersController);
  }
}
```

---

# 🧱 九、Middleware 的最佳实践

## 1. 尽量使用**类式**中间件（可依赖注入）

函数式中间件轻便，但无法注入 service，不利于维护。

---

## 2. 做权限 / token 校验最好使用 Guard，不要用中间件

因为：

* Guard 更懂路由上下文
* Guard 自动集成了角色、认证逻辑
* Middleware 做复杂权限会变得难维护

中间件更适合简单过滤。

---

## 3. 全局中间件推荐写在 `main.ts`

例如：

```ts
app.use(helmet());
app.use(cors());
```

---

## 4. 避免在中间件里写异步逻辑阻塞 next()

必须保证：

```ts
await something();
next();
```

否则请求会 hang 住。

---

# 🧭 十、总结：Middleware 的学习地图

一个完整思维导图：

```
Middleware
 ├── 定义：路由前执行的前置函数
 ├── 三种写法
 │     ├── 类式（推荐）
 │     ├── 函数式
 │     └── 全局 app.use()
 ├── 引入位置（非常关键）
 │     ├── 模块：implements NestModule
 │     │     └── configure(consumer)
 │     └── main.ts：app.use()
 ├── consumer API
 │     ├── apply()
 │     ├── forRoutes()
 │     └── exclude()
 ├── 与 Guards / Interceptors 的区别
 ├── 常见场景
 │     ├── 日志
 │     ├── cookie 解析
 │     ├── simple auth
 │     ├── ip control
 └── 最佳实践
```

---

如果你愿意，我还能帮你：

* 写一个 **完整可运行的 Middleware Demo 项目**
* 画一个视觉化流程图（请求 → 中间件 → Guard → Pipe → Controller → Interceptor）
* 讲 Middleware 与 Express/Fastify 的关系

你想继续深入哪一块？
