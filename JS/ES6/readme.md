
## 🧩 **ES6（2015）— 史诗级更新**

> ✅ 面试必背内容：几乎每一项都能考到

### 1. 块级作用域

* `let` 和 `const` 替代 `var`，有块级作用域、不能重复声明。
* ⭐ 重点：`let` 不存在变量提升。

### 2. 模板字符串

```js
const name = "Wei";
console.log(`Hello, ${name}!`);
```

### 3. 解构赋值

```js
const [a, b] = [1, 2];
const {x, y} = {x: 10, y: 20};
```

### 4. 箭头函数 ⭐

```js
const add = (a, b) => a + b;
```

* 没有 `this`、`arguments`、`super`。
* 常用于回调函数。

### 5. 默认参数

```js
function log(x, y = 1) { console.log(x, y); }
```

### 6. 扩展运算符与剩余参数

```js
const arr = [1,2,3];
console.log(...arr); // 1 2 3
function sum(...nums) { return nums.reduce((a,b)=>a+b); }
```

### 7. 模块化系统 ⭐

```js
// 导出
export const a = 1;
export default function() {}
// 导入
import fn, { a } from './m.js';
```

### 8. 类与继承 ⭐

```js
class Person {
  constructor(name) { this.name = name; }
  sayHi() { console.log(this.name); }
}
class Student extends Person {}
```

### 9. Promise ⭐

* 用于异步编程。
* 状态：`pending` → `fulfilled` / `rejected`。
* 常考：手写 Promise 实现、链式调用。

### 10. Symbol

* 独一无二的值，用于定义对象私有属性。

### 11. Map / Set 数据结构 ⭐

```js
const set = new Set([1,2,2]);
const map = new Map([['a',1]]);
```

### 12. Iterator 与 for...of

* 可迭代对象接口（数组、Set、Map、字符串）。

### 13. Generator（生成器函数）

```js
function* gen() {
  yield 1;
  yield 2;
}
```

* 用于异步控制。

---

## 🧠 **ES7（2016）**

* `Array.prototype.includes()`
* 幂运算符 `**`

  ```js
  2 ** 3 // 8
  ```

---

## ⚙️ **ES8（2017）**

* `async/await` ⭐
  异步语法糖，比 Promise 更直观。
* `Object.values()` / `Object.entries()`
* `Object.getOwnPropertyDescriptors()`
* 字符串填充：`padStart` / `padEnd`
* 函数参数结尾允许逗号。

---

## 💾 **ES9（2018）**

* 对象的剩余与展开运算符：

  ```js
  const obj = {a:1,b:2,c:3};
  const {a, ...rest} = obj;
  const newObj = {...obj, d:4};
  ```
* 异步迭代器 `for await...of`
* Promise.finally()

---

## ⚡ **ES10（2019）**

* `Array.flat()` / `Array.flatMap()`
* `Object.fromEntries()`（反转 `Object.entries()`）
* `String.trimStart()` / `trimEnd()`
* 可选的 `catch` 绑定：

  ```js
  try {} catch { console.log('err'); }
  ```

---

## 🌈 **ES11（2020）**

* 空值合并运算符 `??`
* 可选链 `?.` ⭐
* 动态导入 `import()`
* BigInt（超大整数）
* `Promise.allSettled()`
* `globalThis`
* `for-in` 顺序规范化。

---

## 🔮 **ES12（2021）**

* 逻辑赋值运算符：`&&=`, `||=`, `??=`
* `String.prototype.replaceAll()`
* Promise.any()
* WeakRef（弱引用）
* 数字分隔符：`1_000_000`

---

## 🧭 **ES13（2022）**

* `at()` 方法（数组、字符串）

  ```js
  [1,2,3].at(-1) // 3
  ```
* 顶层 await ⭐

  ```js
  const data = await fetch('/api');
  ```
* 类的字段声明与私有属性 `#x`

---

## 🎯 面试高频考点汇总

| 类型    | 高频考点                                |
| ----- | ----------------------------------- |
| 基础语法  | let/const、解构、箭头函数、模板字符串             |
| 异步    | Promise、async/await、Promise.all/any |
| 模块化   | import/export 与 CommonJS 区别         |
| 对象与数组 | 扩展运算符、Object.entries/fromEntries    |
| ES新特性 | 可选链、空值合并、顶层 await、私有属性              |
| 数据结构  | Set、Map、WeakMap、WeakSet             |
| 类     | class继承、静态属性、私有字段                   |
