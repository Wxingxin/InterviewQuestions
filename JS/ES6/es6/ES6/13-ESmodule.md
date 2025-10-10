# Commonjs

## 一、导出方式（Export）

### 1. 基本导出 - 单个成员

```javascript
// 导出字符串
exports.name = "CommonJS Guide";

// 导出数字
exports.version = 1.0;

// 导出布尔值
exports.isActive = true;

// 导出函数
exports.greet = function () {
  return "Hello from module";
};

// 导出对象
exports.config = {
  debug: true,
  port: 3000,
};

// 导出数组
exports.tags = ["js", "node", "module"];

// 导出类
exports.User = class {
  constructor(name) {
    this.name = name;
  }
};
```

### 2. 批量导出 - 使用 module.exports

```javascript
// 导出一个包含多个成员的对象
module.exports = {
  name: "CommonJS Guide",
  version: 1.0,
  greet: function () {
    return "Hello from module";
  },
  User: class {
    constructor(name) {
      this.name = name;
    }
  },
};
```

### 3. 导出单个函数/类

```javascript
// 导出单个函数
module.exports = function (a, b) {
  return a + b;
};

// 导出单个类
module.exports = class Calculator {
  add(a, b) {
    return a + b;
  }
  subtract(a, b) {
    return a - b;
  }
};
```

### 4. 混合导出方式

```javascript
// 先导出一些成员
exports.name = "混合导出示例";
exports.version = 1.0;

// 再添加更多导出
module.exports.greet = function () {
  return "Hello";
};

// 最终导出的是module.exports对象
```

## 二、导入方式（Require）

### 1. 基本导入

```javascript
// 导入本地模块
const myModule = require("./myModule");

// 导入后使用
console.log(myModule.name);
myModule.greet();
```

### 2. 选择性导入

```javascript
// 只导入需要的成员
const { greet, User } = require("./myModule");

// 直接使用导入的成员
greet();
const user = new User("John");
```

### 3. 导入并重命名

```javascript
// 导入时重命名成员
const { greet: sayHello, User: Person } = require("./myModule");

// 使用重命名后的成员
sayHello();
const person = new Person("John");
```

### 4. 导入全部并部分重命名

```javascript
const myModule = require("./myModule");
const { greet: sayHello } = myModule;

// 两种方式都可使用
myModule.name;
sayHello();
```

### 5. 导入不同类型的模块

```javascript
// 导入核心模块
const fs = require("fs");
const path = require("path");

// 导入第三方模块（从node_modules）
const lodash = require("lodash");
const express = require("express");

// 导入本地JavaScript文件
const utils = require("./utils");
const helpers = require("./helpers.js"); // .js扩展名可选

// 导入JSON文件
const config = require("./config.json");

// 导入目录（会查找package.json或index.js）
const api = require("./api");
```

# ESModule

## 📦 二、ESModule 导出语法（export）

### ✅ 1. 命名导出（Named export）

```js
// math.js
export const PI = 3.1415;
export function add(a, b) {
  return a + b;
}
```

### ✅ 2. 默认导出（Default export）

```js
// user.js
export default function getUser() {
  return { name: "Tom" };
}
```

---

## 📥 三、ESModule 导入语法（import）

### ✅ 1. 导入命名导出

```js
import { PI, add } from "./math.js";
```

### ✅ 2. 导入默认导出

```js
import getUser from "./user.js";
```

### ✅ 3. 两者同时导入

```js
import getUser, { PI, add } from "./main.js";
```

### ✅ 4. 重命名导入（避免冲突）

```js
import { add as plus } from "./math.js";
```

### ✅ 5. 导入整个模块为对象

```js
import * as MathUtils from "./math.js";

console.log(MathUtils.PI); // 3.14
```

---

## 🧩 四、ESModule 和 CommonJS 的区别

| 特性         | CommonJS (CJS)                    | ESModule (ESM)                              |
| ------------ | --------------------------------- | ------------------------------------------- |
| 语法         | `require()` / `module.exports`    | `import` / `export`                         |
| 加载方式     | 同步                              | 异步                                        |
| 导出值       | **拷贝（值类型）** / 引用（对象） | **实时绑定**（引用）                        |
| 执行时机     | 运行时加载                        | 编译时加载（静态分析）                      |
| Tree-shaking | 不支持                            | 支持                                        |
| 适用环境     | Node.js (默认)                    | 浏览器、Node.js (需设置 `"type": "module"`) |

---

# 其他

## 📁 五、浏览器中使用 ESModule

需要在 `<script>` 标签中加上 `type="module"`：

```html
<script type="module" src="./main.js"></script>
```

注意事项：

- 使用模块必须通过服务器访问（不能用 `file://`）
- `import` 路径要写完整（包含 `.js`）

---

## 🖥️ 六、在 Node.js 中使用 ESModule

Node 默认用的是 CommonJS（require），要使用 ESModule 有几种方式：

### ✅ 1. 改扩展名为 `.mjs`

```bash
node app.mjs
```

### ✅ 2. `package.json` 添加：

```json
{
  "type": "module"
}
```

## ⚠️ 七、ESModule 常见坑

| 问题                                     | 原因                               |
| ---------------------------------------- | ---------------------------------- |
| ❌ Cannot use import outside of a module | 没设置 `type="module"` 或没 `.mjs` |
| ❌ Relative import must include `.js`    | 浏览器/Node ESModule 不补全后缀    |
| ❌ top-level await 报错                  | 只能在 `type=module` 的环境中用    |
| ❌ `__dirname` is not defined            | ESModule 中没有 `__dirname`        |

---

## ✅ 八、顶层 await（Top-level await）

```js
// 只能在 ESModule 中用
const data = await fetchData();
```

---
