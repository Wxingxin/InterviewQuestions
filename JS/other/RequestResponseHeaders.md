## 我们来系统整理：

## 🧩 一、`Request` 对象 — 请求信息的封装

### 🌱 基本介绍

`Request` 对象表示一次 **HTTP 请求**，你可以用它查看、修改、或创建新的请求。
在 `fetch()` 中可以直接传入 `Request` 实例：

```js
const request = new Request('/api/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Jiaxing' })
});

fetch(request)
  .then(res => res.json())
  .then(data => console.log(data));
```

---

### 🧠 常见属性

| 属性            | 说明                                                                                            |
| ------------- | --------------------------------------------------------------------------------------------- |
| `url`         | 请求的 URL                                                                                       |
| `method`      | 请求方法，如 `'GET'`, `'POST'`, `'PUT'`, `'DELETE'`                                                 |
| `headers`     | 一个 `Headers` 对象，表示请求头                                                                         |
| `bodyUsed`    | `true/false` 表示请求体是否已被读取                                                                      |
| `redirect`    | 请求的重定向模式（如 `'follow'`, `'error'`, `'manual'`）                                                 |
| `mode`        | CORS 模式：`'cors'`、`'no-cors'`、`'same-origin'`                                                  |
| `credentials` | 是否带上 Cookie：`'omit'`, `'same-origin'`, `'include'`                                            |
| `cache`       | 缓存模式：`'default'`, `'no-store'`, `'reload'`, `'no-cache'`, `'force-cache'`, `'only-if-cached'` |
| `integrity`   | 子资源完整性检查（Subresource Integrity）用的哈希值                                                          |

---

### 📦 方法

| 方法                                                              | 说明                       |
| --------------------------------------------------------------- | ------------------------ |
| `clone()`                                                       | 克隆当前请求对象（因为 body 只能读一次）  |
| `arrayBuffer()` / `text()` / `json()` / `formData()` / `blob()` | 读取请求体内容（与 `Response` 类似） |

---

### 💡 示例：带自定义 Header 的请求

```js
const req = new Request('/api/test', {
  method: 'POST',
  headers: new Headers({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123'
  }),
  body: JSON.stringify({ msg: 'Hello' })
});
```

---

## 🧭 二、`Response` 对象 — 响应信息的封装

### 🌱 基本介绍

`Response` 表示 **一次 HTTP 响应**。
`fetch()` 返回的结果就是一个 `Response` 对象。

```js
fetch('/api/data')
  .then(response => {
    console.log(response.status); // 200
    console.log(response.ok);     // true
    return response.json();
  })
  .then(data => console.log(data));
```

---

### 🧠 常见属性

| 属性           | 说明                              |
| ------------ | ------------------------------- |
| `status`     | HTTP 状态码，如 `200`, `404`         |
| `statusText` | 状态描述，如 `'OK'`                   |
| `ok`         | 布尔值，状态码在 200~299 之间为 true       |
| `headers`    | 响应头（`Headers` 对象）               |
| `url`        | 响应的 URL                         |
| `type`       | 响应类型（`basic`, `cors`, `opaque`） |
| `redirected` | 是否发生过重定向                        |
| `bodyUsed`   | 响应体是否被读取过                       |

---

### 📦 方法

| 方法                      | 说明             |
| ----------------------- | -------------- |
| `clone()`               | 克隆响应（响应体只能读一次） |
| `arrayBuffer()`         | 获取二进制数据        |
| `blob()`                | 获取 Blob 数据     |
| `formData()`            | 获取表单数据         |
| `json()`                | 解析为 JSON 对象    |
| `text()`                | 获取纯文本          |
| `redirect(url, status)` | 创建一个重定向响应      |
| `error()`               | 创建一个网络错误响应     |

---

### 💡 示例：构造一个假的响应对象

```js
const res = new Response(JSON.stringify({ success: true }), {
  status: 200,
  headers: { 'Content-Type': 'application/json' }
});

res.json().then(console.log); // { success: true }
```

---

## 🧾 三、`Headers` 对象 — HTTP 头的管理

### 🌱 基本介绍

`Headers` 对象是一个 **键值对集合**，用于操作请求或响应头。

```js
const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.set('Authorization', 'Bearer 123');
console.log(headers.get('Content-Type')); // application/json
```

---

### 🧠 常用方法

| 方法                    | 说明              |
| --------------------- | --------------- |
| `append(name, value)` | 添加一个新的头（不会覆盖原值） |
| `set(name, value)`    | 设置（或覆盖）一个头      |
| `get(name)`           | 获取指定头的值         |
| `has(name)`           | 是否存在该头          |
| `delete(name)`        | 删除某个头           |
| `forEach(callback)`   | 遍历所有头           |

---

### 💡 示例：遍历所有响应头

```js
fetch('/api')
  .then(res => {
    for (let [key, value] of res.headers) {
      console.log(key, value);
    }
  });
```

---

## 🔁 四、三者关系总结

| 对象         | 作用         | 常见来源                                   | 典型用法                        |
| ---------- | ---------- | -------------------------------------- | --------------------------- |
| `Request`  | 封装 HTTP 请求 | `fetch()` 参数                           | 设置 method、headers、body      |
| `Response` | 封装 HTTP 响应 | `fetch()` 返回值                          | 读取 json() / text() / status |
| `Headers`  | 封装头信息      | `Request.headers` 或 `Response.headers` | 操作 header 键值对               |

---

## ⚙️ 五、经典案例整合

### ✅ 1. 自定义请求 + 处理响应

```js
const req = new Request('/api/user', {
  method: 'POST',
  headers: new Headers({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token'
  }),
  body: JSON.stringify({ username: 'Tom' })
});

fetch(req)
  .then(res => {
    if (!res.ok) throw new Error('请求失败');
    return res.json();
  })
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

---

### ✅ 2. 克隆请求与响应（防止 body 被消耗）

```js
fetch('/api')
  .then(res => {
    const copy = res.clone();
    res.text().then(console.log);     // 原始内容
    copy.json().then(console.log);    // JSON 格式
  });
```

---

### ✅ 3. 构建 mock Response（常用于测试）

```js
async function mockData() {
  const fakeRes = new Response(JSON.stringify({ id: 1, name: 'AI' }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200
  });
  return fakeRes.json();
}

mockData().then(console.log);
```

---

## 🧩 六、常见面试题

| 问题                 | 答案要点                                            |
| ------------------ | ----------------------------------------------- |
| `fetch` 的返回值是什么？   | 返回一个 `Promise<Response>`                        |
| 如何读取响应体？           | `response.text()` / `response.json()` 等，且只能读取一次 |
| 如何设置自定义请求头？        | 使用 `Headers` 或直接在 `fetch` 中设置 `headers`         |
| 如何克隆请求或响应？         | 使用 `.clone()` 方法                                |
| 为什么要克隆？            | 因为 body 流只能被读取一次                                |
| 如何发送带 cookie 的请求？  | 设置 `credentials: 'include'`                     |
| `response.ok` 的作用？ | 判断状态码是否在 200~299 之间                             |

---

是否希望我下一步帮你画一张 **Request、Response、Headers 的关系图（含生命周期）**？
那样你可以更直观地理解 fetch 请求在底层的执行流程。
