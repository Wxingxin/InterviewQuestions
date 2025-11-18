> ### ES6 课程概述
> <font color=red> ECMAScript、JavaScript、NodeJs， 它们的区别是什么? </font>

- **ECMAScript**：简称 ES，是一个语言标准（循环、判断、变量、数组等数据类型
- **JavaScript**：运行在浏览器端的语言，该语言使用 Es 标准。 ES + web api = JavaScript
- **NodeJs**：运行在服务器端的语言，该语言使用 Es 标准。 ES + node api = JavaScript

# 💯💯💯 数据类型检测的方式有哪些

## 7种原始类型（Number、String、Boolean、BigInt、Symbol、Null、Undefined）和1种对象类型（Object）

> ## ✅ **1. `typeof` —— 基础类型检测**

### 使用方法
```js
//1
typeof operand


//2
typeof(operand)
```


### ✔️ 1. 基本类型

```js
typeof 123         // "number"
typeof NaN         // "number"
typeof Infinity    // "number"
typeof 'Hello'     // "string"
typeof true        // "boolean"
typeof undefined   // "undefined"
typeof Symbol()    // "symbol"
typeof 123n        // "bigint"
```

---

### ✔️ 2. 特殊对象

```js
typeof null        // "object"   (历史遗留 bug)
typeof []          // "object"
typeof {}          // "object"
typeof new Date()  // "object"
typeof /abc/       // "object"
typeof new Map()   // "object"
typeof new Set()   // "object"
```

---

### ✔️ 3. 函数及可调用对象

```js
typeof function(){}       // "function"
typeof class A{}          // "function"
typeof () => {}           // "function"
typeof Math.sin           // "function"
```

> 注意：**class 本质上也是函数**。

---

### ✔️ 4. 未声明变量

```js
typeof foo    // "undefined" （不会报错）
```

### typeof 的缺陷与坑点（务必注意）

#### ❌ 1. 无法区分对象类型

```js
typeof []   // "object"
typeof {}   // "object"
typeof null // "object"
```

> 不能用来判断数组、日期、正则等。

---

#### ❌ 2. 对 null 返回 `"object"`（JS 历史 bug）

这是 JS 最臭名昭著的“语言八大坑”之一。

---

#### ❌ 3. `typeof NaN` 返回 `"number"`

```js
typeof NaN  // "number"
```

判断 NaN 应使用 `Number.isNaN()`。

---

#### ❌ 4. 所有 class 都返回 `"function"`

```js
class A{}
typeof A   // "function"
```


> ## ✅ **2. `instanceof` —— 判断是否由某构造函数生成**

```js
[] instanceof Array        // true
{} instanceof Object       // true
new Date() instanceof Date // true
```

### ✅ 优点
✔ 可判断复杂对象（Array、Date、RegExp 等）
### ❌ 缺点
- ❌ 不能判断基本类型
- ❌ 跨 iframe / 跨 window 失效

```js
123 instanceof Number // false （基本类型不是实例）
```

---

## ✅ **3. `Object.prototype.toString.call()` —— 最精准通用方案**

```js
Object.prototype.toString.call(123)        // "[object Number]"
Object.prototype.toString.call("abc")      // "[object String]"
Object.prototype.toString.call(null)       // "[object Null]"
Object.prototype.toString.call(undefined)  // "[object Undefined]"
Object.prototype.toString.call([])         // "[object Array]"
Object.prototype.toString.call({})         // "[object Object]"
Object.prototype.toString.call(/\d/)       // "[object RegExp]"
Object.prototype.toString.call(new Date()) // "[object Date]"
```

✅ **最准确的类型检测方式（面试必背）**
✔ 支持所有类型
✔ 解决 typeof & instanceof 的缺陷


---

## ✅ **4. `Array.isArray()` —— 专门判断数组**

```js
Array.isArray([])     // true
Array.isArray({})     // false
```

✔ 比 `instanceof` 更靠谱
✔ 跨 iframe/window 也能正确判断

---

## ✅ **5. `constructor` 检测构造器**

```js
(123).constructor === Number      // true
"abc".constructor === String      // true
[].constructor === Array          // true
({}).constructor === Object       // true
```

❌ 缺点：构造器可被修改，不安全

```js
function A(){}
A.prototype.constructor = B;
(new A()).constructor === A // false
```

---

## ✅ **6. `Array.of()` / `Array.from()` 区分类数组与数组**

```js
Array.from({ length: 2 }) // [undefined, undefined] 说明是类数组
```

---

## ✅ **7. `isFinite` / `isNaN` 检测数值类型**

```js
isNaN(NaN) // true
isFinite(123) // true
isFinite(Infinity) // false
```

---

## ✅ **8. `Number.isNaN` / `Number.isFinite` 更安全**

```js
Number.isNaN('abc') // false ✅
isNaN('abc')        // true ❌ 会先转换类型
```

---

## ✅ **9. `Symbol.toStringTag` 自定义类型名**

某些对象自己会返回定制结果：

```js
class A {
  get [Symbol.toStringTag]() {
    return 'MyClass';
  }
}
Object.prototype.toString.call(new A()) // "[object MyClass]"
```

---

## ✅ 最推荐的标准方案

| 目标                | 方法                                   |
| ----------------- | ------------------------------------ |
| 判断基础类型            | `typeof`                             |
| 判断对象、数组、正则、Date 等 | ✅ `Object.prototype.toString.call()` |
| 判断数组              | ✅ `Array.isArray()`                  |
| 判断是否某类实例          | `instanceof`                         |


## 💯💯💯 封装一个通用函数：

```js
function getType(val) {
  if(value === null) return "Null"
  if(value === undefined) return "Undefined"
  return Object.prototype.toString.call(val).slice(8, -1).toLowerCase();
}

getType([])         // 'array'
getType(null)       // 'null'
getType(new Set())  // 'set'
```


# 💯💯💯 OTHER

> ## 1️⃣ `typeof null === 'object'`

```js
console.log(typeof null); // "object"
```

### ❓ 看起来为什么怪：

`null` 不是对象，为什么返回 `'object'`？

### 💡 原理解释：

JS 的 `typeof` 是基于**值的二进制表示**来判断的。
在早期设计中，JS 使用前 3 位来标识类型：

- 对象的标识是 `000`
- 而 `null` 的底层二进制表示也是 `000000`
  👉 所以被错误识别成 `object`，这是 **历史遗留 Bug**。

---

> ## 2️⃣ `[] == ![]`

```js
console.log([] == ![]); // true
```

### ❓ 看起来为什么怪：

两个看似完全不同的值怎么会相等？

### 💡 原理解释（隐式类型转换）：

1. `![]` → `false`（因为空数组是 truthy，取反得 false）
2. `[] == false`
3. `[]` 转成原始值：`[].toString()` → `""`
4. `"" == false` → `Number("") == Number(false)` → `0 == 0`
   ✅ 最终为 true！

---

> ## 3️⃣ `NaN !== NaN`

```js
console.log(NaN === NaN); // false
```

### 💡 原理解释：

根据 IEEE 754 浮点数标准：

> NaN 与任何值都不相等，包括它自己。

所以：

```js
Number.isNaN(NaN); // true ✅
NaN === NaN; // false ❌
```

---

> ## 4️⃣ `[] + {} = "[object Object]"` 与 `{} + [] = 0`

```js
console.log([] + {}); // "[object Object]"
console.log({} + []); // 0
```

### 💡 原理解释：

- 表达式 1：`[] + {}`
  → `[].toString()` = `""`
  → `{}.toString()` = `"[object Object]"`
  → 结果 `" [object Object]"`

- 表达式 2：`{} + []`

  - 因为 `{}` 在行首，会被解析为 **空代码块**；
  - 所以剩下的其实是 `+[]`；
  - `+[]` → `0`
    ✅ 结果是 `0`

---

> ## 5️⃣ `0.1 + 0.2 !== 0.3`

```js
console.log(0.1 + 0.2 === 0.3); // false
```

### 💡 原理解释：

JS 使用 IEEE 754 双精度浮点数，
0.1 和 0.2 的二进制表示是无限循环的，存储时被截断。

```js
0.1 + 0.2 = 0.30000000000000004
```

✅ 解决：

```js
Number((0.1 + 0.2).toFixed(10)) === 0.3; // true
```

---

> ## 6️⃣ `"b" + "a" + +"a" + "a"`

```js
console.log("b" + "a" + +"a" + "a"); // "baNaNa"
```

### 💡 原理解释：

- `"b" + "a"` = `"ba"`
- `+"a"` = `NaN`（一元加号尝试把 "a" 转成数字失败）
- `"ba" + NaN + "a"` = `"baNaNa"`

🍌 输出："baNaNa"

---

> ## 7️⃣ `{} == {}`

```js
console.log({} == {}); // false
console.log([] == []); // false
```

### 💡 原理解释：

对象比较的是**引用地址**而不是内容。
两个字面量对象在堆内存中地址不同。

---

> ## 8️⃣ `parseInt('08') === 8`？不一定！

```js
console.log(parseInt("08")); // 8 (现代浏览器)
```

但早期 ECMAScript 规定：

- 以 `0` 开头的数字默认八进制。
- 所以 `parseInt('08')` → `0`（老版本）

✅ 安全写法：

```js
parseInt("08", 10); // 明确指定十进制
```

---

> ## 9️⃣ `a == 1 && a == 2 && a == 3`

```js
let a = {
  value: 0,
  valueOf() {
    return ++this.value;
  },
};

console.log(a == 1 && a == 2 && a == 3); // true
```

### 💡 原理解释：

每次比较时会调用 `a.valueOf()`，每次返回不同的数字。
👉 经典面试陷阱题！

---

> ## 🔟 `setTimeout(() => console.log(1), 0); console.log(2);`

```js
setTimeout(() => console.log(1), 0);
console.log(2);
```

输出：

```
2
1
```

### 💡 原理解释：

JS 是**单线程**的：

- `setTimeout` 回调放入 **任务队列**
- 主线程先执行同步代码
- 再执行异步任务
  ✅ 事件循环机制。

---

> ## 1️⃣1️⃣ `const obj = { a: 1 }; obj.a = 2;`

```js
const obj = { a: 1 };
obj.a = 2;
console.log(obj.a); // 2
```

### 💡 原理解释：

`const` 只是保证 **变量绑定** 不可修改，
对象的内部属性仍然可以改。

✅ 真正冻结：

```js
Object.freeze(obj);
```

---

> ## 1️⃣2️⃣ `['1', '2', '3'].map(parseInt)`

```js
console.log(["1", "2", "3"].map(parseInt)); // [1, NaN, NaN]
```

### 💡 原理解释：

`map` 传入的回调有三个参数 `(value, index, array)`，
而 `parseInt(str, radix)` 的第二个参数是进制。

于是相当于：

```js
parseInt("1", 0); // 1
parseInt("2", 1); // NaN
parseInt("3", 2); // NaN
```

✅ 正确写法：

```js
["1", "2", "3"].map((x) => parseInt(x));
```

---

> ## 1️⃣3️⃣ `[] == 0` 与 `![] == 0`

```js
console.log([] == 0); // true
console.log(![] == 0); // true
```

### 💡 原理解释：

1. `[] == 0`

   - `[].toString()` → `""`
   - `Number("")` → `0`

2. `![]` → `false`

   - `false == 0` → `true`

---

> ## 1️⃣4️⃣ `var a = (b = 3);`

```js
var a = (b = 3);
console.log(a); // 3
console.log(b); // 3
```

### 💡 原理解释：

`b = 3` 先执行，若 b 未声明，则自动变成 **全局变量**（非严格模式）。
`a` 则是 `var` 声明的局部变量。

---

> ## 1️⃣5️⃣ `function foo() { return } console.log(foo());`

```js
function foo() {
  return;
  {
    name: "js";
  }
}
console.log(foo()); // undefined
```

### 💡 原理解释：

JS 的**自动分号插入机制**
在 `return` 后自动补了分号。

正确写法：

```js
return {
  name: "js",
};
```

---

