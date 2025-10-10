在 JavaScript 中，`Set` 是 ES6 新增的一种数据结构，用于存储**唯一值**的集合。它类似于数组，但所有元素都是唯一的，且不保证顺序（遍历时按插入顺序返回）。以下是关于 `Set` 的全面知识点总结：

### **一、Set 的基本概念**

1.  **定义**：`Set` 是一个无序且唯一的数据结构，可存储任何类型的值（包括原始值和引用类型）。

2.  Set 可以存储任何 JavaScript 数据类型的值：

- **基本类型**：
- 字符串（String）
- 数字（Number）
- 布尔值（Boolean）
- null
- undefined
- Symbol
- **引用类型**：
- 对象（Object）
- 数组（Array）
- 函数（Function）
- 甚至其他 Set 或 Map 实例

3.  **特性**：

- **值的唯一性**：相同的值只会存在一个（使用 `SameValueZero` 比较，类似 `===`，但 `NaN` 被视为相同）。
- **可迭代性**：支持 `for...of`、`forEach` 等迭代方法。
- **无索引**：无法通过索引访问元素，只能通过迭代或检查值是否存在。

### **二、Set 的创建与初始化**

#### 1. 基本创建(初始化有特殊性)

```javascript
// 空 Set
const set = new Set(); //Set(0) {}

// 传入可迭代对象（如数组）初始化
const set = new Set([1, 2, 3, 2, 1]); // Set(3) { 1, 2, 3 }（自动去重）

// 使用字符串初始化（字符会被拆分为单独的值）
const set = new Set("hello"); // Set(4) { 'h', 'e', 'l', 'o' }（'l' 重复被去重）
```

#### 2. 值的唯一性验证

```javascript
const set = new Set();

// 基本类型值
set.add("字符串");
set.add(123);
set.add(true);
set.add(null);
set.add(undefined);
set.add(Symbol("symbol值"));

// 引用类型值
const obj = { id: 1 };
const arr = [1, 2, 3];
const func = () => {};
const subSet = new Set();

set.add(obj);
set.add(arr);
set.add(func);
set.add(subSet);
```

### **三、Set 的核心方法**

#### 1. 添加值：`add(value)`

- 作用：向 `Set` 中添加一个新值。
- 返回值：当前 `Set` 实例（可链式调用）。

```javascript
const set = new Set();

// 基本类型值
set.add("字符串");
set.add(123);
set.add(true);
set.add(null);
set.add(undefined);
set.add(Symbol("symbol值"));

// 引用类型值
const obj = { id: 1 };
const arr = [1, 2, 3];
const func = () => {};
const subSet = new Set();

set.add(obj);
set.add(arr);
set.add(func);
set.add(subSet);
```

#### 2. 删除值：`delete(value)`

- 作用：从 `Set` 中删除指定的值。
- 返回值：布尔值（`true` 删除成功，`false` 值不存在）。

```javascript
set.delete(2); // true
set.has(2); // false（值已被删除）
```

#### 3. 判断值是否存在：`has(value)`

- 作用：检查 `Set` 中是否包含指定的值。
- 返回值：布尔值（`true` 存在，`false` 不存在）。

```javascript
set.has(1); // true
set.has(4); // false
```

#### 4. 获取长度：`size` 属性

- 作用：返回 `Set` 中值的数量（注意是属性，不是方法，无需括号）。

```javascript
console.log(set.size); // 2（删除 2 后剩余 1 和 3）
```

#### 5. 清空所有值：`clear()`

- 作用：删除 `Set` 中所有值，无返回值。

```javascript
set.clear();
console.log(set.size); // 0
```

### **四、Set 的遍历方法**

`Set` 提供了多种遍历方式，且遍历顺序与插入顺序一致：

#### 1. `keys()`：遍历所有值（与 `values()` 相同）

```javascript
const set = new Set(["a", "b", "c"]);
for (const key of set.keys()) {
  console.log(key); // 'a' → 'b' → 'c'
}
```

#### 2. `values()`：遍历所有值（默认迭代器）

```javascript
for (const value of set.values()) {
  console.log(value); // 'a' → 'b' → 'c'
}

// 直接遍历 set（等同于 values()）
for (const value of set) {
  console.log(value);
}
```

#### 3. `entries()`：遍历所有值的键值对（为了与 `Map` 保持一致）

```javascript
for (const [key, value] of set.entries()) {
  console.log(`${key}: ${value}`); // 'a: a' → 'b: b' → 'c: c'（键和值相同）
}
```

#### 4. `forEach()`：回调函数遍历

```javascript
set.forEach((value, sameValue, set) => {
  console.log(value); // 'a' → 'b' → 'c'
  console.log(value === sameValue); // true（第一个和第二个参数相同，为了与 Map 保持一致）
});
```

### **五、Set 与数组的转换**

#### 1. Set 转数组（`Array.from()` 或扩展运算符）

```javascript
const set = new Set([1, 2, 3, 2]);
const arr1 = Array.from(set); // [1, 2, 3]
const arr2 = [...set]; // [1, 2, 3]
```

#### 2. 数组转 Set（利用 Set 去重）

```javascript
const arr = [1, 2, 2, 3, 3, 3];
const uniqueSet = new Set(arr); // Set(3) { 1, 2, 3 }
const uniqueArr = [...uniqueSet]; // [1, 2, 3]

// 一行代码实现数组去重
const unique = [...new Set(arr)];
```

### **六、Set 的常见应用场景**

#### 1. 数组去重

```javascript
const arr = [1, 2, 2, 3, "3"];
const unique = [...new Set(arr)]; // [1, 2, 3, '3']（保留类型差异）
```

#### 2. 交集、并集、差集运算

```javascript
const setA = new Set([1, 2, 3]);
const setB = new Set([3, 4, 5]);

// 并集
const union = new Set([...setA, ...setB]); // Set(5) { 1, 2, 3, 4, 5 }

// 交集
const intersection = new Set([...setA].filter((x) => setB.has(x))); // Set(1) { 3 }

// 差集（在 A 中但不在 B 中）
const difference = new Set([...setA].filter((x) => !setB.has(x))); // Set(2) { 1, 2 }
```

#### 3. 检查元素是否存在（比数组的 `includes` 更高效）

```javascript
const set = new Set(["apple", "banana", "cherry"]);
console.log(set.has("apple")); // true（时间复杂度 O(1)）

// 对比数组的 includes（时间复杂度 O(n)）
const arr = ["apple", "banana", "cherry"];
console.log(arr.includes("apple")); // true
```

#### 4. 存储 DOM 元素集合

```javascript
const elements = new Set(document.querySelectorAll("button"));
elements.forEach((btn) => btn.addEventListener("click", () => {}));
```

### **七、WeakSet**

`WeakSet` 是 `Set` 的弱引用版本，与 `Set` 的主要区别：

- **只能存储对象引用**，不能存储原始值。
- **弱引用**：如果对象的其他引用被移除，对象会被垃圾回收，`WeakSet` 中对应的条目会自动消失。
- **不可枚举**：没有 `size` 属性，不支持遍历方法（如 `keys()`、`forEach()`）。

#### 应用场景

```javascript
const weakSet = new WeakSet();
const obj = {};

weakSet.add(obj);
console.log(weakSet.has(obj)); // true

// 如果 obj 被设为 null，WeakSet 中的引用会自动消失
obj = null;
```

### **八、注意事项**

1. **值的比较规则**：`Set` 使用 `SameValueZero` 比较值，与 `===` 类似，但 `NaN` 被视为相同：

   ```javascript
   const set = new Set();
   set.add(NaN);
   set.add(NaN);
   console.log(set.size); // 1（NaN 只保留一个）
   ```

2. **对象引用问题**：与 `Map` 类似，`Set` 存储对象时比较的是引用，而非内容：

   ```javascript
   const set = new Set();
   set.add({});
   set.add({}); // 两个空对象引用不同，可以共存
   console.log(set.size); // 2
   ```

3. **性能考虑**：`Set` 在检查元素是否存在时比数组更高效（时间复杂度 O(1) vs O(n)），适合频繁查找的场景。

通过掌握 `Set` 的这些特性和用法，可以在需要存储唯一值、去重或快速查找的场景中更高效地处理数据。与 `Map` 结合使用时，还能构建更复杂的数据结构。
