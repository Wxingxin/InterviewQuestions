## 亲手编写 Redux 源码：深入理解状态管理核心

Redux 以其可预测的状态管理模式，在前端开发中占据了重要地位。理解其源码不仅能帮助我们更深入地运用它，还能提升我们对函数式编程和设计模式的认知。本文将引导你一步步手写 Redux 的核心功能，揭示其精巧的设计思想。

我们将实现 Redux 的三大核心组成部分：`createStore`、`combineReducers` 和 `applyMiddleware`。

### 1\. `createStore`: 状态管理的核心中枢

`createStore` 是 Redux 的入口点，它负责创建一个 store 对象，这个对象维护着应用的状态树，并提供了几个关键方法来与状态进行交互。

一个基础的 `createStore` 实现需要具备以下功能：

  * **存储 state**：内部维护一个变量用于记录当前的状态。
  * **`getState()`**：返回当前的 state。
  * **`dispatch(action)`**：分发一个 action，通过 reducer 计算出新的 state，并通知所有监听者。
  * **`subscribe(listener)`**：注册一个监听函数，当 state 发生变化时会被调用。

下面是 `createStore` 的一个简化实现：

```javascript
export function createStore(reducer, preloadedState) {
  let currentState = preloadedState;
  let currentReducer = reducer;
  let currentListeners = [];
  let nextListeners = currentListeners;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  function getState() {
    return currentState;
  }

  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected the listener to be a function.');
    }

    let isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      const index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
      currentListeners = null;
    };
  }

  function dispatch(action) {
    if (typeof action.type === 'undefined') {
      throw new Error(
        'Actions may not have an undefined "type" property. ' +
        'Have you misspelled a constant?'
      );
    }

    currentState = currentReducer(currentState, action);

    const listeners = (currentListeners = nextListeners);
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }

    return action;
  }

  // 初始化 state
  dispatch({ type: '@@redux/INIT' });

  return {
    dispatch,
    subscribe,
    getState,
  };
}
```

**代码解析:**

  * `currentState` 用于存储应用的状态。
  * `currentReducer` 是当前的 reducer 函数。
  * `currentListeners` 和 `nextListeners` 用于处理订阅和取消订阅的逻辑，`ensureCanMutateNextListeners` 确保了在 `dispatch` 过程中取消订阅的安全性。
  * `getState` 简单地返回 `currentState`。
  * `subscribe` 方法将监听函数添加到一个数组中，并返回一个用于取消订阅的函数。
  * `dispatch` 方法是核心，它接收一个 `action` 对象，调用 `reducer` 来计算新的 state，然后遍历并执行所有的监听函数。
  * 在创建 store 后，会立即 `dispatch` 一个初始化的 `action` (`@@redux/INIT`)，这使得每个 reducer 都能返回其初始状态，从而填充整个 state 树。

### 2\. `combineReducers`: 拆分与组合 Reducer

当应用变得复杂时，将所有的状态更新逻辑都放在一个 reducer 中会变得难以维护。`combineReducers` 允许我们将 reducer 拆分成多个管理 state 树不同部分的函数。

`combineReducers` 接收一个由多个 reducer 函数组成的 `reducers` 对象，并返回一个新的 reducer 函数。这个新的 reducer 会将 state 按照 `reducers` 对象的 key 进行拆分，并将每个子 state 交给对应的 reducer 处理。

```javascript
export function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers);
  const finalReducers = {};

  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i];
    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }

  const finalReducerKeys = Object.keys(finalReducers);

  return function combination(state = {}, action) {
    let hasChanged = false;
    const nextState = {};

    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i];
      const previousStateForKey = state[key];
      const nextStateForKey = finalReducers[key](previousStateForKey, action);

      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    
    hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length;

    return hasChanged ? nextState : state;
  };
}
```

**代码解析:**

  * 首先，它会过滤掉 `reducers` 对象中非函数的属性。
  * 返回的 `combination` 函数会在每次 `dispatch` 时被调用。
  * 在 `combination` 函数内部，它会遍历所有的 reducer，并使用 `state` 中对应的部分和当前的 `action` 来调用它们。
  * 它将每个 reducer 返回的新 state 重新组合成一个新的 `nextState` 对象。
  * `hasChanged` 标志位用于优化：如果没有任何一个子 reducer 返回了新的 state，那么就直接返回旧的 `state` 对象，这对于性能优化和 React 的 `shouldComponentUpdate` 很重要。

### 3\. `applyMiddleware`: 扩展 `dispatch` 功能

Middleware 提供了一种在 action 到达 reducer 之前，对 `dispatch` 方法进行扩展的机制。它常用于处理异步操作、日志记录、路由等副作用。

`applyMiddleware` 接收任意数量的 middleware 作为参数，并返回一个 "enhancer"。这个 enhancer 会在 `createStore` 时增强 store 的功能。

`applyMiddleware` 的实现巧妙地运用了函数式编程中的函数组合（compose）和柯里化。

```javascript
export function applyMiddleware(...middlewares) {
  return createStore => (...args) => {
    const store = createStore(...args);
    let dispatch = () => {
      throw new Error(
        'Dispatching while constructing your middleware is not allowed. ' +
        'Other middleware would not be applied to this dispatch.'
      );
    };

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args),
    };

    const chain = middlewares.map(middleware => middleware(middlewareAPI));
    dispatch = compose(...chain)(store.dispatch);

    return {
      ...store,
      dispatch,
    };
  };
}

export function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}
```

**代码解析:**

  * `applyMiddleware` 返回一个高阶函数，该函数接收 `createStore` 作为参数。
  * 在内部，它首先创建了一个原始的 `store`。
  * 然后，它创建了一个 `middlewareAPI` 对象，其中包含了 `getState` 和一个临时的 `dispatch` 函数。这个 `dispatch` 会在后续被真正的、增强后的 `dispatch` 替换。
  * 接下来，它遍历所有的 middleware，并传入 `middlewareAPI` 来进行初始化。每个 middleware 在这个阶段会返回一个接收 `next` 参数的函数。
  * `compose` 函数是这里的关键。它将所有 middleware 返回的函数组合成一个单一的函数。`compose(f, g, h)` 等价于 `(...args) => f(g(h(...args)))`。
  * 通过 `compose(...chain)(store.dispatch)`，我们将原始的 `store.dispatch` 作为最内层函数的 `next` 参数传入，然后逐层向外包装，最终得到一个被所有 middleware 增强了的 `dispatch` 函数。
  * 最后，它返回一个新的 store 对象，其中包含了所有原始 store 的方法，但是 `dispatch` 方法被替换成了增强后的版本。

### 总结

通过亲手实现 Redux 的核心功能，我们可以清晰地看到其设计的精髓：

  * **单一数据流**：状态的变更总是由 `dispatch(action)` 发起，经过 reducer 处理，最后通过 `subscribe` 通知 UI 更新。
  * **可预测性**：Reducer 作为纯函数，保证了相同的输入（state 和 action）总是得到相同的输出（new state）。
  * **可扩展性**：Middleware 机制提供了一个强大的、可组合的方式来处理副作用和扩展 `dispatch` 的功能。

这份手写的源码虽然简化了错误处理和一些边界情况，但它完整地展现了 Redux 的核心工作流程和设计哲学。深入理解这些原理，将帮助你更自信、更高效地在你的应用中使用 Redux。