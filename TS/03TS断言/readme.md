TypeScript 中的「断言」是开发中最常用也最容易被面试官扣细节的点。  
下面把所有断言一次性讲全、讲透，直接背会这张表 + 示例，面试随便问！

| 断言类型                                          | 写法语法                                          | 含义                                                                   | 适用场景 + 坑点                                                |
| ------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------- |
| **类型断言（Type Assertion）**                    | `value as Type` <br> 或 <Type>value（JSX 中禁用） | 告诉编译器：「我知道你在想啥，但我比你更清楚这个值到底是什么类型」     | 只能断言成「更具体」或「兼容」的类型，不能乱断言！             |
| **非空类型断言（Non-null Assertion Operator）**   | `value!`                                          | 告诉编译器：「这个值绝对不可能是 null 或 undefined，我打包票！」       | 常用于变量后面、属性访问、函数调用                             |
| **确定赋值断言（Definite Assignment Assertion）** | `property!: string`                               | 告诉编译器：「我知道这个属性还没初始化，但等会一定会被赋值，别报错了」 | 只用于类属性/变量声明，strictPropertyInitialization 开启时必备 |
| **双重断言（危险！）**                            | `value as any as TargetType`                      | 先断成 any，再断成任意类型 → 相当于关闭类型检查                        | 99.9% 情况下是坏味道，面试官看到直接扣分                       |

### 1. 类型断言（as）

```ts
// 正确用法：父类型 → 子类型（更具体）
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;

// 正确用法：联合类型 → 具体分支（配合类型缩小）
type Fish = { swim: () => void };
type Bird = { fly: () => void };
function getPet(): Fish | Bird {
  return Math.random() > 0.5 ? { swim() {} } : { fly() {} };
}
const pet = getPet();
if ("swim" in pet) {
  (pet as Fish).swim(); // ok
}

// 错误用法：不能断言成完全不兼容的类型
let num = 123;
// num as string; // 报错！除非先 as any
let str = num as any as string; // 可以，但极度危险
```

### 2. 非空类型断言（!）

```ts
function doSomething(str: string | null) {
  console.log(str!.toUpperCase()); // 我发誓 str 不会是 null
}

let username: string | undefined;
initUser(); // 某个函数会给 username 赋值
console.log(username!.length); // 确定赋值前就用了 → 危险！

// 常见场景：DOM 操作（2025 年主流写法）
const btn = document.getElementById("btn")!; // 告诉 TS 这个元素一定存在
btn.addEventListener("click", () => {});

// 链式调用
const len = process.env.API_URL!.length;
```

坑：如果真的为 null/undefined，运行时直接抛错：

```ts
let x: string | null = null;
x!.toLowerCase(); // 编译通过，运行时 Uncaught TypeError: Cannot read properties of null
```

### 3. 确定赋值断言（!: 在属性声明时）

```ts
class User {
  name!: string;        // 确定赋值断言
  age: number = 0;      // 正常初始化

  constructor() {
    this.init(); // 异步或后续才赋值
  }

  async init() {
    const data = await fetchUser();
    this.name = data.name; // 没这行 + 没 ! 会报错
  }
}

// 开启 strictPropertyInitialization 后必须加 !
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "strictPropertyInitialization": true  // 默认开启
  }
}
```

### 4. 三种断言对比记忆表（面试必背）

| 场景                         | 写法                 | 什么时候用？                   | 运行时会不会报错？   |
| ---------------------------- | -------------------- | ------------------------------ | -------------------- |
| 我知道联合类型具体是哪一个   | `x as string`        | 类型缩小不够智能时             | 断言错了 → 运行时炸  |
| 我确定这个值不是 null/undef  | `x!`                 | DOM、配置项、必传参数          | 是的！运行时直接抛   |
| 类属性还没赋值但后面一定会赋 | `name!: string`      | constructor 外赋值、依赖注入等 | 不会（编译器相信你） |
| 我要干坏事（基本别用）       | `x as any as string` | 极少数和旧代码对接时           | 不会，完全关闭检查   |

### 面试官最爱问的 5 道题（直接背答案）

1. `as const` 是不是类型断言？  
   不是！它是字面量类型推断（const assertion），和 as 完全不同。

2. 以下代码哪里会报错？

   ```ts
   let a: string | undefined;
   console.log(a.length);
   console.log(a!.length);
   ```

   第一行编译报错，第二行编译通过但运行时报错。

3. 非空断言和可选链哪个更好？

   ```ts
   user?.profile?.name; // 推荐！安全
   user!.profile!.name; // 危险！容易炸
   ```

4. 怎么关闭严格属性初始化检查？

   ```json
   "strictPropertyInitialization": false
   ```

   但不推荐关，改用 `!` 确定赋值断言更好。

5. 双重断言什么时候可以用？
   几乎永远不要用！能用双重断言的场景，99% 说明你的类型定义有问题。

需要我给你出 15 道类型断言专项练习题（含答案）吗？随时说！
