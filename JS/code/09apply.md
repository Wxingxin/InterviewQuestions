好嘞 👍 我来帮你详细解释这段 **手写实现 `Function.prototype.apply`** 的代码，并给你案例演示。

---

## 📌 代码解释

```js
Function.prototype.myApply = function (context, args) {
  // 如果不是函数调用，直接抛错
  if (typeof this !== "function") {
    throw new TypeError("myApply must be called on a function");
  }

  // 默认绑定 globalThis
  context = context || globalThis;

  // 唯一 key，避免覆盖
  const fnSymbol = Symbol();
  context[fnSymbol] = this;

  // 处理参数，要求必须是数组或类数组
  let result;
  if (args != null) {
    if (!Array.isArray(args)) {
      throw new TypeError("Second argument to myApply must be an array");
    }
    result = context[fnSymbol](...args);
  } else {
    result = context[fnSymbol]();
  }

  delete context[fnSymbol];
  return result;
};

```

---

## 📌 原理

`apply` 的作用就是 **改变函数执行时的 `this` 指向**，并传入一个数组作为参数。
实现原理：

1. 把函数挂到 `context` 对象上（临时属性）。
2. 调用这个函数时，`this` 就会指向 `context`。
3. 删除临时属性，保持对象干净。
4. 返回函数执行结果。

---

## 📌 案例

### ✅ 示例 1：基本用法

```js
function greet(name, age) {
  return `Hello, I'm ${this.title} ${name}, age ${age}`;
}

const person = { title: "Dr." };

console.log(greet.myApply(person, ["Alice", 30]));
// 输出: Hello, I'm Dr. Alice, age 30
```

👉 `this` 被绑定到 `person`，并且参数数组 `["Alice", 30]` 被传入。

---

### ✅ 示例 2：无参数调用

```js
function sayHi() {
  return `Hi, I'm ${this.name}`;
}

const user = { name: "Bob" };

console.log(sayHi.myApply(user));
// 输出: Hi, I'm Bob
```

---

### ✅ 示例 3：当 context 为空

```js
function test() {
  return this === globalThis;
}

console.log(test.myApply(null)); // true
```

👉 如果 `context` 为 `null` 或 `undefined`，会默认绑定到 **全局对象**（浏览器是 `window`，Node.js 是 `global`，统一叫 `globalThis`）。

---

### ✅ 示例 4：返回值测试

```js
function add(a, b) {
  return a + b;
}

console.log(add.myApply(null, [10, 20])); 
// 输出: 30
```

👉 `myApply` 最终会返回函数的执行结果。

---

📌 总结：

* `myApply` 的核心就是 **在目标对象上临时挂载函数并执行**。
* `context` 决定 `this` 的指向。
* 参数要用数组形式传入。

---

要不要我再帮你写一个 **`myCall` 和 `myBind`**，这样你就能比较三者的异同？
