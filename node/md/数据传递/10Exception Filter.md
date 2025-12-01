下面我把 **NestJS 的 Exception Filter（异常过滤器）到底在哪里引入、怎么用、全局/模块/控制器/方法级别的用法** 一次性讲透，并附上 **可复制级完整代码模板**。

这是 Nest 请求管线中的最后一环，也是企业级项目必用的一层。

---

# 🚀 一、Exception Filter 能做什么？

Exception Filter 用来处理：

* 全局统一错误格式
* 捕获某类错误（如业务异常）
* 转换 HTTP 状态码
* 记录错误日志
* 处理未知异常

在请求流程中执行顺序：

```
Middleware
Guard
Interceptor
Pipe
Controller / Service 发生异常
↓
Exception Filter（最后处理）
```

---

# 🌈 二、Exception Filter 的四种引入方式

Nest 提供 **四种级别**：

1. **全局异常过滤器（最常用）**
2. **模块级异常过滤器**
3. **控制器级异常过滤器**
4. **方法级异常过滤器**

全部给你示例。

---

# 🎯 三、先写一个自定义 Exception Filter（可复用）

这个 Filter 会把所有异常转成统一格式 `{ code, message, timestamp }`

```ts
// src/common/filters/http-exception.filter.ts

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : 500;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    response.status(status).json({
      code: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

---

# 🌍 四、Exception Filter 的四种引入方式（全部示例）

---

# 1️⃣ **全局引入（最常用）**

有两种写法：

---

## ✔️ 写法 1：在 `main.ts` 中使用

```ts
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}
bootstrap();
```

优点：

* 简单直接
* 适合有构造参数为无依赖 Filter

---

## ✔️ 写法 2：在 AppModule 中用 `APP_FILTER`（推荐）

支持依赖注入，更适合企业级项目。

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
```

优点：

* 支持 DI（可以在 Filter 里注入 Logger、Config 等）
* 可测试性更强
* 官方推荐方式

---

# 2️⃣ **模块级引入**

仅对该模块内的 Controller 生效。

```ts
// users.module.ts
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class UsersModule {}
```

模块内的所有 Controller & Service 的异常都被这个 Filter 处理。

---

# 3️⃣ **控制器级引入**

只在某个 Controller 生效。

```ts
// users.controller.ts
import { Controller, UseFilters, Get } from '@nestjs/common';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';

@Controller('users')
@UseFilters(HttpExceptionFilter)
export class UsersController {
  @Get('test')
  test() {
    throw new Error('Controller level error');
  }
}
```

---

# 4️⃣ **方法级引入**

只对某个路由方法生效。

```ts
@Get(':id')
@UseFilters(HttpExceptionFilter)
getUser() {
  throw new Error('Method level error');
}
```

---

# 🔥 五、内置 Exception 与自定义业务异常

Nest 内置：

* `BadRequestException`
* `UnauthorizedException`
* `ForbiddenException`
* `NotFoundException`
* `ConflictException`
* `InternalServerErrorException`

例如：

```ts
@Get(':id')
getUser(@Param('id') id: number) {
  if (id < 1) {
    throw new BadRequestException('ID 必须大于 0');
  }
}
```

你的 Exception Filter 会捕获它并格式化输出。

---

# 🌟 六、最佳实践（企业级）

### ✔ 全局 Exception Filter 负责统一错误格式（AppModule → APP_FILTER）

### ✔ 服务内部只抛出业务异常（例如 NotFoundException）

### ✔ 业务场景复杂时，定义自己的业务异常类

```ts
export class BusinessException extends HttpException {
  constructor(message: string, code = 40001) {
    super({ code, message }, 400);
  }
}
```

---

# 🧩 七、完整可运行示例（结构）

```
src/
 ├── common/
 │    └── filters/
 │          └── http-exception.filter.ts
 ├── users/
 │    ├── users.controller.ts
 │    ├── users.service.ts
 │    └── users.module.ts
 ├── app.module.ts
 └── main.ts
```

---

# 🏁 八、总结（你的问题最终答案）

### ❓ Exception Filter 在哪里引入？

> **Exception Filter 可以在四个位置引入**
> 但真正“生效”的方式就是通过 `UseFilters()` 或 `APP_FILTER`。

| 级别  | 哪里引入                               | 是否推荐      |
| --- | ---------------------------------- | --------- |
| 全局  | main.ts → `app.useGlobalFilters()` | ⭐⭐⭐⭐      |
| 全局  | AppModule → `APP_FILTER`           | ⭐⭐⭐⭐⭐（最佳） |
| 模块  | Module → `APP_FILTER`              | ⭐⭐⭐       |
| 控制器 | `@UseFilters()`                    | ⭐⭐        |
| 方法  | `@UseFilters()`                    | ⭐         |

---

如果你愿意，我可以帮你：

👉 **把 Exception Filter + Interceptor + Guard + Pipe 整合成统一的企业级标准错误处理框架**（含 traceId 自动带入错误日志）
要不要我帮你也生成这一套？
