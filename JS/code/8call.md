好嘞 👍 这段代码是你手写的 **`Function.prototype.call`** 方法，我给你详细拆解一下，并加上案例。

---

## 📌 代码解释

```js
Function.prototype.myCall = function(context, ...args) {
  // 保证 this 是函数
  if (typeof this !== 'function') {
    throw new TypeError('Function.prototype.myCall - caller is not callable');
  }

  // 如果 context 为 null 或 undefined 则指向全局对象（非严格模式下的行为）
  // 否则把原始值包装成对象（允许对数字、字符串等原始值赋属性）
  context = (context == null) ? globalThis : Object(context);

  // 用唯一 Symbol 做临时属性名，避免覆盖已有属性
  const fnSymbol = Symbol('fn');
  context[fnSymbol] = this;

  try {
    // 执行并返回结果（支持传参）
    return context[fnSymbol](...args);
  } finally {
    // 无论函数是否抛错，都要删除临时属性，避免污染 context
    delete context[fnSymbol];
  }
};

```

---

## 📌 原理

`call` 的作用是：
👉 **立即调用函数，并改变 this 指向，同时支持多个参数传入。**

区别：

* `call(context, arg1, arg2, ...)` → 参数是**依次传入**。
* `apply(context, [arg1, arg2, ...])` → 参数是**数组传入**。
* `bind(context, arg1, arg2, ...)` → **不会立即执行**，返回一个新函数。

---

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

---

## 📌 总结

* **`myCall`**：立即调用函数，参数按顺序传入。
* **`myApply`**：立即调用函数，参数以数组传入。
* **`myBind`**：不会立即调用，返回一个绑定了 this 的新函数。

---

要不要我帮你画一个 **对比表格（call / apply / bind / 手写版）**，一目了然？
