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

# 选择器

---

# BFC

---

# 以下是常见的隐藏元素的方法

---
