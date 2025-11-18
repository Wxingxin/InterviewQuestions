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
