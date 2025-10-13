

## 优化版 `myBind`

```js
Function.prototype.myBind = function(context, ...args1) {
  if (typeof this !== "function") {
    throw new TypeError("myBind must be called on a function");
  }

  const fn = this;

  function boundFn(...args2) {
    // 判断是否作为构造函数调用
    const isNew = this instanceof boundFn;
    // 如果是 new 调用，则忽略 context，this 指向实例
    return fn.apply(isNew ? this : context, [...args1, ...args2]);
  }

  // 保留原函数原型链，方便 new 调用继承
  if (fn.prototype) {
    boundFn.prototype = Object.create(fn.prototype);
    boundFn.prototype.constructor = boundFn;
  }

  return boundFn;
};
```

---

### 🔹 优化点说明

1. **构造函数判断**

   ```js
   const isNew = this instanceof boundFn;
   ```

   * 保证 `new boundFn()` 时 `this` 指向新实例，而不是绑定的 context。

2. **参数拼接**

   * `...args1` 是预置参数（bind 时绑定）
   * `...args2` 是调用时传入参数
   * `fn.apply(...)` 同时支持这两类参数

3. **原型继承优化**

   * 原来的写法也行，但可以写得更简洁：

   ```js
   boundFn.prototype = Object.create(fn.prototype);
   boundFn.prototype.constructor = boundFn;
   ```

   * 确保 new 调用继承原函数原型链。

4. **清晰易读**

   * 逻辑更直观：先判断是否 new 调用，再决定 this，最后执行。

---

### 🔹 测试示例

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.say = function() {
  return `${this.name} is ${this.age} years old`;
};

const bindFn = Person.myBind({ foo: "bar" }, "Alice");
const p = new bindFn(18);

console.log(p.name); // Alice
console.log(p.age);  // 18
console.log(p.say()); // Alice is 18 years old
console.log(p instanceof Person); // true
console.log(p instanceof bindFn); // true

// 普通调用
function greet(greeting) {
  return `${greeting}, ${this.name}`;
}
const obj = { name: "Bob" };
const boundGreet = greet.myBind(obj, "Hello");
console.log(boundGreet()); // Hello, Bob
```

