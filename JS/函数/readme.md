
# 🧩 一、函数基础题


## 💡 1. 函数声明（Function Declaration） vs 函数表达式（Function Expression）

**函数声明：**

```js
function add(a, b) {
  return a + b;
}
```

* 会被**提升（Hoisting）**，可在声明前调用。
* 有函数名。
* 在解析阶段就会被加载。

**函数表达式：**

```js
const add = function(a, b) {
  return a + b;
};
```

* 不会被完整提升（只有变量名被提升，值是 `undefined`）。
* 常用于回调函数、立即执行函数等。
* 赋值后才可调用。

✅ **面试点：**

> 函数声明在代码执行前就可调用，而函数表达式必须在赋值后调用。

---

## 💡 2. 匿名函数 vs 具名函数

| 区别    | 匿名函数    | 具名函数     |
| ----- | ------- | -------- |
| 是否有名称 | ❌ 无名称   | ✅ 有名称    |
| 调试堆栈  | 难定位     | 易于调试     |
| 递归调用  | 不可直接递归  | 可通过函数名递归 |
| 使用场景  | 回调、立即执行 | 常规定义、递归  |

示例：

```js
setTimeout(function() { console.log('匿名'); }, 1000);
setTimeout(function timer() { console.log('具名'); }, 1000);
```

---

## 💡 3. 什么是函数提升（Hoisting）？

**函数声明**会被整个提升：

```js
foo(); // ✅ 可执行
function foo() { console.log('ok'); }
```

**函数表达式**只提升变量，不提升定义：

```js
bar(); // ❌ TypeError: bar is not a function
var bar = function() { console.log('hi'); };
```

✅ **面试重点：**

> 函数声明 → 整体提升；函数表达式 → 变量提升但值为 undefined。

---

## 💡 4. 什么是箭头函数？与普通函数的区别？

箭头函数是一种简洁的函数写法：

```js
const add = (a, b) => a + b;
```

主要区别：

| 特性        | 箭头函数          | 普通函数         |
| --------- | ------------- | ------------ |
| this      | 继承外层作用域（词法绑定） | 动态绑定（由调用者决定） |
| arguments | ❌ 无 arguments | ✅ 有          |
| prototype | ❌ 无原型对象       | ✅ 有          |
| 构造函数      | ❌ 不能用 new 调用  | ✅ 可用 new 调用  |
| 代码简洁性     | ✅ 简洁          | 较长           |

---

## 💡 5. 箭头函数的 `this`、`arguments`、`prototype`

| 特性          | 描述                                       |
| ----------- | ---------------------------------------- |
| `this`      | 固定为**定义时所在作用域的 this**，不会被 call/apply 改变。 |
| `arguments` | 不存在，可用 rest 参数代替：`(...args)`。            |
| `prototype` | 不存在，不能作为构造函数使用。                          |

示例：

```js
const obj = {
  count: 10,
  inc: () => console.log(this.count)
};
obj.inc(); // undefined，因为 this 指向全局
```

---

## 💡 6. 函数默认参数

ES6 引入默认参数：

```js
function greet(name = 'Guest') {
  console.log('Hello, ' + name);
}
greet(); // Hello, Guest
```

特点：

* 只在参数未传入或为 `undefined` 时生效。
* 默认参数在函数作用域**之前**被初始化。

---

## 💡 7. 函数柯里化（Currying）

**定义：**
将多参数函数拆分为一系列接收单一参数的函数。

**例：**

```js
function add(a) {
  return function(b) {
    return a + b;
  };
}
add(2)(3); // 5
```

**应用场景：**

* 参数复用（配置型函数）
* 延迟执行（事件绑定）
* 函数组合（函数式编程）

✅ **面试答法：**

> 柯里化是“固定部分参数 + 延迟求值”的函数技巧。

---

## 💡 8. 函数重载（Overloading）

**JavaScript 不支持真正的函数重载**（没有基于参数签名的区分）。
但可以通过判断参数实现模拟：

```js
function greet(name, age) {
  if (typeof age === 'undefined') {
    console.log('Hello ' + name);
  } else {
    console.log('Hello ' + name + ', ' + age);
  }
}
```

✅ **面试答法：**

> JS 通过判断参数个数和类型实现“伪重载”。

---

## 💡 9. 函数的返回值可以是函数吗？

✅ 可以，**函数是一等公民（first-class citizen）**。
函数可作为参数传入，也可作为返回值。

```js
function outer() {
  return function inner() {
    console.log('闭包示例');
  };
}
const fn = outer();
fn(); // 闭包执行
```

**应用：**

* 闭包
* 柯里化
* 高阶函数

---

## 💡 10. IIFE（立即执行函数表达式）

**定义：**
函数定义后立即执行的表达式：

```js
(function() {
  console.log('立即执行');
})();
```

**作用：**

* 创建独立作用域，避免变量污染；
* 模拟模块化；
* 初始化逻辑。

✅ **面试答法：**

> IIFE = 立即创建局部作用域 + 自动执行一次。

---

是否要我帮你继续写下一部分：
👉 **《函数进阶面试题（闭包 / this / 作用域链 / async / 高阶函数）》**
内容更贴近大厂原题 + 代码解释？
   
---

# 🧠 二、函数作用域与闭包

1. 什么是作用域链（Scope Chain）？
2. 什么是闭包（Closure）？
3. 闭包的应用场景有哪些？（计数器、私有变量、缓存等）
4. 闭包会造成内存泄漏吗？如何避免？
5. 在循环中使用闭包会发生什么问题？
6. `var`、`let`、`const` 在闭包中表现的区别？
7. 如何用闭包实现模块化？
8. 闭包与模块模式（Module Pattern）的区别？
9. 闭包与箭头函数结合时，`this` 的绑定规则？
10. 如何手写一个带缓存功能的闭包函数？

---

# ⚙️ 三、this、call、apply、bind

1. `this` 的绑定规则有哪些？
2. 箭头函数的 `this` 为什么不可更改？
3. 手写 `call` / `apply` / `bind` 的实现？
4. `call` 和 `apply` 的区别？
5. `bind` 返回的函数还能再次绑定吗？
6. 使用 `this` 时，构造函数与普通函数的区别？
7. 如何让函数始终绑定到特定对象？
8. 事件回调中的 `this` 指向问题？
9. 如何解决 `this` 丢失？
10. `new` 调用时内部发生了什么？（四步过程）

---

# 🚀 四、高阶函数与函数式编程

1. 什么是高阶函数（Higher-Order Function）？
2. 常见的高阶函数有哪些？（map、filter、reduce、forEach、some、every）
3. 手写一个 `map` 或 `reduce` 的实现？
4. 什么是函数组合（compose、pipe）？
5. 什么是偏函数（Partial Application）？
6. 防抖（debounce）与节流（throttle）的原理与区别？
7. 如何封装一个带缓存的函数（Memoization）？
8. 什么是纯函数（Pure Function）？
9. 什么是副作用（Side Effect）？如何避免？
10. 函数式编程与命令式编程的区别？

---

# 🧩 五、函数性能与优化

1. 函数调用的性能瓶颈在哪里？
2. 频繁创建函数实例的性能问题？如何优化？
3. 函数缓存（Memoization）的实现与应用？
4. 尾调用优化（Tail Call Optimization）是什么？
5. 函数去抖和节流的不同实现方式（时间戳/定时器）？
6. 递归函数的优化思路？（尾递归、缓存）
7. 如何防止函数重复执行？（once函数）
8. 使用 `arguments` 与 `rest` 参数的性能差异？
9. 如何控制函数调用频率？
10. 函数性能调试工具（如 Chrome Performance）？

---

# 🧬 六、异步与回调函数

1. 回调函数的本质是什么？
2. 回调地狱（Callback Hell）是如何产生的？
3. 如何用 Promise 改写回调？
4. async/await 的底层是如何实现的？
5. 异步函数的返回值是什么？
6. 如何捕获 async 函数的异常？
7. 如何让多个异步函数按顺序执行？
8. 如何并行执行多个异步任务？
9. 异步函数中的 this 指向问题？
10. setTimeout 和 Promise 执行顺序（事件循环）？

---

# 🧱 七、函数对象与原型

1. 为什么函数也是对象？
2. 函数的 `prototype` 属性有什么用？
3. 函数的 `__proto__` 指向什么？
4. 构造函数与普通函数的区别？
5. 手写 new 操作符的实现？
6. `instanceof` 判断函数实例的原理？
7. 函数的 `constructor` 属性是什么？
8. 为什么箭头函数没有 `prototype`？
9. bind 后的函数原型会发生什么？
10. 函数继承（寄生组合继承、原型继承）的实现？

---

## 🧰 八、实战与源码类题

1. 手写一个防抖函数（debounce）
2. 手写一个节流函数（throttle）
3. 手写一个 once 函数（只执行一次）
4. 手写 compose / pipe
5. 手写 curry 函数（柯里化）
6. 手写函数 memoize（缓存）
7. 手写 bind、call、apply
8. 实现 async/await 的简单版本
9. 手写一个延迟执行函数（delay）
10. 实现一个带重试机制的异步函数（retry）

---

## 📚 九、综合与思考题

1. 为什么 JS 的函数是一等公民？
2. 函数内部定义函数的意义是什么？
3. 你在项目中是如何使用闭包的？
4. 如何让函数既能作为构造函数，又能作为普通函数使用？
5. 函数与模块的边界如何设计？
6. 如何让函数具备链式调用能力？
7. React Hooks 的底层为什么依赖闭包？
8. 函数式编程如何避免共享状态？
9. 如何测试函数的性能与正确性？
10. 函数设计的最佳实践有哪些？

---

如果你想，我可以接下来帮你整理👇
👉 **「函数面试题答案 + 代码实现版」**（包含防抖节流、柯里化、call/apply/bind、闭包缓存等源码讲解）。
是否帮你生成这一份？
