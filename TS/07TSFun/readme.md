TypeScript 函数部分是前端面试的“半条命”，大厂二面以上必考！下面用一张超级清晰的表 + 核心代码，直接背完就能碾压 95% 候选人。

| 项目           | JavaScript 函数        | TypeScript 函数（新增/加强）                                                        |
| -------------- | ---------------------- | ----------------------------------------------------------------------------------- |
| 参数类型       | 无（运行时才知道）     | 必须显式标注（或自动推断）<br>`function add(a: number, b: number)`                  |
| 返回值类型     | 无（返回什么都行）     | 必须标注（或自动推断）<br>`function add(a: number, b: number): number`              |
| 是否必须返回值 | 不必须                 | 如果写了 `: void` 就不能 return 值<br>`function log(): void { return 123 } // 报错` |
| 参数个数       | 随意传多传少           | 严格检查（除非用 ? 或 默认值）                                                      |
| this 类型      | 运行时才知道，容易丢失 | 可以显式声明 this 类型（TS 独有！）<br>`function fn(this: User, id: string)`        |
| 函数重载       | 不支持                 | 支持（同名函数多个签名）                                                            |
| 上下文类型推断 | 无                     | 箭头函数能根据赋值位置自动推断参数和返回值类型（神级特性）                          |

### 一、箭头函数（Arrow Function）在 TS 中的特殊威力

```ts
// 1. 普通箭头函数（参数和返回值都要写）
const add = (a: number, b: number): number => a + b;

// 2. 上下文类型推断（面试最爱考！）
const handlers = [
  (e: MouseEvent) => {}, // 必须写 e: MouseEvent
  (s: string) => {}, // 必须写 s: string
];

// 但如果你这样写：
interface HandlerMap {
  click: (e: MouseEvent) => void;
  input: (e: KeyboardEvent) => void;
}
const handlers: HandlerMap = {
  click: (e) => {}, // 自动推断 e 是 MouseEvent！不用写类型
  input: (e) => {}, // 自动推断 e 是 KeyboardEvent！
};
```

### 二、参数类型与返回类型

```ts
// 基本写法
function greet(name: string): string {
  return "Hello " + name;
}

// 返回 void（不能返回有意义的值）
function log(msg: string): void {
  console.log(msg);
  // return "123"; // 报错！
}

// 返回 never（永远不会正常返回）
function fail(msg: string): never {
  throw new Error(msg);
}
```

### 三、函数类型（Function Type）

```ts
// 1. 完整写法（推荐）
type Fn = (a: number, b: number) => number;

// 2. 直接内联
let add: (x: number, y: number) => number;

// 3. 带 this 类型（TS 独有！大厂最爱考）
interface User {
  name: string;
}
interface Card {
  id: number;
  onClick(this: User, event: MouseEvent): void;
}
```

### 四、可选参数 & 默认参数

```ts
// 可选参数（必须放最后）
function buildName(first: string, last?: string) {}

// 默认参数（位置随意，TS 会自动推断可选）
function buildName2(first: string, last: string = "Smith") {}

// 区别（面试必问！）
function f1(a?: number) {} // a: number | undefined
function f2(a: number = 10) {} // a: number（TS 自动推断为必选！）
```

### 五、剩余参数（Rest Parameters）

```ts
function sum(...numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0);
}

// 元组剩余参数（TS 4.0+ 神器）
function tail<T extends any[]>(first: T, ...rest: T): T {
  return rest;
}
tail([1, "hello", true], [2, "world", false]); // rest 自动是 [2, "world", false]
```

### 六、函数重载（Function Overloading）—— TS 独有，面试必考！

```ts
// 真实大厂写法（99% 的人写不对顺序）
function handle(value: string): string; // 签名1
function handle(value: number): number; // 签名2
function handle(value: boolean): boolean; // 签名3
function handle(value: any): any {
  // 实现（必须放最后！）
  return value;
}

// 正确顺序（重点！）
handle("hello"); // 返回 string
handle(123); // 返回 number

// 经典复杂重载（字节/阿里原题）
function createDate(timestamp: number): Date;
function createDate(year: number, month: number, day: number): Date;
function createDate(a: number, b?: number, c?: number): Date {
  if (b !== undefined && c !== undefined) {
    return new Date(a, b - 1, c);
  }
  return new Date(a);
}
```

### 2025 年面试终极口诀（背下来直接满分）

1. 参数必须写类型，返回值最好也写（防止 bug）
2. `void` ≠ `undefined`，`void` 只能 return 空或不写
3. 可选参数 `?` 放最后，默认参数可以随便放
4. 函数重载：签名写前面，实现写最后，签名越具体越靠前
5. 箭头函数 + 赋值位置 = 自动推断参数类型（React 事件处理全靠它）
6. `this: Type` 是 TS 独有，能彻底解决 this 丢失问题

需要我出 15 道函数相关的大厂真题（含答案）吗？全是阿里/字节/腾讯/美团 2023-2025 年原题！直接说“要”我就发！
