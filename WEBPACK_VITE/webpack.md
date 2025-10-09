

## 🧩 一、Webpack 基础篇

### 1. 什么是 Webpack？解决了什么问题？

> Webpack 是一个 **静态模块打包工具**，把项目中的各种资源（JS、CSS、图片等）视为模块，构建依赖图后打包成浏览器可运行的文件。

**它解决的问题：**

* 模块化开发；
* 依赖管理；
* 浏览器兼容性；
* 性能优化（压缩、Tree Shaking、懒加载）。

---

### 2. Webpack 的核心概念有哪些？

| 核心概念   | 说明                           |
| ------ | ---------------------------- |
| Entry  | 入口，Webpack 从哪个文件开始打包         |
| Output | 出口，打包文件输出到哪里                 |
| Loader | 模块转换器，把非 JS 文件转成可识别模块        |
| Plugin | 插件，扩展 Webpack 功能（如压缩、注入环境变量） |
| Module | 每个文件都是一个模块                   |
| Chunk  | 多个模块组成的代码块                   |

---

### 3. Loader 和 Plugin 的区别？

| 对比 | Loader   | Plugin          |
| -- | -------- | --------------- |
| 作用 | 转换文件类型   | 扩展 Webpack 功能   |
| 时机 | 模块加载阶段   | 整个编译生命周期        |
| 写法 | 函数（链式执行） | 类（有 `apply` 方法） |


---

### 4. Webpack 的构建流程是什么？

**六大步骤：**

1. 初始化参数（读取配置文件、CLI 参数）
2. 创建 Compiler 对象
3. 从入口文件开始解析依赖
4. 调用 Loader 处理模块
5. 输出 Chunk → 打包成 Bundle
6. 触发 Plugin 生命周期钩子

📊 **一句话总结：**

> “Webpack 从入口构建依赖图，经过 Loader 转换、Plugin 扩展，最后输出打包产物。”

---

### 5. 常见的 Webpack Loader 有哪些？

| 类型    | Loader                                                     |
| ----- | ---------------------------------------------------------- |
| JS 编译 | `babel-loader`, `ts-loader`                                |
| 样式    | `css-loader`, `style-loader`, `sass-loader`, `less-loader` |
| 图片    | `url-loader`, `file-loader`, `image-webpack-loader`        |
| 其他    | `vue-loader`, `eslint-loader`                              |

---

### 6. 常见的 Webpack Plugin 有哪些？

| 插件                         | 功能              |
| -------------------------- | --------------- |
| `HtmlWebpackPlugin`        | 自动生成 HTML 并引入资源 |
| `DefinePlugin`             | 定义全局变量          |
| `MiniCssExtractPlugin`     | 抽离 CSS 文件       |
| `CleanWebpackPlugin`       | 清理打包目录          |
| `CopyWebpackPlugin`        | 拷贝静态资源          |
| `CompressionWebpackPlugin` | gzip 压缩         |
| `BundleAnalyzerPlugin`     | 打包体积分析          |

---

## ⚙️ 二、配置与优化篇

### 7. 如何优化 Webpack 构建速度？

1. **使用缓存：**

   * `cache: { type: 'filesystem' }`
   * Babel 缓存：`babel-loader?cacheDirectory`
2. **多进程构建：**

   * `thread-loader` / `parallel-webpack`
3. **分包策略：**

   * `SplitChunksPlugin`
4. **按需加载：**

   * 动态 `import()`
5. **忽略大型库：**

   * `externals`
6. **使用新版本 Node/Webpack**

---

### 8. 如何优化 Webpack 打包体积？

1. **Tree Shaking**（去除未使用代码）
2. **代码分割（Code Splitting）**
3. **压缩混淆：**

   * JS: `TerserPlugin`
   * CSS: `CssMinimizerPlugin`
4. **CDN 引入第三方库**
5. **图片压缩：** `image-webpack-loader`
6. **懒加载组件：** 动态 import

---

### 9. 什么是 Tree Shaking？

> Tree Shaking 是移除未被使用的代码的优化技术，依赖于 ES Module 的静态分析特性。

**要求：**

* 使用 ES6 模块语法；
* `mode: 'production'`；
* 配置 `"sideEffects": false`。

---

### 10. 什么是 Code Splitting（代码分割）？

> 将代码分成多个 Chunk 按需加载，提高首屏性能。

**实现方式：**

1. 多入口配置；
2. 动态导入：

   ```js
   import('./module').then(...)
   ```
3. `SplitChunksPlugin` 自动提取公共依赖。

---

### 11. 如何实现懒加载？

```js
button.onclick = () => {
  import('./module.js').then(({ default: fn }) => fn());
}
```

✅ Webpack 会自动生成一个新的 Chunk。

---

### 12. 什么是 HMR（热更新）？

> Hot Module Replacement — 在不刷新页面的情况下更新模块内容。

**原理：**

* Webpack DevServer 建立 WebSocket 连接；
* 文件变化 → 通知浏览器；
* 浏览器只替换变化的模块；
* 状态不丢失。

---

### 13. Webpack 中的 Source Map 是什么？

> Source Map 是一种映射文件，用来将打包后的代码对应回源代码。

**常用配置：**

```js
devtool: 'source-map'       // 生产环境
devtool: 'eval-source-map'  // 开发环境
```

---

### 14. Webpack 如何区分开发与生产环境？

```js
// webpack.config.js
mode: 'development'  // 或 'production'
```

**区别：**

* 开发：不压缩代码，保留 Source Map；
* 生产：自动 Tree Shaking + 压缩。

---

### 15. Webpack 如何实现文件指纹？

| 类型          | 方式             | 示例                        |
| ----------- | -------------- | ------------------------- |
| Hash        | 整个项目变动生成新 hash | `bundle.[hash].js`        |
| ChunkHash   | 每个入口单独计算       | `app.[chunkhash].js`      |
| ContentHash | 文件内容变化时变化      | `style.[contenthash].css` |

---

## 🧠 三、进阶与源码篇

### 16. Webpack 的打包原理？

**一句话描述：**

> Webpack 从入口文件出发，递归解析依赖，调用 Loader 转译模块，生成 Chunk，最后打包输出。

核心过程：

1. 解析依赖图；
2. 调用 Loader；
3. 生成模块对象；
4. 组装为 Chunk；
5. 写入 Bundle。

---

### 17. Webpack 的热更新原理（HMR）？

1. Webpack 编译文件；
2. DevServer 启动并注入 WebSocket；
3. 文件变化 → 通知浏览器；
4. 浏览器下载更新模块；
5. 执行替换逻辑，无需刷新。

---

### 18. Webpack 的 Plugin 原理？

* Plugin 是一个带有 `apply(compiler)` 方法的类；
* 通过 `compiler` 注册钩子；
* 在生命周期内执行自定义逻辑。

```js
class MyPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('MyPlugin', () => {
      console.log('Build done!');
    });
  }
}
```

---

### 19. Webpack 与 Vite 的区别？

| 对比项    | Webpack | Vite                   |
| ------ | ------- | ---------------------- |
| 核心原理   | 打包构建    | 原生 ESM                 |
| 启动速度   | 随项目变大变慢 | 几乎瞬间                   |
| 依赖处理   | 全量构建    | 按需加载                   |
| HMR 速度 | 慢       | 快                      |
| 构建工具   | 自身实现    | 开发 esbuild + 生产 Rollup |
| 生态     | 成熟      | 新兴                     |

---

### 20. Webpack5 的新特性？

✅ 模块联邦（Module Federation）
✅ 持久缓存（Persistent Caching）
✅ 内置资源模块（Asset Module）
✅ 更快的构建性能
✅ 自动 Tree Shaking

---

## 💡 四、加分题（高频深挖）

| 问题                                 | 考察点                     |
| ---------------------------------- | ----------------------- |
| Webpack 如何实现 Tree Shaking？         | 静态依赖分析 + sideEffects    |
| Loader 是如何工作的？                     | 从右向左执行，返回 JS 模块         |
| Plugin 的生命周期有哪些？                   | run, emit, done, seal 等 |
| Webpack 如何处理依赖图？                   | 使用 AST 递归构建             |
| Webpack 如何优化多页面应用？                 | 多入口 + SplitChunks       |
| Webpack5 的 Module Federation 有何用途？ | 微前端共享依赖                 |

---

## 🚀 附赠：面试官常问的“灵魂 5 连问”

1. Webpack 的构建流程能手写一遍吗？
2. HMR 的底层机制是什么？
3. Tree Shaking 为什么有时失效？
4. Loader 是如何链式执行的？
5. Webpack 如何实现按需加载？

---

是否希望我帮你整理一个 ✅ **「Webpack vs Vite 面试对比速查表（带图）」**？
可以让你在面试中 1 分钟高效回答对比题。
