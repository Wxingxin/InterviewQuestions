好的——这次我们把 **Interceptor（拦截器）** 的“前置缓存 / 耗时统计（Before）”与“统一返回包装（After）”两个核心用途，包括：

* 它是什么
* 所有知识点
* 全部使用方式（方法级 / 控制器级 / 全局）
* 使用场景
* 完整写法
* 执行顺序
* 最佳实践

全部整合成一份“可直接当成手册”的讲解。
读完你会像拿到了一把能开 NestJS 所有门的钥匙 🔑🌬️。

---

# 🌌 一、Interceptor 是什么？（一句话定义）

Interceptor 站在**Controller 前后**。

它像一个“光圈”：

> **在进入控制器之前能做事（Before）
> 在控制器执行完数据返回之后还能再加工（After）**

它是整个 HTTP 生命周期里最灵巧的组件。

你可以用它：

* **请求前 → 做缓存、耗时统计、权限处理、数据加工**
* **请求后 → 包装统一格式、转换字段、过滤敏感信息**
* **全流程 → 日志、请求链追踪、错误转换**

执行顺序图：

```
Middleware → Guard → Pipe → [Interceptor Before] → Controller → Service
 → [Interceptor After] → ExceptionFilter → 返回给客户端
```

它是唯一一个**前后都能插手**流程的组件。

---

# 🌿 二、Interceptor 的经典用途（必须掌握）

### 🎯 Before 阶段可以做：

* 缓存命中直接返回（不进入 Controller）
* 记录请求耗时（开始计时）
* 给请求添加字段（例如 requestId）
* 参数预处理
* 日志（开始时记录）
* 链路追踪（trace id）

### 🎯 After 阶段可以做：

* **统一返回格式包装（最常用）**
* 数据脱敏
* 字段重构（比如把 snake_case 转 camelCase）
* 记录请求耗时（结束计时）
* 全局响应日志
* 异常转换为统一结构
* 缓存写入

它的灵巧程度，Guard / Middleware / Pipe 都比不了。

---

# 🛠️ 三、Interceptor 的使用位置（在哪里引入）

> **Interceptor 的引入方式与 Guard 一模一样：UseInterceptors() 或 全局注册**

有三种层级：

---

## 1）方法级（只作用于某个接口）

```ts
@Get()
@UseInterceptors(LoggingInterceptor)
getUsers() {
  return ...
}
```

---

## 2）控制器级（作用于整个 controller）

```ts
@Controller('users')
@UseInterceptors(LoggingInterceptor)
export class UsersController {}
```

---

## 3）全局级（影响整个应用）

### main.ts

```ts
const app = await NestFactory.create(AppModule);
app.useGlobalInterceptors(new LoggingInterceptor());
```

### 或 APP_INTERCEPTOR（推荐）

```ts
{
  provide: APP_INTERCEPTOR,
  useClass: LoggingInterceptor,
}
```

全局方式适用于：

* 全局响应包装
* 全局错误结构统一
* 全局耗时统计
* 全局日志

---

# 🧪 四、Interceptor 的核心结构（掌握这个就通关）

基本模板：

```ts
@Injectable()
export class MyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    
    // Before（controller 执行前）
    const request = context.switchToHttp().getRequest();
    console.log("Before controller");

    return next
      .handle()
      .pipe(
        // After（controller 返回后）
        map(data => {
          console.log("After controller");
          return data;
        }),
      );
  }
}
```

关键组件：

| 方法/对象           | 作用                 |
| --------------- | ------------------ |
| `intercept()`   | 拦截的入口              |
| `context`       | 包含请求、控制器、handler 等 |
| `next.handle()` | 执行 controller      |
| `map()`         | 拦截返回并修改            |

你要记住：

> **Interceptor 是“RXJS 流”的概念：Before 写在 intercept() 外层，After 写在 pipe().map() 里面**

---

# 🌈 五、Before 阶段：缓存 / 耗时统计（完整讲解）

---

## ⭐（1）缓存拦截器示例

```ts
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(private cache: Map<string, any>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const key = req.url;

    if (this.cache.has(key)) {
      // Before 阶段直接返回（跳过 controller）
      return of(this.cache.get(key));
    }

    return next.handle().pipe(
      tap((data) => this.cache.set(key, data)),
    );
  }
}
```

亮点：

* controller 不会被执行（性能极高）
* 服务端缓存神器

---

## ⭐（2）耗时统计 Interceptor

```ts
@Injectable()
export class TimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const ms = Date.now() - now;
        console.log(`⏱️ ${ms}ms`);
      }),
    );
  }
}
```

亮点：

* 只需一行 `@UseInterceptors(TimeInterceptor)`
* 全局性能监控

---

# 🌤️ 六、After 阶段：统一返回包装（核心必会）

统一返回格式是 Interceptor **最常见**的用途。

例如统一格式：

```json
{
  "code": 0,
  "msg": "success",
  "data": {...}
}
```

实现：

```ts
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => ({
        code: 0,
        msg: 'success',
        data,
      })),
    );
  }
}
```

全局生效：

```ts
app.useGlobalInterceptors(new TransformInterceptor());
```

亮点：

* controller 只返回业务数据（更干净）
* 格式统一在一个地方处理（更可维护）

---

# 🔍 七、Interceptor 的执行顺序（所有组件中最灵巧）

完整顺序如下：

```
Middleware → Guard → Pipe → 
  [Interceptor Before]  →  Controller → Service 
  [Interceptor After] → Exception filter → Response
```

换句话说：

* Before 比 Controller 更早执行
* After 比 Controller 更晚执行
* 可以优雅地捕获整个流程

---

# 🌋 八、Interceptor 还能做更多（进阶技能）

### ✔ 1. 异常统一处理（等同于 try/catch）

```ts
return next.handle().pipe(
  catchError(err => {
    return throwError(() => new CustomException(err));
  })
)
```

---

### ✔ 2. 过滤敏感字段

```ts
map(data => {
  delete data.password;
  return data;
})
```

---

### ✔ 3. 数据格式批量转换（snake_case ↔ camelCase）

---

### ✔ 4. 请求链追踪（traceId 注入 header）

---

### ✔ 5. 合并多个 Interceptor（笛卡尔叠加）

---

# 🧱 九、Interceptor 的最佳实践

### 🧿 1. 全局统一返回格式，就用全局 Interceptor

最常见的新手错误是每个接口自己包装。

### 🌿 2. 复杂的响应包装也尽量放 Interceptor，不要写在 Controller

### 🧭 3. Before 部分不要写耗时逻辑，否则堵塞流程

### ⚙️ 4. Interceptor 返回必须是 Observable

### ✨ 5. 错误捕获要使用 `catchError()`

### 🔍 6. 多 Interceptor 顺序从外到内执行

---

# 🧩 十、全部知识点一图总结

```
Interceptor
 ├── Before（controller 前）
 │     ├── 缓存命中直接返回
 │     ├── 耗时开始记录
 │     ├── 注入 requestId / traceId
 │     ├── 参数预处理
 │     ├── 日志开始
 ├── After（controller 后）
 │     ├── 返回统一包装
 │     ├── 数据转换 / 脱敏
 │     ├── 日志结束
 │     ├── 错误转换
 │     ├── 写入缓存
 ├── 核心结构
 │     ├── intercept(context, next)
 │     ├── next.handle().pipe(map(), tap(), catchError())
 ├── 使用方式
 │     ├── 方法级：@UseInterceptors()
 │     ├── 控制器级：@UseInterceptors()
 │     ├── 全局：useGlobalInterceptors() / APP_INTERCEPTOR
 ├── 典型用途
 │     ├── 返回包装
 │     ├── 耗时统计
 │     ├── 缓存
 │     ├── 日志
 │     ├── 数据重组
 └── 与其他组件关系
       Middleware → Guard → Pipe → [Interceptor Before] → Controller → [Interceptor After]
```

---

如果你愿意，我还可以进一步帮你：

* 画一张 **Interceptor 整体时序图（Before → Controller → After）**
* 帮你写一个 **统一返回 + 日志 + 缓存组合 Interceptor 的最佳实践版本**
* 展示 Interceptor + Guard + Pipe 组合成完整系统的案例项目

你想继续哪一块？
