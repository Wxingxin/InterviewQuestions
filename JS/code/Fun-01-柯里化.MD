```js
function curry(fn) {
  const arity = fn.length;
  function _curry(...args) {
    if (args.length >= arity) {
      return fn.apply(this, args);
      //返回一个新的匿名函数继续收集参数
    } else {
      //新函数同样使用：：.args2收集新传入的参数0
      //通过args.concat（args2）合并已有参数和新参数0
      //递归调用curried函数，继续判断参数是否足够0
      return function (...moreArgs) {
        return _curry.apply(this, args.concat(moreArgs));
      };
    }
  }
  return _curry;
} 
```
