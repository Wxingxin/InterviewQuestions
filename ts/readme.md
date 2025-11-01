
# 🧠 TypeScript 面试题大全（附经典案例 + 详解）

---

## 🧩 一、基础必会题（类型系统核心）

---

### **1️⃣ TypeScript 是什么？它和 JavaScript 有什么区别？**

**回答：**

* TypeScript 是 JavaScript 的超集，增加了静态类型检查和一些新特性。
* TS 在编译时进行类型检测，最终会编译成纯 JS 运行。

**区别：**

| 对比项  | JavaScript | TypeScript |
| ---- | ---------- | ---------- |
| 类型系统 | 动态类型       | 静态类型       |
| 检查时机 | 运行时        | 编译时        |
| 执行方式 | 直接执行       | 需先编译为 JS   |
| 错误发现 | 运行时报错      | 编译时报错      |

---

### **2️⃣ TypeScript 的优点是什么？**

✅ 编译期发现错误
✅ IDE 智能提示（类型推断）
✅ 更好的代码可维护性
✅ 支持面向对象特性（类、接口、泛型等）

---

### **3️⃣ TypeScript 中有哪些基本类型？**

```ts
let a: string = "hello";
let b: number = 42;
let c: boolean = true;
let d: undefined = undefined;
let e: null = null;
let f: any = "可以是任何类型";
let g: unknown = "未知类型";
let h: void = undefined;
```

> **拓展类型**：`never`, `enum`, `tuple`, `object`, `bigint`, `symbol`。

---

### **4️⃣ any、unknown、never 区别？**

| 类型        | 描述                | 典型使用场景       |
| --------- | ----------------- | ------------ |
| `any`     | 任意类型，不受类型检查       | 快速原型开发或迁移旧代码 |
| `unknown` | 安全版 any，必须先类型判断再用 | 不确定类型但要保证安全  |
| `never`   | 不会有返回值（永远不会执行完）   | 死循环、抛出错误的函数  |

```ts
function fail(msg: string): never {
  throw new Error(msg);
}
```

---

### **5️⃣ 类型推断是什么？**

TypeScript 会**自动推导变量类型**。

```ts
let count = 10;  // 自动推断为 number
count = "hello"; // ❌ 报错
```

---

### **6️⃣ 类型断言是什么？**

告诉编译器：“我比你更清楚这个类型。”

```ts
const el = document.getElementById("app") as HTMLDivElement;
el.innerText = "Hello TS!";
```

---

## 🧱 二、对象、类与接口篇

---

### **7️⃣ interface 与 type 的区别？**

| 特性   | interface | type        |
| ---- | --------- | ----------- |
| 语义   | 接口，描述对象结构 | 类型别名，描述任意类型 |
| 扩展   | extends   | & 交叉类型      |
| 合并声明 | ✅ 支持      | ❌ 不支持       |
| 泛型   | ✅ 支持      | ✅ 支持        |

---

### **8️⃣ class 中 public、private、protected 的区别？**

```ts
class Person {
  public name: string;    // 任何地方都能访问
  private age: number;    // 只能类内部访问
  protected gender: string; // 类和子类内部访问
}
```

---

### **9️⃣ implements 和 extends 区别？**

* `extends`：类继承另一个类。
* `implements`：类实现一个接口。

```ts
interface Flyable { fly(): void; }
class Bird implements Flyable {
  fly() { console.log("Bird flying"); }
}
```

---

### **10️⃣ 抽象类（abstract）和接口的区别？**

| 对比项    | 抽象类       | 接口    |
| ------ | --------- | ----- |
| 是否能有实现 | ✅ 可以有部分实现 | ❌ 不行  |
| 是否能实例化 | ❌ 不可以     | ❌ 不可以 |
| 用途     | 基类模板      | 类型规范  |

---

## 🔧 三、函数与泛型篇

---

### **11️⃣ 泛型是什么？**

> 泛型（Generics）允许定义函数、接口、类时不预设类型，让使用时再指定。

```ts
function identity<T>(arg: T): T {
  return arg;
}

identity<number>(10);
identity("hello");
```

---

### **12️⃣ 泛型约束怎么用？**

```ts
interface HasLength { length: number; }

function logLength<T extends HasLength>(arg: T): void {
  console.log(arg.length);
}

logLength("hello"); // ✅
logLength([1, 2, 3]); // ✅
```

---

### **13️⃣ 泛型接口与泛型类**

```ts
interface Box<T> {
  value: T;
}

class Container<T> {
  constructor(public content: T) {}
}
```

---

### **14️⃣ 函数类型声明有几种写法？**

```ts
// 1. 类型别名
type Add = (a: number, b: number) => number;

// 2. 接口写法
interface AddFn {
  (a: number, b: number): number;
}

// 3. 直接定义
const add = (a: number, b: number): number => a + b;
```

---

## ⚙️ 四、联合、交叉、类型守卫篇

---

### **15️⃣ 联合类型（Union）与交叉类型（Intersection）区别？**

```ts
type A = { name: string };
type B = { age: number };

type Union = A | B; // 取并集
type Inter = A & B; // 取交集（合并）

const u: Union = { name: "Tom" };
const i: Inter = { name: "Tom", age: 20 };
```

---

### **16️⃣ 类型守卫（Type Guards）是什么？**

用类型判断来**缩小变量类型范围**。

```ts
function printId(id: number | string) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id.toFixed(2));
  }
}
```

---

### **17️⃣ instanceof 和 in 关键字守卫**

```ts
if (obj instanceof Date) { ... }
if ("name" in obj) { ... }
```

---

## 🧬 五、进阶与工具类型篇

---

### **18️⃣ keyof 是什么？**

返回一个对象类型的键的联合类型。

```ts
interface Person {
  name: string;
  age: number;
}

type Keys = keyof Person; // "name" | "age"
```

---

### **19️⃣ typeof 的类型作用？**

获取变量的类型：

```ts
const person = { name: "Tom", age: 20 };
type PersonType = typeof person; // { name: string; age: number; }
```

---

### **20️⃣ Partial / Required / Pick / Omit 工具类型作用？**

```ts
interface User {
  id: number;
  name: string;
  age?: number;
}

type A = Partial<User>;   // 所有属性可选
type B = Required<User>;  // 所有属性必选
type C = Pick<User, "id">; // 只保留 id
type D = Omit<User, "age">; // 删除 age
```

---

### **21️⃣ Record 和 Exclude 用法？**

```ts
type Role = "admin" | "user";

type RoleMap = Record<Role, number>; // { admin: number; user: number }

type Status = "ok" | "error" | "loading";
type Filtered = Exclude<Status, "loading">; // "ok" | "error"
```

---

### **22️⃣ Readonly 和 ReturnType 用法**

```ts
type Point = Readonly<{ x: number; y: number }>;

function foo() {
  return { a: 1, b: 2 };
}
type FooReturn = ReturnType<typeof foo>; // { a: number; b: number }
```

---

## 💥 六、DOM 与实战篇

---

### **23️⃣ 如何在 TS 中操作 DOM？**

```ts
const btn = document.querySelector("#btn") as HTMLButtonElement;
btn.addEventListener("click", () => console.log("Clicked!"));
```

---

### **24️⃣ 如何在 TS 中定义事件处理函数？**

```ts
const handleInput = (e: Event) => {
  const input = e.target as HTMLInputElement;
  console.log(input.value);
};
```

---

### **25️⃣ 如何定义 API 响应类型？**

```ts
interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

async function getUser(): Promise<ApiResponse<{ name: string }>> {
  return { code: 200, data: { name: "Tom" }, message: "ok" };
}
```

---

## 🧭 七、超经典面试问答（高频题）

---

### **26️⃣ TS 编译流程是什么？**

```
TS 源代码 → 类型检查器 → 转换成 JS → 浏览器/Node 执行
```

---

### **27️⃣ TS 与 Babel 区别？**

| 对比项  | TypeScript  | Babel |
| ---- | ----------- | ----- |
| 主要功能 | 类型检查 + 语法转换 | 语法转换  |
| 输出   | JS          | JS    |
| 类型检测 | ✅ 有         | ❌ 没有  |

---

### **28️⃣ declare / declare global / declare module 用法？**

* `declare`：声明全局变量或模块类型；
* 常见于引入 JS 库时编写 `.d.ts` 声明文件。

```ts
declare const VERSION: string;
declare module "*.png";
```

---

### **29️⃣ interface 能否定义函数？**

可以：

```ts
interface Fn {
  (x: number, y: number): number;
}
```

---

### **30️⃣ TS 如何与 React / Vue 结合？**

* React：用 `React.FC<Props>` 或 `JSX.Element`；
* Vue3：在 `<script lang="ts">` 中使用；
* 都可利用类型推断、Props 校验、Hook 类型安全。

---

# ✅ 总结表：TS 面试知识结构图

```
基础类型 → 类型系统 → 对象/接口 → 类
  ↓
函数与泛型 → 联合/交叉类型 → 类型守卫
  ↓
工具类型（keyof、Pick、Omit 等）
  ↓
DOM + React/Vue 实战
  ↓
declare 声明与类型文件 → 编译机制与原理
```

---

是否希望我下一步帮你整理成：

> 📘 《TypeScript 面试速查手册（PDF）》——含题目 + 代码 + 答案 + 思维导图？

我可以帮你直接导出一份带格式的笔记版，让你面试前快速复习。是否生成？
