当然可以 ✅
下面是我为你整理的 **TypeScript（TS）面试题大全**，涵盖 **基础 → 进阶 → 实战**，并包含详细解析。
这份清单可以帮助你应对前端面试中所有与 TS 相关的问题（尤其是 React + TS 项目中）。

---

## 🟢 一、TypeScript 基础面试题

### 1️⃣ TypeScript 与 JavaScript 的区别？

**答：**

| JS           | TS                      |
| ------------ | ----------------------- |
| 弱类型          | 强类型（静态类型检查）             |
| 无法在编译时发现类型错误 | 编译时可发现类型错误              |
| 动态语言         | 静态语言的特性                 |
| 无类型系统        | 有类型系统（如 interface、type） |
| 不支持装饰器、枚举    | 支持装饰器、枚举、泛型等            |

---

### 2️⃣ TypeScript 的类型有哪些？

常见类型：

```ts
number, string, boolean, null, undefined, any, unknown, void, never,
array, tuple, enum, object, Function, Symbol, bigint
```

---

### 3️⃣ `any`、`unknown`、`never`、`void` 的区别？

| 类型        | 含义           | 示例                                              |
| --------- | ------------ | ----------------------------------------------- |
| `any`     | 任意类型，关闭类型检查  | `let x: any = 123; x = 'abc'`                   |
| `unknown` | 任意类型，但不能直接操作 | `let x: unknown = 123; x.toFixed()` ❌           |
| `void`    | 无返回值         | `function log(): void { console.log('ok') }`    |
| `never`   | 不会返回（抛错或死循环） | `function error(): never { throw new Error() }` |

---

### 4️⃣ 什么是类型推断？

TS 会根据变量的初始值自动推断类型。

```ts
let a = 123; // 推断为 number
a = 'abc';   // ❌ 报错
```

---

### 5️⃣ 什么是类型断言（Type Assertion）？

告诉编译器你比它更了解类型。

```ts
const el = document.querySelector('#id') as HTMLDivElement;
(el as any).click();
```

---

### 6️⃣ interface 和 type 的区别？

| 对比点  | interface    | type        |
| ---- | ------------ | ----------- |
| 扩展性  | 可以 `extends` | 可以交叉（`&`）   |
| 合并声明 | ✅ 可以         | ❌ 不可以       |
| 能定义  | 对象、函数、类      | 一切类型（含联合类型） |

```ts
interface A { x: number }
interface A { y: number } // ✅ 合并声明
type B = { x: number } & { y: number } // ✅ 用交叉实现
```

---

### 7️⃣ 可选属性与只读属性？

```ts
interface User {
  readonly id: number; // 只读
  name?: string; // 可选
}
```

---

### 8️⃣ 枚举（Enum）了解吗？

```ts
enum Direction {
  Up = 1,
  Down,
  Left,
  Right
}
```

> 枚举底层是对象映射，编译后有双向映射。

---

## 🟡 二、TypeScript 进阶面试题

### 9️⃣ 泛型（Generics）是什么？

**定义可复用的类型模板。**

```ts
function identity<T>(value: T): T {
  return value;
}
identity<number>(1);
identity<string>('abc');
```

---

### 🔟 泛型约束

```ts
function logLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}
```

---

### 11️⃣ 泛型接口与泛型类

```ts
interface ApiResponse<T> {
  code: number;
  data: T;
}

class Store<T> {
  private data: T[] = [];
  add(item: T) {
    this.data.push(item);
  }
}
```

---

### 12️⃣ keyof、typeof、in、extends、infer

```ts
type Person = { name: string; age: number };
type Keys = keyof Person; // "name" | "age"

const p = { x: 1, y: 2 };
type P = typeof p; // {x:number; y:number}

type PartialPerson = { [K in keyof Person]?: Person[K] };

type T = number extends string ? true : false; // false

type Return<T> = T extends (...args: any[]) => infer R ? R : never;
```

---

### 13️⃣ Utility Types（工具类型）

常见工具类型：

| 工具              | 含义       |
| --------------- | -------- |
| `Partial<T>`    | 所有属性变可选  |
| `Required<T>`   | 所有属性变必填  |
| `Readonly<T>`   | 所有属性变只读  |
| `Pick<T, K>`    | 选择部分属性   |
| `Omit<T, K>`    | 去除部分属性   |
| `Record<K, T>`  | 构建对象类型   |
| `ReturnType<T>` | 提取函数返回类型 |
| `Parameters<T>` | 提取函数参数类型 |

---

### 14️⃣ 联合类型与交叉类型

```ts
type A = { name: string };
type B = { age: number };

type C = A & B; // 交叉 {name, age}
type D = A | B; // 联合：name 或 age
```

---

### 15️⃣ 类型守卫（Type Guards）

在运行时判断类型：

```ts
function print(x: string | number) {
  if (typeof x === 'string') {
    console.log(x.toUpperCase());
  } else {
    console.log(x.toFixed(2));
  }
}
```

---

### 16️⃣ 什么是声明合并（Declaration Merging）？

多个同名 `interface` 会自动合并属性。

```ts
interface A { x: number }
interface A { y: number }

const obj: A = { x: 1, y: 2 };
```

---

### 17️⃣ 什么是命名空间（namespace）？

旧式模块化方案，用于组织代码。

```ts
namespace Utils {
  export function sum(a: number, b: number) {
    return a + b;
  }
}
```

---

## 🔵 三、TypeScript 实战与源码级面试题

### 18️⃣ React + TS 中 Props 怎么写？

```tsx
interface Props {
  title: string;
  onClick?: () => void;
}

const Button: React.FC<Props> = ({ title, onClick }) => (
  <button onClick={onClick}>{title}</button>
);
```

---

### 19️⃣ 如何定义组件的 children？

```tsx
interface Props {
  children: React.ReactNode;
}
```

---

### 20️⃣ 如何在 TS 中定义 API 响应类型？

```ts
interface ApiResponse<T> {
  code: number;
  data: T;
  msg: string;
}

type User = { id: number; name: string };
const res: ApiResponse<User> = {
  code: 200,
  data: { id: 1, name: 'Alex' },
  msg: 'ok'
};
```

---

### 21️⃣ TS 中的 `as const` 有什么用？

将对象的所有属性变为只读 + 字面量类型。

```ts
const COLORS = {
  red: '#f00',
  blue: '#00f'
} as const;

// type: "red" | "blue"
type Color = keyof typeof COLORS;
```

---

### 22️⃣ type 与 interface 如何选择？

✅ 建议：

* **对象结构** → `interface`
* **复杂组合类型**（联合、交叉、函数签名）→ `type`

---

### 23️⃣ TS 编译配置中常见选项？

| 配置项             | 含义                     |
| --------------- | ---------------------- |
| `strict`        | 启用严格模式                 |
| `noImplicitAny` | 禁止隐式 any               |
| `target`        | 编译目标（ES5/ES6）          |
| `module`        | 模块化方案（ESNext、CommonJS） |
| `baseUrl`       | 相对路径基准目录               |
| `paths`         | 路径别名                   |

---

### 24️⃣ 什么是 Decorator（装饰器）？

实验性语法，用于修改类、属性、方法行为。

```ts
function Log(target: any, name: string) {
  console.log(`${name} 被调用`);
}

class Test {
  @Log
  say() {}
}
```

---

### 25️⃣ 你如何在项目中使用 TS 提高开发体验？

✅ 建议答案：

* 严格类型约束 props / state；
* 后端接口自动生成 TS 类型；
* 结合 ESLint + TS 检查；
* 利用泛型和 Utility Types 封装通用逻辑；
* 在大型项目中消除隐式 `any`。

---

如果你希望我帮你整理成：

> ✅ 一份「TypeScript 面试速记手册 PDF」
> 包含**题目 + 答案 + 核心语法总结**（适合打印复习）

我可以立即帮你生成。
要我帮你做这份 PDF 吗？
