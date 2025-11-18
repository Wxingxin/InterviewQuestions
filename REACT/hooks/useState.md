下面给你一份 **React `useState` 使用大全（超全 + 示例 + 注意点）**
适合新手到中级系统理解 `useState` 的全部玩法。

---

# 🟦 目录（建议收藏）

1. 基本用法
2. 初始化方式（值、函数）
3. 多状态管理（对象、数组、解构更新）
4. 异步更新概念（批处理）
5. 基于上一次 state 更新（函数式更新）
6. 延迟/惰性初始化
7. 更新对象/数组的正确做法
8. 回调形式的 setter
9. 强制刷新组件
10. 常见错误与坑
11. useState vs useReducer 什么时候用

---

# 🟩 1. 基本用法

```jsx
const [count, setCount] = useState(0);
```

* `count`：状态
* `setCount`：设置状态

---

# 🟩 2. 初始化方式

## 2.1 直接初始化

```jsx
const [age, setAge] = useState(18);
```

## 2.2 惰性初始化（只初始化一次）

```jsx
const [value, setValue] = useState(() => {
  console.log("只会执行一次");
  return expensiveCalc(); // 初始化开销大时推荐
});
```

---

# 🟩 3. 多状态管理

## 3.1 多个 useState（推荐）

```jsx
const [name, setName] = useState("");
const [age, setAge] = useState(18);
```

## 3.2 用对象管理多个状态（不推荐过度使用）

```jsx
const [user, setUser] = useState({
  name: "",
  age: 0,
});
```

更新时必须拷贝：

```jsx
setUser(prev => ({ ...prev, age: prev.age + 1 }));
```

---

# 🟩 4. 异步更新（React 批处理机制）

在 React 中：

```jsx
setCount(count + 1);
setCount(count + 1);
```

两次并不会加 2，因为 React 会“批处理更新”，state 还没改变。

如果你想要加 2，请用函数式更新：

```jsx
setCount(c => c + 1);
setCount(c => c + 1);
```

---

# 🟩 5. 基于上一次 state 更新（函数式更新）

这是 “正确更新 state” 的 关键技巧。

```jsx
setCount(prev => prev + 1);
```

经典例子加 3：

```jsx
setCount(c => c + 1);
setCount(c => c + 1);
setCount(c => c + 1);
```

---

# 🟩 6. 惰性初始化（只执行一次）

适用于初始化需要大量计算的情况：

```jsx
const [list, setList] = useState(() => loadBigData());
```

不管组件怎么更新，loadBigData 只执行一次。

---

# 🟩 7. 更新对象/数组的正确方式（⭐重点）

React 的 state 是不可变的（immutable），不能直接修改：

❌ 错误：

```jsx
user.age = 10;
setUser(user);
```

✔ 正确：

```jsx
setUser(prev => ({ ...prev, age: 10 }));
```

---

## 7.1 更新数组

### 添加元素

```jsx
setList(prev => [...prev, newItem]);
```

### 删除元素

```jsx
setList(prev => prev.filter(item => item.id !== id));
```

### 更新某项

```jsx
setList(prev =>
  prev.map(item => 
    item.id === id ? { ...item, name: "newName" } : item
  )
);
```

---

# 🟩 8. setter 并不是立即生效（不要这样写）

❌ 错误用法：

```jsx
setCount(count + 1);
console.log(count); // 旧值
```

要想获取更新后的值，请用 useEffect：

```jsx
useEffect(() => {
  console.log("count 更新了：", count);
}, [count]);
```

---

# 🟩 9. 强制刷新组件

没有和 class 组件一样的 `forceUpdate`，但可以这样模拟：

```jsx
const [, forceUpdate] = useState(0);

forceUpdate(n => n + 1);
```

---

# 🟩 10. 常见错误与坑

## ❌ 10.1 条件/循环里使用 useState

错误👇

```jsx
if (xxx) {
  const [a, setA] = useState(0);
}
```

必须放在最顶层

✔ 正确👇

```jsx
const [a, setA] = useState(0);

if (xxx) {
  // ...
}
```

---

## ❌ 10.2 state 是异步的 — 不要指望 set 后立刻拿到新值

```jsx
setCount(count + 1);
console.log(count); // 旧值
```

---

## ❌ 10.3 直接修改 state（不要这么写）

```jsx
user.age = 10;
setUser(user); // 错误
```

---

## ❌ 10.4 React 会合并相同的 state 更新（优化）

```jsx
setCount(1);
setCount(1);
```

只会触发一次更新。

---

# 🟩 11. useState vs useReducer（什么时候用？）

| 场景               | 用 useState | 用 useReducer |
| ---------------- | ---------- | ------------ |
| 简单状态（表单、计数器）     | ✔ 推荐       | ❌            |
| 复杂对象（多层嵌套）       | 不太好        | ✔ 推荐         |
| 需要根据 action 管理逻辑 | ❌          | ✔            |
| 多个组件共享状态         | ❌          | 需搭配 context  |

比如复杂表单：

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
```

---

# 🎁 Bonus：最常用的 useState 模式总结（速查表）

## ① 简单值

```jsx
const [count, setCount] = useState(0);
```

## ② 函数式更新（基于旧值）

```jsx
setCount(c => c + 1);
```

## ③ 对象更新（浅拷贝）

```jsx
setUser(prev => ({ ...prev, age: prev.age + 1 }));
```

## ④ 数组更新（增删改）

```jsx
setList(prev => [...prev, item]);
```

## ⑤ 惰性初始化

```jsx
useState(() => heavyWork());
```

---

# ❤️ 如果你需要，我可以继续提供：

* **useEffect 使用大全**
* **useMemo 使用大全**
* **useCallback 使用大全**
* **React hooks 全家桶学习路线图**
* **或者帮你做一个 React + Zustand/Redux 优雅代码规范模板**

你想继续学哪一个？
