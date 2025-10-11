好的，我帮你整理一份 **SCSS 与 Tailwind CSS 的常见面试题**，涵盖基础语法、嵌套、变量、Mixin、函数、响应式、优化等高频考点，并附面试要点和示例。内容重点突出，方便快速复习。

---

# **SCSS 常见面试题**

## **一、基础语法**

1. **SCSS 与 CSS 的区别**

   * SCSS 是 CSS 的超集，支持嵌套、变量、Mixin、继承、函数
   * SCSS 语法类似 CSS（以 `{}` 分组），SASS 语法缩进式

2. **变量使用**

```scss
$primary-color: #3498db;
.button { color: $primary-color; }
```

3. **嵌套（Nesting）**

```scss
nav {
  ul { margin: 0; padding: 0; }
  li { display: inline-block; }
}
```

* **注意**：嵌套过深会生成冗余 CSS，影响性能

4. **父选择器引用 `&`**

```scss
.button {
  &-primary { background: blue; }
  &:hover { background: darkblue; }
}
```

---

## **二、Mixin 与函数**

5. **Mixin 使用**

```scss
@mixin center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.box { @include center; }
```

6. **带参数的 Mixin**

```scss
@mixin size($w, $h) {
  width: $w;
  height: $h;
}
.box { @include size(100px, 50px); }
```

7. **函数与运算**

```scss
@function rem($px) { @return $px / 16 * 1rem; }
.box { font-size: rem(24); }
```

---

## **三、继承与占位选择器**

8. **继承 `@extend`**

```scss
%button-base { padding: 10px; border: none; }
.button { @extend %button-base; background: blue; }
```

* 优点：减少重复 CSS
* 缺点：可能生成复杂选择器链

9. **条件与循环**

```scss
@for $i from 1 through 3 { .col-#{$i} { width: 20% * $i; } }
```

---

## **四、响应式与优化**

10. **响应式 Mixin**

```scss
@mixin respond($breakpoint) {
  @if $breakpoint == mobile { @media (max-width: 768px) { @content; } }
}
.box { @include respond(mobile) { font-size: 14px; } }
```

11. **SCSS 性能优化**

* 避免嵌套过深
* 使用变量和 Mixin 重用
* 避免 `@extend` 滥用

---

# **Tailwind CSS 常见面试题**

## **一、基础用法**

1. **Tailwind 是什么？**

   * 原子化 CSS 框架，提供类名直接控制样式
   * 优点：无需写自定义 CSS，便于快速开发

2. **安装与配置**

```bash
npm install tailwindcss postcss autoprefixer -D
npx tailwindcss init
```

3. **基本类名用法**

```html
<div class="bg-blue-500 text-white p-4 rounded-md hover:bg-blue-700"></div>
```

---

## **二、布局**

4. **Flex 与 Grid 类**

```html
<div class="flex justify-center items-center">
<div class="grid grid-cols-3 gap-4">
```

5. **响应式类名**

```html
<div class="text-sm md:text-lg lg:text-xl"></div>
```

* `sm:`, `md:`, `lg:`, `xl:`, `2xl:`

6. **条件/状态类**

```html
<button class="bg-green-500 hover:bg-green-700 disabled:opacity-50"></button>
```

---

## **三、主题与自定义**

7. **自定义颜色与间距**

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: { primary: '#3498db' },
      spacing: { 72: '18rem' }
    }
  }
}
```

8. **插件使用**

* 例如 `@tailwindcss/forms` 处理表单样式
* 自定义插件可以生成新的工具类

---

## **四、优化与高级技巧**

9. **Purging（删除未使用 CSS）**

```js
content: ['./src/**/*.{html,js,jsx,ts,tsx}']
```

* 提升生产环境性能，减少文件体积

10. **组合类名与条件渲染**

* 使用 `clsx` 或 `classnames` 动态生成类名

```js
<div className={isActive ? 'bg-blue-500' : 'bg-gray-500'}></div>
```

11. **与 SCSS 混用**

* Tailwind 用于原子类，SCSS 用于复杂组件/函数
* 避免重复定义样式

---

## **五、面试要点总结**

**SCSS：**

* 熟悉嵌套、&、变量、Mixin、循环、继承
* 响应式布局与性能优化
* 条件逻辑与函数应用

**Tailwind：**

* 理解原子化、状态类、响应式类
* 会配置 theme 扩展、自定义插件
* Purge CSS 优化打包体积
* 与组件库/JSX 条件渲染结合

---
