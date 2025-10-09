# 布局

---

> ## FLEX 布局大全

### 容器属性（作用于父元素）

常见属性：

| 属性              | 作用                                                    |
| ----------------- | ------------------------------------------------------- |
| `display: flex`   | 启用 Flex 布局                                          |
| `flex-direction`  | 主轴方向（row / row-reverse / column / column-reverse） |
| `flex-wrap`       | 是否换行（nowrap / wrap / wrap-reverse）                |
| `flex-flow`       | `flex-direction` + `flex-wrap` 的简写                   |
| `justify-content` | 沿主轴对齐方式                                          |
| `align-items`     | 沿交叉轴对齐方式                                        |
| `align-content`   | 多根轴线的对齐方式（多行时生效）                        |

---

### 子项属性（作用于子元素）

常见属性：

| 属性          | 作用                                               |
| ------------- | -------------------------------------------------- |
| `order`       | 定义子项排列顺序（默认 0，值越小越靠前）           |
| `flex-grow`   | 放大比例（默认 0，不放大）                         |
| `flex-shrink` | 缩小比例（默认 1，允许缩小）                       |
| `flex-basis`  | 分配空间前的初始大小                               |
| `flex`        | `flex-grow flex-shrink flex-basis` 的简写          |
| `align-self`  | 单个子项在交叉轴上的对齐方式（覆盖 `align-items`） |

> flex

> ## CSS Grid 布局大全

-  **Grid** 是二维布局系统，可以同时控制 **行（row）** 和 **列（column）**。
-  **容器（container）**：使用 `display: grid` 定义。
-  **网格项（item）**：Grid 容器的直接子元素。
-  **轨道（track）**：行或列。
-  **单元格（cell）**：行列交叉形成的矩形区域。
-  **区域（area）**：多个单元格组合形成的矩形区域。

---

### 2️⃣ 容器属性（控制整体布局）

| 属性                             | 说明                       | 常用值                              |
| -------------------------------- | -------------------------- | ----------------------------------- |
| `display`                        | 定义网格容器               | `grid`, `inline-grid`               |
| `grid-template-columns`          | 定义列宽                   | `100px 200px 1fr`，`repeat(3, 1fr)` |
| `grid-template-rows`             | 定义行高                   | `100px 200px`, `auto`               |
| `grid-template-areas`            | 给网格命名区域             | `"header header" "sidebar main"`    |
| `gap` / `row-gap` / `column-gap` | 行列间距                   | `10px`, `1rem`                      |
| `justify-items`                  | 单元格内子元素水平方向对齐 | `start`, `center`, `stretch`        |
| `align-items`                    | 单元格内子元素垂直方向对齐 | `start`, `center`, `stretch`        |
| `justify-content`                | 整个网格水平对齐           | `start`, `center`, `space-between`  |
| `align-content`                  | 整个网格垂直对齐           | `start`, `center`, `space-around`   |

---

### 3️⃣ 子元素属性（控制网格项）

| 属性                      | 说明             | 示例                                              |
| ------------------------- | ---------------- | ------------------------------------------------- |
| `grid-column-start / end` | 设置起始和结束列 | `grid-column: 1 / 3`（跨两列）                    |
| `grid-row-start / end`    | 设置起始和结束行 | `grid-row: 1 / 2`                                 |
| `grid-column`             | 快捷写法         | `grid-column: 2 / span 3`（从第 2 列开始跨 3 列） |
| `grid-row`                | 快捷写法         | `grid-row: 1 / span 2`                            |
| `grid-area`               | 指定元素区域     | `grid-area: header`（对应 grid-template-areas）   |
| `justify-self`            | 水平对齐         | `start`, `center`, `end`, `stretch`               |
| `align-self`              | 垂直对齐         | `start`, `center`, `end`, `stretch`               |

---

> ## css 的两栏布局怎么实现

前端面试常问的 CSS 布局题 ✅，两栏布局有多种实现方式，我帮你整理成**常见方法 + 核心代码 + 面试答题模板**：

---

## 1️⃣ float 布局（老方法）

```css
.container {
  width: 100%;
}
.left {
  float: left;
  width: 70%;
}
.right {
  float: right;
  width: 30%;
}
```

* 特点：简单，但需要清除浮动（`clearfix`）。
* 不适合复杂响应式布局。

```css
.container::after {
  content: "";
  display: block;
  clear: both;
}
```

---

## 2️⃣ Flex 布局（推荐现代方法）

```css
.container {
  display: flex;
}
.left {
  flex: 7; /* 占 70% */
}
.right {
  flex: 3; /* 占 30% */
}
```

* 特点：响应式好，顺序可调整，支持对齐和伸缩。
* 面试加分点：可以用 `justify-content` 和 `align-items` 控制对齐。

---

## 3️⃣ Grid 布局（现代 CSS 布局）

```css
.container {
  display: grid;
  grid-template-columns: 70% 30%;
}
.left {
  grid-column: 1;
}
.right {
  grid-column: 2;
}
```

* 特点：更适合复杂网格布局，精确控制行列大小。
* 面试加分点：可以轻松扩展到多行多列。

---

## 4️⃣ inline-block 布局

```css
.left, .right {
  display: inline-block;
  vertical-align: top;
}
.left {
  width: 70%;
}
.right {
  width: 30%;
}
```

* 特点：兼容性好，但会有 **空白间隙问题**。

---

## 5️⃣ 绝对定位布局（不推荐，但经典面试题）

```css
.container {
  position: relative;
}
.left {
  position: absolute;
  left: 0;
  width: 70%;
}
.right {
  position: absolute;
  right: 0;
  width: 30%;
}
```

* 特点：固定位置，容易覆盖，不适合响应式。

---

## 📝 面试简答模板

> 两栏布局常见实现方式：
>
> 1. **Float 布局**：老方法，需要清除浮动；
> 2. **Flex 布局**：现代推荐，支持响应式和伸缩；
> 3. **Grid 布局**：现代网格布局，适合复杂多列；
> 4. **Inline-block**：兼容性好，但有空隙问题；
> 5. **绝对定位**：不推荐，适合固定布局。

---

我可以帮你画一张 **“两栏布局方法对比图 + 优缺点”**，一张图面试就能讲清楚所有实现方式。

你希望我画吗？


> ## css 的三布局怎么实现

三栏布局是前端面试经典题 ✅，和两栏类似，但需要多列分配和响应式考虑。我帮你整理 **多种方法 + 核心代码 + 面试答题模板**。

---

## 1️⃣ Float 布局（老方法）

```css
.container {
  width: 100%;
}
.left {
  float: left;
  width: 20%;
}
.center {
  float: left;
  width: 60%;
}
.right {
  float: right;
  width: 20%;
}

/* 清除浮动 */
.container::after {
  content: "";
  display: block;
  clear: both;
}
```

* 特点：经典老方法，需清除浮动。
* 不易实现响应式。

---

## 2️⃣ Flex 布局（现代方法）

```css
.container {
  display: flex;
}
.left {
  flex: 2;
}
.center {
  flex: 6;
}
.right {
  flex: 2;
}
```

* 特点：响应式好，顺序可调整。
* 面试加分点：可用 `order` 改变显示顺序，`justify-content`/`align-items` 控制对齐。

---

## 3️⃣ Grid 布局（现代 CSS）

```css
.container {
  display: grid;
  grid-template-columns: 20% 60% 20%;
  gap: 10px; /* 可选列间距 */
}
.left { grid-column: 1; }
.center { grid-column: 2; }
.right { grid-column: 3; }
```

* 特点：精确控制列宽、间距和响应式。
* 面试加分点：可以轻松扩展为多行多列复杂布局。

---

## 4️⃣ inline-block 布局

```css
.left, .center, .right {
  display: inline-block;
  vertical-align: top;
}
.left { width: 20%; }
.center { width: 60%; }
.right { width: 20%; }
```

* 特点：兼容性好，但存在 **空白间隙问题**。

---

## 5️⃣ 绝对定位布局（面试中可提）

```css
.container { position: relative; }
.left {
  position: absolute;
  left: 0;
  width: 20%;
}
.center {
  position: absolute;
  left: 20%;
  width: 60%;
}
.right {
  position: absolute;
  right: 0;
  width: 20%;
}
```

* 特点：固定布局，不利于响应式，不推荐。

---

## 📝 面试简答模板

> 三栏布局实现方法：
>
> 1. **Float 布局**：老方法，需要清除浮动；
> 2. **Flex 布局**：现代推荐，响应式好，支持顺序调整；
> 3. **Grid 布局**：现代网格布局，精确控制列宽和间距；
> 4. **Inline-block**：兼容性好，但有空白间隙问题；
> 5. **绝对定位**：固定布局，不适合响应式。

---

我可以帮你画一张 **“三栏布局方法对比图 + 优缺点 + 响应式示意”**，一张图面试就能讲清楚各种方法。

你希望我画吗？


# 选择器

---

# BFC

---

# 以下是常见的隐藏元素的方法

---

# scss tailwind

# other

> ## div 的文本溢出如何解决

这是前端面试中很常见的 **CSS 问题** ✅，解决文本溢出的方式主要有几种，面试可以简单列出：

---

## 1️⃣ 单行文本溢出显示省略号

```css
div {
   width: 200px; /* 固定宽度 */
   white-space: nowrap; /* 不换行 */
   overflow: hidden; /* 超出隐藏 */
   text-overflow: ellipsis; /* 超出显示省略号 */
}
```

**效果：**

> 内容超出 div 宽度时，显示 `...`，只显示一行。

---

## 2️⃣ 多行文本溢出显示省略号

```css
div {
   display: -webkit-box;
   -webkit-box-orient: vertical;
   -webkit-line-clamp: 3; /* 限制显示 3 行 */
   overflow: hidden;
}
```

**效果：**

> 内容超过三行，显示省略号。
> 注意：多行省略号需要浏览器支持 `-webkit-line-clamp`（Chrome、Safari 支持较好）。

---

## 3️⃣ 超出滚动显示

```css
div {
   width: 200px;
   height: 50px;
   overflow: auto; /* 超出显示滚动条 */
}
```

**效果：**

> 内容超出 div 时出现滚动条，可查看全部内容。

---

## 4️⃣ 面试简答模板

> 解决 div 文本溢出主要有三种方式：
>
> 1. 单行文本：`white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`
> 2. 多行文本：使用 `-webkit-line-clamp` 限制行数 + 隐藏溢出
> 3. 超出滚动：`overflow: auto` 或 `scroll` 显示滚动条

## 分析css代码阻塞怎么办

这是前端面试中常考的性能优化题 💡 ——「**CSS 代码阻塞加载怎么办？**」
我们来分两步讲清楚：**原理 + 解决方案**，最后附上面试简答模板。

---

## 🧩 一、为什么 CSS 会阻塞？

浏览器渲染流程（关键点）：

1. 解析 HTML → 构建 DOM；
2. 解析 CSS → 构建 CSSOM；
3. DOM + CSSOM → Render Tree；
4. 再执行 JS、布局和绘制。

⚠️ 所以：

* **外部 CSS** 会阻塞页面的渲染（Render Tree 依赖 CSSOM）；
* **JS 执行** 也会被 CSS 阻塞（浏览器要等 CSSOM 构建完再执行 JS，避免修改样式导致回流）。

---

## ⚙️ 二、如何分析是否阻塞？

1. 打开 **Chrome DevTools → Performance 或 Network 面板**；
2. 查看 CSS 文件加载顺序与阻塞时间；
3. 检查：

   * 是否放在 `<head>`；
   * 是否存在 render-blocking（渲染阻塞）标签；
   * 是否可延迟加载的 CSS。

---

## 🚀 三、解决 CSS 阻塞的常见方案

### ✅ 1. **关键 CSS 内联**

> 把首屏关键样式直接写在 `<style>` 标签中，减少首屏等待。

```html
<head>
  <style>
    /* 关键部分样式 */
    body { font-family: sans-serif; }
  </style>
</head>
```

* 只加载必要的样式；
* 非关键部分延迟加载。

---

### ✅ 2. **异步加载非关键 CSS**

```html
<link rel="preload" href="style.css" as="style" onload="this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="style.css"></noscript>
```

> `preload` 先加载但不阻塞，`onload` 后再应用。

---

### ✅ 3. **分离首屏与非首屏样式**

* 用构建工具（Webpack、Vite）提取关键 CSS；
* 首屏内联，剩余样式延迟加载：

  ```js
  import(/* webpackPrefetch: true */ './lazy.css');
  ```

---

### ✅ 4. **使用媒体查询延迟加载**

```html
<link rel="stylesheet" href="print.css" media="print">
<link rel="stylesheet" href="mobile.css" media="(max-width: 600px)">
```

* 只有匹配时才加载，其他情况不会阻塞。

---

### ✅ 5. **减少 CSS 文件体积**

* 合并文件、压缩（minify）、去除未使用样式（Tree Shaking）。

---

## 🧠 四、面试简答模板

> CSS 文件是渲染阻塞资源，浏览器需要先加载并解析 CSS 才能构建渲染树。
> 优化方式包括：
>
> 1. 将关键 CSS 内联到 HTML；
> 2. 使用 `preload` 或 `media` 异步加载非关键样式；
> 3. 减少和压缩 CSS 文件体积；
> 4. 利用构建工具提取首屏关键 CSS。

---

我可以帮你画一张 **「CSS 阻塞渲染流程图 + 优化策略对比」**，
一张图就能秒讲清浏览器为何阻塞以及如何优化，要我画吗？
