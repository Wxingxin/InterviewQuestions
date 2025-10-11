好的，我帮你整理一份 **CSS 面试题大全**，覆盖 **基础、布局、选择器、动画、性能、兼容性、现代 CSS 技术** 等各类常见面试点，并附面试要点和简要示例。内容偏向前端面试实战，适合系统复习。

---

# **CSS 面试题大全**

## **一、基础语法与选择器**

1. **CSS 选择器有哪些？优先级如何计算？**

   * 标签选择器、类选择器、ID选择器、属性选择器、伪类/伪元素
   * 优先级：`inline > ID > class/attribute/pseudo-class > element/pseudo-element`
   * !important 可以覆盖优先级

2. 

3. **CSS 层叠和继承机制是什么？**

   * 层叠：冲突规则按权重 + 顺序
   * 继承：字体、color 等可继承属性

4. **盒模型及其区别？**

   * content-box（默认）：width/height 不包含 padding/border
   * border-box：width/height 包含 padding/border
   * `box-sizing: border-box` 可简化布局

---

## **二、布局相关**

5. **如何实现两栏布局/三栏布局？**

   * float + margin（老方法）
   * flexbox（推荐）
   * grid（现代方法）

6. **Flex 布局常用属性**

   * 父元素：`display: flex; flex-direction; justify-content; align-items; flex-wrap`
   * 子元素：`flex: 1 1 auto; align-self`

7. **Grid 布局基础属性**

   * 父元素：`display: grid; grid-template-columns/rows; gap`
   * 子元素：`grid-column/row; justify-self/align-self`

8. **垂直居中实现方法**

   * line-height = height
   * flex: `align-items: center; justify-content: center`
   * grid: `place-items: center`
   * absolute + transform: `top: 50%; left: 50%; transform: translate(-50%, -50%)`

9. **清除浮动的方式有哪些？**

   * `clearfix`
   * 父元素 `overflow: hidden`
   * 使用 flex/grid 替代 float

---

## **三、选择器与伪类**

10. **:nth-child 和 :nth-of-type 区别？**

    * nth-child：按父元素所有子元素计数
    * nth-of-type：按类型计数

11. **CSS 优先级与继承冲突如何解决？**

    * inline style > id > class > element
    * !important
    * 更具体的选择器

12. **伪类和伪元素区别？**

    * 伪类（:hover, :focus）改变元素状态
    * 伪元素 (::before, ::after) 创建虚拟元素

---

## **四、CSS 动画与过渡**

13. **transition 与 animation 区别？**

    * transition：状态变化触发
    * animation：可循环播放、关键帧控制

14. **关键帧动画使用方法**

```css
@keyframes slide {
  from { transform: translateX(0); }
  to { transform: translateX(100px); }
}
div { animation: slide 2s infinite; }
```

15. **GPU 加速属性有哪些？**

    * transform, opacity, filter
    * 避免频繁修改 layout、paint 属性（如 width/height）

---

## **五、CSS 性能优化**

16. **避免重绘与回流的方法？**

    * 尽量修改 transform/opacity 而非 layout
    * 合并多次 DOM 修改
    * 使用 documentFragment 或 requestAnimationFrame

17. **如何减少 CSS 体积？**

    * 使用 CSS Modules / Tree Shaking / PostCSS purge
    * 合理拆分文件和按需加载

---

## **六、响应式与兼容性**

18. **如何实现响应式布局？**

    * media query
    * rem/vw/vh 单位
    * flex/grid 自适应

19. **常见浏览器兼容问题及解决方案**

    * 前缀：-webkit- / -moz- / -ms-
    * box-sizing 不同默认值
    * flex/grid 老版本兼容（-ms- 前缀）

---

## **七、现代 CSS 技术**

20. **CSS Variables（自定义属性）使用方法**

```css
:root { --main-color: #3498db; }
div { color: var(--main-color); }
```

21. **CSS 函数使用**

* calc(): `width: calc(100% - 20px)`
* clamp(): 限制范围 `font-size: clamp(14px, 2vw, 18px)`

22. **CSS Houdini 简介**

* JS 控制 CSS 渲染、布局、动画
* 提供自定义 paint/layout/animation worklets

23. **CSS Modules / BEM / Tailwind CSS**

* 避免命名冲突
* 提高可维护性

---

## **八、常见面试考点汇总**

* **定位与层叠**：position、z-index、overflow、display
* **浮动与清除**：float、clearfix、flex/grid 替代
* **文本与字体**：line-height、letter-spacing、text-overflow
* **背景与渐变**：linear-gradient、radial-gradient
* **过渡与动画**：transition、animation、transform、opacity
* **性能与优化**：repaint、reflow、GPU 加速、减少选择器复杂度
* **现代 CSS**：flex、grid、变量、函数、Houdini

---

如果你需要，我可以帮你整理 **一份完整的《前端 CSS 面试全套题库 PDF》**：

* 包含 **100+ 高频题**
* 每题附 **面试要点、代码示例、图解**
* 覆盖 **基础/布局/动画/性能/现代 CSS**
* 适合系统复习和打印备考

你希望我帮你整理吗？
