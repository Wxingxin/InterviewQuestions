下面我把 **Middleware（日志 / traceId）在 NestJS 中的正确引入方式** 讲清楚，并给你 **能直接复制使用的完整代码模板**。
包含两种最常见的写法：

1. **全局 Middleware（main.ts 注册）——适合 TraceId、全链路日志**
2. **模块级 Middleware（Module.configure）——适合局部日志、鉴权预处理**

---

# ✅ 一、Middleware 应该放在哪里？

在 NestJS 中，Middleware 只能在两个地方注册：

---

## **① `main.ts` — 全局中间件（最常用于 traceId）**

特点：

* 对所有模块生效
* 在 Nest 的“Guard、Interceptor、Pipe”之前执行
* 适合加 traceId、记录 request、测速等跨全局需求

---

## **② 模块中通过 `configure(Consumer)` 注册**

```ts
export class XxxModule implements NestModule {
  configure(consumer: MiddlewareConsumer) { ... }
}
```

特点：

* 只对指定的控制器/路由生效
* 能控制顺序、path、method
* 适合模块专属日志、统计、权限前置逻辑

---

接下来直接给你两个“可复制使用”的方案。

---

# 🔥 二、方案 1：在 `main.ts` 使用“全局 traceId 日志中间件”

最常见，也是你要做分布式链路追踪时必备的方式。

---

## **1. 创建 TraceIdMiddleware**

```ts
// src/middleware/trace-id.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TraceIdMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    // 生成 Trace ID
    const traceId = uuidv4();

    // 挂载在 request 上
    req.traceId = traceId;

    // 也写入 Response Header（前端/运维可以直接看到）
    res.setHeader('X-Trace-Id', traceId);

    console.log(`[${traceId}] >>> Incoming Request: ${req.method} ${req.url}`);

    // 请求结束时也打印一下
    res.on('finish', () => {
      console.log(
        `[${traceId}] <<< Finished with status: ${res.statusCode}`,
      );
    });

    next();
  }
}
```

---

## **2. 在 `main.ts` 注册全局 Middleware**

```ts
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TraceIdMiddleware } from './middleware/trace-id.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 注册全局中间件（注意：use 接受实例）
  app.use(new TraceIdMiddleware().use);

  await app.listen(3000);
}
bootstrap();
```

---

## **3. 在 Controller 中获取 traceId（可选）**

```ts
@Get()
getHello(@Req() req) {
  return { traceId: req.traceId };
}
```

---

# ⚡ 三、方案 2：在某个模块内注册（推荐 ✓）

如果你只想让中间件在某个模块触发（例如 UsersModule），
或者你需要对某些路由生效，那么应该在模块里通过 `configure` 注册：

---

## **1. 中间件（和上面相同）**

```ts
// src/middleware/logging.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    console.log(`--> ${req.method} ${req.url}`);
    next();
  }
}
```

---

## **2. 在模块中引入 (UsersModule 举例)**

```ts
// src/users/users.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { LoggingMiddleware } from '../middleware/logging.middleware';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes('users'); // 匹配路由
  }
}
```

---

## **3. 精准控制（更细粒度）**

```ts
consumer
  .apply(LoggingMiddleware)
  .forRoutes(
    { path: 'users', method: RequestMethod.GET },
    { path: 'users/:id', method: RequestMethod.PUT },
  );
```

也可以：

```ts
consumer.apply(LoggingMiddleware).exclude(
  { path: 'users/login', method: RequestMethod.POST },
).forRoutes(UsersController);
```

---

# 🎯 四、中间件执行顺序（和其他 Nest 组件关系）

NestJS 请求链路顺序：

```
Middleware → Guard → Interceptor (before) → Pipe → Controller → Service
           → Interceptor (after) → Exception Filter
```

也就是说：

* **TraceId** 一般要放在最前面 → 方便在后续 Guard/Service/Exception 里统一使用
* 中间件不支持 DI 注入其他 Provider（但可以通过 class + constructor 注入）
* 强业务逻辑不要放中间件（推荐放 Guard/Interceptor）

---

# 🧩 五、最终给你一个推荐实践（可直接套用）

### **推荐结构**

```
src/
  middleware/
    trace-id.middleware.ts
    logging.middleware.ts
  app.module.ts
  main.ts
```

### `main.ts`（全局 TraceId）

```ts
app.use(new TraceIdMiddleware().use);
```

### 模块级（局部日志）

```ts
consumer.apply(LoggingMiddleware).forRoutes(UsersController)
```

### 在 Controller / Service 中取 traceId

```ts
constructor(@Inject(REQUEST) private req: any) {}

this.req.traceId
```

---

# ☑️ 结论：最佳实践

| 功能                 | 中间件放哪里？         | 原因       |
| ------------------ | --------------- | -------- |
| traceId、全链路日志、全局统计 | `main.ts`       | 所有请求最先经过 |
| 某模块专属日志、按路由过滤      | 模块中 `configure` | 执行范围可控   |
| 鉴权、权限、角色           | Guard           | 更规范      |
| 响应包装、耗时统计          | Interceptor     | 更优雅      |
| 请求验证               | Pipe            | DTO 级别   |

---

如果你愿意，我可以帮你：

* 把 TraceId 注入 **Logger、Service、ExceptionFilter** 全链路
* 做一个 **全链路日志增强版（含 request-body、响应时间、异常栈）**

你要不要我也顺便把这个增强版给你？
