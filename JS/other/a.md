以下是 Axios 的几乎全部核心知识点大全（2025年最新版），按类别系统性整理，适合前端开发者从入门到精通、面试、架构设计全覆盖。

### 1. 基础概念
- Axios 是基于 Promise 的 HTTP 客户端，同时支持浏览器和 Node.js
- 本质是对 XMLHttpRequest 的封装，但更现代、易用
- 支持所有现代浏览器（包括 IE11+ 通过 polyfill）
- 自动处理 JSON 数据（请求和响应都自动 JSON.parse / JSON.stringify）
- 默认 Content-Type 和 Accept 都是 application/json

### 2. 安装方式
```bash
npm install axios
# 或 yarn / pnpm
yarn add axios

# CDN
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
# ESM
import axios from "https://esm.sh/axios"
```

### 3. 基本用法（8种请求方式）
```js
axios.request(config)
axios.get(url[, config])
axios.delete(url[, config])
axios.head(url[, config])
axios.options(url[, config])
axios.post(url[, data[, config]])
axios.put(url[, data[, config]])
axios.patch(url[, data[, config]])
```

### 4. 并发请求
```js
// 全部成功才 resolve
axios.all([p1, p2, p3]).then(axios.spread((res1, res2, res3) => {}))

// 推荐写法（新版）
Promise.all([axios.get('/a'), axios.get('/b')])

// axios.all 和 axios.spread 即将废弃，官方推荐 Promise.all + 解构
```

### 5. 创建实例（最重要的功能之一）
```js
const instance = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {'X-Custom-Header': 'foobar'}
});

// 多个不同域名/配置的实例
const api1 = axios.create({ baseURL: '/api/v1' });
const api2 = axios.create({ baseURL: 'https://other.com' });
```

### 6. 配置项详解（config）
| 配置项              | 说明                                                                 |
|---------------------|----------------------------------------------------------------------|
| url                 | 请求路径（get/delete/head 等必填）                                   |
| method              | 请求方法                                                             |
| baseURL             | 会自动加在 url 前面（除非 url 是绝对路径）                           |
| headers             | 自定义请求头                                                         |
| params              | URL 参数对象，会自动拼到 ?xxx=xxx                                    |
| paramsSerializer    | 自定义 params 序列化（常用于处理数组参数）                          |
| data                | 请求体（post/put/patch）                                             |
| timeout             | 超时时间（ms），默认无限                                             |
| withCredentials     | 跨域是否携带 cookie（true 时后端需设置 Access-Control-Allow-Credentials） |
| auth                | Basic 认证 { username: 'xx', password: 'xx' }                        |
| responseType        | 'json' | 'text' | 'blob' | 'arraybuffer' | 'stream' (node)        |
| responseEncoding    | 响应编码（仅 node）                                                  |
| xsrfCookieName      | xsrf token 的 cookie 名                                              |
| xsrfHeaderName      | xsrf token 的 header 名                                              |
| maxRedirects        | 最大重定向次数（node 中默认 5，浏览器默认无限）                      |
| proxy               | 代理配置（仅 node）                                                  |
| cancelToken         | 旧版取消方式（已废弃）                                               |
| signal              | AbortController.signal（推荐取消方式）                              |
| decompress          | 是否自动解压 gzip（默认 true）                                       |

### 7. 请求与响应拦截器（核心中的核心）
```js
// 请求拦截器（常用于加 token、loading、统一处理 params）
instance.interceptors.request.use(
  config => {
    config.headers.Authorization = 'Bearer ' + getToken();
    return config;
  },
  error => Promise.reject(error)
);

// 响应拦截器（统一处理 401、500、业务错误码、去除 data.data 嵌套等）
instance.interceptors.response.use(
  response => {
    // 很多公司后端返回 { code: 0, data: {}, msg: '' }
    if (response.data.code !== 0) {
      Message.error(response.data.msg);
      return Promise.reject(new Error(response.data.msg));
    }
    return response.data; // 直接返回 data，调用方不用写 .data.data
  },
  error => {
    if (error.response?.status === 401) {
      // 跳转登录
    }
    return Promise.reject(error);
  }
);
```

### 8. 取消请求（两种方式）
```js
// 推荐：AbortController（现代浏览器和 Node 18+ 都支持）
const controller = new AbortController();
axios.get('/user', { signal: controller.signal });
controller.abort(); // 取消

// 旧方式（已废弃）
// const CancelToken = axios.CancelToken;
// const source = CancelToken.source();
// axios.get('/user', { cancelToken: source.token });
// source.cancel('用户取消了请求');
```

### 9. 文件上传下载
```js
// 上传 + 进度
const onUploadProgress = progressEvent => {
  const percent = (progressEvent.loaded / progressEvent.total) * 100;
};

axios.post('/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
  onUploadProgress
});

// 下载 + 进度
axios.get('/bigfile.zip', {
  responseType: 'blob',
  onDownloadProgress: progressEvent => { ... }
});
```

### 10. 常见参数序列化问题（面试高频）
```js
// 数组参数默认变成 foo[]=1&foo[]=2（很多后端不认）
axios.get('/list', {
  params: { foo: [1,2,3] }
});
// 正确做法：用 qs 库或自定义 serializer
import qs from 'qs';
axios.get('/list', {
  params: { foo: [1,2,3] },
  paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
  // 结果：foo=1&foo=2&foo=3
});
```

### 11. 错误处理完整姿势
```js
try {
  const res = await instance.get('/api');
} catch (err) {
  if (axios.isCancel(err)) {
    console.log('请求已取消');
  } else if (err.response) {
    // 服务器返回了状态码（4xx, 5xx）
    console.log(err.response.status, err.response.data);
  } else if (err.request) {
    // 请求发出但无响应（网络断开、超时）
    console.log('网络异常');
  } else {
    // 其他错误
    console.log(err.message);
  }
}
```

### 12. Axios 在 TypeScript 中的完美类型支持
```ts
interface ApiResponse<T = any> {
  code: number;
  data: T;
  msg: string;
}

const api = axios.create({ baseURL: '/api' });

// 泛型直接拿到 data 的类型
const res = await api.get<ApiResponse<User[]>>('/users');
type UserList = res.data.data; // 自动推导为 User[]
```

### 13. 常见最佳实践封装（2025年主流写法）
```ts
// api/index.ts
import axios from 'axios';
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 30000,
});

request.interceptors.request.use(config => {
  const token = useUserStore().token;
  token && (config.headers.Authorization = `Bearer ${token}`);
  return config;
});

request.interceptors.response.use(
  res => res.data.code === 0 ? res.data.data : Promise.reject(res.data),
  err => {
    // 统一错误处理
    return Promise.reject(err);
  }
);

export default request;

// api/user.ts
import request from './index';
export const getUserList = (params: PageParams) => 
  request.get<User[]>('/users', { params });
```

### 14. Axios vs Fetch 对比（面试必备）
| 特性                   | Axios                          | Fetch                          |
|------------------------|--------------------------------|--------------------------------|
| 是否基于 Promise       | 是                             | 是                             |
| 自动 JSON 解析         | 是                             | 否，需要手动 .json()           |
| 超时控制               | 支持                           | 原生不支持（需 AbortController）|
| 拦截器                 | 支持                           | 不支持                         |
| 取消请求               | 内置 + AbortController         | 只支持 AbortController         |
| 上传/下载进度          | 支持                           | 支持（部分浏览器）             |
| 自动转换 data 为 JSON  | 是                             | 否                             |
| XSRF 防护              | 内置                           | 无                             |
| Node.js 支持           | 支持                           | Node 18+ 支持                  |

### 15. 即将废弃/已废弃的功能（2025年注意）
- axios.all() / axios.spread() → 用 Promise.all
- CancelToken → 用 AbortController
- axios.defaults.adapter → 很少用了

掌握上面全部内容，已经可以说是 Axios 专家级别了，足以应对 99% 的项目和高级面试题。祝你玩转 Axios！