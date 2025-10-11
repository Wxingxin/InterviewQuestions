非常好 👍，`手写 Array.prototype.map` 是 JavaScript 手写题中最常见的一道。
我们来一步步讲清楚：它的**原理、实现、对比与优化版本**。

---

## 🧠 一、`map` 是什么？

`Array.prototype.map()` 会：

* 对数组的每个元素执行一个回调函数；
* 返回一个 **新数组**（不会修改原数组）；
* 回调函数接收三个参数：
  `(currentValue, index, array)`。

示例：

```js
const arr = [1, 2, 3];
const res = arr.map((x, i) => x * 2);
console.log(res); // [2, 4, 6]
```

---

## 🧩 二、最基本手写实现

```js
Array.prototype.myMap = function (callback, thisArg) {
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  const result = [];
  const arr = this;

  for (let i = 0; i < arr.length; i++) {
    // 判断是否存在该索引（跳过空位）
    if (i in arr) {
      result[i] = callback.call(thisArg, arr[i], i, arr);
    }
  }

  return result;
};
```

✅ 使用示例：

```js
const arr = [1, 2, 3];
const res = arr.myMap((item, index) => item * index);
console.log(res); // [0, 2, 6]
```

---

## 🧩 三、关键点讲解

| 特性       | 说明                            |
| -------- | ----------------------------- |
| 不改变原数组   | `map()` 总是返回新数组               |
| 跳过空位     | `[1, , 3].map(...)` 只会遍历有值的元素 |
| 可绑定 this | 第二个参数 `thisArg` 会作为回调的 this   |
| 不处理稀疏数组  | 不会填充空元素                       |

---

## ⚙️ 四、测试稀疏数组情况

```js
const arr = [1, , 3];
const res = arr.myMap(x => x * 2);
console.log(res); // [2, empty, 6]
```

---

## 🔥 五、进阶版本（支持类数组）

有时我们想让 `myMap` 能处理伪数组对象，比如 `arguments`、`NodeList`：

```js
function mapLike(arrayLike, callback, thisArg) {
  const arr = Array.prototype.slice.call(arrayLike);
  const result = [];

  for (let i = 0; i < arr.length; i++) {
    if (i in arr) {
      result[i] = callback.call(thisArg, arr[i], i, arr);
    }
  }

  return result;
}
```

✅ 示例：

```js
function test() {
  return mapLike(arguments, x => x * 2);
}
console.log(test(1, 2, 3)); // [2, 4, 6]
```

---

## 🧩 六、简短箭头函数写法（不建议面试用）

```js
Array.prototype.myMap = function (fn, thisArg) {
  return this.reduce((acc, cur, i, arr) => {
    acc[i] = fn.call(thisArg, cur, i, arr);
    return acc;
  }, []);
};
```

---

## 💡 七、常见面试延伸题

| 面试题               | 解答方向                                                 |
| ----------------- | ---------------------------------------------------- |
| map 会改变原数组吗？      | 不会，返回新数组。                                            |
| map 能中途终止吗？       | 不能（不像 forEach 可以用 return），可用 `some` 或 `for...of` 替代。 |
| map 和 forEach 区别？ | forEach 无返回值，map 返回新数组。                              |
| 如何实现 map？         | 用 for 或 reduce 遍历数组，执行回调。                            |

---

是否希望我接着帮你写一个 **`手写 filter`（带空位处理 + this 绑定）**？
👉 它和 map 逻辑相似，但更注重条件筛选，是很多笔试题的“连环题”。
