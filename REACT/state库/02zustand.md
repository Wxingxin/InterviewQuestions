我先说句实话：**真正的 zustand 源码 功能很多，一个文件贴完你大概率看不下去** 😂
所以我给你的是一个**高仿“完全版”**——设计思想基本一样，但代码是我们自己写的，适合学习。

包含这些能力：

1. `create` / `createStore`（可以在 React 里用，也能在非 React 里用）
2. `setState / getState / subscribe / destroy`
3. 支持 `selector`（`useStore(state => state.xxx)`）
4. 支持中间件（类似 zustand 的 `logger`、`persist` 思想）
5. 用 `useSyncExternalStore` 做“官方推荐”的订阅方式

> 你可以把它理解成：**教学用的完整版 zustand**，逻辑结构很接近官方实现。

---

## 1. 核心：vanilla store（不依赖 React）

新建一个文件：`myZustand.js`

```js
// myZustand.js
// 这是一个“非 React 版本”的 store，负责：state / setState / getState / subscribe

// createStore：创建一个最基础的 store（vanilla store）
export function createStore(createState) {
  let state;                 // 当前状态
  const listeners = new Set(); // 订阅者集合（回调函数）

  // 获取当前 state
  const getState = () => state;

  // 更新 state
  const setState = (partial, replace) => {
    const nextState =
      typeof partial === "function" ? partial(state) : partial;

    // 支持替换 / 合并
    const newState =
      replace || typeof nextState !== "object"
        ? nextState
        : { ...state, ...nextState };

    // 没有变化就不通知
    if (Object.is(newState, state)) return;

    state = newState;

    // 通知所有订阅者
    listeners.forEach((listener) => listener(state));
  };

  // 订阅 state 变化
  const subscribe = (listener) => {
    listeners.add(listener);
    // 返回取消订阅函数
    return () => {
      listeners.delete(listener);
    };
  };

  // 销毁 store（清空所有订阅者）
  const destroy = () => {
    listeners.clear();
  };

  // 先准备好 api 对象，方便传给 createState
  const api = {
    setState,
    getState,
    subscribe,
    destroy,
  };

  // 初始化 state（用户定义初始值和方法）
  state = createState(setState, getState, api);

  return api;
}
```

到这里，我们有了 **zustand 的“心脏”**：`createStore`。
接下来把它和 React 绑定起来。

---

## 2. 绑定 React：`create` 返回一个 Hook

继续在同一个文件里，增加下面这段代码：

```js
import { useSyncExternalStore } from "react";

// 这是给 React 用的 create
export function create(createState) {
  // 如果传进来的是函数，就创建一个新的 store
  // 如果传进来的是现成的 store（vanilla），就直接用
  const api =
    typeof createState === "function" ? createStore(createState) : createState;

  // 这是最终给组件用的 Hook
  function useBoundStore(
    selector = (state) => state, // 默认返回整个 state
    equalityFn = Object.is       // 默认使用 Object.is 比较是否相等
  ) {
    // 订阅函数：当 state 变化时，被 useSyncExternalStore 调用
    const subscribe = api.subscribe;

    // snapshot 函数：告诉 React 当前的“切片 state”
    const getSnapshot = () => selector(api.getState());

    // useSyncExternalStore 会：
    // - 订阅 subscribe
    // - 每次变化时调用 getSnapshot
    // - 用 Object.is(prev, next) 判断是否需要重新渲染
    const selectedState = useSyncExternalStore(subscribe, getSnapshot);

    // 如果想要自定义 equalityFn（更高级玩法），
    // 简易做法就是在外面再包一层 memo 或者在 selector 里处理。
    // 为了保证代码简单，这里我们只实现基础版的 equality （依赖 React 的 Object.is）

    return selectedState;
  }

  // 把底层 api 挂到 Hook 上，方便在组件外使用
  useBoundStore.getState = api.getState;
  useBoundStore.setState = api.setState;
  useBoundStore.subscribe = api.subscribe;
  useBoundStore.destroy = api.destroy;

  return useBoundStore;
}
```

现在你已经有了：

* `createStore`：纯 JS 版，不依赖 React
* `create`：React 版，返回的是 `useStore` Hook

和官方 zustand 的结构 **非常相似**。

---

## 3. 像真正的 zustand 一样使用

新建 `counterStore.js`：

```js
// counterStore.js
import { create } from "./myZustand";

export const useCounterStore = create((set, get) => ({
  count: 0,

  inc: () => set((state) => ({ count: state.count + 1 })),
  dec: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));
```

在 React 组件中使用：

```jsx
// App.jsx
import React from "react";
import { useCounterStore } from "./counterStore";

function App() {
  // 拿整个 state（简单粗暴）
  const { count, inc, dec, reset } = useCounterStore();

  return (
    <div style={{ padding: 20 }}>
      <h1>我的“完整版” zustand</h1>
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

export default App;
```

使用 `selector`：

```jsx
function CountDisplay() {
  const count = useCounterStore((s) => s.count);
  return <h2>Count: {count}</h2>;
}

function Buttons() {
  const inc = useCounterStore((s) => s.inc);
  const dec = useCounterStore((s) => s.dec);
  return (
    <div>
      <button onClick={inc}>+1</button>
      <button onClick={dec} style={{ marginLeft: 8 }}>
        -1
      </button>
    </div>
  );
}
```

---

## 4. 中间件思想（logger / persist）

zustand 很强的一点是**中间件**。
我们也来实现两个教学版的中间件：`logger`、`persist`。

### 4.1 logger 中间件

```js
// loggerMiddleware.js
export const logger =
  (config) =>
  (set, get, api) => {
    // 包装一下 set，让它在每次修改时打印日志
    const loggedSet = (partial, replace) => {
      const prevState = get();
      set(partial, replace);
      const nextState = get();
      console.log("[logger] prev:", prevState);
      console.log("[logger] next:", nextState);
    };

    // 把包装后的 set 传给真正的配置函数
    return config(loggedSet, get, api);
  };
```

使用：

```js
// counterStoreWithLogger.js
import { create } from "./myZustand";
import { logger } from "./loggerMiddleware";

export const useCounterStore = create(
  logger((set, get) => ({
    count: 0,
    inc: () => set((s) => ({ count: s.count + 1 })),
    dec: () => set((s) => ({ count: s.count - 1 })),
  }))
);
```

---

### 4.2 persist 中间件（存 localStorage）

**简化版：**

```js
// persistMiddleware.js
export const persist =
  (config, options) =>
  (set, get, api) => {
    const { name = "zustand-store", storage = localStorage } = options || {};

    // 从 storage 里尝试恢复
    const saved = storage.getItem(name);
    let initialState;
    if (saved) {
      try {
        initialState = JSON.parse(saved);
      } catch (e) {
        console.warn("[persist] 解析失败，使用默认初始值");
      }
    }

    // 包装 set，在每次修改后写入 storage
    const persistSet = (partial, replace) => {
      set(partial, replace);
      try {
        const currentState = get();
        storage.setItem(name, JSON.stringify(currentState));
      } catch (e) {
        console.warn("[persist] 写入 storage 失败", e);
      }
    };

    // 如果有保存的 state，就先用它；否则用 config 里的默认
    if (initialState) {
      // 先调用一次 config 拿到默认 state 和方法
      const userState = config(persistSet, get, api);
      // 用保存的 state 覆盖默认的 state 字段（方法保持不变）
      return {
        ...userState,
        ...initialState,
      };
    }

    return config(persistSet, get, api);
  };
```

使用：

```js
// counterPersistStore.js
import { create } from "./myZustand";
import { persist } from "./persistMiddleware";

export const useCounterPersistStore = create(
  persist(
    (set, get) => ({
      count: 0,
      inc: () => set((s) => ({ count: s.count + 1 })),
    }),
    {
      name: "my-counter", // localStorage key
    }
  )
);
```

这样刷新页面之后，`count` 就会从 `localStorage` 恢复了。

---

## 5. 总结一下你现在手里有什么

你已经拥有一个**教学版“完整版 zustand”**，包含：

1. **核心 store：**

   ```js
   createStore(createState)  // 纯 JS 版
   ```

2. **React 版 Hook：**

   ```js
   create(createState)       // 返回 useStore
   ```

3. **API：**

   * `getState()`
   * `setState(partial, replace?)`
   * `subscribe(listener)`
   * `destroy()`

4. **在 React 里用：**

   ```js
   const value = useStore();
   const slice = useStore((state) => state.xxx);
   ```

5. **中间件思想：**

   * logger（打印修改前后 state）
   * persist（存到 localStorage）

---

如果你愿意，下一步我可以帮你：

* 把这套代码**改成 TypeScript + 类型推导**（接近 zustand 真正体验）
* 带你一点点**对照官方源码**，看别人是怎么拆文件、怎么处理边界情况的
* 或者我们用这套小框架写一个稍微复杂一点的 demo（比如 Todo、用户登录、购物车）

你现在的项目是用 **Vite + React** 还是别的？我可以按你的项目结构帮你把这些文件名字和路径都排好。
