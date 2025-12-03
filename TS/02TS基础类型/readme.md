## 1. **Boolean 类型**

代表真与假，只有两种值：`true` 与 `false`。

```ts
let isDone: boolean = true;
```

适用于条件判断、状态标识等。

---

## 2. **Number 类型**

JavaScript 与 TypeScript 使用双精度 64 位浮点数，统一都叫 `number`。

```ts
let count: number = 42;
let price: number = 9.99;
let hex: number = 0xff;
let binary: number = 0b1010;
```

---

## 3. **String 类型**

字符串，用单引号、双引号或模板字符串表示。

```ts
let name: string = "Alice";
let greeting: string = `Hello, ${name}`;
```

---

## 4. **Symbol 类型**

用来创建 **唯一的值**，常用于对象属性的唯一键。

```ts
let key: symbol = Symbol("id");
```

---

## 5. **Array 类型**

有两种写法：

```ts
let list: number[] = [1, 2, 3];
let list2: Array<number> = [1, 2, 3];
```

`list: T[]` 更常用。

---

## 6. **Enum 类型（枚举）**

给一组可能的值起名字。

```ts
enum Color {
  Red,
  Green,
  Blue,
}

let c: Color = Color.Green;
```

也可以手动设置值：

```ts
enum Status {
  Ok = 200,
  NotFound = 404,
}
```

---

## 7. **Any 类型**

代表“随便什么类型都可以”，**放弃类型检查**。

```ts
let value: any = 123;
value = "hello";
value = true;
```

⚠️ 滥用 `any` 会导致 TypeScript 失去意义。

---

## 8. **Unknown 类型**

比 `any` 更安全：你可以赋任何类型给它，但不能直接使用它。

```ts
let input: unknown;

input = 123;
input = "hello";

// ❌ 错误：不能直接当 string 来用
// console.log(input.toUpperCase());

// ✔️ 必须先缩小类型
if (typeof input === "string") {
  console.log(input.toUpperCase());
}
```

---

## 9. **Tuple 类型（元组）**

固定长度、固定类型的数组。

```ts
let person: [string, number];
person = ["Alice", 20]; // ✔️
```

---

## 10. **Void 类型**

表示没有返回值的函数。

```ts
function log(msg: string): void {
  console.log(msg);
}
```

---

## 11. **Null 和 Undefined 类型**

两种特殊类型：`null` 和 `undefined`。

```ts
let u: undefined = undefined;
let n: null = null;
```

在 `strictNullChecks: true` 下才有意义，否则它们属于所有类型。

---

## 12. **object、Object 和 {} 类型**

这三者容易混：

| 类型     | 含义                                 |
| -------- | ------------------------------------ |
| `object` | 非原始类型，如数组、函数、对象       |
| `Object` | 所有能转成对象的类型（包括原始类型） |
| `{}`     | 非 null 和 undefined 的所有值        |

例子：

```ts
let a: object = { x: 1 }; // ✔️
let b: Object = 123; // ✔️ number 可包装成对象
let c: {} = "hi"; // ✔️ 字符串也可以
```

---

在 TypeScript 中，`object`、`Object` 和 `{}` 这三个类型经常让人混淆，它们看起来很像，但实际含义和使用场景完全不同。下面我详细对比解释清楚（基于 TypeScript 5.x 最新行为）。

| 类型写法 | 实际含义                                                                                         | 能赋值什么值？                                                                     | 典型错误场景                               | 推荐使用场景                           |
| -------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- | ------------------------------------------ | -------------------------------------- |
| object   | 表示“所有非原始类型的值”（即不是 number、string、boolean、symbol、bigint、null、undefined 的值） | 对象（{}、数组、函数、实例、new String() 等）、数组、函数、Map、Set、正则、Date 等 | 不能赋原始值：let x: object = 123; // 错误 | 明确表示“一定是一个对象，不是原始值”时 |
| Object   | 几乎等同于所有类型（包括原始类型），因为所有类型都继承自 Object.prototype                        | 几乎任何值都可以（123、"abc"、true、null、undefined、对象、数组、函数等）          | 几乎不会报错，所以失去了类型检查意义       | 几乎不推荐使用（历史遗留，几乎无用）   |
| {}       | 空对象类型，但由于原始值会被“装箱”（boxing），实际行为和 Object 几乎一样                         | 几乎任何值都可以（同 Object）                                                      | 同上，几乎没约束力                         | 几乎不推荐使用（常被误用）             |

### 详细解释 + 代码演示

```ts
// 1. object 类型（推荐用于表示“非原始值”）
let a: object = { name: "zs" }; // OK
let b: object = [1, 2, 3]; // OK
let c: object = () => {}; // OK
let d: object = new Map(); // OK

// 以下全部报错，这就是 object 的意义所在！
let e: object = 123; // Error
let f: object = "hello"; // Error
let g: object = true; // Error
let h: object = null; // Error（strictNullChecks 为 true 时）
let i: object = undefined; // Error（strictNullChecks 为 true 时）
```

```ts
// 2. Object 类型（大写 O，几乎没用）
let x: Object = 123; // OK（装箱成 new Number(123)）
let y: Object = "abc"; // OK
let z: Object = true; // OK
let w: Object = { a: 1 }; // OK
let v: Object = null; // strictNullChecks=true 时报错，否则OK
// 基本上啥都能放，完全失去类型保护作用，几乎没人用
```

```ts
// 3. {} 空对象类型（最容易被误解）
let p: {} = 123; // OK！因为 number 会被装箱成 new Number(123)，而 Number 实例有 .toString() 等方法，满足 {} 的要求
let q: {} = "abc"; // OK
let r: {} = null; // strictNullChecks=true 时错误
// 所以 {} 实际上和 Object 差不多，没什么约束力
```

### 那到底该怎么用才正确？

#### 场景 1：你只想表示“这是一个对象，不是原始值”

```ts
function logObj(obj: object) {
  console.log(obj);
}

logObj({}); // OK
logObj([]); // OK
logObj(() => {}); // OK
logObj(123); // Error 正确！这就是我们想要的
```

→ 用 `object`（小写 o）

#### 场景 2：你想表示“任意非 null/undefined 的值”（类似 any 但更安全）

```ts
function stringify(value: Object) {
  return String(value);
}
// 或者更现代的写法：
function stringify(value: unknown) { ... }
```

→ 基本不用 `Object`，直接用 `unknown` 更好

#### 场景 3：你想接受任意值（包括原始值和 null/undefined）

```ts
let anything: any = ...;     // 最宽松
let something: unknown = ...; // 推荐，安全版 any
```

#### 场景 4：你想精确描述一个对象结构（最常见、最推荐！）

```ts
interface User {
  name: string;
  age: number;
}

function printUser(user: User) { ... }

printUser({ name: "ls", age: 18 }); // OK
printUser({ name: "ww" });          // Error，缺少 age
```

→ 用 `interface` 或 `type`，而不是模糊的 object/Object/{}

### 总结表格（记住这张表就够了）

| 写法                    | 含义                          | 能放原始值？ | 能放 null/undefined？ | 推荐度 | 备注                             |
| ----------------------- | ----------------------------- | ------------ | --------------------- | ------ | -------------------------------- |
| object                  | 非原始类型对象                | 不能         | strict 下不能         | ★★★★★  | 推荐！明确表示“是一个对象”       |
| Object                  | 几乎所有类型（装箱机制）      | 能           | strict 下 null 不能   | ★☆☆☆☆  | 基本废弃，几乎不用               |
| {}                      | 空对象（装箱机制，同 Object） | 能           | strict 下 null 不能   | ★☆☆☆☆  | 最容易误用，很多新手以为是空对象 |
| Record<string, unknown> | 键为 string 的对象            | 不能         | 不能                  | ★★★★☆  | 常用于 { [key: string]: xxx }    |
| unknown                 | 任意值，但使用前必须类型检查  | 能           | 能                    | ★★★★★  | 现代替代 any 的首选              |
| any                     | 任意值，无检查                | 能           | 能                    | ★★☆☆☆  | 能不用就不用                     |

### 结论（背下来就行）

- 想说“一定是个对象，不是 number/string 等原始值” → 用 `object`（小写）
- 想接受任意值 → 用 `unknown`（而不是 Object 或 {}）
- 想精确描述对象结构 → 用 `interface` 或 `type`
- `Object` 和 `{}` 基本是历史遗留坑，现代 TypeScript 项目几乎不用

## 13. **never 类型**

用于：永远不会有返回值的情况。

### 常见两种场景：

① 抛错函数

```ts
function fail(msg: string): never {
  throw new Error(msg);
}
```

② 死循环

```ts
function infinite(): never {
  while (true) {}
}
```

③ 不可能到达的分支

```ts
function foo(x: string | number) {
  if (typeof x === "string") {
  } else if (typeof x === "number") {
  } else {
    // x 是 never
    const _never: never = x;
  }
}
```

### 面试高频真题代码示例

```ts
// 1. tuple 越界问题
let tuple: [number, string] = [1, "hi"];
tuple[2] = 100; // 报错（正常）
tuple.push(100); // 居然可以！历史遗留问题，TS 4.0 后仍保留

// 2. unknown vs any
let val: unknown = "hello";
val.toUpperCase(); // 报错，必须先判断
if (typeof val === "string") val.toUpperCase(); // ok

// 3. never 在联合类型中的“消失”特性（穷尽性检查）
type Fruit = "apple" | "banana" | "orange";
function eat(fruit: Fruit) {
  switch (fruit) {
    case "apple":
      /* ... */ break;
    case "banana":
      /* ... */ break;
    default:
      const _exhaustiveCheck: never = fruit; // 如果漏了 orange 这里就会报错！
      throw new Error(_exhaustiveCheck);
  }
}

// 4. unique symbol（真正唯一的常量）
declare const sym: unique symbol;
type MyKey = typeof sym; // 只能是这个具体 symbol
```
