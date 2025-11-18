> # 什么是浅拷贝（Shallow Copy）

## 浅拷贝：

> 只复制对象的**第一层属性**，如果属性值是引用类型（对象、数组），则只复制引用地址。

换句话说，浅拷贝后的对象会与原对象**共享内部嵌套对象**。

### ✅ 示例

```js
const obj1 = {
  name: "Tom",
  info: { age: 20 },
};

const obj2 = { ...obj1 }; // 或 Object.assign({}, obj1)

obj2.name = "Jerry";
obj2.info.age = 30;

console.log(obj1.name); // "Tom"
console.log(obj1.info.age); // ⚠️ 30，被修改了！
```

> 解释：`obj2.info` 和 `obj1.info` 指向同一个内存地址。

---

### 🌕 二、浅拷贝的常见实现方法

| 方法                          | 示例                                      |
| ----------------------------- | ----------------------------------------- |
| 展开运算符                    | `let newObj = { ...oldObj };`             |
| `Object.assign()`             | `let newObj = Object.assign({}, oldObj);` |
| 数组的 `slice()` / `concat()` | `let newArr = arr.slice();`               |
| Lodash 的 `_.clone()`         | `_.clone(obj)`                            |

> # 深拷贝：

深拷贝：

> 不仅复制对象的第一层属性，还会**递归复制所有子对象**，让新对象和原对象完全独立。

### ✅ 示例

```js
const obj1 = {
  name: "Tom",
  info: { age: 20 },
};

const obj2 = JSON.parse(JSON.stringify(obj1)); // 深拷贝

obj2.info.age = 30;
console.log(obj1.info.age); // ✅ 20，没被影响
```

非常好的问题 👍，这是前端面试和工程实践里经常考察的重点：
**“不同深拷贝方法的优劣与适用场景”**。

我们来系统、清晰地对比一下各种深拷贝实现方式 👇

---

## 🌕 一、`JSON.parse(JSON.stringify(obj))`

### ✅ 优点

1. ✅ 简单、易写、易懂（1 行搞定）
2. ✅ 性能还可以（适合中小对象）
3. ✅ 纯数据对象（只包含数字、字符串、布尔值、数组、普通对象）可完美复制

### ❌ 缺点

1. ❌ 无法拷贝：

   - `undefined`
   - `function`
   - `Symbol`
   - `Map`、`Set`
   - `Date`、`RegExp`
   - `BigInt`

2. ❌ 会丢失对象原型（`__proto__`）
3. ❌ 无法处理循环引用（会报错 `Converting circular structure to JSON`）

### ⚙️ 适用场景

> ✅ 用于 **纯 JSON 对象**（无函数、无循环引用）
> 例如从接口获取的数据结构。

---

## 🌕 二、递归实现深拷贝（自定义）

### ✅ 优点

1. ✅ 可控制复制逻辑，能拷贝大部分类型（`Array`、`Object`、`Date`、`RegExp` 等）
2. ✅ 可通过 `WeakMap` 解决循环引用问题
3. ✅ 可以保留原型（高级版）

### ❌ 缺点

1. ❌ 手写复杂（要考虑各种类型）
2. ❌ 性能较差（大量递归与内存占用）
3. ❌ 若写法不严谨，容易栈溢出（深层嵌套对象）

### ⚙️ 适用场景

> ✅ 需要完全控制拷贝逻辑、支持循环引用、较复杂数据结构时。
> 例如在框架底层或工具库中使用。

---

## 🌕 三、`structuredClone(obj)`（✅ 推荐现代方式）

### ✅ 优点

1. ✅ 原生支持（浏览器 + Node.js ≥17）
2. ✅ 自动处理循环引用
3. ✅ 支持更多类型：

   - `Map`
   - `Set`
   - `Date`
   - `RegExp`
   - `ArrayBuffer` / `TypedArray`

4. ✅ 比 JSON 方式更安全、更快

### ❌ 缺点

1. ❌ 不支持：

   - `function`
   - `Symbol`
   - 对象原型（原型丢失）

2. ❌ 兼容性（老浏览器不支持）

### ⚙️ 适用场景

> ✅ 推荐在现代项目中替代 JSON 方式
> 例如 Vue3 / React18 / Node17+ 的项目环境。

---

## 🌕 四、第三方库（Lodash）

### ✅ 优点

1. ✅ `_.cloneDeep()` 功能完善，可靠稳定
2. ✅ 支持绝大多数类型（`Array`, `Object`, `Date`, `RegExp`, `Map`, `Set` 等）
3. ✅ 解决循环引用问题
4. ✅ 已在生产环境广泛验证

### ❌ 缺点

1. ❌ 体积较大（~24KB）
2. ❌ 依赖外部库

### ⚙️ 适用场景

> ✅ 工程项目中最安全通用的方案
> 如大型前端项目或 Node.js 应用。

### 引入 lodash

```bash
npm install lodash
```

```js
import _ from "lodash";
```

---

## 🌕 五、性能对比（大对象约 1 万条数据）

| 方法                       | 性能（耗时）      | 是否支持循环引用 | 支持类型丰富度 | 代码复杂度 |
| -------------------------- | ----------------- | ---------------- | -------------- | ---------- |
| JSON.parse(JSON.stringify) | 🚀 快             | ❌ 否            | 🌙 低          | ✅ 简单    |
| structuredClone            | 🚀🚀 快           | ✅ 是            | 🌕 中高        | ✅ 简单    |
| 递归自写版                 | 🐢 慢（递归消耗） | ✅ 是            | 🌕 高          | ❌ 复杂    |
| Lodash \_.cloneDeep        | 🚀 稳定           | ✅ 是            | 🌕 高          | ✅ 简单    |

---

## 🌕 六、总结建议

| 需求场景                   | 推荐方法                          |
| -------------------------- | --------------------------------- |
| 简单 JSON 数据             | ✅ `JSON.parse(JSON.stringify())` |
| 现代浏览器 / Node 环境     | ✅ `structuredClone()`            |
| 需要处理循环引用、复杂对象 | ✅ Lodash `_.cloneDeep()`         |
| 框架/底层库开发            | ✅ 手写递归 + WeakMap（可控）     |

---

## 🌈 举个实际例子

```js
const data = {
  name: "Tom",
  age: 25,
  info: {
    date: new Date(),
    reg: /abc/,
    map: new Map([["a", 1]]),
  },
};

// 1️⃣ JSON拷贝（丢失Map、Date、RegExp）
const jsonCopy = JSON.parse(JSON.stringify(data));

// 2️⃣ structuredClone拷贝（完美复制）
const structCopy = structuredClone(data);

// 3️⃣ Lodash深拷贝（完美复制）
const lodashCopy = _.cloneDeep(data);
```

---

> ### 基础版 plus

```js
function deepclone(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj; // 原始值直接返回
  }

  if (obj instanceof Date) {
    return new Date(obj); // 处理 Date
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj); // 处理正则
  }

  // 判断是数组还是对象
  let deepobj = Array.isArray(obj) ? [] : {};

  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      deepobj[key] = deepclone(obj[key]);
    }
  }

  return deepobj; // 别忘了返回
}
```

> ### 进阶 pro

```js
function deepClone(obj, hash = new WeakMap()) {
  if (obj === null) return obj;
  if (typeof obj !== "object") return obj;

  // 处理循环引用
  if (hash.has(obj)) {
    return hash.get(obj);
  }

  // 处理特殊对象类型
  if (obj instanceof Date) {
    return new Date(obj);
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  // 初始化克隆对象
  const cloneObj = Array.isArray(obj) ? [] : {};
  hash.set(obj, cloneObj);

  // 深拷贝每一项
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloneObj[key] = deepClone(obj[key], hash);
    }
  }

  return cloneObj;
}
```

> ### max

```js
function deepClone(obj, hash = new WeakMap()) {
  if (obj === null) return obj;
  if (typeof obj !== "object") return obj;

  if (hash.has(obj)) return hash.get(obj);

  let cloneObj;

  const Constructor = obj.constructor;
  switch (Constructor) {
    case Date:
      return new Date(obj);
    case RegExp:
      return new RegExp(obj);
    case Map:
      cloneObj = new Map();
      hash.set(obj, cloneObj);
      obj.forEach((value, key) => {
        cloneObj.set(key, deepClone(value, hash));
      });
      return cloneObj;
    case Set:
      cloneObj = new Set();
      hash.set(obj, cloneObj);
      obj.forEach((value) => {
        cloneObj.add(deepClone(value, hash));
      });
      return cloneObj;
  }

  cloneObj = Array.isArray(obj) ? [] : {};
  hash.set(obj, cloneObj);

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloneObj[key] = deepClone(obj[key], hash);
    }
  }

  return cloneObj;
}
```
