
# 🧩 一、Proxy 对象 — 拦截对象的操作

## 🌱 基本概念

`Proxy` 用于**创建一个对象的代理**，可以拦截对该对象的各种操作（读、写、删除、函数调用等）。

**语法：**

```js
const proxy = new Proxy(target, handler);
```

* `target`：目标对象（要被代理的对象）
* `handler`：包含“拦截方法”的对象，也叫“陷阱（trap）”

---

## 🧠 常见的 13 个拦截方法（trap）

| 拦截方法                                       | 触发时机     | 示例                                             |
| ------------------------------------------ | -------- | ---------------------------------------------- |
| `get(target, prop, receiver)`              | 读取属性     | `proxy.name`                                   |
| `set(target, prop, value, receiver)`       | 设置属性     | `proxy.age = 20`                               |
| `has(target, prop)`                        | `in` 操作符 | `'name' in proxy`                              |
| `deleteProperty(target, prop)`             | 删除属性     | `delete proxy.name`                            |
| `ownKeys(target)`                          | 获取所有键    | `Object.keys(proxy)`、`for...in`                |
| `getOwnPropertyDescriptor(target, prop)`   | 读取属性描述符  | `Object.getOwnPropertyDescriptor(proxy, prop)` |
| `defineProperty(target, prop, descriptor)` | 定义属性     | `Object.defineProperty(proxy, 'x', {...})`     |
| `preventExtensions(target)`                | 禁止扩展     | `Object.preventExtensions(proxy)`              |
| `isExtensible(target)`                     | 判断是否可扩展  | `Object.isExtensible(proxy)`                   |
| `getPrototypeOf(target)`                   | 获取原型     | `Object.getPrototypeOf(proxy)`                 |
| `setPrototypeOf(target, proto)`            | 设置原型     | `Object.setPrototypeOf(proxy, proto)`          |
| `apply(target, thisArg, args)`             | 函数调用     | `proxy(...args)`                               |
| `construct(target, args, newTarget)`       | `new` 调用 | `new proxy()`                                  |

---

## 🎯 常用示例

### ✅ 1. 拦截对象属性访问

```js
const user = { name: 'Tom', age: 20 };

const proxy = new Proxy(user, {
  get(target, prop) {
    console.log(`正在读取属性：${prop}`);
    return target[prop];
  },
  set(target, prop, value) {
    console.log(`正在修改属性：${prop} => ${value}`);
    target[prop] = value;
    return true;
  }
});

proxy.name; // 正在读取属性：name
proxy.age = 21; // 正在修改属性：age => 21
```

---

### ✅ 2. 拦截不存在的属性

```js
const person = { name: 'Alice' };

const proxy = new Proxy(person, {
  get(target, prop) {
    return prop in target ? target[prop] : `属性 ${prop} 不存在`;
  }
});

console.log(proxy.name); // Alice
console.log(proxy.age);  // 属性 age 不存在
```

---

### ✅ 3. 校验数据

```js
const user = {};

const proxy = new Proxy(user, {
  set(target, prop, value) {
    if (prop === 'age' && typeof value !== 'number') {
      throw new TypeError('age 必须是数字');
    }
    target[prop] = value;
    return true;
  }
});

proxy.age = 25; // ✅
proxy.age = '25'; // ❌ 抛出错误
```

---

### ✅ 4. 拦截函数调用（apply）

```js
function sum(a, b) {
  return a + b;
}

const proxy = new Proxy(sum, {
  apply(target, thisArg, args) {
    console.log('正在调用函数', args);
    return target(...args) * 2; // 修改结果
  }
});

console.log(proxy(2, 3)); // 输出 10
```

---

### ✅ 5. 实现私有属性保护

```js
const obj = { _secret: '123', name: 'AI' };

const proxy = new Proxy(obj, {
  get(target, prop) {
    if (prop.startsWith('_')) {
      throw new Error('禁止访问私有属性');
    }
    return target[prop];
  }
});

console.log(proxy.name);    // AI
console.log(proxy._secret); // 抛出错误
```

---

## 🚀 Proxy 的高级用法

### ✅ 1. Vue3 响应式原理

```js
function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      console.log('读取', key);
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      console.log('修改', key);
      return Reflect.set(target, key, value, receiver);
    }
  });
}

const state = reactive({ count: 0 });
state.count++; // 读取 count，修改 count
```

### ✅ 2. 深层代理（递归代理）

```js
function deepProxy(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver);
      return typeof value === 'object' && value !== null
        ? deepProxy(value)
        : value;
    }
  });
}

const nested = deepProxy({ a: { b: { c: 1 } } });
nested.a.b.c; // 会递归代理每一层
```

---

# 🧠 二、Reflect 对象 — 更规范的对象操作 API

## 🌱 基本概念

`Reflect` 是一个 **内置对象**，提供了一系列与对象操作相关的静态方法，
相当于把以前 `Object`、`Function`、`delete` 等的底层行为统一封装起来。

> 所有 Reflect 方法都是静态的，类似 `Math`，不能 new。

---

## 📚 常用方法一览

| 方法                                              | 功能          | 对应的 Proxy trap             |
| ----------------------------------------------- | ----------- | -------------------------- |
| `Reflect.get(target, key, receiver)`            | 获取属性值       | `get`                      |
| `Reflect.set(target, key, value, receiver)`     | 设置属性值       | `set`                      |
| `Reflect.has(target, key)`                      | 检查属性是否存在    | `has`                      |
| `Reflect.deleteProperty(target, key)`           | 删除属性        | `deleteProperty`           |
| `Reflect.ownKeys(target)`                       | 获取所有键       | `ownKeys`                  |
| `Reflect.defineProperty(target, key, desc)`     | 定义属性        | `defineProperty`           |
| `Reflect.getOwnPropertyDescriptor(target, key)` | 获取属性描述符     | `getOwnPropertyDescriptor` |
| `Reflect.preventExtensions(target)`             | 禁止扩展对象      | `preventExtensions`        |
| `Reflect.isExtensible(target)`                  | 判断是否可扩展     | `isExtensible`             |
| `Reflect.setPrototypeOf(target, proto)`         | 设置原型        | `setPrototypeOf`           |
| `Reflect.getPrototypeOf(target)`                | 获取原型        | `getPrototypeOf`           |
| `Reflect.apply(target, thisArg, args)`          | 调用函数        | `apply`                    |
| `Reflect.construct(target, args)`               | 模拟 `new` 调用 | `construct`                |

---

## 💡 使用 Reflect 的优势

✅ **更安全**：不会像 `delete` 抛异常，而是返回 `true/false`
✅ **更语义化**：`Reflect.set()` 比 `obj[prop] = val` 更直观
✅ **配合 Proxy**：可保持原始行为不变（最常用）

---

### ✅ 示例 1：安全调用属性

```js
const obj = { name: 'Tom' };
Reflect.set(obj, 'age', 20);
console.log(Reflect.get(obj, 'age')); // 20
console.log(Reflect.has(obj, 'name')); // true
```

---

### ✅ 示例 2：防止 `delete` 报错

```js
const obj = Object.freeze({ name: 'AI' });
console.log(Reflect.deleteProperty(obj, 'name')); // false（不报错）
```

---

### ✅ 示例 3：模拟 new 操作

```js
function User(name) { this.name = name; }
const user = Reflect.construct(User, ['Alice']);
console.log(user.name); // Alice
```

---

### ✅ 示例 4：Proxy 中正确使用 Reflect

> 这是最推荐的实践方式

```js
const obj = { name: 'Tom', age: 20 };

const proxy = new Proxy(obj, {
  get(target, key, receiver) {
    console.log('读取', key);
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    console.log('设置', key, '=', value);
    return Reflect.set(target, key, value, receiver);
  }
});

proxy.name; // 读取 name
proxy.age = 25; // 设置 age = 25
```

这样就不会破坏原有逻辑，安全又语义清晰。

---

# ⚙️ 三、Proxy + Reflect 组合应用场景

| 场景         | 示例                                |
| ---------- | --------------------------------- |
| Vue3 响应式系统 | 利用 Proxy 拦截 get/set，Reflect 执行原操作 |
| 数据验证       | set 时检查类型                         |
| 访问控制       | 拦截 get，屏蔽私有属性                     |
| 日志调试       | 在 get/set 时打印访问日志                 |
| 数据劫持       | 拦截对象操作用于埋点或上报                     |
| Mock 数据    | 拦截未定义字段返回默认值                      |

---

# 🧠 四、经典面试题

| 面试题                                  | 要点                                                     |
| ------------------------------------ | ------------------------------------------------------ |
| Proxy 和 Object.defineProperty 的区别？   | Proxy 可拦截更多操作、可代理整个对象、返回新对象；`defineProperty` 只能劫持单个属性。 |
| Reflect 有什么作用？                       | 统一底层对象操作接口、避免抛异常、与 Proxy 搭配保持默认行为。                     |
| Proxy 能否代理数组？                        | ✅ 可以，常用于拦截数组 push/pop 等操作。                             |
| 为什么 Vue3 用 Proxy 而不是 defineProperty？ | Proxy 性能更好，支持深层嵌套对象、可动态添加属性。                           |
| Proxy 的 receiver 参数作用？               | 表示代理对象自身，可解决继承中 `this` 指向问题。                           |
| Proxy 能否代理函数？                        | ✅ 可以，通过 `apply` 拦截函数调用。                                |

---

# 🧭 五、知识结构图（总结）

```
Proxy（代理）
 ├── 构造：new Proxy(target, handler)
 ├── handler 中的 trap（13 种）
 │    ├── get/set
 │    ├── apply/construct
 │    ├── has/deleteProperty
 │    └── ...
 └── 常用应用：响应式、拦截、校验、日志

Reflect（反射）
 ├── 提供与 Proxy 对应的 API
 ├── 所有方法返回 true/false，不抛异常
 ├── 常与 Proxy 配合，执行默认操作
 └── 类似 Object/Function 的安全替代
```

---

是否希望我下一步帮你画一张「**Proxy + Reflect 在 Vue3 响应式系统中的执行流程图**」，让你理解它们在实际框架中的应用？
