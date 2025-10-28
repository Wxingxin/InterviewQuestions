## 📌 代码解释

```js
Function.prototype.myCall = function (context, ...args) {
  // 1. 确保 this 是函数
  if (typeof this !== "function") {
    throw new TypeError("myCall must be called on a function");
  }

  // 2. 默认 context 为全局对象，或将原始值包装为对象
  context = context ?? globalThis;
  context = Object(context);

  // 3. 用 Symbol 做唯一键，避免覆盖已有属性
  const fnKey = Symbol("fn");

  // 4. 将函数绑定到 context 上
  context[fnKey] = this;

  // 5. 执行函数并返回结果
  // 使用 try/finally 确保不会污染 context
  try {
    return context[fnKey](...args);
  } finally {
    delete context[fnKey];
  }
};
```

---

## 📌 原理

`call` 的作用是：
👉 **立即调用函数，并改变 this 指向，同时支持多个参数传入。**

## 📌 案例

### ✅ 案例 1：基本用法

```js
function greet(name, age) {
  return `Hello, I'm ${this.title} ${name}, age ${age}`;
}

const person = { title: "Dr." };

console.log(greet.myCall(person, "Alice", 30));
// 输出: Hello, I'm Dr. Alice, age 30
```

👉 `this` 被绑定到 `person`，参数按顺序传入。

---

### ✅ 案例 2：无参数

```js
function sayHi() {
  return `Hi, I'm ${this.name}`;
}

const user = { name: "Bob" };

console.log(sayHi.myCall(user));
// 输出: Hi, I'm Bob
```

---

### ✅ 案例 3：context 为空

```js
function test() {
  return this === globalThis;
}

console.log(test.myCall(null)); // true
```

👉 `null` 或 `undefined` 会默认绑定到全局对象 `globalThis`。

---

### ✅ 案例 4：返回值

```js
function add(a, b) {
  return a + b;
}

console.log(add.myCall(null, 10, 20));
// 输出: 30
```

👉 `myCall` 返回函数执行结果。

### 案例 5：

```js
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const obj = { name: "Alice" };

console.log(greet.myCall(obj, "Hello", "!")); // Hello, Alice!
console.log(greet.myCall(null, "Hi", "!!")); // Hi, [object global]? 在非严格模式下是 globalThis
```

#

明白，我们来仔细拆解这两行代码，逐步解释它们为什么要这样写，以及在 JS 里到底发生了什么。

---

## 原代码

```js
context = context ?? globalThis;
context = Object(context);
```

### 🔹 第 1 行：`context = context ?? globalThis`

1. `??` 是 **Nullish Coalescing 运算符**

   - 它只在 **`context` 为 `null` 或 `undefined`** 时，返回右侧值。
   - 和 `||` 不同，`0`、`''`、`false` 不会触发默认值。

2. 目的：

   - 当用户调用 `myCall` 时，如果没有传 `context`，或者传了 `null/undefined`，我们要把 `this` 指向 **全局对象**（浏览器里是 `window`，Node.js 是 `global`）。
   - 举例：

```js
function sayThis() {
  return this;
}

console.log(sayThis.myCall(null)); // 浏览器里 -> window
console.log(sayThis.myCall(undefined)); // 浏览器里 -> window
console.log(sayThis.myCall({ name: "Alice" })); // { name: 'Alice' }
```

✅ 总结：这一行就是给 `context` 一个默认值。

---

### 🔹 第 2 行：`context = Object(context)`

1. `Object()` 可以把 **原始类型值**（number、string、boolean、symbol、bigint）包装成对象。

```js
console.log(typeof Object(123)); // "object"
console.log(typeof Object("abc")); // "object"
console.log(typeof Object(true)); // "object"
```

2. 目的：

   - JS 的函数只能绑定到对象上，如果用户传了一个原始值，比如：

```js
function greet() {
  return this;
}

console.log(greet.myCall(123)); // JS 会把 123 包装成 Number 对象
```

- 如果不调用 `Object(context)`，你直接给数字加属性会报错，因为原始类型不能存属性。
- `Object(context)` 会返回对应的包装对象，保证我们可以安全地在上面添加临时 Symbol。

3. 举例对比：

```js
let x = 123;
x.temp = "test"; // 无效，原始类型不能存属性
console.log(x.temp); // undefined

let objX = Object(x);
objX.temp = "test";
console.log(objX.temp); // 'test'
```

---

### 🔹 两行连在一起的效果

1. 如果 `context` 是 `null` 或 `undefined` → 用全局对象替代。
2. 如果 `context` 是原始类型 → 用对象包装。
3. 最终保证 `context` 是一个可以安全存属性的对象，方便我们在上面临时挂 `Symbol` 执行函数。

---

### 🔹 图示总结

| context 输入         | 经过处理后                      |
| -------------------- | ------------------------------- |
| `null` / `undefined` | `globalThis`                    |
| `123`                | `Number {123}`                  |
| `'abc'`              | `String {"abc"}`                |
| `true`               | `Boolean {true}`                |
| `{ name: 'Alice' }`  | `{ name: 'Alice' }`（原封不动） |

