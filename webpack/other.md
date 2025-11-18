
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

