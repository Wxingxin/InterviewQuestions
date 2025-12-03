```js
function curry(fn) {
  const arity = fn.length;          // 记录原函数需要多少个参数
  function _curry(...args) {        // 内部收集器函数，用 rest 参数接收已传入的参数
    if (args.length >= arity) {     // 参数收集够了
      return fn.apply(this, args);  // 直接执行原函数
    } else {                        // 参数还不够
      return function (...moreArgs) { // 返回一个新函数，继续接收剩下的参数
        return _curry.apply(this, args.concat(moreArgs));
        // 把之前收集的参数 + 新传的参数合并，再次调用 _curry 继续判断
      };
    }
  }
  return _curry;  // 最外层返回这个“参数收集器”
}
```

### 举个超级清晰的例子

```js
function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);

console.log(curriedAdd(1)(2)(3));     // 6
console.log(curriedAdd(1, 2)(3));     // 6
console.log(curriedAdd(1)(2, 3));     // 6
console.log(curriedAdd(1, 2, 3));     // 6
```

### 一步步看执行过程（以 `curriedAdd(1)(2)(3)` 为例）

| 调用阶段                    | args.length | arity | 发生了什么                                                    |
|-----------------------------|-------------|-------|---------------------------------------------------------------|
| `curriedAdd(1)`             | 1           | 3     | 不够 → 返回新函数 A                                           |
| `A(2)` → 即 `_curry(1)(2)`  | 2           | 3     | 还是不够 → 返回新函数 B                                       |
| `B(3)` → 即 `_curry(1,2)(3)`| 3           | 3     | 够了！→ 执行 `add(1,2,3)` 返回 6                              |

关键是这句递归魔法：
```js
return _curry.apply(this, args.concat(moreArgs));
```
它把【之前收集到的参数】和【这次新传的参数】合并，再次扔进同一个 `_curry` 函数继续判断`。

### 为什么用 `fn.length`？—— 超级聪明的一招！

```js
const arity = fn.length;
```

`Function.prototype.length` 返回的是函数**形参的个数**（不包括 rest 参数）

```js
function foo(a, b, c) {}
console.log(foo.length); // 3

function bar(a, b, ...rest) {}
console.log(bar.length); // 2  只算 rest 之前的！
```

所以这段 curry 能自动适配任意参数个数的函数，太优雅了！

### 再看一个支持默认参数的例子

```js
const join = (a, b, c) => a + '-' + b + '-' + c;
const curriedJoin = curry(join);

console.log(curriedJoin(1)(2)(3));        // '1-2-3'
console.log(curriedJoin('_')('_')('_'));   // '_-_-_'
console.log(curriedJoin('★')('♥')('♠'));  // '★-♥-♠'
```

### 常见面试追问 & 完美回答

**面试官**：这个 curry 支持一次传多个参数吗？  
**你**：支持！只要累计参数够了就执行，比如 `curriedAdd(1, 2)(3)` 也行。

**面试官**：支持 this 绑定吗？  
**你**：支持！因为用了 `apply(this, ...)`，this 指向保持不变。

**面试官**：能提前占位吗？比如 `_ + 2 + 3` 这种？  
**你**：当前版本不行。要支持占位符需要更复杂的实现（lodash 那种），但这版已经是面试最优解。

### 终极精简版（很多人直接背这个）

```js
function curry(fn) {
  const arity = fn.length;
  return function curried(...args) {
    if (args.length >= arity) return fn(...args);
    return (...more) => curried(...args, ...more);
  };
}
```

用 ES6 箭头函数 + 函数名表达式，代码更短，逻辑完全一样！

### 总结：这段代码牛在哪儿？

| 优点                   | 说明                                      |
|------------------------|-------------------------------------------|
| 自动获取参数个数       | `fn.length` 超级聪明                      |
| 支持分步传参           | `(1)(2)(3)`、`(1,2)(3)` 都行               |
| 支持 this 绑定         | `apply(this, ...)` 保留上下文             |
| 无外部变量污染         | 完全闭包实现，干净优雅                    |
| 支持任意函数           | add / join / ajax 请求都能 curry          |

这才是真正的「面试满分柯里化实现」！背下来 + 能讲清楚过程 = 稳过！

想再进阶？下一个目标：支持占位符的 `curry.placeholder` 版本（lodash 风格）