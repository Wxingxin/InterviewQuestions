判断一个对象是否是某个构造函数的实例。

```js
//instanceof 的本质是：判断对象的原型链上是否出现过 constructor.prototype。
function myInstanceof(obj, constructor) {
  // 这样保证只有对象或函数才进入 instanceof 的判断逻辑。
  if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) {
    return false;
  }

  let proto = Object.getPrototypeOf(obj); // 等价于 obj.__proto__
  const prototype = constructor.prototype; //获取构造函数的 prototype

  // 遍历 obj 的原型链：
  // 如果 proto 正好等于 constructor.prototype，说明 obj 是由该构造函数创建的（或继承自它），返回 true。
  // 否则，继续沿着原型链向上找。
  // 如果最终 proto 变成 null（原型链尽头），说明没找到，返回 false。
  while (proto) {
    if (proto === prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}
```

```js

```

```js

```
