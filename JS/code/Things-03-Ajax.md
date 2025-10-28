# ajax 的 get 的使用

```js
const xhr = new XMLHttpRequest();

xhr.open("GET", "https://api.example.com/data", true);

xhr.responseType = "json";

xhr.send();

xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      console.log("request is success", xhr.response);
    } else {
      console.log("request is error", xhr.status);
    }
  }
};
```

# ajax post 的使用

```js
// 创建XMLHttpRequest对象
const xhr = new XMLHttpRequest();

// 配置POST请求，第三个参数true表示异步
xhr.open("POST", "https://api.example.com/submit", true);

// 设置请求头，POST请求通常需要指定Content-Type
// 发送JSON数据时使用application/json
xhr.setRequestHeader("Content-Type", "application/json");

// 可选：设置其他请求头（如认证信息）
// xhr.setRequestHeader('Authorization', 'Bearer token');

// 准备要发送的数据
const data = {
  username: "testuser",
  email: "test@example.com",
  message: "Hello World",
};

// 发送请求，将数据转换为JSON字符串
xhr.send(JSON.stringify(data));

// 监听请求状态变化
xhr.onreadystatechange = function () {
  // 当请求完成时
  if (xhr.readyState === 4) {
    if (xhr.status >= 200 && xhr.status < 300) {
      // 请求成功（2xx状态码）
      console.log("提交成功:", JSON.parse(xhr.responseText));
    } else {
      // 请求失败
      console.error("提交失败，状态码:", xhr.status, "响应:", xhr.responseText);
    }
  }
};
```

# 功能

| 功能点       | 原版实现 | 优化建议              |
| ------------ | -------- | --------------------- |
| 默认配置     | ✅       | ✅                    |
| GET 参数拼接 | ✅       | ✅                    |
| POST 提交    | ✅       | 支持 JSON             |
| 回调函数     | ✅       | 改为 Promise          |
| 错误处理     | ❌       | ✅ 网络错误、超时     |
| 请求头       | ❌       | ✅ 支持自定义 headers |

# 代码解释

```js
function ajax(options) {
  return new Promise((resolve, reject) => {
    // 1-1 创建xhr
    const xhr = new XMLHttpRequest();
    // 1-2 创建默认值
    const defaults = {
      url: "",
      method: "GET",
      data: null,
      headers: {},
    };

    // 2-1 合并配置
    const opts = Object.assign({}, defaults, options);

    //2-2 get 处理 GET 请求参数
    //如果是 GET 请求，并且有 data：
    //把 data 对象转换成查询字符串，例如 { id: 1, name: 'Tom' } → "id=1&name=Tom"。
    //拼接到 url 后面，例如 "/api/user" → "/api/user?id=1&name=Tom"。
    if (opts.method.toUpperCase() === "GET" && opts.data) {
      const params = new URLSearchParams(opts.data).toString();
      opts.url += (opts.url.includes("?") ? "&" : "?") + params;
    }

    // 2-3 设置请求头
    for (const key in opts.headers) {
      xhr.setRequestHeader(key, opts.headers[key]);
    }

    // 2-4 初始化请求
    xhr.open(opts.method, opts.url, true);

    // 3 发送请求
    xhr.send(
      opts.method.toUpperCase() === "POST"
        ? new URLSearchParams(opts.data).toString()
        : null
    );

    // 4-1 处理响应
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch {
            resolve(xhr.responseText);
          }
        } else {
          reject({ status: xhr.status, message: xhr.statusText });
        }
      }
    };

    // 4-2 错误处理
    xhr.onerror = () =>
      reject({ status: xhr.status, message: "Network Error" });
  });
}
```