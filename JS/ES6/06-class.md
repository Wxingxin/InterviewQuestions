
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



# 💯💯💯🧩 一、基础认知类
> ## 1. **什么是 class？它在 JavaScript 中的本质是什么？**

   > class 是 ES6 引入的语法糖，本质上仍是基于 `prototype` 的构造函数。
> ## 2. **class 和构造函数有何区别？**

   - class 定义不会被提升（不像函数声明）。
   - class 默认使用严格模式。
   - class 方法不可枚举。
   - 必须用 `new` 调用 class。
> ## 3. **class 中的 constructor 有什么作用？**

   - 初始化实例属性。
   - 在子类中必须先调用 `super()` 才能访问 `this`。
> ## 4. **class 中定义的方法有什么特点？**

   - 定义在 `prototype` 上；
   - 不可枚举；
   - 共享同一个函数引用。
> ## 5. **如何在 class 中定义静态方法（static）？**

   - 静态方法属于类本身，而非实例。
   - 示例：

     ```js
     class Person {
       static info() {
         return "I am static";
       }
     }
     ```

---

# 🧱 二、继承机制类

6. **class 继承的原理是什么？**

   - `extends` 本质是通过设置 `__proto__` 和 `prototype.__proto__` 实现原型链继承。

7. **子类为什么必须在 constructor 中调用 super？**

   - 因为 `this` 必须由父类构造函数初始化，否则无法使用。

8. **super 关键字的作用是什么？**

   - 在构造函数中：调用父类构造函数。
   - 在方法中：访问父类方法。

9. **class 继承内置对象（如 Array、Error）时要注意什么？**

   - 某些环境中（旧版浏览器）无法正确继承内置对象；
   - 需要通过 `Reflect.construct` 实现正确的 `this` 绑定。

10. **class 的多重继承如何实现？**

- JS 不支持直接多继承；
- 可通过 “混入模式（Mixin）” 实现：

  ```js
  Object.assign(MyClass.prototype, mixin1, mixin2);
  ```

---

## ⚙️ 三、属性与方法细节类

11. **public / private / protected 的区别？**

- JS 原生只支持 `#private`；
- 不能通过 `this.#xxx` 外部访问；
- `protected` 是 TypeScript 扩展概念。

12. **如何定义类的 getter/setter？**

```js
class Person {
  get name() {
    return this._name;
  }
  set name(v) {
    this._name = v.trim();
  }
}
```

13. **静态属性和静态方法的区别？**

- 静态属性属于类；
- 静态方法属于类，但不会被实例继承。

14. **如何继承静态方法？**

- 通过 `extends` 自动继承；
- `SubClass.__proto__ = SuperClass`。

15. **如何让一个类变为单例？**

```js
class Singleton {
  static instance;
  constructor() {
    if (Singleton.instance) return Singleton.instance;
    Singleton.instance = this;
  }
}
```

---

## 🧠 四、this 与执行上下文类

16. **class 方法中的 this 是如何绑定的？**

- 默认不会自动绑定；
- 若在回调中使用需手动绑定或用箭头函数。

17. **箭头函数在 class 中的 this 表现？**

- 绑定定义时的上下文；
- 常用于事件回调中保持 this。

18. **如果在 class 方法中丢失了 this 怎么办？**

- 可用 `.bind(this)`；
- 或使用箭头函数属性定义：

  ```js
  handleClick = () => {
    console.log(this.name);
  };
  ```

---

## 🧩 五、进阶原理类

19. **class 实例的原型链结构是什么？**

- `instance.__proto__ === Class.prototype`
- `Class.prototype.__proto__ === SuperClass.prototype`

20. **class 的方法能被重写吗？**

- 可以，直接在子类中定义同名方法即可覆盖。

21. **如何判断一个对象是否由某个 class 创建？**

- 使用 `instanceof`；
- 也可以比较 `obj.constructor.name`。

22. **class 如何模拟抽象类？**

- 不能直接实现；
- 但可通过：

  ```js
  if (new.target === AbstractClass) throw Error('Abstract!');
  ```

23. **class 和对象字面量有什么区别？**

- class 支持继承；
- 对象字面量更轻量，适合配置型数据。

24. **class 是否能实现私有作用域？**

- 使用闭包或 `#` 私有属性；
- `WeakMap` 也能实现伪私有变量。

---

## 🧨 六、实战与设计模式类

25. **如何使用 class 实现发布订阅模式？**
26. **如何用 class 封装一个请求管理器？**
27. **如何用 class 实现一个事件总线（EventBus）？**
28. **如何用 class 实现一个简单的 Store（类 Redux）？**
29. **如何实现一个防抖/节流类？**
30. **如何用 class 模拟 jQuery 链式调用？**

---

## 💡 面试官延伸问法（加分题）

- “class 是不是纯语法糖？能手写出 class 的等价函数吗？”
- “解释 `super` 背后的原型链结构。”
- “class 的静态块（`static {}`）有何用途？”
- “私有字段（#）是如何在底层被隔离的？”
- “TypeScript 中的修饰符（public/private/protected）在编译后是什么样的？”

