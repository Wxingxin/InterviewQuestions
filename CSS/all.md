# 大全

**CSS (层叠样式表) 知识图谱**

3. **引入方式 (Linking Methods)**

- 外部样式表 (External Stylesheet): `<link rel="stylesheet" href="style.css">  `
- 内部样式表 (Internal Stylesheet): `<style>` 标签
- 内联样式 (Inline Styles): style 属性

4. **基本选择器 (Basic Selectors)**

- 元素选择器 (Element Selector): p, div, h1
- 类选择器 (Class Selector): .classname
- ID 选择器 (ID Selector): #idname
- 通用选择器 (Universal Selector):
- 属性选择器 (Attribute Selectors):
- `[attr]  `
- `[attr=value]  `
- `[attr~=value]  `
- `[attr|=value]  `
- `[attr^=value]  `
- `[attr$=value]  `
- `[attr*=value]  `

5. **组合选择器 (Combinators)**

- 后代选择器 (Descendant Combinator): A B
- 子代选择器 (Child Combinator): A > B
- 相邻兄弟选择器 (Adjacent Sibling Combinator): A + B
- 通用兄弟选择器 (General Sibling Combinator): A ~ B

6. **伪类选择器 (Pseudo-classes)**

- 链接伪类: :link, :visited
- 用户行为伪类: :hover, :active, :focus
- UI 元素状态伪类: :enabled, :disabled, :checked, :indeterminate
- 结构性伪类:
- :root
- :empty
- :first-child, :last-child
- :nth-child(n), :nth-last-child(n)
- :nth-of-type(n), :nth-last-of-type(n)
- :first-of-type, :last-of-type
- :only-child, :only-of-type
- 目标伪类: :target
- 否定伪类: :not(selector)
- 语言伪类: :lang(language)

7. **伪元素选择器 (Pseudo-elements)**

- ::before 在元素内容前插入内容
- ::after 在元素内容后面插入内容
- ::first-letter 选择文本的首字母
- ::first-line 选择文本的首行
- ::selection 选择用户选中的的文本
- ::placeholder (用于表单输入)

8. **颜色与单位 (Colors & Units)**

- 颜色值 (Color Values): 命名颜色, HEX, RGB, RGBA, HSL, HSLA
- 长度单位 (Length Units):
- 绝对单位: px, pt, cm, mm, in
- 相对单位: em, rem, %, vw, vh, vmin, vmax
- 其他单位: 角度 (deg, rad), 时间 (s, ms)

# **二、核心概念 (Core Concepts)**

1. **层叠 (Cascade)**

- 来源 (Origin): 作者样式表, 用户样式表, 浏览器默认样式表
- 重要性 (Importance): !important
- 特异性/优先级 (Specificity): ID > 类/属性/伪类 > 元素/伪元素 > 通用
- 顺序 (Order): 后声明的覆盖先声明的

2. **继承 (Inheritance)**

- 哪些属性可继承 (e.g., color, font-family)
- 强制继承: inherit
- 重置继承: initial, unset

3. **盒模型 (Box Model)**

- content (内容)
- padding (内边距)
- border (边框)
- margin (外边距)
- box-sizing: content-box (默认), border-box

4. **display 属性 (Display Property)**

- block (块级)
- inline (行内)
- inline-block (行内块)
- none (隐藏)
- flex (弹性布局)
- grid (网格布局)
- table, table-row, table-cell (表格布局)
- list-item (列表项)

5. **position 属性 (Position Property)**

- static (默认)
- relative (相对定位)
- absolute (绝对定位)
- fixed (固定定位)
- sticky (粘性定位)
- top, right, bottom, left
- z-index (层叠顺序)

6. **浮动与清除 (Floats & Clearing)**

- float: left, right, none
- clear: left, right, both, none
- 清除浮动的方法 (Clearing Floats): 空 div, overflow: hidden/auto, 伪元素方法

7. **CSS 值与函数 (CSS Values & Functions)**

- calc() (计算)
- var() (自定义属性/变量)
- attr() (获取属性值)
- url() (引用资源)
- 颜色函数: rgb(), rgba(), hsl(), hsla()
- 数学函数: min(), max(), clamp()

# **三、布局 (Layout)**

1. **传统布局 (Traditional Layout)**

- 基于 display, position, float

2. **Flexbox 弹性布局 (Flexible Box Layout)**

- 容器属性 (Container Properties):
- display: flex | inline-flex
- flex-direction: row, row-reverse, column, column-reverse
- flex-wrap: nowrap, wrap, wrap-reverse
- flex-flow: (flex-direction 和 flex-wrap 的简写)
- justify-content: flex-start, flex-end, center, space-between, space-around, space-evenly
- align-items: stretch, flex-start, flex-end, center, baseline
- align-content: (多行/列内容对齐) flex-start, flex-end, center, space-between, space-around, stretch
- 项目属性 (Item Properties):
- order
- flex-grow
- flex-shrink
- flex-basis
- flex: (flex-grow, flex-shrink, flex-basis 的简写)
- align-self

3. **Grid 网格布局 (Grid Layout)**

- 容器属性 (Container Properties):
- display: grid | inline-grid
- grid-template-columns, grid-template-rows
- grid-template-areas
- grid-template: (简写)
- column-gap (或 grid-column-gap), row-gap (或 grid-row-gap), gap (或 grid-gap)
- justify-items, align-items
- justify-content, align-content (当网格总大小小于其网格容器时)
- grid-auto-columns, grid-auto-rows
- grid-auto-flow
- 项目属性 (Item Properties):
- grid-column-start, grid-column-end, grid-column
- grid-row-start, grid-row-end, grid-row
- grid-area
- justify-self, align-self

4. **多列布局 (Multi-column Layout)**

- column-count
- column-width
- columns (简写)
- column-gap
- column-rule
- column-span
- break-before, break-after, break-inside

# **四、响应式设计 (Responsive Web Design - RWD)**

1. **视口 (Viewport)**

- `<meta name="viewport" content="width=device-width, initial-scale=1.0">`

2. **媒体查询 (Media Queries)**

- @media 规则
- 媒体类型 (Media Types): all, print, screen, speech
- 媒体特性 (Media Features): width, height, aspect-ratio, orientation, resolution, hover, pointer

3. **流式布局 (Fluid Layouts)**

- 使用百分比和相对单位

4. **弹性图片/媒体 (Flexible Images/Media)**

- max-width: 100%, height: auto
- `<picture>` 元素, srcset 属性

# 💯💯💯 **常用属性分类 字体-文本-背景-视觉效果**

> ## **文本样式 (Text Styling)**

> ### font

#### font-family-字体族

- 语法：font-family: 字体 1, 字体 2, serif/sans-serif;
- 例：`font-family: "Roboto", "PingFang SC", sans-serif;`
- 说明：按顺序查找字体，建议最后跟泛型字体。

#### font-size-字号

- 语法：font-size: `<length> | <percentage>`;
- 例：`font-size: 16px; / 1.5rem; / 120%;`
- 说明：可使用 px、em、rem、% 等单位。

#### font-weight-字重

- 语法：font-weight: normal | bold | 100–900;
- 例：`font-weight: 600;`
- 说明：数值越大越粗（取决于字体是否支持）。

#### font-style- 字体样式

- 语法：font-style: normal | italic | oblique;
- 例：`font-style: italic;`
- 说明：italic 通常是字体自带斜体，oblique 是倾斜效果。

#### font-variant-小型大写

语法：font-variant: normal | small-caps;
例：`font-variant: small-caps;`
说明：小写字母以大写形式展示，**但比例较小**。

> ### text

#### text-align,文本对齐

语法：left | right | center | justify;
例：text-align: justify;

#### text-decoration,文本装饰

语法：underline | overline | line-through | none;
例：text-decoration: underline;
说明：也可写颜色与样式：text-decoration: underline wavy red;

#### text-transform,文本大小写转换

语法：uppercase | lowercase | capitalize | none;
例：text-transform: uppercase;

#### text-indent,首行缩进

语法：text-indent: <length> | <percentage>;
例：text-indent: 2em;

#### text-overflow 文本溢出显示方式

语法：clip | ellipsis;
例：text-overflow: ellipsis;
说明：需与 overflow:hidden + white-space:nowrap 配合使用。

> ### other

#### white-space,空白处理规则

值说明：

- normal（默认，合并空白，可换行）
- nowrap（不换行）
- pre（保留空白，不自动换行）
- pre-line（合并空白，但保留换行）
- pre-wrap（保留空白，自动换行）

#### word-spacing，单词间距

例：word-spacing: 10px;

#### letter-spacing,字母间距（字距）

例：letter-spacing: 1px;

#### word-break,单词断行规则

值说明：

- normal（默认）
- break-all（必要时任何字符都能断开）
- keep-all（中文不断词，英文不拆单词）
  例：word-break: break-all;

#### overflow-wrap（旧名 word-wrap）

语法：normal | break-word;
例：overflow-wrap: break-word;
说明：长单词或 URL 溢出时允许换行。

#### line-height 行高

语法：<number> | <length>;
例：line-height: 1.6; （推荐用无单位）
说明：无单位是相对字体大小的倍数。

#### color 文本颜色

语法：

- 关键字：red、blue
- HEX：#fff、#1a1a1a
- RGB：rgb(255,0,0)
- RGBA：rgba(0,0,0,0.5)
- HSL：hsl(200, 50%, 60%)

> ## **背景样式 (Background Styling)**

> #### background-color

- 设置元素的背景颜色。

**语法：**

```css
background-color: color;
```

**示例：**

```css
background-color: #f0f0f0;
background-color: rgba(0, 0, 0, 0.5);
```

> #### background-image

- 设置背景图片。

**语法：**

```css
background-image: url("image.jpg");
```

也可以设置多个背景：

```css
background-image: url(a.png), url(b.png);
```

> #### background-repeat

- 决定背景图片是否重复及重复方向。

**可选值：**

| 值          | 效果                  |
| ----------- | --------------------- |
| `repeat`    | 水平+垂直重复（默认） |
| `repeat-x`  | 水平重复              |
| `repeat-y`  | 垂直重复              |
| `no-repeat` | 不重复                |
| `space`     | 均匀分布（不裁剪）    |
| `round`     | 自动缩放以整除空间    |

**示例：**

```css
background-repeat: no-repeat;
```

> #### background-position

- 设置背景图片的初始位置。

**语法：**

```css
background-position: x y;
```

**常用取值：**

- 关键词：`left`, `center`, `right`, `top`, `bottom`
- 数值/百分比：`20px 50%`

**示例：**

```css
background-position: center top;
```

> #### background-attachment

- 控制背景图滚动方式。

**可选值：**

| 值       | 描述                     |
| -------- | ------------------------ |
| `scroll` | 跟随页面滚动（默认）     |
| `fixed`  | 固定在视口，不随滚动移动 |
| `local`  | 随元素内容滚动           |

**示例：**

```css
background-attachment: fixed;
```

> #### background-size

- 设置背景图片尺寸。

**可选值：**

| 值             | 描述                     |
| -------------- | ------------------------ |
| `auto`         | 使用图片原尺寸（默认）   |
| `cover`        | 按比例填满容器，可能裁剪 |
| `contain`      | 包含在容器内，不裁剪     |
| `width height` | 自定义尺寸               |

**示例：**

```css
background-size: cover;
background-size: 100px 200px;
```

> #### background-clip,

- 决定背景绘制到哪个区域。

**可选值：**

| 值            | 描述               |
| ------------- | ------------------ |
| `border-box`  | 绘制到边框（默认） |
| `padding-box` | 只绘制到内边距区域 |
| `content-box` | 只绘制到内容区域   |

**示例：**

```css
background-clip: padding-box;
```

> #### background-origin

- 决定背景图片的定位参考点。

**可选值：**

| 值            | 描述                          |
| ------------- | ----------------------------- |
| `padding-box` | 相对 padding-box 定位（默认） |
| `border-box`  | 相对 border-box 定位          |
| `content-box` | 相对 content-box 定位         |

**示例：**

```css
background-origin: content-box;
```

> #### background (简写)

- 一个属性写完所有背景设置。

**完整语法顺序（不必全部写，也不必须按顺序）**：

```
background:
  background-color
  background-image
  background-repeat
  background-attachment
  background-position / background-size
  background-origin
  background-clip;
```

**示例：**

```css
background: #eee url(bg.jpg) no-repeat center/cover fixed content-box;
```

等价于：

```css
background-color: #eee;
background-image: url(bg.jpg);
background-repeat: no-repeat;
background-position: center;
background-size: cover;
background-attachment: fixed;
background-origin: content-box;
```

> ## **其他视觉效果 (Other Visual Effects)**

> #### opacity (透明度)

- 控制元素整体的不透明度（包含内容、背景、边框）。

**取值范围：**

```
0 ~ 1
```

- `0` = 完全透明
- `1` = 完全不透明

**示例：**

```css
opacity: 0.5;
```

> #### visibility (可见性)

- 控制元素是否可见，但不同于 `display`。

**取值：**

| 值         | 描述                  |
| ---------- | --------------------- |
| `visible`  | 可见（默认）          |
| `hidden`   | 隐藏，但仍占布局空间  |
| `collapse` | 表格专用，类似 hidden |

**示例：**

```css
visibility: hidden;
```

> #### cursor (鼠标指针)

- 设置鼠标悬停在元素上的光标形状。

**常用值：**

| 值                  | 效果                    |
| ------------------- | ----------------------- |
| `pointer`           | 手指（常用于按钮/链接） |
| `default`           | 默认箭头                |
| `text`              | 文本输入光标            |
| `move`              | 移动十字箭头            |
| `not-allowed`       | 禁止符号                |
| `wait`              | 加载中                  |
| `crosshair`         | 十字准星                |
| `grab` / `grabbing` | 抓取手势                |

也支持自定义图片：

```css
cursor: url(icon.png), pointer;
```

> #### box-shadow (盒子阴影)

- 给元素的盒子添加阴影。

**语法：**

```css
box-shadow: offset-x offset-y blur spread color inset;
```

**参数说明：**

- `offset-x`：阴影水平偏移
- `offset-y`：阴影垂直偏移
- `blur`：模糊半径
- `spread`：扩散半径
- `color`：颜色
- `inset`：可选关键字，表示内阴影

**示例：**

```css
/* 外阴影 */
box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);

/* 内阴影 */
box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
```

> #### text-shadow (文本阴影)

- 为文本添加阴影。

**语法：**

```css
text-shadow: offset-x offset-y blur color;
```

**示例：**

```css
text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
```

支持多个阴影：

```css
text-shadow: 0 0 5px red, 0 0 10px blue;
```

> #### border-radius (圆角)

- 设置元素边框圆角。

**常用用法：**

```css
border-radius: 10px; /* 四角统一 */
border-radius: 10px 20px; /* 左上右下 / 右上左下 */
border-radius: 10px 20px 30px 40px; /* 四角分别设置 */
```

**制作圆形或椭圆：**

```css
border-radius: 50%; /* 正方形 → 圆形 */
```

> #### outline (轮廓)

- 绘制在元素边框外的线条，不占空间，与 `border` 不同。

**组成：**

```css
outline: width style color;
```

**示例：**

```css
outline: 2px solid red;
outline-offset: 5px; /* 离元素的距离 */
```

**常用于：**
键盘聚焦、无影响布局的高亮框。

> ## **列表样式 (List Styling)**

- list-style-type
- list-style-image
- list-style-position
- list-style (简写)

> ## **表格样式 (Table Styling)**

- border-collapse, border-spacing
- caption-side, empty-cells
- table-layout

# 💯💯💯 动画

### 1. **CSS 变量 (Custom Properties)**

- 声明: --variable-name: value;
- 使用: var(--variable-name, fallback_value)
- 作用域 (Scoping)

### 2. **变换 (Transforms)**

##### transform: `transform 用于对元素进行几何变换，不会影响文档流。`

- translate():将元素在水平、垂直方向移动。`transform: translate(50px, 20px);`
- rotate():以元素中心为轴心旋转。`transform: rotate(45deg);`
- scale(),:按比例放大或缩小元素。`transform: scale(1.5);`
- skew(), 让元素在 X/Y 方向倾斜。`transform: skew(20deg, 10deg);`
- matrix()将上述所有变换组合进一个 2D 变换矩阵（高级用法）。`transform: matrix(1, 0.2, 0.3, 1, 30, 20);`
- transform-origin:控制变形的参考点（默认是元素中心）。`transform-origin: left top;transform: rotate(45deg);`
- 2D 与 3D 变换
  | 特性 | 2D 变换 | 3D 变换 |
  | ---- | --------------------------------- | ---------------------------------------------- |
  | 维度 | 平面（x,y） | 带 z 轴深度 |
  | 常用函数 | translate / rotate / scale / skew | translate3d / rotate3d / scale3d / perspective |
  | 视觉效果 | 平面的 | 立体、透视、深度感 |

3. **过渡 (Transitions)**

- transition-property 指定哪些属性参与过渡`transition-property: width, transform;`
- transition-duration 过渡持续时间。`transition-duration: 0.5s;`
- transition-timing-function 过渡速率曲线（运动方式）
- - linear 匀速
- - ease（默认）慢 → 快 → 慢
- - ease-in 由慢变快
- - ease-out 由快变慢
- - cubic-bezier() 自定义曲线

- transition-delay 延迟多少秒开始执行`transition-delay: 0.2s;`
- transition (简写) 将以上所有属性合并`transition: transform 0.5s ease-in-out 0s;`

4. **动画 (Animations)**

- @keyframes 规则定义动画的每个阶段状态。
- animation-name 指定要使用的关键帧名称。
- animation-duration 动画持续时间。
- animation-timing-function 与过渡的 timing-function 类似，控制动画速率。
- animation-delay 动画开始前的延迟时间。
- animation-iteration-count 动画播放次数
- animation-direction
  动画方向

normal 正向

reverse 反向

alternate 正 → 反 循环

alternate-reverse 反 → 正 循环

- animation-fill-mode 动画前后保留状态。
- animation-play-state 暂停或运行动画。
- animation (简写)

# 💯💯💯 **六、高级特性 (Advanced Features)**

| 滤镜            | 作用               |
| --------------- | ------------------ |
| `blur()`        | 模糊               |
| `brightness()`  | 亮度               |
| `contrast()`    | 对比度             |
| `grayscale()`   | 灰度黑白           |
| `hue-rotate()`  | 色相旋转           |
| `invert()`      | 颜色反相           |
| `opacity()`     | 不透明度           |
| `saturate()`    | 饱和度增强/降低    |
| `sepia()`       | 复古棕色           |
| `drop-shadow()` | 投影，可适用非矩形 |

### **滤镜 (Filters)**filter:

#### blur(), 让元素变得模糊，类似景深效果。

#### brightness(), 调整元素明暗程度。

#### contrast(), 增强或降低对比度。

#### grayscale(), 转换为黑白照片效果。

#### hue-rotate(), 改变色调，使颜色围绕色轮旋转。

#### invert(),将颜色反转（类似底片效果）。

#### opacity(), （与 opacity 属性效果相同，但可与其他滤镜组合使用。）

#### saturate(),控制颜色浓度。

#### sepia(),类似复古照片的棕褐色。

#### drop-shadow()与 box-shadow 类似，但可应用到透明区域。

6. **混合模式 (Blend Modes)**

- mix-blend-mode (元素间混合)
- background-blend-mode (背景层间混合)

7. **CSS Shapes (形状)**

- shape-outside
- shape-margin
- shape-image-threshold

8. **滚动捕捉 (Scroll Snap)**

- scroll-snap-type
- scroll-snap-align
- scroll-padding, scroll-margin

9. **书写模式 (Writing Modes)**

- writing-mode
- 逻辑属性 (Logical Properties): margin-block-start, padding-inline-end, etc.
