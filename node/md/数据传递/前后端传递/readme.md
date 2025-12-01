下面我直接用 **axios 作为前端**、**NestJS 作为后端**，把你说的 5 种 HTTP/HTTPS 传参方式都举一遍：

* URL Param（路径参数）
* Query（查询参数）
* `application/x-www-form-urlencoded`
* `multipart/form-data`
* `application/json`

假设后端统一前缀是：`/api/demo`

---

## 1. URL Param（路径参数：/users/:id）

### 前端（axios）

```ts
// GET /api/demo/users/123
axios.get('/api/demo/users/123');
```

或者用模板字符串：

```ts
const id = 123;
axios.get(`/api/demo/users/${id}`);
```

### 后端（NestJS）

```ts
import { Controller, Get, Param } from '@nestjs/common';

@Controller('demo')
export class DemoController {
  @Get('users/:id')
  getUserById(@Param('id') id: string) {
    return { id, from: 'url-param' };
  }
}
```

> 关键点：`@Param('id')` 对应路由里的 `:id`。

---

## 2. Query 参数（?page=1&kw=abc）

### 前端（axios）

axios 里用 `params` 字段：

```ts
// GET /api/demo/search?page=1&kw=hello
axios.get('/api/demo/search', {
  params: {
    page: 1,
    kw: 'hello',
  },
});
```

### 后端（NestJS）

```ts
import { Controller, Get, Query } from '@nestjs/common';

@Controller('demo')
export class DemoController {
  @Get('search')
  search(
    @Query('page') page: number,
    @Query('kw') kw: string,
  ) {
    return { page, kw, from: 'query' };
  }
}
```

> 关键点：`@Query()` 取的是 `?xxx=yyy` 这种查询字符串。

---

## 3. `application/x-www-form-urlencoded`

常见于传统表单提交 / 登录接口等。

### 前端（axios）

浏览器端可以用 `URLSearchParams` 或第三方库 `qs`，这里用原生：

```ts
const data = new URLSearchParams();
data.append('username', 'tom');
data.append('password', '123456');

axios.post('/api/demo/login', data, {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});
```

### 后端（NestJS）

Nest 默认用了 Express，会自动解析 `urlencoded` body（除非你改配置）。

```ts
import { Controller, Post, Body } from '@nestjs/common';

class LoginDto {
  username: string;
  password: string;
}

@Controller('demo')
export class DemoController {
  @Post('login')
  login(@Body() body: LoginDto) {
    return { ...body, from: 'form-urlencoded' };
  }
}
```

> 关键点：
>
> * `Content-Type: application/x-www-form-urlencoded`
> * Nest 里仍用 `@Body()` 接收，只是解析方式不同。

---

## 4. `multipart/form-data`（表单 + 文件上传）

### 前端（axios）

用 `FormData`，**不要自己手写 boundary**，浏览器会自动加：

```ts
const formData = new FormData();
formData.append('name', 'avatar');
formData.append('file', fileInput.files[0]); // 比如 input[type=file]

axios.post('/api/demo/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
```

### 后端（NestJS）

用 `@UseInterceptors(FileInterceptor())` + Multer 处理文件：

```ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('demo')
export class DemoController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) // 前端 formData 的 key：'file'
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('name') name: string,
  ) {
    return {
      filename: file.originalname,
      size: file.size,
      name,
      from: 'form-data',
    };
  }
}
```

> 关键点：
>
> * `Content-Type: multipart/form-data`
> * 前端 FormData 的字段名要和后端 `FileInterceptor('file')` 对上。
> * 其它非文件字段还是通过 `@Body()` 拿。

---

## 5. `application/json`（最常用）

### 前端（axios）

axios 默认就是 `application/json`：

```ts
axios.post('/api/demo/users', {
  username: 'tom',
  age: 18,
});
```

如果你想手动指定也可以：

```ts
axios.post(
  '/api/demo/users',
  { username: 'tom', age: 18 },
  {
    headers: {
      'Content-Type': 'application/json',
    },
  },
);
```

### 后端（NestJS）

```ts
import { Controller, Post, Body } from '@nestjs/common';

class CreateUserDto {
  username: string;
  age: number;
}

@Controller('demo')
export class DemoController {
  @Post('users')
  createUser(@Body() body: CreateUserDto) {
    return { ...body, from: 'json' };
  }
}
```

> 关键点：
>
> * axios 自动把对象序列化为 JSON，并加上 `Content-Type: application/json`
> * Nest 用 `@Body()` 接 JSON。

---

## 小总结：5 种方式怎么选？

| 类型                                  | 典型场景             | 前端位置              | Nest 装饰器                      |
| ----------------------------------- | ---------------- | ----------------- | ----------------------------- |
| URL Param `/users/:id`              | 资源唯一 ID（详情接口）    | URL 路径            | `@Param()`                    |
| Query `?page=1&kw=xx`               | 过滤 / 分页 / 搜索条件   | `params`          | `@Query()`                    |
| `application/x-www-form-urlencoded` | 传统表单 / 登录等       | `URLSearchParams` | `@Body()`                     |
| `multipart/form-data`               | 上传文件、带文件的表单      | `FormData`        | `@UploadedFile()` + `@Body()` |
| `application/json`                  | 绝大多数 REST 接口的请求体 | 对象（默认 JSON）       | `@Body()`                     |

如果你愿意，我也可以帮你写一个完整的 Nest 模块 + 一组 axios 调用示例，直接能跑的那种。
