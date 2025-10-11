# useState 原理

好的，我们来详细讲 **React 中 `useState` 的原理**，这也是面试中常被问到的点。重点从 **工作机制、内部实现、渲染流程** 来分析。

---

# **React `useState` 原理解析**

## 1️⃣ 基础用法

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
```

* `useState` 返回一个 **状态值** 和 **更新状态的函数**
* 每次调用 `setCount` 会 **触发组件重新渲染**

---

## 2️⃣ 原理概览

1. **状态存储在 Fiber 节点上**

   * React 每个函数组件都有一个 Fiber 对象
   * `useState` 的状态存储在 Fiber 的 **hook 链表** 中

2. **Hook 链表（单向链表）**

   * 每次渲染时，React 会沿着链表读取状态
   * 第一次渲染，创建节点；后续渲染，复用旧状态

3. **setState 更新流程**

   1. 调用 `setState(newState)` → 将新状态存入队列
   2. 标记 Fiber 为 **需要更新**
   3. React 调度重新渲染该组件
   4. 在新渲染中读取队列状态，计算最终值

---

## 3️⃣ 内部实现核心（简化版）

```js
let hookState = [];
let hookIndex = 0;

function useState(initial) {
  const currentIndex = hookIndex;
  hookState[currentIndex] = hookState[currentIndex] || initial;

  function setState(newState) {
    hookState[currentIndex] = newState;
    render(); // 触发组件重新渲染
  }

  hookIndex++;
  return [hookState[currentIndex], setState];
}

function render() {
  hookIndex = 0;
  Counter(); // 重新渲染组件
}
```

* **核心思想**：

  * 用数组存储状态
  * 用索引保证多次 `useState` 的顺序一致
  * 调用 `setState` → 更新数组 → 重新渲染

⚠️ 注意：**Hooks 必须在函数组件顶层按顺序调用**，否则索引不一致，状态错乱

---

## 4️⃣ 扩展知识点

1. **惰性初始化**：

```jsx
const [count, setCount] = useState(() => expensiveComputation());
```

* 初始值函数只在第一次渲染执行

2. **批量更新**：

```jsx
setCount(prev => prev + 1);
setCount(prev => prev + 1); // 在同一次事件中，React 会合并状态更新
```

3. **与 useReducer 对比**：

* `useState` 适合单个状态
* `useReducer` 适合复杂状态逻辑或多个状态组合

---

## 5️⃣ 面试常问点总结

* `useState` 的状态是 **保存在 Hook 链表中**
* 每次渲染都会 **按顺序读取 Hook**
* `setState` 会 **触发组件重新渲染**
* **Hooks 的调用顺序必须一致**
* 批量更新、惰性初始化、与 useReducer 的区别

---

如果你需要，我可以帮你画一张 **“useState 内部工作原理图”**，展示 **Hook 链表、状态队列、渲染流程**，一图看懂，非常适合面试。

你希望我帮你画吗？
