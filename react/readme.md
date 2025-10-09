非常棒🔥！React 是前端面试中最常考的框架，没有之一。
我来为你整理一份最完整、最实用的 **React 面试题大全（基础 + 中等）**，涵盖 Hooks、组件通信、生命周期、性能优化、虚拟 DOM、Diff 算法等核心知识。

---

## 🧩 一、React 基础篇（必会）

### 1. React 是什么？它的核心思想是什么？

**回答：**
React 是一个用于构建用户界面的 JavaScript 库。
它的核心思想是：

* **声明式编程**（只关心结果，不关心过程）；
* **组件化开发**；
* **单向数据流**；
* **虚拟 DOM 提升性能**。

---

### 2. 什么是虚拟 DOM？

**回答：**
虚拟 DOM（Virtual DOM）是用 JavaScript 对象表示的 DOM 结构。
React 会：

1. 在内存中维护一棵虚拟 DOM；
2. 当状态更新时生成新的虚拟 DOM；
3. 通过 Diff 算法找出变化；
4. 最小化真实 DOM 操作。

✅ **优点**：

* 提升性能；
* 跨平台（React Native）。

---

### 3. React 中的 JSX 是什么？

JSX 是一种语法糖，用于在 JavaScript 中书写 HTML 元素。

```jsx
const element = <h1>Hello, React!</h1>;
```

**注意**：JSX 会被 Babel 转译为 `React.createElement()` 调用。

---

### 4. 什么是组件？组件有哪几种？

组件是 UI 的独立、可复用单元。

📦 **两种类型：**

1. **函数组件（Function Component）**

   ```jsx
   function Hello() {
     return <h1>Hello</h1>;
   }
   ```
2. **类组件（Class Component）**

   ```jsx
   class Hello extends React.Component {
     render() {
       return <h1>Hello</h1>;
     }
   }
   ```

---

### 5. React 中的 props 和 state 区别？

| 对比项  | props   | state                   |
| :--- | :------ | :---------------------- |
| 作用   | 外部传入数据  | 组件内部状态                  |
| 是否可变 | 不可变     | 可变                      |
| 使用场景 | 父子通信    | 控制组件内部逻辑                |
| 修改方式 | 父组件重新渲染 | `setState` 或 `useState` |

---

### 6. setState 是同步还是异步的？

**回答：**

* 在 **React 合成事件**、**生命周期函数** 中是**异步**；
* 在 **原生事件**、**setTimeout** 中是**同步**；
* React18 的 `useState` 在 Concurrent 模式下默认异步。

---

### 7. React 中如何实现条件渲染？

**三种方式：**

```jsx
// 1. 三元表达式
{isLogin ? <Home /> : <Login />}

// 2. && 逻辑判断
{error && <ErrorMessage />}

// 3. 函数返回
function renderView() {
  if (loading) return <Loading />;
  return <Content />;
}
```

---

### 8. React 中 key 的作用是什么？

* key 是元素的唯一标识；
* React 用 key 来识别哪些元素被修改、添加或删除；
* **不使用 index 作为 key**（除非静态列表）。

---

### 9. React 中如何实现列表渲染？

```jsx
const list = ['A', 'B', 'C'];
<ul>
  {list.map((item) => (
    <li key={item}>{item}</li>
  ))}
</ul>
```

---

### 10. 组件之间如何通信？

| 通信方式                     | 说明     |
| ------------------------ | ------ |
| props                    | 父传子    |
| 回调函数                     | 子传父    |
| Context                  | 跨层级传递  |
| Redux / Zustand / Recoil | 全局状态管理 |
| EventEmitter / 自定义事件     | 任意组件通信 |

---

## ⚙️ 二、React 中级篇（核心与实践）

### 11. React 生命周期有哪些阶段？

**类组件生命周期：**

1. 挂载阶段：`constructor` → `render` → `componentDidMount`
2. 更新阶段：`render` → `componentDidUpdate`
3. 卸载阶段：`componentWillUnmount`

✅ **Hooks 对应：**

* `useEffect(() => {}, [])` ≈ `componentDidMount`
* `useEffect(() => {...})` ≈ `componentDidUpdate`
* `useEffect(() => {... return () => {...}}, [])` ≈ `componentWillUnmount`

---

### 12. 什么是受控组件与非受控组件？

| 类型    | 定义                     | 示例                                          |
| ----- | ---------------------- | ------------------------------------------- |
| 受控组件  | 表单值由 React state 控制    | `<input value={value} onChange={setValue}>` |
| 非受控组件 | 表单值存储在 DOM 中，通过 ref 获取 | `<input ref={inputRef}>`                    |

---

### 13. React 中 useEffect 的用途？

用于执行**副作用操作**：网络请求、事件监听、定时器、DOM 操作。

```jsx
useEffect(() => {
  console.log('组件挂载');
  return () => console.log('组件卸载');
}, []);
```

---

### 14. useEffect 与 useLayoutEffect 的区别？

| 对比项  | useEffect | useLayoutEffect  |
| :--- | :-------- | :--------------- |
| 执行时机 | 浏览器渲染后    | 浏览器绘制前           |
| 场景   | 异步副作用（请求） | 同步 DOM 操作（测量、动画） |

---

### 15. 什么是 React Hooks？解决了什么问题？

Hooks 是 React16.8 引入的新特性，**让函数组件拥有状态和生命周期功能**。

✅ 解决：

* 类组件复杂、难复用；
* this 指向困扰；
* 状态逻辑复用困难。

---

### 16. 常用 Hooks 有哪些？

| Hook                | 作用             |
| ------------------- | -------------- |
| useState            | 定义状态           |
| useEffect           | 副作用            |
| useRef              | 获取 DOM 或保存引用   |
| useContext          | 使用上下文          |
| useReducer          | 管理复杂状态逻辑       |
| useMemo             | 计算缓存           |
| useCallback         | 函数缓存           |
| useImperativeHandle | 自定义暴露给父组件的 ref |

---

### 17. useMemo 和 useCallback 区别？

| Hook        | 缓存内容       | 典型场景      |
| ----------- | ---------- | --------- |
| useMemo     | 缓存**计算结果** | 避免重复计算    |
| useCallback | 缓存**函数引用** | 避免子组件重复渲染 |

---

### 18. React 中的 Context 是什么？

> Context 用于在组件树中共享全局数据（如主题、语言、用户信息）。

**使用示例：**

```jsx
const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Button />
    </ThemeContext.Provider>
  );
}

function Button() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>按钮</button>;
}
```

---

### 19. React 如何进行性能优化？

✅ **常见优化手段：**

1. 使用 `React.memo()` 避免无意义渲染；
2. `useMemo` / `useCallback` 缓存；
3. 列表使用 `key`；
4. 懒加载：`React.lazy + Suspense`；
5. 虚拟列表：`react-window`；
6. 拆分组件；
7. 避免在 render 里定义函数；
8. SSR（Next.js）。

---

### 20. React 事件机制是什么？

React 使用 **合成事件（SyntheticEvent）**，对原生事件进行封装。

**优点：**

* 统一事件系统；
* 跨浏览器兼容；
* 性能更高（事件委托到 document）。

---

### 21. React 的 Diff 算法原理？

React 的 Diff 算法有三大优化：

1. **树的分层比较**；
2. **同层节点按 key 比较**；
3. **跨层移动节点视为删除+创建**。

复杂度从 `O(n³)` 优化到 `O(n)`。

---

### 22. React 中如何实现组件懒加载？

```jsx
const About = React.lazy(() => import('./About'));
<Suspense fallback={<div>Loading...</div>}>
  <About />
</Suspense>
```

---

### 23. React 中如何处理错误？

使用 **ErrorBoundary（错误边界）**：

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  componentDidCatch(error, info) {
    this.setState({ hasError: true });
  }
  render() {
    if (this.state.hasError) return <h1>出错了！</h1>;
    return this.props.children;
  }
}
```

---

### 24. React 的 Fiber 是什么？

> Fiber 是 React 16 之后的核心架构，解决“长任务阻塞渲染”的问题。

**原理：**

* 将更新任务拆分成小块；
* 每次渲染只执行一部分；
* 可中断、可恢复；
* 提高响应速度。

---

### 25. 什么是 React 合成事件？为什么使用它？

React 将所有事件绑定到根节点，通过事件委托统一管理。
**优点：**

* 降低内存消耗；
* 提升性能；
* 保证跨浏览器一致性。

---

## 🚀 三、附赠高频面试问答速记表

| 问题                 | 一句话答法                       |
| ------------------ | --------------------------- |
| setState 为什么异步？    | 为了批量更新和提升性能                 |
| React 如何阻止组件重复渲染？  | React.memo + useCallback    |
| Hook 为什么不能写在条件语句中？ | Hooks 调用顺序必须一致              |
| key 的作用？           | 帮助 Diff 快速定位变化节点            |
| React 如何更新 UI？     | state 改变 → diff → patch DOM |
| useRef 有什么作用？      | 保存可变值或获取 DOM 引用             |
| useReducer 有什么用？   | 管理复杂状态逻辑，类似 Redux           |
| React.lazy 有什么作用？  | 动态加载组件，减少首屏体积               |

---

是否希望我继续帮你整理：

> ✅「React 高频面试题速记 PDF + 进阶版（Hooks 深挖、Fiber、并发特性、性能优化）」
> 方便你在面试前快速复盘？
