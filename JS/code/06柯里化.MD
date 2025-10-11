```js
function curry(fn) {
  const arity = fn.length;
  return function curried(...args) {
    //如果当前收集的参数数量大于等于原函数所需的参数数量
    if (args.length >= arity) {
      //则通过fn.appLy(this，args）调用原函数，传入收集的所有参数
      return fn.apply(this, args);
    }
    //返回一个新的匿名函数继续收集参数
    else {
      //新函数同样使用：：.args2收集新传入的参数0
      //通过args.concat（args2）合并已有参数和新参数0
      //递归调用curried函数，继续判断参数是否足够0
      return function (...args2) {
        return curried.apply(this, args.concat(args2));
      };
    }
  };
}
```
