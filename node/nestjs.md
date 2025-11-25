
## 一、基础概念类

### 1. NestJS 是什么？有什么特点？

**答：**

NestJS 是一个基于 TypeScript 的 Node.js 后端框架，核心思想是 **模块化、依赖注入、装饰器、面向对象 & 函数式编程结合**。
主要特点：

* 使用装饰器和模块化结构，代码非常结构化
* 内置 **依赖注入（DI）容器**
* 内建对 **HTTP、WebSocket、微服务** 的支持
* 良好的测试支持（unit / e2e）
* 与 Express / Fastify 适配

---

### 2. Nest 中的 `Module` 是什么？有什么作用？

**答：**

* `Module` 是 Nest 应用的基本组织单元，用 `@Module()` 装饰。
* 作用：

  * 将 **相关的 controller / provider / 导入的模块** 聚合在一起
  * 用于依赖注入的边界划分：`providers` 在当前模块（或导出的模块）内可见
  * 通过 `imports` / `exports` 在模块间复用功能

```ts
@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
```

---

### 3. `Controller` 和 `Provider` 有什么区别？

**答：**

* **Controller**

  * 负责处理 **请求和响应**（路由层）
  * 用 `@Controller()` 装饰，并通过 `@Get()`、`@Post()` 等装饰器声明路由

* **Provider**

  * 负责 **业务逻辑 / 数据访问 / 通用服务**
  * 用 `@Injectable()` 装饰，通过依赖注入被其他类使用
  * 如 `Service`、`Repository`、自定义工具类等本质都是 Provider

---

### 4. NestJS 的依赖注入（DI）是如何工作的？

**答：**

* Provider 使用 `@Injectable()` 声明，并在模块的 `providers` 中注册
* Nest 通过 **类型反射**（TypeScript 的 `emitDecoratorMetadata`）来推断构造函数参数的类型
* 在实例化类时，根据类型从 IoC 容器中找到对应的 provider 实例并注入

```ts
@Injectable()
export class UserService {
  constructor(private readonly repo: UserRepository) {}
}
```

`UserRepository` 也需要是一个 provider 并注册到模块中。

---

### 5. `main.ts` 里的 `NestFactory.create(AppModule)` 做了什么？

**答：**

* 创建 Nest 应用实例（底层默认使用 Express 或 Fastify）
* 扫描 `AppModule` 及其导入的模块，构建整个依赖注入图
* 初始化所有模块、控制器、providers
* 调用 `app.listen(port)` 启动 HTTP 服务器

---

### 6. 常见的 HTTP 装饰器有哪些？

**答：**

* 路由方法：`@Get()`、`@Post()`、`@Put()`、`@Delete()`、`@Patch()`、`@Options()`…
* 参数装饰器：

  * `@Body()`：获取请求体
  * `@Query()`：获取查询参数
  * `@Param()`：获取路径参数
  * `@Headers()`：获取请求头
  * `@Req()` / `@Res()`：原始请求和响应对象
* 其他：

  * `@HttpCode()`：自定义返回状态码
  * `@Header()` / `@Redirect()` 等

---

### 7. 什么是 `Pipe`？用来做什么？

**答：**

Pipe（管道）是用于 **转换和验证** 数据的类。
常见用途：

* **参数类型转换**（如字符串转数字）
* **参数验证**（结合 `class-validator` 使用）

Nest 提供的常用内置 Pipe：

* `ValidationPipe`：基于 DTO 和 class-validator 做校验
* `ParseIntPipe`、`ParseBoolPipe`、`ParseUUIDPipe` 等

---

### 8. 什么是 `Guard`？常用于哪些场景？

**答：**

Guard（守卫）用来决定 **当前请求是否可以继续执行**，常见场景：

* 权限校验 / 角色校验
* 认证（JWT、API Key 等）

Guard 实现 `CanActivate` 接口，通过 `true/false` 决定是否放行：

```ts
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    return !!req.user; // 有用户信息才放行
  }
}
```

---

### 9. 什么是 `Interceptor`？常见用法有哪些？

**答：**

Interceptor 会 **包裹**在路由处理逻辑前后（类似 AOP），常见用法：

* 统一响应格式包装（如加上 `code`、`message`）
* 日志记录
* 缓存处理
* 统计执行时间
* 异常转换

核心是实现 `intercept(context, next)`，对 `next.handle()` 的流进行处理（通常返回 Observable）。

---

### 10. 什么是 `Exception Filter`？为什么有了它还需要 `Interceptor`？

**答：**

* Exception Filter 用来 **捕获和处理抛出的异常**，统一输出错误响应。
* Interceptor 虽然也可以对流中的错误做处理，但 Exception Filter 更专注于异常层面，适合：

  * 全局统一异常格式
  * 针对特定异常类型做特殊处理

简单对比：

* **Filter**：专门处理错误（`catch`）
* **Interceptor**：处理请求前 / 响应后 / 包括成功和失败的整体流程

---

### 11. Middleware 和 Guard 的区别？

**答：**

* **Middleware**

  * 更靠近底层（Express/Fastify 中间件）
  * 在路由匹配前后执行
  * 不能使用依赖注入（class 方式可以，但不如 provider 那么自然）

* **Guard**

  * 基于 Nest 的 `ExecutionContext`
  * 可以使用依赖注入
  * 在路由执行前、Pipe 执行前（通常）判断是否放行

简化记忆：**请求流顺序：Middleware → Guard → Pipe → Controller → Interceptor（环绕） → Exception Filter（异常时）**

---

## 二、进阶与实践类

### 12. 如何使用全局 `ValidationPipe` 做请求参数校验？

**答：**

1. 定义 DTO：

```ts
export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}
```

2. 在 `main.ts` 中启用全局校验：

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,      // 过滤 DTO 中未定义的字段
    forbidNonWhitelisted: true, // 遇到多余字段直接报错
    transform: true,      // 自动类型转换
  }),
);
```

3. Controller 中使用 DTO：

```ts
@Post()
create(@Body() dto: CreateUserDto) { ... }
```

---

### 13. 如何自定义装饰器（如 `@User()` 获取当前用户）？

**答：**

自定义参数装饰器：

```ts
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.user?.[data as string] : request.user;
  },
);
```

使用：

```ts
getProfile(@User() user: any) { ... }
getUserId(@User('id') userId: string) { ... }
```

---

### 14. NestJS 中的生命周期钩子有哪些？

**常见接口：**

* `OnModuleInit`：模块初始化完成
* `OnModuleDestroy`：模块销毁时
* `OnApplicationBootstrap`：整个应用启动完成后
* `OnApplicationShutdown`：应用关闭时（可监听信号）
* `BeforeApplicationShutdown`：关闭前

使用方式：在类中实现对应接口并实现方法：

```ts
@Injectable()
export class AppService implements OnModuleInit {
  onModuleInit() {
    console.log('Module initialized');
  }
}
```

---

### 15. 如何处理配置（config），不同环境如何区分？

**答：**

* 使用官方 `@nestjs/config` 模块
* 支持 `.env` 文件、环境变量注入、分环境配置

```ts
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local', '.env'],
    }),
  ],
})
export class AppModule {}
```

在服务中使用：

```ts
constructor(private config: ConfigService) {}
const dbHost = this.config.get<string>('DB_HOST');
```

---

### 16. 如何优雅地集成数据库（以 TypeORM 为例）？

**答：**

1. 安装 `@nestjs/typeorm` 和 `typeorm` 等依赖
2. 在根模块中配置：

```ts
TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'test',
  autoLoadEntities: true,
  synchronize: true, // 生产环境慎用
});
```

3. 模块中引入实体：

```ts
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
```

4. 在 Service 中注入 `Repository<User>` 使用。

---

### 17. NestJS 如何实现依赖注入的作用域（Scope）？

**答：**

Scope 有三种：

* `DEFAULT`（单例）– 整个应用共用一个实例
* `REQUEST` – 每个请求一个实例
* `TRANSIENT` – 每次注入都会创建一个新实例

设置方式：

```ts
@Injectable({ scope: Scope.REQUEST })
export class RequestScopedService {}
```

使用场景：

* Request Scope：与请求强相关的数据（如 requestId）
* Transient：无状态、小服务、多次同时使用但需要不同实例

---

### 18. 什么是 Dynamic Module？何时需要？

**答：**

Dynamic Module（动态模块）是指在运行时根据参数动态生成的模块，常用于：

* 可配置的通用模块（如 LoggerModule、DatabaseModule）
* 需要在 `forRoot` / `forRootAsync` 中接受配置的场景

```ts
@Module({})
export class LoggerModule {
  static forRoot(options: LoggerOptions): DynamicModule {
    return {
      module: LoggerModule,
      providers: [{ provide: LOGGER_OPTIONS, useValue: options }],
      exports: [LOGGER_OPTIONS],
    };
  }
}
```

---

### 19. NestJS 如何实现文件上传？

**答：**

* 基于 `@nestjs/platform-express` + Multer
* Controller 中使用 `@UseInterceptors(FileInterceptor('file'))`

```ts
@Post('upload')
@UseInterceptors(FileInterceptor('file'))
upload(@UploadedFile() file: Express.Multer.File) {
  console.log(file.originalname);
}
```

---

### 20. 如何编写和运行单元测试（Unit Test）？

**答：**

* 使用默认集成的 Jest
* 使用 `Test.createTestingModule` 创建测试模块
* 通过依赖注入获取被测服务

```ts
describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserService, MockRepo],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

---

## 三、架构设计 & 微服务

### 21. 如何使用 Nest 实现微服务架构？

**答：**

Nest 提供 `@nestjs/microservices` 包，支持多种传输层：

* TCP
* Redis
* NATS
* MQTT
* Kafka 等

基本思路：

* 使用 `NestFactory.createMicroservice()` 创建微服务实例
* 使用 `ClientProxy` 在其他服务中调用微服务
* 使用 `@MessagePattern()` 接收消息

---

### 22. 什么是 `ClientProxy`？如何使用？

**答：**

`ClientProxy` 是一个微服务客户端抽象，用于向微服务发送消息 / 命令：

```ts
@Injectable()
export class AppService {
  constructor(@Inject('MATH_SERVICE') private client: ClientProxy) {}

  sum(data: number[]) {
    return this.client.send<number>('sum', data); // Observable
  }
}
```

在模块中配置客户端：

```ts
{
  provide: 'MATH_SERVICE',
  useFactory: () => ClientProxyFactory.create({ transport: Transport.TCP });
}
```

---

### 23. 在大型项目中如何做模块划分和目录结构设计？

**答：**

常见实践：

* 按照领域划分模块（DDD 思路），如：`user`、`order`、`product` 等
* 每个领域模块内部包含：

  * `controller`
  * `service`
  * `entity / model`
  * `dto`
  * `repository`（可选）
* 公共模块：

  * `auth`、`logger`、`cache`、`config` 等

避免所有东西都堆在 `app.module` 和 `src` 根目录，保证可维护性和清晰的依赖边界。

---

### 24. 如何在 Nest 中实现 AOP 风格的日志记录？

**答：**

常见方案：**自定义 Interceptor**

```ts
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const req = ctx.switchToHttp().getRequest();
    const { method, url } = req;

    return next.handle().pipe(
      tap(() => console.log(`${method} ${url} - ${Date.now() - now}ms`)),
    );
  }
}
```

通过 `app.useGlobalInterceptors(new LoggingInterceptor())` 或 `@UseInterceptors()` 使用。

---

### 25. 如何统一响应格式（如 `{ code, message, data }`）？

**答：**

依然推荐使用 **Interceptor**：

```ts
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        code: 0,
        message: 'success',
        data,
      })),
    );
  }
}
```

全局启用：

```ts
app.useGlobalInterceptors(new TransformInterceptor());
```

---

## 四、性能 & 部署运维

### 26. 如何开启 CORS？如何自定义？

**答：**

在 `main.ts`：

```ts
const app = await NestFactory.create(AppModule);
app.enableCors({
  origin: ['https://example.com'],
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
});
```

---

### 27. 如何使用 Fastify 替代默认的 Express？

**答：**

安装：

```bash
npm install @nestjs/platform-fastify fastify
```

`main.ts`：

```ts
const app = await NestFactory.create<NestFastifyApplication>(
  AppModule,
  new FastifyAdapter(),
);
```

Fastify 在高并发场景下更高效，适合性能要求高的场景。

---

### 28. 怎样在 Nest 中使用缓存（Cache）？

**答：**

使用 `@nestjs/cache-manager`（或老的 `@nestjs/common` CacheModule）：

```ts
@Module({
  imports: [
    CacheModule.register({
      ttl: 5, // seconds
      max: 100,
    }),
  ],
})
export class AppModule {}
```

在 Service 中注入 `CACHE_MANAGER`，或用 `@UseInterceptors(CacheInterceptor)`。

---

### 29. NestJS 如何优雅处理应用关闭（如关闭 DB 连接）？

**答：**

* 使用 `OnApplicationShutdown` / `BeforeApplicationShutdown` 钩子
* 配合 `app.enableShutdownHooks()` 监听系统信号

```ts
@Injectable()
export class AppService implements OnApplicationShutdown {
  onApplicationShutdown(signal?: string) {
    console.log('Application shutting down', signal);
  }
}
```

---

### 30. 生产环境部署 Nest 应用的常见方式？

**简答：**

* 使用 `pm2` / `node` 直接运行编译后的 JS
* 使用 Docker 容器部署（推荐）
* 结合 Nginx 做反向代理、TLS 终端
* 通过环境变量配置不同环境
* 打开适当的日志级别、监控（Prometheus、Elastic Stack、APM 等）

---

如果你愿意，我可以：

* 按 **初级 / 中级 / 高级** 帮你重新分组这些题
* 或者根据你目标岗位（如“Node 中高级后端”“全栈”“架构师”）帮你挑选一套 **精简高频必问清单**，再配上更详细的答案和示例代码。
