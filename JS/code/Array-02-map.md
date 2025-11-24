下面给你一份**「JS 手写 map 全知识点大全」**，系统、全面、好记，涵盖面试常问点、注意事项、易错点与进阶写法。

---

# 🧠 JS 手写 `map` —— 全知识点大全

## 1. **map 的核心特性（必须掌握）**

手写前要先复刻原生 `Array.prototype.map` 的行为：

### ✔ 输入：

* 一个 **回调函数** `(currentValue, index, array)`
* 可选的 `thisArg`（回调中的 this）

### ✔ 输出：

* **返回一个新数组**
* **不会修改原数组（不可变性）**

### ✔ 执行逻辑：

* 按数组下标从 0 开始遍历到 length-1
* 跳过「空位」（稀疏数组的 holes）
* 对每一项调用回调并把结果 push 到新数组
* 回调参数：

  1. **value** 当前项
  2. **index** 当前索引
  3. **array** 原数组
* 能够绑定 thisArg

### ❗ 特殊点：

* 对稀疏数组：map 会跳过不存在的元素

```js
[1, , 3].map(x => x)  // → [1, , 3]
```

---

# 2. **最基础版：最简可用 map**

（不会处理 this 和空位）

```js
Array.prototype.myMap = function (fn) {
  const res = [];
  for (let i = 0; i < this.length; i++) {
    res.push(fn(this[i], i, this));
  }
  return res;
};
```

---

# 3. **完整版：忠实模拟原生 map（面试必杀）**

### 🎯 要求：

* 处理 thisArg
* 处理稀疏数组（跳过 holes）
* 类型检查
* 不修改原数组

```js
Array.prototype.myMap = function(callback, thisArg) {
  if (this == null) {
    throw new TypeError("Cannot read property 'map' of null or undefined");
  }
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  const O = Object(this);      // 处理数组与类数组
  const len = O.length >>> 0;  // 转为无符号整数
  const result = new Array(len);

  for (let i = 0; i < len; i++) {
    if (i in O) { // 关键：跳过数组空位
      result[i] = callback.call(thisArg, O[i], i, O);
    }
  }

  return result;
};
```

---

# 4. **手写 map 的所有知识点汇总**

## ✔（1）稀疏数组 hole 的处理

原生 `map` 对空位不会执行 callback：

```js
const arr = [1, , 3];
arr.map(x => x)  // [1, , 3]
```

必须使用：

```js
if (i in O)
```

---

## ✔（2）对 this 的处理

callback 的 this 必须使用 `call`：

```js
callback.call(thisArg, value, index, array)
```

---

## ✔（3）length 转换为无符号整数

必要写法：

```js
const len = O.length >>> 0;
```

避免负数、非数字引发问题。

---

## ✔（4）数组与“类数组”的处理

原生 map 能处理：

```js
Array.prototype.map.call({0:1,1:2,length:2}, x => x * 2);
// → [2,4]
```

因此你要使用：

```js
const O = Object(this);
```

---

## ✔（5）不修改原数组

push 到新的 result，而不是 this。

---

## ✔（6）异常处理

* this 为 null/undefined → 报错
* callback 不是函数 → 报错

---

## ✔（7）返回值必须是**新数组**

不要在原数组上改数据。

---

# 5. **稀疏数组测试（面试加分项）**

```js
[1, , 3].myMap(x => x * 2);  
// 必须得到: [2, , 6]
```

---

# 6. **手写 map 的常见错误（面试容易挂）**

| 错误点          | 说明                   |
| ------------ | -------------------- |
| ❌ 未考虑空位      | 导致把空位当做 undefined 处理 |
| ❌ 忽略 thisArg | 面试官会问：“你支持 this 吗？”  |
| ❌ 改变原数组      | 原生不会                 |
| ❌ 不支持类数组     | 原生 map 是通用方法         |
| ❌ 未加入类型检查    | callback 非函数报错       |

---

# 7. **性能更优的版本（高阶提升）**

使用 `result[i] = ...` 而不是 `.push`，减少数组扩容：

```js
Array.prototype.myMap = function(callback, thisArg) {
  const O = Object(this);
  const len = O.length >>> 0;
  const result = new Array(len);

  for (let i = 0; i < len; i++) {
    if (i in O) result[i] = callback.call(thisArg, O[i], i, O);
  }

  return result;
};
```

---

# 8. **ES5 版本（如果面试要求 ES5 实现）**

```js
Array.prototype.myMap = function (callback, thisArg) {
  if (this == null) throw new TypeError('this is null or undefined');
  if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');
  
  var O = Object(this);
  var len = O.length >>> 0;
  var result = new Array(len);

  for (var i = 0; i < len; i++) {
    if (i in O) {
      result[i] = callback.call(thisArg, O[i], i, O);
    }
  }
  
  return result;
}
```

---

# 📚 总结一句话（记这个就够了）

> **手写 map = 遍历 + callback + 新数组 + 跳过空位 + 处理 this + 类型检查 + 支持类数组**

