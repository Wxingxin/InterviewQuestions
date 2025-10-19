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

    function fulfill(value) {
      if (this.state === PENDING) {
        this.state = FULFILLED;
        this.value = value;
        this.onFulfilledsCallback.forEach((cb) => cb());
      }
    }

    function reject(reason) {
      if (this.state === PENDING) {
        this.state = REJECTED;
        this.reason = reason;
        this.onRejectedsCallback.forEach((cb) => cb());
      }
    }

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
        : (error) => {
            throw error;
          };
    return MyPromise((resolve, reject) => {});
  }

  static resolve(value){
    if(value instanceof MyPromise) return value
    return new MyPromise(resolve => resolve(value))
  }

  static reject(reason){
    return new MyPromise((_, reject) => reject(reason))
  }

  static all(promises){
    return new MyPromise((resolve,reject) => {
      promises.forEach((p,i) => {
        MyPromise.resolve(p).then()
      })
    })
  }
}
