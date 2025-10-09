# 默认绑定

```js
// 浏览器环境示例
var globalVar = "我是全局变量";

// 全局函数
function foo() {
  console.log(this.globalVar); // this 指向 window（默认绑定）
}

foo(); // 输出："我是全局变量"（因为 window.globalVar = "我是全局变量"）
```

```js

```

# 隐式绑定

```js
// 定义一个对象，包含方法
const obj = {
  name: "隐式绑定对象",
  sayName: function () {
    console.log(this.name); // this 指向调用者
  },
};

// 以 "对象.方法" 形式调用 → 触发隐式绑定
obj.sayName(); // 输出："隐式绑定对象"
// 此时 this 指向 obj（因为是 obj 调用了 sayName 方法）
```

```js
const obj = {
  name: "obj",
  sayName: function () {
    console.log(this.name);
  },
};

// 提取方法到变量（此时只是函数引用，与 obj 解绑）
const func = obj.sayName;

// 单独调用 → 隐式绑定失效，触发默认绑定
func(); // 输出：undefined（浏览器中 this 指向 window，而 window 没有 name 属性）
```

# 显式绑定

```js
function say(greeting) {
  console.log(`${greeting} is : ${this.name}`);
}

const person = { name: "weia and gao" };
say.call(person, "family");
```

```js
function add(a, b) {
  console.log(`${a} + ${b} ${this.operation} :${a + b}`);
}

const context = { operation: "相加" };
add.apply(context, [2002, 2003]);
```

```js
function introduce(age) {
  console.log(`我是${this.name}，今年${age}岁`);
}

const person = { name: "李四" };

// 用 bind 绑定 this 为 person，返回新函数
const boundIntroduce = introduce.bind(person);

// 调用新函数时，this 已固定为 person
boundIntroduce(25); // 输出："我是李四，今年25岁"

// 即使尝试用 call 再次改变 this，也无效
boundIntroduce.call({ name: "王五" }, 30); // 仍输出："我是李四，今年30岁"
```

```js

```

```js

```

# new 绑定

```js
// 创建空对象：生成一个全新的空对象（{}）。
// 绑定原型：将空对象的原型（__proto__）指向构造函数的 prototype 属性。
// 绑定 this：将构造函数的 this 指向这个空对象（即 this 绑定到新对象）。
// 执行构造函数：运行构造函数体内的代码（通常是给 this 添加属性）。
// 返回对象：
// 如果构造函数没有返回值，或返回的是基本类型（数字、字符串等），则返回第 1 步创建的对象。
// 如果构造函数返回一个对象，则返回该对象（此时 this 绑定会被覆盖）
```

```js
// 定义一个构造函数
function Person(name) {
  // 当用 new 调用时，this 指向新创建的实例
  this.name = name;
}

// 用 new 调用（触发 new 绑定）
const person1 = new Person("张三");
console.log(person1.name); // 输出："张三"（this 绑定到 person1）

const person2 = new Person("李四");
console.log(person2.name); // 输出："李四"（this 绑定到 person2）
```

```js

```

# 优先级

```js
function foo() {
  console.log(this.a);
}

var obj = {
  a: 2,
  foo: foo,
};

// 情况 1：默认绑定
foo(); // undefined (严格模式下)，或 window.a (非严格模式下)

// 情况 2：隐式绑定
obj.foo(); // 2

// 验证优先级：即使函数被赋值给对象属性，调用时会遵循隐式绑定
var bar = obj.foo;
bar(); // 默认绑定生效 -> undefined（严格模式）或 window（非严格）
```

### 显式高于隐式

```js
const obj1 = {
  name: "obj1",
  fn: function () {
    console.log(this.name);
  },
};

const obj2 = { name: "obj2" };

// 隐式绑定：this 指向 obj1
obj1.fn(); // 输出："obj1"

// 显式绑定（call）覆盖隐式绑定：this 指向 obj2
obj1.fn.call(obj2); // 输出："obj2"
```

### new 绑定的优先级

```js
function Foo(name) {
  this.name = name;
}

const obj = { name: "obj" };

// 显式绑定（bind）
const boundFoo = Foo.bind(obj);

// new 绑定 覆盖 显式绑定
const instance = new boundFoo("实例");
console.log(instance.name); // 输出："实例"（this 指向 instance，而非 obj）
console.log(obj.name); // 输出："obj"（obj 未被修改）
```
