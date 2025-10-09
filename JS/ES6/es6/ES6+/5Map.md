在 JavaScript 中，`Map` 是一种键值对集合的数据结构，类似于对象（`Object`），但提供了更灵活的键类型和更丰富的操作方法。以下是关于 `Map` 的全面知识点总结：

### **一、Map 的基本概念**

1.  **定义**：`Map` 是 ES6 新增的内置对象，用于存储键值对，其中**键可以是任意类型**（包括基本类型、对象、函数等），而对象的键只能是字符串或 Symbol。

2.  **键（key）的类型**

- 基本类型：字符串（String）、数字（Number）、布尔值（Boolean）、null、undefined、Symbol
- 引用类型：对象（Object）、数组（Array）、函数（Function）等
- Map 对键的比较采用严格相等（===） 标准，但有两个特殊情况：
- NaN 被视为与自身相等（即使 NaN === NaN 结果为 false）
- +0 和 -0 被视为相等

3.  **值（value）的类型与键的类型限制完全一致**

2. **特性**：

- 键的唯一性：相同的键只会保留最后一次设置的值。
- 插入顺序：`Map` 会记住键值对的插入顺序，遍历顺序与插入顺序一致。
- 可迭代性：直接支持 `for...of` 遍历，无需额外处理。

### **二、Map 的创建与初始化**

#### 1. 基本创建

```javascript
// 空 Map
const map = new Map();

// 传入可迭代对象（如数组）初始化
const map = new Map([
  ["name", "Alice"],
  [1, "number"],
  [true, "boolean"],
  [{ key: "obj" }, "object"], // 键可以是对象
]);
```

#### 2. 注意事项

- 初始化时的可迭代对象必须是**键值对数组的集合**（如 `[[key1, value1], [key2, value2]]`）。
- 对象作为键时，比较的是引用而非值：
  ```javascript
  const obj1 = { id: 1 };
  const obj2 = { id: 1 };
  const map = new Map([
    [obj1, "a"],
    [obj2, "b"],
  ]);
  console.log(map.size); // 2（obj1 和 obj2 是不同引用，视为两个键）
  ```

### **三、Map 的核心方法**

#### 1. 设置键值对：`set(key, value)`

- 作用：向 `Map` 中添加或更新键值对。
- 返回值：当前 `Map` 实例（可链式调用）。

```javascript
const map = new Map();
// 基本类型作为键
map.set("stringKey", "字符串值");
map.set(123, "数字值");
map.set(true, "布尔值");
map.set(null, "null值");
map.set(undefined, "undefined值");
map.set(Symbol("symbolKey"), "symbol值");

// 引用类型作为键
const objKey = { id: 1 };
const arrKey = [1, 2, 3];
const funcKey = () => {};

map.set(objKey, "对象作为键");
map.set(arrKey, "数组作为键");
map.set(funcKey, "函数作为键");
```

#### 2. 获取值：`get(key)`

- 作用：根据键获取对应的值。
- 返回值：存在则返回对应值，否则返回 `undefined`。

```javascript
map.get("name"); // 'Bob'
map.get("gender"); // undefined（键不存在）
```

#### 3. 判断键是否存在：`has(key)`

- 作用：检查 `Map` 中是否包含指定的键。
- 返回值：布尔值（`true` 存在，`false` 不存在）。

```javascript
map.has("age"); // true
map.has("score"); // false
```

#### 4. 删除键值对：`delete(key)`

- 作用：删除指定键对应的键值对。
- 返回值：布尔值（`true` 删除成功，`false` 键不存在）。

```javascript
map.delete("isStudent"); // true
map.has("isStudent"); // false
```

#### 5. 清空所有键值对：`clear()`

- 作用：删除 `Map` 中所有键值对，无返回值。

```javascript
map.clear();
map.size; // 0（清空后长度为 0）
```

#### 6. 获取长度：`size` 属性

- 作用：返回 `Map` 中键值对的数量（注意是属性，不是方法，无需括号）。

```javascript
const map = new Map([
  ["a", 1],
  ["b", 2],
]);
console.log(map.size); // 2
```

### **四、Map 的遍历方法**

`Map` 提供了多种遍历方式，且遍历顺序与插入顺序一致：

#### 1. `keys()`：遍历所有键

```javascript
const map = new Map([
  ["name", "Alice"],
  ["age", 20],
]);
for (const key of map.keys()) {
  console.log(key); // 'name' → 'age'
}
```

#### 2. `values()`：遍历所有值

```javascript
for (const value of map.values()) {
  console.log(value); // 'Alice' → 20
}
```

#### 3. `entries()`：遍历所有键值对（默认遍历器）

```javascript
// 方式 1：使用 entries()
for (const [key, value] of map.entries()) {
  console.log(`${key}: ${value}`); // 'name: Alice' → 'age: 20'
}

// 方式 2：直接遍历 map（等同于 entries()）
for (const [key, value] of map) {
  console.log(`${key}: ${value}`);
}
```

#### 4. `forEach()`：回调函数遍历

```javascript
map.forEach((value, key, map) => {
  console.log(`${key}: ${value}`); // 注意参数顺序：value 在前，key 在后
});
```

### **五、Map 与其他数据结构的转换**

#### 1. Map 转数组（`Array.from()` 或扩展运算符）

```javascript
const map = new Map([
  ["a", 1],
  ["b", 2],
]);

// 方式 1：Array.from()
const arr1 = Array.from(map); // [['a', 1], ['b', 2]]

// 方式 2：扩展运算符
const arr2 = [...map]; // [['a', 1], ['b', 2]]

// 仅提取键或值
const keys = [...map.keys()]; // ['a', 'b']
const values = [...map.values()]; // [1, 2]
```

#### 2. 数组转 Map

```javascript
const arr = [
  ["name", "Bob"],
  [1, "num"],
];
const map = new Map(arr);
```

#### 3. Map 转对象（键为字符串或 Symbol 时）

```javascript
function mapToObj(map) {
  const obj = {};
  for (const [key, value] of map) {
    if (typeof key === "string" || typeof key === "symbol") {
      obj[key] = value;
    }
  }
  return obj;
}

const map = new Map([
  ["name", "Alice"],
  ["age", 20],
]);
const obj = mapToObj(map); // { name: 'Alice', age: 20 }
```

#### 4. 对象转 Map

```javascript
function objToMap(obj) {
  const map = new Map();
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      map.set(key, obj[key]);
    }
  }
  return map;
}

const obj = { name: "Bob", age: 25 };
const map = objToMap(obj); // Map(2) { 'name' => 'Bob', 'age' => 25 }
```

### **六、Map 与 Object 的对比**

| **特性**   | **Map**                          | **Object**                                        |
| ---------- | -------------------------------- | ------------------------------------------------- |
| 键类型     | 任意类型（字符串、对象、函数等） | 仅字符串、Symbol 或数字（自动转为字符串）         |
| 键的唯一性 | 自动去重（基于严格相等 `===`）   | 相同键会覆盖（如 `{ a: 1, a: 2 }` 最终为 `a: 2`） |
| 长度获取   | `size` 属性直接获取              | 需手动计算（`Object.keys(obj).length`）           |
| 遍历方式   | 支持 `for...of`、`forEach` 等    | 需通过 `Object.keys()` 等间接遍历                 |
| 插入顺序   | 保留插入顺序                     | ES6 前不保证，ES6 后基本保证但不推荐依赖          |
| 性能       | 频繁增删键值对时性能更优         | 静态数据时性能略好                                |

### **七、Map 的常见应用场景**

1. **需要非字符串键的场景**：如用对象或函数作为键存储数据。

   ```javascript
   // 用 DOM 元素作为键存储状态
   const domMap = new Map();
   const button = document.querySelector("button");
   domMap.set(button, { clicked: false });
   ```

2. **频繁增删键值对**：`Map` 的增删操作性能优于对象。

3. **需要保留插入顺序**：如实现有序字典、缓存队列等。

4. **数据去重（基于值）**：

   ```javascript
   function uniqueArray(arr) {
     return [...new Map(arr.map((item) => [item, item])).values()];
   }
   const arr = [1, 2, 2, 3, 3, 3];
   console.log(uniqueArray(arr)); // [1, 2, 3]
   ```

5. **与其他 ES6 特性配合**：如结合 `Set`、`Promise` 等处理复杂数据。

### **八、注意事项**

1. `Map` 的键比较使用严格相等（`===`），但 `NaN` 被视为与自身相等（特殊处理）：

   ```javascript
   const map = new Map();
   map.set(NaN, "a");
   map.get(NaN); // 'a'（尽管 NaN !== NaN，但 Map 中视为同一键）
   ```

2. 避免用 `typeof` 判断 `Map` 类型，应使用 `instanceof`：

   ```javascript
   console.log(map instanceof Map); // true
   console.log(typeof map); // 'object'（不准确）
   ```

3. `Map` 本身没有 `JSON.stringify` 的默认支持，序列化需手动处理：
   ```javascript
   // 简单序列化（仅支持基本类型键）
   const map = new Map([
     ["name", "Alice"],
     ["age", 20],
   ]);
   const json = JSON.stringify([...map]); // "[[\"name\",\"Alice\"],[\"age\",20]]"
   ```
