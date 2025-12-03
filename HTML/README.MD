# 💯💯💯 第一部分 html 面试题

---

> ### HTML5 为什么需要写`<!DOCTYPE HTML>`？

- 使浏览器进入标准模式，阻止进入混杂模式
- 让浏览器使用最新的 HTML5 标准来解析渲染页面

> ### 为什么浏览器会有混杂模式

- 为保持浏览器渲染的 **兼容性**，使以前的页面能够正常浏览，浏览器都保留了**旧的渲染方法**

> ### 浏览器渲染模式

- 浏览器渲染模式分为<font color=red> 3 </font>种：
- 混杂模式[Quirksmode]
- 严格模式（标准模式）[Standarsmode]
- 几乎标准模式[Almoststandardsmode]

> ### 什么是严格模式与混杂模式？

- 严格模式：又称标准模式，是指浏览器按照 W3C 标准解析代码。
- 混杂模式：又称怪异模式或兼容模式，是指浏览器用自己的方式解析代码。
- 如何区分：浏览器解析时到底使用严格模式还是混杂模式，与**网页中的 DTD** 直接相关。

> ### 列举几条怪异模式中的怪癖行为

1. **盒模型不标准** 🛜：`width` 包含 `padding` 和 `border`，导致实际宽度变大。
2. **表格布局行为不一致** 🛜：宽度、间距算法与标准模式不同。
3. **百分比高度计算异常**🛜：`height: 100%` 不需要父元素设高度。
4. **`margin: auto` 居中失效**🛜。
5. **图片与文本的行高/间距异常**📶：图片下方常出现额外空隙。

> ### HTML5 新特性

| 分类                                       | 特性简述                                         |
| ------------------------------------------ | ------------------------------------------------ |
| 语义标签 <font color=red>💯 新增 💯</font> | header, section, article 等结构清晰              |
| 多媒体 <font color=red>💯 新增 💯</font>   | video, audio 标签直接播放                        |
| 无障碍 <font color=red>🤣 加强 🤣</font>   | HTML5 在无障碍方面进行了加强，加入了无障碍属性。 |
| 表单 <font color=red>🤣 加强 🤣</font>     | 更丰富的**输入类型**和**验证功能**               |
| 存储 <font color=red>😂 浏览器 😂</font>   | localStorage 和 sessionStorage                   |
| 图形 <font color=red>😂 浏览器 😂</font>   | canvas 与 SVG 绘图能力                           |
| API <font color=red>😂 浏览器 😂</font>    | 地理定位、拖拽、多线程、WebSocket                |

> ### 简述一下你对 HTML 语义化的理解。

- （1）使用语义化的标签来创建页面结构，如 header,footer,nav，从标签上可以**直观的知道**这个标签的作用
- （2）HTML 语义化让页面 ⏏️ 内容结构化 ➡️ 结构更清晰 ➡️ 利于开发和维护。而不是滥用 div；
- （3）搜索引擎的爬虫也依赖于 HTML **不同的标签**来确定**不同的权重**，有利于 SEO；

> ### 语义化标签 常用的

| 标签           | 含义      | 使用场景                    |
| -------------- | --------- | --------------------------- |
| `<header>`     | 页头部分  | 网站头部、模块头部          |
| `<nav>`        | 导航菜单  | 主导航、侧边栏导航          |
| `<main>`       | 页面主体  | 页面中唯一的主内容区域      |
| `<section>`    | 章节      | 内容逻辑区块，如文章段落    |
| `<article>`    | 独立内容  | 博文、评论、新闻块          |
| `<aside>`      | 侧边内容  | 侧栏、广告、推荐内容        |
| `<footer>`     | 页脚部分  | 页面底部或文章尾部          |
| `<figure>`     | 媒体对象  | 图像/图表配文字说明         |
| `<figcaption>` | 媒体说明  | `<figure>` 中图像的文字解释 |
| `<time>`       | 时间/日期 | 显示具体时间                |
| `<mark>`       | 高亮文本  | 搜索关键词、重点标记        |
| `<address>`    | 联系方式  | 作者或组织的联系地址        |

```html
<body>
  <header>网站头部</header>
  <nav>导航栏</nav>
  <main>
    <section>
      <article>
        <h2>标题</h2>
        <p>正文内容</p>
      </article>
    </section>
    <aside>侧边栏</aside>
  </main>
  <footer>版权信息</footer>
</body>
```

> ### 为什么利用多个域名来存储网站资源会更有效

- 安全：资源独立缓存，避免冲突
- 方便: CDN 缓存更方便，节省了 cookie
- 快速：突破浏览器的并发链接限制，提升页面首屏渲染速度

> ### 浏览器页面由哪三层构成

- 结构层：HTML 构建文档结构
- 表示层：css 设置文档的表现效果
- 行为层： js 和 dom 脚本 实现文档行为

---

> ### **块级元素**和**行级元素**

#### 常见块级元素：

| 标签           | 含义                           | 默认显示 |
| -------------- | ------------------------------ | -------- |
| `<header>`     | 页眉                           | block    |
| `<nav>`        | 导航                           | block    |
| `<main>`       | 主要内容                       | block    |
| `<article>`    | 文章/独立内容                  | block    |
| `<section>`    | 章节                           | block    |
| `<aside>`      | 侧边栏                         | block    |
| `<footer>`     | 页脚                           | block    |
| `<figure>`     | 图表、图片等独立流内容         | block    |
| `<figcaption>` | figure 的说明                  | block    |
| `<details>`    | 可展开的细节                   | block    |
| `<summary>`    | details 的标题                 | block    |
| `<address>`    | 联系信息                       | block    |
| `<h1>`~`<h6>`  | 标题                           | block    |
| `<p>`          | 段落                           | block    |
| `<div>`        | 通用容器（虽不强语义但常归类） | block    |
| `<hr>`         | 水平分隔线                     | block    |
| `<ul><ol><dl>` | 列表                           | block    |
| `<blockquote>` | 长引用                         | block    |
| `<pre>`        | 预格式化文本                   | block    |
| `<table>`      | 表格                           | block    |



#### 常见行级元素：

| 标签            | 含义                 | 默认显示 |
| --------------- | -------------------- | -------- |
| `<time>`        | 时间                 | inline   |
| `<mark>`        | 高亮文本             | inline   |
| `<span>`        | 通用行内容器         | inline   |
| `<abbr>`        | 缩写                 | inline   |
| `<cite>`        | 作品标题             | inline   |
| `<code>`        | 代码片段             | inline   |
| `<data>`        | 机器可读数据         | inline   |
| `<dfn>`         | 定义术语             | inline   |
| `<em>`          | 强调                 | inline   |
| `<strong>`      | 重要文本             | inline   |
| `<q>`           | 短引用               | inline   |
| `<small>`       | 小号文字（附属信息） | inline   |
| `<sub>`/`<sup>` | 下标/上标            | inline   |
| `<var>`         | 变量                 | inline   |
| `<kbd>`         | 键盘输入             | inline   |
| `<samp>`        | 示例输出             | inline   |

#### 特点


| 特性                  | 块级元素（block）                          | 行内元素（inline）                          |
|-----------------------|--------------------------------------------|---------------------------------------------|
| 是否独占一行          | 是，**默认100%占满父容器宽度**，从上到下垂直排列 | 否，跟文字一样水平排列，不打断行            |
| 宽度（width）         | 可以设置，默认为父容器可用宽度             | **不可设置**，由内容撑开                    |
| 高度（height）        | 可以设置（包括 auto）                      | **不可设置**（设置无效），由 line-height 和内容决定 |
| margin                | 四个方向都生效（margin-top/bottom/left/right） | **垂直方向（top/bottom）无效**，水平方向（left/right）有效 |
| padding               | 四个方向都生效                             | 四个方向都生效，但**垂直 padding 不会影响周边元素布局**（不会把上下行推开） |
| 是否可以包含其他元素  | 可以包含块级和行内元素                     | **只能包含行内元素**，不能包含块级元素      |
| 盒模型类型            | 正常块级盒（block-level box）              | 行内级盒（inline-level box）                |
| 典型代表              | `<div>、<p>、<h1>~<h6>、<ul>、<li>、<section>、<article>` 等 | `<span>、<a>、<strong>、<em>、<img>、<code>` 等 |
| vertical-align        | 不生效                                     | 生效（可以控制与文字基线的对齐方式）        |
| 是否参与行盒（line box）| 不参与，每一个块级元素生成一个或多个行盒的开始 | 参与当前行的行盒布局                        |
| display 值            | `block`                                    | `inline`                                    |

### 补充：还有一种常见中间形态 —— 行内块元素（inline-block）
| 特性                  | 行内块元素（inline-block）                 |
|-----------------------|--------------------------------------------|
| 是否独占一行          | 否，水平排列                               |
| width / height        | **可以设置**                               |
| margin / padding      | 四个方向都完全生效                         |
| 典型代表              | `<img>、<input>、<button>、<textarea>`（默认就是 inline-block） |
| display 值            | `display: inline-block`                    |

### 记忆口诀（非常好用）
- **块级**：独占一行，宽高 margin 随便设。
- **行内**：不独占一行，宽高设置无效，垂直 margin/padding 不影响布局。
- **行内块**：不独占一行，但宽高 margin/padding 全都生效（两边好处都占了）。



> ### iframe 有哪些优点和缺点

但是随着 Ajax 的出现，iframe 用得越来越少了。现在在某些特定的场景还能见到，比如**模拟窗口**，**邮箱**或者
**HTML 在线编辑器**等

#### **优点**：

1. **嵌套外部内容**：

   - 可以轻松嵌入其他网站或网页内容，比如广告、视频、地图等。

1. **隔离性**：

   - `iframe` 中的内容与主页面隔离，提供了独立的环境，这有助于避免主页面和嵌入页面的 CSS、JavaScript 等冲突。

1. **增强页面功能**：

   - 可以在不刷新整个页面的情况下嵌入动态内容，增强用户体验。例如，可以用 `iframe` 嵌入视频播放器、聊天框等。

1. **减少页面负载**：

   - 使用 `iframe` 加载外部页面，可以将外部资源和主页面的加载分开，减轻主页面的负担。

#### **缺点**：

1. **影响性能**：

   - 嵌入多个 `iframe` 可能增加浏览器的资源消耗，导致页面加载变慢，尤其是当每个 `iframe` 加载的内容较多时。

1. **SEO 不友好**：

   - 搜索引擎通常不会索引 `iframe` 中的内容，这可能影响页面的 SEO（搜索引擎优化）表现。

1. **跨域问题**：

   - 由于安全性原因，浏览器限制了 `iframe` 内的脚本与主页面脚本的交互，跨域时尤其需要特别处理（如使用 postMessage）。

1. **布局问题**：

   - 在某些情况下，`iframe` 可能对布局产生影响，需要特别注意 `iframe` 的大小和滚动条等问题。

> ### viewport

- `<meta name="viewport">` 是移动端网页开发中非常关键的标签，用于控制网页在移动设备上的**缩放与布局行为**。
- 解决问题：
- （1）页面太宽 → 被压缩缩放显示 : 控制页面布局宽度 , 适配不同屏幕
- （2）字太小，用户体验差 : 控制缩放比例 , 提升用户体验

# 💯💯💯 第二部分 html 面试题 PICTURE

---

> ### 1️⃣ 加载图片的过程是怎样的？

**答：**

1. HTML 解析到 `<img>` 标签；
2. 发起**图片资源**请求；
3. 图片下载完成 ➡️ 解码 ➡️ 绘制到页面；

**补充**：图片解码在浏览器中是异步的，不会阻塞主线程。

> ### 2️⃣ 加载失败如何处理？

**答：**

- 使用 `alt` 文本；
- 使用 JS 监听 `onerror`；

  ```html
  <img src="xxx.jpg" onerror="this.src='backup.jpg'" />
  ```

- 后端返回默认图片。

> ### 3️⃣ `<img>` 的常见属性有哪些？

**答：**

| 属性               | 作用                                   |
| ------------------ | -------------------------------------- |
| `src`              | 图片路径                               |
| `alt`              | 图片加载失败时显示的替代文字           |
| `width` / `height` | 显示尺寸（不影响原图）                 |
| `loading`          | 懒加载（如 `loading="lazy"`）          |
| `srcset` / `sizes` | 响应式加载不同分辨率的图片             |
| `crossorigin`      | 允许跨域访问图片（如配合 canvas 使用） |

---

> ### 4️⃣ 图片太多，加载太慢怎么办？

**答：** 常见优化手段：

1. ✅ **使用 CDN 加速 💤 网络 💤**
2. ✅ **懒加载（Lazy Load）🛜code🛜**

   ```html
   <img src="..." loading="lazy" />
   ```

   或使用 IntersectionObserver。

3. ✅ **预加载关键图片 🛜code🛜**
4. ✅ **压缩图片（TinyPNG、ImageOptim）📶not code📶**
5. ✅ **图片格式优化（WebP、AVIF）📶not code📶**
6. ✅ **使用雪碧图（Sprite）📶not code📶** 减少 HTTP 请求。

---

> ### 5️⃣ 图片懒加载原理？

**答：**

- 只有当图片**即将进入视口（用户可见区域）**时，才开始加载真实图片。
  未进入视口时先用占位符，减少初始加载资源，提高性能。

##### **方式 1：原生属性 `loading="lazy"`（最简单）**

```html
<img src="image.jpg" loading="lazy" alt="" />
```

✔ 浏览器自动在图片即将可见时加载。

---

##### **方式 2：IntersectionObserver（推荐）**

更精确可控，支持更多 API。

```html
<img data-src="real.jpg" class="lazy" alt="" />

<script>
  const imgs = document.querySelectorAll("img.lazy");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        observer.unobserve(img);
      }
    });
  });

  imgs.forEach((img) => observer.observe(img));
</script>
```
---

```html
<img data-src="real.jpg" class="lazy" alt="">
```
**技巧点**：
- 故意不写 `src` 属性（或者写一个占位图如 1×1 的透明 gif），避免页面加载时立即请求图片
- 把真实地址存在 `data-src` 自定义属性里
- 加 `class="lazy"` 作为“需要懒加载”的标记，方便 JS 选中它们

```js
const imgs = document.querySelectorAll('img.lazy');
```
- 选中页面上所有带 `class="lazy"` 的 `<img>` 标签，得到一个 NodeList

```js
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
```
- 创建一个 **交叉观察者（IntersectionObserver）**
- 它会持续监听“被观察的元素是否进入或即将进入可视区域（viewport）”
- `entry.isIntersecting === true` → 表示这张图片已经**滚到屏幕里了**（或即将出现）

```js
      const img = entry.target;                // 当前滚进视口的 img 元素
      img.src = img.dataset.src;               // 把 data-src 的值赋给 src → 真正开始加载图片
      img.classList.remove('lazy');            // 加载完后移除 lazy 类（可选，防止重复触发）
      observer.unobserve(img);                 // 停止观察这张图片（已经加载了，没必要再观察）
```
**核心懒加载逻辑就在这四行**：
1. 把真实地址从 `data-src` → `src`，触发图片下载
2. 移除 `lazy` 类（方便配合 CSS 做 loading 占位效果）
3. 取消对这张图的观察，节省性能

```js
    }
  });
});
```
- 关闭回调函数

```js
imgs.forEach(img => observer.observe(img));
```
- 把页面上所有 `.lazy` 图片都交给 observer 去监视
- 一旦用户滚动到它们附近，就会自动触发上面的加载逻辑

### 完整工作流程图解
```
页面加载 → img 只有 data-src，没有 src → 浏览器不请求图片
      ↓
用户向下滚动
      ↓
IntersectionObserver 检测到某张 img 进入视口
      ↓
自动执行：img.src = img.dataset.src
      ↓
浏览器真正开始下载 real.jpg
      ↓
图片加载完成并显示
      ↓
移除 lazy 类 + 停止观察（避免重复加载）
```

### 优点（为什么现在都用这个写法）
| 优点                  | 说明 |
|-----------------------|------|
| 原生 API，性能极高     | 不需要 scroll + timer 轮询 |
| 准确触发               | 只有真正快出现时才加载 |
| 自动处理动态添加的图片 | 只要再 observe 一下就行 |
| 兼容性已经很好         | 2025 年所有现代浏览器都支持（包括手机端） |

### 可选增强（生产中常加的）
```html
<img data-src="real.jpg" class="lazy" alt="" loading="lazy">  <!-- 浏览器原生也支持！ -->
```
现代浏览器已经原生支持 `loading="lazy"` 属性，如果你不追求极致兼容老浏览器，直接写这个就行，**一行属性搞定懒加载**，连 JS 都不用！

但手写 IntersectionObserver 的好处是：
- 兼容更老的浏览器
- 可以加加载动画、统计曝光等额外逻辑


##### **方式 3：滚动事件监听（不推荐）**

较老的方式，需要自行判断是否进入可视区。

---

> ### 6️⃣ 响应式图片如何实现？

**答：**
有两种方式：

**方式 1：`srcset` + `sizes`（最推荐，现代浏览器通用）**

##### **1）使用不同分辨率的图片**

```html
<img
  src="img-800.jpg"
  srcset="img-400.jpg 400w, img-800.jpg 800w, img-1200.jpg 1200w"
  sizes="
    (max-width: 600px) 400px,
    (max-width: 1000px) 800px,
    1200px
  "
  alt="示例图片"
/>
```

##### **原理：**

- `srcset` 告诉浏览器“有哪些尺寸的图片可用”
- `sizes` 告诉浏览器“当前布局需要多宽的图片”
- 浏览器根据设备宽度、DPR（像素密度）自动选择最合适的图片文件。

---

#### **方式 2：使用 `<picture>` 元素**

适合需要 **不同格式**（如 WebP）或完全不同的图片资源。

```html
<picture>
  <source srcset="img.webp" type="image/webp" />
  <source srcset="img.jpg" type="image/jpeg" />
  <img src="img.jpg" alt="示例图片" />
</picture>
```

##### **原理：**

浏览器根据支持的格式自动选择最合适的 `<source>`。

> ### 7️⃣ 常见图片格式区别？

| 格式                                 | 特点                 | 适用场景            |
| ------------------------------------ | -------------------- | ------------------- | ---------- |
| **PNG** 🚩                           | (无损                | 有损)压缩，支持透明 | 图标、Logo |
| **SVG** 🚩                           | 矢量图，可缩放       | 图标、Logo          |
| **JPEG/JPG** 🏴‍☠️                      | 有损压缩，小体积     | 照片类图片          |
| **GIF** 🏴‍☠️                           | 动图，最多 256 色    | 表情、动效          |
| **WebP** <font color=red> 新 </font> | 体积小、支持透明     | 现代 Web（推荐）    |
| **AVIF** <font color=red> 新 </font> | 新一代格式，压缩更强 | 高性能网站          |

---

> ### 8️⃣ WebP 与 PNG 的区别？

**答：**

| 对比项         | WebP                                  | PNG          |
| -------------- | ------------------------------------- | ------------ |
| 压缩方式 🈶    | 有损 / 无损                           | 无损         |
| 透明度 🈶      | 支持                                  | 支持         |
| 动图 🈶        | 支持（WebP 动图）                     | 支持（APNG） |
| 文件大小 🈚️   | 通常更小                              | 相对大       |
| 浏览器支持 🈚️ | 新版 Chrome / Edge / Firefox / Safari | 全支持       |

---

> ### 9️⃣ Base64 图片是什么？优缺点？

**答：**
Base64 是把图片**二进制数据**编码成**文本**（ASCII 字符串）：

```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUg..." />
```

1. ✅ 优点：

- 减少 HTTP 请求（适合小图标）

2. ❌ 缺点：

- 会增大体积（大约 +30%）
- 无法缓存（嵌入 HTML 里）

---

> ### 🔟 雪碧图（Sprite）原理？

**答：**

- 把多个小图标拼成一张大图；
- 用 `background-position` 来定位显示哪个部分；

```css
.icon {
  background-image: url(sprite.png);
  width: 20px;
  height: 20px;
}
.icon-home {
  background-position: -20px -40px;
}
```

- ✅ 优点：减少请求数
- ❌ 缺点：维护成本高。

---

> ### 1️⃣1️⃣ 如何使用 Canvas 压缩图片？

```js
function compressImage(img, quality = 0.7) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL("image/jpeg", quality);
}
```

---

> ### 1️⃣2️⃣ 如何判断一张图片是否加载完成？

**答：**

#### ✅ **方式 1：使用 `new Image()`（你已经写的方式）**

这是最标准、最干净的做法，适合预加载图片。

```js
const img = new Image();
img.onload = () => console.log("加载完成");
img.onerror = () => console.log("加载失败");
img.src = "test.jpg";
```

#### ✅ **方式 2：判断页面中已有的 `<img>` 是否加载完成**

有时候 `<img>` 已在 HTML 中，你要判断它是否已经加载。

```html
<img id="photo" src="test.jpg" />
```

```js
const img = document.getElementById("photo");

if (img.complete) {
  console.log("已经加载完成（来自缓存或已经渲染）");
} else {
  img.onload = () => console.log("加载完成");
  img.onerror = () => console.log("加载失败");
}
```

###### `img.complete` 是关键：

| 状态         | `img.complete` | `img.naturalWidth` |
| ------------ | -------------- | ------------------ |
| 图片加载完成 | true           | > 0                |
| 图片加载失败 | true           | 0                  |
| 图片尚未加载 | false          | 0                  |

---

#### ✅ **方式 3：判断图片是否加载失败**

可以结合 naturalWidth 判断：

```js
const img = document.getElementById("photo");

img.onload = () => {
  if (img.naturalWidth > 0) {
    console.log("加载成功");
  }
};

img.onerror = () => console.log("加载失败");
```

---

#### ✅ **方式 4：使用 Promise 封装图片加载（更现代）**

适合 React / Vue / Node SSR 图片预处理。

```js
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

loadImage("test.jpg")
  .then(() => console.log("加载完成"))
  .catch(() => console.log("加载失败"));
```

---

> ### 1️⃣3️⃣ 图片跨域 Canvas 报错如何解决？

**答：**

1. 在前端设置：

   ```js
   const img = new Image();
   img.crossOrigin = "anonymous";
   img.src = "https://example.com/test.jpg";
   ```

2. 服务器端添加 CORS 响应头：

   ```
   Access-Control-Allow-Origin: *
   ```

---

> ### 1️⃣4️⃣ 如何实现一个图片懒加载组件？

#### 核心实现（IntersectionObserver 版）

###### 思路

1. 初始 `img` 只放占位图/空 src，把真实地址放 `data-src`。
2. 用 `IntersectionObserver` 观察图片元素。
3. 当元素进入视口（`isIntersecting`）时，把 `data-src` 赋给 `src`，然后取消观察。

##### 原生 JS 组件示例

```html
<img class="lazy" data-src="real.jpg" src="placeholder.jpg" alt="" />
```

```js
function initLazyImages({
  selector = "img.lazy",
  rootMargin = "200px 0px", // 提前 200px 预加载
  threshold = 0.01,
  errorSrc = "",
} = {}) {
  const imgs = document.querySelectorAll(selector);
  if (!imgs.length) return;

  // 不支持 IO 时降级
  if (!("IntersectionObserver" in window)) {
    imgs.forEach((img) => load(img));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          load(img);
          io.unobserve(img);
        }
      });
    },
    { rootMargin, threshold }
  );

  imgs.forEach((img) => io.observe(img));

  function load(img) {
    const realSrc = img.dataset.src;
    if (!realSrc) return;
    img.src = realSrc;
    img.onload = () => img.classList.add("loaded");
    img.onerror = () => errorSrc && (img.src = errorSrc);
  }
}
initLazyImages();
```

---

##### React/Vue 组件一句话版（原理一致）

- `ref` 拿到 DOM
- `useEffect/onMounted` 注册 IO
- `isIntersecting` 时 setState / 改 src

---

##### 一句话总结（面试可背）

> 我会用 IntersectionObserver 监听图片元素，默认先渲染占位图，把真实地址放 data-src；当图片进入视口（配合 rootMargin 提前 200px）时再把 data-src 赋给 src 并取消监听；不支持 IO 的浏览器用 scroll + throttle + getBoundingClientRect 做降级，同时补上 error fallback 和 loaded 动画状态。

---

> ### 1️⃣5️⃣ 如果需要上传图片前进行压缩，你会怎么做？

考察点：

- FileReader 读取图片
- Canvas 画图 + toDataURL 输出
- Blob 转 File 再上传

---

> ### 1️⃣6️⃣ 前端如何做图片优化策略？

**答：**

#### 1) 格式优化（收益最大）

- **优先 AVIF / WebP，兜底 JPEG/PNG**
  用 `<picture>` 做多格式回退。
- **透明/无损场景用 PNG**，图标/插画优先 **SVG**。
- 能裁剪的动图尽量用 **MP4/WebM/Lottie** 替代 GIF。

```html
<picture>
  <source srcset="a.avif" type="image/avif" />
  <source srcset="a.webp" type="image/webp" />
  <img src="a.jpg" alt="" />
</picture>
```

---

#### 2) 分辨率自适应（响应式/按需尺寸）

核心是：**不要让用户下载比容器大很多的图**。

- 后端/CDN 出多档尺寸（320/640/1280…）
- 前端用 `srcset + sizes` 选择最合适的
- 高 DPR 设备自动拿 2x/3x

```html
<img
  src="a-640.jpg"
  srcset="a-320.jpg 320w, a-640.jpg 640w, a-1280.jpg 1280w"
  sizes="(max-width: 600px) 320px, (max-width: 1200px) 640px, 1280px"
/>
```

---

#### 3) 加载优化

- **懒加载**：IntersectionObserver + rootMargin 预加载下一屏
- **关键图优先**：首屏 hero 图 `preload` / 框架里的 `priority`
- 列表大量图片：**虚拟列表** + 懒加载组合
- `decoding="async"`、`fetchpriority="high"`（支持时）
- 低网速优先加载低清，再替换高清（渐进式）

```html
<link rel="preload" as="image" href="hero.webp" />
<img src="hero.webp" fetchpriority="high" decoding="async" />
```

---

#### 4) CDN + 图片处理能力

- **CDN 就近分发**降低 RTT
- 用 CDN 的**动态裁剪/缩放/格式转换**参数
  例如：`?w=640&h=360&fit=cover&fm=webp&q=80`
- 大站常见策略：**同一张原图 + CDN 参数实时出不同版本**，避免存多份。

---

#### 5) 缓存策略（减少重复下载）

- 静态图长缓存：`Cache-Control: max-age=31536000, immutable`
- 文件名带 hash，更新不怕缓存
- 可选：Service Worker 做离线/二次访问加速（PWA）

---

#### 6) 体积/内联策略（小图 Base64 的正确用法）

你写的“小图转 Base64”要说清适用边界：

- **适合非常小且高频图标**（比如 < 2KB）
  避免额外请求、减少 RTT
- **不适合稍大图片**：Base64 会膨胀约 1/3，且不可独立缓存
- 更好的替代：**SVG sprite / iconfont / HTTP2 多路复用**。

---

#### 7) 渲染与体验（面试加分）

- 避免 CLS：给图片明确 `width/height` 或 `aspect-ratio`
- placeholder：LQIP / blur / blurhash / skeleton
- 渐进式加载淡入，让视觉更稳

```html
<img src="a.webp" width="640" height="360" style="aspect-ratio:16/9" />
```

---

#### 8) 监控与迭代（高级加分点）

- 关注 **LCP / CLS / 图片平均大小 / 命中缓存率**
- 上报图片失败率、加载耗时
- A/B 测试 WebP/AVIF、不同质量参数收益

---

#### 一段“标准面试总结”

> 图片优化我会按“格式—尺寸—加载—缓存—体验—监控”做：优先 AVIF/WebP + picture 兜底；用 CDN 多尺寸和 srcset/sizes 做分辨率自适应；列表图懒加载、首屏关键图 preload/priority；走 CDN 就近分发并按需裁剪转码；配长缓存和 hash 版本控制；渲染侧用 placeholder 和固定宽高避免 CLS；最后用 LCP/CLS 和体积监控持续优化。

# 💯💯💯 第三部分 SEO 面试题

> ## 🧭 一、什么是 SEO？

**SEO（Search Engine Optimization）即“搜索引擎优化”**。

- 是指通过**对网站结构、内容、链接及技术优化**，让网站在搜索引擎（如百度、Google）中的**自然排名更靠前**
- 从而提升网站的**曝光率、点击率和访问量**。

---

> ## 🧩 二、SEO 的核心原理

1. 搜索引擎（如 Google、Baidu）通过「**爬虫程序**」抓取网页内容
2. 然后根据<font color=red>算法</font>对网页进行**索引（Indexing）**和**排名（Ranking）**。
3. （补充）SEO 的目标:就是**让网页更容易被爬虫识别、理解和推荐**。

---

> ## 🚀 三、为什么 SEO 对网站至关重要？

| 原因                      | 说明                                                           |
| ------------------------- | -------------------------------------------------------------- |
| **1. 提升曝光和流量**     | 大多数用户通过搜索引擎访问网站，排名靠前的网站能获得更多访问。 |
| **2. 降低推广成本**       | 与付费广告相比，SEO 是一种长期、自然的引流方式。               |
| **3. 增强品牌可信度**     | 排名靠前的网站更容易获得用户信任。                             |
| **4. 提升用户体验（UX）** | SEO 优化往往伴随内容结构、性能优化，使网站更易用。             |
| **5. 改善网站结构**       | 有助于前后端分离项目的内容可爬取性（SSR、静态化）。            |

## 🧭 一、SEO 的关键点（核心六大方面）

SEO 的优化点非常多，但前端工程师需要掌握以下 6 大关键方面 👇

| 分类               | 关键点                                             | 说明                                   |
| ------------------ | -------------------------------------------------- | -------------------------------------- |
| **1️⃣ 内容优化**    | 关键词布局、标题层级、描述清晰                     | 内容质量 & 关键词自然出现              |
| **2️⃣ HTML 语义化** | 合理使用 h1~h6、p、a、img、nav、article            | 让搜索引擎理解内容结构                 |
| **3️⃣ Meta 信息**   | `<title>`、`<meta description>`、`<meta keywords>` | 决定搜索结果摘要展示                   |
| **4️⃣ 链接结构**    | 内链（内部跳转） + 外链（外部引用） + URL 规范     | 影响网站权重传递与爬虫抓取深度         |
| **5️⃣ 性能优化**    | 首屏加载、图片懒加载、CDN、JS 体积控制             | 页面性能是 Google/Baidu 排名的重要权重 |
| **6️⃣ 技术适配**    | SSR（服务端渲染）、移动端适配、sitemap.xml         | 确保爬虫能看到完整内容                 |

---

## 🚀 二、我在日常开发中采取的 SEO 优化措施（面试可直接背诵 ✅）

### 💡（1）HTML 语义化结构

我在开发时会注意：

- 使用 `<header>`、`<nav>`、`<main>`、`<article>`、`<footer>` 等语义化标签；
- 保证每个页面只有一个 `<h1>`；
- 重要内容用 `<strong>` 或 `<em>`；
- 图片都有合理的 `alt` 描述。

✅ 示例：

```html
<article>
  <h1>前端性能优化指南</h1>
  <p>本文介绍了10种常见的性能优化方法...</p>
  <img src="img/seo.jpg" alt="前端性能优化示意图" />
</article>
```

---

### 💡（2）Meta 标签优化

每个页面都会配置标题和描述信息：

```html
<head>
  <title>前端开发教程 - 代码实战与优化技巧</title>
  <meta
    name="description"
    content="提供高质量前端教程、实战项目与性能优化方案。"
  />
  <meta name="keywords" content="HTML,CSS,JavaScript,React,Vue,前端教程" />
</head>
```

这些标签有助于搜索引擎识别主题内容，并在搜索结果中展示摘要。

---

### 💡（3）URL 设计 & 路由规范化

- URL 使用语义化、可读的单词而非参数。
  ✅ `/blog/javascript-basics`
  ❌ `/article?id=1234`

- 使用小写、短横线分隔；

- 对 React/Vue SPA 项目，会使用「**服务器端 URL 重写**」或 SSR，让每个路径都能被单独访问。

---

### 💡（4）SSR 或静态预渲染（解决 SPA 不可爬取问题）

搜索引擎爬虫对 SPA（单页应用）的 JS 渲染支持有限。
因此在实际项目中，我会：

- 使用 **Next.js（React）** 或 **Nuxt.js（Vue）** 提供 SSR；
- 或者使用 **`vite-plugin-ssr` / prerender-spa-plugin`** 做静态化导出；
- 确保爬虫访问页面时，HTML 已包含主要内容。

---

### 💡（5）性能优化（影响 SEO 排名的关键）

Google 的算法（Core Web Vitals）强烈依赖性能指标。
我在开发中会重点关注：

- 图片懒加载 (`loading="lazy"`);
- 使用 CDN；
- JS 分包与 Tree-shaking；
- 缓存策略（HTTP 缓存 + 本地缓存）；
- 减少阻塞渲染的 JS/CSS；
- 压缩资源。

✅ 示例：

```html
<img src="/images/banner.jpg" loading="lazy" alt="首页横幅图" />
```

---

### 💡（6）移动端适配 & 响应式设计

- 使用 `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- 优化字体与按钮尺寸；
- 使用媒体查询或响应式框架；
- 确保 Lighthouse 移动端评分达标（Google 移动优先索引）。

---

### 💡（7）辅助文件与外部支持

- `robots.txt`：告知爬虫哪些页面可以/不可以抓取。
- `sitemap.xml`：提供网站结构地图，方便索引。
- Open Graph（OG）/Twitter Card 标签：优化社交分享预览。

✅ 示例：

```html
<meta property="og:title" content="前端开发教程" />
<meta property="og:description" content="实用的前端项目与性能优化技巧" />
<meta property="og:image" content="/images/share.jpg" />
```

---

### 8️⃣ 编写合理的 robots.txt 文件

**robots.txt 是一个存放在网站根目录中的文本文件**

- 其主要作用是告诉搜索引擎爬虫哪些部分的网站可以被抓取（爬取）以及哪些部分不应该被抓取。

### 📊 三、面试可用的“总结版回答模板”

> SEO 的关键点主要包括内容质量、语义化结构、Meta 优化、URL 设计、性能与移动端适配。
>
> 在日常开发中，我通常会：
>
> 1. 使用语义化 HTML 标签，让爬虫更好理解页面结构；
> 2. 为每个页面配置独立的 `<title>`、`<meta description>`；
> 3. 保证 URL 结构清晰、可读；
> 4. 采用 SSR 或预渲染提高 SPA 的可爬取性；
> 5. 优化性能与首屏加载，提升搜索排名；
> 6. 添加 sitemap.xml 和 robots.txt 辅助爬虫索引；
> 7. 做好移动端适配，保证良好的用户体验。

5.重要内容 HTML 代码放在最前
索引擎抓取 HTML 顺序是从上到下，所以我们尽量将重要的内容放在前面，保证重要内容一定会被抓取。 6.少用 iframe
I
少用或者尽量不用 iframe，因为搜索引擎不会抓取 iframe 中的内容

# 💯💯💯 第四部分 html 面试题 script

> ### 1. `<script>`, `defer`, `async` 的区别？

**问：**
在 HTML 中，`<script>...</script>`、`<script defer>...</script>`、`<script async>...</script>` 有什么区别？

**答：**

1. **普通 script（不带属性）**

   ```html
   <script src="main.js"></script>
   ```

   - **加载：** 浏览器解析 HTML 时遇到 script，就**暂停 DOM 解析**，去下载 JS。
   - **执行：** 下载完**立即执行**，执行完再继续解析后面的 HTML。
   - **特点：** 阻塞渲染（render-blocking / parser-blocking）。

2. **`defer` 脚本**

   ```html
   <script src="main.js" defer></script>
   ```

   - **加载：** 和解析 HTML **并行加载**脚本，不阻塞 HTML 解析。
   - **执行时机：**

     - 在 DOM **解析完成后**，但在 `DOMContentLoaded` 触发前执行。

   - **多个 defer 脚本：** 会**按照在页面中出现的顺序**依次执行。
   - **常用于：** 放在 `<head>` 中加载页面主逻辑脚本，不阻塞页面结构解析。

3. **`async` 脚本**

   ```html
   <script src="main.js" async></script>
   ```

   - **加载：** 同样与 HTML **并行加载**。
   - **执行时机：** 下载完成后**立即执行**，哪怕此时 DOM 还没解析完。
   - **多个 async 脚本：** 谁先下载完谁先执行，**不保证顺序**。
   - **常用于：** 广告、统计埋点、独立模块，不依赖 DOM 结构和其它脚本。

一句话总结：

> - **普通**：边下边执行，阻塞解析。
> - **defer**：并行下载，等 DOM 解析完再按顺序执行。
> - **async**：并行下载，谁先下完谁先执行，不等 DOM，也不等其他脚本。

---

> ### 2. 它们对 DOM 解析和页面渲染有什么影响？

**问：**
`<script>` / `defer` / `async` 对 DOM 解析顺序和页面渲染有什么影响？

**答：**

- **普通 `<script>`：**

  - 遇到标签 → **暂停** 解析 HTML → 下载 + 执行 JS → 再继续解析。
  - 可能导致 **白屏时间变长**，因为渲染要等脚本执行完。

- **`defer`：**

  - DOM 一直正常解析，脚本在后台下载。
  - 会在 DOM 解析完成后、`DOMContentLoaded` 事件之前执行。
  - **不阻塞** DOM 解析，页面首屏更快展示。

- **`async`：**

  - DOM 正常解析，脚本在后台下载。
  - 一旦脚本下载完成就**立即执行**，可能在 DOM 完成前。
  - 执行时会短暂阻塞当前解析，但总体上**减少了初始阻塞**。
  - 执行时间不稳定，**可能打断 DOM 解析**的连续性。

---

> ### 3. 多个 `defer` / `async` 脚本的执行顺序？

**问：**
多个 `defer` 脚本和多个 `async` 脚本的执行顺序是怎样的？

**答：**

- **多个 `defer`：**

  ```html
  <script src="a.js" defer></script>
  <script src="b.js" defer></script>
  ```

  - 即使 `b.js` 先下载完，也会**按出现顺序**：先执行 `a.js` 再 `b.js`。
  - 都在 DOM 解析完成后执行。

- **多个 `async`：**

  ```html
  <script src="a.js" async></script>
  <script src="b.js" async></script>
  ```

  - 谁先下载完谁先执行。
  - **执行顺序不受 HTML 中位置控制**。
  - 不适合有顺序依赖的脚本（例如必须先加载库再加载插件的场景）。

---

> ### 4. 什么时候用 `defer`，什么时候用 `async`？

**问：**
实际项目中，分别在什么场景下使用 `defer` 和 `async`？

**答：**

- 使用 **`defer`**：

  - 页面**主业务逻辑**脚本。
  - 依赖 DOM 结构（但不要求 DOM 一解析完立刻执行）。
  - 多个脚本之间有严格的**依赖顺序**。
  - 常见写法：在 `<head>` 中

    ```html
    <head>
      <script src="vendor.js" defer></script>
      <script src="app.js" defer></script>
    </head>
    ```

- 使用 **`async`**：

  - **独立性强**的脚本，不依赖 DOM、不依赖其它脚本，也没人依赖它。
  - 比如：统计、广告、AB 测试、埋点、监控等。
  - 常见：

    ```html
    <script src="analytics.js" async></script>
    ```

---

> ### 5. `defer` 与 `DOMContentLoaded`、`load` 的关系？

**问：**
`defer` 脚本的执行时机和 `DOMContentLoaded` / `load` 事件的触发顺序是怎样的？

**答：**

对带 `defer` 的外部脚本：

1. 浏览器解析 HTML 时发现 `defer` 脚本 → 异步下载，不阻塞解析。
2. DOM 解析结束。
3. 所有 `defer` 脚本按顺序执行。
4. 执行完所有 `defer` 脚本后，触发 `DOMContentLoaded` 事件。
5. 等图片等资源加载完后，触发 `window.onload`。

记忆：

> **defer 脚本总是先于 `DOMContentLoaded` 执行**，但晚于 DOM 完全解析。

---

> ### 6. 为什么推荐把 `<script>` 放在 `</body>` 前面？和 `defer` 有什么区别？

**问：**
很多项目会把 `<script>` 放在 `</body>` 前面，这和使用 `defer` 有什么不同？

**答：**

- 把普通 `<script>` 放在 **`</body>` 前**：

  ```html
  ...
  <script src="main.js"></script>
  </body>
  </html>
  ```

  - 确保前面大部分 DOM 已经解析完，再开始阻塞下载+执行。
  - 简单粗暴，但**仍然会阻塞剩余解析**，也不如 `defer` 标准清晰。

- 使用 `<head> + defer`：

  ```html
  <head>
    <script src="main.js" defer></script>
  </head>
  ```

  - 更语义化，逻辑清晰：脚本在 DOM 完成后执行。
  - 浏览器可更好地做并行加载和优化。

总的来说，**现代推荐使用 `defer` 而不是一味把 `<script>` 往页面底部扔。**

---

> ### 7. 内联脚本可以用 `defer` / `async` 吗？

**问：**
内联脚本 `<script>console.log(1)</script>` 可以使用 `defer` 或 `async` 吗？效果如何？

**答：**

- 规范上：`defer` / `async` 主要是为**外部脚本（有 src）**设计的。
- 实际上：

  ```html
  <script defer>
    console.log("inline");
  </script>
  ```

  - 大多数浏览器**会忽略**内联 script 上的 `defer` / `async`，当作普通脚本执行。

- 面试答法：

  - 一般认为：**`defer` / `async` 只对带 `src` 的外部脚本有效**。
  - 想要延后执行内联脚本，应使用事件（如 `DOMContentLoaded`）、模块脚本或其他方式。

---

> ### 8. `type="module"` 与 `defer` / `async` 的关系？

**问：**
使用 `<script type="module">` 时，它的加载和执行行为和 `defer` / `async` 有什么关系？

**答（加分题）：**

- 模块脚本默认类似于带 `defer` 的外部脚本：

  ```html
  <script type="module" src="main.js"></script>
  ```

  - **默认不阻塞 DOM 解析**。
  - 在 DOM 解析完成后执行（相当于隐式 `defer`）。

- 也可以结合 `async`：

  ```html
  <script type="module" src="main.js" async></script>
  ```

  - 行为类似 `async`：并行加载，下载完成后立刻执行，不保证顺序。

回答的时候可以说：

> `type="module"` 的脚本默认是“延迟执行”的，行为很接近 `defer`，但支持模块语法（import/export）以及顶层 await。

---

如果你需要，我可以再给你出一套**选择题 / 填空题**版本，或者帮你把上面内容压缩成“3 分钟背诵版”方便面试前快速复习。

---

# 💯💯💯 面试题 4 other

> ### 请描述下 SEO 中的 TDK？

#### ✅ **TDK = Title + Description + Keywords**

分别对应 HTML 中 `<title>`、`<meta name="description">`、`<meta name="keywords">`。

---

#### 📌 **1. T = Title（网页标题）**

```html
<title>网站标题 - 关键词</title>
```

###### 作用：

- 影响**搜索引擎**对网页**主题**的判断（SEO 最重要的因素之一）
- 影响用户在**搜索结果**中的**点击率**（CTR）

##### # 要求：

- **唯一、精准、简短（一般 ≤ 60 字符）**
- （建议靠前）

---

### # 📌 **2. D = Description（网页描述）**

```html
<meta
  name="description"
  content="网页内容的简要描述，通常显示在搜索结果标题下方。"
/>
```

###### 作用：

- 作为 **页面摘要** 显示在 **搜索结果** 中
- 影响 **点击率**，但对排名影响较弱

###### 要求：

- 80–160 字符较合适
- 自然包含关键词
- **内容准确**概括页面主题

---

### # 📌 **3. K = Keywords（关键词）**

```html
<meta name="keywords" content="关键词1, 关键词2, 关键词3" />
```

###### 作用：

- 早期 SEO 的关键字段，现在**主流搜索引擎（如 Google/Bing）已基本忽略**

###### 要求：

- 控制 3–5 个相关性最高的关键词

---

#### 📌 面试中怎么回答更加专业？

可以这样回答：

> **TDK 指 Title、Description 和 Keywords，是网页 SEO 的三大基础优化要素。Title 负责页面主题定位，是 SEO 权重最高的字段；Description 主要影响搜索结果展示摘要和点击率；Keywords 虽然在现代搜索引擎权重已大幅降低，但在部分国内场景仍有意义。合理设置 TDK 有助于提升网页在搜索引擎中的可见性与排名。**

> ### 什么是可替换元素，什么是非可替换元素，它们各自有什么特点？

1. **可替换元素是指**

- 这样一种元素，它在页面中的大部分展现效果不由 CSS 决定。
- **"IMG"**CSS 虽然可以控制图片的尺寸位置，但永远无法控制图片本身。
- **"IMG"**比如 img 元素就是一个可替换元素，它在页面中显示出的效果主要取决于你连接的是什么图片，图片是什么它就展示什么
- **select** 元素也是一个典型的可替换元素，它在页面上呈现的是用户操作系统上的下拉列表样式，因此，它的展现效果是由操作系统决定的。
- **select**所以，同一个 select 元素，放到不同操作系统的电脑上会呈现不同的外观。
- `img、video、audio、大部分表单元素`都属于**可替换元素**

2. **非可替换元素**

- 非可替换元素就是指的普通元素，它具体在页面上呈现什么，完全由 CSS 来决定
