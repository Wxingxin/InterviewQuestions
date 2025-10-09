
## 1. 基本概念

- `class` 是 **ES6 引入的语法糖**，本质上还是基于 **原型链** 的继承机制。
- `class` 让 JavaScript 的 **面向对象编程（OOP）** 写法更接近 Java、C++ 等语言。

---

## 2. 基本语法

### 2.1 类定义

```js
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  sayHi() {
    console.log(`Hi, I'm ${this.name}`);
  }
}

const p1 = new Person("Alice", 20);
p1.sayHi(); // Hi, I'm Alice
```

### 2.2 注意点

- 类必须用 `new` 调用，否则报错。
- `class` 内的方法是 **不可枚举**（与 ES5 不同）。

---

## 3. 类表达式

```js
// 匿名类
const Animal = class {
  constructor(type) {
    this.type = type;
  }
};

// 具名类（只能在类内部访问 Name）
const Dog = class DogClass {
  constructor(name) {
    this.name = name;
  }
};
```

---

## 4. getter / setter

```js
class Person {
  constructor(name) {
    this._name = name;
  }
  get name() {
    return this._name.toUpperCase();
  }
  set name(newName) {
    this._name = newName.trim();
  }
}
const p = new Person("Alice");
console.log(p.name); // ALICE
p.name = "   Bob   ";
console.log(p.name); // BOB
```

---

## 5. 静态方法与静态属性

```js
class MathUtil {
  static add(a, b) {
    return a + b;
  }
}
console.log(MathUtil.add(2, 3)); // 5
```

> ES2022 开始，类支持 **静态属性**：

```js
class Config {
  static version = "1.0.0";
}
console.log(Config.version); // 1.0.0
```

---

## 6. 私有字段（#）

私有字段只能在类内部访问，外部无法访问。

```js
class Counter {
  #count = 0; // 私有属性
  increment() {
    this.#count++;
    return this.#count;
  }
}
const c = new Counter();
console.log(c.increment()); // 1
// console.log(c.#count); ❌ 语法错误
```

---

## 7. 继承（extends + super）

### 7.1 子类继承父类

```js
class Parent {
  constructor(name) {
    this.name = name;
  }
  sayHi() {
    console.log(`Hi, I'm ${this.name}`);
  }
}

class Child extends Parent {
  constructor(name, age) {
    super(name); // 必须先调用 super
    this.age = age;
  }
}
const c = new Child("Alice", 20);
c.sayHi(); // Hi, I'm Alice
```

### 7.2 super 用法

- 在 **构造函数**里调用父类构造函数：`super(args)`。
- 在 **方法**里调用父类同名方法：`super.method()`。

```js
class Parent {
  greet() {
    console.log("Hello from parent");
  }
}
class Child extends Parent {
  greet() {
    super.greet(); // 调用父类方法
    console.log("Hello from child");
  }
}
new Child().greet();
// Hello from parent
// Hello from child
```

---

## 8. 类的原型关系

```js
class A {}
class B extends A {}

const b = new B();

console.log(b.__proto__ === B.prototype); // true
console.log(B.prototype.__proto__ === A.prototype); // true
console.log(B.__proto__ === A); // true
```

👉 说明：

- 实例对象的 `__proto__` 指向子类的 `prototype`。
- 子类 `prototype.__proto__` 指向父类 `prototype`。
- 子类构造函数本身的 `__proto__` 指向父类构造函数。

---

## 9. 类的高级用法

### 9.1 类字段（ES2022）

```js
class Person {
  name = "Alice"; // 实例属性
  static species = "Human"; // 静态属性
}
const p = new Person();
console.log(p.name); // Alice
console.log(Person.species); // Human
```

### 9.2 类的混入（Mixin）

JavaScript 不能多继承，但可以用 Mixin 模拟：

```js
let Flyable = (Base) =>
  class extends Base {
    fly() {
      console.log("Flying...");
    }
  };
let Swimmable = (Base) =>
  class extends Base {
    swim() {
      console.log("Swimming...");
    }
  };

class Animal {}
class Duck extends Swimmable(Flyable(Animal)) {}
const d = new Duck();
d.fly(); // Flying...
d.swim(); // Swimming...
```

---

## 10. 面试常考点

### 10.1 class 本质

```js
class Person {}
console.log(typeof Person); // "function"
```

👉 `class` 本质还是构造函数。

### 10.2 为什么必须先 `super()`？

子类构造函数中的 `this` 只有在调用 `super()` 后才可用，因为必须先初始化父类实例。

### 10.3 class 与 ES5 构造函数区别

| 特性       | ES5 构造函数   | ES6 class    |
| ---------- | -------------- | ------------ |
| 写法       | 函数+prototype | class 语法糖 |
| 方法可枚举 | 是             | 否           |
| 必须 `new` | 否             | 是           |
| 私有字段   | 不支持         | 支持（`#`）  |

---

## 11. 总结

1. `class` 是 **语法糖**，底层还是 `prototype` + `constructor`。
2. `constructor` 用于初始化实例属性。
3. **实例方法**定义在 `prototype` 上，所有实例共享。
4. **静态方法/属性**只能通过类本身调用。
5. 支持 `extends` 实现继承，`super` 用于调用父类。
6. 支持 **私有字段（#）** 和 **类字段**。
7. 复杂场景下可以用 **Mixin** 模拟多继承。

---

要不要我给你画一张 **`class` 的继承原型链关系图**（包括 `extends`、`super`、`prototype`、`__proto__`）？
