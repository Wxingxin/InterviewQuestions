下面这些是 TypeScript 中用来**在运行时或编译时进行类型缩小（Type Narrowing）**的最常用工具，面试和实战都超级高频。直接看图记最快：

| 关键字/方式         | 语法示例                                                                 | 作用 + 类型缩小效果                                                                                 | 常见场景 + 坑点                                                                                                 |
|---------------------|--------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| **in**              | ```ts
| **typeof**          | ```ts\nif (typeof val === "string") { val.toUpperCase() }\n```          | 原始类型检查（string、number、boolean、undefined、object、function、symbol、bigint）         | 最常用！只能检测 JS 原始类型<br>`typeof null === "object"` 是历史遗留 bug                                     |
| **instanceof**      | ```ts\nif (err instanceof Error) { err.message }\n```                   | 检查是否是某个类的实例（构造函数）                                                          | 只能用于 class，不能用于 interface<br>需要运行时构造函数存在                                                    |
| **自定义类型保护**  | ```ts\nfunction isString(x: any): x is string {\n  return typeof x === "string";\n}\n``` | 返回值写成 `x is string` 这种**类型谓词**，TS 就相信你                                      | 最强大！可以自己定义任意复杂判断逻辑                                                                            |

### 完整实战对比表（直接背这张表就够了）

| 场景                                     | 推荐写法                                     | 缩小后类型                     | 备注                                                                 |
|------------------------------------------|----------------------------------------------|--------------------------------|----------------------------------------------------------------------|
| 区分 string 还是 number                  | `typeof val === "string"`                    | string                         | 99% 的情况都用这个                                                   |
| 区分 undefined / null                    | `val != null` 或 `val !== undefined && val !== null` | 非 null/undefined            | `val != null` 是最简写法（TS 官方推荐）                              |
| 区分数组还是对象                         | `Array.isArray(arr)`                         | arr is any[]                   | 比 `typeof arr === "object"` 更精准                                  |
| 判断是否是 Error 实例                    | `err instanceof Error`                       | Error                          |                                                                      |
| 判断对象是否有某个属性                   | `"name" in obj`                              | { name: string } 的子集        |                                                                      |
| 判断对象是否有某个方法并区分类型         | `"swim" in animal`                           | Duck 类型                      | 常用于联合类型：`Cat | Duck`                                         |
| 自定义：判断是否是字符串数组             | `isStringArray(arr): arr is string[]`        | string[]                       | 超级实用                                                             |
| 自定义：判断是否是管理员用户             | `isAdmin(user): user is AdminUser`           | AdminUser                      | 实际项目中经常这么写                                                 |

### 经典自定义类型保护写法（模板，直接抄）

```ts
// 1. 基础版
function isString(x: unknown): x is string {
  return typeof x === "string";
}

// 2. 对象结构判断
interface Fish { swim(): void }
interface Bird { fly(): void }
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as any).swim !== undefined;
  // 或者 return "swim" in pet;
}

// 3. 数组元素判断
function isStringArray(arr: unknown): arr is string[] {
  return Array.isArray(arr) && arr.every(item => typeof item === "string");
}

// 4. 实际使用（类型自动缩小！）
function getLength(x: string | string[]) {
  if (isStringArray(x)) {
    return x.length;           // x 是 string[]
  } else {
    return x.length;           // x 是 string（因为上面已经排除）
  }
}
```

### 面试必考组合题（99% 会问）

```ts
type ID = string | number;

function printID(id: ID) {
  // 下面哪几种写法能让 id.toUpperCase() 通过编译？
  
  // 正确写法 1：typeof
  if (typeof id === "string") {
    console.log(id.toUpperCase()); // ok
  }

  // 正确写法 2：自定义类型保护
  if (isString(id)) {
    console.log(id.toUpperCase()); // ok
  }

  // 错误写法：in 没用，因为 string 和 number 都是原始值，没有属性
  if ("toUpperCase" in id) { } // 永远 false

  // 错误写法：instanceof 只能用于 class
  if (id instanceof String) { } // 不要这么写！String 对象和 string 原始值不同
}
```

### 一句话总结记忆口诀

- `typeof` → 原始值（string/number/boolean/undefined/function/symbol/bigint）  
- `instanceof` → 类实例（new 出来的）  
- `in` → 对象有无某个属性  
- `x is T` → 万能自定义类型保护，写复杂逻辑就靠它

掌握这四个，类型缩小基本无敌了！  
需要我出 15 道类型缩小综合练习题（带答案）吗？随时说！