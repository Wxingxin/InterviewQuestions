下面给你一份**手写 `call` 及相应知识点大全**，覆盖原理、边界、面试点、完整版实现和常见坑。看完基本能“开摆式”写出来 😄

---

# 🧠 1. `call` 是啥？核心作用

`Function.prototype.call` 用来：

1. **显式绑定 this**
2. **立即执行函数**
3. **参数逐个传入**

```js
fn.call(thisArg, arg1, arg2, ...)
```

与 `apply` 的区别：

* call：参数**一个个传**
* apply：参数**用数组传**

---

# 🧠 2. `call` 的执行规则（必背面试点）

## ✅（1）thisArg 处理规则

* 如果 `thisArg` 是 `null` 或 `undefined`

  * **非严格模式**：this → `window / globalThis`
  * **严格模式**：this → `null / undefined`
* 如果 `thisArg` 是原始值（number/string/boolean/symbol/bigint）

  * 会被**装箱为对象**（`Object(thisArg)`）

```js
function f(){ console.log(this) }
f.call(1)  // Number {1}
```

---

## ✅（2）`call` 会立即执行

不像 `bind` 返回新函数，`call` 是“绑完就跑”。

---

## ✅（3）`call` 可以借用别人的方法（经典用途）

```js
Object.prototype.toString.call([])  // "[object Array]"
Array.prototype.slice.call(arguments) // arguments → array
```

---

# 🧠 3. 手写 `call` 的核心思路（原理）

> **把函数作为对象的临时方法调用**
> 因为：对象调用形式 `obj.fn()` 中，`fn` 的 this 指向 obj。

### 步骤：

1. 拿到要绑定的对象（thisArg）
2. 给它加一个临时属性（指向当前函数）
3. 用 `obj[tempFn](...args)` 调用
4. 删除临时属性
5. 返回结果

---

# ✍️ 4. 最简版手写 call（理解用）

```js
Function.prototype.myCall = function (ctx, ...args) {
  ctx = ctx || globalThis;  // 处理 null/undefined（非严格模式模拟）
  const key = Symbol("fn");
  ctx[key] = this;
  const res = ctx[key](...args);
  delete ctx[key];
  return res;
};
```

不足：

* 没处理原始值装箱
* 没做类型检查
* 严格模式差异未完全模拟

---

# ✅ 5. 完整版手写 call（面试可直接上）

```js
Function.prototype.myCall = function (thisArg, ...args) {
  if (typeof this !== "function") {
    throw new TypeError("myCall must be called on a function");
  }

  // 1) 处理 thisArg：null/undefined → globalThis（模拟非严格模式）
  const ctx =
    thisArg === null || thisArg === undefined
      ? globalThis
      : Object(thisArg); // 2) 原始值装箱

  // 3) 创建唯一 key
  const key = Symbol("tempFn");
  ctx[key] = this;

  // 4) 执行
  const result = ctx[key](...args);

  // 5) 清理
  delete ctx[key];

  return result;
};
```

---

# 🧠 6. 关键知识点拆解（为什么要这么写）

## ✅（1）为什么用 `Symbol`？

避免覆盖原对象已有属性：

```js
const obj = { fn: 123 };
```

如果你用 `obj.fn = this` 就会冲突。
`Symbol()` 能保证唯一性。

---

## ✅（2）为什么用 `Object(thisArg)`？

模拟原生 call 的“装箱行为”：

```js
function f(){ return this.constructor.name }
f.call(1)       // "Number"
f.call("x")     // "String"
```

---

## ✅（3）为什么要 delete？

临时挂载的方法要移除，否则污染对象：

```js
obj[key] = fn;
// 调完必须删
delete obj[key];
```

---

# 🧠 7. 常见坑（面试易挂）

| 坑                    | 说明                    |
| -------------------- | --------------------- |
| ❌ 忘了返回函数执行结果         | call 必须 return result |
| ❌ 不处理 null/undefined | this 会指向错误            |
| ❌ 不装箱原始值             | f.call(1) 行为不对        |
| ❌ 属性名冲突              | 必须用 Symbol 或随机 key    |
| ❌ 没做类型检查             | `({}).myCall()` 应抛错   |

---

# 🧪 8. 测试用例（面试加分）

```js
function add(a, b) { return this.x + a + b; }

const obj = { x: 10 };

console.log(add.myCall(obj, 1, 2));  // 13

console.log(
  Object.prototype.toString.myCall([], null)
); // "[object Null]"（注意 thisArg 指向 []）

function showThis() { return this; }
console.log(showThis.myCall(1)); // Number {1}
```

---

# 🔥 9. 一句话总结 `call`

> **手写 call = 让函数变成对象的临时方法执行，从而把 this 指过去；同时要注意 null/undefined、装箱、唯一 key、返回值。**

