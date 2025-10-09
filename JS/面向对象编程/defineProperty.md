# base

### 1

`Object.defineProperty(obj, prop, descriptor)`

- 作用：在对象上定义新属性，或修改已有属性的特性。
- 返回值：修改后的对象（即 obj 本身）

**参数说明：**
1．obj：目标对象。
2．prop：要定义或修改的属性名。
3．descriptor：属性描述符（配置项对象）

### 2.属性描述符分类

属性描述符分为两类：
**数据**描述符：包含 value 和 writable。
**存取**描述符：包含 get 和 set。

1. 通用的特性（两类都有的）

- **configurable** (默认 false)
- 是否可以删除属性、是否可以修改属性描述符。
- **enumerable** (默认 false)
- 是否可以枚举（for...in、Object.keys ）

2. 数据描述符
   - value (默认 undefined):属性的值。
   - writable (默认 false): 值是否可被修改。

```js
const obj = {};
Object.defineProperty(obj, "name", {
  value: "Alice",
  writable: false, // 不可修改
  enumerable: true, // 可枚举
  configurable: true, // 可删除
});

console.log(obj.name); // Alice
obj.name = "Bob"; // 严格模式报错，非严格模式忽略
console.log(obj.name); // Alice
```

3. 存取描述符

- get：一个函数，读取属性时调用。
- set：一个函数，写入属性时调用。

```js
const obj = {};
let _age = 20;

Object.defineProperty(obj, "age", {
  get() {
    return _age;
  },
  set(newVal) {
    if (newVal > 0) _age = newVal;
  },
  enumerable: true,
  configurable: true,
});

console.log(obj.age); // 20
obj.age = 25;
console.log(obj.age); // 25
obj.age = -5; // 无效
console.log(obj.age); // 25
```

# pro

### 1. 默认行为

如果只写 `Object.defineProperty(obj, "x", {})`：

- value = undefined
- writable = false
- enumerable = false
- configurable = false

这意味着定义的属性不可修改、不可枚举、不可删除。

```js
const obj = {};
Object.defineProperty(obj, "x", {});
console.log(obj.x); // undefined

obj.x = 10; // 无效
console.log(obj.x); // undefined
```
### 多个属性一次性定义

`Object.defineProperties()`：一次定义多个属性。
```js
const obj = {};
Object.defineProperties(obj, {
  name: {
    value: "Alice",
    writable: true,
    enumerable: true
  },
  age: {
    value: 18,
    writable: false,
    enumerable: true
  }
});
console.log(obj); // { name: 'Alice', age: 18 }

```

