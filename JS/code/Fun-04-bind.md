好，那我直接给你**手写 bind + 相应知识点大全（面试完整版）**。这玩意儿是 call/apply 的升级版，考点也最多。

---

# 🧠 1. `bind` 是啥？核心作用

`Function.prototype.bind` 用来：

1. **显式绑定 this**
2. **不会立即执行**
3. **返回一个新函数**
4. **支持参数预置（柯里化）**
5. **新函数可被 new 调用（绑定失效/优先级问题是重点）**

```js
const newFn = fn.bind(thisArg, arg1, arg2, ...)
newFn(arg3, arg4)
```

---

# 🧠 2. bind 的执行规则（面试必背）

## ✅（1）返回新函数，不会执行

```js
const f2 = f.bind(obj);
f2(); // 现在才执行
```

## ✅（2）参数拼接（柯里化）

bind 时的参数在前，调用时的参数在后：

```js
fn.bind(obj, 1, 2)(3, 4)
// 等价 fn.call(obj, 1, 2, 3, 4)
```

## ✅（3）thisArg 规则（和 call/apply 一样）

* `null/undefined` → 非严格模式 this 为 globalThis
* 原始值会装箱 `Object(thisArg)`

## ✅（4）**绑定函数被 new 调用时，this 失效**

这是 bind 的最大考点：

```js
function Foo(x){ this.x = x }
const BoundFoo = Foo.bind({x: 1});

const obj = new BoundFoo(10);
console.log(obj.x); // 10  （this 指向 new 出来的实例）
```

**规则：new 的 this 绑定优先级高于 bind。**

## ✅（5）返回的新函数要继承原函数原型（可 new）

```js
BoundFoo.prototype instanceof Foo // true
```

---

# 🧠 3. bind / call / apply 对比（简表）

| 方法    | 是否立即执行 | 传参形式       | 返回值     |
| ----- | ------ | ---------- | ------- |
| call  | ✅ 是    | 逐个参数       | 函数执行结果  |
| apply | ✅ 是    | 数组/类数组     | 函数执行结果  |
| bind  | ❌ 否    | 预置 + 调用时再传 | **新函数** |

---

# 🧠 4. 手写 bind 的核心原理

> bind 本质是返回一个包装函数
> 调用时内部用 call/apply 改 this + 拼参数

### 关键点：

1. 保存原函数 `self`
2. 保存 thisArg 和预置参数
3. 返回新函数 `bound`
4. `bound` 调用时再拼接参数并执行
5. 如果 `bound` 被 new 调用 → this 指向实例，而不是 thisArg
6. `bound.prototype` 需要指向原函数原型的一个副本

---

# ✍️ 5. 最简版 bind（理解用）

（不支持 new）

```js
Function.prototype.myBind = function (thisArg, ...presetArgs) {
  const self = this;
  return function (...laterArgs) {
    return self.apply(thisArg, presetArgs.concat(laterArgs));
  };
};
```

---

# ✅ 6. **完整版 bind（支持 new + 原型链 + 柯里化）**

面试可以直接写这个：

```js
Function.prototype.myBind = function (thisArg, ...presetArgs) {
  if (typeof this !== "function") {
    throw new TypeError("myBind must be called on a function");
  }

  const self = this;

  function boundFn(...laterArgs) {
    // 关键：判断是否被 new 调用
    const isNew = this instanceof boundFn;

    // new 调用时 this 指向实例；否则用绑定的 thisArg
    const ctx = isNew
      ? this
      : (thisArg === null || thisArg === undefined
          ? globalThis
          : Object(thisArg));

    return self.apply(ctx, presetArgs.concat(laterArgs));
  }

  // 维护原型链：boundFn.prototype 是 self.prototype 的“副本”
  if (self.prototype) {
    boundFn.prototype = Object.create(self.prototype);
    // 可选：修正 constructor
    boundFn.prototype.constructor = boundFn;
  }

  return boundFn;
};
```

---

# 🧠 7. 为什么要这样写？关键知识点拆解

## ✅（1）`this instanceof boundFn` 为啥能判断 new？

当你 `new boundFn()` 时，JS 会：

* 创建新对象
* 让这个对象的 `__proto__` 指向 `boundFn.prototype`
  所以 `this instanceof boundFn` 为 true。

---

## ✅（2）为啥要 `Object.create(self.prototype)`？

保证：

* `new boundFn()` 的实例
* 能访问原函数原型方法

```js
Foo.prototype.say = function(){...}
const B = Foo.bind(...)
new B().say() // 必须可用
```

---

## ✅（3）为啥 boundFn.prototype 不是直接等于 self.prototype？

如果直接赋值会污染原型：

```js
boundFn.prototype = self.prototype // ❌ 同一引用
```

用 `Object.create` 才是“继承副本”。

---

## ✅（4）二次 bind 是否生效？

原生中：

* bind 之后再 bind，**第一次绑定的 this 不能被改**
* 但参数能继续追加

你的实现用闭包直接锁死 thisArg，符合行为。

---

# 🧠 8. bind 常见坑（面试易挂）

| 坑                | 说明                |
| ---------------- | ----------------- |
| ❌ bind 返回函数却立即执行 | bind 不执行          |
| ❌ 不支持 new        | 面试高频扣分点           |
| ❌ 参数不拼接          | 柯里化没实现            |
| ❌ 原型链没处理         | new 出来的实例访问不到原型方法 |
| ❌ thisArg 不装箱    | 原生会装箱             |

---

# 🧪 9. 测试用例（建议背 2-3 个）

```js
function Foo(a, b) {
  this.sum = a + b;
}
Foo.prototype.say = function () {
  return this.sum;
};

const obj = { sum: 100 };

// 1) 普通绑定 + 柯里化
const f1 = Foo.myBind(obj, 1);
f1(2);
console.log(obj.sum); // 3

// 2) new 优先级高于 bind
const F2 = Foo.myBind(obj, 5);
const ins = new F2(6);
console.log(ins.sum); // 11
console.log(ins.say()); // 11
console.log(ins instanceof Foo); // true
```

---

# 🔥 10. 一句话总览 bind

> **手写 bind = 返回闭包函数保存 this + 预置参数；调用时拼参数执行；若被 new 调用则 this 指向实例；并且要继承原函数原型。**

