

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

要不要我帮你写一个 **支持错误捕获（try/catch）**、**支持并行 Promise** 的「进阶 async/await 手写版」？
👉 这个是字节、阿里高频考点版本。
