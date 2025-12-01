下面我给你整理一个 **「query 在 axios 和 NestJS 中的使用大全」**，看完你基本就能把前后端的查询参数玩明白了。

---

## 一、先说概念：什么是 query 参数？

URL 形态一般是这样：

```txt
GET /articles?page=1&pageSize=10&kw=nestjs
```

`?` 后面这部分就是 **query string**，每个键值对叫一个 **query 参数**：

* `page=1`
* `pageSize=10`
* `kw=nestjs`

特点：

* **只存在于 URL 上**，不会出现在请求体（body）里；
* 一般用于：分页、筛选、搜索条件、排序等。

---

## 二、axios 里怎么玩 query

### 2.1 标准写法：用 `params`（最推荐）

axios 专门有个 `params` 字段用来生成 query：

```ts
axios.get('/api/articles', {
  params: {
    page: 1,
    pageSize: 10,
    kw: 'nestjs',
  },
});
// => GET /api/articles?page=1&pageSize=10&kw=nestjs
```

对所有 HTTP method 都适用：

```ts
axios.post('/api/articles/search', { type: 'news' }, {
  params: {
    page: 1,
    pageSize: 10,
  },
});
// => POST /api/articles/search?page=1&pageSize=10
```

---

### 2.2 手动拼接（不推荐但要会看）

手动字符串拼 URL：

```ts
axios.get(`/api/articles?page=${page}&pageSize=${pageSize}`);
```

如果有中文 / 特殊字符，要记得 `encodeURIComponent`：

```ts
const kw = 'Nest 教程';
axios.get(`/api/articles?kw=${encodeURIComponent(kw)}`);
```

---

### 2.3 复杂 query：数组 & 嵌套对象

**1）数组**

默认情况下，axios 对数组参数会序列化成：

```ts
axios.get('/api/list', {
  params: {
    ids: [1, 2, 3],
  },
});
// => /api/list?ids[]=1&ids[]=2&ids[]=3（取决于版本和适配器）
```

后端可以按 `ids[]` 或者 `ids` 来解析，Nest 里一般配合 `@Query('ids') ids: string[]` 或手动处理。

**2）嵌套对象**

```ts
axios.get('/api/list', {
  params: {
    filter: {
      status: 'active',
      type: 'vip',
    },
  },
});
// 默认序列化不一定是你想要的格式
```

为了更精细控制格式，常用 `qs`：

```ts
import qs from 'qs';

axios.get('/api/list', {
  params: {
    filter: {
      status: 'active',
      type: 'vip',
    },
  },
  paramsSerializer: (params) => {
    return qs.stringify(params, { arrayFormat: 'repeat' });
  },
});
// => /api/list?filter[status]=active&filter[type]=vip
```

---

### 2.4 全局配置：统一加公共 query 参数

比如给所有请求都带上 `lang`、`version`：

```ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  config.params = {
    ...(config.params || {}),
    lang: 'zh-CN',
  };
  return config;
});
```

之后的所有请求都会带上 `?lang=zh-CN`。

---

### 2.5 搭配 TypeScript：带上返回值类型

```ts
interface Article {
  id: number;
  title: string;
}

interface ArticleListRes {
  list: Article[];
  total: number;
}

export const getArticles = (params: { page: number; pageSize: number; kw?: string }) =>
  api.get<ArticleListRes>('/articles', { params });
```

---

## 三、NestJS 中 query 的使用方式

Nest 里，query 对应装饰器：**`@Query()`**

### 3.1 获取单个 query 参数

```ts
import { Controller, Get, Query } from '@nestjs/common';

@Controller('articles')
export class ArticlesController {
  @Get()
  list(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('kw') kw?: string,
  ) {
    return {
      page,
      pageSize,
      kw,
    };
  }
}
```

注意：这里的 `page`、`pageSize` 默认都是 **字符串**。

---

### 3.2 一次性拿所有 query 参数

```ts
@Controller('articles')
export class ArticlesController {
  @Get('all')
  listAll(@Query() query: any) {
    // query = { page: '1', pageSize: '10', kw: 'nestjs' }
    return query;
  }
}
```

也可以加类型：

```ts
interface ArticleQuery {
  page?: string;
  pageSize?: string;
  kw?: string;
}

@Get('all')
listAll(@Query() query: ArticleQuery) {
  return query;
}
```

---

### 3.3 自动类型转换 + 校验：配合 DTO + ValidationPipe（推荐实战写法）

1）先定义 DTO：

```ts
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ArticleQueryDto {
  @Type(() => Number)       // 把字符串转成 number
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  pageSize: number = 10;

  @IsString()
  @IsOptional()
  kw?: string;
}
```

2）在 Controller 使用：

```ts
import { Controller, Get, Query } from '@nestjs/common';
import { ArticleQueryDto } from './dto/article-query.dto';

@Controller('articles')
export class ArticlesController {
  @Get()
  list(@Query() query: ArticleQueryDto) {
    // 这里的 query.page、query.pageSize 已经是 number 类型
    return query;
  }
}
```

3）确保全局启用 `ValidationPipe` + transform（通常在 `main.ts`）：

```ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,            // 开启自动类型转换
      whitelist: true,            // 自动去掉 DTO 里没定义的字段
      forbidNonWhitelisted: false,
    }),
  );
  await app.listen(3000);
}
bootstrap();
```

---

### 3.4 内置类型转换 Pipe：ParseIntPipe / ParseBoolPipe 等

如果只想对单个字段做转换，可以直接用 Pipe：

```ts
import { Controller, Get, Query, ParseIntPipe, ParseBoolPipe } from '@nestjs/common';

@Controller('items')
export class ItemsController {
  @Get()
  list(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('includeDeleted', ParseBoolPipe) includeDeleted: boolean,
  ) {
    return {
      page,
      pageSize,
      includeDeleted,
    };
  }
}
```

对应请求：

```ts
// /items?page=2&pageSize=20&includeDeleted=true
```

---

### 3.5 query + path param + body 混用

非常常见的业务场景，比如：

* 路径指定资源：`/:id`
* query 指定一些控制参数：`?force=true`
* body 带数据

```ts
import { Controller, Put, Param, Query, Body, ParseIntPipe, ParseBoolPipe } from '@nestjs/common';

class UpdateUserDto {
  name?: string;
  age?: number;
}

@Controller('users')
export class UsersController {
  @Put(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,                        // URL Param
    @Query('notify', ParseBoolPipe) notify: boolean,              // Query Param
    @Body() body: UpdateUserDto,                                  // Body
  ) {
    return {
      id,
      notify,
      body,
    };
  }
}
```

前端 axios：

```ts
axios.put(
  `/api/users/${id}`,
  { name: 'Tom', age: 20 },                // body
  { params: { notify: true } },            // query -> ?notify=true
);
```

---

## 四、axios 和 NestJS query 的前后端「一对一」例子

### 4.1 分页列表接口

**后端（NestJS）**

```ts
// dto/article-query.dto.ts
import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ArticleQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  pageSize: number = 10;
}

// articles.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ArticleQueryDto } from './dto/article-query.dto';

@Controller('articles')
export class ArticlesController {
  @Get()
  list(@Query() query: ArticleQueryDto) {
    // 实际业务里你会用 query.page / query.pageSize 去查数据库
    return {
      page: query.page,
      pageSize: query.pageSize,
      list: [],
    };
  }
}
```

**前端（axios）**

```ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const getArticles = (params: { page?: number; pageSize?: number }) =>
  api.get('/articles', { params });

// 调用
getArticles({ page: 2, pageSize: 20 });
```

---

### 4.2 搜索 + 多条件筛选

**后端（NestJS）**

```ts
import { Controller, Get, Query } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  @Get('search')
  search(
    @Query('kw') kw: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    return {
      kw,
      category,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    };
  }
}
```

**前端（axios）**

```ts
api.get('/products/search', {
  params: {
    kw: '手机',
    category: 'digital',
    minPrice: 1000,
    maxPrice: 3000,
  },
});
// => /products/search?kw=%E6%89%8B%E6%9C%BA&category=digital&minPrice=1000&maxPrice=3000
```

---

## 五、query 使用中的常见坑 & 建议

1. **类型问题**

   * 浏览器发出来都是 **字符串**，Nest 接到也是字符串；
   * 建议用 `class-transformer` + `ValidationPipe` 或 `ParseIntPipe`/`ParseBoolPipe` 等做类型转换。

2. **默认值处理**

   * 常见分页参数别忘了默认值：

     * `page = 1`
     * `pageSize = 10 或 20`
   * 可以在 DTO 里给默认值，也可以在参数里写 `page = 1`。

3. **安全与校验**

   * 对外接口 query 参数都要校验，比如 page >= 1，pageSize 不要太大；
   * 不要直接把 query 拼到 SQL 里，注意防注入。

4. **query vs body 的边界**

   * **query**：适合用来传「过滤条件 / 控制参数」，GET/DELETE/部分 POST；
   * **body**：适合用来传实体数据（创建 / 更新）。

---

如果你有「具体某个接口」想设计，比如

> “我有一个订单列表，支持分页 + 状态筛选 + 时间区间，你帮我设计一下 axios 和 NestJS 写法”

你可以把需求发给我，我可以直接帮你写一套完整的 DTO + Controller + axios 封装。
