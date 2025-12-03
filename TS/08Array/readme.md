TypeScript 数组部分虽然基础，但大厂面试（尤其是阿里、字节、腾讯）特别爱在数组上挖**类型细节坑**。下面用一张最强总结表 + 实战代码，直接背完就能在面试中“无阵”！

| 项目                  | JavaScript 语法                                   | TypeScript 独有类型细节 + 常见坑（面试必考）                                                                 |
|-----------------------|---------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| **基本声明**          | `const arr = [1,2,3]`                             | ```ts
| **只读数组**          | 无                                                | `ReadonlyArray<T>` 或 `readonly T[]`<br>不能 push/pop/mutate<br>`const` + `as const` 也能得到只读元组                 |
| **数组解构**          | `const [a,b] = arr`                               | 类型自动推断 + 可手动标注<br>```ts<br>const [head, ...tail] = arr      // head: number, tail: number[]<br>const [x]: [string] = ["hi"] // 强制长度``` |
| **展开运算符**        | `[...arr1, ...arr2]`                              | 类型安全！不同类型不能展开<br>```ts<br>const a: number[] = [1,2]<br>const b: string[] = ["x"]<br>[...a, ...b] // 报错！``` |
| **遍历方式**          | `for...of`、`forEach`、`map` 等                   | `for...in` 是坑！遍历的是索引（string）<br>推荐 `for of` 或 `entries()`                                          |

### 核心代码 + 面试高频坑（99% 的人会栽）

```ts
// 1. 解构类型推断（神级）
const arr = [1, "hello", true] as const
const [id, name, isAdmin] = arr
// id: 1, name: "hello", isAdmin: true（字面量类型！）

// 2. 解构 + 剩余元素（超级实用）
const [first, ...rest] = [1,2,3,4,5]
// first: number
// rest: number[]

// 3. 强制长度解构（大厂最爱考）
type Point = [number, number]
const p: Point = [10, 20]
const [x, y, z] = p          // 报错！z 多余
const [a, b] = p             // OK

// 4. 展开运算符类型检查（2024 字节原题）
const nums: number[] = [1,2,3]
const strs: string[] = ["a","b"]
const mixed = [...nums, ...strs]   // 报错！不能混类型展开

// 5. as const + 展开 = 完美只读元组复制
const tuple = [1, "hi", true] as const
const copy = [...tuple]              // 类型仍是 readonly [1, "hi", true]
```

### 数组遍历方式对比表（面试必背）

| 方式                 | 返回值类型                              | 是否推荐 | 备注                                      |
|----------------------|-----------------------------------------|----------|-------------------------------------------|
| `for (const v of arr)` | `v: number`                            | 强烈推荐 | 真正遍历值，最清晰                        |
| `arr.forEach(v => )`   | `v: number`                            | 推荐     | 不能 break/return                         |
| `arr.map(v => )`       | `(v: number, i: number) => T`          | 推荐     | 返回新数组                                |
| `for (const i in arr)` | `i: string`（索引是 string！）         | 绝对禁用 | 坑！还会遍历原型链上的可枚举属性          |
| `for (let i=0; i<arr.length; i++)` | `i: number`                        | 可用     | 传统写法，需要手动控制                    |
| `arr.entries()`        | `IterableIterator<[number, T]>`        | 高阶推荐 | 可以同时拿到 index 和 value               |

### 2025 年大厂面试必考 5 题（直接上）

1. ★★ 下面代码哪里会报错？
   ```ts
   const a: readonly number[] = [1,2,3]
   a.push(4)           // 报错
   const b = [...a, 4] // OK！展开后是新数组
   ```

2. ★★★ 实现一个类型安全的 tail 函数
   ```ts
   function tail<T extends any[]>(arr: T): T extends [any, ...infer Rest] ? Rest : never {
     const [, ...result] = arr
     return result as any
   }
   const t = tail([1, "2", true])   // ["2", true]
   ```

3. ★★ 为什么不能这样写？
   ```ts
   const scores: number[] = [90, 85]
   for (const i in scores) {
     console.log(scores[i])   // i 是 string！可能出 bug
   }
   ```

4. ★★★★ 字节 2024 原题：实现类型安全的 zip 函数
   ```ts
   function zip<A extends any[], B extends any[]>(
     a: A, b: B
   ): Array<[A[number], B[number]]> {
     // 实现
   }
   zip([1,2,3], ["a","b"])   // [[1,"a"], [2,"b"]]
   ```

5. ★★ as const 的魔法
   ```ts
   const config = {
     api: "https://api.com",
     timeout: 5000
   } as const
   // config.api = "xxx" // 报错！整个对象变只读
   ```

### 一句话终极口诀（贴屏幕边框）

- 声明数组用 `T[]`，只读用 `readonly T[]` 或 `as const`
- 解构 + 剩余 = 自动推断 head + tail 类型
- 展开只能同类型，不能 number[] 和 string[] 混
- 遍历永远用 `for of`，`for in` 是雷区
- 想得到字面量数组/元组 → 结尾加 `as const`

需要我现在就发「数组 + 元组 + readonly + as const」10 道大厂原题（含答案）吗？直接说“要”我就发！祝你面试起飞！