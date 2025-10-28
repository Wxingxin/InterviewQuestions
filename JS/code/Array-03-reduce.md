## 🧠 一、`reduce` 是什么？

`Array.prototype.reduce()` 会对数组中的每个元素依次执行一个回调函数，将其**累计处理**成一个结果。

语法：

```js
arr.reduce(callback(accumulator, currentValue, index, array), initialValue);
```

参数解释：

| 参数           | 说明                         |
| -------------- | ---------------------------- |
| `callback`     | 每次执行的函数               |
| `accumulator`  | 累加器（上一次回调的返回值） |
| `currentValue` | 当前元素的值                 |
| `index`        | 当前索引                     |
| `array`        | 原数组                       |
| `initialValue` | 初始值（可选）               |

---

## ✅ 二、使用示例

```js
const arr = [1, 2, 3, 4];
const sum = arr.reduce((acc, cur) => acc + cur, 0);
console.log(sum); // 10
```

---

## 🧩 三、核心逻辑（手写实现）

```js
Array.prototype.myReduce = function (callback, initialValue) {
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  const arr = this;
  let accumulator;
  let startIndex = 0;

  // 判断是否传入初始值
  if (arguments.length > 1) {
    accumulator = initialValue;
  } else {
    // 如果数组为空且没有初始值，抛错
    if (arr.length === 0) {
      throw new TypeError("Reduce of empty array with no initial value");
    }
    accumulator = arr[0];
    startIndex = 1;
  }

  for (let i = startIndex; i < arr.length; i++) {
    if (i in arr) {
      accumulator = callback(accumulator, arr[i], i, arr);
    }
  }

  return accumulator;
};
```

---

## 🧪 四、测试用例

```js
const arr = [1, 2, 3, 4];

// ✅ 有初始值
console.log(arr.myReduce((acc, cur) => acc + cur, 10)); // 20

// ✅ 无初始值
console.log(arr.myReduce((acc, cur) => acc + cur)); // 10

// ✅ 稀疏数组（跳过空位）
console.log([1, , 3].myReduce((acc, cur) => acc + cur)); // 4
```

---

## ⚙️ 五、核心细节讲解

| 机制        | 说明                                             |
| ----------- | ------------------------------------------------ |
| 初始值判断  | 若没传 initialValue，则用第一个元素作为初始值    |
| 空数组报错  | 若数组为空且没传初始值 → 抛出 TypeError          |
| 跳过空位    | 和 map 一样，稀疏数组的空位会被跳过              |
| this 不参与 | reduce 不关心 thisArg，作用域取决于箭头/普通函数 |

---

## 🧩 六、进阶写法（基于 while）

更贴近引擎优化逻辑：

```js
Array.prototype.myReduce = function (callback, initialValue) {
  const arr = Object(this);
  const len = arr.length >>> 0; // 转为无符号整数

  let i = 0;
  let accumulator = initialValue;

  if (accumulator === undefined) {
    while (i < len && !(i in arr)) i++; // 找到第一个有效索引
    if (i >= len)
      throw new TypeError("Reduce of empty array with no initial value");
    accumulator = arr[i++];
  }

  while (i < len) {
    if (i in arr) accumulator = callback(accumulator, arr[i], i, arr);
    i++;
  }

  return accumulator;
};
```

---

## 💡 七、经典应用题（常考！）

| 应用场景   | 实现思路                                                  |     |                    |
| ---------- | --------------------------------------------------------- | --- | ------------------ |
| 数组求和   | `arr.reduce((a, b) => a + b, 0)`                          |     |                    |
| 数组扁平化 | `arr.reduce((a, b) => a.concat(b), [])`                   |     |                    |
| 数组计数   | `arr.reduce((obj, cur) => (obj[cur] = (obj[cur]           |     | 0) + 1, obj), {})` |
| 去重       | `arr.reduce((a, b) => a.includes(b) ? a : [...a, b], [])` |     |                    |
| 转对象     | `arr.reduce((obj, [k, v]) => (obj[k] = v, obj), {})`      |     |                    |

---

## 🚀 八、思考题（高频面试延伸）

1. `reduce` 能中途停止吗？
   ❌ 不能，只能用 `for...of`、`some` 模拟提前退出。

2. `reduceRight` 和 `reduce` 的区别？
   👉 从右到左遍历。

3. `reduce` 能实现 `map`、`filter` 吗？
   ✅ 能，核心是通过回调函数返回不同结果。

# 代码解释

这段代码是对 **`Array.prototype.reduce()`** 方法的手写实现（叫 `myReduce`），我们来**逐行详细讲解**它的逻辑👇

---

### ✅ 一、函数定义

```js
Array.prototype.myReduce = function (callback, initialValue) {
```

👉 给数组的原型对象 `Array.prototype` 添加一个自定义方法 `myReduce`。
这样所有数组实例都可以调用 `arr.myReduce(...)`。

它接受两个参数：

1. `callback`：每次迭代要执行的回调函数；
2. `initialValue`（可选）：初始累加值。

---

### ✅ 二、类型检查

```js
if (typeof callback !== "function") {
  throw new TypeError(callback + " is not a function");
}
```

👉 检查 `callback` 是否是函数，如果不是，就抛出错误。
这与原生 `reduce` 的行为一致。

---

### ✅ 三、初始化变量

```js
const arr = this;
let accumulator;
let startIndex = 0;
```

* `arr`：当前调用 `myReduce` 的数组（比如 `[1,2,3]`）。
* `accumulator`：累加器，用来存储每次计算后的结果。
* `startIndex`：循环起始位置。

---

### ✅ 四、判断是否传入初始值

```js
if (arguments.length > 1) {
  accumulator = initialValue;
} else {
  if (arr.length === 0) {
    throw new TypeError("Reduce of empty array with no initial value");
  }
  accumulator = arr[0];
  startIndex = 1;
}
```

#### 📘 情况 1：传入初始值

* 如果有传 `initialValue`，就直接让 `accumulator = initialValue`；
* 从数组第 **0 个元素** 开始遍历。

#### 📕 情况 2：没传初始值

* 如果数组是空的，就报错；
* 否则把数组的第一个元素当成初始值；
* 并且从第二个元素（索引 1）开始循环。

这与原生 `reduce()` 的行为完全一致。

---

### ✅ 五、核心循环逻辑

```js
for (let i = startIndex; i < arr.length; i++) {
  if (i in arr) {
    accumulator = callback(accumulator, arr[i], i, arr);
  }
}
```

循环遍历数组的每个元素：

* `if (i in arr)` 这一句是为了防止**稀疏数组**（即数组中有空位），跳过不存在的索引；
* 调用 `callback(accumulator, arr[i], i, arr)`；

  * `accumulator`：上一次回调的返回值（或初始值）；
  * `arr[i]`：当前元素；
  * `i`：当前索引；
  * `arr`：原数组本身；
* 将回调结果重新赋给 `accumulator`。

---

### ✅ 六、返回结果

```js
return accumulator;
```

最后返回累加器 `accumulator`，即最终的计算结果。

---

### ✅ 七、举个例子理解

```js
const arr = [1, 2, 3, 4];
const sum = arr.myReduce((acc, cur) => acc + cur, 0);
console.log(sum); // 输出 10
```

👉 执行过程：

| 迭代次数 | acc（累加器） | cur（当前值） | 结果 |
| ---- | -------- | -------- | -- |
| 初始值  | 0        | —        | —  |
| 第1次  | 0        | 1        | 1  |
| 第2次  | 1        | 2        | 3  |
| 第3次  | 3        | 3        | 6  |
| 第4次  | 6        | 4        | 10 |

最终返回 `10`。

---

### ✅ 八、总结要点

| 步骤  | 功能                  |
| --- | ------------------- |
| 1️⃣ | 检查 `callback` 是否是函数 |
| 2️⃣ | 处理是否有初始值的情况         |
| 3️⃣ | 遍历数组调用回调函数          |
| 4️⃣ | 跳过空位元素              |
| 5️⃣ | 返回最终累积结果            |
