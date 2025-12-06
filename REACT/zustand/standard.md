下面给你一个 **可以在 React 项目中直接用的 mini-zustand**，API 风格和 zustand 很像：

- `create` 创建 store
- 返回的是一个 React hook（`useXXXStore`）
- hook 也自带 `.getState / .setState / .subscribe` 等方法（和 zustand 一致）
- 支持 `set` 传对象或函数
- 支持在组件外通过 `useStore.getState()` 使用

我用 TypeScript 写的，你在 JS 项目里把类型去掉就行。

---

## 1. 核心实现：`mini-zustand.ts`

```ts
// mini-zustand.ts
import { useSyncExternalStore } from "react";

// ================= 类型定义 =================

export type StateCreator<T> = (
  set: StoreApi<T>["setState"],
  get: StoreApi<T>["getState"]
) => T;

export type Listener<T> = (state: T, prevState: T) => void;

export type StoreApi<T> = {
  getState: () => T;
  setState: (
    partial: T | Partial<T> | ((state: T) => T | Partial<T>),
    replace?: boolean
  ) => void;
  subscribe: (listener: Listener<T>) => () => void;
};

export type UseStore<T> = {
  /** 在组件里使用：const state = useStore() */
  (): T;
  /** 支持 selector：const count = useStore(s => s.count) */
  <U>(selector: (state: T) => U): U;

  /** 在组件外使用 */
  getState: StoreApi<T>["getState"];
  setState: StoreApi<T>["setState"];
  subscribe: StoreApi<T>["subscribe"];
};

// ================= 核心 store 实现 =================

export function createStore<T>(createState: StateCreator<T>): StoreApi<T> {
  let state: T;
  const listeners = new Set<Listener<T>>();

  const getState = () => state;

  const setState: StoreApi<T>["setState"] = (partial, replace) => {
    const prevState = state;

    const nextState =
      typeof partial === "function"
        ? (partial as (state: T) => T | Partial<T>)(state)
        : partial;

    if (nextState === prevState) return;

    // replace = true 时直接替换整个 state；否则做浅合并
    state = (replace ? (nextState as T) : { ...state, ...nextState }) as T;

    // 通知所有订阅者
    listeners.forEach((listener) => listener(state, prevState));
  };

  const subscribe: StoreApi<T>["subscribe"] = (listener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  // 初始化 state
  state = createState(setState, getState);

  return { getState, setState, subscribe };
}

// ================= React hook 封装 =================

export function create<T>(createState: StateCreator<T>): UseStore<T> {
  const store = createStore(createState);

  function useStore(): T;
  function useStore<U>(selector: (state: T) => U): U;
  function useStore<U>(selector?: (state: T) => U): T | U {
    const sel = selector ?? ((s: T) => s as unknown as U);
    // 使用 React 18 推荐的 useSyncExternalStore
    const slice = useSyncExternalStore(
      store.subscribe,
      () => sel(store.getState()),
      () => sel(store.getState())
    );
    return slice;
  }

  // 把 store API 挂到 hook 上，和 zustand 一样
  (useStore as UseStore<T>).getState = store.getState;
  (useStore as UseStore<T>).setState = store.setState;
  (useStore as UseStore<T>).subscribe = store.subscribe;

  return useStore as UseStore<T>;
}
```

放到你的项目里，比如：`src/lib/mini-zustand.ts`。

---

## 2. 使用示例：创建一个 counter store

```ts
// src/stores/counter.store.ts
import { create } from "../lib/mini-zustand";

type CounterState = {
  count: number;
  inc: () => void;
  dec: () => void;
  reset: () => void;
};

export const useCounterStore = create<CounterState>((set, get) => ({
  count: 0,
  inc: () => set({ count: get().count + 1 }),
  dec: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }, true), // replace 整个 state，如果你愿意
}));
```

---

## 3. 在 React 组件中使用

```tsx
// src/components/Counter.tsx
import React from "react";
import { useCounterStore } from "../stores/counter.store";

export const Counter: React.FC = () => {
  // 推荐用 selector，避免不必要的重渲染
  const count = useCounterStore((s) => s.count);
  const inc = useCounterStore((s) => s.inc);
  const dec = useCounterStore((s) => s.dec);
  const reset = useCounterStore((s) => s.reset);

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={inc}>+1</button>
      <button onClick={dec}>-1</button>
      <button onClick={reset}>reset</button>
    </div>
  );
};
```

---

## 4. 在组件外使用（比如：接口、工具函数里）

```ts
// 任意文件，比如 src/utils/logCounter.ts
import { useCounterStore } from "../stores/counter.store";

export function logCounter() {
  const count = useCounterStore.getState().count;
  console.log("current count: ", count);
}

// 订阅变化
const unsubscribe = useCounterStore.subscribe((state, prev) => {
  console.log("changed from", prev.count, "to", state.count);
});

// 不需要时取消订阅
// unsubscribe()
```

---

如果你愿意下一步可以升级版本，比如：

- 加上 **中间件机制（devtools、persist）**
- 做一个 `createWithMiddleware` 支持链式包装
- 或者实现“拆 slice 再组合”的 API

