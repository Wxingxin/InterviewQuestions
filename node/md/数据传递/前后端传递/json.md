这里我们来搞一个比较系统的
**「JSON 在 axios 和 NestJS 里的使用大全」**，
看完你基本就能把“前端 axios + 后端 Nest 用 JSON 通信”这一套吃透。

---

## 一、先说清楚：JSON 在 HTTP 里长啥样？

典型请求头 + 请求体：

```http
POST /api/users HTTP/1.1
Content-Type: application/json

{"username": "tom", "age": 18}
```

* Header：`Content-Type: application/json`
* Body：一个 JSON 字符串

绝大多数 **REST 接口** 都是这么干的。

---

## 二、axios 里用 JSON（前端）

### 2.1 最重要的一句：axios 默认就是 JSON

只要你这样写：

```ts
axios.post('/api/users', {
  username: 'tom',
  age: 18,
});
```

axios 会自动帮你做两件事：

1. 把对象 `{ username: 'tom', age: 18 }` 转成 JSON 字符串
2. 在请求头里加：`Content-Type: application/json;charset=utf-8`

所以大部分时候你**啥都不用配**，直接传 JS 对象就行。

---

### 2.2 各种 HTTP Method + JSON body

#### 1）POST

```ts
axios.post('/api/users', {
  username: 'tom',
  age: 18,
});
```

---

#### 2）PUT（全量更新）

```ts
axios.put('/api/users/123', {
  username: 'tom-new',
  age: 20,
});
```

---

#### 3）PATCH（部分更新）

```ts
axios.patch('/api/users/123', {
  age: 21,
});
```

---

#### 4）DELETE（有些后端也会要求带 body）

```ts
axios.delete('/api/users/123', {
  data: {
    reason: 'user-request',
  },
});
```

注意：axios 的 DELETE 如果要带 body，要用 `config.data`。

---

### 2.3 JSON + 路径参数 + query 混用

```ts
axios.post(
  `/api/users/${id}`,      // URL param
  { name: 'Tom' },         // JSON body
  { params: { notify: true } }, // ?notify=true（query）
);
```

对应后端可以用：

* `@Param('id')`
* `@Query('notify')`
* `@Body()`（JSON）

---

### 2.4 手动指定 header（一般不需要，但你可以）

```ts
axios.post(
  '/api/users',
  { username: 'tom' },
  {
    headers: {
      'Content-Type': 'application/json',
    },
  },
);
```

只有在你动过全局默认 / 被别的拦截器改乱了的时候，才需要手动写。

---

### 2.5 配合 TypeScript：响应类型声明

```ts
interface User {
  id: number;
  username: string;
  age: number;
}

axios
  .post<User>('/api/users', {
    username: 'tom',
    age: 18,
  })
  .then((res) => {
    // res.data: User 类型
    console.log(res.data.id);
  });
```

也可以封装：

```ts
const api = axios.create({
  baseURL: '/api',
});

export const createUser = (data: { username: string; age: number }) =>
  api.post<User>('/users', data);
```

---

### 2.6 请求/响应拦截器里统一处理 JSON

比如统一给 JSON 请求加某些 header：

```ts
api.interceptors.request.use((config) => {
  // 只针对有 data 的请求（POST/PUT/PATCH…）
  if (config.data && !config.headers!['Content-Type']) {
    config.headers!['Content-Type'] = 'application/json';
  }
  return config;
});
```

---

## 三、NestJS 里用 JSON（后端）

Nest（基于 Express/Fastify）默认就会解析 `Content-Type: application/json` 的 body，
你只要用 `@Body()` 就能拿到对象。

### 3.1 最基础的用法：`@Body()` 接 JSON

```ts
import { Controller, Post, Body } from '@nestjs/common';

class CreateUserDto {
  username: string;
  age: number;
}

@Controller('users')
export class UsersController {
  @Post()
  create(@Body() body: CreateUserDto) {
    // body = { username: 'tom', age: 18 }
    return {
      ...body,
      id: 1,
    };
  }
}
```

axios 调用：

```ts
axios.post('/api/users', {
  username: 'tom',
  age: 18,
});
```

---

### 3.2 @Body('xxx') 取单个字段

```ts
@Controller('auth')
export class AuthController {
  @Post('login')
  login(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return { username, password };
  }
}
```

但实战中，更推荐 DTO（下一个小节）。

---

### 3.3 DTO + ValidationPipe（Nest 使用 JSON 的标配）

#### 1）定义 DTO

```ts
// users/dto/create-user.dto.ts
import { IsInt, IsString, Min, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 20)
  username: string;

  @IsInt()
  @Min(0)
  age: number;
}
```

#### 2）Controller 中使用

```ts
import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  @Post()
  create(@Body() dto: CreateUserDto) {
    // dto 已经过类型 & 校验
    return dto;
  }
}
```

#### 3）全局开启 ValidationPipe（main.ts）

```ts
import { ValidationPipe } from '@nestjs/common';

app.useGlobalPipes(
  new ValidationPipe({
    transform: true,   // 把 JSON 字符串里的数字转换成 number
    whitelist: true,   // 去掉 DTO 里没定义的多余字段
  }),
);
```

> 不管 body 是 JSON 还是 urlencoded，ValidationPipe 都能处理。

---

### 3.4 不同 HTTP Method + JSON

#### POST：创建

```ts
@Post()
create(@Body() dto: CreateUserDto) {
  // ...
}
```

---

#### PUT：全量更新

```ts
import { Put, Param, ParseIntPipe } from '@nestjs/common';

class UpdateUserDto {
  username?: string;
  age?: number;
}

@Put(':id')
update(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: UpdateUserDto,
) {
  return { id, ...dto };
}
```

axios：

```ts
axios.put(`/api/users/${id}`, {
  username: 'newName',
  age: 20,
});
```

---

#### PATCH：部分更新

```ts
import { Patch } from '@nestjs/common';

@Patch(':id')
partialUpdate(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: UpdateUserDto,
) {
  return { id, ...dto };
}
```

axios：

```ts
axios.patch(`/api/users/${id}`, { age: 21 });
```

---

#### DELETE：如需 JSON body

Nest 这边：

```ts
import { Delete, Body } from '@nestjs/common';

@Delete()
delete(@Body() body: { ids: number[] }) {
  return { deleted: body.ids };
}
```

axios：

```ts
axios.delete('/api/users', {
  data: { ids: [1, 2, 3] },
});
```

---

### 3.5 JSON + 路径参数 + query 同时使用

```ts
import { Controller, Put, Param, Query, Body, ParseIntPipe } from '@nestjs/common';

class UpdateUserDto {
  name?: string;
  age?: number;
}

@Controller('users')
export class UsersController {
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,          // /users/:id
    @Query('notify') notify: string,                // ?notify=true
    @Body() dto: UpdateUserDto,                     // JSON body
  ) {
    return {
      id,
      notify,
      dto,
    };
  }
}
```

axios：

```ts
axios.put(
  `/api/users/${id}`,
  { name: 'Tom', age: 20 },           // JSON body
  { params: { notify: true } },       // query
);
```

---

## 四、NestJS 返回 JSON 给 axios（响应）

Nest 默认返回的就是 JSON。

```ts
@Controller('users')
export class UsersController {
  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return {
      id,
      username: 'tom',
      age: 18,
    };
  }
}
```

axios 端：

```ts
axios.get('/api/users/1').then((res) => {
  // res.data = { id: 1, username: 'tom', age: 18 }
});
```

除非你专门用 `@Res()` 自己写，否则 Nest 会自动帮你做 JSON 序列化：

* `Content-Type: application/json; charset=utf-8`
* body：`{"id":1,"username":"tom","age":18}`

---

## 五、JSON 使用中的常见坑

1. **Content-Type 不匹配**

   * body 是 JSON 字符串，但 header 写了 `application/x-www-form-urlencoded`
   * 或反过来
   * 这会导致 Nest 的 bodyParser 按错方式解析，要么报错要么拿不到 body

2. **axios DELETE body 写错位置**

   * 正确写法：`axios.delete(url, { data: {...} })`
   * 写成 `axios.delete(url, {...})` 第二个参数被当成 config，不会成为 body

3. **类型转换问题**

   * JSON 里数字是数字没问题，但 URL query 里的数字默认是字符串；
   * 对 body 也建议配合 `ValidationPipe` + `class-transformer`，避免全是 `string`。

4. **@Body() 只能用一次（拿 DTO），别写多个 DTO 参数**

   ```ts
   // ❌ 这样不行
   create(@Body() dto1: A, @Body() dto2: B) {}
   ```

   正确做法：

   * 要么用一个 DTO，里面包含所有字段
   * 要么用 `@Body('xxx')` 单个字段

5. **大 JSON / 嵌套深时考虑限制大小**

   * Express 默认 `limit: 100kb`，Nest 用默认值
   * 如果你真要超大 JSON，可以在 main.ts 调整 bodyParser 限制，但要注意安全

---

## 六、小总结：前后端 JSON 配合套路

### 前端（axios）习惯用法

```ts
const api = axios.create({
  baseURL: '/api',
});

// GET (query)
api.get('/users', { params: { page: 1, pageSize: 10 } });

// POST (JSON body)
api.post('/users', { username: 'tom', age: 18 });

// PUT / PATCH
api.put(`/users/${id}`, { name: 'Tom' });
api.patch(`/users/${id}`, { age: 20 });
```

### 后端（Nest）

```ts
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  ParseIntPipe,
} from '@nestjs/common';

class CreateUserDto {
  username: string;
  age: number;
}

class UpdateUserDto {
  username?: string;
  age?: number;
}

@Controller('users')
export class UsersController {
  @Get()
  list(@Query('page') page = 1, @Query('pageSize') pageSize = 10) {
    return { page: +page, pageSize: +pageSize, list: [] };
  }

  @Get(':id')
  detail(@Param('id', ParseIntPipe) id: number) {
    return { id, username: 'tom', age: 18 };
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return { id: 1, ...dto };
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return { id, ...dto };
  }

  @Patch(':id')
  partialUpdate(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return { id, ...dto };
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return { deleted: id };
  }
}
```

---

如果你愿意，你可以把你现在的 **某个具体接口** 的前后端代码贴出来（比如“登录接口”、“创建订单接口”），我可以帮你直接按「最佳实践」方式改成：axios JSON 调用 + Nest DTO + 校验的一套完整写法。
