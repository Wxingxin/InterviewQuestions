

## 一、类型断言到底是什么？

一句话解释：

> **类型断言（Type Assertion）就是告诉 TypeScript：“相信我，这个值的类型是 X。”**
> 编译器不再唠叨，按你说的来。

它只在 **编译阶段** 起作用，对运行时没有任何影响。
**不会** 改变值本身，只是改变“TS 眼中的类型”。

常见用途：

* 你比 TS 更清楚一个变量的具体类型
* 从 DOM / 第三方库 / JSON 中拿到 `any` / `unknown`
* 为了复用 API、避免类型冲突而“强转”一下

---

## 二、两种写法：`as` vs 尖括号

### 1. `as` 语法（推荐）

```ts
const el = document.getElementById('app') as HTMLDivElement
```

### 2. 尖括号语法

```ts
const el = <HTMLDivElement>document.getElementById('app')
```

**区别：**

* 在 `.tsx` / React 中 **不能** 用尖括号（会和 JSX 冲突）
* 官方推荐使用 `as` 语法，更统一、安全

**结论：**

> 实际项目中，**一律用 `as`**，忘掉尖括号就行。

---

## 三、类型断言的基本规则与限制

### 1. 只能在“兼容”的类型之间断言

TS 会做一个大概的检查：

> **A 能不能被当成 B 使用？**

例如：

```ts
interface Cat {
  name: string
  meow(): void
}

interface Animal {
  name: string
}

const animal: Animal = { name: 'Tom' }

// ✅ Ok，Cat 拥有 Animal 的全部属性，可以当成 Animal 用
const a1: Animal = { name: 'Kitty', meow() {} } as Cat

// ❌ Error，不兼容，缺少 meow 方法
const c1: Cat = { name: 'Doggo' } as Animal
```

### 2. 不兼容也可以“强行断言”（不推荐）

通过 `unknown` 或 `any` 兜一圈：

```ts
const num = 123

// 两步
const str1 = (num as unknown) as string

// 或者经由 any
const str2 = (num as any) as string
```

这种叫 **双重断言（double assertion）**，
TS 基本放弃检查，相当于说：**我就是要这么干，你别管。**

---

## 四、常用场景大合集

### 1. DOM 操作

`document.getElementById` 返回的是 `HTMLElement | null`：

```ts
const el = document.getElementById('app')

// 报错：可能为 null
el.innerText = 'Hello'

// 使用类型断言
const elDiv = document.getElementById('app') as HTMLDivElement
elDiv.innerText = 'Hello'
```

如果你能确保一定存在，还可以配合非空断言（后面讲）：

```ts
const el = document.getElementById('app')! as HTMLDivElement
```

---

### 2. 处理 `any` / `unknown`

比如从接口拿到一坨 `any`：

```ts
function handleData(data: any) {
  const list = data as { id: number; name: string }[]
  list.forEach(item => {
    console.log(item.id, item.name)
  })
}
```

更推荐用安全一点的 `unknown`：

```ts
function handleData(data: unknown) {
  const list = data as { id: number; name: string }[]
  // 这里最好再加一点 runtime 校验更安全
}
```

---

### 3. JSON.parse 的结果

`JSON.parse` 返回 `any`：

```ts
const json = '{"name":"Alice","age":18}'

interface User {
  name: string
  age: number
}

const user = JSON.parse(json) as User
```

**注意：** TS 不会帮你验证 JSON 和 `User` 是否真的匹配，这只是“编译时相信你”。

---

### 4. 缩小联合类型（坏习惯示范）

有个联合类型：

```ts
type Foo = { type: 'a'; a: number } | { type: 'b'; b: string }
const f: Foo = { type: 'a', a: 123 }
```

**正确做法：用类型保护（type guard）/ `if` / `in` 判断：**

```ts
if (f.type === 'a') {
  // 这里 TS 自动推断为 { type: 'a'; a: number }
  console.log(f.a)
}
```

**错误做法（用断言乱来）：**

```ts
console.log((f as { type: 'b'; b: string }).b) // 极不推荐！
```

> 断言只是“骗过” TS，实际上如果不是 `type: 'b'`，这里就会出 runtime 错误。

---

### 5. 将更宽的类型断言成更窄的类型

```ts
interface Person {
  name: string
}

interface User extends Person {
  id: number
}

const p: Person = { name: 'Bob' }

// 你“说它是 User”
const u = p as User
// 其实运行时没有 id，访问 u.id 会是 undefined
```

这种断言**非常危险**，除非你 100% 确认这个对象本来就是完整的 User。

---

## 五、特殊“断言语法”：`!`、`as const`、`satisfies`

### 1. 非空断言 `!`（Non-null Assertion）

**作用**：告诉 TS：“我保证这里不是 `null` / `undefined`。”

```ts
const el = document.getElementById('app')

// ❌ 报错：可能为 null
// el.innerText = 'Hello'

// ✅ 非空断言
el!.innerText = 'Hello'
```

再比如：

```ts
let user: { name: string } | null = null

// ...某些逻辑里你确信已经赋值了
user = { name: 'Alice' }

// 这里 TS 还是觉得可能为 null
console.log(user!.name)
```

**风险：**
如果你判断错了，运行时直接爆 `Cannot read properties of null` 之类的错误。

> 建议：**非空断言只在你 100% 确信不为 null 时用，多数情况下宁愿加 if 判断。**

---

### 2. 确定赋值断言 `!`（Definite Assignment）

用于类的字段或者局部变量，告诉 TS：“虽然我没有在声明时赋值，但使用前肯定赋上了。”

```ts
class Person {
  name!: string  // 告诉 TS：使用前一定会被赋值

  constructor(name: string) {
    this.name = name
  }
}
```

局部变量也可以：

```ts
let x!: number

init()

console.log(x + 1)

function init() {
  x = 10
}
```

---

### 3. `as const`（const 断言）

`as const` 会把一个字面量值变成 **只读 + 最窄类型**。

```ts
const arr = [1, 2, 3] as const
// 类型变成 readonly [1, 2, 3]

const obj = {
  role: 'admin',
  level: 1
} as const
// 类型变成 { readonly role: 'admin'; readonly level: 1 }
```

常用在：

* Redux / 状态机：action type 常量
* 写配置 / 字典表
* 模拟枚举

配合联合类型：

```ts
const DIRECTIONS = ['up', 'down', 'left', 'right'] as const

type Direction = typeof DIRECTIONS[number]
// 相当于 'up' | 'down' | 'left' | 'right'
```

---

### 4. `satisfies`（不是断言，但很经典）

`x satisfies T` 会让 TS 检查 `x` 是否 **满足** 类型 `T`，
但保持 `x` 自己最具体的类型信息。

```ts
type User = {
  name: string
  age: number
}

const u = {
  name: 'Alice',
  age: 20,
  extra: 'xxx'
} satisfies User
```

* 会检查：`name`、`age` 是否符合 `User`
* 不会抹掉多余的 `extra` 属性
* `typeof u` 的真实类型仍然包含 `extra`

对比：

```ts
const u2 = {
  name: 'Alice',
  age: 20,
  extra: 'xxx'
} as User
// 这里 u2 被当成 User，extra 类型信息丢失
```

> 记忆：
>
> * `as`：**把它当成 T**
> * `satisfies`：**检查它是否至少是 T**

---

## 六、类型断言 vs 类型守卫（Type Guards）

很多新手会搞混：

* **类型断言**：`foo as Bar`
  👉 “我告诉 TS 它是 Bar，不用你推断”

* **类型守卫**：`if (typeof foo === 'string') { ... }`
  👉 “TS 通过代码逻辑推断：在这个范围里，foo 是 string”

更推荐的 **安全缩小类型方式**：

```ts
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function printLength(x: unknown) {
  if (isString(x)) {
    // 这里 x 被 TS 推断为 string
    console.log(x.length)
  }
}
```

> 优先使用：**类型守卫 / 泛型 / 重载**
> 断言是“最后的兜底方案”。

---

## 七、常见坑 & 实战建议

### 1. 断言不是“类型转换”

```ts
const num = 123
const str = num as unknown as string

console.log(typeof str) // 依然是 'number'
```

断言不会改变运行时的类型，只是改变 TS 的“认知”。

---

### 2. 滥用 `any` + 断言 = TS 形同虚设

```ts
function doSomething(data: any) {
  const user = data as User
  // ...
}
```

如果整个项目处处都是 `any` + `as XXX`，那就失去了使用 TS 的意义。
能定义清晰类型就尽量定义，
实在不清楚时优先 `unknown` + 类型守卫。

---

### 3. 尽量不用双重断言

```ts
const foo = 'hello'

// ❌ 极不推荐
const n = (foo as any) as number
```

除非真的到了你完全确定、TS 无法表达的那种场面，否则别这么玩。

---

### 4. 把断言“收口”在边界层

一个很好的实践：

> 把所有 `any` / 断言 放在 **系统边界**（例如：API 输入、DOM 操作），
> 内部业务逻辑尽量保持类型安全，少用断言。

例如：

```ts
// 边界层：处理接口数据
function parseUser(raw: any): User {
  // 这里用断言 & 运行时校验
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('invalid user')
  }
  return raw as User
}

// 内部逻辑：放心使用 User
function greetUser(user: User) {
  console.log('Hello', user.name)
}
```

---

## 八、快速记忆小抄

1. **写法**

   * 统一用：`value as Type`
   * TSX 中必须用 `as`

2. **场景**

   * DOM：`document.getElementById(...) as HTMLDivElement`
   * JSON：`JSON.parse(str) as Xxx`
   * any / unknown：`data as Xxx[]`
   * const 断言：`as const` 做只读和字面量类型

3. **特殊符号**

   * `!`：非空断言 / 确定赋值断言
   * `as const`：变成 readonly + 最窄字面量
   * `satisfies`：校验而不擦除类型（TS 4.9+）

4. **原则**

   * 能不用断言就不用（优先类型守卫、泛型）
   * 断言只用在你“比编译器更清楚”的地方
   * 远离 double assertion 和滥用 `any`

---

如果你愿意，我可以帮你：

* 出一套 **“类型断言专项练习题”**（由易到难）
* 或者把你项目里的 TS 代码贴一部分，我帮你 **逐行分析哪里用断言更合适/更安全**。
