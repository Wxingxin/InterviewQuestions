> # 浏览器要ajax，怎么避免明文传输

这题考察前端安全意识和网络传输安全，面试中可以这样回答：

---

## 💡 问题背景

> 浏览器通过 AJAX 向服务器发送请求，如果不加密，账号、密码、Token 等敏感信息可能被抓包明文获取。

---

## ✅ 1. 使用 HTTPS（最基本且必须）

* 将请求改为 **HTTPS 协议**，浏览器和服务器之间的通信自动使用 **TLS/SSL 加密**。
* 优点：

  * 数据在传输过程中被加密，无法被中间人（MITM）轻易读取。
  * 支持身份验证，防止伪造服务器。
* 示例：

```js
fetch('https://api.example.com/login', {
  method: 'POST',
  body: JSON.stringify({ username, password }),
  headers: { 'Content-Type': 'application/json' }
});
```

---

## ✅ 2. 不在 URL 中传输敏感信息

* 避免使用 GET 传参敏感信息（如密码、Token），改用 POST 请求放在请求体。

```js
// ❌ 不安全
fetch(`https://api.example.com/login?password=${password}`);

// ✅ 安全
fetch('https://api.example.com/login', {
  method: 'POST',
  body: JSON.stringify({ username, password })
});
```

---

## ✅ 3. 可选加密手段（前端可加密）

* **对敏感字段加密**（如 RSA、AES）后再发送。
* 服务端解密处理：

```js
// 前端示意
const encryptedPassword = encryptRSA(password, publicKey);
fetch('/login', { method: 'POST', body: JSON.stringify({ password: encryptedPassword }) });
```

> 注意：此方法可以防止明文传输，但仍需 HTTPS 保证中间人不能篡改公钥。

---

## ✅ 4. 使用 Token 替代密码直接传输

* 登录后返回 **短期 Token**，后续请求只传 Token，而不传账号密码。
* Token 可设置过期和刷新机制（无感刷新）。

```js
fetch('/api/data', { headers: { 'Authorization': `Bearer ${token}` }});
```

---

## 📝 面试简答模板

> 浏览器通过 AJAX 请求时，避免明文传输的核心方法是使用 **HTTPS**。
> 其次：
>
> * 不在 URL 中传输敏感信息，使用 POST 请求体；
> * 可以对敏感字段进行加密（RSA/AES）；
> * 登录后使用 **短期 Token** 代替账号密码传输。

---

如果你需要，我可以帮你画一张 **“AJAX 安全传输示意图”**，展示 HTTPS + Token + 加密流程，一眼理解。

你希望我画吗？
