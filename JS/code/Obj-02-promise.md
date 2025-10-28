# 命名

| 名称                   | 类型 | 作用                         | 何时被使用                     |
| ---------------------- | ---- | ---------------------------- | ------------------------------ |
| `PENDING`              | 常量 | 初始状态                     | Promise 刚创建时               |
| `FULFILLED`            | 常量 | 成功状态                     | 调用 `fulfill` 时              |
| `REJECTED`             | 常量 | 失败状态                     | 调用 `reject` 时               |
| `fulfill`              | **函数** | 将状态改为成功并执行成功回调 | 调用 `resolve()` 时            |
| `reject`               | **函数** | 将状态改为失败并执行失败回调 | 调用 `reject()` 时             |
| `onFulfilledsCallback` | 数组 | 存放所有成功回调             | 等待状态时调用 `then()` 时注册 |
| `onRejectedsCallback`  | 数组 | 存放所有失败回调             | 等待状态时调用 `then()` 时注册 |
| `onFulfilled`          | **函数** | 成功回调函数（由用户传入）   | 状态变为 fulfilled 时调用      |
| `onRejected`           | **函数** | 失败回调函数（由用户传入）   | 状态变为 rejected 时调用       |

# 较全的代码

```js
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  constructor(executor) {
    this.state = PENDING;
    this.value = null;
    this.reason = null;
    this.onFulfilledsCallback = [];
    this.onRejectedsCallback = [];

    const fulfill = (value) => {
      if (this.state === PENDING) {
        this.state = FULFILLED;
        this.value = value;
        this.onFulfilledsCallback.forEach((cb) => cb());
      }
    };

    const reject = (reason) => {
      if (this.state === PENDING) {
        this.state = REJECTED;
        this.reason = reason;
        this.onRejectedsCallback.forEach((cb) => cb());
      }
    };

    try {
      executor(fulfill, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (v) => v;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (err) => {
            throw err;
          };
    return new MyPromise((resolve, reject) => {
      if (this.state === FULFILLED) {
        queueMicrotask(() => {
          try {
            const x = onFulfilled(this.value);
            resolve(x);
          } catch (error) {
            reject(error);
          }
        });
      }

      if (this.state === REJECTED) {
        queueMicrotask(() => {
          try {
            const x = onRejected(this.reason);
            reject(x);
          } catch (error) {
            reject(error);
          }
        });
      }

      if (this.state === PENDING) {
        this.onFulfilledsCallback.push(() => {
          queueMicrotask(() => {
            try {
              const x = onFulfilled(this.value);
              resolve(x);
            } catch (error) {
              reject(error);
            }
          });
        });

        this.onRejectedsCallback.push(() => {
          queueMicrotask(() => {
            try {
              const x = onRejected(this.reason);
              reject(x);
            } catch (error) {
              reject(error);
            }
          });
        });
      }
    });
  }

  // catch 方法: 只是简化了 rejection 的处理
  catch(onRejected) {
    return this.then(null, onRejected);
  }

  // ========== 静态方法实现 ==========

  // 用于统一把值包装成 MyPromise
  static resolve(value) {
    if (value instanceof MyPromise) return value;
    return new MyPromise((resolve) => resolve(value));
  }
          
  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason));
  }

  // Promise.all
  static all(promises) {
    return new MyPromise((resolve, reject) => {
      let results = [];
      let count = 0;

      promises.forEach((p, i) => {
        MyPromise.resolve(p).then(
          (value) => {
            results[i] = value;
            count++;
            if (count === promises.length) {
              resolve(results);
            }
          },
          (err) => reject(err)
        );
      });

      if (promises.length === 0) {
        resolve([]);
      }
    });
  }

  // Promise.allSettled
  static allSettled(promises) {
    return new MyPromise((resolve) => {
      let results = [];
      let count = 0;

      promises.forEach((p, i) => {
        MyPromise.resolve(p).then(
          (value) => {
            results[i] = { status: "fulfilled", value };
            count++;
            if (count === promises.length) resolve(results);
          },
          (reason) => {
            results[i] = { status: "rejected", reason };
            count++;
            if (count === promises.length) resolve(results);
          }
        );
      });

      if (promises.length === 0) {
        resolve([]);
      }
    });
  }

  // Promise.race
  static race(promises) {
    return new MyPromise((resolve, reject) => {
      promises.forEach((p) => {
        MyPromise.resolve(p).then(resolve, reject);
      });
    });
  }

  // Promise.any
  static any(promises) {
    return new MyPromise((resolve, reject) => {
      let errors = [];
      let count = 0;

      promises.forEach((p, i) => {
        MyPromise.resolve(p).then(
          (value) => resolve(value),
          (err) => {
            errors[i] = err;
            count++;
            if (count === promises.length) {
              reject(new AggregateError(errors, "All promises were rejected"));
            }
          }
        );
      });

      if (promises.length === 0) {
        reject(new AggregateError([], "All promises were rejected"));
      }
    });
  }
}
```
