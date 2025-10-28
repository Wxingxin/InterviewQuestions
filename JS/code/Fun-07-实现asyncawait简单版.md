

## 🧠 一、原理概念

1️⃣ `async function` 本质上会返回一个 **Promise**。
2️⃣ `await` 会暂停函数执行，直到等待的 Promise 被 **resolve/reject**。
3️⃣ 底层可用 `Generator` + `Promise` 模拟这种“暂停与恢复执行”的机制。

---

## 🧩 二、最小可用版实现

我们写一个 `run(generatorFn)`，让普通的 Generator 也能像 async 一样执行。

```js
function run(generatorFn) {
  return new Promise((resolve, reject) => {
    const gen = generatorFn(); // 获取迭代器

    function step(nextFn) {
      let next;
      try {
        next = nextFn(); // 调用 next 或 throw
      } catch (err) {
        return reject(err);
      }

      if (next.done) {
        return resolve(next.value); // 执行完毕
      }

      // 保证是 Promise
      Promise.resolve(next.value).then(
        (val) => step(() => gen.next(val)),
        (err) => step(() => gen.throw(err))
      );
    }

    step(() => gen.next());
  });
}
```

---

## 🧩 三、使用示例（就像 async/await）

```js
function fetchData(data, delay) {
  return new Promise((resolve) =>
    setTimeout(() => resolve(`结果：${data}`), delay)
  );
}

function* test() {
  const res1 = yield fetchData("A", 1000);
  console.log(res1);
  const res2 = yield fetchData("B", 1000);
  console.log(res2);
  return "完成";
}

run(test).then(console.log); // 2秒后打印 A、B、完成
```

> ✅ 输出：

```
结果：A
结果：B
完成
```

---

## ⚙️ 四、对比 async/await 的等价形式

等价的 async 写法如下：

```js
async function test() {
  const res1 = await fetchData("A", 1000);
  console.log(res1);
  const res2 = await fetchData("B", 1000);
  console.log(res2);
  return "完成";
}

test().then(console.log);
```

二者效果一致。区别只是语法糖。

---

## 🧩 五、简化版（只支持 then）

如果不考虑异常处理，最简化写法可以更短 👇

```js
function asyncToGenerator(fn) {
  return function (...args) {
    const gen = fn.apply(this, args);

    return new Promise((resolve) => {
      function step(nextF, arg) {
        const next = nextF.call(gen, arg);
        if (next.done) return resolve(next.value);
        next.value.then((val) => step(gen.next, val));
      }
      step(gen.next);
    });
  };
}
```

使用：

```js
function* foo() {
  const a = yield Promise.resolve(1);
  const b = yield Promise.resolve(2);
  return a + b;
}

const runFoo = asyncToGenerator(foo);
runFoo().then(console.log); // 输出 3
```

---

## 🔥 六、面试延伸问法

| 面试问题                          | 回答方向                                |
| --------------------------------- | --------------------------------------- |
| `async/await` 是怎么实现的？      | 是 Promise + Generator 的语法糖。       |
| `await` 的作用是什么？            | 等待 Promise resolve 后继续执行。       |
| `await` 后面不是 Promise 会怎样？ | 会直接包成 `Promise.resolve()`。        |
| 如何实现 `asyncToGenerator`？     | 用递归 + Promise + generator.next()。   |
| `await` 如何串行执行异步任务？    | 因为每次 await 会暂停，直到上次执行完。 |

---
# 代码解释

这段代码是一个非常经典的 **“自动执行 Generator 的异步控制器”**，
它的作用是让你可以用 `yield` 写出看起来像同步的异步代码。
👉 类似 **`co` 库的核心原理**（`co` 是 Koa1 的底层执行器）。

我们一步步拆解解释👇

---

## 🧩 一、函数整体结构

```js
function run(generatorFn) {
  return new Promise((resolve, reject) => {
    ...
  });
}
```

* `run`：接收一个 **生成器函数**（`function*`）作为参数；
* 返回一个 **Promise**，方便外部用 `.then()` 获取最终结果；
* 内部会自动执行这个生成器函数，让你不必手动写多次 `.next()`。

---

## 🧠 二、获取迭代器对象

```js
const gen = generatorFn(); // 获取迭代器
```

* 执行生成器函数，得到一个迭代器对象 `gen`；
* 这个对象有 `.next()`、`.throw()` 等方法；
* 每次 `gen.next()` 就会继续执行到下一个 `yield`。

---

## ⚙️ 三、定义核心函数 step()

```js
function step(nextFn) {
  let next;
  try {
    next = nextFn(); // 调用 next 或 throw
  } catch (err) {
    return reject(err);
  }
```

### 👉 作用：

* 每次 `step()` 就代表执行一次 `yield`。
* 传入的 `nextFn` 是一个函数，用来决定是：

  * 正常执行（`gen.next(value)`），还是
  * 抛出异常（`gen.throw(err)`）。

### 👉 错误处理：

* 如果 `nextFn()` 抛出错误，就直接 `reject` 整个 Promise。

---

## 🧩 四、判断是否执行完毕

```js
if (next.done) {
  return resolve(next.value); // 执行完毕
}
```

* 每次 `gen.next()` 会返回一个对象：

  ```js
  { value: xxx, done: true/false }
  ```
* 如果 `done === true`，说明所有 `yield` 都执行完了；
* 直接 `resolve` 最终结果，结束递归。

---

## 🔁 五、继续异步递归执行

```js
Promise.resolve(next.value).then(
  (val) => step(() => gen.next(val)),
  (err) => step(() => gen.throw(err))
);
```

### ✅ 解释：

1. **确保 `next.value` 是一个 Promise**

   * 有些 `yield` 返回的可能是普通值；
   * 用 `Promise.resolve()` 包装成 Promise，保证统一处理。

2. **then 成功时：**

   * 把异步结果 `val` 传回生成器内部；
   * 再次调用 `gen.next(val)` 继续执行下一步。

3. **then 失败时：**

   * 把错误 `err` 通过 `gen.throw(err)` 抛回生成器；
   * 生成器内部可以用 `try...catch` 捕获。

---

## 🚀 六、启动第一次执行

```js
step(() => gen.next());
```

* 手动调用第一次 `.next()`，让生成器从头运行；
* 之后每次的执行都会在 `Promise.then` 的回调中继续调用 `step()`；
* 从而形成一个“自动化的异步链”。

---

## 🌈 七、执行流程举例

来看一个例子：

```js
function* myGen() {
  const a = yield Promise.resolve(1);
  const b = yield Promise.resolve(a + 2);
  return b + 3;
}

run(myGen).then(console.log); // 输出 6
```

### 执行过程：

| 步骤  | 操作                                | 说明                |
| --- | --------------------------------- | ----------------- |
| 1️⃣ | 调用 `run(myGen)`                   | 返回一个 Promise      |
| 2️⃣ | `step(() => gen.next())`          | 执行生成器到第一个 `yield` |
| 3️⃣ | `yield Promise.resolve(1)` 暂停     | 等待 Promise 结果     |
| 4️⃣ | Promise 结果为 1 → 再次 `gen.next(1)`  | a = 1             |
| 5️⃣ | 第二个 `yield Promise.resolve(3)` 暂停 | 等待 Promise 结果     |
| 6️⃣ | Promise 结果为 3 → `gen.next(3)`     | b = 3             |
| 7️⃣ | return b + 3 → 6                  | `done = true`     |
| 8️⃣ | `resolve(6)`                      | 最终结果 6            |

---

## 🧾 八、总结

| 部分                  | 作用                    |
| ------------------- | --------------------- |
| `generatorFn()`     | 获取迭代器                 |
| `step()`            | 控制执行流程（递归）            |
| `Promise.resolve()` | 保证 `yield` 值是 Promise |
| `gen.next(val)`     | 传递成功结果                |
| `gen.throw(err)`    | 传递错误                  |
| `resolve()`         | 所有 `yield` 完成后返回结果    |

---

### ✅ 简化理解一句话：

> `run()` 就是一个自动执行器，让你写异步代码像写同步的一样。

