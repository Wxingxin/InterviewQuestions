
## 🧠 一、什么是 `memoize`

**定义：**

> `memoize(fn)` 是一个高阶函数，用于缓存函数的执行结果。
> 当传入相同参数时，直接返回上次计算的结果，而不再重新计算。

**核心思想：**
✅ 用闭包保存“参数 -> 结果”的映射。

---

## 🧩 二、最简版实现

```js
function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log("缓存命中:", key);
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
```

### ✅ 示例

```js
function add(a, b) {
  console.log("计算中...");
  return a + b;
}

const memoizedAdd = memoize(add);

console.log(memoizedAdd(1, 2)); // 计算中... → 3
console.log(memoizedAdd(1, 2)); // 缓存命中: [1,2] → 3
console.log(memoizedAdd(2, 3)); // 计算中... → 5
```

---

## ⚙️ 三、改进版（支持复杂对象、缓存清理）

```js
function memoize(fn, resolver = (...args) => JSON.stringify(args)) {
  const cache = new Map();

  const memoized = function (...args) {
    const key = resolver(...args);
    if (cache.has(key)) return cache.get(key);

    const result = fn.apply(this, args);
    cache.set(key, result);

    // 可选：清理策略，防止缓存过多
    if (cache.size > 1000) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    return result;
  };

  memoized.clear = () => cache.clear();
  return memoized;
}
```

### ✅ 示例

```js
function multiply(a, b) {
  console.log("执行计算...");
  return a * b;
}

const memoizedMultiply = memoize(multiply);

memoizedMultiply(2, 5); // 执行计算... → 10
memoizedMultiply(2, 5); // 直接返回缓存 → 10
```

---

## 🔥 四、真实面试延伸问法

| 面试问题                             | 思考方向                                                          |
| -------------------------------- | ------------------------------------------------------------- |
| 1️⃣ `memoize` 与 `useMemo` 有什么区别？ | `memoize` 缓存函数结果；`useMemo` 是 React Hook，用于组件内缓存计算值，依赖变化时重新计算。 |
| 2️⃣ 如何让 `memoize` 支持多参数？         | 用 `JSON.stringify(args)` 或自定义 key 生成函数。                       |
| 3️⃣ 如何让缓存失效？                     | 可以加入 `expireTime` 参数，每个缓存存储时间戳，到期后删除。                         |
| 4️⃣ Map vs WeakMap？              | `WeakMap` 可用于对象 key，自动释放内存，防止内存泄漏。                            |

---

## 🚀 五、扩展：LRU 版本（更贴近真实面试）

```js
function memoizeLRU(fn, limit = 3) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      const value = cache.get(key);
      cache.delete(key); // 重新插入，保持最近使用
      cache.set(key, value);
      return value;
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    if (cache.size > limit) {
      cache.delete(cache.keys().next().value); // 删除最旧项
    }
    return result;
  };
}
```

---

是否希望我帮你写一个带 **过期时间（TTL）+LRU策略** 的 `memoize`，这是阿里、字节都爱考的综合变体？
