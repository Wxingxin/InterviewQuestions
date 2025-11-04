非常棒 👍，你在学完 **Proxy** 之后马上学 **Reflect** 是非常正确的，因为这两个是“孪生兄弟”：

> **Proxy 是“拦截”对象行为，Reflect 是“执行”对象的默认行为。**

我们下面来系统、基础、带经典代码地讲清楚 Reflect 👇

---

# 🧠 一、Reflect 是什么？

**定义：**

> `Reflect` 是一个内置对象，提供了一系列用于**操作对象的静态方法**，这些方法和某些 `Object` 或 `Proxy` 的内部操作相对应。

📘 Reflect 主要用于：

1. 替代一些老旧的 `Object` 方法；
2. 与 `Proxy` 配合，保证默认行为；
3. 让代码更简洁、更安全、更规范。

---

# 🧩 二、Reflect 的所有方法速览表（超实用对照）

| 方法                                   | 作用       | 类似旧方法                                                             | 是否会抛错        |
| ------------------------------------ | -------- | ----------------------------------------------------------------- | ------------ |
| `Reflect.get()`                      | 读取属性     | `obj[prop]`                                                       | 否            |
| `Reflect.set()`                      | 设置属性     | `obj[prop] = value`                                               | 否            |
| `Reflect.has()`                      | 判断属性是否存在 | `'prop' in obj`                                                   | 否            |
| `Reflect.deleteProperty()`           | 删除属性     | `delete obj[prop]`                                                | 否            |
| `Reflect.ownKeys()`                  | 获取对象所有键  | `Object.getOwnPropertyNames()` + `Object.getOwnPropertySymbols()` | 否            |
| `Reflect.defineProperty()`           | 定义属性     | `Object.defineProperty()`                                         | ✅ 返回布尔值（不抛错） |
| `Reflect.getOwnPropertyDescriptor()` | 获取属性描述符  | `Object.getOwnPropertyDescriptor()`                               | 否            |
| `Reflect.getPrototypeOf()`           | 获取原型     | `Object.getPrototypeOf()`                                         | 否            |
| `Reflect.setPrototypeOf()`           | 设置原型     | `Object.setPrototypeOf()`                                         | 否            |
| `Reflect.isExtensible()`             | 是否可扩展    | `Object.isExtensible()`                                           | 否            |
| `Reflect.preventExtensions()`        | 禁止扩展对象   | `Object.preventExtensions()`                                      | 否            |
| `Reflect.apply()`                    | 调用函数     | `Function.prototype.apply.call()`                                 | 否            |
| `Reflect.construct()`                | 调用构造函数   | `new target(...args)`                                             | 否            |

---

# 🧩 三、基础案例大全

## 1️⃣ Reflect.get() —— 安全读取属性

```js
const obj = { name: 'Alice' };

// 普通方式
console.log(obj.name); // Alice

// Reflect 方式
console.log(Reflect.get(obj, 'name')); // Alice
```

✅ **好处：**

* 可配合 `Proxy`；
* 可指定 `this` 上下文。

```js
const obj = {
  name: 'Tom',
  get upperName() {
    return this.name.toUpperCase();
  }
};

console.log(Reflect.get(obj, 'upperName')); // TOM
```

---

## 2️⃣ Reflect.set() —— 安全设置属性

```js
const user = {};
Reflect.set(user, 'age', 18);
console.log(user.age); // 18
```

✅ 可指定 `this`：

```js
const obj = {
  _x: 1,
  set x(value) {
    console.log('设置x为', value);
    this._x = value;
  }
};

Reflect.set(obj, 'x', 10); // 设置x为 10
```

---

## 3️⃣ Reflect.has() —— 判断属性是否存在（代替 in）

```js
const person = { name: 'Tom' };

console.log(Reflect.has(person, 'name')); // true
console.log(Reflect.has(person, 'age'));  // false
```

---

## 4️⃣ Reflect.deleteProperty() —— 删除属性（代替 delete）

```js
const user = { name: 'Alice', age: 20 };

Reflect.deleteProperty(user, 'age');
console.log(user); // { name: 'Alice' }
```

⚠️ 不抛错，返回 `true` / `false` 表示是否删除成功。

---

## 5️⃣ Reflect.ownKeys() —— 获取对象所有键

```js
const obj = { a: 1, b: 2 };
const sym = Symbol('x');
obj[sym] = 3;

console.log(Reflect.ownKeys(obj)); // ['a', 'b', Symbol(x)]
```

📘 相当于：

```js
Object.getOwnPropertyNames(obj).concat(Object.getOwnPropertySymbols(obj));
```

---

## 6️⃣ Reflect.defineProperty() —— 定义属性（更安全）

```js
const obj = {};

const result = Reflect.defineProperty(obj, 'name', {
  value: 'Tom',
  writable: false
});

console.log(result); // true（不会抛错）
console.log(obj.name); // Tom
```

💡 对比 `Object.defineProperty()`：
`Object.defineProperty()` 失败会抛错，而 `Reflect.defineProperty()` 返回 `false`。

---

## 7️⃣ Reflect.getOwnPropertyDescriptor()

```js
const obj = { name: 'Tom' };

const desc = Reflect.getOwnPropertyDescriptor(obj, 'name');
console.log(desc);
// { value: 'Tom', writable: true, enumerable: true, configurable: true }
```

---

## 8️⃣ Reflect.getPrototypeOf() / Reflect.setPrototypeOf()

```js
const parent = { greet() { return 'hello'; } };
const child = {};

Reflect.setPrototypeOf(child, parent);

console.log(Reflect.getPrototypeOf(child) === parent); // true
console.log(child.greet()); // hello
```

---

## 9️⃣ Reflect.isExtensible() / Reflect.preventExtensions()

```js
const obj = {};
console.log(Reflect.isExtensible(obj)); // true

Reflect.preventExtensions(obj);
console.log(Reflect.isExtensible(obj)); // false
```

---

## 🔟 Reflect.apply() —— 调用函数（代替 Function.prototype.apply）

```js
function add(a, b) {
  return a + b;
}

console.log(Reflect.apply(add, null, [3, 5])); // 8
```

💡 相当于：

```js
Function.prototype.apply.call(add, null, [3, 5]);
```

---

## 1️⃣1️⃣ Reflect.construct() —— 类似 new，但可控制构造

```js
function Person(name) {
  this.name = name;
}

const obj = Reflect.construct(Person, ['Alice']);
console.log(obj); // Person { name: 'Alice' }
```

可替代：

```js
new Person('Alice')
```

---

# 🧩 四、Reflect 与 Proxy 搭配使用（核心）

✅ **为什么要用 Reflect？**

如果你在 Proxy 的拦截里不想破坏默认行为，就应该用 Reflect 去执行默认操作：

```js
const person = { name: 'Tom', age: 18 };

const proxy = new Proxy(person, {
  get(target, key, receiver) {
    console.log('读取属性：', key);
    return Reflect.get(target, key, receiver); // 执行默认行为
  },
  set(target, key, value, receiver) {
    console.log('设置属性：', key, '=', value);
    return Reflect.set(target, key, value, receiver);
  }
});

proxy.age = 20;
console.log(proxy.name);
```

✅ **优点：**

* 保持 Proxy 行为一致；
* 避免 `this` 指向错误；
* 更符合语言规范。

---

# 🧩 五、经典应用案例

## 🌟 1. 只读对象（配合 Reflect）

```js
function readonly(obj) {
  return new Proxy(obj, {
    set(target, key, value) {
      console.warn(`不能修改 ${key}`);
      return true;
    },
    deleteProperty(target, key) {
      console.warn(`不能删除 ${key}`);
      return true;
    },
    get(target, key, receiver) {
      return Reflect.get(target, key, receiver);
    }
  });
}

const config = readonly({ api: 'https://api.com' });
config.api = 'http://hack.com'; // 不能修改 api
```

---

## 🌟 2. 自动日志对象（Reflect + Proxy）

```js
function loggable(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver);
      console.log(`GET ${String(key)} =>`, value);
      return value;
    },
    set(target, key, value, receiver) {
      console.log(`SET ${String(key)} =>`, value);
      return Reflect.set(target, key, value, receiver);
    }
  });
}

const user = loggable({ name: 'Alice', age: 20 });
user.age = 25; // SET age => 25
console.log(user.age); // GET age => 25
```

---

# 🧩 六、Reflect 优点总结

| 优点             | 说明                                         |
| -------------- | ------------------------------------------ |
| ✅ 一致性          | 每个方法都返回布尔或值，不抛异常                           |
| ✅ 搭配 Proxy     | 可作为 Proxy 默认行为的实现                          |
| ✅ 代替 Object 方法 | 更规范、更清晰                                    |
| ✅ 可指定 this     | `Reflect.get`、`Reflect.set` 支持自定义 this 上下文 |

---

# ✅ 七、总结口诀

> **Proxy 负责拦截，Reflect 负责执行。**
> Proxy 改行为，Reflect 保底线。

---

要不要我接下来帮你做一份 **“Reflect 练习题 + 逐步讲解版”**？
里面会包含：属性访问模拟、Proxy + Reflect 组合题、以及常见面试题讲解。
