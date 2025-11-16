
## 🧩 一、什么是 Loader？

> Loader 让 Webpack 能够识别和处理各种类型的文件（不仅仅是 JS）。
> Webpack 默认只理解 `.js` 文件，
> 通过 Loader 可以让它理解 `.css`、`.png`、`.vue`、`.ts`、`.jsx` 等等。

例如：

```js
{
  test: /\.css$/,
  use: ['style-loader', 'css-loader']
}
```

---

## 🧭 二、Loader 按功能分类总览

| 分类            | 作用                            | 示例 Loader                                                                    |
| ------------- | ----------------------------- | ---------------------------------------------------------------------------- |
| 🧱 1. 代码编译类   | 把新语法编译成浏览器可识别代码               | `babel-loader`, `ts-loader`, `vue-loader`, `jsx-loader`                      |
| 🎨 2. 样式处理类   | 解析 CSS / Less / Sass / Stylus | `css-loader`, `style-loader`, `sass-loader`, `less-loader`, `postcss-loader` |
| 🖼️ 3. 文件与资源类 | 处理图片、字体、视频等静态资源               | `file-loader`, `url-loader`, `asset/resource`                                |
| 🧰 4. 模板与结构类  | 处理 HTML、Pug、Handlebars、EJS 模板 | `html-loader`, `pug-loader`, `ejs-loader`                                    |
| 🔧 5. 优化与辅助类  | 代码校验、转换、国际化                   | `eslint-loader`, `json-loader`, `i18n-loader`, `thread-loader`               |
| ⚙️ 6. 特殊用途类   | 框架、热更新、调试                     | `vue-loader`, `react-hot-loader`, `source-map-loader`                        |

---

## 🧱 一类：代码编译类 Loader

| Loader                        | 功能               | 说明                                  |
| ----------------------------- | ---------------- | ----------------------------------- |
| **babel-loader**              | 把 ES6+ 转成 ES5    | 配合 `.babelrc` 或 `@babel/preset-env` |
| **ts-loader**                 | 编译 TypeScript 文件 | 依赖 `typescript`                     |
| **vue-loader**                | 解析 `.vue` 单文件组件  | Vue 项目核心 Loader                     |
| **jsx-loader / babel-loader** | 编译 React JSX 语法  | 搭配 Babel 一起使用                       |

📘 示例：

```js
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: 'babel-loader'
}
```

---

## 🎨 二类：样式处理类 Loader

| Loader             | 功能                        | 说明                 |
| ------------------ | ------------------------- | ------------------ |
| **style-loader**   | 把 CSS 以 `<style>` 注入 HTML | 通常放在 css-loader 之后 |
| **css-loader**     | 解析 `@import`、`url()` 等语法  | 必备                 |
| **postcss-loader** | 自动加前缀、兼容性处理               | 需配合 `autoprefixer` |
| **sass-loader**    | 编译 `.scss/.sass`          | 需安装 `sass`         |
| **less-loader**    | 编译 `.less`                | 需安装 `less`         |
| **stylus-loader**  | 编译 `.styl` 文件             | 需安装 `stylus`       |

📘 示例：

```js
{
  test: /\.scss$/,
  use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
}
```

---

## 🖼️ 三类：文件与资源类 Loader

| Loader                   | 功能                             | 说明                |
| ------------------------ | ------------------------------ | ----------------- |
| **file-loader**          | 把文件输出到输出目录                     | 返回 URL            |
| **url-loader**           | 小文件转为 Base64，大文件交给 file-loader | 依赖 file-loader    |
| **asset/resource**       | Webpack 5 内置替代 file-loader     | 直接输出资源文件          |
| **asset/inline**         | 内联资源为 Base64                   | 替代 url-loader     |
| **asset**                | 自动选择内联或资源文件（基于大小）              | Webpack 5 新特性     |
| **image-webpack-loader** | 压缩优化图片                         | 可与 file-loader 连用 |
| **svg-inline-loader**    | 把 SVG 变成内联内容                   | 方便修改样式            |

📘 示例：

```js
{
  test: /\.(png|jpg|gif|svg)$/,
  type: 'asset',
  parser: {
    dataUrlCondition: {
      maxSize: 8 * 1024 // 小于8kb的图片转Base64
    }
  }
}
```

---

## 🧰 四类：模板与结构类 Loader

| Loader                | 功能               | 说明             |
| --------------------- | ---------------- | -------------- |
| **html-loader**       | 处理 HTML 文件中的资源路径 | 支持 `<img src>` |
| **pug-loader**        | 编译 `.pug` 模板     | 依赖 pug         |
| **ejs-loader**        | 编译 EJS 模板        | 用于前端渲染         |
| **handlebars-loader** | 解析 Handlebars 模板 | 常用于静态页面生成      |

📘 示例：

```js
{
  test: /\.html$/,
  use: 'html-loader'
}
```

---

## 🔧 五类：优化与辅助类 Loader

| Loader            | 功能            | 说明                                     |
| ----------------- | ------------- | -------------------------------------- |
| **eslint-loader** | 代码语法检查        | Webpack 5 推荐改为 `eslint-webpack-plugin` |
| **json-loader**   | 加载 `.json` 文件 | Webpack 5 已内置                          |
| **thread-loader** | 多线程编译优化性能     | 通常配合 babel-loader 使用                   |
| **cache-loader**  | 缓存结果以提升构建速度   | 适合大型项目                                 |
| **i18n-loader**   | 国际化文件处理       | 配合语言包使用                                |

📘 示例：

```js
{
  test: /\.js$/,
  use: ['thread-loader', 'babel-loader']
}
```

---

## ⚙️ 六类：特殊用途类 Loader

| Loader                | 功能                | 场景              |
| --------------------- | ----------------- | --------------- |
| **source-map-loader** | 加载已有的 SourceMap   | 用于调试            |
| **react-hot-loader**  | 支持 React 热更新      | React 项目常用      |
| **vue-style-loader**  | Vue 专用 style 注入器  | 替代 style-loader |
| **raw-loader**        | 导入文件为字符串          | 例如 `.txt` 内容    |
| **markdown-loader**   | 把 Markdown 转 HTML | 文档站常用           |

📘 示例：

```js
{
  test: /\.md$/,
  use: ['html-loader', 'markdown-loader']
}
```

---

## 🧠 七、Loader 执行顺序与规则

1️⃣ **执行顺序**
多个 loader 时，执行顺序为：

> 从右到左（或从下到上）

```js
use: ['style-loader', 'css-loader', 'sass-loader']
```

实际执行：

> sass-loader → css-loader → style-loader

---

2️⃣ **test 匹配规则**

```js
{
  test: /\.css$/, // 正则匹配文件
  exclude: /node_modules/, // 排除
  include: path.resolve(__dirname, 'src'), // 仅包含
}
```

---

3️⃣ **常见优化技巧**

* 使用 `cache-loader` 或 `thread-loader` 提升性能
* 对大资源使用 `asset/resource` 替代旧 file/url-loader
* 对样式文件可用 `MiniCssExtractPlugin.loader` 抽离 CSS

---

## 🧩 八、常见 Loader 组合场景

| 场景           | 常用 Loader 组合                                                     |
| ------------ | ---------------------------------------------------------------- |
| 编译 JS (ES6+) | `babel-loader`                                                   |
| 编译 TS        | `ts-loader`                                                      |
| Vue 项目       | `vue-loader` + `vue-style-loader` + `css-loader`                 |
| React 项目     | `babel-loader` + `style-loader` + `css-loader`                   |
| 处理样式         | `style-loader` + `css-loader` + `postcss-loader` + `sass-loader` |
| 图片与字体资源      | `asset/resource` 或 `url-loader`                                  |
| 模板引擎         | `html-loader` + `pug-loader`                                     |
| 优化构建速度       | `thread-loader` + `cache-loader`                                 |

---

## 🧠 九、学习建议路线

| 阶段 | 目标           | 学习重点                                           |
| -- | ------------ | ---------------------------------------------- |
| 初级 | 会使用常见 loader | `babel-loader`, `css-loader`, `style-loader`   |
| 中级 | 能配置项目环境      | `postcss-loader`, `url-loader`, `html-loader`  |
| 高级 | 能构建工程模板      | `MiniCssExtractPlugin.loader`, `thread-loader` |
| 实战 | 完整前端打包系统     | 结合 `plugins`、`optimization`、`devServer`        |

---

## ✅ 十、总结表

| 分类  | 代表 Loader                                  | 作用             |
| --- | ------------------------------------------ | -------------- |
| 编译类 | babel-loader / ts-loader / vue-loader      | 把高级语法转换成浏览器可执行 |
| 样式类 | style-loader / css-loader / postcss-loader | 加载与处理样式文件      |
| 资源类 | file-loader / url-loader / asset           | 处理图片与字体        |
| 模板类 | html-loader / pug-loader                   | 解析模板文件         |
| 优化类 | eslint-loader / thread-loader              | 优化编译速度与质量      |
| 特殊类 | vue-style-loader / markdown-loader         | 框架或内容专用        |

---

是否希望我下一步帮你整理一份

> 💼「Webpack Loader + Plugin 对照速查表」
> （包含常见插件、使用场景、区别、配置示例）？
> 这能让你完整理解 Loader 与 Plugin 的区别与配合使用。
