下面我们**自己手写一个超精简版的 zustand**，再用它做一个小计数器。
全程用 **React + JavaScript**，尽量写得**清晰、好懂**，你可以直接复制到项目里跑。

---

## 一、目标：做一个“迷你 zustand”

我们要实现一个函数：

```js
const useStore = create((set, get) => ({
  // 这里写你的状态和修改方法
}));
```

`create` 做的事：

* 存一份全局的 `state`
* 提供 `setState`（修改 state）
* 提供 `getState`（获取当前 state）
* 提供 `subscribe`（组件订阅变化）
* 返回一个 React Hook：`useStore`，组件里用它拿到数据

---

## 二、实现一个简单的 `create` 函数

新建一个文件，例如：`miniZustand.js`

```js
// miniZustand.js
import { useEffect, useState } from "react";

// create：用来创建一个 store，并返回一个 useStore Hook
export function create(createState) {
  // 全局的状态
  let state;
  // 订阅这个状态的“监听函数”列表
  const listeners = new Set();

  // 修改状态的函数
  const setState = (partial, replace) => {
    // 支持两种写法：
    // 1. setState({ count: 1 })
    // 2. setState((state) => ({ count: state.count + 1 }))
    const nextState =
      typeof partial === "function" ? partial(state) : partial;

    // 如果 replace 为 true，或者 nextState 不是对象，就直接替换
    // 否则就做一个浅合并（类似 setState）
    state =
      replace || typeof nextState !== "object"
        ? nextState
        : { ...state, ...nextState };

    // 状态变了，通知所有监听者
    listeners.forEach((listener) => listener(state));
  };

  // 获取当前状态
  const getState = () => state;

  // 订阅状态变化
  const subscribe = (listener) => {
    listeners.add(listener);
    // 返回取消订阅的函数
    return () => {
      listeners.delete(listener);
    };
  };

  // 初始化 state：调用用户传进来的 createState
  // createState 里会写初始值和一些修改 state 的方法
  state = createState(setState, getState);

  // React Hook：组件里用它来读取状态
  const useStore = (selector = (s) => s) => {
    // selector 用来从 state 里选一部分想用的数据
    // 默认 selector = (s) => s，也就是整个 state 都拿
    const [selectedState, setSelectedState] = useState(() =>
      selector(state)
    );

    useEffect(() => {
      // 每次 state 变化时，这个函数会被调用
      const callback = (newState) => {
        const nextSelected = selector(newState);
        setSelectedState(nextSelected);
      };

      // 订阅变化
      const unsubscribe = subscribe(callback);

      // 一进来先同步一次
      callback(state);

      // 组件卸载时取消订阅
      return unsubscribe;
    }, [selector]);

    return selectedState;
  };

  // 给 useStore 挂上一些方法，方便在组件外也能用
  useStore.getState = getState;
  useStore.setState = setState;
  useStore.subscribe = subscribe;

  return useStore;
}
```

> 到这里，你已经有了一套“迷你 zustand 内核”🎉

---

## 三、基于我们写的 `create`，做一个计数器 store

新建一个文件：`counterStore.js`

```js
// counterStore.js
import { create } from "./miniZustand";

// 这里模仿 zustand 的写法
export const useCounterStore = create((set, get) => ({
  count: 0, // 初始值

  // 加 1
  inc: () =>
    set((state) => ({
      count: state.count + 1,
    })),

  // 减 1
  dec: () =>
    set((state) => ({
      count: state.count - 1,
    })),

  // 重置
  reset: () => set({ count: 0 }),
}));
```

你可以看到：

* `set` 是我们刚刚在 `miniZustand.js` 里写的 `setState`
* `get` 是 `getState`
* 这里跟真正的 zustand 写法几乎一样，只是我们是自己实现的版本

---

## 四、在 React 组件中使用

在 `App.jsx` 或者任意组件里：

```jsx
// App.jsx
import React from "react";
import { useCounterStore } from "./counterStore";

function Counter() {
  // 方式一：一次性拿到全部 state
  const { count, inc, dec, reset } = useCounterStore();

  return (
    <div style={{ padding: 20 }}>
      <h1>迷你版 Zustand 计数器</h1>
      <p>当前计数：{count}</p>
      <button onClick={inc}>+1</button>
      <button onClick={dec} style={{ marginLeft: 8 }}>
        -1
      </button>
      <button onClick={reset} style={{ marginLeft: 8 }}>
        重置
      </button>
    </div>
  );
}

export default Counter;
```

如果你是 React 项目（如 Vite + React、CRA），把 `Counter` 当作 `App` 渲染即可。

---

## 五、进阶一点：使用 selector（选择一部分 state）

有时候组件只关心 state 的一部分，这时可以用 `selector`：

```jsx
function CountDisplay() {
  // 只订阅 count，不会因为其他字段变化而重新渲染
  const count = useCounterStore((state) => state.count);
  return <h2>当前计数：{count}</h2>;
}

function CountButtons() {
  const inc = useCounterStore((state) => state.inc);
  const dec = useCounterStore((state) => state.dec);
  const reset = useCounterStore((state) => state.reset);

  return (
    <div>
      <button onClick={inc}>+1</button>
      <button onClick={dec} style={{ marginLeft: 8 }}>
        -1
      </button>
      <button onClick={reset} style={{ marginLeft: 8 }}>
        重置
      </button>
    </div>
  );
}

function App() {
  return (
    <div style={{ padding: 20 }}>
      <h1>拆分组件示例</h1>
      <CountDisplay />
      <CountButtons />
    </div>
  );
}

export default App;
```

---

## 六、你现在已经学会了什么？

* ✅ 如何自己实现一个简单版的 **全局状态管理**
* ✅ 理解了 `setState / getState / subscribe` 的基本思想
* ✅ 知道了 zustand 的 `create((set, get) => ({ ... }))` 是怎么回事
* ✅ 知道怎么在多个组件中共享同一个 state

---

如果你愿意，我可以在下一步：

* 帮你把这套代码改成 **TypeScript 版本**
* 或者带你用 `useSyncExternalStore` 实现一个更“官方推荐”的版本
* 或者做一个稍微复杂一点的例子（例如：Todo 列表、用户信息等）

你现在用的是哪种 React 脚手架？（如 Vite、CRA、Next.js），我也可以按你的实际项目结构帮你排好文件位置。
