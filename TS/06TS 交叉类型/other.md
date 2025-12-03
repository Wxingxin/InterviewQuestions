# TypeScript 交叉类型（Intersection Types）面试题 + 大全（2025 最新版）

背完这篇 + 手敲所有代码，阿里 P7、字节 T7、腾讯 T4 的交叉类型题直接秒杀！

### 1. 基础必考 10 道（每题 30 秒内答出）

| 题号 | 题目 | 答案 + 关键点 |
|------|------|---------------|
| 1 | 交叉类型用什么符号？ | `&`（和联合类型 `|` 完全相反） |
| 2 | `string & number` 是什么类型？ | `never`（没有任何值同时是 string 和 number） |
| 3 | `{a: string} & {b: number}` 是什么？ | `{ a: string; b: number }`（属性合并） |
| 4 | 同名属性类型不同会怎样？<br>`{a: string} & {a: number}` | `never`（冲突） |
| 5 | 同名属性都是字面量类型呢？<br>`{a: 1} & {a: 1}` | `{a: 1}`（相同可以合并） |
| 6 | 函数类型怎么交叉？<br>`(() => void) & (() => string)` | 最终是一个「既不返回又返回 string」的函数 → `() => never` |
| 7 | 可选属性交叉后还是可选吗？ | 不是！变成必选<br>`{a?: string} & {b?: number}` → `{a?: string; b?: number}`<br>但只要有一边是必选就变必选 |
| 8 | 交叉类型和接口继承的区别？ | 交叉类型更暴力，能合并类、函数、冲突类型 → never<br>interface 只能合并同名接口 |
| 9 | `T & {}` 有什么用？ | 什么都不干，保持原样（常用于泛型约束） |
|10 | `T extends U & V ? X : Y` 的意思？ | T 必须同时满足 U 和 V 两个约束 |

### 2. 高频代码题 20 道（面试必敲！）

```ts
// 1. 合并对象类型（最常见）
type A = { name: string };
type B = { age: number };
type C = A & B; // { name: string; age: number }

// 2. 同名属性冲突 → never
type Conflict = { x: string } & { x: number }; // never

// 3. 可选属性合并规则
type Opt1 = { a?: string };
type Opt2 = { a: string | undefined };
type Result = Opt1 & Opt2; // { a: string } 必选！

// 4. 函数类型交叉（超级坑）
type Fn1 = () => void;
type Fn2 = () => string;
type Fn3 = Fn1 & Fn2; // () => never

// 调用会报错：
// const fn: Fn3 = () => "hello"; // Error! 不能返回 string
// const fn: Fn3 = () => {};       // Error! 必须返回 string

// 5. 实际可用的函数交叉（大厂真题）
type Emitter = { on: (event: string, cb: () => void) => void };
type Logger = { log: (msg: string) => void };
type Plugin = Emitter & Logger; // 插件必须同时实现 on 和 log

// 6. 交叉类型实现多继承（经典）
class Dog { bark() { console.log('woof'); } }
class Bird { fly() { console.log('flap'); } }
type Pet = Dog & Bird;
const pet: Pet = {
  bark() {},
  fly() {}
}; // 必须实现两个

// 7. 交叉类型收窄（字节原题）
function extend<T, U>(first: T, second: U): T & U {
  return { ...first, ...second };
}
const x = extend({ name: 'zs' }, { age: 18 }); // { name: string; age: number }

// 8. 条件类型 + 交叉（阿里面试）
type IsNever<T> = T extends never ? true : false;
type T1 = IsNever<string & number>; // true

// 9. 交叉类型分发（腾讯原题）
type ToArray<T> = T extends any ? T[] : never;
type A1 = ToArray<string | number>; // string[] | number[]
type A2 = ToArray<(string | number) & {}>; // (string | number)[]  只分发一次

// 10. 实现 Pick（考察交叉）
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
};
// 等价于 T & { [P in K]: T[P] } 的简化版

// 11. 实现 DeepReadonly（美团原题）
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
};

// 12. 交叉类型实现混入（Mixin）经典模式
function applyMixins(derived: any, bases: any[]) {
  bases.forEach(base => {
    Object.getOwnPropertyNames(base.prototype).forEach(name => {
      if (name !== 'constructor') {
        derived.prototype[name] = base.prototype[name];
      }
    });
  });
}

// 13. 交叉类型 + 泛型约束（滴滴 P8）
function merge<T extends object, U extends object>(a: T, b: U): T & U {
  return Object.assign(a, b);
}

// 14. 为什么这个报错？
type Admin = { role: 'admin'; admin: true };
type User = { role: 'user' };
type Person = Admin | User;
type IsAdmin = Person extends Admin ? true : false; // boolean! 分发

// 正确写法：阻止分发
type IsAdmin2 = [Person] extends [Admin] ? true : false; // false

// 15. 终极杀招：实现交叉类型的属性合并（手写）
type Intersection<T> = (T extends any ? (x: T) => void : never) extends (x: infer I) => void ? I : never;

// 16. 交叉类型实现 Omit
type MyOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// 17. 交叉类型 + 条件类型实现 Diff
type Diff<T, U> = T extends U ? never : T;

// 18. 实现 Required（把所有属性变必选）
type MyRequired<T> = { [P in keyof T]-?: T[P] };

// 19. 实现 Partial（和 Required 相反）
type MyPartial<T> = { [P in keyof T]?: T[P] };

// 20. 交叉类型实现品牌类型（Brand）
type Email = string & { __brand: 'email' };
function createEmail(s: string): Email {
  return s as Email;
}
```

### 3. 面试官最爱追问的 10 个点

| 追问 | 标准答案 |
|------|----------|
| 交叉类型和联合类型区别？ | `A & B`：必须同时满足<br>`A \| B`：满足其一即可 |
| 为什么函数交叉后变成 never？ | 因为必须同时满足所有返回类型，矛盾 → never |
| 交叉类型能合并类吗？ | 能！生成一个必须实现所有方法的类型 |
| 为什么 `string & number` 是 never？ | 没有任何值同时是 string 和 number |
| 交叉类型比 interface 继承强在哪？ | 可以合并任意类型（函数、类、原始类型） |
| `T & U` 和 `U & T` 一样吗？ | 完全一样，顺序不影响 |
| 可选属性交叉后为什么变必选？ | 一边要求有，另一边没说不能有 → 最终必须有 |
| 怎么实现多重继承？ | 交叉类型 + applyMixins |
| 为什么 `extend({a:1}, {b:2})` 类型是精确的？ | 泛型捕获了字面量类型 |
| 交叉类型会分发吗？ | 不会！联合类型才会分发 |

### 终极记忆口诀（背下来就无敌）

```
交叉&：必须都满足，越交越严格
同名冲突 → never
函数交叉 → 返回值取交集 → 基本是 never
属性交叉 → 合并 + 可选变必选
类交叉 → 多继承神器
string & number → never
T & {} → 原样返回
T & unknown → T
T & any → any
```

把上面所有代码手敲 3 遍，2025 年所有交叉类型面试题直接闭眼秒！  
去吧，拿下 60w+ offer！