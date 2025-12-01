下面这一份就是 **NestJS Controller 的「知识点大全 + 使用方式 + 引入方式 + 典型写法 + 最佳实践」**——不废话、不发散，只讲 Controller 本身该讲的内容。
我会让它像一张收纳得当的抽屉柜，每个关键点都能一眼找到。

---

# 🧭 一、Controller 是什么？（核心定义）

> **Controller 是 NestJS 中专门用来处理“请求入口”的类。
> 它负责接收请求 → 解析参数 → 调用 Service 完成业务 → 返回响应。**

它不会写业务逻辑，那是 **Service** 的工作；
它只是“面向客户端的 API 层”。

通俗一点说：

* Middleware：大门外的保安
* Guard：大门口的资格审查
* Pipe：给来访者“整理衣服”
* **Controller：前台接待员**（把需求转给后台业务人员 Service）

---

# 📍 二、Controller 要在哪里引入？

只需记住一句：

> **Controller 必须在某个 Module 的 `controllers` 数组中声明，Nest 才会识别它。**

例如：

```ts
// users.module.ts
@Module({
  controllers: [UsersController],  // <-- 在这里引入
  providers: [UsersService],
})
export class UsersModule {}
```

否则 Nest 根本不会扫描到这个 Controller，也不会注册路由。

---

# 🧩 三、Controller 的基本结构（最核心模板）

```ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')  // 路由前缀
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll(); // GET /users
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id); // GET /users/123
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto); // POST /users
  }
}
```

Controller 的三个特点：

1. **路由前缀**（类级别的 @Controller）
2. **具体路由方法**（如 @Get/@Post 等）
3. **注入 Service 完成功能**

---

# ⚙️ 四、Controller 的路由装饰器大全

下面是 Controller 的“菜单”，非常重要。

## 1. HTTP 方法装饰器

| 方法           | 说明         |
| ------------ | ---------- |
| `@Get()`     | 处理 GET 请求  |
| `@Post()`    | POST       |
| `@Put()`     | PUT        |
| `@Delete()`  | DELETE     |
| `@Patch()`   | PATCH      |
| `@Options()` | OPTIONS    |
| `@Head()`    | HEAD       |
| `@All()`     | 所有 HTTP 方法 |

可加路径：

```ts
@Get('profile')   // GET /users/profile
@Post('login')    // POST /users/login
```

---

## 2. 参数装饰器（从请求中取值）

这些装饰器帮助从不同地方取参数：

| 装饰器                | 获取内容                 |
| ------------------ | -------------------- |
| `@Param()`         | 路径参数                 |
| `@Query()`         | URL 查询参数             |
| `@Body()`          | 请求体 JSON             |
| `@Headers()`       | 指定 Header            |
| `@Req()`           | 原始 Request 对象        |
| `@Res()`           | 原始 Response（手动返回时使用） |
| `@Ip()`            | 请求 IP                |
| `@Session()`       | session              |
| `@UploadedFile()`  | 单文件上传                |
| `@UploadedFiles()` | 多文件上传                |

示例：

```ts
@Get(':id')
findOne(@Param('id') id: string) {}
```

```ts
@Get()
search(@Query('keyword') key: string) {}
```

```ts
@Post()
create(@Body() dto: UserDto) {}
```

---

# 📦 五、Controller 如何组合其它核心功能？

Controller 是“流程中心点”。

它能直接用：

### ✔ 1. Guard（鉴权）

```ts
@UseGuards(AuthGuard)
@Get()
findAll() {}
```

### ✔ 2. Pipe（参数校验）

```ts
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {}
```

### ✔ 3. Interceptor（统一返回 / 日志等）

```ts
@UseInterceptors(TransformInterceptor)
@Post()
create(@Body() dto) {}
```

### ✔ 4. Filter（异常过滤）

```ts
@UseFilters(HttpExceptionFilter)
@Get()
findAll() {}
```

Controller 本身不是做这些逻辑的，但它可以**挂载**这些功能。

---

# 🧠 六、Controller 必须连接 Service（最佳实践）

Controller 不处理业务，Service 才处理业务。

错误写法（不推荐）：

```ts
@Post()
create(@Body() dto) {
  // ❌ 不要在 Controller 写业务逻辑
}
```

正确写法：

```ts
@Post()
create(@Body() dto: CreateUserDto) {
  return this.userService.create(dto);
}
```

依赖注入构造：

```ts
constructor(private readonly userService: UsersService) {}
```

---

# 🌉 七、Controller 的高级模式（常用但不常被讲清楚）

## 1. 多级路由前缀

```ts
@Controller({ path: 'users', version: '1' })
```

或结合全局版本化：

```
/v1/users
```

---

## 2. 多参数类型处理

```ts
@Get(':id/:name')
find(@Param() params) {}  // params = { id, name }
```

---

## 3. 自定义路由匹配规则

Nest 支持完整的 Express 风格：

```ts
@Get('ab*cd')  // abxcd / ab123cd 都能匹配
handler() {}
```

---

## 4. 返回流/文件

```ts
@Get('download')
download(@Res() res: Response) {
  res.download('/path');
}
```

---

## 5. 处理文件上传

```ts
@Post('upload')
@UseInterceptors(FileInterceptor('file'))
upload(@UploadedFile() file) {
  return file;
}
```

---

# 🧱 八、Controller 的最佳实践（工作中最常用）

### ✔ 1. Controller 永远不要写业务逻辑

保持干净：

* 接收参数
* 调用 Service
* 返回结果

### ✔ 2. DTO + ValidationPipe 必须配合使用

```ts
@Post()
create(@Body() dto: CreateUserDto) {}
```

### ✔ 3. Service 注入必须用 `constructor(private service: ...)`

不要在方法里 new Service。

### ✔ 4. 将通用逻辑放在 Guard/Pipe/Interceptor，而不是 Controller

Controller 应该保持轻量。

### ✔ 5. 使用 @ApiXXX（Swagger）自动生成接口文档（企业常用）

---

# 🗂️ 九、Controller 体系总结（速记版）

```
Controller
 ├─ 定义：处理请求入口，连接客户端和 Service
 ├─ 装饰器
 │    ├─ @Controller('prefix') 路由前缀
 │    ├─ @Get/@Post/@Put/@Delete 路由方法
 │    ├─ @Param/@Query/@Body 从请求中取值
 ├─ 引入方式
 │    └─ 必须在 Module 的 controllers 数组声明
 ├─ 常用组合
 │    ├─ Pipe 参数校验
 │    ├─ Guard 鉴权
 │    ├─ Interceptor 统一返回 & 日志
 │    ├─ Filter 异常处理
 ├─ 最佳实践
 │    ├─ 不写业务逻辑
 │    ├─ 永远交给 Service
 │    ├─ 使用 DTO + ValidationPipe
 │    └─ 控制器只处理“输入/输出”
```

---

如果你愿意，我还可以给你：

* **Controller + Service + DTO + Pipe + Guard** 的完整最佳实践范例（生产级）
* 或帮你生成一张“HTTP 请求到达 Controller 的完整生命周期流程图”
* 或结合你项目里的业务，帮你设计 Controller 的模块结构

你需要哪个？
