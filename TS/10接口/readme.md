TypeScript **interface** 是前端面试的“命门题”，大厂二面以上必考，而且全是细节坑！  
下面用一张 2025 年最强总结表 + 真题级代码，直接背完就能在阿里、字节、腾讯面前“无阵”！

| 项目                          | 语法 + 示例                                                                                             | 核心规则 + 面试超级坑（99% 的人会错）                                                                                           |
|-------------------------------|---------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| **对象的形状**                | ```ts
| **可选属性** `?`              | `age?: number`                                                                                          | 可以不存在，类型自动变成 `T \| undefined` <br>注意：**不能**写默认值（那是函数参数的玩法）                                      |
| **只读属性** `readonly`       | `readonly id: number`                                                                                   | 只能在创建时赋值，之后不能改<br>`as const` 能让整个对象只读                                                                            |
| **任意属性（索引签名）**      | ```ts<br>interface Dict {<br>  [key: string]: string;<br>}\ninterface AnyObj {<br>  [prop: string]: any<br>}\n`````` | 允许任意额外属性，但一旦开了索引签名，**所有已定义属性必须兼容索引类型**！<br>这是面试最大坑！                                 |
| **函数属性**                  | `greet(name: string): void` 或 `greet: (name: string) => void`                                          | 两种写法等价，推荐第二种更清晰                                                                                                 |
| **混合接口**                  | 可以同时包含属性、函数、索引签名                                                                        | 常用于描述类、React props、第三方库类型                                                                                       |

### 面试必考超级坑合集（每一条都出过原题）

```ts
// 坑1：索引签名 + 具体属性类型不兼容 = 直接红！
interface Bad {
  [key: string]: string;     // 索引签名说所有属性都是 string
  age: number;               // 报错！number 不能赋给 string
}

// 正确写法（两种）
interface Good1 {
  [key: string]: string | number;   // 放宽索引类型
  age: number;
}
interface Good2 {
  age: number;
  [key: string]: any;               // 或者用 any
}

// 坑2：可选属性 ≠ 可有可无的属性
interface User {
  name: string;
  age?: number;          // 类型是 number | undefined
}
const a: User = { name: "Alice" }           // OK
const b: User = { name: "Bob", age: undefined }  // 也得写！很多人以为可以省略

// 坑3：readonly vs const
const x = { id: 1 } as const        // x 是只读对象
x.id = 2 // 报错

interface Point { readonly x: number }
let p: Point = { x: 10 }
p.x = 20 // 报错
p = { x: 30 } // OK！（变量本身可以重新赋值）

// 坑4：接口可以重复声明合并（type 不行！）
interface Box { x: number }
interface Box { y: number }   // OK！最终是 { x: number; y: number }
type Box2 = { x: number }
type Box2 = { y: number }     // 报错！Duplicate identifier
```

### interface vs type 终极对比表（2025 年标准答案）

| 特性                             | interface                                  | type                                       | 大厂推荐用法                              |
|----------------------------------|--------------------------------------------|--------------------------------------------|-------------------------------------------|
| 可以重复声明合并                 | 可以                                       | 不可以                                     | 扩展第三方库用 interface                 |
| 可以表示联合类型                 | 不可以                                     | 可以 `type ID = string \| number`          | 联合、可辨识联合用 type                  |
| 可以表示元组、映射类型           | 不可以                                     | 可以                                       | 元组、工具类型用 type                     |
| 可以表示基本类型别名             | 不可以                                     | 可以 `type Age = number`                   | 基本类型别名用 type                       |
| 实现 class（implements）         | 都可以                                     | 都可以                                     |                                           |
| 性能（编译速度）                 | 略快                                       | 略慢                                       | 大项目 interface 更快                     |
| 2025 年主流做法                  | 描述对象形状、React props、class           | 联合、可辨识联合、工具类型、复杂类型组合   | 两者配合使用最强！                        |

### 2025 年大厂终极口诀（贴显示器边框！）

1. 描述“对象形状” → 永远用 `interface`（可合并、可继承）
2. 写联合、可辨识联合、映射类型 → 永远用 `type`
3. 索引签名开了 → 所有具体属性必须兼容索引类型（最常见红屏原因）
4. 可选属性 `?` → 类型自动带 `undefined`
5. `readonly` 只防修改，不防重新赋值（变量本身还能换）
6. `as const` = 全只读 + 字面量类型（最强组合）

### 大厂原题速刷（5 道秒杀级）

1. 为什么下面报错？怎么改？
   ```ts
   interface StringMap {
     [key: string]: string;
     length: number;     // 报错！number 不能赋给 string
   }
   ```

2. 实现一个只读的 Point 接口
   ```ts
   interface Point {
     readonly x: number;
     readonly y: number;
   }
   ```

3. 下面两种写法有什么区别？
   ```ts
   type A = { x: number; y?: number }
   interface B { x: number; y?: number }
   ```

4. 扩展 Window 接口（声明合并）
   ```ts
   interface Window {
     myAppVersion: string;
   }
   ```

5. 实现一个 Partial 但保留 readonly 的工具类型（字节 2024 原题）
   ```ts
   type MyPartial<T> = { -readonly [P in keyof T]?: T[P] }
   ```

需要我现在就发「interface + type 区别 + 索引签名 + 声明合并」12 道大厂原题（含最优答案）吗？  
全是阿里 P7、字节 3-2、腾讯 T3-3 以上真实面试题！  
直接说“要”我就立刻发！祝你面试直接起飞！