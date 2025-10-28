好问题 👍，这个考察你对 **Promise 封装异步操作** 的理解。我们可以用 `Promise` 包装 `setTimeout`，写出一个类似 `sleep` 的函数。

---

## ✅ 最简写法

```js
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`延迟 ${ms} 毫秒完成`);
    }, ms);
  });
}

// 使用
delay(2000).then((res) => {
  console.log(res); // 延迟 2000 毫秒完成
});
```

---


## ✅ 进阶：带取消功能

有时我们希望能 **取消定时器**，就可以在 `Promise` 外返回定时器 id。

```js
function delay(ms) {
  let timer;
  const p = new Promise((resolve) => {
    timer = setTimeout(() => resolve(`完成 ${ms} ms`), ms);
  });
  p.cancel = () => clearTimeout(timer);
  return p;
}

// 使用
const task = delay(5000);
task.then(console.log);

setTimeout(() => {
  task.cancel(); // 2 秒后取消
  console.log("任务已取消");
}, 2000);
```

---

## 🎯 面试答法（简版）

> 可以用 `new Promise` 包装 `setTimeout`，在 `resolve` 里返回结果，就能通过 `then` 或 `async/await` 等待异步执行。还可以扩展取消功能，类似于定时任务的控制。
