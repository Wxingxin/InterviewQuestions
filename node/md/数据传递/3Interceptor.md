下面我把 **Interceptor（拦截器）放在哪里引入、怎么引入、完整使用示例** 一次性讲清楚，并给你 **全局 / 控制器级 / 方法级 / 自定义拦截器** 的可复制模板。

这篇内容是你在 NestJS 里掌握“请求生命周期”的关键拼图之一（Middleware → Guard → Interceptor → Pipe → Controller）。

---

# 🚀 一、Interceptor 的作用是什么？

拦截器的能力非常强，最常用于：

* **请求/响应日志**（统一格式）
* **接口耗时统计**
* **响应数据包装（data → { code, msg, data }）**
* **异常捕获（类似 AOP）**
* **缓存**（CacheInterceptor）

它在执行顺序中的位置：

```
Middleware → Guard → **Interceptor(before)** → Pipe 
→ Controller → Service 
→ **Interceptor(after)** → Exception Filter
```

---

# 🌈 二、Interceptor 的 3 个引入方式（完整示例）

## ✅ 1️⃣ 全局引入（最常用：全局响应包装、耗时统计）

### **main.ts 中引入全局 Interceptor**

```ts
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局拦截器
  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(3000);
}
bootstrap();
```

---

## 📌 2️⃣ 控制器级引入（只对某个 Controller 生效）

```ts
// users.controller.ts
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';

@Controller('users')
@UseInterceptors(LoggingInterceptor)  // 控制器级
export class UsersController {
  @Get()
  getUsers() {
    return [{ id: 1, name: 'Alice' }];
  }
}
```

---

## 🎯 3️⃣ 方法级引入（只对某个接口生效）

```ts
@Get(':id')
@UseInterceptors(LoggingInterceptor)
getUserDetail() {
  return { id: 1, name: 'Alice' };
}
```

---

# 🔥 三、Interceptor 的完整代码示例（可复制使用）

下面给你三个企业级常用拦截器：**日志拦截器、响应包装拦截器、耗时统计拦截器**。

---

# 📘 示例 1：请求/响应日志 Interceptor（经典）

```ts
// src/interceptors/logging.interceptor.ts
import {
  NestInterceptor,
  ExecutionContext,
  Injectable,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;

    const now = Date.now();
    console.log(`[REQ] ${method} ${url}`);

    return next.handle().pipe(
      tap(() => {
        console.log(`[RES] ${method} ${url} - ${Date.now() - now}ms`);
      }),
    );
  }
}
```

特点：

* Controller 执行前打印请求
* Controller 执行后打印响应耗时

---

# 📘 示例 2：响应统一包装 Interceptor（返回 data → { code, msg, data }）

```ts
// src/interceptors/transform.interceptor.ts
import {
  NestInterceptor,
  ExecutionContext,
  Injectable,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return {
          code: 0,
          msg: 'success',
          data,
        };
      }),
    );
  }
}
```

可以在全局启用，让所有响应结构一致。

---

# 📘 示例 3：接口耗时统计 Interceptor

```ts
// src/interceptors/timeout.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, timeout } from 'rxjs';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(timeout(3000)); // 超时：3 秒
  }
}
```

---

# 🌍 四、在 AppModule 中用 APP_INTERCEPTOR（全局）

你也可以用 `APP_INTERCEPTOR`（推荐）：

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
```

与 `app.useGlobalInterceptors()` 一样，但：

* **支持依赖注入（DI）**
* **推荐用于生产项目**

---

# 🍭 五、Interceptor 引入方式对比（最佳实践）

| 需求         | 引入方式                       |
| ---------- | -------------------------- |
| 全局响应格式统一   | APP_INTERCEPTOR（AppModule） |
| 全局请求/响应日志  | APP_INTERCEPTOR（AppModule） |
| 只对某个业务模块生效 | @UseInterceptors()（模块级）    |
| 只对某个接口生效   | 方法级 @UseInterceptors()     |
| 超时控制       | APP_INTERCEPTOR（全局）        |

---

# 🎁 六、终极模板（企业级链路整合）

想要一条完整链路包含：

* traceId（Middleware）
* Guard（JWT 驱动的鉴权）
* Interceptor（响应包装 + 耗时统计）
* Pipe（DTO 校验）
* Filter（全局异常格式化）

我可以给你：

👉 **一个企业级的 NestJS Request Pipeline 模板：从进入到返回，每一层全链路可追踪**
（比如 traceId 自动透传到 Interceptor、Service、ExceptionFilter）

如果你需要，我可以直接帮你生成全套代码结构。
在 **NestJS** 中引入 *Interceptor（拦截器）* 的方式，就像在一座多层楼的楼梯口安插守卫：你可以把它放在“门口”（单个方法）、“楼层”（控制器）、或“整栋大楼”（全局）。下面我给你一个清晰、好消化的总览。

---

# 🧭 Interceptor 应该放在哪里？怎么引入？

## 1. **在单个方法上使用（最小范围）**

```ts
import { UseInterceptors } from '@nestjs/common';
import { MyInterceptor } from './my.interceptor';

@Controller('cats')
export class CatsController {
  @Get()
  @UseInterceptors(MyInterceptor)
  findAll() {
    return [];
  }
}
```

📌 *这种方式像在单个 API 门口安排一个“守望者”。适用于只想对某个方法做处理的情况。*

---

## 2. **在整个 Controller 上使用**

```ts
import { UseInterceptors } from '@nestjs/common';
import { MyInterceptor } from './my.interceptor';

@UseInterceptors(MyInterceptor)
@Controller('cats')
export class CatsController {
  @Get()
  findAll() {
    return [];
  }
}
```

📌 *等于把守卫放在整层楼入口，整个 controller 的所有方法都会经过它。*

---

## 3. **在全局使用（应用层级）**

### 方法 A：在 `main.ts` 中绑定

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new MyInterceptor());
  await app.listen(3000);
}
bootstrap();
```

📌 *这是最大范围，全应用通用，就像在整座大厦正门放一个检查员。*

---

### 方法 B：使用 DI 注入（推荐方式）

如果你的 Interceptor 需要依赖注入（比如 Service）：

```ts
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MyInterceptor } from './my.interceptor';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MyInterceptor,
    },
  ],
})
export class AppModule {}
```

📌 *这种方式允许拦截器依赖其它服务，比手动 `new` 更干净。*

---

# 🧩 Interceptor 文件怎么写？

给你一个最基础的模板：

```ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class MyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before ...');

    return next
      .handle()
      .pipe(
        tap(() => console.log('After ...')),
      );
  }
}
```

---

# 🍃 小结

| 引入方式         | 使用位置  | 代码装饰器                         |
| ------------ | ----- | ----------------------------- |
| 方法级          | 方法前   | `@UseInterceptors()`          |
| Controller 级 | 控制器类上 | `@UseInterceptors()`          |
| 全局（main.ts）  | 整个应用  | `app.useGlobalInterceptors()` |
| 全局（DI 注入）    | 整个应用  | `APP_INTERCEPTOR` provider    |

---

如果你愿意，我可以继续帮你写一个 **日志拦截器、响应包装拦截器（如统一格式返回）** 或 **异常拦截器**，甚至做一个你项目可以直接用的模板。
要不要来一个？ 🍤
