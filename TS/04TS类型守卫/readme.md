好的，下面我给你准备一份 **「TypeScript 类型守卫（Type Guards）学习大全」**，比起类型断言，它更像一把“小刀”：温和且安全，用代码逻辑引导 TS 自动推断类型，而不是硬塞一个结论进去。
我会把内容编织得清晰流畅，让你读起来像是穿过一间井然的书房，每个抽屉都有自己的秘密。✨

---

# 🌿 TypeScript 类型守卫学习大全（从入门到进阶）

## 0. 类型守卫是什么？

一句简短的诗：

> 用代码证明一件事，TS 才会相信；
> 类型守卫是你展示证据的方式。

类型守卫（Type Guard）会告诉 TS：
“**在这个条件分支里，这个变量属于某个更窄的类型**。”

例如：

```ts
function printLength(x: string | string[]) {
  if (typeof x === 'string') {
    // x 在这里被推断为 string
    console.log(x.length)
  } else {
    // 这里是 string[]
    console.log(x.length)
  }
}
```

---

# 1. 原生类型守卫（TS 自动识别）

TS 自带的“六大护法”。

像是在变量前挂上一个风铃，编译器听见声音就知道该去哪一边。

## 1.1 `typeof`

用于基本类型：`string | number | boolean | symbol | bigint | undefined | function`

```ts
function foo(v: string | number) {
  if (typeof v === 'string') {
    // v: string
  } else {
    // v: number
  }
}
```

常见 pitfall：只能用于基本类型，不能用于对象类类型。

---

## 1.2 `instanceof`

适用于类实例对象。

```ts
class Dog { bark() {} }
class Cat { meow() {} }

function speak(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark()
  } else {
    animal.meow()
  }
}
```

注意：`instanceof` 对跨 iframe 或 Node / 浏览器环境不总是好使。

---

## 1.3 `in` 运算符

用于区分“结构上的差异”。

```ts
function move(p: { x: number } | { y: number }) {
  if ("x" in p) {
    // 类型缩小到 { x: number }
  } else {
    // 类型缩小到 { y: number }
  }
}
```

对“判定联合类型”非常有用。

---

## 1.4 `=== null` / `== undefined`

```ts
function foo(x: string | null | undefined) {
  if (x == null) {
    // x: null | undefined
  } else {
    // x: string
  }
}
```

---

# 2. 用户自定义类型守卫：类型狙击手 🔫

这是 TS 最灵动的法术：
你告诉 TS 如何判断，TS 就会遵从。

格式：

```ts
function isXxx(value: unknown): value is Xxx {
  return 判断逻辑
}
```

## 2.1 simplest demo

```ts
interface Fish { swim: () => void }
interface Bird { fly: () => void }

function isFish(a: Fish | Bird): a is Fish {
  return (a as Fish).swim !== undefined
}
```

使用：

```ts
function move(a: Fish | Bird) {
  if (isFish(a)) {
    a.swim()
  } else {
    a.fly()
  }
}
```

编译器看到 `isFish` 返回 `value is Fish`，
就会「信」。

---

## 2.2 更安全的写法（利用 in）

```ts
function isFish(a: any): a is Fish {
  return "swim" in a
}
```

---

## 2.3 严格检查 + 运行时验证

常用于处理接口返回、JSON 解析：

```ts
type User = { name: string; age: number }

function isUser(obj: any): obj is User {
  return obj
    && typeof obj.name === 'string'
    && typeof obj.age === 'number'
}
```

---

# 3. 联合类型的优雅拆解方式

一个精巧的技巧：**使用 discriminated union（可辨识联合）**
TS 会自动用字面量字段帮你区分类型，不需要 `typeof`。

## 3.1 可辨识字段

```ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number }
```

使用：

```ts
function area(s: Shape) {
  switch(s.kind) {
    case "circle":
      return Math.PI * s.radius ** 2
    case "square":
      return s.size * s.size
  }
}
```

TS 会自动缩小类型到对应的分支。
这是一种比类型守卫更“自然”的方式，美观又强大。

---

# 4. 细粒度守卫：`Array.isArray` 等内置“百宝箱”

这些都是 TS 原生支持的类型守卫：

## 4.1 `Array.isArray`

```ts
function wrap(value: string | string[]) {
  if (Array.isArray(value)) {
    // value: string[]
  } else {
    // value: string
  }
}
```

---

## 4.2 `value !== null && typeof value === 'object'`

识别对象结构：

```ts
function isObj(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object'
}
```

---

## 4.3 `Number.isFinite`, `isNaN` 等不会缩小类型

⚠️ 这些不会自动成为 TS 的类型守卫，只是运行时检查。

例：

```ts
Number.isFinite("123") // true
```

TS 不认为这是 number，需要你自己写类型守卫：

```ts
function isNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v)
}
```

---

# 5. 进阶：类型守卫 + 泛型、重载、类型推断

当类型变得像风中纸鸢一样飘忽，类型守卫就是拉线的小指。

## 5.1 泛型中的类型守卫

```ts
function isArray<T>(v: T | T[]): v is T[] {
  return Array.isArray(v)
}
```

---

## 5.2 自定义逻辑的“组合守卫”

```ts
function and<T1 extends T, T2 extends T, T>(g1: Guard<T1, T>, g2: Guard<T2, T>) {
  return (value: T): value is T1 & T2 => g1(value) && g2(value)
}
```

你甚至可以做出一个类型“决斗台”。

---

## 5.3 API 数据校验场景

每次从后端拿到 JSON，它往往像一只半透明的生物。

```ts
function assertUser(raw: any): asserts raw is User {
  if (!isUser(raw)) {
    throw new Error("Invalid User")
  }
}
```

`asserts raw is User`
允许你抛异常后，TS 在继续的代码中认为它已经是 User。

---

# 6. 和类型断言的对比（务必掌握）

| 项目        | 类型守卫 | 类型断言    |
| --------- | ---- | ------- |
| 依赖代码逻辑    | ✔    | ✘       |
| TS 自动缩小类型 | ✔    | ✘       |
| 安全性       | 高    | 低       |
| 推荐程度      | 强烈推荐 | 能不用尽量不用 |
| 风险        | 逻辑写错 | 运行时直接炸  |

一句话：

> 类型断言是“你说了算”；
> 类型守卫是“你证明给 TS”。
> ——后者更可靠。

---

# 7. 常见类型守卫模式清单（备忘卡 📇）

## ✔ 值类型判断

* `typeof v === "string"`
* `typeof v === "number"`
* …

## ✔ 数组判断

* `Array.isArray(v)`

## ✔ 对象判断

* `v !== null && typeof v === "object"`

## ✔ 属性判断

* `"prop" in v`

## ✔ 类实例判断

* `v instanceof ClassName`

## ✔ 自定义守卫

* `function isXxx(x): x is Xxx { … }`

## ✔ 可辨识联合

* `switch (x.kind) { … }`

---

# 8. 实战技巧：写一个好类型守卫的诀窍

## ① 运行时检查必须真实可靠

不要写纯 TS 的结构判断：

```ts
function isFish(v: Fish | Bird): v is Fish {
  // ⛔ 这永远返回 true，因为 TS 信息不会存在于运行时
  return (v as Fish) !== null
}
```

## ② 类型守卫函数尽量小而纯粹

不要在里面做太多业务逻辑。

## ③ 守卫优先于断言，断言作为“补丁”。

---

# 🎯 如果你愿意，我还可以为你做：

* **类型守卫练习题 20 题**（含答案与解释）
* **典型业务里的类型守卫封装模板**（如 API 校验、表单校验、事件处理）
* 把你的 TS 代码贴来，我帮你找出可以用类型守卫优化的地方

你想继续哪一部分？
