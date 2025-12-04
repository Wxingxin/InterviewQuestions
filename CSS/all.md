# 大全
**CSS (层叠样式表) 知识图谱**

# **一、基础 (Basics)**
1. **简介 (Introduction)**

- CSS 是什么？(What is CSS?)
- CSS 的作用 (Purpose of CSS: 分离内容与表现)
- CSS 历史与版本 (History and Versions: CSS1, CSS2.1, CSS3+)

2. **语法 (Syntax)**

- 规则集 (Rule Set): 选择器 { 属性: 值; }
- 声明 (Declaration): property: value
- 注释 (Comments): /_ comment _/

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

# **六、高级特性 (Advanced Features)**



1. **CSS 变量 (Custom Properties)**

- 声明: --variable-name: value;
- 使用: var(--variable-name, fallback_value)
- 作用域 (Scoping)

2. **变换 (Transforms)**

- transform: translate(), rotate(), scale(), skew(), matrix()
- transform-origin
- 2D 与 3D 变换

3. **过渡 (Transitions)**

- transition-property
- transition-duration
- transition-timing-function
- transition-delay
- transition (简写)

4. **动画 (Animations)**

- @keyframes 规则
- animation-name
- animation-duration
- animation-timing-function
- animation-delay
- animation-iteration-count
- animation-direction
- animation-fill-mode
- animation-play-state
- animation (简写)

5. **滤镜 (Filters)**

- filter: blur(), brightness(), contrast(), grayscale(), hue-rotate(), invert(), opacity(), saturate(), sepia(), drop-shadow()

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

# **七、CSS 预处理器与后处理器 (Preprocessors & Postprocessors)**

1. **预处理器 (Preprocessors): Sass/SCSS, Less, Stylus**

- 变量 (Variables)
- 嵌套 (Nesting)
- 混合 (Mixins)
- 继承 (@extend)
- 函数 (Functions)
- 模块化 (@import, @use, @forward - Sass)

2. **后处理器 (Postprocessors): PostCSS**

- Autoprefixer (自动添加浏览器前缀)
- CSS Modules
- Linters (Stylelint)
- Minifiers (CSSNano)

# **八、CSS 架构与方法论 (Architecture `&` Methodologies)**

1. **OOCSS (Object-Oriented CSS)**
2. **SMACSS (Scalable and Modular Architecture for CSS)**
3. **BEM (Block, Element, Modifier)**
4. **Atomic CSS / Utility-First CSS (e.g., Tailwind CSS)**
5. **ITCSS (Inverted Triangle CSS)**

# **九、CSS 框架与库 (Frameworks & Libraries)**

1. **UI 框架 (UI Frameworks): Bootstrap, Foundation, Bulma, Materialize**
2. **功能优先框架 (Utility-First Frameworks): Tailwind CSS**
3. **CSS-in-JS: Styled Components, Emotion**

# **十、性能优化与最佳实践 (Performance & Best Practices)**

1. **减少 HTTP 请求 (Reduce HTTP Requests)**

- 合并文件 (Concatenation)

2. **压缩 CSS (Minify CSS)**
3. **使用 CDN (Use CDN)**
4. **避免使用 @import (Avoid @import)**
5. **优化选择器性能 (Optimize Selector Performance)**

- 避免深层嵌套, 避免通用选择器作为键选择器

6. **减少重绘与回流 (Reduce Repaints & Reflows)**

- 使用 transform 和 opacity 进行动画
- 避免频繁改变布局相关属性

7. **代码组织与可维护性 (Code Organization & Maintainability)**
8. **可访问性 (Accessibility - A11y)**

- 颜色对比度, :focus 样式, ARIA 属性配合

9. **浏览器兼容性 (Browser Compatibility)**

- 使用 Can I Use 查看支持情况
- 渐进增强与优雅降级

10. **代码检查 (Linting)**

- Stylelint

11. **Reset CSS / Normalize CSS**

# **十一、CSS 新特性与未来趋势 (New Features & Future Trends)**

1. **容器查询 (Container Queries): @container**
2. **级联层 (@layer)**
3. **作用域 CSS (@scope - 实验性)**
4. **新的颜色空间与函数: lch(), oklch(), color-mix(), color-contrast()**
5. **CSS Houdini (提供底层 API，允许开发者扩展 CSS)**
6. **嵌套选择器 (Nesting Selectors - 原生支持)**
7. **滚动驱动动画 (Scroll-driven Animations)**
8. **三角函数: sin(), cos(), tan(), etc.**
9. **视图过渡 API (View Transitions API)**