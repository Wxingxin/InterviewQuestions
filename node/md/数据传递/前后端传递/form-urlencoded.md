下面我给你整理一个 **「`application/x-www-form-urlencoded` 在 axios 和 NestJS 中的使用大全」**，包括：

* 这玩意到底是啥、和 JSON 有啥区别
* axios 端的各种写法（浏览器 / Node、手动 / 自动）
* NestJS 后端怎么接收、验证、配合 DTO
* 数组、嵌套对象这类「坑点」怎么处理

---

## 一、`application/x-www-form-urlencoded` 是啥？

简单理解：
就是 **「把表单里的键值对拼成查询字符串那种格式，然后放在请求体里」**。

例如这个对象：

```js
{
  username: 'tom',
  password: '123456'
}
```

用 `application/x-www-form-urlencoded` 编码后变成：

```txt
username=tom&password=123456
```

常见场景：

* 传统表单提交（HTML `<form>` 默认）
* 某些老接口、OAuth2 登录、微信/支付类接口等
* 后端要求必须是 `x-www-form-urlencoded` 而不是 JSON 的情况

---

## 二、axios 中如何发送 `form-urlencoded`

> 关键点：**只要你把请求体变成“查询字符串”那种格式，并设置 `Content-Type` 就行了。**

### 2.1 浏览器端最常用的：`URLSearchParams`

```ts
const data = new URLSearchParams();
data.append('username', 'tom');
data.append('password', '123456');

axios.post('/api/auth/login', data, {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});
```

* `URLSearchParams` 会自动编码为 `username=tom&password=123456`
* axios 发现你传的是 `URLSearchParams` 会直接当作 `form-urlencoded` 发出去

PUT / PATCH 也是一样：

```ts
axios.put('/api/user/profile', data, {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});
```

---

### 2.2 使用 `qs` 库来转换（更灵活）

当你需要：

* 数组支持
* 嵌套对象
* 特定序列化规则

就用 `qs`（非常常见）：

```bash
npm install qs
```

```ts
import qs from 'qs';

axios.post(
  '/api/auth/login',
  qs.stringify({
    username: 'tom',
    password: '123456',
  }),
  {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  },
);
```

`qs.stringify` 会输出：

```txt
username=tom&password=123456
```

#### 数组 / 嵌套对象例子

```ts
qs.stringify(
  {
    tags: ['js', 'nestjs'],
    filter: { status: 'active', type: 'vip' },
  },
  { arrayFormat: 'repeat' },
);

// => tags=js&tags=nestjs&filter[status]=active&filter[type]=vip
```

---

### 2.3 **不要**只改 header 不编码 body

**错误示例（很多人会踩）：**

```ts
axios.post(
  '/api/auth/login',
  { username: 'tom', password: '123456' },
  {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  },
);
```

> 你 header 写成了 `x-www-form-urlencoded`，但 **body 实际还是 JSON**，部分后端会解析失败。

**记住：**
只要你用 `x-www-form-urlencoded`，**请求体必须是字符串（已编码好的）**，不能直接是 JS 对象。

---

### 2.4 全局拦截器：自动把某些请求转成 `form-urlencoded`（高级一点）

如果项目里一堆接口都要 `form-urlencoded`，可以用 axios 拦截器统一转换：

```ts
import axios from 'axios';
import qs from 'qs';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  // 只对手动标记的请求做 form-urlencoded
  if (config.headers && config.headers['Content-Type'] === 'application/x-www-form-urlencoded' && config.data && typeof config.data === 'object') {
    config.data = qs.stringify(config.data);
  }
  return config;
});

// 用法：只要这样写就会自动 stringify
api.post(
  '/auth/login',
  { username: 'tom', password: '123456' },
  { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
);
```

---

### 2.5 TS 封装一个好用的 helper

```ts
import axios from 'axios';
import qs from 'qs';

const api = axios.create({
  baseURL: '/api',
});

function postForm<T>(url: string, data: any) {
  return api.post<T>(
    url,
    qs.stringify(data),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );
}

// 业务里直接用：
postForm('/auth/login', {
  username: 'tom',
  password: '123456',
});
```

---

## 三、NestJS 中如何接收 `form-urlencoded` 请求

好消息：
**Nest（基于 Express/Fastify）默认就支持 `application/x-www-form-urlencoded` 解析**，你只要用 `@Body()` 就能拿到了。

---

### 3.1 最基础的使用：`@Body()` 就够了

```ts
import { Controller, Post, Body } from '@nestjs/common';

class LoginDto {
  username: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  @Post('login')
  login(@Body() body: LoginDto) {
    // body = { username: 'tom', password: '123456' }
    return {
      from: 'form-urlencoded',
      body,
    };
  }
}
```

配合前端（axios + `URLSearchParams` 或 `qs`）就能跑起来。

---

### 3.2 确保启用了 urlencoded 解析（一般默认开启）

正常 Nest 项目里你不需要管，但如果你动过全局配置，或者关闭了 bodyParser，可以这样手动开：

```ts
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 显式配置 urlencoded 解析（可选）
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  await app.listen(3000);
}
bootstrap();
```

大部分场景不用写，因为 Nest 默认帮你配置好了。

---

### 3.3 配合 DTO + ValidationPipe（强烈推荐）

比起直接 `@Body() body: any`，实战更推荐 DTO + 校验。

#### 1）定义 DTO

```ts
// auth/dto/login.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
```

#### 2）Controller 使用

```ts
import { Controller, Post, Body } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  @Post('login')
  login(@Body() dto: LoginDto) {
    // dto 已经过验证，字段类型也正确
    return dto;
  }
}
```

#### 3）全局开启校验（`main.ts`）

```ts
import { ValidationPipe } from '@nestjs/common';

app.useGlobalPipes(
  new ValidationPipe({
    transform: true,   // 自动类型转换
    whitelist: true,   // 只保留 DTO 中定义的字段
  }),
);
```

无论 body 是 JSON 还是 `form-urlencoded`，ValidationPipe 都会照样处理。

---

### 3.4 单字段拿：`@Body('xxx')`

有时只想取某几个字段：

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

---

### 3.5 `form-urlencoded` + 其它参数混用

例如：

* 路径里有 id（`/users/:id`）
* query 里有 `redirect`
* body 是 `x-www-form-urlencoded`

```ts
import { Controller, Post, Param, Query, Body } from '@nestjs/common';

class UpdateUserDto {
  name?: string;
  age?: number;
}

@Controller('users')
export class UsersController {
  @Post(':id')
  updateUser(
    @Param('id') id: string,
    @Query('redirect') redirect: string,
    @Body() body: UpdateUserDto,  // form-urlencoded or json 均可
  ) {
    return { id, redirect, body };
  }
}
```

前端 axios（`form-urlencoded` body + query）：

```ts
import qs from 'qs';

axios.post(
  `/api/users/${id}?redirect=/profile`,
  qs.stringify({ name: 'Tom', age: 20 }),
  {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  },
);
```

---

## 四、`form-urlencoded` 的数组 / 嵌套对象 在 Nest 中的处理

### 4.1 前端用 `qs` 发数组

```ts
qs.stringify(
  {
    ids: [1, 2, 3],
  },
  { arrayFormat: 'repeat' },
);

// => ids=1&ids=2&ids=3
```

Nest 这边：

```ts
import { Controller, Post, Body } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Post('ids')
  test(@Body('ids') ids: string[] | string) {
    // 根据你的 bodyParser / qs 配置不同，
    // 可能是 ['1', '2', '3']，也可能需要自己拆
    return { ids };
  }
}
```

如果需要非常精准的数组行为，推荐统一：

* 前端约定 `qs` 的格式（比如 `arrayFormat: 'brackets'`）
* 后端根据约定做对应解析（或者直接用 JSON body，简单很多）

---

## 五、什么时候用 `form-urlencoded`，什么时候用 JSON？

经验法则：

* **推荐优先用 JSON**：语义清晰、嵌套友好、现代接口基本都支持；
* 用 `form-urlencoded` 的典型场景：

  * 第三方接口文档要求 `Content-Type: application/x-www-form-urlencoded`
  * 简单表单、登录接口、OAuth2 授权等
  * 需要兼容某些老后端框架 / 网关

---

## 六、小结表

| 角色     | 操作点               | 写法关键点                                                 |
| ------ | ----------------- | ----------------------------------------------------- |
| axios  | 设置 `Content-Type` | `'Content-Type': 'application/x-www-form-urlencoded'` |
| axios  | 编码 body           | `URLSearchParams` / `qs.stringify()`                  |
| axios  | 不要只改 header 不编码   | body 必须是字符串，而不是 JS 对象                                 |
| NestJS | 基本接收              | `@Body()` / `@Body('field')`                          |
| NestJS | DTO + 校验          | `class-validator` + `ValidationPipe`                  |
| NestJS | 数组、嵌套对象           | 视编码方式而定；复杂场景优先考虑直接用 JSON                              |

---

如果你愿意，可以把你当前的 **一个真实接口需求** 发我（比如“我要调用一个三方登录接口，要求 `form-urlencoded`，参数有哪些”），我可以直接帮你写 **axios 调用 + Nest 转发 / 自己服务端接收** 的完整代码。
