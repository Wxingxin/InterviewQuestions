下面我把 **Guard（鉴权）应该在哪里引入、怎么引入、全局/模块/局部 3 种方式** 全部讲清楚，并附上 **可复制使用的完整代码模板**。

Guard（守卫）是 NestJS 在 **中间件之后、拦截器之前** 执行的组件，常用于：

* 登录校验（JWT）
* 角色/权限校验（RBAC）
* 请求来源校验
* 是否允许访问某个资源

Guard 的执行时机：

```
Middleware → Guard → Interceptor(before) → Pipe → Controller → Service
           → Interceptor(after) → ExceptionFilter
```

下面我们按 **3 个引入场景** 给你完整代码。

---

# ✅ 场景 1：在某个 Controller/Route 上引入（最常用）

适用于只保护某几个接口。

---

## **① 定义一个 Guard（例如 JWT Token 校验）**

```ts
// src/auth/guards/jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    const token = req.headers['authorization']?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException('Token missing');
    }

    // 实际项目：解析 token、校验签名
    req.user = { id: 1, username: 'alice' };

    return true; // 放行
  }
}
```

---

## **② 在 Controller 上引入 Guard**

### **Controller 整个类都被保护**

```ts
// src/users/users.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  @Get()
  getUsers() {
    return [{ id: 1, username: 'alice' }];
  }
}
```

---

### **只保护某个方法**

```ts
@Get('profile')
@UseGuards(JwtAuthGuard)
getProfile(@Req() req) {
  return req.user;
}
```

---

# ✅ 场景 2：在某个模块中引入（模块级 Guard）

适用于：

* 一个模块下的所有路由都需要鉴权
* 或者想和模块依赖一致（比如 Posts 模块全部需要登录）

---

## **① 仍然是上面的 Guard**

## **② 模块中通过 Provider 注册为 APP_GUARD（局部）**

```ts
// src/posts/posts.module.ts
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Module({
  controllers: [PostsController],
  providers: [
    PostsService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class PostsModule {}
```

这样：

* Posts 模块内的所有路由都自动应用 `JwtAuthGuard`
* 不影响其他模块

---

# ✅ 场景 3：在整个 App 里全局引入（最常用：全局 JWT）

如果你希望：

* 所有接口都需要登录
* 只有个别接口允许匿名请求

> 使用 `APP_GUARD` 在 **AppModule** 中注册。

---

## **① 在根模块 AppModule 注册全局 Guard**

```ts
// src/app.module.ts
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    // ...你的模块
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // 全局 Guard
    },
  ],
})
export class AppModule {}
```

这样，所有 Controller 都会自动执行 JwtAuthGuard。

---

## **② 如何跳过全局 Guard？**

可以定义一个 `@Public()` 装饰器：

```ts
// src/auth/decorators/public.decorator.ts
import { SetMetadata } from '@nestjs/common';
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

在 Guard 中识别：

```ts
// jwt-auth.guard.ts（修改版）
import { Reflector } from '@nestjs/core';

constructor(private reflector: Reflector) {}

canActivate(context: ExecutionContext): boolean {
  const isPublic = this.reflector.getAllAndOverride<boolean>(
    IS_PUBLIC_KEY,
    [context.getHandler(), context.getClass()]
  );
  if (isPublic) return true;

  // 继续校验 token ...
}
```

Controller 中跳过鉴权：

```ts
@Public()
@Get('hello')
publicHello() {
  return 'Hello world (no auth required)';
}
```

---

# 🌈 最佳实践总结（直接照着做）

| 需求               | Guard 引入方式           | 推荐 |
| ---------------- | -------------------- | -- |
| 所有接口都需要登录        | `AppModule` 全局 Guard | ✅  |
| 某个模块统一需要登录       | 模块中的 APP_GUARD       | 👍 |
| 某个接口需要登录         | `@UseGuards()` 方法级别  | 常见 |
| 某个接口不进入鉴权（全局已开启） | `@Public()` 装饰器      | 必备 |

---

# 🎁 完整可运行的例子（你可以直接粘贴跑起来）

```
src/
  main.ts
  app.module.ts
  auth/
    guards/
      jwt-auth.guard.ts
    decorators/
      public.decorator.ts
  users/
    users.controller.ts
```

每个文件内容我前面已经给出。

---

如果你愿意，我可以进一步帮你：

👉 **把 TraceId + Guard + Interceptor 整合成完整的“全链路鉴权 + 日志链路追踪系统”**
（包含 traceId 在 Guard / Service / Logger 中自动透传）

需要我帮你整合一套完整模板吗？
