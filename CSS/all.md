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

# **五、常用属性分类 (Common Properties by Category)**

1. **文本样式 (Text Styling)**

- font-family, font-size, font-weight, font-style, font-variant
- text-align, text-decoration, text-transform, text-indent, text-overflow
- white-space, word-spacing，letter-spacing, word-break, overflow-wrap
- line-height
- color

2. **背景样式 (Background Styling)**

- background-color
- background-image
- background-repeat
- background-position
- background-attachment
- background-size
- background-clip, background-origin
- background (简写)

3. **列表样式 (List Styling)**

- list-style-type
- list-style-image
- list-style-position
- list-style (简写)

4. **表格样式 (Table Styling)**

- border-collapse, border-spacing
- caption-side, empty-cells
- table-layout

5. **其他视觉效果 (Other Visual Effects)**

- opacity (透明度)
- visibility (可见性)
- cursor (鼠标指针)
- box-shadow (盒子阴影)
- text-shadow (文本阴影)
- border-radius (圆角)
- outline (轮廓)

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
- animation-name指定要使用的关键帧名称。
- animation-duration动画持续时间。
- animation-timing-function与过渡的 timing-function 类似，控制动画速率。
- animation-delay动画开始前的延迟时间。
- animation-iteration-count动画播放次数
- animation-direction
动画方向

normal 正向

reverse 反向

alternate 正 → 反 循环

alternate-reverse 反 → 正 循环
- animation-fill-mode动画前后保留状态。
- animation-play-state暂停或运行动画。
- animation (简写)
# 💯💯💯 **六、高级特性 (Advanced Features)**

| 滤镜              | 作用        |
| --------------- | --------- |
| `blur()`        | 模糊        |
| `brightness()`  | 亮度        |
| `contrast()`    | 对比度       |
| `grayscale()`   | 灰度黑白      |
| `hue-rotate()`  | 色相旋转      |
| `invert()`      | 颜色反相      |
| `opacity()`     | 不透明度      |
| `saturate()`    | 饱和度增强/降低  |
| `sepia()`       | 复古棕色      |
| `drop-shadow()` | 投影，可适用非矩形 |


### **滤镜 (Filters)**filter:
#### blur(), 让元素变得模糊，类似景深效果。
#### brightness(), 调整元素明暗程度。
#### contrast(), 增强或降低对比度。
#### grayscale(), 转换为黑白照片效果。
#### hue-rotate(), 改变色调，使颜色围绕色轮旋转。
#### invert(),将颜色反转（类似底片效果）。
####  opacity(), （与 opacity 属性效果相同，但可与其他滤镜组合使用。）
#### saturate(),控制颜色浓度。
####  sepia(),类似复古照片的棕褐色。
####  drop-shadow()与 box-shadow 类似，但可应用到透明区域。

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

