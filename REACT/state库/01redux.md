好，我们来**从零手写一个 Redux**。
思路是：一步步造轮子，而不是一下子给你一大坨源码。

我们要实现这些东西：

1. `createStore`（核心）
2. `combineReducers`
3. `applyMiddleware`（中间件）
4. 一个简单的 `logger` 中间件
5. 简单的 React 绑定：`Provider / useSelector / useDispatch`

我会用一个文件 `myRedux.js` 来实现“迷你 Redux”，再用一个计数器例子来演示。

---

## 一、最核心：createStore

新建 `myRedux.js`

```js
// myRedux.js

// 最简单版本：先不考虑 enhancer（中间件），只实现最核心功能
export function createStore(reducer, preloadedState) {
  let currentReducer = reducer;      // 当前使用的 reducer
  let currentState = preloadedState; // 当前 state
  let currentListeners = [];         // 订阅者列表

  // 获取当前 state
  function getState() {
    return currentState;
  }

  // 订阅 state 变化
  function subscribe(listener) {
    currentListeners.push(listener);

    // 返回取消订阅函数
    return function unsubscribe() {
      const index = currentListeners.indexOf(listener);
      if (index > -1) {
        currentListeners.splice(index, 1);
      }
    };
  }

  // 派发 action：唯一能修改 state 的方式
  function dispatch(action) {
    // 核心：用 reducer 计算新的 state
    currentState = currentReducer(currentState, action);

    // 通知所有订阅者
    currentListeners.forEach((listener) => listener());

    return action;
  }

  // 支持替换 reducer（比如做代码分割、热更新）
  function replaceReducer(nextReducer) {
    currentReducer = nextReducer;
    // 替换后立刻 dispatch 一个初始化 action，让新 reducer 跑一遍
    dispatch({ type: "@@redux/REPLACE" });
  }

  // 先 dispatch 一个 “初始化 action”，让 reducer 给出初始 state
  dispatch({ type: "@@redux/INIT" });

  // store 对象
  return {
    getState,
    dispatch,
    subscribe,
    replaceReducer,
  };
}
```

> 这一段已经是 Redux 的心脏了：**单一 store，action → reducer → state**。

---

## 二、多 reducer 支持：combineReducers

在实际项目中我们会拆分 reducer，这就需要 `combineReducers`。

继续在 `myRedux.js` 里写：

```js
// 接收一个对象：{ counter: counterReducer, user: userReducer, ... }
export function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers);

  return function combination(state = {}, action) {
    const nextState = {};
    let hasChanged = false;

    for (let i = 0; i < reducerKeys.length; i++) {
      const key = reducerKeys[i];
      const reducer = reducers[key];

      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);

      nextState[key] = nextStateForKey;

      if (nextStateForKey !== previousStateForKey) {
        hasChanged = true;
      }
    }

    // 如果任何一个子 reducer 的 state 有变化，就认为整个 state 变了
    return hasChanged ? nextState : state;
  };
}
```

之后就可以这样用：

```js
import { createStore, combineReducers } from "./myRedux";

function counterReducer(state = 0, action) {
  switch (action.type) {
    case "INC":
      return state + 1;
    case "DEC":
      return state - 1;
    default:
      return state;
  }
}

function userReducer(state = { name: "张三" }, action) {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  counter: counterReducer,
  user: userReducer,
});

const store = createStore(rootReducer);
```

---

## 三、加入中间件：applyMiddleware

Redux 很强的一点就是中间件，比如 logger、异步等。

我们来实现一个简化版的 `applyMiddleware`：

```js
// 辅助函数：组合函数，从右到左执行
function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

// applyMiddleware：返回一个“增强版的 createStore”
export function applyMiddleware(...middlewares) {
  return function enhancer(oldCreateStore) {
    return function newCreateStore(reducer, preloadedState) {
      // 先用原来的 createStore 创建 store
      const store = oldCreateStore(reducer, preloadedState);

      let dispatch = store.dispatch;

      // 给中间件用的 API
      const middlewareAPI = {
        getState: store.getState,
        dispatch: (action) => dispatch(action), // 注意这里用的是外面的 dispatch（会被增强）
      };

      // 每个中间件传入 middlewareAPI，会返回一个包装 dispatch 的函数
      const chain = middlewares.map((middleware) =>
        middleware(middlewareAPI)
      );

      // 组合这些中间件，得到最终增强过的 dispatch
      dispatch = compose(...chain)(store.dispatch);

      // 返回增强过的 store
      return {
        ...store,
        dispatch,
      };
    };
  };
}
```

> 这段是 Redux 里最难理解的地方之一，你可以稍微先“记住”用法，等写几个中间件后再回来看，会容易理解很多。

### 写一个 logger 中间件练手

```js
// loggerMiddleware.js
export function logger({ getState }) {
  return (next) => (action) => {
    console.log("[logger] dispatch:", action);
    const prevState = getState();
    console.log("[logger] prev state:", prevState);

    const returnValue = next(action); // 调用下一个中间件或真正的 dispatch

    const nextState = getState();
    console.log("[logger] next state:", nextState);

    return returnValue;
  };
}
```

使用：

```js
import { createStore, applyMiddleware } from "./myRedux";
import { logger } from "./loggerMiddleware";

const store = createStore(
  rootReducer,
  undefined,
  applyMiddleware(logger) // 这里和真实 redux 的写法一模一样
);
```

> 注意：要支持第三个参数 `enhancer`，我们得稍微调整一下 `createStore`。

修改版 `createStore`（替换之前的）：

```js
export function createStore(reducer, preloadedState, enhancer) {
  // 如果传入了 enhancer（比如 applyMiddleware 返回的函数）
  if (typeof enhancer === "function") {
    return enhancer(createStore)(reducer, preloadedState);
  }

  let currentReducer = reducer;
  let currentState = preloadedState;
  let currentListeners = [];

  function getState() {
    return currentState;
  }

  function subscribe(listener) {
    currentListeners.push(listener);
    return function unsubscribe() {
      const index = currentListeners.indexOf(listener);
      if (index > -1) {
        currentListeners.splice(index, 1);
      }
    };
  }

  function dispatch(action) {
    currentState = currentReducer(currentState, action);
    currentListeners.forEach((listener) => listener());
    return action;
  }

  function replaceReducer(nextReducer) {
    currentReducer = nextReducer;
    dispatch({ type: "@@redux/REPLACE" });
  }

  dispatch({ type: "@@redux/INIT" });

  return {
    getState,
    dispatch,
    subscribe,
    replaceReducer,
  };
}
```

---

## 四、简单 React 版本：Provider / useDispatch / useSelector

这部分算“简化版 react-redux”，用于在 React 里方便地用我们手写的 Redux。

新建 `myReactRedux.js`：

```js
// myReactRedux.js
import React, { createContext, useContext } from "react";
import { useSyncExternalStore } from "react";

// 创建一个 Context，用来传递 store
const StoreContext = createContext(null);

// Provider：把 store 传递给子树
export function Provider({ store, children }) {
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}

// 拿 dispatch
export function useDispatch() {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("useDispatch 必须在 <Provider> 中使用");
  }
  return store.dispatch;
}

// 拿 state 的一部分
export function useSelector(selector) {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("useSelector 必须在 <Provider> 中使用");
  }

  const getSnapshot = () => selector(store.getState());
  const subscribe = (listener) => store.subscribe(listener);

  const selectedState = useSyncExternalStore(subscribe, getSnapshot);
  return selectedState;
}
```

---

## 五、完整使用示例：计数器 + React

### 1）定义 reducer

```js
// counterReducer.js
const initialState = { count: 0 };

export function counterReducer(state = initialState, action) {
  switch (action.type) {
    case "INC":
      return { ...state, count: state.count + 1 };
    case "DEC":
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
}
```

### 2）创建 store

```js
// store.js
import { createStore, applyMiddleware, combineReducers } from "./myRedux";
import { counterReducer } from "./counterReducer";
import { logger } from "./loggerMiddleware";

const rootReducer = combineReducers({
  counter: counterReducer,
  // 未来可以加入更多模块：user、todo 等
});

export const store = createStore(
  rootReducer,
  undefined,
  applyMiddleware(logger) // 带日志的 store
);
```

### 3）在 React 中使用

```jsx
// App.jsx
import React from "react";
import { Provider, useSelector, useDispatch } from "./myReactRedux";
import { store } from "./store";

function Counter() {
  // 只选择 counter 模块里的 count
  const count = useSelector((state) => state.counter.count);
  const dispatch = useDispatch();

  const inc = () => dispatch({ type: "INC" });
  const dec = () => dispatch({ type: "DEC" });

  return (
    <div style={{ padding: 20 }}>
      <h1>手写 Redux 计数器</h1>
      <p>当前计数：{count}</p>
      <button onClick={inc}>+1</button>
      <button onClick={dec} style={{ marginLeft: 8 }}>
        -1
      </button>
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
}
```

---

## 六、你现在已经掌握了什么？

你手里已经有一套“教学版 Redux 全家桶”：

* `createStore`（支持 enhancer）
* `combineReducers`
* `applyMiddleware` + `compose`
* 中间件模式 (`logger`)
* React 绑定：`Provider / useSelector / useDispatch`

**下一步推荐你自己动手做：**

1. 自己再写一个中间件，比如：

   * 只允许 dispatch 对象，如果是函数就报错
   * 或者简单版 `thunk`（如果 action 是函数就执行）

2. 手写一个 `bindActionCreators`：

   * 输入 `{ inc: () => ({ type: "INC" }) }` 和 `dispatch`
   * 返回 `{ inc: () => dispatch({ type: "INC" }) }`

如果你愿意，我可以下一步带你**手写一个 thunk 中间件 + bindActionCreators**，这样你对 Redux 的理解就已经非常扎实了。
