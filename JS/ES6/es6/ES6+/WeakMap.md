

## 1. 什么是 WeakMap？

-  `WeakMap` 是 **ES6** 引入的一种特殊的 `Map`。
-  它的 **键（key）必须是对象**（非对象会报错）。
-  与普通 `Map` 的区别是：

   -  `WeakMap` 的键是 **弱引用**，不会阻止垃圾回收。
   -  当对象没有其他引用时，垃圾回收器会自动清理这个对象以及对应的键值对。
   -  因此 `WeakMap` **不能被遍历**，也没有 `size` 属性。

---

## 2. 基本用法

```js
// 创建 WeakMap
const wm = new WeakMap();

const obj1 = { name: "Alice" };
const obj2 = { name: "Bob" };

// 设置键值对
wm.set(obj1, "开发者");
wm.set(obj2, "设计师");

// 获取
console.log(wm.get(obj1)); // "开发者"

// 判断是否存在
console.log(wm.has(obj2)); // true

// 删除
wm.delete(obj2);
console.log(wm.has(obj2)); // false
```

⚠️ 不能用 `for...of`、`forEach`、`keys()`、`values()` 遍历，因为键会随垃圾回收而消失。

---

## 3. WeakMap 的特点

1. **键必须是对象**

   ```js
   const wm = new WeakMap();
   wm.set(123, "num"); // ❌ 报错：Invalid value used as weak map key
   ```

2. **键是弱引用**

   -  `WeakMap` 不会阻止对象被垃圾回收。
   -  如果某个对象不再被引用，它会自动从 `WeakMap` 中消失。

3. **不可遍历**

   -  没有 `size`、没有 `clear()`。
   -  设计目的是 **防止内存泄漏**。

---

## 4. 使用场景

### (1) 给对象“私有属性”

```js
const privateData = new WeakMap();

class Person {
   constructor(name, age) {
      privateData.set(this, { name, age });
   }

   getName() {
      return privateData.get(this).name;
   }
}

const p1 = new Person("Tom", 20);
console.log(p1.getName()); // "Tom"

// 外部无法直接访问 name 和 age
```

👉 用 `WeakMap` 给对象存储“私有数据”，当对象销毁时，数据也会自动清理。

---

### (2) 关联额外数据，避免内存泄漏

```js
const wm = new WeakMap();

function setMetadata(obj, meta) {
   wm.set(obj, meta);
}

function getMetadata(obj) {
   return wm.get(obj);
}

let user = { id: 1 };
setMetadata(user, { loggedIn: true });

console.log(getMetadata(user)); // { loggedIn: true }

// 当 user = null 时，这个对象会被垃圾回收
user = null;
// WeakMap 自动清理对应的 { loggedIn: true }，避免内存泄漏
```

---

## 5. 对比 `Map` 和 `WeakMap`

| 特性      | Map                   | WeakMap                    |
| --------- | --------------------- | -------------------------- |
| 键类型    | 任意值                | 只能是对象                 |
| 引用      | 强引用                | 弱引用                     |
| 可遍历性  | 可遍历（keys/values） | 不可遍历                   |
| size 属性 | 有                    | 没有                       |
| 内存管理  | 可能内存泄漏          | 自动垃圾回收，避免内存泄漏 |

---

✅ 总结：

-  **用 `WeakMap` 存放对象的私有数据或临时数据**，不用担心内存泄漏。
-  **用 `Map` 存放需要遍历的键值对**。

---

要不要我帮你做一个 **WeakMap vs Map 的对比动图/ASCII 动画**，演示垃圾回收时 WeakMap 的键值对是如何自动消失的？
