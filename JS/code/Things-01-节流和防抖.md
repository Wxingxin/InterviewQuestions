# base

| 特性         | 防抖（Debounce）           | 节流（Throttle）           |
| ------------ | -------------------------- | -------------------------- |
| 触发频率控制 | 事件停止后才执行一次       | 固定间隔内执行一次         |
| 执行时机     | 延迟执行，可能一次也不执行 | 周期性执行，至少会执行一次 |
| 典型场景     | 输入框、resize             | scroll、按钮点击           |

1. 防抖 (debounce)

-  搜索框输入（停止输入后再请求接口）
-  窗口大小变化（resize）事件
-  按钮点击防止重复提交

2. 节流 (throttle)

-  滚动加载（scroll）
-  鼠标移动（mousemove）
-  高频点击（游戏按键、抽奖按钮）

# 防抖

在事件触发后 延迟一段时间再执行回调函数，如果在这段时间内又触发了事件，就重新计时。

```js
function debounce(fn, delay) {
   let timer;
   return function (...args) {
      clearTimeout(timer); // 每次触发都清除之前的定时器
      timer = setTimeout(() => {
         fn.apply(this, args);
      }, delay);
   };
}

// 使用
const handleInput = debounce(() => {
   console.log("搜索请求发送");
}, 500);

document.querySelector("input").addEventListener("input", handleInput);
```


```js
function debounce(fn, delay = 300, immediate = false) {
   let timer = null;
   const debounced = function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);

      if (immediate && !timer) {
         fn.apply(context, args); // 立即执行
      }

      timer = setTimeout(() => {
         fn.apply(context, args);
         timer = null;
      }, delay);
   };

   debounced.cancel = function () {
      clearTimeout(timer);
      timer = null;
   };

   return debounced;
}
```

# 节流

保证在一段时间内只执行一次回调函数，不管事件被触发多少次。

```js
function throttle(fn, delay) {
   let startTime = 0;
   return function (...args) {
      const nowTime = Date.now();
      if (nowTime - startTime >= delay) {
         fn.apply(this, args);
         startTime = nowTime;
      }
   };
}

// 使用
const handleScroll = throttle(() => {
   console.log("页面滚动中...");
}, 1000);

window.addEventListener("scroll", handleScroll);
```


```js
function throttle(fn, delay = 300) {
   let last = 0;
   let timer = null;
   return function (...args) {
      const now = Date.now();
      const remaining = delay - (now - last);
      if (remaining <= 0) {
         if (timer) {
            clearTimeout(timer);
            timer = null;
         }
         fn.apply(this, args);
         last = now;
      } else if (!timer) {
         timer = setTimeout(() => {
            fn.apply(this, args);
            last = Date.now();
            timer = null;
         }, remaining);
      }
   };
}
```
