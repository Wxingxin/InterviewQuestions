下面给你一套 **NestJS Pipes（管道：DTO 校验/参数转换）的完整引入方式说明 + 经典代码模板**。
包含 **全局级 / 控制器级 / 方法级 / 参数级** 四种引入方式，并附上“DTO + Pipe 可直接复制使用的完整示例”。

---

# 🚀 一、Pipes 是干什么的？

NestJS 中的 Pipes 常用于：

* **DTO 校验**（class-validator）
* **参数类型转换**（ParseIntPipe、ParseUUIDPipe）
* **白名单过滤**
* **自定义字段处理**

🌈 Pipes 执行顺序（在 Guard 之后、Controller 前）：

```
Middleware → Guard → Interceptor(before) → **Pipe** → Controller → Service
```

---

# 🎯 二、Pipes 引入的 4 个地方（完整示例）

---

# 1️⃣ 全局引入（最常用：全局 DTO 校验）

大多数项目都会开启全局 ValidationPipe。

📌 **main.ts**

```ts
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局 DTO 校验
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,                // DTO 未声明字段自动过滤
      forbidNonWhitelisted: true,     // 禁止未声明字段
      transform: true,                // 自动转换类型 (如 string -> number)
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
```

优点：

* 所有 Controller 里的 DTO 都自动校验
* 最推荐的做法（Nest 官方也推荐）

---

# 2️⃣ 控制器级引入（只对某个 Controller 生效）

📌 **users.controller.ts**

```ts
import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';

@Controller('users')
@UsePipes(new ValidationPipe({ whitelist: true })) 
export class UsersController {
  @Get()
  findAll() {
    return ['a', 'b'];
  }
}
```

特点：

* `UsersController` 下所有路由都开启 DTO 校验
* 可以覆盖全局设置

---

# 3️⃣ 方法级引入（只对某个方法生效）

📌 **users.controller.ts**

```ts
@Get(':id')
@UsePipes(new ValidationPipe({ transform: true }))
getById() {
  return '...';
}
```

特点：

* 最细粒度的控制方式之一

---

# 4️⃣ 参数级引入（内置 Pipes：ParseIntPipe、ParseUUIDPipe）

📌 **users.controller.ts**

```ts
@Get(':id')
getUser(
  @Param('id', ParseIntPipe) id: number  // 自动转换 string → number
) {
  return { id };
}
```

更多常用 Pipes：

| Pipe             | 功能          |
| ---------------- | ----------- |
| ParseIntPipe     | 把参数转 number |
| ParseUUIDPipe    | 校验是否 UUID   |
| ParseBoolPipe    | 转布尔         |
| DefaultValuePipe | 无值时给默认值     |

---

# 🌟 三、最经典 DTO + Pipe 示例（100% 可用）

---

## 1. DTO（使用 class-validator）

📌 **create-user.dto.ts**

```ts
import { IsString, IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 20)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 20)
  password: string;
}
```

---

## 2. Controller（自动调用 ValidationPipe）

📌 **users.controller.ts**

```ts
import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return {
      message: 'User created',
      data: dto,
    };
  }
}
```

如果开启了全局 ValidationPipe，这里自动生效。

---

# 🔥 四、自定义 Pipe（例如：TrimPipe）

你还可以写自己的 Pipe，例如自动过滤空格：

---

## **自定义 Pipe**

📌 **trim.pipe.ts**

```ts
import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  }
}
```

---

## **在参数级使用**

```ts
@Post('trim')
create(@Body('name', new TrimPipe()) name: string) {
  return { name };
}
```

---

# 🌈 五、整体最佳实践（强烈推荐）

| 场景             | 怎么做                                            | 推荐度   |
| -------------- | ---------------------------------------------- | ----- |
| DTO 校验         | `app.useGlobalPipes(new ValidationPipe(...))`  | ⭐⭐⭐⭐⭐ |
| 字段类型转换         | `transform: true` + `enableImplicitConversion` | ⭐⭐⭐⭐⭐ |
| id 参数校验        | `ParseIntPipe`、`ParseUUIDPipe`                 | ⭐⭐⭐⭐⭐ |
| 自定义校验逻辑        | 自定义 Pipe / class-validator 自定义装饰器              | ⭐⭐⭐⭐  |
| 特定控制器启用专属 Pipe | `@UsePipes()`                                  | ⭐⭐⭐   |

---

# 🎁 六、你要的完整总结（最简用法心智图）

```
Pipe 引入位置：
│
├── main.ts（全局）  ← 最常用（DTO 校验）
│     app.useGlobalPipes(...)
│
├── 控制器级（@UsePipes）
│     @Controller()
│     @UsePipes(...)
│
├── 方法级（@UsePipes）
│     @Get()
│     @UsePipes(...)
│
└── 参数级（@Param/@Body/@Query）
      @Param('id', ParseIntPipe)
      @Body(TrimPipe)
```

---

如果你愿意，我可以给你做一套：

👉 **全局 TraceId + DTO 校验 + 全局异常过滤器 + 请求/响应日志** 的「企业级请求管线模板」

要不要我把这一套也给你？
