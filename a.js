const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

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
            resolve(x);
          } catch (error) {
            reject(error);
          }
        });
      }
    });
  }

  static resolve(value) {
    if (value instanceof MyPromise) {
      return value;
    }
    return new MyPromise((resolve) => resolve(value));
  }

  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason));
  }

  static all(promises) {
    return new MyPromise((resolve, reject) => {
      let results = [];
      let count = 0;

      promises.forEach((p, i) => {
        MyPromise.resolve(p).then((value) => {
          results[i] = value;
          count++;
          if (count === promises.length) {
            resolve(results);
          }
        });
      });

      if (promises.length === 0) {
        resolve([]);
      }
    });
  }

  static allSettled(promises){
    return new MyPromise(resolve=> {
        let results = []
        let count = 0;

        promises.forEach((p,i) => {
            (value) => {
                results[i] = {status: "fulfilled", value};
                count++;
                if(count === promises.length){
                    resolve(results);
                }
            },
            (reason) => {
                results[i] = {status: "rejected", reason};
                count++;
                if(count === promises.length){
                    resolve(results);
                }
            }
        })

        if(promises.length === 0){
            resolve([])
        }
    })
  }

  static race(promises){
    return new MyPromise((resolve,reject) => {
        promises.forEach(p => {
            MyPromise.resolve(p).then(resolve,reject)
        })
    })
  }

  static any(promises){
    return new MyPromise((resolve,reject) => {
        let errors = []
        let count = 0;

        promises.forEach((p,i) => {
            MyPromise.resolve(p).then(
                (value) => {
                    resolve(value)
                },
                (err) => {
                    errors[i] = err;
                    count++;
                    if(count === promises.length){
                        reject(new AggregateError(errors, "All promises were rejected"))
                    }
                }
            )
        })
    })
  }
}
