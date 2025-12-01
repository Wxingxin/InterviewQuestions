下面这份，是把 **NestJS Provider（提供者）** 拆解到“骨与髓”的知识图谱。
不仅包含 **Provider 的所有类型 / 用法 / 引入方式 / 生命周期 / 注入方式 / 高阶实践**，
还特别 **结合真实项目结构** 告诉你在一个完善的 Nest 项目中 Provider 应该怎么出现、怎么组织、怎么依赖。

就像把依赖注入的迷雾拆开，让你能看见里面的齿轮 💡⚙️。

---

# 🌌 一、什么是 Provider？（大局观）

> **Provider 是 NestJS 中一切可以被依赖注入（DI）的类、值或工厂。**

换句话说：

你项目里几乎所有“可注入”的东西都是 Provider：

* Service
* Repository（TypeORM）
* Factory Provider
* Value Provider
* Class Provider
* Custom Provider
* Interceptor（可作为 Provider 使用）
* Exception Filter（可作为 Provider 使用）
* Pipe（可作为 Provider 使用）
* Guard（可作为 Provider 使用）
* ConfigService（全局配置服务）
* Logger
* 第三方库的适配器

在 Nest 中：

```
Provider = 可注入的能力单元
Module   = Provider 的组织者
DI 容器   = Provider 的管理者（创建、缓存、作用域）
```

---

# 🧭 二、Provider 要在哪里引入？（入口点）

核心规则：

> **Provider 必须在 Module 的 `providers: []` 里面声明，Nest 才能创建它、注入它。**

例子：

```ts
@Module({
  providers: [UsersService, JwtService, LoggerService],
  exports: [UsersService],
})
export class UsersModule {}
```

要点：

* 你写的 Provider **必须在某个 module 的 providers 列表中出现**
* 想让别的模块用它 → 需要 `exports: []`
* 想用别人模块的 provider → 要 `imports: []`

---

# 🌱 三、Provider 的分类（掌握这些你就通关了）

NestJS Provider 一共有 6 类：

## 1）Class Provider（最常用 | Service 就是这种）

```ts
@Injectable()
export class UsersService {}
```

注册：

```ts
providers: [UsersService]
```

注入：

```ts
constructor(private readonly usersService: UsersService) {}
```

💡 **这是项目里 80% Provider 的形态**

---

## 2）Value Provider（注入常量 / 配置值）

例如 JWT 密钥、静态配置：

```ts
export const JWT_SECRET = 'xxxx';

providers: [
  {
    provide: 'JWT_SECRET',
    useValue: JWT_SECRET,
  },
]
```

注入：

```ts
constructor(@Inject('JWT_SECRET') private secret: string) {}
```

适合：

* 常量
* 配置项
* 第三方库初始化数据

---

## 3）Factory Provider（动态生成 Provider，支持 async）

```ts
providers: [
  {
    provide: 'PAY_CLIENT',
    useFactory: (config: ConfigService) => {
      return new PayClient(config.get('PAY_KEY'));
    },
    inject: [ConfigService],
  },
];
```

也可以 async：

```ts
useFactory: async () => {
  const data = await http.get('...');
  return new Xxx(data);
};
```

使用场景：

* 动态依赖
* 根据环境选择不同实现
* 创建第三方 SDK 客户端

---

## 4）Existing Provider（别名 Provider）

把多个 token 指向同一个 provider：

```ts
providers: [
  UsersService,
  {
    provide: 'IUserService',
    useExisting: UsersService,
  },
]
```

注入：

```ts
@Inject('IUserService') private readonly userService: UsersService
```

适合：

* 接口化开发（多态）
* 抽象层设计

---

## 5）Non-Class Provider（如 Interceptor/Guard/Filter）

例如：

```ts
providers: [
  {
    provide: APP_INTERCEPTOR,
    useClass: LoggingInterceptor,
  },
]
```

这类 Provider 用来注册框架的 AOP 能力。

---

## 6）Repository Provider（TypeORM 内置）

你不需要自己写，它由 TypeOrmModule.forFeature 自动注册：

```ts
@InjectRepository(User)
private userRepo: Repository<User>
```

---

# 🚀 四、Provider 的作用域（Scope）

Provider 的生命周期（scope）有 3 种：

## 1）Singleton（默认 — 全局单例）

大多数 provider 都是单例。

```ts
@Injectable()
export class UsersService {}
```

整个应用生命周期只会创建一次。

---

## 2）Request 作用域（每个请求创建一次）

```ts
@Injectable({ scope: Scope.REQUEST })
export class RequestService {}
```

适用：

* 读写 Request 数据
* 多租户（动态连接选择）
* 每个用户请求隔离状态

---

## 3）Transient（每次注入创建一个实例）

```ts
@Injectable({ scope: Scope.TRANSIENT })
export class RandomService {}
```

适用：

* 随机状态
* 独立逻辑，每次都要新实例

---

# 🧱 五、Provider 在一个真实项目中的组织方式（项目级案例）

假设我们做一个 **用户系统**：

结构：

```
src/
  user/
    user.module.ts
    user.controller.ts
    user.service.ts    ← Service Provider
    user.repository.ts ← 自定义 Provider
    user.strategy.ts   ← Strategy Provider
    dto/
      create-user.dto.ts
```

### user.module.ts

```ts
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    UserService,              // class provider
    UserRepository,           // custom provider
    {
      provide: 'HASHER',      // value provider
      useValue: bcrypt,
    },
    {
      provide: 'USER_STRATEGY',   // factory provider
      useFactory: (config: ConfigService) => {
        return new UserStrategy(config.get('STRATEGY_MODE'));
      },
      inject: [ConfigService],
    },
  ],
  exports: [UserService, UserRepository],
})
export class UserModule {}
```

---

# 💼 六、Provider 在 Service 中是如何被注入的？

例如：

```ts
@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    @Inject('HASHER') private readonly hasher,
    @Inject('USER_STRATEGY') private strategy: UserStrategy,
  ) {}
}
```

Chain（链条）是：

```
Module.providers 注册 → DI 容器创建 Provider → 注入到构造函数 → 执行逻辑
```

---

# 🧨 七、Provider 与 Module 之间的关系（必须懂）

这三条必须背：

### 1. Provider 只在声明它的 Module 内可见

除非：

```ts
exports: [UserService]
```

### 2. 其它模块必须 imports 才能使用导出的 provider

```ts
@Module({
  imports: [UserModule],
})
```

### 3. 每个 Module 都有“局部 DI 容器”

像一个小仓库，provider 都在里面。

---

# 🔥 八、Provider 与 Nest 核心组件的关系（重磅图）

| 组件               | 是否是 Provider？  | 是否可被注入？          |
| ---------------- | -------------- | ---------------- |
| Controller       | ❌（不是 Provider） | ✔（可以注入 Provider） |
| Service          | ✔              | ✔                |
| Repository       | ✔              | ✔                |
| Guard            | ✔              | ✔                |
| Pipe             | ✔              | ✔                |
| Interceptor      | ✔              | ✔                |
| Exception Filter | ✔              | ✔                |

> **90% 你写的类都会变成 Provider。Controller 是例外，所以不能被注入。**

---

# 🧠 九、Provider 典型场景（企业项目常见）

### ✔ 场景 1：Service 作为业务 Provider

写业务逻辑：

```ts
@Injectable()
export class UserService {}
```

### ✔ 场景 2：存储库层 Provider（Repository）

封装数据访问逻辑。

### ✔ 场景 3：第三方 SDK 封装

例如：

* Redis Client
* Elasticsearch Client
* Kafka Client

### ✔ 场景 4：策略模式 provider

不同策略选不同 provider。

### ✔ 场景 5：工厂 Provider

动态创建 RabbitMQ 客户端：

```ts
provide: 'MQ_CLIENT',
useFactory: (config) => new MQ(config.host),
inject: [ConfigService],
```

### ✔ 场景 6：配置 Provider（Value Provider）

---

# 🧩 十、Provider 的最佳实践（企业级）

### ✔ 1）不要在 Service 内 new 另一个 Service

必须通过注入：

```ts
constructor(private readonly xxxService: XxxService) {}
```

### ✔ 2）模块间共享 Provider 通过 exports + imports

不要手动从别处 import 类。

### ✔ 3）Provider 名称（token）要清晰统一

### ✔ 4）复杂 Provider 使用 “Factory Provider” 管理创建逻辑

### ✔ 5）避免循环依赖（使用 forwardRef）

### ✔ 6）抽象层 Provider 用 useExisting 提高可扩展性

---

# 🗂 十一、Provider 知识树（速记版）

```
Provider
 ├─ 定义：可被注入的类 / 值 / 工厂
 ├─ 分类
 │    ├─ Class Provider
 │    ├─ Value Provider
 │    ├─ Factory Provider
 │    ├─ Existing Provider
 │    ├─ Repository Provider
 │    └─ Framework Provider (Guard/Pipe/Filter)
 ├─ 引入位置
 │    └─ Module.providers
 ├─ 共享方式
 │    ├─ exports
 │    └─ imports
 ├─ 使用
 │    └─ constructor 注入 (@Inject)
 ├─ 作用域
 │    ├─ Singleton
 │    ├─ Request
 │    └─ Transient
 ├─ 项目场景
 │    ├─ Service
 │    ├─ Repository
 │    ├─ Config
 │    ├─ Strategy
 │    ├─ SDK client
 │    └─ MQ/Cache provider
 └─ 最佳实践
      ├─ Controller 不 new Service
      ├─ 使用工厂 provider 管理复杂依赖
      ├─ 避免循环依赖 forwardRef
      └─ Provider 名称统一管理
```

---

如果你愿意，我可以继续帮你：

### ✓ 给你写一个 **“全类型 Provider 的企业级示例项目”**（类 + 值 + 工厂 + Repo + Strategy）

### ✓ 绘制一张 **Nest DI 容器加载 Provider 的完整流程图**

### ✓ 再整理一份 “Provider 面试题大全 + 标准答案”

你想继续哪一块？
