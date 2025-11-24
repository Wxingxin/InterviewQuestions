# 🧠 JS 手写 `reduce` —— 全知识点大全

## 1. reduce 的核心概念（必须掌握）

### reduce(callback, initialValue) 的行为：

* 遍历数组
* 每次执行 callback(accumulator, currentValue, index, array)
* 返回最终累加结果
* 可选的 initialValue 决定起始值
* **没有 initialValue 时的行为复杂，是 reduce 的考核重点**

---

# 2. reduce 的完整调用特性（要背）

## ✔ callback 参数：

```
accumulator（累计值）
currentValue（当前值）
index（当前索引）
array（原数组）
```

## ✔ 返回值：

* callback 的返回值作为 accumulator 进入下一次循环
* 最终返回 accumulator

---

# 3. reduce 的异常 & 边界行为（面试必考）

### ❗（1）数组为空且无 initialValue → 抛错 TypeError

```js
[].reduce((a, b) => a + b); // ❌ TypeError
```

### ✔（2）数组为空但有 initialValue → 返回 initialValue

```js
[].reduce((a, b) => a + b, 10); // ✔ 10
```

### ✔（3）无 initialValue 时：

acc = 第一个非空元素
从下一个非空元素开始遍历

---

# 4. reduce 对稀疏数组（holes）的处理

原生 reduce 会跳过空位：

```js
[1, , 3].reduce((a, b) => a + b); // 4
```

---

# 5. reduce 的最简版本（入门）

```js
Array.prototype.myReduce = function (fn, initial) {
  let acc = initial;
  let start = 0;

  if (acc === undefined) {
    acc = this[0];
    start = 1;
  }

  for (let i = start; i < this.length; i++) {
    acc = fn(acc, this[i], i, this);
  }

  return acc;
};
```

⚠ 不支持稀疏数组、未处理各种边界，仅适合入门理解。

---

# 6. **完整版 reduce（100%还原原生行为，面试必杀版）**

```js
Array.prototype.myReduce = function(callback, initialValue) {
  if (this == null) {
    throw new TypeError("Cannot read property 'reduce' of null or undefined");
  }
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  const O = Object(this);
  const len = O.length >>> 0;

  let k = 0;
  let accumulator;

  // 判断 initialValue 是否提供
  if (arguments.length > 1) {
    accumulator = initialValue;
  } else {
    // 无初始值则找到第一个存在的索引作为初始 accumulator
    while (k < len && !(k in O)) {
      k++;
    }
    if (k >= len) {
      throw new TypeError("Reduce of empty array with no initial value");
    }
    accumulator = O[k++];
  }

  // 开始遍历
  while (k < len) {
    if (k in O) {
      accumulator = callback(accumulator, O[k], k, O);
    }
    k++;
  }

  return accumulator;
};
```

---

# 7. reduce 的所有完整知识点（总结表）

| 知识点       | reduce 行为                                               |
| --------- | ------------------------------------------------------- |
| 初始值规则     | 有 initialValue → accumulator = initialValue；否则 → 找第一项赋值 |
| 空数组行为     | 无初值 → 抛错；有初值 → 返回初值                                     |
| 稀疏数组处理    | 跳过 holes                                                |
| 回调参数      | acc, val, index, array                                  |
| 类型检查      | callback 不是函数必须抛错                                       |
| this 不能为空 | this 为 null/undefined 抛错                                |
| 类数组支持     | 如 `{0:1,1:2,length:2}`, 用 `Object(this)`                |
| 遍历顺序      | 从左到右（reduceRight 是反向）                                   |
| 返回值       | 最终 accumulator                                          |

---

# 8. reduce 的常见面试技巧

## ✔ 用 reduce 做数组求和

```js
[1,2,3].reduce((a,b)=>a+b) // 6
```

## ✔ 用 reduce 实现 map

```js
const myMap = (arr, fn) =>
  arr.reduce((res, val, i, arr) => {
    res.push(fn(val, i, arr));
    return res;
  }, []);
```

## ✔ 用 reduce 实现 flat

```js
const flat = arr =>
  arr.reduce((res, v) => res.concat(Array.isArray(v) ? flat(v) : v), []);
```

## ✔ 用 reduce 实现 groupBy

```js
const groupBy = (arr, keyFn) =>
  arr.reduce((res, item) => {
    const key = keyFn(item);
    (res[key] ||= []).push(item);
    return res;
  }, {});
```

---

# 9. reduce 面试的重点考核点（按频率排序）

1. **实现 reduce（完整版）**
2. **initialValue 未提供时的处理逻辑**
3. **稀疏数组 holes 的跳过**
4. **空数组 + 无初始值 抛错**
5. **类数组支持**
6. **严格的类型检查**
7. **对复杂逻辑题用 reduce 解题（递归/扁平/组合）**

---

# 10. reduce vs reduceRight

* reduce：从左向右
* reduceRight：从右往左

其余行为一致。

---

# 📚 一句话总览 reduce

> **reduce 的核心是：accumulator 的初始化规则 + 跳过 holes + 类型检查 + 类数组兼容 + 从左到右累积。**
