好，我们这次**只讲 NestJS 的 Pipes**，而且尽量**紧凑 + 实战向**，不发散到别的概念。

---

## 一、Pipes 是什么？解决什么问题？

一句话概括：

> **Pipe = 请求进来之后，在到达你的 controller handler 之前，对“参数”做转换（transform）和校验（validation）的工具。**

典型用途：

1. **参数校验（Validation）**

   * 比如校验 `id` 必须是数字、`email` 必须是邮箱格式、必填字段不能缺失等。
2. **参数转换（Transformation）**

   * 把字符串 `"123"` 转成数字 `123`
   * 把 `"true"` 转成 `true`
   * 把原始 `body` 映射为一个 DTO 类实例

Pipes 的特点：

* 作用对象：**method 参数**（handler 的入参）
* 时机：**在 Guard 之后，Interceptor / Controller Handler 之前**
* 可以：

  * 修改参数
  * 校验失败时，**直接抛出异常**（常见：`BadRequestException`）

---

## 二、Pipes 在哪里用？三种注入方式

Pipes 可以在三层使用：

1. **参数级别（最细粒度）**
2. **路由/方法级别**
3. **全局级别（对所有路由生效）**

下面配合代码说。

---

### 1. 参数级别使用（最常见）

```ts
@Get(':id')
findOne(
  @Param('id', ParseIntPipe) id: number,  // 对单个参数用 Pipe
) {
  // id 已经是 number 类型了，如果解析失败会抛异常
  return this.service.findOne(id);
}
```

特点：

* 只作用于这个参数 `id`
* Nest 内置很多 pipe（如 `ParseIntPipe`、`ParseBoolPipe` 等）

也可以多个 Pipe 叠加：

```ts
@Get(':id')
findOne(
  @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
  id: number,
) {
  ...
}
```

---

### 2. 方法/路由级别使用

用 `@UsePipes()` 装饰器，给**整个 handler 的所有参数**套用 Pipe：

```ts
@Post()
@UsePipes(ValidationPipe)  // 或 new ValidationPipe()
create(@Body() createUserDto: CreateUserDto) {
  // 这里的 createUserDto 已经按 DTO 校验过
  return this.userService.create(createUserDto);
}
```

特点：

* 该 Pipe 作用于该路由下所有参数（`@Body()、@Param()、@Query()` 等）
* 比参数级别更方便，代码更整洁

---

### 3. 全局级别使用（整个应用）

在 `main.ts` 里：

```ts
const app = await NestFactory.create(AppModule);

app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,          // 只保留 DTO 中有定义的字段
    forbidNonWhitelisted: true, // 发现多余字段就报错
    transform: true,          // 自动类型转换（配合 DTO 类型）
  }),
);

await app.listen(3000);
```

特点：

* 所有的请求 / 所有模块 / 所有 controller 都自动走这个 Pipe
* 最适合用来挂全局 `ValidationPipe` 统一参数校验

> ❗注意：`useGlobalPipes` 一般只在 `bootstrap`（main.ts）里用一次，并且常用于 `ValidationPipe`。

---

## 三、参数校验（Validation）+ DTO 怎么配合 Pipes？

Nest 的参数校验基本都用 `class-validator + class-transformer + ValidationPipe` 这套组合。

### 1. 安装依赖

```bash
npm install class-validator class-transformer
```

### 2. 定义 DTO

```ts
// create-user.dto.ts
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @IsString()
  @Length(6, 20, { message: '密码长度必须在 6-20 位之间' })
  password: string;

  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;
}
```

### 3. Controller 使用 DTO + ValidationPipe

**方式 A：方法级别**

```ts
@Post()
@UsePipes(new ValidationPipe({ whitelist: true }))
create(@Body() dto: CreateUserDto) {
  return this.userService.create(dto);
}
```

**方式 B：全局级别（更推荐）**

```ts
// main.ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
);
```

然后 controller 就简单写：

```ts
@Post()
create(@Body() dto: CreateUserDto) {
  // dto 已经经过 class-validator 校验
  return this.userService.create(dto);
}
```

---

## 四、内置常用 Pipes 列表（重点掌握）

Nest 内置了一些常用 Pipes（直接从 `@nestjs/common` 引入）：

```ts
import {
  ParseIntPipe,
  ParseBoolPipe,
  ParseUUIDPipe,
  ParseFloatPipe,
  DefaultValuePipe,
  ValidationPipe,
} from '@nestjs/common';
```

常见使用场景：

1. **ParseIntPipe**：把字符串转换为数字，失败抛 400

   ```ts
   @Get(':id')
   find(@Param('id', ParseIntPipe) id: number) {}
   ```

2. **ParseBoolPipe**：把 `"true" / "false" / "1" / "0"` 转成 boolean

   ```ts
   @Get()
   find(@Query('active', ParseBoolPipe) active: boolean) {}
   ```

3. **ParseUUIDPipe**：校验是否符合 UUID 格式

   ```ts
   @Get(':id')
   find(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {}
   ```

4. **DefaultValuePipe**：给参数默认值

   ```ts
   @Get()
   find(
     @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
   ) {}
   ```

5. **ValidationPipe**：配合 DTO 做复杂参数校验（**最重要**）

---

## 五、自定义 Pipes：什么时候要自己写？

内置的 Pipe 不够用时，你可以自己写 Pipe，比如：

* 校验 `id` 一定大于 0
* 校验一个字符串必须是你系统内定义的某些枚举值
* 做一些特殊格式转换

### 1. 自定义 Pipe 的基本结构

实现 `PipeTransform` 接口：

```ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParsePositiveIntPipe implements PipeTransform {
  transform(value: any) {
    const val = parseInt(value, 10);

    if (isNaN(val) || val <= 0) {
      throw new BadRequestException('id 必须是大于 0 的整数');
    }

    return val;
  }
}
```

### 2. 使用自定义 Pipe（和内置用法一样）

```ts
@Get(':id')
findOne(@Param('id', ParsePositiveIntPipe) id: number) {
  return this.service.findOne(id);
}
```

或：

```ts
@UsePipes(ParsePositiveIntPipe)
@Get(':id')
findOne(@Param('id') id: number) {
  ...
}
```

---

## 六、Pipes 的执行顺序 / 生命周期简单记一下

一次请求进来，大致顺序是：

1. **Middleware**
2. **Guard**
3. **Interceptors（Before 部分）**
4. **Pipes ➜ 转换 + 校验参数**
5. **Controller Handler**
6. **Interceptors（After 部分）**
7. **返回响应**

所以：

* Pipe 对象是**针对参数**的，它是在进入 handler 之前，对参数做最后一层“过滤 + 塑形”
* 若 Pipe 中抛出异常，后面的 handler 就不会执行

---

## 七、总结：你需要记住的点（浓缩版）

1. **Pipes 核心作用：**

   * **Transform**（转换参数类型）
   * **Validate**（校验参数合法性）

2. **使用位置：**

   * 参数级别：`@Param('id', ParseIntPipe) id: number`
   * 方法级别：`@UsePipes(ValidationPipe)`
   * 全局级别：`app.useGlobalPipes(new ValidationPipe())`

3. **参数校验/DTO 实战套路：**

   * 定义 DTO + `class-validator` 装饰器
   * 启用 `ValidationPipe`（全局或方法级别）
   * 在 controller 里用 `@Body() dto: XxxDto`

4. **重点内置 Pipes：** `ParseIntPipe / ParseBoolPipe / ParseUUIDPipe / DefaultValuePipe / ValidationPipe`

5. **需要复杂逻辑时，自己写 Pipe，继承 `PipeTransform`，在 `transform()` 里处理并抛异常。**

---

如果你愿意，下一步我可以帮你：

* 按“**考试/面试复习大纲**”形式，把 Pipes 相关的**考点清单**列出来（题目 + 答案），方便你背。
* 或者基于你现在的项目，帮你设计一套**DTO + ValidationPipe** 的最佳实践目录结构。
