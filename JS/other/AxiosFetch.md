# 💯💯💯 Fetch

> ### 使用 Fetch API 获取 JSON 数据

###### 后端

```js
// server.js
const express = require("express");
const app = express();
const port = 3000;

// 模拟数据库中的用户数据
const users = [
  { id: 1, name: "张三", email: "zhangsan@example.com" },
  { id: 2, name: "李四", email: "lisi@example.com" },
  { id: 3, name: "王五", email: "wangwu@example.com" },
];

// 定义一个GET接口，当访问 /api/users 时返回JSON数据
app.get("/api/users", (req, res) => {
  // Express会自动将JavaScript对象转换为JSON字符串
  res.json(users);
});

app.listen(port, () => {
  console.log(`服务器正在监听端口 http://localhost:${port}`);
});
```

###### js 使用

```js
// client.js
document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3000/api/users")
    .then((response) => {
      // 检查响应是否成功
      if (!response.ok) {
        throw new Error("网络请求失败");
      }
      // 将JSON响应体解析为JavaScript对象
      return response.json();
    })
    .then((users) => {
      // 成功获取数据，并进行页面操作
      const userList = document.getElementById("user-list");
      users.forEach((user) => {
        const li = document.createElement("li");
        li.textContent = `ID: ${user.id}, 姓名: ${user.name}, 邮箱: ${user.email}`;
        userList.appendChild(li);
      });
    })
    .catch((error) => {
      console.error("获取数据出错:", error);
    });
});
```

###### react 使用

```js
import React, { useState, useEffect } from "react";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 定义一个异步函数来处理数据请求
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // 依赖项为空数组，确保只在组件挂载时运行一次

  if (loading) return <div>加载中...</div>;
  if (error) return <div>加载出错：{error.message}</div>;

  return (
    <div>
      <h1>用户列表</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
```

> ### 使用 Fetch API 发送 JSON 数据

###### 后端

```js
// server.js
const express = require("express");
const app = express();
const port = 3000;

// 使用express.json()中间件来解析JSON格式的请求体
app.use(express.json());

// 模拟数据库中的用户数据
const users = [{ id: 1, name: "张三", email: "zhangsan@example.com" }];

// 定义一个POST接口，用于接收和处理前端发送的JSON数据
app.post("/api/users", (req, res) => {
  const newUser = req.body; // req.body已经是解析后的JS对象
  newUser.id = users.length + 1;
  users.push(newUser);
  console.log("接收到新用户:", newUser);
  res.status(201).json({ message: "用户创建成功", user: newUser });
});

app.listen(port, () => {
  console.log(`服务器正在监听端口 http://localhost:${port}`);
});
```

###### js 使用

```js
// client.js
const newUser = {
  name: "赵六",
  email: "zhaoliu@example.com",
};

fetch("http://localhost:3000/api/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json", // 告诉服务器请求体是JSON格式
  },
  body: JSON.stringify(newUser), // 将JS对象转为JSON字符串发送
})
  .then((response) => {
    if (!response.ok) {
      throw new Error("网络请求失败");
    }
    return response.json();
  })
  .then((data) => {
    console.log("新用户创建成功:", data);
  })
  .catch((error) => {
    console.error("发送数据出错:", error);
  });
```

###### react 使用

```js

```

# 💯💯💯 Axios

> ### Axios 获取数据

######  后端
```js

```
###### js 使用
```js

```
###### react 使用
```js
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // 导入 axios

function UserListWithAxios() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users'); // 使用 axios.get
        setUsers(response.data); // Axios自动处理JSON解析
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>加载中...</div>;
  if (error) return <div>加载出错：{error.message}</div>;

  return (
    <div>
      <h1>用户列表（使用Axios）</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} ({user.email})</li>
        ))}
      </ul>
    </div>
  );
}

export default UserListWithAxios;

```
> ### Axios 发送数据

######  后端
```js

```
###### js 使用
```js

```
###### react 使用
```js
import React, { useState } from 'react';
import axios from 'axios';

function AddUserForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // 阻止表单默认提交行为
    try {
      const response = await axios.post('/api/users', { name, email });
      setMessage(`成功创建用户: ${response.data.user.name}`);
      setName('');
      setEmail('');
    } catch (error) {
      setMessage(`创建用户失败: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>添加新用户</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>姓名:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>邮箱:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <button type="submit">添加</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AddUserForm;

```