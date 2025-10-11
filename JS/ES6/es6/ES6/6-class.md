

# 🧩 一、基础认知类
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

---

是否要我帮你生成一份更实用的版本 ——
👉 **「Class 面试题 + 答案 + 高频陷阱总结表」**（Markdown 或 PDF 格式），
像这样每题附一句“面试官喜欢的回答方式”，非常适合复盘或打印？
