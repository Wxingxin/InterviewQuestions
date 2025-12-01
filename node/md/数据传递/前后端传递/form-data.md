下面我给你整理一个比较全面的
**「multipart/form-data 在 axios 和 NestJS 中的使用大全」**，
重点就是：**前端怎么用 axios 组装 FormData，后端 Nest 怎么用拦截器接收文件 + 普通字段**。

---

## 一、multipart/form-data 是啥？

简单说：
当你需要 **上传文件**（图片、视频、音频、附件等），或者**表单里既有文件又有文本**时，一般就用：

```http
Content-Type: multipart/form-data
```

请求体会被拆成一段一段的「part」，每个 part 里有自己的 headers + 内容，比如：

* 一个 part 是文件：file
* 一个 part 是文本字段：username、desc 等

---

## 二、axios 中使用 `form-data`（前端部分）

### 2.1 浏览器里最常用：`FormData`

浏览器原生就有 `FormData` 类型。

#### 1）上传单文件

```ts
// 假设你有一个 <input type="file" id="fileInput" />
const input = document.getElementById('fileInput') as HTMLInputElement;

const formData = new FormData();
formData.append('file', input.files![0]); // key 名叫 file，对应后端的字段名

axios.post('/api/upload/single', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
```

> 小技巧：
> `headers['Content-Type']` 可以不写，axios 会自动加 `multipart/form-data; boundary=xxx`，
> 一般只有在你特别需要才手动写。

---

#### 2）文件 + 文本字段一起上传

```ts
const formData = new FormData();
formData.append('file', input.files![0]);  // 文件
formData.append('username', 'tom');        // 文本
formData.append('desc', '头像图片');       // 文本

axios.post('/api/upload/avatar', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
```

---

#### 3）上传多个文件（同一个字段多文件）

```ts
const formData = new FormData();
Array.from(input.files ?? []).forEach((file) => {
  formData.append('files', file);  // 同一个 key：files
});

axios.post('/api/upload/multiple', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
```

> 这时候后端会拿到 `files` 这个字段对应的文件数组。

---

#### 4）多个不同字段名的文件

```ts
const formData = new FormData();
formData.append('avatar', avatarInput.files![0]);   // 头像
formData.append('background', bgInput.files![0]);   // 背景图

axios.post('/api/upload/profile', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
```

---

### 2.2 Node 环境下（比如服务端 axios 调用其他服务）

Node 里没有浏览器的 `FormData`，一般用 `form-data` 或 `formdata-node` 之类的库。

```bash
npm install form-data
```

```ts
import axios from 'axios';
import FormData from 'form-data';
import * as fs from 'fs';

const formData = new FormData();
formData.append('file', fs.createReadStream('./test.png'));

axios.post('http://xxx.com/api/upload', formData, {
  headers: formData.getHeaders(), // 自动带上 multipart/form-data; boundary=...
});
```

---

## 三、NestJS 中接收 `multipart/form-data`（后端部分）

Nest 这里是基于 **Multer** 来处理文件的。
核心点：

* Controller 上用 `@UseInterceptors(FileInterceptor / FilesInterceptor / AnyFilesInterceptor / FileFieldsInterceptor)`
* 文件参数用 `@UploadedFile()` / `@UploadedFiles()`
* 其它普通字段用 `@Body()` 拿

> 前提：项目里依赖要有：`@nestjs/platform-express`（默认就有）

---

### 3.1 上传单文件：`FileInterceptor`

**后端（Nest）**

```ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  @Post('single')
  @UseInterceptors(FileInterceptor('file')) // file 对应前端 formData 的 key
  uploadSingle(
    @UploadedFile() file: Express.Multer.File,
    @Body('username') username: string, // 普通字段
  ) {
    return {
      username,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}
```

**前端（axios）**

```ts
const formData = new FormData();
formData.append('file', input.files![0]);       // key 要叫 file
formData.append('username', 'tom');

axios.post('/api/upload/single', formData);
```

---

### 3.2 上传多文件：`FilesInterceptor`

**后端（多文件同字段名 files）**

```ts
import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10)) // 最多 10 个
  uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('desc') desc: string,
  ) {
    return {
      desc,
      count: files.length,
      files: files.map((f) => ({
        originalName: f.originalname,
        size: f.size,
      })),
    };
  }
}
```

**前端（axios）**

```ts
const formData = new FormData();
Array.from(input.files ?? []).forEach((file) => {
  formData.append('files', file); // 注意 key: files
});
formData.append('desc', '多文件上传测试');

axios.post('/api/upload/multiple', formData);
```

---

### 3.3 多个字段名各自上传文件：`FileFieldsInterceptor`

**后端**

```ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Body,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  @Post('profile')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'background', maxCount: 1 },
    ]),
  )
  uploadProfile(
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File[];
      background?: Express.Multer.File[];
    },
    @Body('username') username: string,
  ) {
    return {
      username,
      avatar: files.avatar?.[0]?.originalname,
      background: files.background?.[0]?.originalname,
    };
  }
}
```

**前端**

```ts
const formData = new FormData();
formData.append('avatar', avatarInput.files![0]);
formData.append('background', bgInput.files![0]);
formData.append('username', 'tom');

axios.post('/api/upload/profile', formData);
```

---

### 3.4 任意字段名的文件：`AnyFilesInterceptor`

如果你懒得一个个配置字段名，或者字段名不固定：

```ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Body,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  @Post('any')
  @UseInterceptors(AnyFilesInterceptor())
  uploadAny(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any,
  ) {
    return {
      body,
      files: files.map((f) => f.originalname),
    };
  }
}
```

---

## 四、配置 Multer：保存路径、文件名、大小限制、类型过滤

默认情况下 Multer 把文件放内存 / tmp，你一般会想控制一下：

* 存到指定目录
* 限制文件大小
* 限制文件类型（比如只允许 jpg/png）

### 4.1 使用 `diskStorage` 自定义存储

```ts
import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('upload')
export class UploadController {
  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/avatar', // 存储目录
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 2 * 1024 * 1024, // 限制 2MB
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    return {
      filename: file.filename,
      path: file.path,
    };
  }
}
```

> 对前端 axios 来说不变，还是 FormData + `file` 字段。

---

## 五、`multipart/form-data` + DTO + ValidationPipe？

* DTO 只能校验 **文本字段**，不能直接校验文件。
* 文本字段仍然通过 `@Body()` + DTO + `ValidationPipe` 来做。

示例：

```ts
// dto/create-post.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
```

```ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  @Post()
  @UseInterceptors(FileInterceptor('cover')) // 封面图
  createPost(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreatePostDto,
  ) {
    return {
      title: dto.title,
      content: dto.content,
      cover: file?.originalname,
    };
  }
}
```

前端：

```ts
const formData = new FormData();
formData.append('cover', coverInput.files![0]);
formData.append('title', '测试文章');
formData.append('content', '正文内容...');

axios.post('/api/posts', formData);
```

---

## 六、混合：Path Param + Query + FormData

非常常见，比如：

* URL 中有 :id（资源 id）
* query 里有一些控制参数
* body 用 `multipart/form-data` 上传文件 + 文本

后端：

```ts
import {
  Controller,
  Post,
  Param,
  Query,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(
    @Param('id') id: string,             // /users/:id/avatar
    @Query('notify') notify: string,     // ?notify=true
    @UploadedFile() file: Express.Multer.File,
    @Body('desc') desc: string,          // form-data 里的文本字段
  ) {
    return {
      id,
      notify,
      desc,
      file: file.originalname,
    };
  }
}
```

前端：

```ts
const formData = new FormData();
formData.append('file', input.files![0]);
formData.append('desc', '新头像');

axios.post(`/api/users/${userId}/avatar`, formData, {
  params: { notify: true }, // => ?notify=true
});
```

---

## 七、常见坑 & 建议

1. **不要自己手动写 boundary**

   * 直接 `headers: { 'Content-Type': 'multipart/form-data' }` 或干脆不写就行
   * axios / 浏览器 / form-data 库会自动补 `boundary=xxx`

2. **字段名要对得上**

   * 前端 `formData.append('file', ...)`
   * 后端 `FileInterceptor('file')`
   * 不一致就拿不到文件

3. **前端别把 JSON 和 FormData 混着用**

   * 要用 FormData 就全部扔进 FormData，不要再在 axios 的 `data`、`params` 里传复杂对象当 body

4. **大文件注意限制 & 超时 & 反向代理配置（如 Nginx 的 client_max_body_size）**

---

## 八、小总结表

| 侧           | 场景        | 关键点                                                             |
| ----------- | --------- | --------------------------------------------------------------- |
| axios（浏览器）  | 上传文件      | 用 `FormData`，往里 append 文件和文本                                    |
| axios（Node） | 上传文件到其他服务 | 用 `form-data` + `fs.createReadStream`                           |
| NestJS      | 单文件上传     | `@UseInterceptors(FileInterceptor('file'))` + `@UploadedFile()` |
| NestJS      | 多文件同字段    | `FilesInterceptor('files')` + `@UploadedFiles()`                |
| NestJS      | 多字段名文件    | `FileFieldsInterceptor([...])`                                  |
| NestJS      | 普通字段      | 跟 JSON 一样用 `@Body()`，可以配 DTO 校验                                 |
| NestJS      | 存储 & 限制   | Multer `storage / limits / fileFilter` 配置                       |

---

如果你现在有一个**实际需求**（比如“做一个头像上传接口，限制 2M，只允许 jpg/png，然后前端用 axios 调”），你可以直接说清楚需求，我可以帮你写一整套可以直接复制用的代码。
