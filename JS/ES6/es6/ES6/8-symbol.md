

## 1️⃣ 什么是 Symbol？

**题目：**

> 请解释一下 JavaScript 中的 `Symbol` 是什么？为什么要引入它？

**回答：**

* `Symbol` 是 **ES6 引入的一种原始数据类型**，表示**独一无二的值**。
* 用来给对象添加不会被意外覆盖的属性（私有属性）。
* 每次调用 `Symbol()` 都会生成一个唯一值。

```js
const a = Symbol("id");
const b = Symbol("id");
console.log(a === b); // false
```

✅ 引入 Symbol 的目的：

* 避免属性名冲突；
* 用于定义对象内部的“隐藏属性”；
* 支撑语言底层的“元编程特性”（如 `Symbol.iterator`）。

---

## 2️⃣ Symbol 有几种创建方式？

**题目：**

> Symbol 的创建方式有哪些？`Symbol()` 和 `Symbol.for()` 有什么区别？

**回答：**

### 普通创建

```js
const s1 = Symbol("desc");
const s2 = Symbol("desc");
console.log(s1 === s2); // false
```

### 全局注册表（Symbol.for）

```js
const s1 = Symbol.for("desc");
const s2 = Symbol.for("desc");
console.log(s1 === s2); // true
```

📘 **区别总结：**

| 方法             | 是否唯一   | 是否存入全局注册表 | 相同描述是否相等 |
| -------------- | ------ | --------- | -------- |
| `Symbol()`     | ✅ 唯一   | ❌ 否       | ❌ 不相等    |
| `Symbol.for()` | 🔁 可复用 | ✅ 是       | ✅ 相等     |

---

## 3️⃣ Symbol 的描述（description）属性有什么用？

**题目：**

> Symbol 有字符串描述吗？如何读取？

**回答：**
`Symbol('name')` 的 `'name'` 只是一个描述，不影响唯一性，可以通过 `.description` 访问。

```js
const s = Symbol("hello");
console.log(s.description); // "hello"
```

---

## 4️⃣ Symbol 可以被隐式转换成字符串或数值吗？

**题目：**

> 为什么 `Symbol` 不能与字符串直接拼接？怎么做才行？

**回答：**
不能隐式转换为字符串或数字，只能显式转换。

```js
const s = Symbol("id");
console.log(String(s));  // ✅ 'Symbol(id)'
console.log(s.toString()); // ✅ 'Symbol(id)'
console.log(s + ""); // ❌ TypeError
```

---

## 5️⃣ Symbol 属性能被 `for...in` 或 `Object.keys()` 枚举吗？

**题目：**

> Symbol 作为对象属性时，能被哪些方法访问？

**回答：**
默认是 **不可枚举的**，不会出现在普通属性枚举中。

```js
const obj = {
  [Symbol("a")]: 1,
  b: 2
};

console.log(Object.keys(obj));           // ['b']
console.log(Object.getOwnPropertyNames(obj)); // ['b']
console.log(Object.getOwnPropertySymbols(obj)); // [Symbol(a)]
console.log(Reflect.ownKeys(obj));       // ['b', Symbol(a)]
```

---

## 6️⃣ 如何遍历对象的 Symbol 属性？

**题目：**

> 如何获取一个对象的所有 Symbol 属性？

**回答：**
通过 `Object.getOwnPropertySymbols(obj)`。

```js
const s1 = Symbol("a");
const obj = { [s1]: 123 };
console.log(Object.getOwnPropertySymbols(obj)); // [Symbol(a)]
```

---

## 7️⃣ Symbol 常见的内置（Well-known）值有哪些？

**题目：**

> JS 内置的 Symbol 有哪些？举例说明其作用。

**回答：**
ECMAScript 预定义了一些 Symbol 常量，用于定制语言行为。

| 内置 Symbol                                                            | 用途                                |
| -------------------------------------------------------------------- | --------------------------------- |
| `Symbol.iterator`                                                    | 定义对象的迭代器行为（支持 `for...of`）         |
| `Symbol.toPrimitive`                                                 | 对象转原始值的自定义逻辑                      |
| `Symbol.toStringTag`                                                 | 改变 `Object.prototype.toString` 输出 |
| `Symbol.hasInstance`                                                 | 控制 `instanceof` 行为                |
| `Symbol.isConcatSpreadable`                                          | 控制数组 `concat()` 展开行为              |
| `Symbol.match` / `Symbol.replace` / `Symbol.search` / `Symbol.split` | 自定义字符串与正则的交互行为                    |

---

### 例子：`Symbol.iterator`

```js
const obj = {
  data: [1, 2, 3],
  [Symbol.iterator]() {
    let i = 0;
    const data = this.data;
    return {
      next() {
        return { value: data[i++], done: i > data.length };
      },
    };
  },
};

for (const x of obj) console.log(x);
// 输出 1 2 3
```

---

### 例子：`Symbol.toPrimitive`

```js
const user = {
  name: "Jack",
  age: 20,
  [Symbol.toPrimitive](hint) {
    return hint === "string" ? this.name : this.age;
  },
};

console.log(`${user}`); // "Jack"
console.log(+user);     // 20
```

---

## 8️⃣ Symbol 如何实现对象的私有属性？

**题目：**

> 如何利用 Symbol 实现对象的“私有属性”？

**回答：**
Symbol 属性不会被意外访问，可用作“弱私有字段”。

```js
const _secret = Symbol("secret");

class Person {
  constructor(name, secret) {
    this.name = name;
    this[_secret] = secret;
  }
  getSecret() {
    return this[_secret];
  }
}

const p = new Person("Alice", "12345");
console.log(p._secret); // undefined
console.log(p.getSecret()); // '12345'
```

---

## 9️⃣ Symbol 在 Proxy 和 Reflect 中的应用？

**题目：**

> Symbol 与 Proxy / Reflect 有什么关系？

**回答：**
Proxy 可以拦截 Symbol 行为，比如：

```js
const target = {};
const proxy = new Proxy(target, {
  get(target, key) {
    if (typeof key === "symbol") {
      console.log("访问了 Symbol 属性:", key.description);
    }
    return target[key];
  },
});

const s = Symbol("secret");
proxy[s]; // 控制 Symbol 访问行为
```

Reflect 提供了 `Reflect.ownKeys()` 获取包含 Symbol 的所有键：

```js
Reflect.ownKeys({ [Symbol()]: 1, a: 2 }); // ['a', Symbol()]
```

---

## 🔟 Symbol 在 Set / Map 中的表现？

**题目：**

> Symbol 可作为 Set 或 Map 的 key 吗？

**回答：**
可以，因为它是原始类型且唯一。

```js
const m = new Map();
const s = Symbol("id");
m.set(s, "Hello");
console.log(m.get(s)); // "Hello"
```

---

## 1️⃣1️⃣ Symbol 与 WeakMap、私有变量的区别？

| 特性     | Symbol                                  | WeakMap  | 类私有字段（#name） |
| ------ | --------------------------------------- | -------- | ------------ |
| 唯一性    | ✅                                       | ✅        | ✅            |
| 可见性    | 可通过 `Object.getOwnPropertySymbols()` 获取 | ❌ 完全隐藏   | ❌ 仅类内部可访问    |
| 支持类外访问 | ✅ 可反射拿到                                 | ❌        | ❌            |
| 用途     | 模拟私有属性                                  | 真正私有数据存储 | ES标准私有属性     |

---

## 1️⃣2️⃣ Symbol 可以被 JSON 序列化吗？

**题目：**

> 为什么 JSON.stringify() 会忽略 Symbol 属性？

**回答：**
因为 Symbol 属性是不可枚举的、非字符串键，`JSON.stringify()` 只处理字符串键。

```js
const obj = { [Symbol("a")]: 1, b: 2 };
console.log(JSON.stringify(obj)); // '{"b":2}'
```

---

# 🧩 高频总结表

| 面试题                      | 核心考点                               |
| ------------------------ | ---------------------------------- |
| 什么是 Symbol               | 唯一标识符，防止属性冲突                       |
| Symbol() vs Symbol.for() | 局部唯一 vs 全局注册                       |
| Symbol 属性能否枚举            | 否                                  |
| 如何获取 Symbol 属性           | Object.getOwnPropertySymbols       |
| 内置 Symbol                | iterator、toPrimitive、toStringTag 等 |
| Symbol.toPrimitive 应用    | 控制对象转原始值行为                         |
| 用 Symbol 实现私有属性          | 避免命名冲突                             |
| JSON 序列化                 | 忽略 Symbol                          |
| Symbol 在 Proxy 中         | 可拦截 Symbol 属性                      |
| Symbol 与 WeakMap         | 私有性对比                              |

---

是否希望我帮你出一份 ✅ **“Symbol 高频面试题练习题卷（含代码空白填充题 + 判断题 + 简答题）”**？
适合模拟真实面试练习。
