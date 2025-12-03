下面是 TypeScript 所有基础类型 + 常考类型的完整总结（2025 年最新语法），直接复制粘贴就能用，带示例 + 面试常问点。

| 类型           | 写法示例                                                                                                        | 说明 + 常见坑 + 面试重点                                                                                                     |
| -------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Boolean**    | `let isDone: boolean = false;`                                                                                  | 最简单的 true/false                                                                                                          |
| **Number**     | `let num: number = 42;`<br>`let hex: number = 0xff;`<br>`let bin: number = 0b1010;`                             | 支持十进制、十六进制、二进制、ES2021+ 还支持 BigInt（`let big: bigint = 100n;`）                                             |
| **String**     | `let name: string = "Alice";`<br>`let str: string = `age: ${num}`;`                                             | 模板字符串也要符合 string 类型                                                                                               |
| **Symbol**     | `const sym1: symbol = Symbol('key');`<br>`const sym2: unique symbol = Symbol('key');`                           | `unique symbol` 是字面量类型，常用于常量键（TS 3.7+）                                                                        |
| **Array**      | `let list1: number[] = [1, 2, 3];`<br>`let list2: Array<number> = [1, 2, 3];`                                   | 两种写法等价，推荐第一种更简洁                                                                                               |
| **Tuple** 元组 | `let tuple: [string, number, boolean] = ["hello", 10, true];`                                                   | 长度和类型都固定！越界赋值会报错<br>`tuple.push(999)` 可以（历史遗留 bug）<br>TS 4.0+ 可选/剩余元素：`[string, ...number[]]` |
| **Enum** 枚举  | `enum Color { Red, Green = 5, Blue }`<br>`let c: Color = Color.Blue; // 6`                                      | 默认从 0 开始，可手动赋值<br>常数枚举 `const enum` 编译后会被内联<br>字符串枚举：`enum Direction { Up = "UP" }`              |
| **Any**        | `let anything: any = 4; anything = "string";`                                                                   | 关闭类型检查，什么都能赋，尽量避免！                                                                                         |
| **Unknown**    | `let userInput: unknown = "maybe string";`<br>`if (typeof userInput === "string") { userInput.toUpperCase(); }` | 更安全的 any，必须先做类型缩小才能操作（TS 3.0+ 推荐代替 any）                                                               |
| **Void**       | `function log(msg: string): void { console.log(msg); }`                                                         | 只能赋 `undefined` 和 `null`（非严格模式下）<br>永远不会有返回值                                                             |
| **Null**       | `let n: null = null;`                                                                                           | 本身就是一个类型，只有值 null                                                                                                |
| **Undefined**  | `let u: undefined = undefined;`                                                                                 | 同上，只有值 undefined                                                                                                       |
| **Never**      | `function error(msg: string): never { throw new Error(msg); }`<br>`type T = string & never;`                    | 表示永远不会出现的值<br>1. 死循环 2. 总是抛错 3. 穷尽性检查（switch 里漏了 case）                                            |
| **Object**     | `let obj: object = { name: "Alice" };`<br>`obj = [1,2,3]; obj = () => {}`                                       | 表示非原始类型（不是 number/string/boolean/symbol/null/undefined）<br>不推荐用，信息太少                                     |
| **object**     | 小写 object：表示所有非原始类型（不推荐）                                                                       | 同上                                                                                                                         |
| **Object**     | 大写 Object：JS 原生的 Object 构造函数类型（包含所有原型方法）                                                  | 几乎不用，面试偶尔考区别                                                                                                     |
| **{}**         | `let empty: {} = 123; empty = "hello";`                                                                         | 空对象类型，但可以赋任何值（除了 null/undefined），因为所有值都有 toString() 等方法<br>常被误用！                            |

### 面试高频真题代码示例

```ts
// 1. tuple 越界问题
let tuple: [number, string] = [1, "hi"];
tuple[2] = 100; // 报错（正常）
tuple.push(100); // 居然可以！历史遗留问题，TS 4.0 后仍保留

// 2. unknown vs any
let val: unknown = "hello";
val.toUpperCase(); // 报错，必须先判断
if (typeof val === "string") val.toUpperCase(); // ok

// 3. never 在联合类型中的“消失”特性（穷尽性检查）
type Fruit = "apple" | "banana" | "orange";
function eat(fruit: Fruit) {
  switch (fruit) {
    case "apple":
      /* ... */ break;
    case "banana":
      /* ... */ break;
    default:
      const _exhaustiveCheck: never = fruit; // 如果漏了 orange 这里就会报错！
      throw new Error(_exhaustiveCheck);
  }
}

// 4. unique symbol（真正唯一的常量）
declare const sym: unique symbol;
type MyKey = typeof sym; // 只能是这个具体 symbol
```

### 一句话总结记忆口诀（背下来面试无敌）

```
boolean number string symbol → 原始
[] / Array<T> → 普通数组
[x,y,z] → tuple 元组
enum → 枚举
any → 啥都行（别用）
unknown → 啥都行但必须先检查（推荐）
void → 没返回值
null & undefined → 两个“空”
never → 永远到不了
object / {} / Object → 三个“坑”，慎用
```

需要我出 20 道选择/代码填空题帮你练手吗？随时说！
