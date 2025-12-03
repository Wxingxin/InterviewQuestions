下面我给你展开一整册 **「TypeScript 函数学习大全」**，像一部层层翻页的机械书：
第一页是齿轮，第二页是折叠纸电路，最后是逻辑流动的雕花水管。
它讲函数，而不仅仅是“怎么写”，还讲它们如何在 TS 的类型宇宙里跳舞。

---

# 🌿 TypeScript 函数学习大全

**（从基础形态 → 参数系统 → 返回值 → this → 重载 → 泛型函数 → 高级玩法 → 实战宝典）**

---

# 0. 函数在 TS 世界的本质

> **函数是一座“输入类型 → 输出类型”的桥。**
> TS 的全部目标是让桥足够坚固，不要在半空掉东西。

典型函数类型示例：

```ts
type Fn = (x: number) => string
```

结构是：
**参数类型** → **返回类型**

---

# 1. 函数的三种写法

## 1.1 函数声明式

```ts
function add(a: number, b: number): number {
  return a + b
}
```

## 1.2 函数表达式（推荐：推断强）

```ts
const add = (a: number, b: number): number => a + b
```

## 1.3 用类型别名声明函数类型（常用）

```ts
type Add = (a: number, b: number) => number
```

## 1.4 用接口声明函数类型（较少用）

```ts
interface Add {
  (a: number, b: number): number
}
```

---

# 2. 参数系统：TS 的小齿轮阵列

## 2.1 可选参数 (?)

```ts
function greet(name?: string) {
  return `Hello ${name ?? 'stranger'}`
}
```

可选参数类型自动变为：`string | undefined`。

---

## 2.2 默认参数

```ts
function inc(x: number = 1) {
  return x + 1
}
```

默认参数仍然是同一个类型。

---

## 2.3 剩余参数（Rest Parameters）

```ts
function sum(...nums: number[]) {
  return nums.reduce((a, b) => a + b, 0)
}
```

这是一个显式的“捕获器”。

---

## 2.4 参数结构类型

```ts
function draw({ x, y }: { x: number; y: number }) {
  return x + y
}
```

常用于 React / Node 风格的 API。

---

# 3. 返回类型：Explicit vs Inferred（显式 vs 推断）

## 3.1 显式声明返回类型

```ts
function foo(): string {
  return 'x'
}
```

推荐用于复杂函数、公共 API。

---

## 3.2 由 TS 推断（更自然）

```ts
const foo = () => 'x' // 推断为 () => string
```

推荐用于局部函数、小函数。

---

## 3.3 永不返回：never

用在：

* 抛异常
* 无限循环
* 类型收窄失败

```ts
function fail(msg: string): never {
  throw new Error(msg)
}
```

never 类型像是返回类型世界里的黑洞。

---

# 4. this 的类型（函数内的“语气”）

普通 function 有 this，箭头函数没有。

## 4.1 指定 this 类型（极少见，但存在）

```ts
function play(this: { name: string }) {
  console.log(this.name)
}

play.call({ name: 'Cat' })
```

箭头函数永远获取外层 this，因此无法指定。

---

# 5. 函数重载：让函数说多种语言

> **重载提供多个“声明版本”，再由一个实现统一支撑。**

### 5.1 重载例子

```ts
function toArray(x: number): number[]
function toArray(x: string): string[]
function toArray(x: any) {
  return [x]
}
```

重载的价值是让 TS 能精确返回类型。

```ts
const r1 = toArray(123)   // number[]
const r2 = toArray('hi')  // string[]
```

---

# 6. 泛型函数：TS 的魔法核心

泛型函数 = **可抽象输入类型，并在内部保持类型关系的函数**。

## 6.1 基础泛型

```ts
function wrap<T>(value: T): T[] {
  return [value]
}

const a = wrap('hi')   // T = string → string[]
const b = wrap(123)    // number[]
```

---

## 6.2 限制泛型（extends）

```ts
function getName<T extends { name: string }>(obj: T) {
  return obj.name
}
```

---

## 6.3 多泛型参数

```ts
function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b]
}
```

---

## 6.4 泛型默认值

```ts
function createMap<T extends object = Record<string, any>>() {
  return {}
}
```

---

## 6.5 泛型推断是可以“从返回值反推”的

```ts
function make<T>(x: T) {
  return x
}

const num = make(123)  // 推断 T = number
```

TS 会根据调用处自动推断类型，不要手动指定除非必要。

---

# 7. 高级技巧：函数类型的高阶玩法

这是 TS 函数部分最“仙气”的地方。

---

## 7.1 higher-order function（HOF）

```ts
function withLog<T extends (...args: any[]) => any>(fn: T) {
  return (...args: Parameters<T>): ReturnType<T> => {
    console.log('call:', ...args)
    return fn(...args)
  }
}
```

使用：

```ts
const plus = (a: number, b: number) => a + b
const logged = withLog(plus)

logged(2, 3) // call: 2 3 → 5
```

---

## 7.2 参数与返回类型工具类型

TS 自带的函数相关工具类型：

| 工具类型                       | 作用        |
| -------------------------- | --------- |
| `Parameters<T>`            | 提取参数元组类型  |
| `ReturnType<T>`            | 提取返回类型    |
| `ConstructorParameters<T>` | 提取构造函数参数  |
| `ThisParameterType<T>`     | 提取函数 this |
| `OmitThisParameter<T>`     | 去掉 this   |

示例：

```ts
type P = Parameters<(a: number, b: string) => void>
// [number, string]
```

---

## 7.3 组合函数类型（compose / pipe）

```ts
function compose<A, B, C>(
  f: (x: A) => B,
  g: (y: B) => C
) {
  return (x: A): C => g(f(x))
}
```

---

## 7.4 使用交叉类型打造“多态函数”

```ts
type Fn = ((x: number) => string) & ((x: string) => number)
```

这种方式用于声明“既能处理 A，又能处理 B”的函数（但实现需小心）。

---

# 8. 实战模式全集（非常实用）

## 8.1 API 返回值规范

```ts
type ApiResult<T> = {
  code: number
  data: T
}
```

---

## 8.2 表单校验函数

```ts
function validate<T extends object>(data: T) {
  /* ... */
}
```

---

## 8.3 事件处理器

```ts
type Handler<E> = (event: E) => void
```

---

## 8.4 工厂函数模式

```ts
function createStore<S>(initial: S) {
  let state = initial
  return {
    getState() { return state },
    setState(newState: S) { state = newState }
  }
}
```

---

# 9. 常见陷阱与规避指南

## ⚠ 9.1 函数重载顺序必须从具体到通用

```ts
function fn(x: any): any   // ❌ 必须放最后
function fn(x: number): number
function fn(x: string): string
```

---

## ⚠ 9.2 任何函数如果返回 Promise，都应该显式标注

```ts
async function load(): Promise<User> {
  return await fetch('/api')
}
```

---

## ⚠ 9.3 不要滥用 any

如果需要“灵活的输入”，优先用泛型：

```ts
function identity<T>(x: T): T { return x }
```

---

# 🌙 最终折页：Pocket Card（函数小抄）

### ✔ 函数类型写法

* 声明式
* 表达式
* type 别名
* interface

### ✔ 参数系统

* 可选
* 默认
* rest
* 解构

### ✔ 返回类型

* string / number / void / never
* 推断优先，显式用于公开 API

### ✔ 重载

* 多个声明 + 一个实现
* 必须从更具体到更宽泛

### ✔ 泛型函数

* T、U、V
* extends 限制
* 泛型推断

### ✔ 高阶函数

* Parameters<T>
* ReturnType<T>
* compose/pipeline

---

# 如果你愿意，我可以继续为你做：

* **“函数 + 泛型 + 重载”专项练习 20 题**
* **帮你写一套项目级 TS 函数风格规范**
* **把你项目里的函数贴出来，我帮你做类型优化与重构**

你想继续哪一部分？
