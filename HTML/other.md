# 1 💯💯💯

## 🖼 HTML 部分

```html
<img data-src="real.jpg" class="lazy" alt="">
```

### 作用：

* `data-src="real.jpg"`：真正的图片地址放在 `data-src` 中，不放在 `src`。
* `class="lazy"`：标记这张图片需要懒加载。
* `src` 没写 → 浏览器不会立刻加载图片。

---

# 🧠 JavaScript 部分

## 1️⃣ 选取所有懒加载的图片

```js
const imgs = document.querySelectorAll('img.lazy');
```

`imgs` 是所有带 `.lazy` class 的 `<img>` 元素列表。

---

## 2️⃣ 创建 IntersectionObserver

```js
const observer = new IntersectionObserver(entries => {
```

### 什么是 `IntersectionObserver`？

* 浏览器提供的 API
* 用来监听元素是否出现在 **视口（可见区域）**
* 满足“滚动到视口时再加载”的逻辑，非常适合做懒加载

---

## 3️⃣ 遍历每个监听到的元素状态

```js
entries.forEach(entry => {
  if (entry.isIntersecting) {
```

### `entry.isIntersecting` 的含义：

* `true`：图片进入可视区
* `false`：图片还在屏幕外

所以只有图片滚动进入视口时才加载。

---

## 4️⃣ 真正加载图片

```js
const img = entry.target;
img.src = img.dataset.src;
```

### 做了什么？

* 把 `data-src` 的真实图像地址赋值给 `src`
* 这样浏览器才会开始加载图片
* 懒加载核心逻辑！

---

## 5️⃣ 移除 lazy 类名（可选）

```js
img.classList.remove('lazy');
```

* 加载后，不再需要 `.lazy` 样式
* 也防止重复处理

---

## 6️⃣ 取消对该图片的观察

```js
observer.unobserve(img);
```

* 图片加载完成后，不需要继续监听
* 优化性能：减少不必要的 observer 事件

---

## 7️⃣ 为每个懒加载图片开启观察

```js
imgs.forEach(img => observer.observe(img));
```

* 把每张图片交给 `IntersectionObserver`
* 当用户滚动到某张图片区域，它就会触发加载

---

# 🌟 整体流程图

1. 页面加载时，收集所有 `.lazy` 图片
2. IntersectionObserver 开始监听它们
3. 当某张图片进入视口
   → 把 `data-src` → `src`
   → 自动加载
4. 删除 `.lazy` 类
5. 停止观察该图片
6. 下次滚到其他图片时继续

---

# 🎉 结果

* 图片只有在用户滚到它们时才加载
* 可显著提升页面速度
* 一种高性能、现代的懒加载方案（替代 scroll 事件监听）

---

如果你需要，我还能帮你写：

* 兼容旧浏览器的懒加载版本
* 带淡入动画的懒加载
* 使用 `loading="lazy"` 的简单版本

下面为你清晰解释这段 `<img>` 标签中 **src / srcset / sizes** 的完整作用，它们一起实现了 **响应式图片**（不同屏幕加载不同大小的图片）。

---

# 2 💯💯💯

```html
<img 
  src="img-800.jpg" 
  srcset="
    img-400.jpg 400w,
    img-800.jpg 800w,
    img-1200.jpg 1200w
  "
  sizes="
    (max-width: 600px) 400px,
    (max-width: 1000px) 800px,
    1200px
  "
  alt="示例图片">
```

---

# 📘 各属性作用

## 1️⃣ `src`

```html
src="img-800.jpg"
```

* **默认使用的图片**
* 如果浏览器不支持 `srcset` / `sizes`，就会加载这个。

---

## 2️⃣ `srcset`（给浏览器提供可选的图片列表）

```html
srcset="
  img-400.jpg 400w,
  img-800.jpg 800w,
  img-1200.jpg 1200w
"
```

### 意义：

* 列出了多张图片及其 **固有宽度（w）**
* 让浏览器自己选择最合适的版本

解释：

* `img-400.jpg 400w` → 这张图片宽度是 400px
* `img-800.jpg 800w` → 800px
* `img-1200.jpg 1200w` → 1200px

浏览器会根据设备当前的：

* 屏幕尺寸
* DPR（设备像素比，如 1x / 2x）
* 布局尺寸（元素在页面上实际显示多大）

自动选择最合适的那张图片，而不是总加载最大的。

---

## 3️⃣ `sizes`（告诉浏览器图片在页面上会显示多宽）

```html
sizes="
  (max-width: 600px) 400px,
  (max-width: 1000px) 800px,
  1200px
"
```

### 含义：

**不同屏幕宽度下，图片的显示宽度是多少？**

规则解释：

| 条件          | 显示宽度           |
| ----------- | -------------- |
| 屏幕 ≤ 600px  | 图片大约显示 400px 宽 |
| 屏幕 ≤ 1000px | 图片大约显示 800px 宽 |
| 大于 1000px   | 图片显示 1200px 宽  |

⚡ 浏览器根据这个 width 才知道要从 `srcset` 里选哪张图。

---

# 🔍 浏览器如何选择图片？

举个例子：

### 📱 在手机屏（屏幕 375px，DPR=2）

sizes → 图片显示宽度为 **400px**
所以浏览器计算需要：400px × 2 = **800px 清晰度** 的图片
→ 加载 **img-800.jpg**

---

### 💻 在 1080px 宽屏 / DPR=1

sizes → 图片显示宽度为 **800px**
→ 加载 **img-800.jpg**

---

### 🖥 高分屏（1200px 显示宽度 × DPR=2）

→ 需要 2400px
最大只有 1200w，因此加载 **img-1200.jpg**

---

# 🎯 响应式图片的意义

这样写的好处：

* 📱 移动端不会加载超大图片 → 速度快
* 🖥 高分屏可以显示高清图片 → 不模糊
* 浏览器自动选择最佳图片 → 不需要 JS
* 节省流量 + 提升性能

---

# 🧩 总结（简单一句话）

`srcset` 提供“候选图片”，`sizes` 告诉浏览器“图片会显示多宽”，浏览器根据设备环境自动选择最佳图片。

---

如果你愿意，我还能帮你写：

* 最简版本的响应式图片
* `<picture>` + `<source>` 更复杂的响应式方案（适配 WebP、深色模式等）
* 如何结合懒加载一起使用

告诉我即可！
