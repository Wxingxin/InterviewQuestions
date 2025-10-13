
## 📌 代码解释

```js
Function.prototype.myApply = function (context, args) {
  // 1. 确保 this 是函数
  if (typeof this !== "function") {
    throw new TypeError("myApply must be called on a function");
  }

  // 2. 默认绑定 globalThis，或包装原始值为对象
  context = context ?? globalThis;
  context = Object(context);

  // 3. 用 Symbol 作为唯一键，避免覆盖已有属性
  const fnKey = Symbol("fn");
  context[fnKey] = this;

  // 4. 执行函数并返回结果
  let result;
  try {
    if (args == null) {
      // 没有参数，直接调用
      result = context[fnKey]();
    } else {
      // 确保 args 是数组或类数组
      if (!Array.isArray(args)) {
        throw new TypeError(
          "Second argument to myApply must be an array or array-like"
        );
      }
      result = context[fnKey](...args);
    }
  } finally {
    // 5. 删除临时属性，避免污染 context
    delete context[fnKey];
  }

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

- `myApply` 的核心就是 **在目标对象上临时挂载函数并执行**。
- `context` 决定 `this` 的指向。
- 参数要用数组形式传入。

---

要不要我再帮你写一个 **`myCall` 和 `myBind`**，这样你就能比较三者的异同？
