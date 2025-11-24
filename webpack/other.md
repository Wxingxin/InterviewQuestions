
> ###  Webpack 默认支持哪些模块规范？**

Webpack 默认支持：

- **CommonJS**（`require`, `module.exports`）
- **ES Module**（`import`, `export`）
- **AMD / UMD**

Webpack 内部会将这些模块规范**统一转换成**自己的**模块管理系统**，从而实现**跨模块规范**兼容。

> ### 如何使用 Webpack 配置 React项目

#### 1. 初始化项目

```bash
mkdir my-react-app
cd my-react-app

npm init -y   # 初始化 package.json
```

---

#### 2. 安装 React 和 Webpack 相关依赖

##### 运行时依赖（dependencies）

```bash
npm install react react-dom
```

##### 开发依赖（devDependencies）

```bash
npm install -D webpack webpack-cli webpack-dev-server
npm install -D @babel/core @babel/preset-env @babel/preset-react babel-loader
npm install -D html-webpack-plugin
npm install -D css-loader style-loader
```

> 说明：
>
> * **webpack / webpack-cli**：打包工具及命令行
> * **webpack-dev-server**：本地启动开发服务器 + 热更新
> * **babel-loader + @babel/preset-***：把 JSX/ES6 转成浏览器能跑的代码
> * **html-webpack-plugin**：帮你自动生成 `index.html` 并注入打包后的 JS
> * **css-loader / style-loader**：支持在 JS 中 `import './xxx.css'`

---

#### 3. 创建目录结构

建议这样：

```text
my-react-app
├─ src
│  ├─ index.js
│  └─ App.jsx
└─ public
   └─ index.html
```

##### `public/index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>My React App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

##### `src/App.jsx`

```jsx
import React from "react";

const App = () => {
  return <h1>Hello React + Webpack!</h1>;
};

export default App;
```

##### `src/index.js`

```jsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css"; // 如果需要样式

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

##### （可选）`src/index.css`

```css
body {
  margin: 0;
  font-family: Arial, sans-serif;
}
```

---

#### 4. 配置 Babel

可以用 `.babelrc` 或直接写在 `package.json` 里，这里用 `.babelrc`：

在项目根目录新建 `.babelrc`：

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

---

#### 5. 编写 `webpack.config.js`

在根目录新建 `webpack.config.js`：

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development", // 开发环境：development；上线打包可改为 production

  entry: "./src/index.js", // 入口文件

  output: {
    path: path.resolve(__dirname, "dist"), // 打包输出目录
    filename: "bundle.[contenthash].js",   // 输出文件名，带 hash 方便缓存
    clean: true                            // 每次打包清理 dist
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,          // 处理 .js / .jsx
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,           // 处理 css
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i, // 处理图片
        type: "asset/resource"
      }
    ]
  },

  resolve: {
    extensions: [".js", ".jsx"]   // import 时可以省略后缀
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html", // 模板 html
      filename: "index.html"
    })
  ],

  devtool: "source-map",          // 方便调试

  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist")
    },
    port: 3000,       // http://localhost:3000
    open: true,       // 自动打开浏览器
    hot: true,        // 热更新
    historyApiFallback: true // SPA 刷新不 404
  }
};
```

---

#### 6. 在 `package.json` 中配置脚本

打开 `package.json`，在 `"scripts"` 中加上：

```json
{
  "scripts": {
    "start": "webpack serve --config webpack.config.js --mode development",
    "build": "webpack --config webpack.config.js --mode production"
  }
}
```

---

#### 7. 运行项目

开发环境启动：

```bash
npm run start
```

浏览器自动打开 `http://localhost:3000`，能看到 “Hello React + Webpack!” 就成功了。

生产环境打包：

```bash
npm run build
```

生成的打包文件在 `dist/` 目录。

---

#### 8. 常见扩展

如果你以后需要：

* **支持 Sass**：安装 `sass-loader` + `sass`，在 rules 中加对 `.scss` 的处理
* **代码分割**：在路由或组件中使用 `React.lazy` + `import()`
* **环境变量**：用 `DefinePlugin` 或 `dotenv-webpack`

> ###  生产环境和开发环境的构建配置有哪些不同？

下面给你一份**Webpack 开发环境（development）与生产环境（production）构建配置的对比清单**，包含实际项目最常见的差异，并配有解释与示例，足够你直接用于工程实践。

---

# ✅ 一张总表：开发 vs 生产

| 项目                   | 开发环境（development）                        | 生产环境（production）                  |
| -------------------- | ---------------------------------------- | --------------------------------- |
| 构建速度                 | **快**，不做优化                               | **慢**，开启各种优化                      |
| Source Map           | **开启**（如 `eval-cheap-module-source-map`） | **可选开启**（如 `source-map`）          |
| 代码压缩                 | ❌ 不压缩                                    | ✔ JS/CSS 压缩（Terser/CSS-minimizer） |
| Tree Shaking         | ❌ 部分生效                                   | ✔ 完全启用（副作用分析）                     |
| Scope Hoisting（模块合并） | ❌ 默认无                                    | ✔ 默认开启                            |
| HMR 热更新              | ✔ 开启                                     | ❌ 关闭                              |
| CSS 输出方式             | style-loader 内联 CSS                      | mini-css-extract-plugin 抽离 CSS 文件 |
| 缓存（Contenthash）      | ❌ 不需要                                    | ✔ 全面开启                            |
| 环境变量                 | `mode: 'development'`                    | `mode: 'production'`（会自动开启优化）     |
| 资源优化                 | ❌ 不做                                     | ✔ 图片/字体等压缩                        |
| 冗余提示                 | ✔ 开发警告多                                  | ❌ 自动去除 development-only 代码        |

---

# 🔍 1. mode 不同触发的默认行为

### 开发

```js
mode: "development"
// 开启以下默认行为：
- 更快的构建速度
- 未压缩的输出
- 更友好错误提示
- 更快 eval 类 source-map
```

### 生产

```js
mode: "production"
// 自动启用：
- 代码压缩（Terser）
- Tree Shaking
- Scope hoisting
- 去除未使用代码
```

> 在 Webpack 中，仅 `mode` 就能改变许多底层优化行为。

---

# 🔍 2. Source Map 配置不同

### 开发首选

```js
devtool: "eval-cheap-module-source-map"
```

优点：构建非常快 + 错误定位准确。

### 生产可选（可关闭）

```js
devtool: "source-map"
```

优点：准确调试生产bug
缺点：会暴露源码，可以通过隐藏 Source Map URL 或单独上传到监控平台（Sentry）。

---

# 🔍 3. 开发环境需要 HMR（热更新），生产不需要

### 开发

```js
devServer: {
  hot: true,
  open: true,
}
```

### 生产

无 devServer，代码是静态部署。

---

# 🔍 4. CSS 处理方式完全不同

### 开发：使用 `style-loader`（将 CSS 注入 `<style>`）

```js
use: ["style-loader", "css-loader"]
```

### 生产：抽离 CSS 文件（更好缓存、减少 JS 体积）

```js
use: [MiniCssExtractPlugin.loader, "css-loader"]
plugins: [
  new MiniCssExtractPlugin({
    filename: "css/[name].[contenthash].css",
  })
]
```

---

# 🔍 5. 生产环境需要 Contenthash 做长期缓存

### 开发

```js
output: {
  filename: "[name].js"
}
```

### 生产

```js
output: {
  filename: "js/[name].[contenthash:8].js",
  chunkFilename: "js/[name].[contenthash:8].js",
}
```

保证用户更新时才下载新文件。

---

# 🔍 6. 生产环境 JS/CSS 压缩

Webpack 5 默认在 production 下启用 TerserPlugin，但你也可以自己配置：

```js
optimization: {
  minimize: true,
  minimizer: [
    new TerserPlugin({ extractComments: false }),
    new CssMinimizerPlugin(),
  ]
}
```

---

# 🔍 7. Tree Shaking / Scope Hoisting

### 生产默认启用，用于删除未使用代码：

```js
optimization: {
  usedExports: true,
}
```

### 配合 package.json

```json
{
  "sideEffects": false
}
```

---

# 🔍 8. 图片、字体、资源的优化差异

### 开发环境

* 不压缩图片
* 不进行太多 asset 优化

### 生产环境

* 使用 `image-minimizer-webpack-plugin` 压缩图片
* 清理文件（CleanWebpackPlugin）
* 更严格的 asset module 缓存策略

示例：

```js
plugins: [
  new ImageMinimizerPlugin({
    minimizer: {
      implementation: ImageMinimizerPlugin.imageminGenerate,
      options: {
        plugins: ["jpegtran", "optipng"],
      },
    },
  }),
]
```

---

# 🔍 9. 环境变量

### 开发

```js
new DefinePlugin({
  "process.env.NODE_ENV": JSON.stringify("development"),
})
```

### 生产

```js
new DefinePlugin({
  "process.env.NODE_ENV": JSON.stringify("production"),
})
```

框架（如 React/Vue）会自动去除开发用代码，比如 React DevTools 提示。

---

# 🔍 10. 配置文件组织方式

实际项目常见结构：

```
webpack/
  webpack.base.js
  webpack.dev.js
  webpack.prod.js
```

`webpack.dev.js`:

```js
module.exports = merge(baseConfig, {
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  devServer: { hot: true },
});
```

`webpack.prod.js`:

```js
module.exports = merge(baseConfig, {
  mode: "production",
  devtool: false,
  optimization: { minimize: true },
});
```

---

# 🎯 总结（记住以下 8 点即可）

生产相比开发多了：

1. **压缩代码（JS/CSS）**
2. **Tree shaking & Scope hoisting**
3. **抽离 CSS 文件**
4. **内容哈希（contenthash）缓存策略**
5. **图片资源优化**
6. **更慢但更准确的 source map（可关闭）**
7. **环境变量为 production**
8. **无热更新，无 devServer**

开发环境则侧重：

* **构建速度**
* **调试方便**
* **热更新**

