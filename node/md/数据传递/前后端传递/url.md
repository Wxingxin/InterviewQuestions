下面我给你来一个比较系统的 **URL Param（路径参数）在 axios 和 NestJS 中的「使用大全」**，从基础到稍微高级一点的用法都过一遍。

---

## 一、先搞清楚：URL Param 是什么？

* **URL Param / Path Param**：写在路径里的变量

  * 示例：`/users/123/posts/456`
  * 123 是 `:userId`，456 是 `:postId`
* **不是**：

  * Query：`/users?id=123`
  * Body：JSON / form / form-data 这些

典型使用场景：

* 根据 ID 查询 / 更新 / 删除某个资源：`/users/:id`
* 多层资源：`/users/:userId/posts/:postId`

---

## 二、axios 里使用 URL Param 的方式

axios 对 URL Param **不需要**专门的配置项，直接写在 URL 字符串里就行，常用的只有两招：

### 2.1 直接写死路径

```ts
axios.get('/api/users/123');
axios.delete('/api/users/123');
axios.put('/api/users/123', { name: 'Tom' });
```

### 2.2 使用模板字符串（最常用）

```ts
const userId = 123;

// GET /api/users/123
axios.get(`/api/users/${userId}`);

// PUT /api/users/123
axios.put(`/api/users/${userId}`, { name: 'Tom' });

// DELETE /api/users/123
axios.delete(`/api/users/${userId}`);
```

### 2.3 多个路径参数

```ts
const userId = 123;
const postId = 456;

// GET /api/users/123/posts/456
axios.get(`/api/users/${userId}/posts/${postId}`);
```

### 2.4 带特殊字符时用 encodeURIComponent

如果路径参数中有空格、中文、斜杠等特殊字符，建议编码：

```ts
const filename = 'a b/c.txt';

// /api/files/a%20b%2Fc.txt
axios.get(`/api/files/${encodeURIComponent(filename)}`);
```

> 注意：大多数情况下 ID 都是数字或 UUID，不用特地 encode；
> 只有当你把**真实字符串**放进路径里时才要注意。

### 2.5 封装一层 API 方法（实战推荐）

```ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// 获取用户详情
export const getUser = (id: number | string) =>
  api.get(`/users/${id}`);

// 更新用户
export const updateUser = (id: number | string, data: any) =>
  api.put(`/users/${id}`, data);

// 获取文章
export const getUserPost = (userId: string | number, postId: string | number) =>
  api.get(`/users/${userId}/posts/${postId}`);
```

> 之后在项目里只用 `getUser(1)`、`updateUser(1, data)` 就行。

---

## 三、NestJS 中 URL Param 的路由写法

### 3.1 基本用法：@Controller + @Get(':id') + @Param('id')

```ts
import { Controller, Get, Param } from '@nestjs/common';

@Controller('users') // 路径前缀：/users
export class UsersController {
  @Get(':id') // 最终路径：GET /users/:id
  getUser(@Param('id') id: string) {
    return {
      id,
      from: 'url-param',
    };
  }
}
```

* `@Controller('users')` -> 所有路由前缀都是 `/users`
* `@Get(':id')` -> 路由变成 `/users/:id`
* `@Param('id')` id: string -> 取到路径里的 `:id`

### 3.2 多个路径参数

```ts
import { Controller, Get, Param } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get(':userId/posts/:postId')
  getUserPost(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ) {
    return {
      userId,
      postId,
      from: 'url-param',
    };
  }
}
```

对应前端：

```ts
axios.get(`/api/users/${userId}/posts/${postId}`);
```

### 3.3 一次性拿所有路径参数

```ts
import { Controller, Get, Param } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get(':userId/posts/:postId')
  getUserPost(@Param() params: { userId: string; postId: string }) {
    return {
      userId: params.userId,
      postId: params.postId,
    };
  }
}
```

### 3.4 路径参数类型转换（ParseIntPipe）

URL 里的东西默认都是 **字符串**，如果你想在后端直接用数字，可以用 Nest 的内置 Pipe：

```ts
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    // 这里的 id 已经是 number 类型了
    return {
      id,
      type: typeof id, // 'number'
    };
  }
}
```

如果 URL 里不是数字（比如 `/users/abc`），`ParseIntPipe` 会直接抛 400 错误。

---

## 四、不同 HTTP Method 下使用 URL Param

### 4.1 GET：详情、子资源

```ts
@Controller('users')
export class UsersController {
  @Get(':id')
  getUser(@Param('id') id: string) {
    return { action: 'get', id };
  }

  @Get(':id/posts')
  getUserPosts(@Param('id') id: string) {
    return { action: 'get posts', id };
  }
}
```

对应 axios：

```ts
axios.get(`/api/users/${id}`);
axios.get(`/api/users/${id}/posts`);
```

---

### 4.2 PUT / PATCH：更新资源

```ts
import { Controller, Put, Body, Param } from '@nestjs/common';

class UpdateUserDto {
  name?: string;
  age?: number;
}

@Controller('users')
export class UsersController {
  @Put(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    return {
      action: 'update',
      id,
      body,
    };
  }
}
```

axios：

```ts
axios.put(`/api/users/${id}`, {
  name: 'Tom',
  age: 20,
});
```

---

### 4.3 DELETE：删除资源

```ts
import { Controller, Delete, Param, ParseIntPipe } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return {
      action: 'delete',
      id,
    };
  }
}
```

axios：

```ts
axios.delete(`/api/users/${id}`);
```

---

## 五、URL Param + 其它参数混用（实战常见）

### 5.1 URL Param + Query

后端：

```ts
import { Controller, Get, Param, Query } from '@nestjs/common';

@Controller('users')
export class UsersController {
  // GET /users/:id/posts?page=1&pageSize=10
  @Get(':id/posts')
  getUserPosts(
    @Param('id', ParseIntPipe) id: number,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
  ) {
    return {
      userId: id,
      page: Number(page),
      pageSize: Number(pageSize),
    };
  }
}
```

前端 axios：

```ts
axios.get(`/api/users/${userId}/posts`, {
  params: {
    page: 1,
    pageSize: 10,
  },
});
```

---

### 5.2 URL Param + Body（PUT / PATCH / POST）

后端：

```ts
import { Controller, Put, Param, Body, ParseIntPipe } from '@nestjs/common';

class UpdatePostDto {
  title?: string;
  content?: string;
}

@Controller('users')
export class UsersController {
  @Put(':userId/posts/:postId')
  updatePost(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() body: UpdatePostDto,
  ) {
    return {
      userId,
      postId,
      body,
    };
  }
}
```

axios：

```ts
axios.put(`/api/users/${userId}/posts/${postId}`, {
  title: 'new title',
  content: 'new content',
});
```

---

## 六、URL Param 的一些经验 / 坑点

1. **路径设计尽量资源化**

   * 好：`GET /users/:id`、`GET /users/:id/posts/:postId`
   * 不推荐：`GET /getUserById/:id`（把动作写到 URL 里）

2. **避免在路径里放易变的东西**

   * 比如用户名可改，那就别把用户名当 Path Param，用 ID 更稳。

3. **可选参数不要写成 `:id?`**
   Nest 里如果有可选，可以写两个路由：

   ```ts
   @Get()
   getUsers() {}

   @Get(':id')
   getUserById(@Param('id') id: string) {}
   ```

4. **Path Param 始终是字符串，别忘了转类型**

   * 后端用 `ParseIntPipe`
   * 或者手动 `Number(id)`
   * TS 类型写 `number` 并不会帮你自动转，得靠 Pipe 或你自己处理。

---

## 七、前后端完整例子小结

### NestJS 控制器

```ts
import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

class UpdateUserDto {
  name?: string;
  age?: number;
}

@Controller('users')
export class UsersController {
  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return { action: 'get', id };
  }

  @Put(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    return { action: 'update', id, body };
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return { action: 'delete', id };
  }

  @Get(':userId/posts/:postId')
  getUserPost(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return { action: 'get post', userId, postId };
  }
}
```

### axios 调用封装

```ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// 用户相关
export const getUser = (id: number) => api.get(`/users/${id}`);

export const updateUser = (id: number, data: { name?: string; age?: number }) =>
  api.put(`/users/${id}`, data);

export const deleteUser = (id: number) => api.delete(`/users/${id}`);

// 用户文章
export const getUserPost = (userId: number, postId: number) =>
  api.get(`/users/${userId}/posts/${postId}`);
```

---

如果你愿意，你可以把你现在的 **Nest 控制器代码** 或 **axios 封装代码**贴出来，我可以直接帮你做一版「最优写法重构」，顺便帮你检查 URL Param 有没有设计上的问题。
