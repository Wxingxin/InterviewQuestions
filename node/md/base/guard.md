| 需求                             | Guard 引入方式          | 推荐 |
| -------------------------------- | ----------------------- | ---- |
| 所有接口都需要登录               | `AppModule` 全局 Guard  | ✅   |
| 某个模块统一需要登录             | 模块中的 APP_GUARD      | 👍   |
| 某个接口需要登录                 | `@UseGuards()` 方法级别 | 常见 |
| 某个接口不进入鉴权（全局已开启） | `@Public()` 装饰器      | 必备 |

# 🛡️ 一、Guard 是什么？

Guard 是 NestJS 中控制**“某个请求是否可以继续执行”**的组件。
它站在 Controller 门口，像个门卫：

> **能不能继续往下走，由 Guard 说了算。**

Guard 的核心方法：

```ts
canActivate(context: ExecutionContext): boolean | Promise<boolean>;
```

返回：

- `true` → 允许进入 controller
- `false` → 拦住，不让走（Nest 会抛 403 Forbidden）
- 或者直接抛异常 → 让你自定义错误信息

---

# 🌱 二、Guard 的典型用途

Guard 最常用于鉴权 / 授权：

- JWT 校验
- 角色权限（Role）
- 权限点校验（Permissions）
- 校验用户是否登录
- IP 过滤（也可以在 middleware 中用）
- 校验用户状态（是否封禁）
- 验证请求头是否合法
- 多租户（Tenant）校验

一句话：

> **Middleware 是“让请求能不能进系统”，Guard 是“系统内部的门禁”。**

---

# 💡 三、Guard 的三种使用方式

和 Middleware 类似，Guard 的使用方式也分级别：

---

## **1）控制器级别 / 方法级别（最常用）**

```ts
@UseGuards(AuthGuard)
@Controller("users")
export class UsersController {
  @Get()
  findAll() {
    return [];
  }
}
```

Guard 会作用于：

- 当前 controller 的所有方法（放在类上）
- 当前方法（放在方法上）

---

## **2）模块级别（很少用）**

你可以在 `providers` 里注册一个 Guard，然后作为 provider 注入。

但 Guard 本身不会自动生效，必须使用 `@UseGuards()` 或者下面的“全局 Guard”。

---

## **3）全局 Guard（应用级别）**

```ts
app.useGlobalGuards(new AuthGuard());
```

或在 `AppModule` 中：

```ts
{
  provide: APP_GUARD,
  useClass: AuthGuard,
}
```

这会对**整个应用**生效。

适合：

- 全局 JWT 验证
- 全局权限系统

---

# 🌎 四、Guard 要在哪里引入？

核心规则只有一句：

> **Guard 需要通过 `@UseGuards()` 或者全局方式注册，Nest 才会执行它。**

### Guard 的引入点不在 Module，而是在：

1. **类（控制器）级别** → `@Controller()` 上方
2. **方法级别** → `@Get() @Post()` 上方
3. **全局级别** → 在 main.ts 或 APP_GUARD 中
4. **子路由模块中使用 APP_GUARD 注册 provider**

例子：

---

## **在控制器中引入**

```ts
@Controller("users")
@UseGuards(AuthGuard)
export class UsersController {}
```

---

## **在方法中引入**

```ts
@Get()
@UseGuards(AuthGuard)
findAll() { }
```

---

## **全局引入（main.ts）**

```ts
const app = await NestFactory.create(AppModule);
app.useGlobalGuards(new AuthGuard());
```

---

# 👨‍🏫 五、Guard 的标准写法（完整版本）

这是你最常写的模板：

```ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization;

    if (!token) {
      throw new UnauthorizedException("缺少 Token");
    }

    // 进行 token 校验（伪代码）
    const isValid = this.validateToken(token);
    if (!isValid) {
      throw new UnauthorizedException("无效 Token");
    }

    return true; // 允许继续执行 controller
  }

  validateToken(token: string): boolean {
    // 校验逻辑...
    return true;
  }
}
```

说明：

- 实现 `CanActivate`
- 返回 true/false 或抛异常
- 用 ExecutionContext 获取 request、user、handler 等信息

---

# 🔍 六、ExecutionContext 的强大之处（秘诀）

Guard 最强大的地方不是拦截，而是：

> 能拿到当前请求的路由、类、处理器、参数等详细信息。

常用方法：

```ts
const ctx = context.switchToHttp();
const request = ctx.getRequest();
const response = ctx.getResponse();
const handler = context.getHandler(); // 控制器方法
const controller = context.getClass(); // 控制器类
```

### 对权限系统非常有用：

- 你可以在方法上加 `@Roles('admin')`
- Guard 里通过 `Reflector` 取到这些元数据
- 再判断用户是否拥有这个角色

这是 Nest 默认 RoleGuard 的模式。

---

# 👑 七、Decorator + Guard：角色权限系统的经典组合

先写装饰器：

```ts
export const Roles = (...roles: string[]) => SetMetadata("roles", roles);
```

控制器里使用：

```ts
@Roles('admin')
@Get()
findAll() {}
```

Guard 中获取元数据：

```ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>("roles", context.getHandler());

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return roles.includes(user.role);
  }
}
```

---

# 🧠 八、Guard 和 Middleware 的区别（想不清楚这一点会用错）

| 特性              | Middleware         | Guard                        |
| ----------------- | ------------------ | ---------------------------- |
| 触发时机          | 路由前（最早）     | 路由前，但在 middleware 后   |
| 能否依赖注入      | 类式可以           | 可以                         |
| 是否了解路由信息  | 不方便             | 非常方便（ExecutionContext） |
| 常用用途          | 日志、解析、黑名单 | 登录验证、权限判断           |
| 能否大规模使用 DI | ❌ 较难            | ✔ 可以                       |
| 层级              | 更底层（Express）  | 应用层                       |

一句话：

> **Middleware 做“技术类预处理”，Guard 做“权限类决策”。**

---

# ⚡ 九、Guard 的触发顺序（与系统其他组件的关系）

请求的流动顺序：

```
Middleware → Guard → Pipe → Controller → Service → Interceptor (response)
```

Guard 在 Controller 的入口，是守门人。
它比 Pipe 早，比 Middleware 晚。

---

# 🧱 十、Guard 的最佳实践

### ✔ 1. 用 Guard 做权限，不要用 Middleware 乱堆逻辑

Guard 更适合判断“能不能继续执行”。

---

### ✔ 2. 使用 Reflector 读取自定义元数据（做角色系统必用）

---

### ✔ 3. 复杂鉴权建议使用 “内层 Guard + 外层 interceptor” 组合

比如：

- Guard：拦住非法用户
- Interceptor：给合法用户加额外字段或包装数据

---

### ✔ 4. 全局 AuthGuard + 局部 RolesGuard

典型组合方式：

```ts
app.useGlobalGuards(new AuthGuard());   // 验证 token 是否有效
@UseGuards(RolesGuard)                  // 校验角色
```

---

### ✔ 5. Guard 中不要做复杂业务逻辑

应该放在 service 中，例如：

```ts
const roles = await this.userService.getUserRoles(id);
```

Guard 只应该负责“检查”，不是“干活”。

---

### ✔ 6. Guard 推荐用**类方式**写（方便依赖注入）

---

# 🎁 十一、Guard 的全部知识点总结（速记版）

```
Guard
 ├── 作用：决定请求是否能进入 controller
 ├── 方法：canActivate(context) -> boolean/Promise<boolean>
 ├── 一级概念：ExecutionContext
 ├── 使用方式
 │     ├── 方法：@UseGuards()
 │     ├── 控制器级别：@UseGuards()
 │     ├── 全局：app.useGlobalGuards() / APP_GUARD
 ├── 写法
 │     ├── 类式（推荐）
 │     ├── canActivate + Exception
 ├── 常用场景
 │     ├── JWT 验证
 │     ├── 角色系统（@Roles + Reflector）
 │     ├── 权限点
 │     ├── 登录状态校验
 ├── 区别于 Middleware
 │     ├── Guard 专注“权限”
 │     ├── Middleware 专注“通用预处理”
 ├── 顺序
 │     Middleware → Guard → Pipe → Controller → Interceptor
 ├── 最佳实践
 │     ├── 全局 AuthGuard
 │     ├── 局部 RolesGuard
 │     ├── Guard 只判断，不处理业务
 └── 进阶技巧
       ├── 多 Guard 叠加
       ├── 结合 Decorator 做元数据权限系统
       ├── ExecutionContext 获取 handler/class
```

---

如果你愿意，我接下来可以给你写：

- **一个包含 AuthGuard + RoleGuard + Decorator 的完整权限系统 Demo**
- **一张“中间件 → Guard → Pipe → Interceptor → Controller” 的流程图**
- **JWT 登录鉴权体系的完整项目示例**

你想深入哪个方向？
