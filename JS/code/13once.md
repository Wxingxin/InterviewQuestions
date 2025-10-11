非常好的题 👏
“手写 `once`” 是一道经典的 **高阶函数面试题**，考察你对 **闭包 + 函数作用域 + 函数式编程思想** 的理解。

---

## 🎯 一、题目要求

👉 实现一个函数 `once(fn)`，返回一个新的函数，这个新函数**只会执行一次**，之后再调用都返回第一次执行的结果。

例如：

```js
function init() {
  console.log("初始化中...");
  return 42;
}

const initOnce = once(init);

console.log(initOnce()); // 输出：初始化中... → 42
console.log(initOnce()); // 输出：42（不再执行init）
```

---

## ✅ 二、标准实现（闭包版）

```js
function once(fn) {
  let called = false;
  let result;

  return function (...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args); // 保留 this 和参数
    }
    return result;
  };
}
```

### 🌟 核心原理：

1. **闭包**：外层函数 `once` 中的变量 `called` 和 `result` 被内层函数引用，不会被销毁；
2. **状态保存**：`called` 用来判断函数是否已执行；
3. **结果缓存**：`result` 保存第一次的执行结果；
4. **this 保留**：用 `fn.apply(this, args)` 绑定原调用上下文。

---

## ⚡ 三、改进版：支持异步函数

```js
function onceAsync(fn) {
  let called = false;
  let result;
  let pending = null;

  return async function (...args) {
    if (called) return result;
    if (pending) return pending; // 如果第一次还没执行完，直接返回同一个Promise
    pending = fn.apply(this, args);
    result = await pending;
    called = true;
    return result;
  };
}
```

💡 用于防止异步函数被多次触发，如网络请求或初始化逻辑。

---

## 💬 四、常见面试追问

| 面试问题                 | 答案                                     |
| -------------------- | -------------------------------------- |
| 🔹 1. 为什么要用闭包？       | 因为闭包能保存执行状态（called、result），在多次调用间共享数据。 |
| 🔹 2. 如果函数报错怎么办？     | 可以在第一次执行时捕获异常并重置状态。                    |
| 🔹 3. 能让 once 支持重置吗？ | 可以返回一个带 `.reset()` 方法的函数。见下面。          |

---

## 🧩 五、进阶版（可重置）

```js
function onceWithReset(fn) {
  let called = false;
  let result;

  function wrapper(...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  }

  wrapper.reset = function () {
    called = false;
    result = undefined;
  };

  return wrapper;
}
```

用法：

```js
const logOnce = onceWithReset(() => console.log('Run!'));
logOnce(); // Run!
logOnce(); // 不再执行
logOnce.reset();
logOnce(); // Run!（重新执行）
```

---

## 🚀 六、考察点总结

| 知识点     | 说明                |
| ------- | ----------------- |
| 闭包      | 保存函数执行状态          |
| this 绑定 | 用 `apply` 保证上下文正确 |
| 高阶函数    | 函数作为返回值           |
| 异步控制    | onceAsync 扩展      |
| 内存与作用域  | 状态变量驻留内存中         |

---

是否要我帮你写一份「**面试官常用的 once 变体题合集**」（包括 debounce + throttle + memoize + once 组合题）？
👉 很多大厂喜欢出这种“函数控制流组合实现”。
