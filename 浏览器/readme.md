# 进程和线程

# websocket

# token

## token 的生成过程

这题是前端/后端面试中的高频题 ✅，尤其是 JWT（JSON Web Token）或自定义 Token 认证场景。
我帮你整理成**面试易答版 + 流程图思路**，方便快速理解。

---

## 💡 1. Token 的概念

> Token 是一种**身份验证凭证**，服务端生成并颁发给客户端，用于标识用户身份和权限。
> 与传统 Session 的区别：

-  **无状态**：Token 一般不存储在服务端（JWT），减少服务端压力。
-  **自包含**：Token 中可携带用户信息和权限。
-  **跨域友好**：适合前后端分离场景。

---

## ⚙️ 2. Token 的生成过程（典型流程）

### 步骤概览：

1. **用户登录**

   -  前端发送用户名/密码到服务器。

   ```http
   POST /login
   {
     "username": "zhangsan",
     "password": "123456"
   }
   ```

2. **服务端验证**

   -  验证用户名和密码是否正确。
   -  如果错误，返回 401。
   -  如果正确，进入生成 Token 阶段。

3. **生成 Token**

   -  根据用户信息生成 Token，一般包含：

      -  `header`：算法、类型（JWT 使用）
      -  `payload`：用户 ID、角色、过期时间等
      -  `signature`：用服务端密钥签名，防篡改

   -  示例 JWT：

      ```json
      eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
      .eyJ1c2VySWQiOjEsInJvbGUiOiJhZG1pbiIsImV4cCI6MTY5NjAwMDAwMH0
      .dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk
      ```

4. **返回 Token**

   -  服务端把生成好的 Token 返回给前端：

   ```http
   HTTP/1.1 200 OK
   Content-Type: application/json

   {
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   }
   ```

5. **客户端保存**

   -  前端通常保存在：

      -  `localStorage` 或 `sessionStorage`
      -  Cookie（HttpOnly + Secure 更安全）

6. **请求接口时携带 Token**

   -  前端每次请求接口时带上 Token：

   ```http
   GET /api/user
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

7. **服务端验证 Token**

   -  服务端使用密钥验证 Token 是否有效：

      -  是否篡改
      -  是否过期

   -  验证成功 → 返回数据；失败 → 401

---

## 🧩 3. Token 的典型结构（JWT）

| 部分      | 内容                                                     | 示例                                           |
| --------- | -------------------------------------------------------- | ---------------------------------------------- |
| Header    | 算法和类型                                               | `{"alg":"HS256","typ":"JWT"}`                  |
| Payload   | 用户信息 + 过期时间                                      | `{"userId":1,"role":"admin","exp":1696000000}` |
| Signature | HMACSHA256( base64(header)+'.'+base64(payload), secret ) | `dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk`  |

> 最终拼接成：`header.payload.signature`

---

## 📄 4. 面试简答模板

> Token 的生成过程：
>
> 1. 用户登录 → 发送账号密码到服务器；
> 2. 服务端验证用户信息；
> 3. 验证通过后，生成 Token（通常包含用户信息 + 过期时间，并签名保证安全）；
> 4. 返回 Token 给客户端，前端存储；
> 5. 客户端请求接口时带上 Token，服务端验证有效性后返回数据。



## token 无感刷新怎么做的

非常好的问题 ✅
“**Token 无感刷新（Silent Refresh）**”是前端面试高频题之一，考察你对登录认证机制和安全性的理解。

下面是简洁版回答（适合面试时直接说 👇）

---

💡 简单回答：

> Token 无感刷新是指用户在 Token 过期时 **无需重新登录**，前端自动用 **刷新 Token（refresh_token）** 获取新的访问 Token（access_token），从而保持会话不中断。

---

## ⚙️ 实现思路：

1. **登录时：**

   -  后端返回两个 token：

      -  `access_token`（有效期短，例如 30 分钟）
      -  `refresh_token`（有效期长，例如 7 天）

2. **请求拦截：**

   -  每次发送请求时，携带 `access_token`。
   -  如果后端返回 401（token 过期），前端自动发请求，用 `refresh_token` 换新的 `access_token`。

3. **更新 token：**

   -  后端验证 `refresh_token` 是否有效；
   -  返回新的 `access_token`；
   -  前端更新保存并重新发送原请求。

---

🧠 总结一句话（面试用）：

> 无感刷新就是通过 `refresh_token` 在后台静默获取新的 `access_token`，避免用户重新登录，从而实现“登录态无感续期”。

> ## token存在哪里

面试简答版：

> Token 通常存储在浏览器端，有几种方式：
>
> 1. **localStorage**：可长期保存，刷新页面不丢失，但容易被 XSS 攻击读取。
> 2. **sessionStorage**：仅在当前标签页有效，关闭标签页就清空，也容易被 XSS 读取。
> 3. **Cookie**：可设置 `HttpOnly`（JS 不能访问）、`Secure`（HTTPS 下传输），相对更安全，可用于跨请求自动携带。

> ⚠️ 安全最佳实践：敏感 Token 尽量放在 **HttpOnly Cookie** 中，避免在 JS 中暴露。


# 网络攻击

# 存储

> ## cookie 的属性是怎么存储的

这题是前端面试和浏览器知识的经典题 ✅，我帮你整理成面试易答版本。

---

## 💡 1. Cookie 的基本概念

> Cookie 是浏览器端用来保存少量数据的机制，通常用于**会话管理、用户身份识别、个性化设置**等。

-  存储在 **浏览器中**，分为两类：

   1. **Session Cookie**：浏览器关闭后自动删除。
   2. **Persistent Cookie**：有 `Expires` 或 `Max-Age`，在指定时间前有效。

---

## 🧩 2. Cookie 的常见属性

| 属性       | 说明                        | 例子                                    |
| ---------- | --------------------------- | --------------------------------------- |
| `name`     | Cookie 名                   | `token`                                 |
| `value`    | Cookie 值                   | `abc123`                                |
| `Domain`   | 指定该 Cookie 所属的域名    | `Domain=example.com`                    |
| `Path`     | Cookie 的有效路径           | `Path=/` 表示全站可用                   |
| `Expires`  | Cookie 过期时间（绝对时间） | `Expires=Wed, 09 Oct 2025 10:00:00 GMT` |
| `Max-Age`  | Cookie 存活秒数（相对时间） | `Max-Age=3600`                          |
| `Secure`   | 仅在 HTTPS 连接下发送       | `Secure`                                |
| `HttpOnly` | JS 无法读取（防 XSS）       | `HttpOnly`                              |
| `SameSite` | 控制跨站请求携带            | `Strict` / `Lax` / `None`               |

---

## 🧠 3. Cookie 的存储位置与方式

1. **浏览器内部存储**

   -  浏览器会把每个域名的 Cookie 单独存储。
   -  存储形式：

      -  **内存中**（Session Cookie）
      -  **磁盘中**（Persistent Cookie）

2. **发送规则**

   -  浏览器根据当前请求的 **域名 + 路径 + Secure/HttpOnly/SameSite** 决定是否发送该 Cookie。
   -  Cookie 会自动附加在请求头中：

      ```http
      Cookie: token=abc123; theme=dark
      ```

3. **操作方式**

   -  **前端 JS** 可通过 `document.cookie` 读写（非 HttpOnly Cookie）。
   -  **后端** 通过 `Set-Cookie` 指定。

---

## 📝 4. 存储流程示意（面试简答版）

```
浏览器收到 Set-Cookie 响应头
          │
          ▼
 浏览器解析 Cookie 属性
  ├─ Domain / Path / Secure / HttpOnly / Max-Age
  ▼
 存储在本地（内存或磁盘）
          │
          ▼
 满足规则时自动附加到请求头发送
```

---

## 💬 5. 面试简答模板

> Cookie 存储在浏览器端，可以是内存（会话 Cookie）或磁盘（持久 Cookie）。
> 每个 Cookie 有 `name`、`value`、`Domain`、`Path`、`Expires/Max-Age`、`Secure`、`HttpOnly`、`SameSite` 等属性。
> 浏览器会根据这些属性自动判断是否发送给服务器，`HttpOnly` 的 Cookie JS 无法访问，`Secure` 只能通过 HTTPS 发送。

---

# 白屏

# 跨越

# 缓存

# fcp lcp

# 浏览器兼容问题

> #### 📘《浏览器兼容问题与解决方案速查表》

| 分类        | 问题                        | 解决方案                         |
| ----------- | --------------------------- | -------------------------------- |
| 样式兼容    | margin、padding 默认不一致  | 使用 normalize.css               |
| CSS 属性    | transform / transition      | 加 -webkit- / -moz- 前缀         |
| JS 特性     | IE 不支持 Promise、箭头函数 | 使用 Babel 转译                  |
| 事件模型    | IE 用 attachEvent           | 判断后分别调用                   |
| 滚动属性    | scrollTop 不统一            | documentElement 与 body 兼容写法 |
| 媒体标签    | video / audio 格式不兼容    | 提供多格式 source                |
| 移动端      | fixed 定位失效              | 使用 absolute + overflow         |
| placeholder | IE9 以下不支持              | JS 模拟或 polyfill               |

---
# webworker
> ## **Web Worker 是什么？有什么用？怎么用？限制是什么？**

---

## 🧩 一、是什么（定义）

> **Web Worker** 是一种在浏览器中开启 **独立线程** 的机制，
> 用来在**后台线程执行耗时的 JavaScript 代码**，
> 不会阻塞主线程（UI 渲染、事件响应）。

简单说：
➡️ JS 默认是单线程的（主线程负责 UI + JS 逻辑），
➡️ Web Worker 就是**创建一个子线程**，让复杂计算异步执行，
➡️ 执行完后通过消息机制把结果传回主线程。

---

## ⚙️ 二、使用方式（核心API）

### 1️⃣ 创建 Worker

```js
// main.js
const worker = new Worker('worker.js');
```

### 2️⃣ 发送消息

```js
worker.postMessage({ num: 100 });
```

### 3️⃣ 接收消息

```js
worker.onmessage = function (e) {
  console.log('结果：', e.data);
};
```

### 4️⃣ worker.js 文件

```js
// worker.js
onmessage = function (e) {
  const num = e.data.num;
  let result = 0;
  for (let i = 0; i < num; i++) {
    result += i;
  }
  postMessage(result); // 发回主线程
};
```

---

## 🧠 三、工作原理（面试说法）

> Web Worker 运行在浏览器的独立线程中，
> 通过 **消息事件（postMessage/onmessage）** 与主线程通信，
> 采用 **拷贝（structured clone）机制** 传递数据，不共享内存。

💡 这样可以避免线程竞争，但传输大对象会有性能消耗。

---

## ⚡ 四、应用场景

| 场景    | 示例               |
| ----- | ---------------- |
| 大量计算  | 图像处理、加密、排序、大数据运算 |
| 数据解析  | JSON 大文件解析       |
| WebGL | 渲染前数据计算          |
| 实时应用  | 股票、游戏逻辑          |

---

## 🧱 五、限制 / 注意事项

1. 无法操作 **DOM**、**window**、**document**；
2. 不能访问主线程变量；
3. 数据传递是拷贝（不是共享）；
4. 必须通过 **HTTPS 或本地文件协议**；
5. 文件路径必须是同源或可访问的；
6. 需要手动关闭：

   ```js
   worker.terminate();
   ```

---

## 🧩 六、扩展（高级）

* **SharedWorker**：多个页面共享同一个 worker。
* **Service Worker**：用于离线缓存、拦截请求（PWA 用得多）。
* **Web Worker + WebAssembly**：高性能计算组合拳。

---

## 🗣 面试简答模板

> Web Worker 是浏览器提供的多线程机制，
> 用于在后台执行耗时任务，避免阻塞主线程。
> 主线程与 Worker 通过 `postMessage` / `onmessage` 通信，
> Worker 无法访问 DOM，仅能处理计算逻辑。
> 常用于大数据计算、图像处理、JSON 解析等场景。

---

是否要我帮你画一个 **「主线程 vs Worker 消息流图」**？
那张图能帮你 10 秒讲清整个工作原理 🔥
