下面这一份就是 **NestJS Exception Filter（异常过滤器）** 的“知识点大全”，
结构紧凑、只讲核心：**是什么 → 怎么用 → 在哪里引入 → 应用场景 → 最佳实践**。

就像一盏放在异常风暴旁的灯，把混乱变成秩序 🕯️。

---

# 🌪 一、Exception Filter 是什么？

> **Exception Filter（异常过滤器）用于捕获应用中的异常，并将你自定义的响应返回给客户端。**

它在整个请求管线上处于“守望者”的位置：
当 Controller/Service/Pipe/Guard/Interceptor 抛异常时，它能：

* 拦截异常
* 格式化错误结构
* 写日志
* 返回规范化的 HTTP 响应

默认情况下，Nest 会用自己的内置异常处理机制 → 把 `HttpException` 自动转换为 JSON。
但是你要**自定义格式/日志/错误代码**，就必须用 Exception Filter。

---

# 📍 二、Exception Filter 要在哪里引入？（最重要）

Exception Filter 的引入位置有 4 级：

## 1）方法级（只作用单个接口）

```ts
@UseFilters(MyExceptionFilter)
@Get()
findAll() {
  ...
}
```

## 2）控制器级（作用整个 Controller）

```ts
@UseFilters(MyExceptionFilter)
@Controller('users')
export class UsersController {}
```

## 3）全局级（应用层级，一般写在 main.ts）

```ts
const app = await NestFactory.create(AppModule);
app.useGlobalFilters(new MyExceptionFilter());
```

## 4）全局 Provider 方式（更优雅）

```ts
// app.module.ts
providers: [
  {
    provide: APP_FILTER,
    useClass: MyExceptionFilter,
  },
]
```

> **记忆点：Exception Filter 可以放方法 / 控制器 / 全局，和 Guard / Interceptor 的引入方式一模一样。**

---

# 🧩 三、Exception Filter 的基本结构（核心模板）

这是最标准、最常用的写法：

```ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()  // 不加参数 = 捕获所有异常
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception;

    response.status(status).json({
      code: status,
      msg: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

你需要记住几个关键点：

### ✔ `@Catch()` 用来指定要捕获的异常类型

* `@Catch(HttpException)` 捕获所有 HTTP 异常
* `@Catch(TypeError, Error)` 捕获多个类型
* `@Catch()` 捕获所有异常（最常用）

### ✔ `ArgumentsHost` 用来获取 request / response

```ts
const ctx = host.switchToHttp();
const req = ctx.getRequest();
const res = ctx.getResponse();
```

### ✔ 你必须手动 `response.status().json()` 返回值

Nest 默认处理会被你接管。

---

# ⚙️ 四、如何使用 Exception Filter？

### 方式一：方法级

```ts
@Get()
@UseFilters(AllExceptionFilter)
findAll() {
  throw new Error('xxx');
}
```

### 方式二：控制器级

```ts
@UseFilters(AllExceptionFilter)
@Controller('users')
export class UsersController {}
```

### 方式三：全局（main.ts）—最常用

```ts
app.useGlobalFilters(new AllExceptionFilter());
```

### 方式四：全局 Provider（推荐）

```ts
providers: [
  {
    provide: APP_FILTER,
    useClass: AllExceptionFilter,
  },
],
```

这个方式更“DI 风”，也能注入 Service。

---

# 🧨 五、异常类型有哪些？（Filter 会捕获哪种？）

Nest 里的异常通常有两大类：

## 1）HTTP 异常（HttpException）

内置的，比如：

* `BadRequestException`
* `UnauthorizedException`
* `ForbiddenException`
* `NotFoundException`
* `InternalServerErrorException`

抛法：

```ts
throw new BadRequestException('参数错误');
```

Filter 能捕获并格式化。

---

## 2）普通 JS 异常（Error / TypeError / SyntaxError）

比如：

```ts
throw new Error('数据库连接失败');
```

Filter 同样能捕获，只要：

* 用 `@Catch()`
* 或用 `@Catch(Error)`

---

# 🧠 六、Exception Filter 常见用途（重点集锦）

### ✔ 1. 自定义全局错误格式（企业最常用）

例如标准格式：

```json
{
  "code": 500,
  "msg": "系统错误",
  "path": "/api/user",
  "timestamp": "2024-01-10T08:00:00.000Z"
}
```

### ✔ 2. 打印请求日志 / 错误日志（接企业日志系统）

```ts
console.error(exception);
```

或者写入：

* Winston
* Pino
* Sentry
* ELK

### ✔ 3. 捕获数据库错误（如唯一约束冲突）

```ts
@Catch(QueryFailedError)
```

### ✔ 4. 优化第三方服务错误提示

例如 Axios 错误：

```ts
@Catch(AxiosError)
```

### ✔ 5. 统一处理 ValidationPipe 的错误

ValidationPipe 抛出 `BadRequestException(List_of_errors)`
Filter 可以把它整理成更美观的提示。

---

# 🧱 七、Exception Filter 的高级用法

## 1）针对不同异常类型自定义不同逻辑

```ts
@Catch(HttpException, QueryFailedError)
export class HttpAndDbExceptionFilter {}
```

## 2）区分不同应用场景

```ts
if (environment === 'production') {
  // 返回安全信息
} else {
  // 返回详细 stack
}
```

## 3）Filter 中可以注入 Service（例如日志 Service）

```ts
constructor(private loggerService: LoggerService) {}
```

> ⚠️ 只有用 APP_FILTER 方式时才能注入（因为 main.ts 创建的实例不能做 DI）。

---

# 🔥 八、Exception Filter 与其他组件的关系（面试考点）

请求生命周期顺序：

```
Middleware
  → Guard
    → Pipe
      → Interceptor (Before)
        → Controller
          → Service
        → Interceptor (After)
      → Exception Filter <--- 捕获全局异常
Response
```

> **Filter 是所有组件后面兜底的异常管理层。**

---

# 🗂 九、异常过滤器知识点总览（速记版）

```
Exception Filter
 ├─ 作用：捕获异常 → 格式化 → 返回自定义响应
 ├─ 写法：实现 ExceptionFilter + @Catch()
 ├─ 获取上下文：ArgumentsHost → Request/Response
 ├─ 返回方式：response.status().json()
 ├─ 引入位置
 │    ├─ 方法级：@UseFilters()
 │    ├─ 控制器级：@UseFilters()
 │    ├─ 全局级：app.useGlobalFilters()
 │    └─ 全局 provider：APP_FILTER（推荐）
 ├─ 常用场景
 │    ├─ 统一错误格式
 │    ├─ 全局错误日志
 │    ├─ 捕获 HTTP / DB / 第三方异常
 │    └─ 优化 ValidationPipe 错误结构
 ├─ 高阶技巧
 │    ├─ 多异常类型捕获
 │    ├─ Filter 中注入 Service
 │    ├─ 生产/开发不同返回内容
 └─ 生命周期
      └─ 所有组件之后执行，兜底错误处理
```

---

如果你愿意，我还能做：

### ✓ 生成一份“统一企业级异常处理”的最佳实践代码

包含：全局 Filter + LoggingService + HttpException 扩展

### ✓ 给你绘制“Exception Filter 的全链路流程图”

让你彻底理解在 Nest 请求生命周期中的位置

告诉我你想继续哪一块？
