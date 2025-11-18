我直接给你一套**常见 TypeScript 面试题 + 标准答案/示例**，从基础到高级都覆盖一遍。你可以当作背题手册用 👇

---

## 一、基础概念类

### 1. TypeScript 和 JavaScript 的关系是什么？

**答：**

* TS 是 JS 的**超集（superset）**，在 JS 语法基础上增加了静态类型系统和一些新特性。
* 所有合法的 JS 代码都是合法的 TS 代码。
* TS 最终会被**编译（transpile）成 JS**，在任何支持 JS 的环境中运行（浏览器 / Node 等）。

---

### 2. TypeScript 带来的核心价值是什么？

常见回答点：

1. **静态类型检查**：在编译期发现类型错误，提前暴露潜在 bug。
2. **更好的 IDE 体验**：智能提示、自动补全、跳转定义、重构友好。
3. **更易维护的代码**：强类型接口、清晰边界，大型项目更易协作。
4. **现代语法支持**：TS 编译器可以把新特性编译到目标 JS 版本。

---

### 3. 什么是结构化类型系统（Structural Typing）？

**答：**

TS 使用的是**结构类型系统**（也叫鸭子类型）：

> 判断两个类型是否兼容，**看它们的结构（属性/方法）是否满足**，而不是名字是否一样。

```ts
interface Person {
  name: string;
  age: number;
}

interface User {
  name: string;
  age: number;
}

let p: Person = { name: 'Tom', age: 20 };
let u: User = p; // ✅ 结构相同，所以兼容
```

---

## 二、基础类型与特殊类型

### 4. `any`、`unknown`、`never` 有什么区别？

**any**

* 代表“**任意类型**”，跳过类型检查。
* 对 `any` 做任何操作都不会报错。
* 滥用会失去 TS 的意义。

```ts
let a: any = 1;
a = 'abc';
a.foo().bar(); // 编译期不报错
```

**unknown**

* 代表“**不确定的类型**”，比 `any` 更安全。
* 不能随便对 `unknown` 做操作，必须先**缩小类型（type narrowing）**。

```ts
let u: unknown = 1;
u = 'abc';
// u.toFixed(); // ❌ 不允许

if (typeof u === 'number') {
  u.toFixed(); // ✅ 类型收窄后可用
}
```

**never**

* 代表“**永远不会发生的类型**”：

  * 函数永远不返回（死循环 / 抛异常）
  * 联合类型被排除干净后的剩余类型

```ts
function error(msg: string): never {
  throw new Error(msg);
}
```

---

### 5. `void` 和 `undefined` 的区别？

* `void`：一般用于函数**无返回值**：

  ```ts
  function log(msg: string): void {
    console.log(msg);
  }
  ```
* 在 `strictNullChecks` 下，`void` 和 `undefined` 不是完全等价。

  ```ts
  let v: void;
  let u: undefined;

  v = undefined; // ✅
  // u = v;      // ❌ 严格模式下不兼容
  ```

---

## 三、联合类型 / 交叉类型

### 6. 什么是联合类型（Union Types）？

```ts
let value: string | number;

value = 'hello'; // ok
value = 123;     // ok
// value = true; // error
```

**关键点：**

* 表示“**可能是 A，也可能是 B**”。
* 使用时必须先**缩小类型**（类型守卫）：

  ```ts
  function printId(id: string | number) {
    if (typeof id === 'string') {
      console.log(id.toUpperCase());
    } else {
      console.log(id.toFixed(2));
    }
  }
  ```

---

### 7. 什么是交叉类型（Intersection Types）？

```ts
interface A { a: number }
interface B { b: string }

type C = A & B;

const obj: C = {
  a: 1,
  b: 'test'
};
```

* 表示“**同时满足多个类型**”，所有属性合并在一起。
* 常用于：**混入、组合多个接口**，或与工具类型结合。

---

## 四、类型推断 / 类型断言 / 类型守卫

### 8. 什么是类型推断（Type Inference）？

TS 会在很多场景自动推断变量类型：

```ts
let x = 1;        // 推断为 number
const y = 'abc';  // 推断为 "abc" 字面量类型
```

好处：

* 写代码时不必处处手写类型。
* 但复杂逻辑中建议显式类型，避免推断成 `any`。

---

### 9. 什么是类型断言（Type Assertion）？和类型转换有何区别？

**写法：**

```ts
const someValue: unknown = 'hello';
const len1 = (someValue as string).length;
const len2 = (<string>someValue).length; // JSX 中不推荐
```

* 类型断言只在**编译期**起作用，**不会改变运行时的值**。
* 它告诉编译器：“相信我，这里确实是这个类型”。

---

### 10. 常见的类型守卫（Type Guards）有哪些方式？

1. `typeof`

   ```ts
   if (typeof x === 'string') { ... }
   ```
2. `instanceof`

   ```ts
   if (obj instanceof Date) { ... }
   ```
3. 自定义类型保护（用户自定义类型守卫）

   ```ts
   function isString(value: unknown): value is string {
     return typeof value === 'string';
   }
   ```
4. `in` 操作符

   ```ts
   if ('id' in obj) { ... }
   ```

---

## 五、接口 / 类型别名 / class

### 11. `interface` 和 `type` 有什么区别？使用场景？

**相同点：**

* 都可以描述对象结构：

  ```ts
  interface Person { name: string }
  type Person2 = { name: string }
  ```

**不同点（常考）：**

1. `interface` 支持**声明合并**：

   ```ts
   interface A { x: number }
   interface A { y: string }
   // => A { x: number; y: string }
   ```
2. `type` 更通用，可表示：

   * 联合类型：`type ID = string | number`
   * 条件类型、映射类型等。
3. 一般实践：

   * 描述**对象、类的结构**优先用 `interface`
   * **复杂类型组合**（联合、条件、工具类型）常用 `type`

---

### 12. 如何在 TS 中实现接口继承和类实现？

```ts
interface Animal {
  name: string;
  say(): void;
}

interface Dog extends Animal {
  breed: string;
}

class Husky implements Dog {
  name: string;
  breed: string;

  constructor(name: string, breed: string) {
    this.name = name;
    this.breed = breed;
  }

  say() {
    console.log('woof');
  }
}
```

---

## 六、泛型（Generics）

### 13. 什么是泛型？为什么需要泛型？

**答：**

泛型是**在定义时不指定具体类型**，在**使用时再传入类型参数**的一种机制，使得：

* 代码可复用
* 类型信息可保留

```ts
function identity<T>(value: T): T {
  return value;
}

identity<number>(1);
identity('abc'); // 类型推断为 T = string
```

---

### 14. 泛型约束 `extends` 是做什么的？

用于限制泛型参数必须满足某种结构：

```ts
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(value: T): void {
  console.log(value.length);
}

logLength('abc');      // ok
logLength([1, 2, 3]);  // ok
// logLength(123);     // error: number 没有 length 属性
```

---

### 15. 泛型在函数、接口、类、类型别名中的使用示例？

**函数泛型：**

```ts
function wrap<T>(value: T): { value: T } {
  return { value };
}
```

**接口泛型：**

```ts
interface Result<T> {
  data: T;
  error?: string;
}

const r: Result<number> = { data: 1 };
```

**类泛型：**

```ts
class Store<T> {
  private _data: T[] = [];
  add(item: T) { this._data.push(item); }
  getAll(): T[] { return this._data; }
}
```

**类型别名泛型：**

```ts
type Nullable<T> = T | null | undefined;
```

---

## 七、keyof / typeof / 索引类型 / 映射类型

### 16. `keyof` 是什么？常见用法？

```ts
interface Person {
  name: string;
  age: number;
}

type PersonKeys = keyof Person; // "name" | "age"
```

常用在**约束对象属性名**：

```ts
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

---

### 17. TypeScript 中的 `typeof` 和 JS 运行时 `typeof` 有什么区别？

* JS 中的 `typeof` 是**运行时运算符**，返回 `"string"`、`"number"` 等。
* TS 中的 `typeof` 是**类型层面的操作符**，用于**获取变量/值的类型**：

```ts
const person = {
  name: 'Tom',
  age: 20
};

type Person = typeof person;
// 等价于：{ name: string; age: number }
```

---

### 18. 什么是索引访问类型（Indexed Access Types）？

```ts
interface Person {
  name: string;
  age: number;
}

type NameType = Person['name']; // string
type AgeOrName = Person['age' | 'name']; // string | number
```

通过下标从类型中“取出”某个字段的类型。

---

### 19. 什么是映射类型（Mapped Types）？

```ts
interface Person {
  name: string;
  age: number;
}

type ReadonlyPerson = {
  readonly [K in keyof Person]: Person[K];
};
```

TS 内置工具类型如 `Partial` / `Required` / `Readonly` / `Pick` 都是映射类型实现的。

---

### 20. 常见工具类型：`Partial` / `Pick` / `Omit` / `Record` 分别做什么？

```ts
interface Person {
  name: string;
  age: number;
}

// Partial<T>：所有属性变为可选
type P1 = Partial<Person>; 
// { name?: string; age?: number }

// Pick<T, K>：从 T 中挑选一些属性
type P2 = Pick<Person, 'name'>; 
// { name: string }

// Omit<T, K>：从 T 中排除一些属性
type P3 = Omit<Person, 'age'>;
// { name: string }

// Record<K, T>：构造一个属性键为 K，值为 T 的对象类型
type P4 = Record<'a' | 'b', number>;
// { a: number; b: number }
```

---

## 八、条件类型（Conditional Types）

### 21. 什么是条件类型？语法是什么？

**语法：**

```ts
T extends U ? X : Y
```

根据条件选择不同的类型。

```ts
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false
```

---

### 22. 什么是分布式条件类型（Distributive Conditional Types）？

当条件类型的泛型参数是**联合类型**时，会对联合类型成员分别计算：

```ts
type ToArray<T> = T extends any ? T[] : never;

type A = ToArray<number | string>;
// 等价于 number[] | string[]
```

---

## 九、模块 / 命名空间 / 声明合并

### 23. TypeScript 中的模块系统是怎样的？

* 使用 ES Module 语法：`import` / `export`
* 一个文件只要有 `import` 或 `export`，就会被当做模块。

```ts
// a.ts
export const foo = 1;

// b.ts
import { foo } from './a';
```

---

### 24. 什么是声明合并（Declaration Merging）？

TS 中多个相同名字的声明会合并成一个：

```ts
interface A { x: number }
interface A { y: string }

const obj: A = {
  x: 1,
  y: 'test'
};
```

常见场景：

* 扩展第三方库的类型声明（比如 `express` 的 Request 上加属性）。
* 扩展全局 `Window` 接口。

---

### 25. 如何为第三方 JS 库编写声明文件（d.ts）？

方向性回答即可：

1. 使用 `declare` 关键字声明全局变量、函数、模块等：

   ```ts
   declare module 'lodash' {
     export function chunk<T>(arr: T[], size?: number): T[][];
   }
   ```
2. 把声明放在 `.d.ts` 文件中。
3. 或在 DefinitelyTyped 上安装：
   `npm i -D @types/lodash`

---

## 十、工程实践 / tsconfig

### 26. `strictNullChecks` 有什么作用？

* 打开后，`null` 和 `undefined` **不再**是所有类型的子类型。
* 必须显式处理可能为 `null` / `undefined` 的情况：

```ts
let name: string;
name = 'Tom';
// name = null; // ❌

let name2: string | null = null; // ✅ 需要显式联合
```

---

### 27. 常见的 `tsconfig.json` 关键配置有哪些？

可以简单列举并说明：

* `"strict": true`：开启所有严格检查。
* `"target"`：编译输出的 JS 版本（ES5/ES6/...）。
* `"module"`：模块系统（commonjs、esnext 等）。
* `"lib"`：注入的内置库声明（DOM、ES2020 等）。
* `"baseUrl"` / `"paths"`：路径别名配置。
* `"noImplicitAny"`：禁止隐式 `any`。
* `"esModuleInterop"`：与 CommonJS 模块互操作。

---

### 28. 从 JS 逐步迁移到 TS，通常怎么做？

常见回答思路：

1. 先把 `.js` 改成 `.ts` / `.tsx`，关闭部分严格选项（如 `strict`）。
2. 逐步加上类型注解，减少 `any`。
3. 为关键模块加上接口定义与类型声明。
4. 最终打开严格模式，修正所有类型问题。

---

## 十一、实战类小题

### 29. 实现一个简单的 `Partial<T>` 类型（手写内置工具）

```ts
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};
```

---

### 30. 实现一个简单的 `Pick<T, K>` 类型

```ts
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

---

### 31. 写一个函数 `getValue`，参数是对象和 key，返回对应属性，要求类型安全。

```ts
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = { name: 'Tom', age: 20 };
const n = getValue(person, 'name'); // n: string
// getValue(person, 'xxx'); // ❌ 编译错误
```

---

### 32. 如何定义一个只读的数组和一个只读的对象？

```ts
const arr: ReadonlyArray<number> = [1, 2, 3];
// arr.push(4); // ❌

const obj: Readonly<{ name: string }> = {
  name: 'Tom'
};
// obj.name = 'Jack'; // ❌
```
