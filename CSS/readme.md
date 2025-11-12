# css 的单位和选择器

> ### **CSS 单位有哪些？px、em、rem、%、vh/vw 区别？**

###### 1️⃣ 绝对单位

- px：绝对单位
- `mm,cm,in,pc,pt` :打印用

###### 2️⃣ 相对单位

- em：相对父元素**字体**大小
- rem：相对根元素**字体**大小
- `ex ch` 比较少用

###### 3️⃣ 比例

- %：相对父元素宽/高

###### 4️⃣ 视口

| 单位   | 含义                     | 举例               |
| ------ | ------------------------ | ------------------ |
| `vw`   | 1vw = 视口宽度的 1%      | 100vw = 视口宽度   |
| `vh`   | 1vh = 视口高度的 1%      | 100vh = 视口高度   |
| `vmin` | 取 `vw` 与 `vh` 中较小者 | 保证元素能完整显示 |
| `vmax` | 取 `vw` 与 `vh` 中较大者 | 保证充满较大方向   |

###### 🔀

| 函数      | 作用           | 举例                                 |
| --------- | -------------- | ------------------------------------ |
| `calc()`  | 动态计算长度值 | `width: calc(100% - 50px);`          |
| `clamp()` | 限制范围       | `font-size: clamp(1rem, 2vw, 2rem);` |
| `min()`   | 取最小值       | `width: min(90vw, 600px);`           |
| `max()`   | 取最大值       | `width: max(50%, 300px);`            |

> ### 说说设备像素，css 像素，设备独立像素，dpr，ppi 之间的区别

1. **备像素（Device Pixel）：**

- 设备像素是**物理屏幕**上的一个点，是**显示器**或**移动设备屏幕**的最小单位
- 设备像素的**数量**决定了屏幕的**分辨率**

2. **CSS 像素（CSS Pixel）：**

- CSS 像素是 Web 开发中使用的**抽象单位**，它与设备像素之间存在一定的关系，但并不直接映射到具体的物理像素上。
- 浏览器会根据设备像素比（简称 DPR）将 CSS 像素转换为实际的设备像素。

3. **设备独立像素（也称为密度无关像素）：**

- 设备独立像素**是一个抽象的单位**，用来在不同设备上保持一致的显示效果。
- 在 CSS 中，1 个设备独立像素通常等于 1 个 CSS 像素。设备独立像素的概念有助于实现响应式设计和跨设备兼容性。

4. **设备像素比（DPR）：**

- 物理像素 (Physical Pixels) 和 CSS 像素 (CSS Pixels / Logical Pixels) 之间的比率。如果一个设备的 DPR 为 2，那么 1 个 CSS 像素将对应 4 个设备像素（2x2）。

> ### 🎯 一、CSS 权重的本质：四元组 (a, b, c, d)
>
> CSS 计算选择器的“权重”是为了决定哪条规则优先生效。

| 选择器类型                 | 示例                             | 权重值（A,B,C,D） |
| -------------------------- | -------------------------------- | ----------------- |
| 行内样式（Inline）         | `<div style="color:red">`        | 1,0,0,0           |
| ID 选择器                  | `#box`                           | 0,1,0,0           |
| 类选择器、属性选择器、伪类 | `.item`, `[type=text]`, `:hover` | 0,0,1,0           |
| 元素选择器、伪元素         | `div`, `p`, `::after`            | 0,0,0,1           |
| 通配选择器、继承、层叠     | `*`, 继承属性                    | 0,0,0,0           |

**比较时：**

- 从左到右比较（A,B,C,D）
- 数字越大权重越高
- 若相等，则后定义的规则生效（后写的覆盖前写的）

---

### 2. 特殊规则

- **内联样式** > **ID 选择器** > **类/属性/伪类** > **元素/伪元素**
- **`!important`** 不属于权重体系，它是“**终极优先级**”，但仍可被后一个相同层级的 `!important` 覆盖。
- **继承的样式权重为 0**
- **通配符（\*）的权重为 0**
- **组合选择器权重相加**
  例如：`div#app .title:hover` → `div(0,0,0,1)` + `#app(0,1,0,0)` + `.title(0,0,1,0)` + `:hover(0,0,1,0)` = **(0,1,2,1)**

> ### 🔹 案例 1：基础示例

```css
div {
  color: red;
}
.box {
  color: blue;
}
#main {
  color: green;
}
```

**计算：**

| 选择器  | 权重      | 说明     |
| ------- | --------- | -------- |
| `div`   | (0,0,0,1) | 一个元素 |
| `.box`  | (0,0,1,0) | 一个类   |
| `#main` | (0,1,0,0) | 一个 ID  |

🟢 **结果：绿色生效**，因为 ID 权重最高。

---

> ### 🔹 案例 2：多个选择器叠加

```css
#app .content p {
  color: blue;
}
```

**拆分：**

- `#app` → (0,1,0,0)
- `.content` → (0,0,1,0)
- `p` → (0,0,0,1)

**合计：**
(0,1,1,1)

---

> ### 🔹 案例 3：属性选择器的权重

```css
input[type="text"] {
  color: red;
}
input.text-input {
  color: blue;
}
```

**计算：**

| 选择器               | 权重      | 说明        |
| -------------------- | --------- | ----------- |
| `input[type="text"]` | (0,0,1,1) | 属性 + 元素 |
| `input.text-input`   | (0,0,1,1) | 类 + 元素   |

🟢 权重相同 → 后定义的生效。

---

> ### 🔹 案例 4：伪类的权重

```css
button:hover {
  color: red;
}
button:active {
  color: blue;
}
```

**计算：**

- `button:hover` → (0,0,1,1)
- `button:active` → (0,0,1,1)

权重相等 → **后写的生效**。

---

> ### 🔹 案例 5：伪元素的权重

```css
p::before {
  color: red;
}
p::after {
  color: blue;
}
```

伪元素属于“元素”类别 → (0,0,0,2)

👉 权重相同 → 后定义的生效。

---

> ### 🔹 案例 6：多层组合计算

```css
ul#nav li.active > a:hover {
  color: red;
}
```

分解：

- `ul` → (0,0,0,1)
- `#nav` → (0,1,0,0)
- `li.active` → (0,0,1,1)
- `a:hover` → (0,0,1,1)

加起来：
→ **(0,1,2,3)**

✅ 高权重组合（典型面试题）

---

> ### 🔹 案例 7：行内样式

```html
<p style="color:red;">文本</p>
```

行内样式 = (1,0,0,0)
✅ 无论 CSS 多复杂，都比外部 ID 选择器高。

---

> ### 🔹 案例 8：!important 决胜

```css
#app .title {
  color: red !important;
}
.title {
  color: blue !important;
}
```

两者都有 `!important` → 比权重：

- `#app .title` → (0,1,1,0)
- `.title` → (0,0,1,0)
  ✅ 红色生效。

> 🧠 小结：
>
> - `!important` 超越普通权重；
> - 但多个 `!important` 时仍需比较权重；
> - 行内样式若含 `!important`，是最强王者。

> ### 综合面试题 1

```css
div#main.content[data-role="box"] p.title strong::before
```

👉 权重是多少？

分解：

- `div` → (0,0,0,1)
- `#main` → (0,1,0,0)
- `.content` → (0,0,1,0)
- `[data-role="box"]` → (0,0,1,0)
- `p` → (0,0,0,1)
- `.title` → (0,0,1,0)
- `strong` → (0,0,0,1)
- `::before` → (0,0,0,1)

合计 = **(0,1,3,4)** ✅

> ### 综合面试题 1

```css
#app .a .b .c:hover p::after
```

→ 权重：(0,1,4,2)

---

> ### 综合面试题 1

`input[type=text]:focus` 和 `input.text:focus` 哪个更高？

都为：

- `input[type=text]:focus` → (0,0,2,1)
- `input.text:focus` → (0,0,2,1)
  ➡️ 权重相同，**后写的生效**。

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


> ## CSS Grid 布局大全

- **Grid** 是二维布局系统，可以同时控制 **行（row）** 和 **列（column）**。
- **容器（container）**：使用 `display: grid` 定义。
- **网格项（item）**：Grid 容器的直接子元素。
- **轨道（track）**：行或列。
- **单元格（cell）**：行列交叉形成的矩形区域。
- **区域（area）**：多个单元格组合形成的矩形区域。

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

- 特点：简单，但需要清除浮动（`clearfix`）。
- 不适合复杂响应式布局。

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

- 特点：响应式好，顺序可调整，支持对齐和伸缩。
- 面试加分点：可以用 `justify-content` 和 `align-items` 控制对齐。

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

- 特点：更适合复杂网格布局，精确控制行列大小。
- 面试加分点：可以轻松扩展到多行多列。

---

## 4️⃣ inline-block 布局

```css
.left,
.right {
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

- 特点：兼容性好，但会有 **空白间隙问题**。

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

- 特点：固定位置，容易覆盖，不适合响应式。

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

- 特点：经典老方法，需清除浮动。
- 不易实现响应式。

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

- 特点：响应式好，顺序可调整。
- 面试加分点：可用 `order` 改变显示顺序，`justify-content`/`align-items` 控制对齐。

---

## 3️⃣ Grid 布局（现代 CSS）

```css
.container {
  display: grid;
  grid-template-columns: 20% 60% 20%;
  gap: 10px; /* 可选列间距 */
}
.left {
  grid-column: 1;
}
.center {
  grid-column: 2;
}
.right {
  grid-column: 3;
}
```

- 特点：精确控制列宽、间距和响应式。
- 面试加分点：可以轻松扩展为多行多列复杂布局。

---

## 4️⃣ inline-block 布局

```css
.left,
.center,
.right {
  display: inline-block;
  vertical-align: top;
}
.left {
  width: 20%;
}
.center {
  width: 60%;
}
.right {
  width: 20%;
}
```

- 特点：兼容性好，但存在 **空白间隙问题**。

---

## 5️⃣ 绝对定位布局（面试中可提）

```css
.container {
  position: relative;
}
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

- 特点：固定布局，不利于响应式，不推荐。

---

## 📝 面试简答模板

> 三栏布局实现方法：
>
> 1. **Float 布局**：老方法，需要清除浮动；
> 2. **Flex 布局**：现代推荐，响应式好，支持顺序调整；
> 3. **Grid 布局**：现代网格布局，精确控制列宽和间距；
> 4. **Inline-block**：兼容性好，但有空白间隙问题；
> 5. **绝对定位**：固定布局，不适合响应式。

# BFC

> ### **问题 1：请解释一下什么是 BFC？**

**参考回答：**
BFC (Block Formatting Context)，中文翻译为“块级<font color=red> 格式化上下文 </font>”，是 Web 页面 CSS 视觉渲染的一部分。

1.  **定义：** 它是一个独立的渲染区域，只有块级盒子参与。可以把它理解为一个“结界”或者“独立的小房间”。
2.  **核心作用：** BFC 内部的元素如何布局，与外部的元素互不影响。这个特性使得 BFC 能够解决很多经典的布局问题。
3.  **比喻：** 就像一个密封的箱子，箱子里的物品无论怎么摆放，都不会影响到箱子外面的东西。反之，外面的环境变化也不会直接影响箱子内部的布局。

---

> ### **问题 2：如何触发（创建）一个 BFC？**

**回答思路：**
这是一个必考题。你需要清晰、准确地列举出所有常见的触发条件。

**参考回答：**
在 CSS 中，可以通过设置特定的属性来为一个元素创建 BFC。常见的条件有：

- **根元素 `<html>`**：页面最大的 BFC。
- **浮动元素**：`float` 的值不为 `none`。
- **定位元素**：`position` 的值为 `absolute` 或 `fixed`。
- **display 属性**：
  - `display: inline-block;`
  - `display: table-cell;` 或 `display: table-caption;`
  - `display: flex;` 或 `display: inline-flex;` (它的子元素会建立 Flexbox Formatting Context)
  - `display: grid;` 或 `display: inline-grid;` (它的子元素会建立 Grid Formatting Context)
- **overflow 属性**：`overflow` 的值不为 `visible`，即 `hidden`, `auto`, `scroll`。这是最常用的一种方式。

> **面试官追问：** 你在项目中常用哪种方式创建 BFC？为什么？
> **回答：** 我最常用 `overflow: hidden;`。因为它副作用最小，代码量最少，并且兼容性好。它既能解决问题，又不会像 `float` 或 `position` 那样彻底改变元素的布局模式。当然，现在随着 Flex 和 Grid 的普及，通过 `display: flex` 或 `display: grid` 隐式地创建 BFC 也变得非常普遍。

---

> ### **问题 3：BFC 有哪些布局规则或特性？**

**参考回答：**
BFC 内部遵循以下几个核心的布局规则：

1.  **内部 Box 垂直排列**：在 BFC 内部，块级盒子会从容器的顶部开始，一个接一个地垂直排列。
2.  **垂直方向的距离由 `margin` 决定**：属于同一个 BFC 的两个相邻 Box 的 `margin` 会发生重叠（collapse）。
3.  **BFC 区域不会与浮动元素重叠**：这是 BFC 最重要的特性之一，常用于实现自适应布局。
4.  **BFC 是一个独立容器**：BFC 内部的子元素，即使是浮动元素，其外边界也会被 BFC 的边界所包含。这常用于清除浮动。
5.  **计算 BFC 高度时，浮动元素也参与计算**：这意味着 BFC 可以包裹住内部的浮动元素，防止父元素高度塌陷。

---

> ### **问题 4：BFC 主要用来解决哪些常见的布局问题？请举例说明。**

**参考回答：**
BFC 主要可以解决三大经典布局问题：

**1. 解决外边距重叠（Margin Collapse）**

- **问题描述：** 在同一个 BFC 下，两个相邻的兄弟块级元素的垂直 `margin` 会发生重叠，取其中较大的值。

- **解决方案：** 将其中一个元素用一个新的容器包裹起来，并让这个容器创建 BFC。这样，两个元素就不再属于同一个 BFC，它们的 `margin` 就不会重叠。

- **代码示例：**

  ```html
  <style>
    .box {
      width: 100px;
      height: 100px;
      background: lightblue;
      margin: 20px 0;
    }
    .container {
      overflow: hidden; /* 创建 BFC */
    }
  </style>

  <div class="box"></div>
  <div class="box"></div>

  <div class="box"></div>
  <div class="container">
    <div class="box"></div>
  </div>
  ```

**2. 清除浮动，防止父元素高度塌陷**

- **问题描述：** 当一个容器内的所有子元素都设置了浮动（`float`），子元素会脱离文档流，导致父容器无法被撑开，高度变为 0。

- **解决方案：** 为父容器创建一个 BFC。根据 BFC 的规则，它在计算高度时会包含内部的浮动元素。

- **代码示例：**

  ```html
  <style>
    .parent {
      border: 2px solid red;
      /* overflow: hidden;  <-- 加上这行即可创建BFC，解决高度塌陷 */
    }
    .child {
      float: left;
      width: 100px;
      height: 100px;
      background: lightgreen;
    }
  </style>

  <div class="parent">
    <div class="child"></div>
    <div class="child"></div>
  </div>
  ```

**3. 实现自适应两栏（或三栏）布局**

- **问题描述：** 一侧定宽，另一侧自适应宽度的布局。如果不定宽的一侧不处理，它的内容（特别是文字）会环绕在浮动元素的周围。

- **解决方案：** 左侧元素设置 `float: left`，右侧自适应的元素创建 BFC。根据 BFC 的规则，BFC 的区域不会与浮动元素重叠，所以它会自动占据剩余的空间。

- **代码示例：**

  ```html
  <style>
    .container {
      height: 200px;
    }
    .left {
      float: left;
      width: 200px;
      height: 100%;
      background: lightcoral;
    }
    .right {
      overflow: hidden; /* 关键！为右侧创建 BFC */
      height: 100%;
      background: lightskyblue;
    }
  </style>

  <div class="container">
    <div class="left">Left (Fixed Width)</div>
    <div class="right">
      Right (Auto-Adapting Width). The BFC on this element prevents it from
      overlapping with the floated left element.
    </div>
  </div>
  ```

---

> ### **问题 5：使用 `overflow: hidden` 创建 BFC 有什么副作用？**

**参考回答：**
`overflow: hidden` 是最简单的创建 BFC 的方式，但它不是完美的，存在一些潜在的副作用：

1.  **内容裁剪：** 如果 BFC 容器内部的元素尺寸超出了容器的边界，多出的部分会被隐藏掉（`hidden`）。
2.  **`position: absolute` 的问题：** 在某些情况下，如果 BFC 内部有绝对定位的子元素，并且这个子元素需要溢出容器显示，`overflow: hidden` 会将其裁剪掉。

因此，在选择创建 BFC 的方式时，需要根据具体的场景来决定。如果确定内部元素不会溢出，那么 `overflow: hidden` 是一个很好的选择。否则，可能需要考虑使用 `display: flow-root`（见下题）或其他方法。

---

> ### **问题 6：除了上面提到的方法，还有没有其他创建 BFC 的方式？`display: flow-root` 是什么？**

**参考回答：**
是的，有一个专门为此而生的新属性值：`display: flow-root;`。

`flow-root` 的唯一作用就是无副作用地创建一个新的 BFC。它不像 `overflow: hidden` 会裁剪内容，也不像 `float` 或 `position` 会改变元素本身的布局行为。它就是为了解决 BFC 应用场景而设计的，可以看作是创建 BFC 的“最佳实践”。

它的兼容性目前已经相当不错（除了 IE），在现代浏览器中可以放心使用。

---

> ### **问题 7：Flexbox 和 Grid 布局的出现，是否让 BFC 变得不那么重要了？**

**参考回答：**
这是一个很好的问题。可以从两个层面来看：

1.  **从解决布局问题的角度：** 是的，在很大程度上，Flexbox 和 Grid 的出现大大降低了我们“手动”创建 BFC 来解决布局问题的需求。

    - **清除浮动/高度塌陷：** 直接给父容器设置 `display: flex` 或 `display: grid` 就能解决，因为它们会创建新的格式化上下文（FFC/GFC），其行为类似于 BFC 可以包裹子元素。
    - **多栏布局：** Flexbox 和 Grid 是为这类布局而生的，提供了比 `float` + BFC 更强大、更灵活、更简洁的解决方案。

2.  **从理解 CSS 核心概念的角度：** BFC 依然非常重要。

    - **基础概念：** BFC 是 CSS 盒子模型和视觉渲染中最核心的概念之一。理解 BFC 有助于我们理解页面是如何渲染的，为什么会出现一些看似“奇怪”的 bug（比如外边距重叠）。
    - **遗留代码和兼容性：** 我们仍然会遇到大量使用 `float` 布局的老项目，理解 BFC 是维护这些代码的关键。
    - **小技巧应用：** 即使在 Flex/Grid 布局中，有时也可能会遇到外边距重叠等问题，或者需要利用 BFC 不与浮动重叠的特性来处理一些局部图文混排的场景。

# IFC

> ## 🎯 一、什么是 IFC（Inline Formatting Context）

**IFC（Inline Formatting Context）中文名：内联格式化上下文。**

当一个块级元素（如 `<div>`）中包含**内联级内容（inline-level boxes）**时，就会生成一个 **IFC 内联格式化上下文**。

这些内联级盒子（如 `span`、`a`、`img`、文字节点）会在一行中**水平排列**，并由**行盒（line box）** 包裹。

---

> ## 🧩 二、IFC 的特点（记口诀）

| 特点                   | 说明                                                        |
| ---------------------- | ----------------------------------------------------------- |
| 📏 1. 行盒（line box） | 内联元素会在行盒中从左到右排列                              |
| 🧱 2. 行盒高度         | 由行内元素的高度和 `line-height` 决定                       |
| ↔️ 3. 水平排列         | 元素之间的间隙由 `letter-spacing`、`word-spacing`、空格决定 |
| ⬆️ 4. 垂直对齐         | 由 `vertical-align` 控制（如 `top`, `middle`, `baseline`）  |
| ⬇️ 5. 换行规则         | 当行宽不够时，会根据单词或空格换行                          |
| 🧍 6. 不会清除浮动     | IFC 内元素不会触发或清除浮动                                |
| 🚫 7. 不可嵌套块级元素 | 行内元素中不能包含块级元素，否则会中断 IFC                  |

---

> ## 🧱 三、触发 IFC 的典型场景

1. **纯文字内容**

   ```html
   <div>这是一段文字</div>
   ```

   👉 div 内部是内联内容 → 形成 IFC。

2. **包含行内元素**

   ```html
   <div><span>文字</span><a href="#">链接</a></div>
   ```

   👉 两个内联盒子在一行 → IFC。

3. **display: inline / inline-block 的容器内部**

   ```css
   .container {
     display: inline-block;
   }
   ```

   👉 inline-block 内部也会建立 IFC。

---

> ## 💡 四、IFC 与 BFC 的区别（经典对比表）

| 对比项         | IFC（内联格式化上下文） | BFC（块级格式化上下文）                                        |
| -------------- | ----------------------- | -------------------------------------------------------------- |
| 触发条件       | 存在内联级内容          | `overflow`, `float`, `display: flow-root`, `display: flex`, 等 |
| 排布方向       | 水平（从左到右）        | 垂直（从上到下）                                               |
| 盒模型类型     | inline-level boxes      | block-level boxes                                              |
| 高度计算       | 由 line-height 决定     | 由子元素总高度决定                                             |
| 可嵌套块级元素 | ❌ 否                   | ✅ 可以                                                        |
| 清除浮动       | ❌ 不可                 | ✅ 可清除                                                      |
| 应用场景       | 文本布局                | 容器布局                                                       |

---

> ## 🧮 五、IFC 高度计算规则（面试经典）

1. 每行生成一个 **line box**；
2. 每个 line box 的高度 = 最高的内联元素高度 + line-height；
3. 容器的总高度 = 所有 line box 的高度总和。

### 🔹 示例

```html
<div class="box">Hello <span style="font-size:30px;">IFC</span> world!</div>
```

- “Hello”和“world”字体 16px；
- “IFC” 字体 30px；
- 这行的行盒高度将取 30px 那个 span 的高度；
- 所以整个 `.box` 高度受最大内联元素影响。

---

> ## 🧠 六、IFC 典型行为与陷阱题

### ✅ 案例 1：垂直对齐

```html
<div style="border:1px solid red;">Text <img src="..." height="20" /> Text</div>
```

默认 `img` 是内联元素，会以 **基线对齐（baseline）**。
如果想图片与文字垂直居中：

```css
img {
  vertical-align: middle;
}
```

---

### ✅ 案例 2：line-height 的影响

```css
span {
  line-height: 2;
}
```

- 影响行盒高度；
- 行内元素并不会直接改变自身高度，而是影响周围的“行盒”高度。

---

### ✅ 案例 3：块级元素打破 IFC

```html
<div>
  hello
  <div>world</div>
  test
</div>
```

⚠️ 块级元素 `<div>` 会**打断 IFC**，
“hello” 在一个 IFC 中，“world test” 会重新生成一个 IFC。

---

### ✅ 案例 4：图片底部出现空隙问题（高频面试题！）

```html
<div><img src="..." alt="" /></div>
```

默认会出现底部空隙，因为：

> 图片是 inline 元素，默认与 **文字基线（baseline）** 对齐，
> 基线下有一部分“留白”空间。

✅ 解决方法：

```css
img {
  vertical-align: bottom;
}
/* 或 */
img {
  display: block;
}
```

---

> ## 🧩 七、面试题大全（含答案）

---

> ### 🧠 题 1

**问：** 什么是 IFC？

**答：**
IFC 是内联格式化上下文（Inline Formatting Context），
当块级盒子中仅包含内联级元素时，内部会形成 IFC，
元素在其中从左到右排列并形成行盒（line box）。

---

> ### 🧠 题 2

**问：** IFC 的高度是如何计算的？

**答：**
每一行生成一个 line box，line box 的高度取决于该行中最高的内联元素，容器的高度为所有行盒高度之和。

---

> ### 🧠 题 3

**问：** 如何让图片与文字垂直居中？

**答：**
设置：

```css
img {
  vertical-align: middle;
}
```

`vertical-align` 只在 IFC 中生效。

---

> ### 🧠 题 4

**问：** 为什么 `<img>` 底部有空隙？如何解决？

**答：**

- 因为图片是 inline 元素，与文字 baseline 对齐；
- baseline 下有空白区域；
- 解决：`vertical-align: bottom` 或 `display: block`。

---

> ### 🧠 题 5

**问：** IFC 会清除浮动（float）吗？

**答：**
不会。IFC 内元素不参与浮动清除，需要通过 BFC 实现。

---

> ### 🧠 题 6

**问：** 哪些属性只在 IFC 中生效？

**答：**
`vertical-align`、`text-decoration`、`line-height`、`letter-spacing` 等。

---

> ### 🧠 题 7

**问：** IFC 中可以嵌套块级元素吗？

**答：**
不可以。块级元素会打断 IFC，重新创建 BFC 或新的 IFC。

---

> ### 🧠 题 8

**问：** IFC 的行盒高度不一致时，会发生什么？

**答：**
line box 的高度以行内最高元素为准；
超出行高的部分可能会溢出行盒，造成上下不齐。

---

> ### 🧠 题 9

**问：** IFC 是如何确定换行的？

**答：**

- 根据空格、word-wrap、white-space 规则；
- 当行宽不够时自动换行；
- 可通过 `white-space: nowrap;` 禁止换行。

---

> ### 🧠 题 10

**问：** inline-block 元素内部是 IFC 还是 BFC？

**答：**
内部建立 IFC（可以排布内联内容），
外部表现为块级盒子（可以与 inline 同行）。

---

## 🧱 八、IFC 在项目中的实际应用

| 场景             | 用法                                         |
| ---------------- | -------------------------------------------- |
| 文字与图标对齐   | `vertical-align: middle`                     |
| 文本标签标记     | `<span>` 控制行内布局                        |
| 消除图片空隙     | `display: block` 或 `vertical-align: bottom` |
| 多行文字垂直对齐 | `line-height` 调整                           |

---

## 🧭 九、总结口诀

> **块排纵向，内联横向；** > **BFC 清浮动，IFC 控对齐；** > **图片底隙基线藏，line-height 定高度。**

# 以下是常见的隐藏元素的方法

---

### 总结

| 方法                                   | 代码示例                                 | 是否占用空间 | 可访问性/渲染                                        | 适用场景                       |
| -------------------------------------- | ---------------------------------------- | ------------ | ---------------------------------------------------- | ------------------------------ |
| **display: none**                      | `display: none;`                         | ❌ 不占用    | 不渲染，屏幕阅读器无法访问                           | 完全隐藏元素，适合动态切换内容 |
| **visibility: hidden**                 | `visibility: hidden;`                    | ✅ 占位      | 渲染但不可见，屏幕阅读器一般仍能访问                 | 隐藏但保持布局，适合动画过渡   |
| **opacity: 0**                         | `opacity: 0;`                            | ✅ 占位      | 渲染，但不可见，仍可交互（可用 pointer-events 控制） | 渐变动画、透明度切换           |
| **position + off-screen**              | `position: absolute; left: -9999px;`     | ❌ 不占位    | 渲染在页面外，可访问                                 | 屏幕阅读器可用隐藏内容         |
| **clip-path / clip / mask**            | `clip: rect(0,0,0,0); overflow: hidden;` | ❌ 不占位    | 可用于无障碍隐藏                                     | 常用于无障碍隐藏文字或图标     |
| **height/width: 0 / overflow: hidden** | `height: 0; width: 0; overflow: hidden;` | ❌ 不占位    | 渲染但不可见                                         | 可用于动画收缩或隐藏容器       |
| **transform: scale(0)**                | `transform: scale(0);`                   | ✅ 占位      | 渲染但不可见                                         | 动画缩放隐藏，保留布局         |
| **clip + absolute + visually-hidden**  | 综合无障碍隐藏技巧                       | ❌ 不占位    | 屏幕阅读器可访问，视觉上隐藏                         | 无障碍隐藏文本、图标或内容     |

> ### **display: none**

1. 优点：

- 完全从文档流中移除： 元素不占用任何空间，也不会触发任何布局或渲染。它就像完全不存在一样。
- 不影响其他元素布局： 由于元素被移除，周围的元素会像它不存在一样重新排列。
- 无法交互： 元素及其所有子元素都不会接收点击、触摸等事件。

2. 缺点：

- 无法进行过渡动画： display 属性的变化是即时的，无法通过 CSS transition 或 animation 实现平滑的显示/隐藏动画效果。
- DOM 重排（Reflow/Layout）： 隐藏和显示都会导致文档重排，因为它会改变页面布局

> ### **visibility: hidden**

1. 优点：

- 保留文档流空间： 元素依然占据它应有的布局空间，不会影响周围元素的排列。
- 可以进行过渡动画： visibility 属性的变化可以配合 transition 实现淡入淡出等动画（虽然 hidden 到 - - visible 之间可能需要一些技巧，但通常与 opacity 结合使用）。
- DOM 重绘（Repaint） ：隐藏和显示通常只触发重绘，因为它不改变元素的几何属性（除非与布局相关的属性同时改变）。

2. 缺点：

- 仍占用空间： 即使元素不可见，但它在页面上依然占据一块空白区域。
- 无法交互： 元素及其所有子元素不会接收点击、触摸等事件。

> ### **opacity: 0**

1. 优点：

- 保留文档流空间： 元素依然占据它应有的布局空间。
- 最适合动画： opacity 属性的变化可以完美地与 transition 或 animation 结合，实现平滑的淡入淡出效果。
- 性能较好： 通常只触发合成 (Compositing) ，因为透明度变化可以直接由 GPU 处理，不会引起重排或重绘，性能开销最小。

2. 缺点：

- 仍占用空间： 即使元素不可见，但它在页面上依然占据一块空白区域。
- 默认可交互： 默认情况下，即使 opacity 为 0，元素仍然可以接收点击、触摸等事件。如果你不希望它被点击，需要额外添加 pointer-events: none;。

> ### height: 0; 或 width: 0; （配合 overflow: hidden;）

1. 优点：

- 完全不占用空间： 元素折叠起来，不占用任何布局空间。
- 适合折叠动画： 可以对 height 或 width 进行 transition 动画，实现平滑的展开/折叠效果，例如手风琴菜单。

2. 缺点：

- 可能触发重排： 改变 height 或 width 会导致重排。
- 需要注意子元素： 如果子元素有固定大小或边距，可能需要额外的处理来确保完全隐藏。
- 内容可能被裁剪： overflow: hidden 会裁剪掉超出部分，如果动画效果不是折叠，可能不适用。

# 关于文本

> ## div 的文本溢出如何解决

这是前端面试中很常见的 **CSS 问题** ✅，解决文本溢出的方式主要有几种，面试可以简单列出：

---

### 1️⃣ 单行文本溢出显示省略号

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

### 2️⃣ 多行文本溢出显示省略号

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

### 3️⃣ 超出滚动显示

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

### 4️⃣ 面试简答模板

- 1️⃣ 解决 div 文本溢出主要有三种方式：
- 2️⃣ 单行文本：`white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`
- 3️⃣ 多行文本：使用 `-webkit-line-clamp` 限制行数 + 隐藏溢出
- 4️⃣ 超出滚动：`overflow: auto` 或 `scroll` 显示滚动条

> ## line-height: 120% 和 line-height: 1.2 有什么区别?

- 当你使用百分比值时，子元素会继承计算后的行高值；
- 而当你使用数值时，子元素会继承这个数值，并根据 自己的字体大小重新计算行高。

> ## css 文本水平居中（块级元素和行内块级元素）

`text-align: center`

> ## css 文本垂直居中（块级元素和行内块级元素）

- line-height （单行文本） 将行高 (line-height) 设置为与父容器高度相同。

> ## 如何实现字体小于 12px?

1. 然后过 CSS 的 transform 属性对其进行视觉上的缩小，因此不会有字体渲染模糊的问题

**优点：**

- ✅ 所有浏览器都支持；
- ✅ 兼容性好；
- ✅ 不影响字体渲染质量。

**缺点：**

- ❌ 占位仍按原始尺寸计算；
- ❌ 可能影响行高、排版；
- ❌ 如果嵌入行内文字可能不齐。

```html
<style>
  span {
    font-size: 12px;
    border: 1px solid red;
  }

  .one {
    display: inline-block;
    transform: scale(0.5);
    transform-origin: 100% 100%;
  }
</style>
<body>
  <span class="one">小于12px的字体</span>
  <span class="two">12px的字体</span>
</body>
```

2. 使用 SVG

```html
<style>
  svg text {
    font-size: 6px;
  }
</style>
<body>
  <svg width="100" height="20">
    <text>
      <tspan x="0" dy="6">我是6号文字</tspan>
      <tspan x="0" dy="6">我是6号文字</tspan>
    </text>
  </svg>
  <div style="font-size：12px">我是12号文字</div>
</body>
```

3. 使用图片代替 (针对少量固定文本)

**优点：**(使用 SVG 一样)

- ✅ 视觉可完全控制；
- ✅ 不受字体渲染限制。

**缺点：**(使用 SVG 一样)

- ❌ 不可选中；
- ❌ 无法被搜索引擎识别；
- ❌ 不利于无障碍阅读；
- ❌ 改动不灵活。

> ## 为什么浏览器默认最小字体是 12px？

- 可读性： 12px 通常被认为是 PC 端屏幕上文字可读性的一个经验下限。小于 12px 的字体在大多数显示器上会变得难以辨认，影响用户体验。

- 兼容性： 早期浏览器在处理小于 12px 的字体时，可能会出现渲染问题或显示效果不佳。为了统一和保证基本的可读性，大多数浏览器设定了最小字体大小。

- 防止滥用： 限制最小字体大小可以防止开发者过度使用极小的字体，从而损害用户体验。

> ## ❓：移动端为什么可以用 10px、8px？

**答：**
移动端**字体渲染机制**不同（DPR 高、抗锯齿好），且 WebKit 内核放宽了最小字体限制。

---

> ## ❓：`transform: scale()` 和直接减小 `font-size` 的区别？

| 项目     | font-size      | transform: scale   |
| -------- | -------------- | ------------------ |
| 字体渲染 | 按真实大小绘制 | 缩放渲染结果       |
| 占位宽高 | 会变小         | 不变（仍是原字号） |
| 兼容性   | 所有浏览器     | 所有浏览器         |
| 适用场景 | 通用文字       | 特殊视觉缩放       |

---

> ## ❓：如何让小字体在高分屏中更清晰？

**答：**

- 使用高分辨率字体；
- 开启 `-webkit-font-smoothing: antialiased;`
- 或使用 SVG 字体（矢量）；
- 避免过小字号（建议 ≥ 12px）。

# 关于 position

> ### 面试官开场：我们来聊聊 CSS 的 `position` 属性吧。你了解哪几种？

#### 1. `position: static`

- **一句话定义**：这是 `position` 属性的默认值，元素遵循正常的文档流（Normal Flow）。
- **核心特点**：
  - **在文档流中**：元素占据它应有的空间，就像普通的段落、图片一样，从上到下，从左到右排列。
  - **定位属性无效**：设置 `top`, `right`, `bottom`, `left` 和 `z-index` 属性是**无效**的。
- **面试要点**：
  - `static` 是最基础的状态，它本身没什么特别的，但它是理解其他定位方式的基准。
  - 一个元素的 `position` 默认就是 `static`。

#### 2. `position: relative`

- **一句话定义**：相对定位。元素相对于其**自身在文档流中的原始位置**进行定位。
- **核心特点**：
  - **仍在文档流中**：元素**原始所占的空间会被保留**，不会被其他元素占据。这一点非常非常重要！
  - **定位属性生效**：`top`, `right`, `bottom`, `left` 会使其在视觉上发生偏移。
  - **作为参照物**：它最重要的用途之一是作为 `position: absolute` 元素的定位参照物（即“定位上下文”或“包含块”）。
- **面试要点**：
  - **问**：“`relative` 定位后，原来的位置还占着吗？”
  - **答**：“占着。它只是视觉上发生了偏移，但在文档流中的布局位置没有改变，所以不会影响其他元素的布局。”
  - **场景**：当你想对一个元素进行微调，但又不希望影响到周围元素的布局时，`relative` 是个好选择。更常见的用法是“子绝父相”（子元素 `absolute`，父元素 `relative`）。

#### 3. `position: absolute`

- **一句话定义**：绝对定位。元素相对于其**最近的非 `static` 定位的祖先元素**进行定位。
- **核心特点**：
  - **脱离文档流**：元素会完全从文档流中移除，**不再占据任何空间**。后面的元素会当它不存在一样，占据它的位置。
  - **定位参照物**：
    1.  如果所有祖先元素都是 `static`（默认值），那么它会相对于**初始包含块**（initial containing block）进行定位，通常就是浏览器视口（viewport）。
    2.  如果存在一个或多个非 `static`（即 `relative`, `absolute`, `fixed`, `sticky`）的祖先元素，它会相对于**离它最近的那个祖先元素**的内边距（padding edge）进行定位。
  - **定位属性生效**：通过 `top`, `right`, `bottom`, `left` 来确定最终位置。
- **面试要点**：
  - **问**：“`absolute` 是相对于谁定位的？”
  - **答**：（标准答案如上）“相对于最近的、`position` 值不为 `static` 的祖先元素。如果找不到，就相对于视口。”
  - **问**：“`absolute` 和 `relative` 有什么区别？”
  - **答**：“最核心的区别有两点：1. **是否脱离文档流**：`absolute` 脱离，不占空间；`relative` 不脱离，保留原始空间。2. **定位参照物**：`absolute` 参照非 `static` 祖先；`relative` 参照自身原始位置。”
  - **场景**：模态框（Modal）、下拉菜单、元素的右上角角标等。

#### 4. `position: fixed`

- **一句话定义**：固定定位。元素相对于**浏览器视口**（viewport）进行定位。
- **核心特点**：
  - **脱离文档流**：和 `absolute` 一样，元素会从文档流中移除，不占据空间。
  - **视口参照**：它的定位参照物**永远是浏览器视口**。这意味着即使页面滚动，它也会固定在屏幕的同一个位置。
  - **`transform` 的影响**：有一个特殊情况，如果父元素设置了 `transform` (非 `none`)、`filter`(非 `none`) 或 `perspective` 属性，`fixed` 元素的包含块会变成那个父元素，而不是视口。这是个重要的“坑点”。
- **面试要点**：
  - **问**：“`fixed` 和 `absolute` 有什么区别？”
  - **答**：”它们都脱离文档流。最大的区别在于**定位参照物**不同。`fixed` 始终参照浏览器视口（除非受 `transform` 等属性影响），而 `absolute` 参照非 `static` 的祖先元素。”
  - **场景**：网站顶部的导航栏、回到顶部按钮、侧边栏广告等。

#### 5. `position: sticky`

- **一句话定义**：粘性定位。它是 `relative` 和 `fixed` 的混合体。
- **核心特点**：
  - **阈值（Threshold）**：通过 `top`, `right`, `bottom`, `left` 设置一个阈值。
  - **动态表现**：
    1.  在元素到达视口阈值之前，它的行为和 `position: relative` 一样，遵循文档流。
    2.  当页面滚动，元素的视口位置达到设定的阈值时，它会“粘住”，行为变为 `position: fixed`，固定在那个位置。
  - **受限于父容器**：它的固定效果不会超出其**最近的滚动父容器**（scrolling ancestor）的范围。例如，如果一个 `sticky` 元素在一个设置了 `overflow: scroll` 的 `div` 内部，那么它最多只能在该 `div` 内部“粘性”滚动。
- **面试要点**：
  - **问**：“讲讲你对 `sticky` 定位的理解。”
  - **答**：“`sticky` 可以看作是 `relative` 和 `fixed` 的结合。它在滚动到特定位置前表现为 `relative`，滚动到特定位置后表现为 `fixed`。它必须指定 `top`, `right`, `bottom`, `left` 中的至少一个才会生效。另外，它的固定效果受限于其父容器的滚动范围。”
  - **场景**：表格的表头（滚动时表头固定）、网站的侧边栏索引（滚动时索引固定）。

---

> ### 高频面试对比题

| 特性/属性            | `static` (默认) | `relative`      | `absolute`           | `fixed`    | `sticky`            |
| :------------------- | :-------------- | :-------------- | :------------------- | :--------- | :------------------ |
| **是否脱离文档流**   | 否              | 否              | **是**               | **是**     | 否                  |
| **原始空间是否保留** | 是              | **是**          | 否                   | 否         | 是                  |
| **定位参照物**       | 无              | 自身原始位置    | 最近的非`static`祖先 | 浏览器视口 | 自身原始位置 / 视口 |
| **`top/left`等属性** | 无效            | 生效            | 生效                 | 生效       | 生效                |
| **`z-index`**        | 无效            | 生效            | 生效                 | 生效       | 生效                |
| **常见用途**         | 默认值          | 子绝父相 / 微调 | 弹窗、角标           | 固定导航栏 | 粘性表头/侧边栏     |

---

> ### 总结与拔高

当面试官让你做个总结时，你可以这样说：

“总的来说，这五个 `position` 属性提供了从完全静态到完全动态的布局控制能力。

- `static` 是文档流的基础。
- `relative` 是在文档流基础上进行微调，并且是构建`absolute` 定位上下文的关键。
- `absolute` 和 `fixed` 提供了脱离文档流的强大布局能力，区别在于它们的定位参照物不同，一个是动态的父级，一个是固定的视口。
- `sticky` 则是 `relative` 和 `fixed` 的一个非常实用的结合体，为我们实现滚动粘附效果提供了原生、高效的解决方案。”

# 响应式与兼容性

> ## 响应式设计是什么？原理？

- 是什么 是一个网站能够兼容多个终端，而不是为每一个终端做一个特定的版本

- 为什么 通过媒体查询检测不同设备屏幕尺寸做处理。

- 怎么触发 页面头部必须有 meta 声明 viewport

> ## 兼容性

# scss tailwind

# other

## 分析 css 代码阻塞怎么办

> ### 🧩 一、为什么 CSS 会阻塞？

浏览器渲染流程（关键点）：

1. 解析 HTML → 构建 DOM；
2. 解析 CSS → 构建 CSSOM；
3. DOM + CSSOM → Render Tree；
4. 再执行 JS、布局和绘制。

⚠️ 所以：

- **外部 CSS** 会阻塞页面的渲染（Render Tree 依赖 CSSOM）；
- **JS 执行** 也会被 CSS 阻塞（浏览器要等 CSSOM 构建完再执行 JS，避免修改样式导致回流）。

---

> ### ⚙️ 二、如何分析是否阻塞？

1. 打开 **Chrome DevTools → Performance 或 Network 面板**；
2. 查看 CSS 文件加载顺序与阻塞时间；
3. 检查：

   - 是否放在 `<head>`；
   - 是否存在 render-blocking（渲染阻塞）标签；
   - 是否可延迟加载的 CSS。

---

> ### ✅ 1. **关键 CSS 内联**

> 把首屏关键样式直接写在 `<style>` 标签中，减少首屏等待。

```html
<head>
  <style>
    /* 关键部分样式 */
    body {
      font-family: sans-serif;
    }
  </style>
</head>
```

- 只加载必要的样式；
- 非关键部分延迟加载。

---

> ### ✅ 2. **异步加载非关键 CSS**

```html
<link
  rel="preload"
  href="style.css"
  as="style"
  onload="this.rel='stylesheet'"
/>
<noscript><link rel="stylesheet" href="style.css" /></noscript>
```

> `preload` 先加载但不阻塞，`onload` 后再应用。

---

> ### ✅ 3. **分离首屏与非首屏样式**

- 用构建工具（Webpack、Vite）提取关键 CSS；
- 首屏内联，剩余样式延迟加载：

  ```js
  import(/* webpackPrefetch: true */ "./lazy.css");
  ```

---

> ### ✅ 4. **使用媒体查询延迟加载**

```html
<link rel="stylesheet" href="print.css" media="print" />
<link rel="stylesheet" href="mobile.css" media="(max-width: 600px)" />
```

- 只有匹配时才加载，其他情况不会阻塞。

---

> ### ✅ 5. **减少 CSS 文件体积**

- 合并文件、压缩（minify）、去除未使用样式（Tree Shaking）。

---

## 🧠 四、面试简答模板

> CSS 文件是渲染阻塞资源，浏览器需要先加载并解析 CSS 才能构建渲染树。
> 优化方式包括：
>
> 1. 将关键 CSS 内联到 HTML；
> 2. 使用 `preload` 或 `media` 异步加载非关键样式；
> 3. 减少和压缩 CSS 文件体积；
> 4. 利用构建工具提取首屏关键 CSS。

> ### link 和 @import 的区别

- link 是 xhtml 标签，除了引入 css 外，还可以加载库，框架，工具等；@import 属于 css 范畴，只能加载 css
- link 引用 css 的时候，在页面载入时同时加载。 @import 需要页面完全加载完成后加载
- link 是 xhtml 标签，无兼容问题，@import 是 css2 提出来的，低版本的浏览器不支持
