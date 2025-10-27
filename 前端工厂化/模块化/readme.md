
### ❓1. 为什么需要模块化？

**答：**

* 避免全局变量污染；
* 提高代码复用性；
* 便于维护和调试；
* 明确依赖关系；
* 支持按需加载。

👉 面试高频回答模板：

> 模块化的本质是“**分而治之**”——将复杂的程序分解成可复用、可维护的独立模块。

---

### ❓2. JS 模块化经历了哪些阶段？

**答：**

| 阶段              | 模块方案               | 特点                   |
| --------------- | ------------------ | -------------------- |
| 无模块             | `<script>` 顺序加载    | 全局污染、依赖混乱            |
| IIFE 模式         | 自执行函数              | 模拟私有作用域              |
| CommonJS        | Node.js 模块标准       | 同步加载                 |
| AMD             | 浏览器异步加载（RequireJS） | 异步依赖前置声明             |
| CMD             | 浏览器异步加载（SeaJS）     | 依赖就近                 |
| ES Module (ESM) | ES6 官方标准           | 静态编译、支持 Tree Shaking |

---

### ❓3. CommonJS 与 ES Module 的区别？

| 对比项  | CommonJS                     | ES Module           |
| ---- | ---------------------------- | ------------------- |
| 语法   | `require` / `module.exports` | `import` / `export` |
| 加载方式 | 同步                           | 异步（编译阶段）            |
| 执行时机 | 运行时加载                        | 编译时加载               |
| 导出值  | 值拷贝（浅复制）                     | 值引用（实时绑定）           |
| 适用环境 | Node.js                      | 浏览器 / Node.js       |
| 缓存机制 | 第一次加载后缓存                     | 模块单例，静态绑定           |

---

### ❓4. 为什么 ES Module 可以支持 Tree Shaking？

**答：**
因为 **ESM 是静态编译的**，
编译时就能确定哪些变量/函数被引用，打包工具（如 Rollup、Webpack）可在构建阶段去除未使用代码。

> CommonJS 是运行时加载，无法静态分析依赖。

---



### ❓5. CommonJS 的加载机制？

**答：**

* **同步加载**；
* 模块在第一次 `require()` 时执行一次；
* 多次 `require` 返回同一个对象（有缓存）；
* 模块输出的是值的**拷贝**。

```js
// counter.js
let count = 0;
exports.add = () => ++count;

// main.js
const counter1 = require('./counter');
const counter2 = require('./counter');
counter1.add();
console.log(counter2.add()); // 2（共享同一个缓存）
```

---

### ❓6. ES Module 的加载机制？

**答：**

* **异步加载**；
* 编译阶段确定依赖关系；
* 输出值是 **实时绑定（live binding）**；
* 模块只会执行一次（单例）。

```js
// module.js
export let count = 0;
export function add() { count++; }

// main.js
import { count, add } from './module.js';
add();
console.log(count); // 1（实时绑定）
```

---

### ❓7. Node.js 中如何同时支持 CommonJS 与 ESM？

**方法 1：** `package.json` 中配置

```json
{ "type": "module" }
```

文件后缀 `.js` 视为 ESM，`.cjs` 视为 CommonJS。

**方法 2：** 混合使用

```js
// CommonJS 文件中动态导入 ESM
(async () => {
  const { add } = await import('./math.js');
  console.log(add(1, 2));
})();
```

---

### ❓8. AMD 与 CMD 的区别？

| 对比项  | AMD (RequireJS)       | CMD (SeaJS)                                    |
| ---- | --------------------- | ---------------------------------------------- |
| 加载方式 | 异步加载，依赖前置             | 异步加载，就近依赖                                      |
| 定义模块 | `define(['dep'], fn)` | `define(function(require, exports, module){})` |
| 加载时机 | 依赖提前执行                | 依赖按需执行                                         |
| 应用场景 | 浏览器                   | 国内老项目                                          |

---


### ❓9. ESM 导入导出的几种方式？

| 导出方式  | 示例                       | 导入方式                           |
| ----- | ------------------------ | ------------------------------ |
| 默认导出  | `export default fn`      | `import fn from './x.js'`      |
| 命名导出  | `export const a = 1`     | `import { a } from './x.js'`   |
| 重命名导出 | `export { fn as run }`   | `import { run } from './x.js'` |
| 整体导出  | `export * from './x.js'` | -                              |

---

### ❓10. 动态导入 `import()` 有什么用？

**答：**
`import()` 是异步函数，可以按需加载模块（代码分割、懒加载）。

```js
if (userLoggedIn) {
  const { dashboard } = await import('./dashboard.js');
  dashboard();
}
```

应用场景：

* 路由懒加载；
* 条件加载；
* 大型项目性能优化。

---

### ❓11. import.meta 是什么？

**答：**
ES Module 提供的模块元信息对象。
常用于获取模块 URL 或在 Node 中判断运行环境。

```js
console.log(import.meta.url); // 当前模块的文件 URL
```

---



### ❓12. CommonJS 为什么是单例？

因为模块第一次 `require()` 时会被缓存（`require.cache`），
再次加载直接复用已执行的结果。

**验证：**

```js
// a.js
console.log('a loaded');
module.exports = { value: Math.random() };

// b.js
const a1 = require('./a');
const a2 = require('./a');
console.log(a1 === a2); // true
```

---

### ❓13. ESM 为什么也是单例？

ES Module 在第一次导入时执行，模块对象被缓存。
无论导入多少次，都是同一个实例（引用共享）。

---

## 🧩 五、进阶与原理题

---

### ❓14. Webpack 如何处理模块化？

**答：**

* Webpack 会把所有模块打包成一个文件；
* 内部用一个自定义的模块加载函数（`__webpack_require__`）；
* 支持 CommonJS、AMD、ESM；
* 利用 AST 静态分析 `import` 实现 Tree Shaking；
* 使用动态导入时会自动代码分割（Code Splitting）。

---

### ❓15. 什么是 Tree Shaking？实现原理？

**答：**

> “Tree Shaking” 是通过 **静态分析 import/export**，移除未使用的代码。

**原理：**

* 仅对 ES Module 有效（静态结构）；
* 打包工具（Rollup/Webpack）在构建时分析依赖；
* 删除未被引用的导出。

---

### ❓16. 模块化与作用域隔离的区别？

**答：**

* 作用域隔离：变量不相互干扰；
* 模块化：不仅隔离作用域，还**定义依赖与导出机制**。

---

### ❓17. import/export 能在条件语句中使用吗？

**答：**
不能。
ESM 是编译时确定依赖关系的，必须位于模块顶层。
如果要动态加载，应使用 `import()`。

---

## 🧩 六、手写题

---

### 💡 18. 手写一个简单的 CommonJS 模拟实现

```js
const modules = {};
function require(path) {
  if (modules[path]) return modules[path].exports;
  const module = { exports: {} };
  modules[path] = module;
  const fn = moduleDefinitions[path];
  fn(require, module, module.exports);
  return module.exports;
}

// 模拟定义模块
const moduleDefinitions = {
  './a.js': (require, module, exports) => {
    exports.msg = 'Hello CommonJS';
  },
};

// 使用
const a = require('./a.js');
console.log(a.msg);
```

---

### 💡 19. 手写一个简易 ESM 动态加载

```js
(async function() {
  const { add } = await import('./math.js');
  console.log(add(1, 2));
})();
```



### ❓20. Vue/React 项目中为什么使用 ES Module？

**答：**

* 原生支持；
* 支持 Tree Shaking；
* 支持异步 import；
* 打包器（Vite/Webpack）基于 ESM 静态分析依赖。

---

### ❓21. Vite 中模块化加载的原理？

**答：**
Vite 利用浏览器原生 ESM，
在开发阶段不打包，直接通过 `import` 加载模块（HTTP 按需加载）。
构建时再用 Rollup 打包为生产版本。

