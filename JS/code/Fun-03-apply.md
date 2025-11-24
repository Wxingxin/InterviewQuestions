下面给你一份**手写 `apply` + 相应知识点大全**，结构跟你前面要的 call 一样：原理→规则→实现→坑→测试。看完面试基本稳。

---

# 🧠 1. `apply` 是啥？核心作用

`Function.prototype.apply` 用来：

1. **显式绑定 this**
2. **立即执行函数**
3. **参数以数组/类数组形式传入**

```js
fn.apply(thisArg, [arg1, arg2, ...])
```

---

# 🧠 2. `apply` 的执行规则（面试必背）

## ✅（1）thisArg 规则（和 call 一样）

* `thisArg` 为 `null / undefined`

  * **非严格模式**：this → `globalThis`
  * **严格模式**：this → `null / undefined`
* `thisArg` 为原始值（string/number/boolean/symbol/bigint）

  * 会被**装箱**：`Object(thisArg)`

```js
function f(){ console.log(this) }
f.apply(1) // Number {1}
```

---

## ✅（2）第二个参数必须是“可迭代的数组/类数组”

原生要求：

* 传入 **数组** 或 **类数组**（有 length 和索引）
* 也可以是 `arguments`
* 如果不是，会报错

```js
Math.max.apply(null, [1,2,3])   // ✔ 3
Math.max.apply(null, "123")     // ❌ TypeError
```

---

## ✅（3）apply 与 call 的唯一差别

* call：参数一个个传
* apply：参数打包成数组传

```js
fn.call(obj, a, b)
fn.apply(obj, [a, b])
```

---

# 🧠 3. 手写 `apply` 的核心原理

和 call 一模一样：

> **把函数作为对象的临时方法调用**
> `obj.fn()` 形式下，函数的 this 指向 obj。

### 步骤：

1. 处理 thisArg
2. 在 thisArg 上挂一个临时方法指向当前函数
3. 用数组展开执行
4. 删除临时方法
5. 返回执行结果

---

# ✍️ 4. 最简版 apply（理解用）

```js
Function.prototype.myApply = function (ctx, args) {
  ctx = ctx || globalThis;
  const key = Symbol("fn");
  ctx[key] = this;
  const res = ctx[key](...(args || []));
  delete ctx[key];
  return res;
};
```

---

# ✅ 5. 完整版 apply（面试可直接写）

```js
Function.prototype.myApply = function (thisArg, argsArray) {
  if (typeof this !== "function") {
    throw new TypeError("myApply must be called on a function");
  }

  // 1) 处理 thisArg（模拟非严格模式）
  const ctx =
    thisArg === null || thisArg === undefined
      ? globalThis
      : Object(thisArg); // 原始值装箱

  // 2) 处理参数
  let args = [];
  if (argsArray != null) {
    // 原生要求是 array / 类数组
    if (typeof argsArray !== "object" && typeof argsArray !== "function") {
      throw new TypeError("CreateListFromArrayLike called on non-object");
    }
    args = Array.from(argsArray); // 支持类数组 / arguments
  }

  // 3) 临时挂载函数
  const key = Symbol("tempFn");
  ctx[key] = this;

  // 4) 执行并返回
  const result = ctx[key](...args);

  // 5) 清理
  delete ctx[key];

  return result;
};
```

---

# 🧠 6. 关键知识点拆解

## ✅（1）为什么要用 `Array.from`？

为了支持“类数组”：

```js
function test(){
  console.log(fn.myApply(null, arguments))
}
```

`arguments` 不是数组，但 `Array.from(arguments)` 可以变成数组。

---

## ✅（2）为什么要用 `Symbol` 作为 key？

避免覆盖原对象已有属性：

```js
const obj = { fn: 123 };
// 如果挂 obj.fn 就会冲突
```

---

## ✅（3）为什么 `argsArray` 不传要当作空数组？

原生行为：

```js
fn.apply(obj)          // 等价 fn.call(obj)
fn.apply(obj, null)    // 也等价
```

所以你要：

```js
argsArray == null ? [] : ...
```

---

# 🧠 7. 常见坑（面试易挂）

| 坑                     | 说明                 |
| --------------------- | ------------------ |
| ❌ 第二参数没校验             | 原生 apply 对非对象会抛错   |
| ❌ 忘了处理 null/undefined | this 会错            |
| ❌ 不装箱原始值              | 行为与原生不一致           |
| ❌ 属性名冲突               | 必须用 Symbol 或唯一 key |
| ❌ 忘了 return 结果        | apply 要返回函数执行值     |

---

# 🧪 8. 测试用例（面试加分）

```js
function add(a, b) { return this.x + a + b; }
const obj = { x: 10 };

console.log(add.myApply(obj, [1, 2])); // 13

function showThis(){ return this; }
console.log(showThis.myApply(1)); // Number {1}

console.log(Math.max.myApply(null, [3, 7, 2])); // 7

function demo(){
  return add.myApply(obj, arguments);
}
console.log(demo(5, 6)); // 21
```