# 🧩 一、Promise 基础概念类

> ✅ 主要考察候选人是否理解 Promise 的核心设计思想。

> ## 1. 什么是 Promise？它解决了什么问题？

- Promise 是 **ES6 引入的一种异步编程解决方案**，用于更优雅地处理异步操作。
- 它代表一个 **未来才会完成或失败的异步操作的结果**。
- 设计初衷是解决传统 **回调地狱（Callback Hell）** 问题。
  > ## 2. Promise 属于哪种编程思想？（命令式 / 函数式 / 异步编程模型）

* Promise 属于 **异步编程模型（Asynchronous Programming Model）**。
* 它体现了一种 **声明式编程思想** —— 你描述「当结果返回后要做什么」，而不是「怎么等待结果」。
* 同时，它也与 **函数式编程思想** 有关：通过 `then` 链式调用，传递函数处理结果。

> ## 3. Promise 有哪几种状态？状态转移规则是什么？
>
> **答题思路：**
> Promise 共有 **三种状态（state）**：

| 状态        | 含义             | 可否改变    |
| ----------- | ---------------- | ----------- |
| `pending`   | 初始状态，进行中 | ✅ 可改变   |
| `fulfilled` | 操作成功完成     | ❌ 不可再变 |
| `rejected`  | 操作失败         | ❌ 不可再变 |

**状态转移规则：**

- `pending → fulfilled`
- `pending → rejected`
- 一旦变为 `fulfilled` 或 `rejected`，状态 **不可逆、不可再修改**。

---

> ## 4. Promise 一旦状态改变，是否还会再次改变？
>
> **答题思路：**
> 不会。Promise 状态 **只能改变一次**。
> 一旦从 `pending` 变为 `fulfilled` 或 `rejected`，就 **永久锁定**。

> ## 5. Promise 和传统的回调函数（callback）相比，有哪些优势？

1. ✅ **解决回调地狱**：通过链式调用代替多层嵌套。
2. ✅ **统一错误处理**：catch 可集中捕获错误。
3. ✅ **语义更清晰**：代码逻辑从“嵌套式”变为“顺序式”。
4. ✅ **可组合性强**：支持并发控制（Promise.all、race 等）。
5. ✅ **更易调试**：每个 then 返回新的 Promise，更可控。

---

> ## 6. Promise 的执行是同步的还是异步的？

- Promise **本身的构造函数执行是同步的**；
- 但其中的回调函数（如 `then`、`catch`）的执行是 **异步的**（在微任务队列中）。

> ## 7. then() 和 catch() 的返回值是什么？

- `then()` 和 `catch()` **都会返回一个新的 Promise 实例**（不是原来的那个）。
- 这就是为什么 Promise 可以实现 **链式调用**。
- 如果回调函数返回普通值，新的 Promise 状态为 `fulfilled`；
- 如果抛出错误或返回 rejected Promise，新的状态为 `rejected`。

> ## 8. Promise 的错误会不会被自动捕获？

- Promise 内部的异常（无论是 throw 还是 reject）都会被自动捕获，传递到最近的 `catch()`。
- 但如果没有任何 `catch()` 处理，就会触发 **未处理的拒绝（unhandledRejection）**。

> ## 9. Promise 中的 `finally()` 有什么作用？

- `finally()` 在 Promise **无论成功还是失败**时都会执行；
- 常用于清理资源（关闭加载动画、断开连接、释放锁等）。

> ## 10. 如何中断 Promise 链？
>
> Promise 本身 **没有直接的中断机制**（一旦执行就不可取消）。
> 但可以通过以下逻辑“间接中断”：

- 在 `then` 回调中返回一个 **永远不 resolve 的 Promise**；
- 或者 **在逻辑层提前 return**，不再继续调用后续 then；
- 或者使用第三方库（如 Bluebird 的 `cancel()` 或 AbortController）实现。

---

# ⚙️ 二、Promise 执行机制类

✅ 考察事件循环（Event Loop）与微任务（Microtask）的理解。

> ## 1. Promise 回调（then、catch）在事件循环中的哪个阶段执行？

- JS 的事件循环分为两个主要阶段：
  **宏任务（macrotask）** 和 **微任务（microtask）**。
- Promise 的回调（`then`、`catch`）属于 **微任务（microtask）**。

> ## 2. Promise 与 `setTimeout` 的执行顺序是什么？
>
> **答题思路：**

- Promise 回调是 **微任务**；
- setTimeout 回调是 **宏任务**；
- 微任务优先级高于宏任务。

**结论：**

> 在同一轮事件循环中，Promise 的回调 **一定早于** setTimeout 执行。

**顺序记忆口诀：**

> 「同步任务 → 微任务 → 宏任务」。

> ## 3. 为什么说 Promise 的回调是「微任务」？

- ECMAScript 规范中，Promise 回调被定义为 **Job Queue（微任务队列）** 中的任务；
- 它在当前事件循环的尾部、下一个宏任务开始前执行；
- 保证异步逻辑 **尽可能快地执行**，但又不阻塞主线程。

> ## 4. 多个 `then` 链式调用时，它们的执行顺序是怎样的？

- 每次调用 then() 都会生成一个 **新的 Promise 实例**；
- 每个 then 回调会在 **上一个 then 的微任务执行完成后**，
  将新的任务推入微任务队列；
- 因此执行顺序是 **按链式顺序依次执行**。

> ## 5. Promise 的回调中返回一个新的 Promise 会发生什么？

- then() 返回新的 Promise；
- 如果回调函数返回一个新的 Promise，
  外层 Promise 会 **等待该 Promise 的结果** 再决定自身状态。

> ## 6. 如果 `then` 中抛出异常，会被哪个 catch 捕获？

- then 内部抛出的异常，会使该 then 返回的 Promise 状态变为 `rejected`；
- 因此会被 **下一个 catch**（或之后的 catch）捕获。

> ## 7. Promise.resolve() 和 Promise.reject() 何时同步执行？何时异步？
>
> | 场景                     | 执行时机     | 原因                    |
> | ------------------------ | ------------ | ----------------------- |
> | 传入普通值（非 Promise） | 同步 resolve | 立即确定状态            |
> | 传入 Promise 对象        | 异步（等待） | 需等待内部 Promise 结果 |
> | reject()                 | 同步拒绝     | 立即触发 rejected 状态  |

> ## 8. 当 Promise 被 resolve 多次会发生什么？

- Promise 状态只能改变一次；
- 一旦从 `pending` 变为 `fulfilled` 或 `rejected`，
  后续的 resolve/reject 调用都会被忽略。

> ## 9. 如果在 Promise 的 executor 中抛出异常，会触发哪个状态？

- executor（Promise 构造函数的第一个参数）在创建 Promise 时立即执行；
- 如果在其中抛出异常，Promise 会自动 **变为 rejected 状态**；
- 等价于执行了 `reject(error)`。

> ## 10. 微任务和宏任务的执行顺序与 Promise 有什么关系？

**答题思路：**

- 每次事件循环流程：

  1. 执行一个宏任务（如 script、I/O、setTimeout）；
  2. 执行所有当前微任务（Promise.then 等）；
  3. 再进入下一轮宏任务。

**结论：**

> Promise 的回调（微任务）在每个宏任务结束后立即执行，
> 保证异步逻辑比 setTimeout（宏任务）更早被调度。

**记忆口诀：**

> 同步 → 微任务 → 宏任务（循环往复）。

---

# 🔍 三、Promise 原理与实现类

> ✅ 考察底层机制、状态流转与手写能力理解。

1. Promise 内部是如何维护状态的？
2. then() 的返回机制是如何实现的？
3. Promise 链式调用的核心原理是什么？
4. Promise/A+ 规范是什么？它规定了哪些内容？
5. Promise 如何保证状态一旦改变就不会再次变？
6. 手写 Promise 时，如何实现异步 then 回调？
7. resolve() 与 reject() 内部是怎么触发状态改变的？
8. 为什么说 Promise 是「可组合」的？
9. 什么是 Promise 的「值穿透」（value penetration）？
10. Promise 的 then 回调是如何实现异步递归调用的？

---

# 🚀 四、Promise 常见方法与场景类

> ✅ 考察 Promise API 的熟悉度与实际业务场景应用。

> ## 1. `Promise.all()` 的执行机制是什么？

- 接收一个由多个 Promise 组成的可迭代对象（如数组）。
- 并发执行所有 Promise。
- **当所有 Promise 成功**后，返回一个新的 Promise，结果是每个 Promise 的结果数组。
- **只要有一个 Promise 失败**，整个 `Promise.all()` 立即 reject。
- ⚙️ **核心机制**：结果顺序与输入顺序一致，不是按完成顺序。

> ## 2. `Promise.all()` 中有一个失败会怎样？

- 只要任意一个 Promise 被 reject，`Promise.all()` 就会 **立即 reject**。
- 其他未完成的 Promise 仍然在后台执行，但结果会被忽略。
- ✅ 面试考点：如何避免因一个失败导致整体失败（可用 `allSettled` 或 try-catch 包装）。

> ## 3. `Promise.allSettled()` 与 `Promise.all()` 有什么区别？
>
> | 特性     | Promise.all           | Promise.allSettled                      |
> | -------- | --------------------- | --------------------------------------- |
> | 返回时机 | 所有成功才 resolve    | 所有完成（成功或失败）                  |
> | 出错时   | 任何一个失败会 reject | 不会 reject                             |
> | 返回值   | 成功结果数组          | 每个结果对象 `{ status, value/reason }` |

> ## 4. `Promise.any()` 的返回规则是什么？

- 接收多个 Promise，**只要有一个成功就 resolve**。
- 如果所有都失败，返回一个 reject（`AggregateError`）。
- ✅ **用途**：例如多个请求中选最快成功的一个（竞速模式）。

> ## 5. `Promise.race()` 的用途是什么？

- 谁先完成（resolve 或 reject），就以谁的结果为准。
- ⚙️ 常用于：

  - 超时控制（`Promise.race([task, timeout])`）
  - 网络请求竞速（CDN 多源策略）

> ## 6. 如何使用 Promise 实现超时控制？

```js
function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject("Timeout!"), ms)),
  ]);
}
```

✅ 面试点：

- 利用 `Promise.race()`；
- 注意清理定时器；
- 实际应用：接口超时保护、用户操作超时等。

---

> ## 7. 如何实现 Promise 的串行执行？
>
> **方式一：reduce 链式执行**

```js
tasks.reduce((p, task) => p.then(() => task()), Promise.resolve());
```

**方式二：for-await-of**

```js
for (const task of tasks) await task();
```

> ## 8. 如何控制 Promise 并发数量？
>
> 实现类似 “Promise 池”：

```js
async function limitPool(tasks, limit = 3) {
  const pool = [];
  for (const task of tasks) {
    const p = task().finally(() => pool.splice(pool.indexOf(p), 1));
    pool.push(p);
    if (pool.length >= limit) await Promise.race(pool);
  }
  await Promise.all(pool);
}
```

> ## 9. 如何使用 Promise 实现重试机制？

```js
function retry(fn, times = 3, delay = 1000) {
  return new Promise((resolve, reject) => {
    const attempt = () => {
      fn()
        .then(resolve)
        .catch((err) => {
          if (times-- > 0) setTimeout(attempt, delay);
          else reject(err);
        });
    };
    attempt();
  });
}
```

✅ 场景：网络请求偶发失败、接口重试逻辑。

> ## 10. Promise 在前端项目中的典型使用场景有哪些？

- ✅ **接口请求封装**（基于 fetch / axios）
- ✅ **并发加载资源**（图片、接口数据）
- ✅ **延迟动画或节流防抖**
- ✅ **超时控制与取消机制**
- ✅ **异步初始化（如用户登录状态、SDK 加载）**
- ✅ **文件上传分片与重试**

---



# 💡 六、Promise 实际应用思维题

> ✅ 考察工程经验、边界与优化意识。

1. 在真实项目中，哪些情况下不建议使用 Promise？
2. 如何处理多个 Promise 的依赖关系？
3. Promise 与 Observable（RxJS）有何区别？
4. Promise 的内存释放机制是怎样的？
5. Promise 链过长可能导致什么问题？
6. 如何优雅地调试 Promise 链？
7. Promise 中的错误日志如何集中处理？
8. 如果某个 Promise 永远不 resolve，会发生什么？
9. Promise 能否取消？如何实现？
10. Promise 的 polyfill（兼容实现）原理是什么？

---

# 📚 七、常见面试延伸问题

> ✅ 考察你是否真正理解 Promise 与异步模型。

1. Promise 和 Generator 的区别？
2. Promise 如何与回调函数混用？
3. 解释 “Promise 是单向状态机” 的含义。
4. Promise 链式调用的 “状态透传” 是什么？
5. 如何调试一个死循环 Promise 链？
6. Node.js 中 Promise 的微任务队列与浏览器有何不同？
7. 为什么在 Node.js 14 之后，unhandledRejection 会终止进程？
8. Promise 在事件循环中的顺序与 MutationObserver 的顺序比较？
9. Promise 链式调用返回值为 undefined 时的表现？
10. Promise.resolve(Promise.resolve(…)) 的行为？

---

# 🧩 八、总结（面试技巧）

**面试官关注点：**

- 你是否知道 Promise 的核心机制（状态流转 + 微任务）
- 是否理解「为什么 then 返回一个新的 Promise」
- 是否能解释 Promise 的「值穿透」和「异常传递」
- 是否能清楚 async/await 本质上是 Promise 的语法糖
- 是否能举出 Promise 实际使用场景（请求并发、超时控制、任务队列等）
