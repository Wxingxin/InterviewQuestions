# 💯💯💯学习class知识点


# 🧭 一、Class 是什么？

**`class`** 是 ES6 引入的一种语法糖，用来更清晰地实现基于原型的面向对象编程。

👉 本质上它是：

> 对 **构造函数（constructor function） + 原型链** 的语法封装。

```js
// ES5 写法
function Person(name) {
  this.name = name;
}
Person.prototype.sayHello = function() {
  console.log('Hello, I am ' + this.name);
};

// ES6 写法
class Person {
  constructor(name) {
    this.name = name;
  }
  sayHello() {
    console.log(`Hello, I am ${this.name}`);
  }
}
```

两者作用完全相同，只是 class 写法更优雅。

---

# 🧩 二、Class 的基础语法

## 1️⃣ 定义类

```js
class Person {
  // 构造函数：创建对象时自动执行
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  // 实例方法
  sayHi() {
    console.log(`Hi, I'm ${this.name}, ${this.age} years old.`);
  }
}

const p1 = new Person('Tom', 20);
p1.sayHi(); // Hi, I'm Tom, 20 years old.
```
- 写法2

```js
const Person = class {

}
```

📘 **注意：**

* 类名建议首字母大写（命名习惯）。
* `constructor` 在实例化时自动调用。
* 所有方法默认添加到 `prototype` 上，而不是对象本身。

---

# 🧱 三、类的组成部分

## 1️⃣ 构造函数（`constructor`）

构造函数负责初始化对象的属性：

```js
class Car {
  constructor(brand, color) {
    this.brand = brand;
    this.color = color;
  }
}
const c = new Car('Tesla', 'white');
console.log(c.brand); // Tesla
```

👉 类中只能有一个 `constructor`，否则报错。

---

## 2️⃣ 实例方法（Instance Methods）

直接定义在类中，属于实例的原型方法：

```js
class Dog {
  constructor(name) {
    this.name = name;
  }

  bark() {
    console.log(`${this.name} says: Woof!`);
  }
}

const d = new Dog('Lucky');
d.bark();
```

等价于：

```js
Dog.prototype.bark = function() { ... };
```

---

## 3️⃣ 静态方法（Static Methods）

使用 `static` 关键字定义，**属于类本身，不属于实例**。

```js
class MathTool {
  static add(a, b) {
    return a + b;
  }
}
console.log(MathTool.add(2, 3)); // 5
// ❌ new MathTool().add(2,3) 报错
```

👉 通常用于：

* 工具函数
* 辅助类方法
* 不依赖实例的逻辑

---

## 4️⃣ 静态属性 / 实例属性

### 实例属性（定义在 constructor 或类中）：

```js
class Student {
  school = 'MIT'; // 实例属性的新写法（ES2022）
  constructor(name) {
    this.name = name;
  }
}
const s = new Student('Alice');
console.log(s.school); // MIT
```

### 静态属性（属于类本身）：

```js
class Config {
  static version = '1.0.0';
}
console.log(Config.version); // 1.0.0
```

---

# 🌳 四、继承（Inheritance）

## 1️⃣ `extends` —— 继承父类

```js
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    console.log(`${this.name} makes a sound.`);
  }
}

class Dog extends Animal {
  speak() {
    console.log(`${this.name} barks.`);
  }
}

const d = new Dog('Buddy');
d.speak(); // Buddy barks.
```

👉 子类会自动继承父类的所有方法和属性。

---

## 2️⃣ `super()` —— 调用父类构造函数或方法

```js
class Animal {
  constructor(name) {
    this.name = name;
  }
  move() {
    console.log(`${this.name} moves.`);
  }
}

class Bird extends Animal {
  constructor(name, color) {
    super(name); // 调用父类构造函数
    this.color = color;
  }

  move() {
    super.move(); // 调用父类方法
    console.log(`${this.name} flies in the sky.`);
  }
}

const b = new Bird('Eagle', 'brown');
b.move();
/*
Eagle moves.
Eagle flies in the sky.
*/
```

⚠️ **注意：**

* 子类必须在使用 `this` 之前调用 `super()`。
* `super()` 是调用父类的构造器，`super.method()` 调用父类方法。

---

# 🧮 五、类的高级特性

## 1️⃣ Getter / Setter（访问器属性）

用来**拦截属性访问或赋值操作**：

```js
class Person {
  constructor(name) {
    this._name = name;
  }

  get name() {
    return this._name.toUpperCase();
  }

  set name(value) {
    if (value.length < 2) throw new Error('名字太短');
    this._name = value;
  }
}

const p = new Person('Tom');
console.log(p.name); // TOM
p.name = 'Jack';
console.log(p.name); // JACK
```

---

## 2️⃣ 私有属性（Private Fields）`#`

ES2022 引入：用 `#` 定义私有属性或方法，只能在类内部访问。

```js
class BankAccount {
  #balance = 0; // 私有属性

  deposit(amount) {
    this.#balance += amount;
  }

  getBalance() {
    return this.#balance;
  }
}

const acc = new BankAccount();
acc.deposit(100);
console.log(acc.getBalance()); // 100
console.log(acc.#balance);     // ❌ 报错：私有属性不可访问
```

---

## 3️⃣ 类表达式（Class Expression）

类也可以像函数一样被赋值给变量。

```js
const Animal = class {
  speak() {
    console.log('Animal speaking');
  }
};
new Animal().speak();
```

或者具名表达式：

```js
const MyClass = class NamedClass {
  say() {
    console.log(NamedClass.name); // 可在内部引用类名
  }
};
```

---

## 4️⃣ 抽象基类（不推荐直接实例化）

通过约定，不实例化，只供继承。

```js
class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new Error('Shape cannot be instantiated directly.');
    }
  }
  area() {
    throw new Error('Must implement area() method');
  }
}

class Circle extends Shape {
  constructor(radius) {
    super();
    this.radius = radius;
  }
  area() {
    return Math.PI * this.radius ** 2;
  }
}

const c = new Circle(3);
console.log(c.area()); // 28.27
```

---

# ⚙️ 六、原型关系解析（底层机制）

```js
class A {}
const a = new A();

console.log(a.__proto__ === A.prototype);           // true
console.log(A.prototype.constructor === A);         // true
console.log(A.__proto__ === Function.prototype);    // true
console.log(A.prototype.__proto__ === Object.prototype); // true
```

👉 `class` 其实是语法糖，底层依然是原型链机制。

---

# 🧠 七、经典案例：继承与封装结合

```js
class Shape {
  constructor(color) {
    this.color = color;
  }

  draw() {
    console.log(`Drawing ${this.color} shape`);
  }
}

class Rectangle extends Shape {
  constructor(color, width, height) {
    super(color);
    this.width = width;
    this.height = height;
  }

  get area() {
    return this.width * this.height;
  }

  draw() {
    super.draw();
    console.log(`Area: ${this.area}`);
  }
}

const rect = new Rectangle('red', 5, 10);
rect.draw();
/*
Drawing red shape
Area: 50
*/
```

---

# 🧩 八、类与函数构造的区别

| 特点   | `function` 构造函数 | `class`         |
| ---- | --------------- | --------------- |
| 写法   | 繁琐              | 简洁、语法糖          |
| 原型定义 | 需手动添加方法         | 自动绑定到 prototype |
| 严格模式 | 默认非严格           | 自动严格模式          |
| 构造调用 | 任何函数都能调用        | 必须用 `new`       |
| 提升   | 会变量提升           | 不会提升            |
| 私有字段 | 不支持             | 支持 `#` 私有属性     |

---

# 🧭 九、总结思维导图式复盘

```
Class
├─ 构造函数 constructor
├─ 实例方法
├─ 静态方法 static
├─ 属性
│  ├─ 实例属性
│  └─ 静态属性
├─ 继承 extends
│  ├─ super()
│  └─ 重写方法
├─ Getter / Setter
├─ 私有属性 #
├─ 原型关系
└─ 高级用法
   ├─ 抽象类
   └─ 类表达式
```
