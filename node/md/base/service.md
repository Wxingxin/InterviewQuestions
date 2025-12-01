下面这一份是 **NestJS Service（服务）** 的“知识点大全”。
紧扣你的要求：**是什么、怎么用、放在哪里引入、典型代码、常见场景、最佳实践**。
内容完整但绝不散乱，让你看完立即掌握 Service 的设计与使用。

---

# 🧭 一、Service 是什么？（核心定义）

> **Service 是 NestJS 中专门负责“业务逻辑 / 数据处理 / 与 DB 或第三方通信”的类。
> Controller 只是请求入口，Service 才是“真正干活的地方”。**

一句话：
**Controller 负责接待，Service 负责工作。**

为什么需要 Service？

* Controller 是“API 层”，应该只处理“输入 + 输出”
* 业务逻辑、数据操作必须放在 Service 里，以保证结构清晰可维护
* Service 经常会被多个 Controller 调用，用来实现“复用”

---

# 📍 二、Service 要在哪里引入？（非常重要）

> **Service 必须写在某个 Module 的 `providers` 数组中才能被 Nest 注册并注入使用。**

例如：

```ts
@Module({
  providers: [UsersService],    // <-- 在这里引入
  exports: [UsersService],      // 如果其他模块也需要，就导出
})
export class UsersModule {}
```

然后才能在 Controller 中通过依赖注入使用：

```ts
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
```

注意两个关键点：

1. **providers 注册 = Service 可以被本模块使用**
2. **exports 导出 = 可以被其它模块使用**

否则你会得到这种错误：

```
Nest can't resolve dependencies of the UsersController
```

---

# 🧩 三、Service 的基本结构（最核心模板）

```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [];

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    return this.users.find(u => u.id === id);
  }

  create(user) {
    this.users.push(user);
  }
}
```

必须加 `@Injectable()` 装饰器，因为：

* 表示这个类可以被 Nest 的 DI 容器管理
* 才能被注入到 Controller 或其他 Service 中

---

# ⚙️ 四、Service 如何使用？（Controller 中的依赖注入）

Controller 中通过构造函数自动注入：

```ts
constructor(private readonly usersService: UsersService) {}
```

然后调用方法：

```ts
@Get()
findAll() {
  return this.usersService.findAll();
}

@Post()
create(@Body() dto: CreateUserDto) {
  return this.usersService.create(dto);
}
```

**重点：Service 应该只做业务逻辑，不处理请求参数 / 响应包装等内容。**

---

# 🧠 五、Service 的常用场景（90% 项目都会遇到）

## 1. **业务逻辑处理（核心职责）**

如：

* 创建用户
* 修改用户角色
* 数据过滤
* 业务规则判断

例如：

```ts
createUser(dto: CreateUserDto) {
  if (dto.age < 18) {
    throw new BadRequestException('未成年人禁止注册');
  }
  return this.repo.save(dto);
}
```

---

## 2. **数据库操作（用 Repository 操作数据）**

```ts
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  findOne(id: number) {
    return this.userRepo.findOne({ where: { id } });
  }
}
```

---

## 3. **调用第三方服务（如 Redis / MQ / HTTP 请求）**

```ts
async sendSms(phone: string) {
  await axios.post('https://sms.com/api', { phone });
}
```

---

## 4. **封装复杂逻辑，提高复用性**

例如权限系统：

```ts
userHasPermission(user, action) {
  return user.permissions.includes(action);
}
```

多个 Controller 都可以复用。

---

## 5. **事务处理（使用数据库事务）**

```ts
async createUserWithProfile(userDto, profileDto) {
  return this.connection.transaction(async manager => {
    const user = await manager.save(User, userDto);
    const profile = await manager.save(Profile, profileDto);
    return { user, profile };
  });
}
```

---

# 🧱 六、Service 与 Module 的关系（必须理解）

Nest 的依赖注入系统是“**模块作用域**”的。

### 规则：

1. **Service 必须被声明在一个模块的 providers 数组才能使用**
2. **Service 只在声明它的模块内部可见**
3. **想让别的模块也用它 → 加到 exports 数组**
4. **别的模块想使用它 → imports 该模块**

典型：

```ts
// users.module.ts
@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

```ts
// auth.module.ts
@Module({
  imports: [UsersModule], // 引入 UsersModule 才能使用 UsersService
  providers: [AuthService],
})
export class AuthModule {}
```

否则会报错。

---

# 🔍 七、Service 的高级知识点

## 1. **Service 可以注入其它 Service**

```ts
@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}
}
```

常见于：

* AuthService 注入 UsersService
* OrdersService 注入 ProductsService

---

## 2. **Service 的 scope（默认是 singleton 单例）**

每个 Service 默认是：

```
整个应用生命周期共享一个实例
```

若要每次请求都创建新实例：

```ts
@Injectable({ scope: Scope.REQUEST })
```

若要每次注入都创建新实例：

```ts
@Injectable({ scope: Scope.TRANSIENT })
```

---

## 3. **Service 内可以使用 constructor 注入任何 Provider**

包括：

* Repository
* ConfigService
* Logger
* HttpService
* 自定义 Provider
* 工厂 Provider

等。

---

## 4. **Service 与 Pipe / Guard / Interceptor 的分工**

| 组件          | 负责内容           |
| ----------- | -------------- |
| Service     | 业务逻辑 / 数据处理    |
| Controller  | 输入输出 / 路由      |
| Pipe        | 参数校验 & 转换      |
| Guard       | 鉴权 / 权限判断      |
| Interceptor | 响应包装 / 日志 / 缓存 |
| Filter      | 异常捕获           |

Service 不应该做这些事情（非常重要）。

---

# 🎯 八、Service 最佳实践（生产环境标准）

### ✔ 1. Service 必须保持无副作用（pure-ish）

不要从 Service 里直接返回 Res/Req，要保持通用。

### ✔ 2. Controller 永远不写业务逻辑

Controller 只干两件事：

1. 接收参数
2. 调用 Service

### ✔ 3. 使用 DTO 作为参数类型，不用 any

```ts
create(dto: CreateUserDto)
```

### ✔ 4. 大型功能拆分多个 Service，不要一个 Service 写满 2000 行

例如：

```
users/
  users.service.ts
  users.repository.ts
```

或者：

```
orders/
  orders.service.ts
  orders-price.service.ts
  orders-stock.service.ts
```

### ✔ 5. 共享 Service 必须写在 exports 里

### ✔ 6. Service 要用接口/类型严格定义返回数据结构

减少 Controller 混乱。

---

# 🗂️ 九、Service 体系总结（速记版）

```
Service
 ├─ 定义：业务逻辑、数据处理、访问数据库/第三方
 ├─ 使用方式：Controller 或其他 Service 注入使用
 ├─ 必须引入：Module.providers 中声明
 ├─ Module 共享：通过 exports + imports
 ├─ 装饰器：@Injectable()
 ├─ 常用场景
 │    ├─ CRUD 业务逻辑
 │    ├─ Repository 调用
 │    ├─ 调第三方接口
 │    ├─ 事务处理
 │    └─ 封装公共逻辑
 ├─ 高级用法
 │    ├─ 多 Service 注入
 │    ├─ scope: singleton / request / transient
 │    ├─ factory provider
 └─ 最佳实践
      ├─ Controller 不写业务
      ├─ Service 不依赖 Req/Res
      ├─ DTO + ValidationPipe
      ├─ 拆分大型 Service
      └─ 避免循环依赖
```

---

如果你愿意，我可以继续给你：

* **Controller + Service + DTO + Pipe 的完整最佳实践结构示例（可复制）**
* **Service 与 Repository 在真实项目中的关系（DDD vs 传统三层）**
* **如何避免 Service 循环依赖（forwardRef）**

你想继续哪一块？
