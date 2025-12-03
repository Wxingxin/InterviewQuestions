

### 1. 下面代码会报错吗？为什么？

```ts
let value: any = "hello";
let str: string = value as string;
```

**答案：不报错**  
考察点：any 可以断言成任何类型（any 是“顶级类型”）  
坑：很多人以为 any 也会被双重断言警告，其实不会。

### 2. 下面的双重断言会报错吗？（TS 5.4+）

```ts
let num = 123 as any as string;
let num2 = 123 as {} as string;
let num3 = 123 as unknown as string;
```

**答案（TS 5.4+）：**

- 第一行：警告或直接报错（具体看配置）
- 第二行：报错 TS2352（禁止 as any as T / as {} as T）
- 第三行：允许（unknown 是官方推荐的“安全双重断言”写法）

**2025 年正确做法：**

```ts
let str = 123 as unknown as string; // 唯一被允许的双重断言
```

### 3. 以下哪几种写法能让代码编译通过且运行时不报错？

```ts
const el = document.getElementById("input");

// 写法1
(el as HTMLInputElement).value;

// 写法2
el!.value;

// 写法3
(el as any).value;

// 写法4
(<HTMLInputElement>el).value;
```

**答案：只有写法 1 和写法 2 安全**  
写法 3 编译通过但运行时可能报错（el 为 null）  
写法 4 在 .tsx 文件中直接语法错误！

### 4. 怎么写一个永远不会返回的函数？（阿里面试真题）

```ts
function throwError(msg: string): never {
  throw new Error(msg);
}

// 正确用法
function process(value: string | null) {
  if (value === null) {
    throwError("value is null"); // 这里 value 被自动收窄为 string
  }
  console.log(value.length);
}
```

**考察：断言签名（asserts） vs never 的配合**

### 5. 写出两种“类型收窄”的正确方式（不使用 as）

```ts
// 情况1：JSON.parse 结果
const data = JSON.parse(jsonStr);

// 写法1（用户定义类型守卫）
function isUser(obj: any): obj is User {
  return obj && typeof obj.name === "string" && typeof obj.age === "number";
}

// 写法2（断言函数）
function assertIsUser(obj: unknown): asserts obj is User {
  if (!obj || typeof (obj as any).name !== "string") {
    throw new Error("Not a user");
  }
}
```

### 6. 以下代码哪里有问题？（字节/阿里真题）

```ts
interface Admin {
  role: "admin";
}
interface User {
  role: "user";
}

function handle(user: User | Admin) {
  if (user.role === "admin") {
    console.log(user.isAdmin); // Error！
  }
}
```

**正确写法（3 种）：**

```ts
// 1. 类型守卫函数
function isAdmin(u: User | Admin): u is Admin {
  return u.role === "admin";
}

// 2. 断言（不推荐）
if (user.role === "admin") {
  console.log((user as Admin).isAdmin);
}

// 3. 最好：加属性
interface Admin {
  role: "admin";
  isAdmin: true;
}
```

### 7. 为什么这个 as const 比类型断言更香？

```ts
// 写法1（类型断言）
const directions = ["left", "right"] as const;

// 写法2（错误！）
const directions = ["left", "right"] as ["left", "right"];
```

**答案：写法 2 永远报错！**  
因为字面量数组类型不能直接断言，必须用 `as const`

正确推断为：`readonly ["left", "right"]`  
而 `as ['left', 'right']` 是非法的语法

### 8. 以下哪种写法是“安全的类型断言”？

A. `value as any as string`  
B. `value as unknown as string`  
C. `value as string`（当 value 是 number 时）  
D. `String(value)`

**答案：只有 B 和 D 安全**  
B 是官方唯一允许的双重断言  
D 是运行时也安全的转换

### 9. 实现一个类型安全的 JSON.parse 封装（美团/字节真题）

```ts
function parseJson<T>(json: string): T {
  return JSON.parse(json) as T; // 这样写对吗？
}
```

**答案：错！极度危险！**

**2025 年标准写法（3 种）：**

```ts
// 写法1：返回 unknown + 手动校验（推荐）
function parseJson<T>(json: string): T {
  return JSON.parse(json) as unknown as T;
}

// 写法2：用 zod/yup 等运行时校验库（生产首选）
// 写法3：泛型约束 + 断言函数
function safeParse<T>(
  json: string,
  validator: (data: unknown) => data is T
): T {
  const data = JSON.parse(json);
  if (validator(data)) return data;
  throw new Error("Invalid data");
}
```

### 10. 终极难题：怎么消除这个红线？（阿里面试原题）

```ts
declare const event: Event;
(event.target as HTMLInputElement).value; // Error
```

**三种正确答案：**

```ts
// 1. 用 currentTarget（推荐！）
(event.currentTarget as HTMLInputElement).value;

// 2. 用户定义类型守卫
function isInputEvent(e: Event): e is InputEvent {
  return "target" in e && e.target instanceof HTMLInputElement;
}

// 3. 断言 + 非空
const target = event.target as HTMLElement;
if (target instanceof HTMLInputElement) {
  target.value; // OK
}
```

### 总结：2025 年面试官最想听的答案关键词

| 题目类型    | 标准答案关键词                          |
| ----------- | --------------------------------------- |
| 双重断言    | 禁止 any，允许 unknown as T             |
| DOM 操作    | currentTarget + ! 或类型守卫            |
| JSON.parse  | 返回 unknown + as unknown as T          |
| 类型收窄    | 类型守卫 > asserts > as 断言            |
| as const    | 字面量类型只能用 as const，不能直接断言 |
| 事件 target | 用 currentTarget 或 instanceof 判断     |

