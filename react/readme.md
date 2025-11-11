# 💯💯💯基础核心

### ✅ 1. **React 的核心思想是什么？**

React 的核心思想可以概括为：

✅ **声明式 UI**
你只需要描述“UI 应该是什么样的”，React 负责更新 DOM

```js
const App = () => <div>{count}</div>;
```

不用操作 DOM（比如 `document.querySelector`），避免手动维护 UI 状态。

---

✅ **组件化开发**
页面由组件组成，组件可以复用、组合、独立维护

```js
function Button({ text }) {
  return <button>{text}</button>;
}
```

---

✅ **单向数据流**
父 → 子传递数据，不建议子直接改父的数据
保证数据可控、更容易调试

---

✅ **Virtual DOM + Diff 策略**
React 用虚拟 DOM 描述 UI变化，再进行最小量真实 DOM 更新，提高性能

---

✅ 总结一句：
**React 用声明式 + 组件化 + 单向数据流管理 UI，通过虚拟 DOM 提升渲染效率。**

---

### ✅ 2. **JSX 是什么？为什么需要 JSX？**

##### ✅ JSX 是什么？

一种 **JavaScript + XML 的语法扩展**：

```js
const element = <h1>Hello React</h1>;
```

实际上 JSX 会被编译成：

```js
React.createElement("h1", null, "Hello React");
```

---

##### ✅ 为什么需要 JSX？

✔ 写 UI 时更直观，更接近模板语言
✔ 比直接 `React.createElement()` 更简洁
✔ 具有 JS 全部能力（变量、表达式、函数、条件渲染）

✅ 没有 JSX 的写法：

```js
React.createElement('div', null,
  React.createElement('span', null, 'text')
);
```

✅ 有 JSX：

```jsx
<div><span>text</span></div>
```

➡ **JSX 本质是语法糖，最终会变成函数调用。**

---

# ✅ 3. React 的虚拟 DOM 如何工作？

React 不直接操作真实 DOM，而是：

✅ 1. 组件 render 生成虚拟 DOM（JS 对象）
✅ 2. React 对比“更新前 vs 更新后”的虚拟 DOM → Diff
✅ 3. 找到变化 → 最小成本更新真实 DOM

流程图：

```
UI更新 → 新 Virtual DOM → Diff → 计算差异 → 只更新变化部分 → 真 DOM
```

优势：

✔ 减少 DOM 操作（最耗性能）
✔ 保证性能更稳定
✔ 可以在内存中计算、批量操作 DOM

---

### ✅ 4. 函数组件 vs 类组件

| 对比项          | 函数组件                    | 类组件                   |
| ------------ | ----------------------- | --------------------- |
| 写法           | 普通函数                    | 继承 `React.Component`  |
| 状态 state     | `useState`              | `this.state`          |
| 生命周期         | 用 Hooks 模拟（useEffect 等） | componentDidMount 等   |
| this         | ✅ 没有 this               | ❌ this 指向易出错          |
| 性能           | ✅ 更轻、更快                 | ❌ 开销大                 |
| 逻辑复用         | 自定义 Hook 很方便            | 需要 HOC 或 render props |
| 推荐程度 (2025+) | ✅ 官方推荐，未来主流             | 不再推荐                  |

简单对比：

```jsx
// 函数组件
function App() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

```jsx
// 类组件
class App extends React.Component {
  state = { count: 0 }
  render() {
    return <button onClick={() => this.setState({ count: this.state.count + 1 })}>{this.state.count}</button>;
  }
}
```

✅ **结论：函数组件更简单、性能更好、Hook 更灵活 → 现代 React 主流。**

---

### ✅ 5. setState 是同步还是异步？为什么？

✅ **答案：既可以是异步，也可以是同步。**

* ✅ 在 **React 合成事件 / 生命周期** 中：**异步批处理**
* ✅ 在 **原生事件 / setTimeout / Promise** 中：**同步执行**

例子：

```js
// 合成事件中
onClick={() => {
  this.setState({ count: this.state.count + 1 });
  console.log(this.state.count); // 旧值（异步）
}}
```

但如果用原生事件：

```js
document.body.addEventListener('click', () => {
  this.setState({ count: this.state.count + 1 });
  console.log(this.state.count); // 新值（同步）
});
```

---

##### ✅ 为什么是异步？

✔ 把多个 setState 合并批处理，提高性能
✔ 避免每次 setState 都触发一次重新渲染

例如：

```js
this.setState({ a: 1 });
this.setState({ b: 2 });
```

React 会只渲染一次。

---

✅ **一句总结：**

> React 在内部会对 setState 进行批处理，它“看起来”异步，但在某些环境又会同步执行。

---

下面是第 **6～10** 题的标准面试回答，内容简洁但覆盖原理和细节，可直接用于面试 ✅

---

### ✅ **6. 为什么 state 不能直接修改？（不能 this.state.x = x）**

##### ✅ 正确答案（面试高频）

因为直接修改 `this.state`：

1. **不会触发组件重新渲染**

   ```js
   this.state.count = 1
   // UI 不会更新
   ```

2. **破坏 React 的状态管理机制**
   React 依赖 `setState` 进行：
   ✔ 批量更新
   ✔ diff 计算
   ✔ 触发 Fiber 调度
   如果绕过 `setState`，这些都不会发生。

3. **React 会在未来使用 state 的不可变性优化性能**
   如果直接修改对象，React 无法判断是否变化。

✅ 正确方式：

```js
this.setState({ count: this.state.count + 1 });
```

✅ 一句话总结：

> **不能直接改 state，因为不会触发更新，破坏不可变数据原则，并且绕过 React 的更新流程。**

---

### ✅ **7. props 和 state 的区别？**

| 对比项  | props         | state               |
| ---- | ------------- | ------------------- |
| 来源   | 父组件传入         | 组件内部自身维护            |
| 可修改性 | ❌ 只读，不可修改     | ✅ 可通过 setState 修改   |
| 谁负责  | 外部控制（数据驱动 UI） | 自己控制（组件内部逻辑）        |
| 使用场景 | 配置组件、父传子数据    | UI 动态变化（交互、异步数据、计数） |

✅ 示例：

```jsx
function Counter({ step }) {      // step 是 props
  const [count, setCount] = useState(0); // count 是 state
  return <button onClick={() => setCount(count + step)}>{count}</button>;
}
```

✅ 一句话总结：

> props 是外部输入，state 是内部状态；props 不能改，state 可改。

---

### ✅ **8. key 的作用是什么？为什么不能用 index 当 key？**

##### ✅ key 的作用

用于让 React 在 Diff 过程中识别列表项，找到**最小更新单元**，提高效率，保持正确性。

✅ React diff 原则：

* key 相同 → 复用组件
* key 不同 → 创建 / 删除组件

---

##### ❌ 为什么不能用 index 当 key？

| 问题场景                 | 影响                         |
| -------------------- | -------------------------- |
| 列表进行**插入 / 删除 / 排序** | React 复用错误 DOM，导致 UI 异常    |
| 表单输入出现错位             | 因为 React 认为 DOM 没变，但其实数据变了 |
| 动画、过渡效果错乱            | 错误复用 DOM                   |

✅ 错误示例：

```jsx
items.map((v, i) => <li key={i}>{v}</li>)
```

✅ 正确：

```jsx
items.map(item => <li key={item.id}>{item.text}</li>)
```

✅ 一句话总结：

> key 是虚拟 DOM diff 的唯一标识，不推荐用 index，会导致渲染混乱、性能降低和数据错位。

---

### ✅ **9. 受控组件 vs 非受控组件？**

##### ✅ 受控组件（推荐）

输入的值由 **React state 控制** —— 表单值 = 组件 state

```jsx
const [value, setValue] = useState('');
<input value={value} onChange={e => setValue(e.target.value)} />
```

✅ 优点：
✔ 数据可控
✔ 表单校验简单
✔ UI 与数据一致

---

##### ✅ 非受控组件

值保存在 DOM，而不是 React state

```jsx
const inputRef = useRef();
<input ref={inputRef} />
```

取值：

```js
console.log(inputRef.current.value);
```

✅ 适合场景：
✔ 性能要求高
✔ 第三方库、文件上传等不方便受控处理

✅ 一句话总结：

> 受控组件由 React 管控数据，非受控组件由 DOM 管控数据。

---

### ✅ **10. 生命周期有哪些？（老 vs 新）**

##### ✅ ✅ **类组件老生命周期（16 以前）**

| 阶段 | 生命周期函数                                                                                                |
| -- | ----------------------------------------------------------------------------------------------------- |
| 挂载 | constructor → componentWillMount → render → componentDidMount                                         |
| 更新 | componentWillReceiveProps → shouldComponentUpdate → componentWillUpdate → render → componentDidUpdate |
| 卸载 | componentWillUnmount                                                                                  |

⚠️ `componentWillMount / componentWillReceiveProps / componentWillUpdate` **已废弃**（因副作用和执行不确定）

---

##### ✅ ✅ **新生命周期（Fiber 之后）**

| 阶段 | 生命周期函数                                                                                                           |
| -- | ---------------------------------------------------------------------------------------------------------------- |
| 挂载 | constructor → **getDerivedStateFromProps** → render → **componentDidMount**                                      |
| 更新 | **getDerivedStateFromProps** → shouldComponentUpdate → render → **getSnapshotBeforeUpdate** → componentDidUpdate |
| 卸载 | componentWillUnmount                                                                                             |

---

✅ 补充说明：

| 生命周期                     | 用途                   |
| ------------------------ | -------------------- |
| componentDidMount        | 发起请求、订阅、DOM 操作       |
| componentDidUpdate       | 依赖更新后的 DOM           |
| componentWillUnmount     | 清理定时器、取消订阅           |
| getDerivedStateFromProps | 从 props 派生 state（慎用） |
| getSnapshotBeforeUpdate  | DOM 更新前获取快照，如滚动位置    |

---

✅ **函数组件对应生命周期（Hooks）**

| 类组件生命周期               | Hooks 替代                           |
| --------------------- | ---------------------------------- |
| componentDidMount     | useEffect(() => {}, [])            |
| componentDidUpdate    | useEffect(() => {})                |
| componentWillUnmount  | useEffect(() => return cleanup)    |
| shouldComponentUpdate | React.memo / useMemo / useCallback |

---

##### ✅ 一句话总结：

> 新版移除了不安全生命周期，加入 `getDerivedStateFromProps` 和 `getSnapshotBeforeUpdate`，函数组件通过 Hooks 实现生命周期能力。


# 💯💯💯 hooks

### ✅ **1. 为什么 React 推出 Hooks？**

React 推出 Hooks主要解决三个问题：

##### ✅ ① 逻辑复用困难（类组件无法复用状态逻辑）

以前用 HOC / Render Props，写法复杂、嵌套地狱
Hooks 可以通过 **自定义 Hook** 复用逻辑

```js
useUsers()
useScroll()
useDebounce()
```

---

##### ✅ ② 类组件 this 难理解

`this` 指向易出错
函数组件没有 `this`，学习成本更低

---

##### ✅ ③ 生命周期难用，逻辑分散

同一逻辑拆在多个生命周期中
Heat：网络请求、DOM 操作、订阅、清除逻辑分散在 Mount/Update/Unmount
Hooks 能把逻辑集中在一个 useEffect 里

---

✅ 一句话总结：

> **Hooks 让你在不写 class 的情况下使用 state & 生命周期，逻辑复用更简单、代码更清晰。**

---

### ✅ **2. useState 和 useRef 的区别？**

| 对比项      | useState     | useRef          |
| -------- | ------------ | --------------- |
| 是否引发重新渲染 | ✅ 会          | ❌ 不会            |
| 保存的值     | 状态，每次都会参与渲染  | 一个可变的值，不参与渲染    |
| 用途       | UI 状态、组件显示变化 | 保存 DOM、定时器、缓存旧值 |

✅ 例子：useRef 不会触发渲染

```js
const ref = useRef(0);
ref.current++;
```

✅ 用来保存 DOM：

```js
const inputRef = useRef();
<input ref={inputRef} />
inputRef.current.focus();
```

✅ 用来记录前一次值（不会触发渲染）：

```js
const prev = useRef(count);
```

✅ 一句话总结：

> **useState 用于 UI 状态，会触发渲染；useRef 用于存值、存 DOM，不会触发渲染。**

---

### ✅ **3. useEffect 的执行时机？如何避免无限循环？**

##### ✅ 执行时机：

* 在 **DOM 更新后、浏览器绘制之后** 异步执行
* 类似 `componentDidMount + componentDidUpdate + componentWillUnmount`

---

##### ✅ 避免无限循环的关键：依赖项！

错误写法（每次渲染都更新状态 → 无限循环）：

```js
useEffect(() => {
  setCount(count + 1);
});
```

✅ 正确写法：

```js
useEffect(() => {
  setCount(count + 1);
}, []); // 只执行一次
```

或：

```js
useEffect(() => {
  console.log(count);
}, [count]); // 只有 count 变化才执行
```

✅ 清理副作用：

```js
useEffect(() => {
  const timer = setInterval(...);
  return () => clearInterval(timer);
}, []);
```

---

### ✅ **4. useEffect 和 useLayoutEffect 的区别？**

| 对比     | useEffect  | useLayoutEffect  |
| ------ | ---------- | ---------------- |
| 执行时机   | 渲染后异步执行    | 渲染后、浏览器绘制前（同步）   |
| 是否阻塞渲染 | ❌ 不会       | ✅ 会阻塞渲染          |
| 使用场景   | 网络请求、订阅、日志 | DOM 读取、布局计算、避免闪烁 |

✅ useLayoutEffect 示例：

```js
useLayoutEffect(() => {
  const height = divRef.current.clientHeight;
  setHeight(height);
});
```

✅ 一句话总结：

> **要读/写 DOM 用 useLayoutEffect，其余用 useEffect。**

---

### ✅ **5. useMemo 和 useCallback 有什么用？什么时候用？**

| Hook        | 作用     | 返回值 |
| ----------- | ------ | --- |
| useMemo     | 缓存计算结果 | 值   |
| useCallback | 缓存函数   | 函数  |

✅ useMemo 示例：

```js
const total = useMemo(() => compute(list), [list]);
```

避免每次 render 都重新计算（性能优化）

✅ useCallback 示例：

```js
const onClick = useCallback(() => {
  setCount(count + 1);
}, [count]);
```

避免子组件因为函数引用改变而重新渲染

✅ 使用场景：
✔ expensive 计算
✔ 子组件依赖 props（React.memo）
✔ 避免函数重新创建造成 diff 变化

---

### ✅ **6. 自定义 Hook 如何编写？应用场景？**

✅ 自定义 Hook 就是一个名称以 `use` 开头的函数，可以使用其他 Hooks：

示例：封装窗口宽度监听

```js
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
}
```

使用：

```js
const width = useWindowWidth();
```

✅ 场景：
✔ 网络请求 useRequest
✔ 表单处理 useForm
✔ 防抖节流 useDebounce/useThrottle
✔ localStorage 状态持久化
✔ socket 订阅 etc.

✅ 一句话总结：

> 自定义 Hook 是逻辑复用的最佳方式，不重复代码、组合灵活。

---

### ✅ **7. useReducer vs Redux？**

| 对比项   | useReducer | Redux                  |
| ----- | ---------- | ---------------------- |
| 作用范围  | 单个组件或局部    | 全局状态管理                 |
| 配置复杂度 | 简单         | 需要 store / middleware  |
| 开销    | 小、无依赖      | 大、状态可序列化、可调试           |
| 异步    | 自己处理       | middleware（thunk、saga） |
| 状态共享  | 需要 Context | 天然全局共享                 |

✅ useReducer：

```js
const [state, dispatch] = useReducer(reducer, initialState);
```

一句话：

> useReducer 适合中小规模局部状态；Redux 适合大型应用、全局共享、可调试场景。

---

### ✅ **8. useImperativeHandle / useRef 操作 DOM 的原理？**

* useRef 获取真实 DOM：

```js
const inputRef = useRef();
<input ref={inputRef} />
inputRef.current.focus();
```

* useImperativeHandle 暴露给父组件的 DOM API（受控化）

```js
useImperativeHandle(ref, () => ({
  focus: () => inputRef.current.focus()
}));
```

✅ 原理：
React 使用 **ref.current 指向真实 DOM 或实例**
父组件获取到 ref 后就能直接操作 DOM

✅ 使用场景：
✔ 第三方库（canvas、swiper、video）
✔ 手动聚焦、滚动、选择、播放/暂停

---

### ✅ **9. 为什么不要在循环、条件语句中使用 Hooks？**

因为 Hook 必须保持 **调用顺序一致**。

React 根据调用顺序记录 Hook：

```
useState → useEffect → useMemo → ...
```

如果放在条件里，会改变 Hook 调用顺序 ↓

```js
if (show) {
  useState();  // ❌ 错误
}
```

下一次渲染顺序不一致，React 无法匹配对应 state，导致崩溃。

✅ 正确：

```js
const [visible, setVisible] = useState(false);
useEffect(() => { ... }, []);
```

✅ 一句话总结：

> Hook 必须在函数最顶层调用、不能写在条件、循环、嵌套中的原因是：**保证调用顺序一致**。

---

### ✅ **10. React Hook 的闭包陷阱？**

问题表现：effect 或回调里拿到的是“旧 state”

```js
const [count, setCount] = useState(0);

useEffect(() => {
  setInterval(() => {
    console.log(count); // 一直是 0
  }, 1000);
}, []);
```

✅ 原因：
`useEffect` 的回调捕获了当时的 `count`，形成闭包 → 不会随 state 更新

✅ 解决方法：

✔ 方法 1：添加依赖

```js
useEffect(() => {
  console.log(count);
}, [count]);
```

✔ 方法 2：用函数式 setState（最佳）

```js
setCount(prev => prev + 1);
```

✔ 方法 3：使用 ref 存当前值

```js
const ref = useRef();
ref.current = count;
```

✅ 一句话总结：

> Hook 捕获的是渲染时的变量快照，如果依赖不更新，就会拿到旧值——这就是闭包陷阱。

---

✅ 如果你需要，我可以继续整理：

* 👉 React 性能优化面试题
* 👉 虚拟 DOM & Fiber 面试题
* 👉 Redux/React-Router 面试题
* 👉 高级场景题（防止重复请求、虚拟列表、白屏排查等）

# 💯💯💯 性能优化（必问）

## 💡 一、React 性能优化方案有哪些？

### 1️⃣ React.memo

**作用：**
让函数组件在相同 props 的情况下跳过重新渲染。类似类组件中的 `PureComponent`。

**原理：**
React.memo 会对前后 props 做浅比较（shallow compare）。如果相同，则不会重新渲染。

**示例：**

```jsx
const Child = React.memo(({ name }) => {
  console.log('Child render');
  return <div>{name}</div>;
});

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <Child name="Tom" />
      <button onClick={() => setCount(count + 1)}>add</button>
    </>
  );
}
```

✅ 优化后：点击按钮不会重新渲染 `Child`
❌ 优化前：`App` 一更新，`Child` 也会更新

---

### 2️⃣ useMemo

**作用：**
缓存**计算结果**，避免每次渲染都执行高代价的计算。

**原理：**
`useMemo(fn, deps)` → 当依赖不变时，直接返回上一次计算结果。

**示例：**

```jsx
const total = useMemo(() => {
  console.log("Recalculate...");
  return list.reduce((a, b) => a + b, 0);
}, [list]);
```

---

### 3️⃣ useCallback

**作用：**
缓存**函数引用**，避免子组件因 props 传入的函数变化而重复渲染。

**示例：**

```jsx
const handleClick = useCallback(() => {
  console.log("clicked");
}, []);
```

**区别：**

* `useMemo` 缓存 **值**
* `useCallback` 缓存 **函数**

---

### 4️⃣ 分片渲染（Time Slicing）/ 虚拟列表

**目的：**
当数据量很大时（几千上万条），防止一次性渲染造成页面卡顿。

**原理：**

* **分片渲染：** 把渲染任务拆分成小块，分多帧执行。
* **虚拟列表（Virtual List）：** 只渲染“可视区域”内的元素，非可见部分不渲染。

**示例：react-window/react-virtualized**

```jsx
import { FixedSizeList as List } from 'react-window';

<List
  height={500}
  itemCount={10000}
  itemSize={35}
  width={300}
>
  {({ index, style }) => <div style={style}>Row {index}</div>}
</List>
```

---

### 5️⃣ React.lazy / Suspense

**作用：**
实现**代码分割（Code Splitting）**，按需加载组件。

**原理：**
在打包时（Webpack/ESBuild），会把懒加载组件单独打包成 chunk。首次加载时只加载主 bundle，懒加载组件等到用到时再请求。

**示例：**

```jsx
const About = React.lazy(() => import('./About'));

<Suspense fallback={<div>Loading...</div>}>
  <About />
</Suspense>
```

---

### 6️⃣ key 优化 diff

**作用：**
`key` 帮助 React 更快定位 DOM 节点，减少不必要的创建和销毁。

**优化点：**

* 使用唯一且稳定的 key，如 id
* 避免使用 index 作为 key（可能导致复用错误）

---

### ✅ 小结

| 优化手段                       | 作用方向       |
| -------------------------- | ---------- |
| React.memo / PureComponent | 避免子组件重复渲染  |
| useMemo / useCallback      | 缓存值或函数引用   |
| React.lazy / Suspense      | 代码分割，懒加载   |
| 虚拟列表 / 分片渲染                | 优化大数据量渲染性能 |
| key 优化                     | 提高 diff 效率 |

---

## ⚙️ 二、什么是 Fiber？解决了什么问题？

### 🌿 Fiber 的定义

**Fiber 是 React 16 引入的一种新的协调（Reconciliation）算法的核心数据结构。**
本质上，它是对 **虚拟 DOM 的重构**，让渲染变得可中断、可恢复、可优先级调度。

---

### ❓React 15 的问题

React 15 的协调（Reconciliation）是**递归同步**的：

* 树很大时（成千上万个节点）
* 一次 setState 会递归渲染整棵树
* JS 线程被长时间占用
* 导致掉帧、页面卡顿（60fps 被阻塞）

---

### 💡Fiber 的目标

React Fiber 让渲染过程变成**可中断、可恢复的异步任务**：

| 机制  | 说明                         |
| --- | -------------------------- |
| 可中断 | 当有更高优先级任务（如用户输入）时，可以暂停当前渲染 |
| 可恢复 | 暂停后可以从上次中断处继续              |
| 可分片 | 渲染分为多个小单元（Fiber Node）逐步执行  |

---

### ⚙️ Fiber 的核心实现

每个组件对应一个 Fiber Node，节点上包含：

* `type`（组件类型）
* `pendingProps`（新的 props）
* `child` / `sibling` / `return`（形成链表结构）
* `alternate`（旧 Fiber，用于 diff）

渲染流程被拆分为两个阶段：

1. **Render 阶段（可中断）**：生成 Fiber 树（diff）
2. **Commit 阶段（不可中断）**：批量提交 DOM 更新

---

### 🧠 简单类比

> Fiber 像一个“任务切片调度器”：
>
> React 15：递归 → 一次性干完
> React Fiber：循环 → 干一点 → 检查任务队列 → 再干一点

---

## 🧩 三、如何减少组件重复渲染？

### 1️⃣ 使用 React.memo（或 PureComponent）

阻止无意义的子组件更新。

### 2️⃣ 使用 useCallback / useMemo

保证 props 不变：

```jsx
const onClick = useCallback(() => doSomething(), []);
```

### 3️⃣ 避免不必要的 state 提升

不要把只在局部使用的数据放在父组件，否则父组件更新会连带子组件更新。

### 4️⃣ 拆分组件

粒度更细的组件能减少渲染范围。

### 5️⃣ key、列表项稳定

防止列表 diff 错误导致重新创建 DOM。

### 6️⃣ 使用不可变数据（immutable）

避免对象引用变化导致浅比较失效。

---

## 📜 四、什么是虚拟滚动（Virtual Scrolling）？实现原理？

### 💡 定义

**虚拟滚动**是一种性能优化技术，用于在长列表中只渲染“可见区域的元素”。

---

### 📈 场景

比如 10,000 条数据，如果全部渲染，DOM 节点过多会极其卡顿。
虚拟滚动只显示 20~50 条“可见项”，当滚动时动态替换。

---

### ⚙️ 实现原理

1. **计算可视区域的起止索引**
   根据滚动条 `scrollTop` 和单项高度计算当前可见项范围。

   ```js
   const start = Math.floor(scrollTop / itemHeight);
   const end = start + visibleCount;
   ```

2. **仅渲染这一部分数据**

   ```jsx
   const visibleData = data.slice(start, end);
   ```

3. **使用空白占位**
   模拟整体高度，保证滚动条正常。

   ```jsx
   <div style={{ height: data.length * itemHeight }}>
     <div style={{ transform: `translateY(${start * itemHeight}px)` }}>
       {visibleData.map(...)}
     </div>
   </div>
   ```

4. **滚动时动态更新**
   `onScroll` 时重新计算 start/end，更新渲染内容。

---

### 🧰 现成库

* `react-window`（轻量）
* `react-virtualized`（功能强大）
* `virtual` from `tanstack/react-virtual`

---

✅ **总结表**

| 技术点                   | 核心思路      | 实际场景    |
| --------------------- | --------- | ------- |
| React.memo            | 缓存组件渲染    | 父组件频繁更新 |
| useMemo / useCallback | 缓存值或函数    | 避免引用变化  |
| Fiber                 | 可中断异步渲染架构 | 大量节点更新  |
| 虚拟滚动                  | 只渲染可见元素   | 长列表场景   |

