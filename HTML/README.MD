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

- 宽高的算法与 W3C 盒模型不同
- 在表格中的字体样式不会继承
- 可以设置行内元素宽高
- white-space:pre 会失效

> ### HTML5 新特性

| 分类                                    | 特性简述                                         |
| --------------------------------------- | ------------------------------------------------ |
| 语义标签 <font color=red>新增 💯</font> | header, section, article 等结构清晰              |
| 多媒体 <font color=red>新增 💯</font>   | video, audio 标签直接播放                        |
| 无障碍 <font color=red>加强 🤣</font>   | HTML5 在无障碍方面进行了加强，加入了无障碍属性。 |
| 表单 <font color=red>加强 🤣</font>     | 更丰富的**输入类型**和**验证功**能               |
| 存储 <font color=red>浏览器 😂</font>   | localStorage 和 sessionStorage                   |
| 图形 <font color=red>浏览器 😂</font>   | canvas 与 SVG 绘图能力                           |
| API <font color=red>浏览器 😂</font>    | 地理定位、拖拽、多线程、WebSocket                |

> ### 简述一下你对 HTML 语义化的理解。

- （1）使用语义化的标签来创建页面结构，如 header,footer,nav，从标签上即可以直观的知道这个标签的作用
- （2）HTML 语义化让页面的内容结构化 ➡️ 结构更清晰 ➡️ 利于开发和维护。而不是滥用 div；
- （3）搜索引擎的爬虫也依赖于 HTML 不同标签来确定不同的权重，有利于 SEO；

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

> ### script、script async 和 script defer 的区别

```html
<script src="script.js"></script>
<!-- 默认，同步加载，同步执行 -->
<script src="script.js" async></script>
<!-- 异步加载，立即执行 -->
<script src="script.js" defer></script>
<!-- 异步加载，DOMContentLoaded 前执行 -->
```

📊 对比表格：

| 特性         | `<script>`              | `<script async>`                                       | `<script defer>`      |
| ------------ | ----------------------- | ------------------------------------------------------ | --------------------- |
| 是否异步加载 | ❌ 否（同步）           | ✅ 是                                                  | ✅ 是                 |
| 是否阻塞渲染 | ✅ 是（阻塞 HTML 解析） | ❌ 否（不会阻塞）                                      | ❌ 否（不会阻塞）     |
| 脚本执行顺序 | 按写入顺序执行          | 谁先加载完谁先执行，不保证顺序                         | 按写入顺序执行        |
| 执行时机     | 立即执行                | 加载完立刻执行，中断渲染，执行这个脚本以后，再继续渲染 | 等 DOM 构建完毕后执行 |

---

## 🧠 通俗解释：

1. `<script>`

- 默认是**同步加载 + 同步执行**
- 在加载和执行脚本时，**浏览器会暂停解析 HTML**
- ❗ 可能阻塞页面加载

2. `<script async>`

- 是**异步加载**，但**加载完成后立即执行**
- **不保证执行顺序**
- 适合不依赖其他脚本的独立脚本（如统计、广告）

3. `<script defer>`

- 也是**异步加载**
- **等 DOM 构建完毕后再顺序执行**
- 最推荐的方式之一，适合放在 `<head>` 中而不阻塞 HTML 渲染

---

假设有以下 HTML：

```html
<script src="a.js"></script>
<script src="b.js" async></script>
<script src="c.js" defer></script>
```

- `a.js` 会**立即加载并执行**（阻塞后续 HTML）
- `b.js` 会**并行加载**，加载完立刻执行（可能在 `a.js` 前或后执行）
- `c.js` 会并行加载，但**等 HTML 解析完再按顺序执行**

---

> ### **块级元素**和**行级元素**

#### 常见块级元素：

- `<div>`
- `<p>`
- `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, `<h6>`
- `<section>`
- `<article>`
- `<header>`
- `<footer>`
- `<main>`
- `<ul>`, `<ol>`, `<li>`
- `<form>`
- `<table>`
- `<header>`, `<footer>`, `<nav>`

#### 特点：

1. **占据一整行**：块级元素会**自动换行**，并占满父元素的整个宽度。
2. **可以设置宽高**：你可以对块级元素设置 `width` 和 `height`。
3. **margin and padding: left and right and top and bottom 都可以使用**

> ### 常见行级元素：

- `<span>`
- `<a>`
- `<strong>`
- `<em>`
- `<b>`
- `<i>`
- `<img>`
- `<abbr>`
- `<code>`
- `<label>`
- `<q>`

##### 特点：

1. **不占满一整行**：行级元素不会强制换行，而是与其他元素**在同一行内显示**。
2. **无法设置宽高**：行级元素的**宽度和高度**由其**内容决定**，不能通过 `width` 或 `height` 来改变。
3. **margin and padding: left and right 可以使用 top and bottom 不可以使用**

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

# 💯💯💯 第二部分 html 面试题

---

> ### 加载图片的过程是怎样的？

**答：**

1. HTML 解析到 `<img>` 标签；
2. 发起**图片资源**请求；
3. 图片下载完成 ➡️ 解码 ➡️ 绘制到页面；

**补充**：图片解码在浏览器中是异步的，不会阻塞主线程。

> ### 加载失败如何处理？

**答：**

- 使用 `alt` 文本；
- 使用 JS 监听 `onerror`；

  ```html
  <img src="xxx.jpg" onerror="this.src='backup.jpg'" />
  ```

- 后端返回默认图片。

> ### 2️⃣ `<img>` 的常见属性有哪些？

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

## ⚙️ 二、性能优化篇

> ### 4️⃣ 图片太多，加载太慢怎么办？

**答：** 常见优化手段：

1. ✅ **懒加载（Lazy Load）**

   ```html
   <img src="..." loading="lazy" />
   ```

   或使用 IntersectionObserver。

2. ✅ **使用 CDN 加速**
3. ✅ **压缩图片（TinyPNG、ImageOptim）**
4. ✅ **图片格式优化（WebP、AVIF）**
5. ✅ **使用雪碧图（Sprite）** 减少 HTTP 请求。
6. ✅ **预加载关键图片**

   ```html
   <link rel="preload" as="image" href="banner.jpg" />
   ```

---

> ### 5️⃣ 图片懒加载原理？

**答：**

- 当图片进入视口（可见区域）时，才真正加载。
  实现方式：

```js
const imgs = document.querySelectorAll("img[data-src]");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  });
});
imgs.forEach((img) => observer.observe(img));
```

---

> ### 6️⃣ 响应式图片如何实现？

**答：**
有两种方式：

1. **`srcset + sizes`**

   ```html
   <img
     src="small.jpg"
     srcset="small.jpg 480w, medium.jpg 800w, large.jpg 1200w"
     sizes="(max-width: 600px) 480px, 800px"
   />
   ```

   浏览器会根据视口宽度自动选择合适的图片。

2. **`<picture>` 标签**

   ```html
   <picture>
     <source media="(min-width:800px)" srcset="large.jpg" />
     <img src="small.jpg" alt="demo" />
   </picture>
   ```

---

## 🎨 三、格式与编码篇

> ### 7️⃣ 常见图片格式区别？

| 格式                                 | 特点                 | 适用场景         |
| ------------------------------------ | -------------------- | ---------------- |
| **PNG** 🔧                           | 无损压缩，支持透明   | 图标、Logo       |
| **SVG** 🔧                           | 矢量图，可缩放       | 图标、Logo       |
| **JPEG/JPG** 🔨                      | 有损压缩，小体积     | 照片类图片       |
| **GIF** 🔨                           | 动图，最多 256 色    | 表情、动效       |
| **WebP** <font color=red> 新 </font> | 体积小、支持透明     | 现代 Web（推荐） |
| **AVIF** <font color=red> 新 </font> | 新一代格式，压缩更强 | 高性能网站       |

---

> ### 8️⃣ WebP 与 PNG 的区别？

**答：**

| 对比项     | WebP                                  | PNG          |
| ---------- | ------------------------------------- | ------------ |
| 压缩方式   | 有损 / 无损                           | 无损         |
| 透明度     | 支持                                  | 支持         |
| 动图       | 支持（WebP 动图）                     | 支持（APNG） |
| 文件大小   | 通常更小                              | 相对大       |
| 浏览器支持 | 新版 Chrome / Edge / Firefox / Safari | 全支持       |

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

> ### 🧩 四、Canvas / 图片处理篇

### 11️⃣ 如何使用 Canvas 压缩图片？

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

> ### 12 如何判断一张图片是否加载完成？

**答：**

```js
const img = new Image();
img.onload = () => console.log("加载完成");
img.onerror = () => console.log("加载失败");
img.src = "test.jpg";
```

---

> ### 13️ 图片跨域 Canvas 报错如何解决？

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

> ### 💡 五、开放题（常考思维题）

### 14️⃣ 如何实现一个图片懒加载组件？

考察点：

- IntersectionObserver
- React/Vue 组件封装
- loading 状态

---

> ### 15️⃣ 如果需要上传图片前进行压缩，你会怎么做？

考察点：

- FileReader 读取图片
- Canvas 画图 + toDataURL 输出
- Blob 转 File 再上传

---

> ### 16️⃣ 前端如何做图片优化策略？

**答：**

1. 格式优化（WebP、AVIF）
2. 分辨率自适应（响应式）
3. 懒加载
4. CDN 分发
5. 小图转 Base64
6. 关键图优先加载（preload）

#💯💯💯 第三部分 面试题 SEO

> ## 🧭 一、什么是 SEO？

**SEO（Search Engine Optimization）即“搜索引擎优化”**。
是指通过**对网站结构、内容、链接及技术优化**，
让网站在搜索引擎（如百度、Google）中的**自然排名更靠前**，
从而提升网站的**曝光率、点击率和访问量**。

---

> ## 🧩 二、SEO 的核心原理

搜索引擎（如 Google、Baidu）通过「**爬虫程序**」抓取网页内容，
然后根据<font color=red>算法</font>对网页进行**索引（Indexing）**和**排名（Ranking）**。
SEO 的目标:就是**让网页更容易被爬虫识别、理解和推荐**。

---

> ## 🚀 三、为什么 SEO 对网站至关重要？

| 原因                      | 说明                                                           |
| ------------------------- | -------------------------------------------------------------- |
| **1. 提升曝光和流量**     | 大多数用户通过搜索引擎访问网站，排名靠前的网站能获得更多访问。 |
| **2. 降低推广成本**       | 与付费广告相比，SEO 是一种长期、自然的引流方式。               |
| **3. 增强品牌可信度**     | 排名靠前的网站更容易获得用户信任。                             |
| **4. 提升用户体验（UX）** | SEO 优化往往伴随内容结构、性能优化，使网站更易用。             |
| **5. 改善网站结构**       | 有助于前后端分离项目的内容可爬取性（SSR、静态化）。            |

---

> ## 🧠 四、前端开发与 SEO 的关系（重点！）

虽然 SEO 看似是“运营或后端”的事，
但**前端工程师在 SEO 中起着关键作用**。
面试官最爱问这一块 👇

### 1️⃣ HTML 语义化结构（Semantic HTML）

使用正确的标签结构：

```html
<h1>文章标题</h1>
<p>内容段落</p>
<img src="image.jpg" alt="描述图片内容" />
```

> 帮助搜索引擎理解内容层次，识别关键信息。

---

### 2️⃣ Meta 标签优化

```html
<meta name="description" content="本网站提供高质量的前端教程与实战案例。" />
<meta name="keywords" content="HTML,CSS,JavaScript,前端开发" />
```

> 有助于搜索引擎在摘要中显示相关信息，提高点击率。

---

### 3️⃣ 合理的 URL 设计

- ✅ 推荐：`/article/javascript-basics`
- ❌ 不推荐：`/page?id=123`

> 语义化 URL 让搜索引擎更容易理解页面内容。

---

### 4️⃣ 图片优化（加 alt）

```html
<img src="/images/logo.png" alt="网站Logo" />
```

> 搜索引擎无法识别图片内容，`alt` 提供语义描述，有助于图片搜索收录。

---

### 5️⃣ SSR 或静态化（SEO 的关键技术点）

> 对于 **SPA 单页应用（如 Vue、React）**，前端渲染的页面内容可能在爬虫访问时还未生成。
> 因此需要：

- 使用 **SSR（服务端渲染）** 或 **静态预渲染**；
- 常见解决方案：`Next.js`、`Nuxt.js`、`React Helmet`。

---

### 6️⃣ 页面性能优化（影响 SEO 排名）

- 减少首屏加载时间；
- 使用懒加载；
- 图片压缩；
- 减少不必要的 JS；
- 使用 CDN；

> 搜索引擎排名算法中「性能」占很大权重（尤其是 Google）。

---

### 7️⃣ 移动端适配

> 移动端友好性（Mobile Friendly）是搜索引擎排名的关键因素之一。

---

## 🧮 五、总结一份面试回答（可直接背诵）

> SEO（搜索引擎优化）是通过优化网页结构、内容、Meta 信息、URL 设计等，使网页更容易被搜索引擎识别和收录，从而提升网站的自然排名和流量。
>
> 对网站而言，SEO 能显著提高曝光度、降低推广成本，并提升用户体验。
>
> 前端在 SEO 中的作用主要体现在：
>
> - 使用语义化的 HTML 结构；
> - 合理配置 `<title>`、`<meta>` 标签；
> - 添加图片的 `alt` 属性；
> - 优化性能和移动端体验；
> - 对 SPA 项目使用 SSR 或静态化生成内容。
>
> 在现代前端项目（如 React、Vue）中，SEO 仍然是影响流量与商业价值的关键因素。

> ### SEO 有哪些关键点？你在日常开发中，都采取了哪些措施来进行 SEO 呢？

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

---

## 📊 三、面试可用的“总结版回答模板”

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

# 面试题 4 other

> ### 请描述下 SEO 中的 TDK？

1. 在 SEO 中，所谓的 TDK 其实就是 title、description、keywords。

- **title**：浏览器上显示的那些内容，不仅用户能看到，也能被搜索引擎检索到，搜索引擎在抓取网页时，最
  先读取的就是网页标题，所以 title 是否正确设置极其重要。title 一般不超过 80 个字符，而且词语间要用
  英文“"隔开，因为计算机只对英语的敏感性较高，对汉语的敏感性不高。
- **description**：就是网页的内容摘要，这是对于一个网页的简要内容概况。description 一般不超过 150
  个字符，描述内容要和页面内容相关。
- **keywords**：主要作用是告诉搜索引擎本页内容是围绕哪些词展开的。因此 keywords 的每个词都要能在内
  容中找到相应匹配，才有利于排名。keywords 一般不超过 3 个，每个关键词不宜过长，而且词语间要用
  英文“”隔开，尽量将重要的关键字靠前放

> ### 什么是可替换元素，什么是非可替换元素，它们各自有什么特点？

1. **可替换元素是指**

- 这样一种元素，它在页面中的大部分展现效果不由 CSS 决定。
- 比如 img 元素就是一个可替换元素，它在页面中显示出的效果主要取决于你连接的是什么图片，图片是什么它就展示什么
- CSS 虽然可以控制图片的尺寸位置，但永远无法控制图片本身。
- select 元素也是一个典型的可替换元素，它在页面上呈现的是用户操作系统上的下拉列表样式，因此，它的展现效果是由操作系统决定的。
- 所以，同一个 select 元素，放到不同操作系统的电脑上会呈现不同的外观。
- `img、video、audio、大部分表单元素`都属于**可替换元素**

2. **非可替换元素**

- 非可替换元素就是指的普通元素，它具体在页面上呈现什么，完全由 CSS 来决定
