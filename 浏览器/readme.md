# 💯💯💯 进程和线程

> ## 一、基本概念

### **1️⃣ 进程（Process）**

- 是操作系统**资源分配**的最小单位
- 每个进程拥有独立的**内存空间**、**数据栈**、**文件描述符**等系统资源。
- 举例：

  > 你打开 Chrome、VS Code、微信 —— 每一个都是一个独立的进程。

### **2️⃣ 线程（Thread）**

- 是操作系统**调度的**最小单位
- 线程是进程中的一个**执行流**，同一进程的多个线程**共享进程的内存空间**。
- 举例：

  > Chrome 打开多个标签页，每个标签页可能对应不同的线程，但它们共享浏览器进程的内存。

---

### 🧩 二、进程与线程的关系

| 对比项        | 进程                       | 线程                                 |
| ------------- | -------------------------- | ------------------------------------ |
| 概念          | 系统资源分配的基本单位     | 程序执行的最小单位                   |
| 内存空间      | 独立                       | 共享（同一进程内）                   |
| 通信方式      | 进程间通信（IPC，复杂）    | 共享内存（简单高效）                 |
| 创建/销毁开销 | 大                         | 小                                   |
| 稳定性        | 高，一个崩溃不影响其他进程 | 低，一个线程崩溃可能导致整个进程崩溃 |
| 并发性        | 可并发（多进程）           | 可并发（多线程）                     |

---

> ## ⚙️ 三、为什么需要线程？

多线程能：

- 提高程序的并发性（同时执行多个任务）
- 更好地利用多核 CPU
- 提升 I/O 密集型任务的效率（如网络请求）

🧠 举例：

- 浏览器中：

  - 一个线程处理用户输入
  - 一个线程渲染页面
  - 一个线程进行网络请求

---

## 🧱 四、常见的面试回答结构（标准版）

> 面试官：“说说你对进程和线程的理解？”

✅ 可以这样回答：

> 进程是操作系统分配资源的最小单位，而线程是操作系统调度的最小单位。
> 一个进程可以包含多个线程，线程之间共享进程的内存和资源，因此线程之间通信更高效，但也更容易造成资源竞争和安全问题。
> 进程之间相互独立，稳定性更高，但通信成本更大。
> 在实际开发中，我们通常会根据场景选择多进程或多线程方案，比如浏览器采用多进程架构来提高稳定性，而 Node.js 则通过单线程+事件循环的方式处理并发。

---

## 🔍 五、延伸问题（面试进阶）

1. **线程共享哪些资源？**

   - 共享：堆、静态变量、打开的文件等。
   - 不共享：寄存器、栈（函数调用记录）等。

2. **进程间通信（IPC）有哪些方式？**

   - 管道（Pipe）
   - 消息队列（Message Queue）
   - 共享内存（Shared Memory）
   - 信号（Signal）
   - 套接字（Socket）

3. **多线程的常见问题**

   - 线程安全（如多个线程同时修改同一变量）
   - 死锁（两个线程相互等待资源）
   - 上下文切换开销（线程切换需要保存/恢复状态）

4. **Node.js 单线程如何实现并发？**

   - Node.js 虽是单线程（主线程），但依靠 **事件循环（Event Loop）** 和 **I/O 多路复用（libuv）** 实现高并发。

---

## 🚀 六、总结一句话回答（面试速答）

> 进程是资源分配的单位，线程是执行调度的单位。
> 进程之间相互独立，线程共享内存空间。
> 多进程稳定，多线程高效。

# websocket

**WebSocket 是什么？一句话记住：**

WebSocket 就是让浏览器和服务器建立一条“**永远不断开的双向通道**”，双方可以随时互相发消息，不用你一直去轮询问“有新消息吗？”。

| 对比项目         | 传统 HTTP（短连接）               | WebSocket（长连接）                  |
|------------------|------------------------------------|---------------------------------------|
| 连接方式         | 每次请求都要重新建立连接           | 握手一次后就一直保持连接              |
| 数据方向         | 只能浏览器 → 服务器 → 浏览器       | 双方可以随时互相发消息                |
| 实时性           | 差（靠轮询或长轮询）               | 极高（毫秒级推送）                    |
| 服务器压力       | 高（频繁建立连接）                 | 极低（一个连接用到底）                |
| 典型场景         | 普通网页、表单提交                 | 聊天室、直播弹幕、实时股价、在线协同   |

### WebSocket 的生命周期（就 4 步）

1. 客户端（浏览器）发一个特殊的 HTTP 请求（升级请求）
2. 服务器同意升级 → 变成 WebSocket 连接
3. 之后双方都可以随时发消息
4. 任意一方调用 close() 就断开

### 真实使用方式（Node.js + 前端完整代码）

#### 1. 后端：用 ws（最轻量）或 Socket.IO（最流行）

**推荐新手直接用 Socket.IO**，因为它自动兼容低版本浏览器、自动重连、心跳检测。

```bash
npm install socket.io
```

**后端 server.js（Express + Socket.IO）**

```js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }  // 开发时允许跨域
});

// 有人连接时触发
io.on('connection', (socket) => {
  console.log('一个用户连接了:', socket.id);

  // 给这个用户发欢迎消息
  socket.emit('message', { user: '系统', text: '欢迎加入聊天室！' });

  // 监听客户端发来的消息
  socket.on('sendMessage', (data) => {
    // 广播给所有人（包括自己）
    io.emit('message', { user: socket.id.slice(0,6), text: data.text });
    // 或者发给除了自己之外的所有人： socket.broadcast.emit(...)
  });

  // 用户断开连接
  socket.on('disconnect', () => {
    console.log('用户离开了:', socket.id);
    io.emit('message', { user: '系统', text: '有人退出了聊天室' });
  });
});

server.listen(3000, () => {
  console.log('WebSocket 服务器运行在 ws://localhost:3000');
});
```

#### 2. 前端：浏览器中直接使用

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>WebSocket 聊天室</title>
</head>
<body>
  <div id="messages"></div>
  <input id="input" placeholder="说点什么..." />
  <button onclick="send()">发送</button>

  <script src="/socket.io/socket.io.js"></script>
  <script>
    // 自动连接到后端
    const socket = io('http://localhost:3000');

    // 连接成功
    socket.on('connect', () => {
      console.log('已连接，id:', socket.id);
    });

    // 收到消息
    socket.on('message', (msg) => {
      const div = document.createElement('div');
      div.innerHTML = `<b>${msg.user}:</b> ${msg.text}`;
      document.getElementById('messages').appendChild(div);
    });

    function send() {
      const input = document.getElementById('input');
      socket.emit('sendMessage', { text: input.value });
      input.value = '';
    }

    // 回车发送
    document.getElementById('input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') send();
    });
  </script>
</body>
</html>
```

运行后打开多个浏览器窗口，你会发现：**谁发消息，所有人都立刻收到！**

### 常见的真实使用场景（2025 年）

| 场景               | 为什么必须用 WebSocket                     |
|-------------------|---------------------------------------------|
| 聊天室 / IM        | 消息要秒达                                  |
| 直播间弹幕         | 几十万观众同时发弹幕                        |
| 实时股价 / 体育比分| 数据每秒都在变                              |
| 在线协同文档（像石墨、飞书）| 多个人同时编辑，光标位置要实时同步         |
| 游戏联机           | 玩家位置、动作要实时传输                    |
| 设备监控 / IoT     | 服务器要主动推警报给浏览器                  |

### 一句话总结 WebSocket

**WebSocket = 浏览器和服务器之间的一根“网线”，插上之后双方可以随时互相喊话，再也不用你一直敲门问“有没有新消息”。**

掌握了它，你就真正掌握了“实时应用”的核心技术，现在所有大厂的前端面试都会考这个。

# token

### **Token 是什么？**

简单来说，**Token（令牌）**就是你在互联网上证明“我是我”的一个“临时身份证”。  
它是一串很长的乱码字符串（比如一两百个字符），由后端服务器生成，发给你的浏览器或手机 App，你拿着它去访问任何需要登录的接口，后端一看这个 token 就知道是你，就给你放行。

最常见的 token 就是 **JWT**（我们上一个问题讲的那个 eyJhbGci... 开头的长字符串）。

### Token 到底有什么用？（核心作用就这 3 点）

| 用途                 | 传统 session 的做法                       | 用 token 的做法（现代做法）                      | 谁更好？ |
| -------------------- | ----------------------------------------- | ------------------------------------------------ | -------- |
| 1. 证明你已经登录    | 后端在服务器内存或 Redis 里存一个 session | 后端啥也不存，只发一个 token 给你                | token 胜 |
| 2. 记住“你是谁”      | 后端查 session 表才能知道用户 ID          | token 里直接写死用户 ID、角色（加密的）          | token 胜 |
| 3. 分布式/微服务友好 | 所有服务器必须共享同一个 session 存储     | 每台服务器都能独立验证 token，不需要共享任何东西 | token 胜 |

一句话总结：  
**Token 就是让后端变成“无状态”的关键** —— 服务器不需要记住你是谁，你自己带身份证（token）来就行。

### 真实生活中的类比（最好理解）

| 现实场景       | 传统 session                       | Token（JWT）方式                      |
| -------------- | ---------------------------------- | ------------------------------------- |
| 去游乐园玩     | 买票后手盖一个章（服务器记住了你） | 买票后给你一张带二维码的门票（token） |
| 玩第二个项目   | 工作人员看你手上的章               | 工作人员扫你门票上的二维码            |
| 换一个工作人员 | 必须和第一个工作人员用同一本记录本 | 任何工作人员都能扫二维码识别          |
| 你把票弄丢了   | 手上的章还在，能继续玩             | 门票丢了就彻底进不去了（更安全）      |

### Token 的生命周期（你每天都在经历）

1. 你输入用户名密码 → 点击登录
2. 后端校验成功 → 生成 token（有效期一般 1 小时～ 30 天） → 返回给你
3. 你的浏览器自动保存 token（localStorage 或 cookie）
4. 你打开“我的订单”“个人中心”等页面 → 浏览器自动把 token 带上发给后端
5. 后端验证 token 正确 → 返回你的订单、个人信息
6. token 过期或你点退出登录 → token 被删或失效 → 必须重新登录

### 常见的 Token 类型（你一定会碰到）

| 类型          | 说明                                              | 使用场景                            |
| ------------- | ------------------------------------------------- | ----------------------------------- |
| JWT（最常见） | 一串加密的字符串，里面包含用户 ID、过期时间等     | 前后端分离、APP、小程序、微信公众号 |
| Access Token  | 短期 token（比如 1 小时）                         | 访问接口                            |
| Refresh Token | 长期 token（比如 30 天），用来换新的 access token | 实现“30 天内免登录”                 |
| OAuth2 Token  | 第三方登录（微信、QQ、GitHub 登录）返回的 token   | 社交登录                            |

### 总结：一句话记住 token

**Token 就是你登录成功后，后端发给你的一张“数字身份证”，以后每次访问需要登录的地方，你把这张身份证出示一下，后端就知道是你了，不用再输入密码。**

它让登录变得：

- 更安全（不存密码）
- 更快（服务器不用查数据库）
- 更适合移动端和分布式系统（无状态）

现在 99% 的新项目（包括你用的微信小程序、抖音、淘宝 App、后台管理系统）全部都在用 token，而不是老式的 session 了。

### token 无感刷新怎么做的

“Token 无感刷新”（也叫静默刷新、自动续期）是现在所有大厂前端项目（包括淘宝、微信、抖音、企业后台等）的标配功能。

目标：用户在登录状态下，只要浏览器/APP 没关，或者在几十分钟内有操作，就永远不用重新输入账号密码看到“登录过期”。

### 核心思想（就两类 token）

| 名称          | 有效期          | 作用                                   | 存哪里               |
| ------------- | --------------- | -------------------------------------- | -------------------- |
| access_token  | 短（5~60 分钟） | 真正用来请求业务的 token               | localStorage / 内存  |
| refresh_token | 长（7~90 天）   | 专门用来“换”一个新 access_token 的凭证 | 必须 httpOnly Cookie |

只要 refresh_token 没过期，就能无限自动换出新的 access_token，用户完全无感知。

### 完整无感刷新流程图（2025 年最标准的做法）

```js
用户登录成功
    ↓
后端同时返回：
   access_token（15 分钟） → 存在内存或 localStorage
   refresh_token（30 天）  → 只能用 httpOnly + Secure + SameSite Cookie 存
    ↓
用户在 15 分钟内随便请求接口 → 直接用 access_token（走正常接口）
    ↓
第 14 分钟请求时，发现 access_token 快过期或已经过期
    ↓
前端自动发一个请求到 /auth/refresh（带上浏览器的 Cookie，自动带 refresh_token）
    ↓
后端校验 refresh_token 有效 → 重新生成一个新的 access_token（再给 15 分钟）
    ↓
把新的 access_token 返回给前端，前端替换旧的
    ↓
当前业务请求继续用新 token 发，或者前端自动重试刚才的请求
    ↓
用户完全无感知，继续操作
```

### 真实代码实现（Express + 前端 axios 版）

#### 后端（Node.js Express）

```js
// 1. 登录时同时种下两个 token
app.post("/api/login", (req, res) => {
  // ...校验密码成功
  const user = { id: 123, username: "张三" };

  const accessToken = jwt.sign({ userId: user.id }, SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, {
    expiresIn: "30d",
  });

  // 重点：refresh_token 只能走 httpOnly Cookie！
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: true, // https 才发
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 天
  });

  res.json({ access_token: accessToken });
});

// 2. 刷新接口（前端会自动调用）
app.post("/api/refresh", (req, res) => {
  const oldRefreshToken = req.cookies.refresh_token;
  if (!oldRefreshToken) return res.status(401).json({ message: "无刷新凭证" });

  try {
    const decoded = jwt.verify(oldRefreshToken, REFRESH_SECRET);
    const newAccessToken = jwt.sign({ userId: decoded.userId }, SECRET, {
      expiresIn: "15m",
    });

    // 可选：再换一个新的 refresh_token（更安全，叫做 token rotation）
    const newRefreshToken = jwt.sign(
      { userId: decoded.userId },
      REFRESH_SECRET,
      { expiresIn: "30d" }
    );
    res.cookie("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({ access_token: newAccessToken });
  } catch (err) {
    res.status(401).json({ message: "刷新 token 无效" });
  }
});
```

#### 前端（axios 拦截器自动无感刷新）

```js
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      if (isRefreshing) {
        // 正在刷新中，其他请求等着
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          error.config.headers.Authorization = "Bearer " + token;
          return api(error.config);
        });
      }

      error.config._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          "/api/refresh",
          {},
          { withCredentials: true }
        );
        const newToken = data.access_token;
        api.defaults.headers.common["Authorization"] = "Bearer " + newToken;
        localStorage.setItem("token", newToken); // 如果你存了的话

        processQueue(null, newToken);
        return api(error.config); // 重试原来的请求
      } catch (refreshError) {
        processQueue(refreshError, null);
        // 刷新也失败 → 跳转登录页
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
```

### 最终效果

- 用户登录一次，可以连续用 30 天不输密码
- 每 15 分钟自动静默刷新一次，完全无感知
- 即使关掉浏览器再打开，只要 Cookie 里的 refresh_token 没过期，打开页面会自动调用 /refresh 拿到新 token，继续登录状态
- 安全性极高（refresh_token 永远拿不到 JS，防 XSS）

# 网络攻击

非常好 👍 这个题目在**前端、后端、安全岗**面试中都经常出现。
下面是最全的《网络攻击面试题大全》，涵盖了常考的 **原理 + 举例 + 防御手段 + 面试回答套路**。

---

# 💥 网络攻击 面试题大全

---

## 🌐 一、网络攻击分类总览

| 类型               | 代表攻击方式                                | 简介                            |
| ------------------ | ------------------------------------------- | ------------------------------- |
| **应用层攻击**     | XSS、CSRF、SQL 注入、命令注入、文件上传漏洞 | 针对 Web 应用逻辑或输入处理漏洞 |
| **网络层攻击**     | DoS、DDoS、ARP 欺骗、DNS 劫持、IP 欺骗      | 针对网络协议与通信层            |
| **系统层攻击**     | 缓冲区溢出、权限提升、木马、后门            | 针对操作系统或服务器漏洞        |
| **社会工程学攻击** | 钓鱼网站、伪造邮件、社交欺骗                | 利用人的信任心理                |

---

## 🧱 二、Web 应用常见攻击

### 1️⃣ **XSS（跨站脚本攻击）**

**原理：**
攻击者在网页中注入恶意 JS 脚本，当其他用户访问该页面时被执行，从而窃取 cookie、会话信息或篡改页面。

**类型：**

- 反射型 XSS（通过 URL 参数触发）
- 存储型 XSS（存入数据库）
- DOM 型 XSS（前端渲染时触发）

**防御：**

- 对输入进行转义（`<`、`>`、`"`、`'`）
- 使用 CSP（Content Security Policy）
- HttpOnly Cookie

**面试高频题：**

> 如何防御 XSS？
> ✅ 使用 `encode` 转义用户输入，开启 CSP，禁用内联脚本。

---

### 2️⃣ **CSRF（跨站请求伪造）**

**原理：**
攻击者诱导用户点击恶意链接，使用户在已登录状态下向服务器发出请求（例如转账、改密码）。

**防御：**

- 验证 Referer 或 Origin
- 添加 CSRF Token（如 `csrf_token`）
- 使用 SameSite Cookie 属性

**面试高频题：**

> XSS 和 CSRF 的区别？
> ✅ XSS 是注入脚本执行，CSRF 是利用用户身份伪造请求。

---

### 3️⃣ **SQL 注入（SQL Injection）**

**原理：**
通过拼接 SQL 语句注入恶意代码，窃取或修改数据库数据。

```sql
SELECT * FROM users WHERE username = 'admin' OR '1'='1';
```

**防御：**

- 使用预编译语句（`PreparedStatement`、`?` 占位）
- 严格验证输入（正则、白名单）
- 限制数据库权限

**面试题：**

> 如何防御 SQL 注入？
> ✅ 参数化查询 + 输入校验 + 最小权限原则。

---

### 4️⃣ **命令注入**

**原理：**
用户输入被拼接进系统命令，导致执行恶意命令。

```js
exec("ping " + userInput);
```

**防御：**

- 严格过滤输入字符（如 `; | &`）
- 不使用拼接命令，改用安全 API

---

### 5️⃣ **文件上传漏洞**

**原理：**
攻击者上传恶意文件（如 `.php`、`.jsp`），导致服务器被执行代码。

**防御：**

- 校验文件类型（MIME + 后缀名）
- 将上传目录设置为不可执行
- 随机化文件名

---

### 6️⃣ **目录遍历攻击**

**原理：**
通过 `../` 访问服务器敏感文件，如 `/etc/passwd`。

**防御：**

- 禁止路径拼接
- 使用白名单方式访问文件

---

### 7️⃣ **点击劫持（Clickjacking）**

**原理：**
攻击者在页面中嵌套透明 iframe，引诱用户点击。

**防御：**

- 添加 HTTP 头：`X-Frame-Options: DENY` 或 `SAMEORIGIN`

---

## 🌍 三、网络层攻击

### 1️⃣ **DoS / DDoS（拒绝服务攻击）**

**原理：**
通过发送大量无效请求，耗尽服务器带宽、CPU 或内存资源，使服务瘫痪。

**防御：**

- 启用流量清洗（CDN、云防护）
- 限制请求频率（Rate Limit）
- 使用负载均衡（Nginx、F5）

---

### 2️⃣ **ARP 欺骗**

**原理：**
伪造局域网内 ARP 响应包，欺骗网关，使流量被劫持。

**防御：**

- 启用静态 ARP 表
- 使用交换机防护（如 Port Security）

---

### 3️⃣ **DNS 劫持**

**原理：**
修改 DNS 记录，使用户访问错误网站（钓鱼或广告）。

**防御：**

- 使用可信 DNS（如 8.8.8.8）
- 启用 DNSSEC 验证

---

### 4️⃣ **IP 欺骗**

**原理：**
伪造源 IP 地址进行攻击，隐藏身份或绕过过滤。

**防御：**

- 服务器验证 TCP 三次握手
- 防火墙过滤异常 IP

---

## 🧠 四、系统层攻击

### 1️⃣ **缓冲区溢出**

**原理：**
输入超出预期长度的数据覆盖栈空间，注入恶意指令。

**防御：**

- 开启栈保护（StackGuard）
- 限制输入长度
- 使用安全函数如 `strncpy`

---

### 2️⃣ **木马 / 后门**

**原理：**
通过恶意程序远程控制主机或窃取数据。

**防御：**

- 定期查杀木马
- 关闭不必要端口

---

## 🧍‍♂️ 五、社会工程学攻击

| 类型         | 示例         | 防御                    |
| ------------ | ------------ | ----------------------- |
| **钓鱼攻击** | 模仿银行网站 | 检查域名、启用二步验证  |
| **假冒客服** | QQ/微信诈骗  | 企业实名认证            |
| **邮件欺骗** | 发件人伪造   | DKIM / SPF / DMARC 验证 |

---

## ⚔️ 六、常见面试题总结（高频汇总）

| 问题                   | 简要答案                              |
| ---------------------- | ------------------------------------- |
| 如何防御 XSS？         | 转义输出、HttpOnly Cookie、CSP        |
| 如何防御 CSRF？        | Token、Referer 验证、SameSite Cookie  |
| XSS 与 CSRF 区别？     | XSS 注入脚本执行，CSRF 利用身份发请求 |
| SQL 注入防御？         | 预编译、输入校验、最小权限            |
| DDoS 攻击原理？        | 多主机发送大量请求，耗尽资源          |
| DNS 劫持如何防？       | 使用可信 DNS、开启 HTTPS              |
| 点击劫持防御？         | 设置 `X-Frame-Options: DENY`          |
| Node.js 如何防御攻击？ | 限制请求速率、helmet 中间件、输入过滤 |

---

## 🧩 七、前端角度的防御总结

| 风险         | 防御方案                      |
| ------------ | ----------------------------- |
| XSS          | `escapeHTML()`、CSP、HttpOnly |
| CSRF         | CSRF Token、SameSite Cookie   |
| Clickjacking | `X-Frame-Options`             |
| 数据泄露     | HTTPS、敏感信息脱敏           |
| 依赖漏洞     | npm audit、Snyk 扫描          |

---

## 🧠 八、答题技巧总结

> 面试官问 “常见的 Web 攻击有哪些？怎么防御？”
> 可以这样答：

> 常见的 Web 攻击包括 XSS、CSRF、SQL 注入、文件上传漏洞等。
> XSS 主要是脚本注入，可以通过转义输出和 CSP 防御；
> CSRF 是伪造请求，可以通过 Token 和 SameSite 防御；
> SQL 注入是拼接 SQL 语句造成的，通过预编译和参数化查询防御。
> 此外，还有 DDoS、DNS 劫持、点击劫持等攻击，都需要在前后端共同防御。

---

是否需要我帮你整理成 **“面试速记表（PDF 版）”**？
包含：攻击原理 + 防御措施 + 一句话面试回答（可打印）

# 存储

> ## cookie 的属性是怎么存储的

## 💡 1. Cookie 的基本概念

> Cookie 是浏览器端用来保存少量数据的机制，通常用于**会话管理**、**用户身份识别**、**个性化设置**等。

- 存储在 **浏览器中**，分为两类：

  1.  **Session Cookie**：浏览器关闭后自动删除。
  2.  **Persistent Cookie**：有 `Expires` 或 `Max-Age`，在指定时间前有效。

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

   - 浏览器会把每个域名的 Cookie 单独存储。
   - 存储形式：

     - **内存中**（Session Cookie）
     - **磁盘中**（Persistent Cookie）

2. **发送规则**

   - 浏览器根据当前请求的 **域名 + 路径 + Secure/HttpOnly/SameSite** 决定是否发送该 Cookie。
   - Cookie 会自动附加在请求头中：

     ```http
     Cookie: token=abc123; theme=dark
     ```

3. **操作方式**

   - **前端 JS** 可通过 `document.cookie` 读写（非 HttpOnly Cookie）。
   - **后端** 通过 `Set-Cookie` 指定。

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

# 跨标签页

非常好 👍，你问的这个问题很关键。
我们先从最基础的概念讲起：**什么是“跨标签页”**。

---

## 🧩 一、什么是“跨标签页”

在浏览器中，我们打开的每一个网页（Tab）其实都是一个**独立的标签页（Tab Page）**。
例如：

- 你打开了两个相同的网站：

  - 标签页 1：`https://example.com/home`
  - 标签页 2：`https://example.com/profile`

这两个网页虽然看起来访问的是同一个网站，但它们**运行在两个不同的浏览器上下文（不同的执行环境）**。
也就是说，它们的：

- `window` 对象不同；
- `JavaScript` 运行环境独立；
- `变量、内存` 都不共享。

---

## 🧠 二、那什么是“跨标签页通信”

“跨标签页通信”就是指：

> 让两个（或多个）**打开的标签页**之间可以**互相发送、接收数据**。

换句话说，就是：

> 让不同的浏览器标签页能**互相感知状态变化**，比如：
>
> - 一个页面登录了，另一个也知道；
> - 一个页面清空购物车，另一个同步更新；
> - 打开多个同网站标签页时，数据保持同步。

---

## 📦 三、举几个通俗的例子

### ✅ 例 1：登录同步

- 你在“标签页 A”登录账号；
- “标签页 B”自动知道已经登录，不需要刷新。

👉 实际上，这是典型的“跨标签页通信”场景。

---

### ✅ 例 2：退出登录同步

- 你在“标签页 A”退出；
- “标签页 B”自动回到登录页。

---

### ✅ 例 3：实时协作或消息通知

- 一个标签页发消息；
- 另一个标签页实时接收，不用依赖服务器推送。

---

## ⚙️ 四、为什么它是“跨标签页”

因为：

- 这些标签页运行在**不同的 JS 运行环境**；
- 正常情况下，它们不能直接访问对方的变量或函数；
- 所以我们需要借助浏览器提供的**机制（storage、BroadcastChannel、Service Worker 等）**，
  来“跨越”标签页之间的隔离，实现通信。

---

## 🧩 五、简单图示（文字版）

```
┌────────────────────────────┐
│ 标签页 A (https://example.com) │
│                              │
│  localStorage.setItem()      │
│  → 通知其它同源标签页         │
└──────────────┬──────────────┘
               │
               ▼
┌────────────────────────────┐
│ 标签页 B (https://example.com) │
│                              │
│  window.onstorage 监听到变化  │
│  → 更新页面状态              │
└────────────────────────────┘
```

---

## ✅ 六、总结一句话：

> “跨标签页”指的是**不同浏览器标签页之间的数据共享或通信**。
> 它常用于实现**登录同步、消息通知、数据同步**等功能。

---

要不要我接着帮你画一张简洁的图（显示多个标签页如何通信）？这样你一眼就能看懂“跨标签页”的本质。

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

## ⚙️ 二、使用方式（核心 API）

### 1️⃣ 创建 Worker

```js
// main.js
const worker = new Worker("worker.js");
```

### 2️⃣ 发送消息

```js
worker.postMessage({ num: 100 });
```

### 3️⃣ 接收消息

```js
worker.onmessage = function (e) {
  console.log("结果：", e.data);
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

| 场景     | 示例                             |
| -------- | -------------------------------- |
| 大量计算 | 图像处理、加密、排序、大数据运算 |
| 数据解析 | JSON 大文件解析                  |
| WebGL    | 渲染前数据计算                   |
| 实时应用 | 股票、游戏逻辑                   |

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

- **SharedWorker**：多个页面共享同一个 worker。
- **Service Worker**：用于离线缓存、拦截请求（PWA 用得多）。
- **Web Worker + WebAssembly**：高性能计算组合拳。

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
