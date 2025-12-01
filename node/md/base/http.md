下面这一份，是专门为你整理的 **NestJS 中的 HTTP Request & HTTP Response「知识点大全」**。
内容非常聚焦：

* **是什么**
* **在哪儿引入**
* **怎么使用（全部方式）**
* **高级技巧**
* **最佳实践**

这两个对象是整个框架的“空气层”，理解之后，你会真正掌控整个请求生命周期。

---

# 🛰️ 一、在 NestJS 中，HTTP Request / Response 是什么？

NestJS 底层默认基于 **Express**（也可切换 Fastify），所以：

* `Request` 实际上是 **express.Request**
* `Response` 实际上是 **express.Response**

它们是原生对象，不是 Nest 自己创造的。

NestJS 提供了很优雅的方式让你访问它们，例如：

* `@Req()` 获取 Request
* `@Res()` 获取 Response
* `@Headers()` 读 header
* `@Ip()` 获取访问 IP
* `@Body()` 自动解析请求体（JSON）
* `@Query()` 获取查询参数

> **要点：绝大多数时候你不需要直接操作 Response，因为 Nest 提供了自动响应处理机制。**
> 只有需要“手动返回”时才会用到 `@Res()`。

---

# 🧭 二、HTTP Request / Response 要在哪里引入？

非常简单：
**只在 Controller 层使用（绝不在 Service 使用）。**

因为：

* Controller = HTTP 层
* Service = 业务层（纯逻辑）

你绝不能在 Service 注入 Request/Response，那会让你的代码“变味”。

👉 所以它们引入方式只有一种：**Controller 方法的参数装饰器**

例如：

```ts
@Get()
getUser(@Req() req: Request, @Res() res: Response) {}
```

你永远不需要在 Module 里引入它们，也不需要 providers。

---

# 🧱 三、Request（请求）知识点大全 & 用法全收录

你可以通过 **参数装饰器** 获取 Request 中任意内容。

---

## 1）获取整个 Request 对象

```ts
@Get()
getReq(@Req() req: Request) {
  console.log(req.url);
  console.log(req.headers);
  console.log(req.method);
}
```

能拿到的典型属性：

* `req.method`
* `req.url`
* `req.headers`
* `req.query`
* `req.params`
* `req.body`
* `req.cookies`
* `req.ip`

---

## 2）获取 Body（请求体）

推荐方式（Nest 自动解析 JSON）：

```ts
@Post()
create(@Body() dto: CreateUserDto) {}
```

单字段：

```ts
@Body('email') email: string
```

---

## 3）获取 Query（查询参数）

```ts
@Get()
find(@Query('page') page: number) {}
```

对象方式：

```ts
@Get()
find(@Query() query: FindUserQueryDto) {}
```

---

## 4）获取 URL Params（路径参数）

```ts
@Get(':id')
findOne(@Param('id') id: string) {}
```

---

## 5）获取 Header

```ts
@Get()
getHeader(@Headers('authorization') auth: string) {}
```

---

## 6）获取 IP

```ts
@Get()
getIp(@Ip() ip: string) {
  return ip;
}
```

---

## 7）获取 Cookie（需安装 cookie-parser）

main.ts 中：

```ts
app.use(cookieParser());
```

controller：

```ts
@Get()
find(@Req() req) {
  console.log(req.cookies);
}
```

---

## 8）获取 Session（需使用 express-session）

```ts
@Get()
getSession(@Session() session) {
  session.count = (session.count || 0) + 1;
}
```

---

# 🔥 四、Response（响应）知识点大全 & 使用方式

NestJS 中 Response 有两种使用方式：

---

# ⭐ 方式 1：Nest 自动响应（最推荐）

你只需要 return 即可：

```ts
@Get()
findAll() {
  return { message: 'ok' };
}
```

Nest 会自动：

* 设置 content-type
* 转 JSON
* 设置状态码（200）
* 自动处理异常过滤器、拦截器

这是绝大多数情况下的**正确选择**。

---

# ⭐ 方式 2：手动操作 Response（@Res()）

只有当你需要**特殊控制**时才使用，例如：

* 文件下载
* 文件流
* 重定向
* 手动设置 header
* 流式响应
* 自定义 content-type

使用方式：

```ts
@Get()
get(@Res() res: Response) {
  res.status(200).json({ message: 'ok' });
}
```

---

## 1）直接返回 JSON

```ts
res.status(200).json({ code: 0, data: [] });
```

---

## 2）发送文本

```ts
res.send('Hello world');
```

---

## 3）文件下载

```ts
@Get('download')
download(@Res() res: Response) {
  res.download('/path/to/file.pdf');
}
```

---

## 4）重定向

```ts
@Get('home')
redirect(@Res() res: Response) {
  res.redirect('https://www.google.com');
}
```

---

## 5）设置 header

```ts
res.setHeader('Content-Type', 'text/plain');
res.send('OK');
```

---

## 6）流式响应（如大文件 / SSE）

```ts
@Get('stream')
stream(@Res() res: Response) {
  const stream = fs.createReadStream('bigfile.mp4');
  stream.pipe(res);
}
```

---

# ⚠️ 重要：使用 @Res() 会关闭 Nest 自动响应系统

当你使用 `@Res()` 时：

* 拦截器包装（比如统一返回格式）失效
* Nest 的异常过滤器默认格式失效
* Nest 不会帮你自动返回 JSON
* 你必须手动 `res.status().json()` 或 `res.send()`

**所以请只在必要时使用 @Res()。**

---

# 🧠 五、Request & Response 在 Nest 生命周期中的位置

```
Middleware   ← 可以读/改 Request
Guard        ← 可以读 Request，不操作 Response
Pipe         ← 只处理参数
Controller   ← 能用 Request / Response
Interceptor  ← Before / After 处理 Request/Response
ExceptionFilter ← 操作 Response
```

R&R 涉及到的组件：

| 组件               | 可否访问 Request？ | 可否访问 Response？ |
| ---------------- | ------------- | -------------- |
| Middleware       | ✔             | ✔              |
| Guard            | ✔             | ✔（不建议）         |
| Pipe             | ❌（只有参数）       | ❌              |
| Controller       | ✔             | ✔              |
| Interceptor      | ✔             | ✔              |
| Exception Filter | ✔             | ✔              |

---

# 🧱 六、高级技巧 / 常见场景

### ✔ 1. 使用 Decorator 创建“自定义 Request 参数提取器”

例如创建一个 @User()：

```ts
export const User = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  }
);
```

Controller 使用：

```ts
@Get()
getUser(@User() user) {}
```

---

### ✔ 2. 使用 Express 原生能力：req/res 中塞数据

如在中间件里：

```ts
req.userAgent = req.headers['user-agent'];
```

Controller：

```ts
@Req() req;
console.log(req.userAgent);
```

---

### ✔ 3. Response 流模式常用于：

* 大文件
* 直播流（Flv/HLS）
* SSE（服务端事件）
* PDF/Excel 导出

---

### ✔ 4. 配合 Interceptor，Request/Response 完成统一日志

Interceptor：

```ts
const now = Date.now();
return next.handle().pipe(
  tap(() => {
    console.log(`${req.method} ${req.url} - ${Date.now() - now}ms`);
  })
);
```

---

# 🌉 七、最佳实践（非常重要）

### ✔ 1. Controller 优先使用 “自动响应”（return）

只有需要特殊行为时才用 `@Res()`。

### ✔ 2. Request 永远不要注入到 Service（只在 Controller 用）

保持业务逻辑的纯洁性。

### ✔ 3. DTO + ValidationPipe 用来校验 Body/Query（不要手写判断）

### ✔ 4. 用自定义 Decorator 来封装复杂请求提取逻辑

### ✔ 5. 统一返回格式应该使用 Interceptor，而不是在 Controller 手动拼 JSON

---

# 🗂 八、知识点总览（速记版）

```
HTTP Request
 ├─ 来源：Express/Fastify 原生对象
 ├─ Controller 方式：@Req() @Body() @Query() @Param() @Headers() @Ip()
 ├─ 常用内容：url, headers, method, cookies, session, user
 └─ 使用场景：读取参数、客户端信息、cookies、IP、会话

HTTP Response
 ├─ Controller：自动响应（return）最推荐
 ├─ 手动响应：@Res() → res.json()/send()/redirect()/download()
 ├─ 使用场景：文件下载、流、重定向、特殊 header
 └─ 注意：使用 @Res() 会关闭自动响应链

引入位置
 ├─ 只能在 Controller 方法参数中
 ├─ 不会在 Module 中声明
 └─ 不应该在 Service 中使用

生命周期
 └─ Middleware → Guard → Pipe → Controller → Interceptor → Filter
```

---

如果你愿意，我还可以继续帮你整理：

### ✓ “HTTP 请求生命周期全流程图（Request → Response）”

### ✓ “Express vs Fastify 在 Nest 中的 Request/Response 差异表”

### ✓ “文件下载/上传/流式下载的最佳实践代码集”

你想继续哪一块？
