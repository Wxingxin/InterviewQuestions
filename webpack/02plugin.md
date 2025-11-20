下面给你一份 **最全、最系统、最清晰的 webpack 常见 Plugins（插件）使用与配置大全**，包含作用、典型配置、使用场景以及面试答题模板。直接当成笔记使用即可 👇

---

# 🔥 一、Plugin 是什么？和 Loader 的区别？

面试必答：

> **Loader 用来处理单个文件，转换类型。Plugin 则用来执行更广泛的构建任务，例如压缩、优化、环境注入、生成 HTML、清空目录、分析打包等，是 webpack 的核心扩展机制。**

配置位置：

```js
module.exports = {
  plugins: [
    new PluginName(options)
  ]
}
```

---

# 🎯 二、最常用 Plugin 速查表（按重要程度排序）

| 插件                         | 作用                    |
| -------------------------- | --------------------- |
| HtmlWebpackPlugin          | 自动生成 HTML，自动引入 bundle |
| DefinePlugin               | 定义全局变量（注入环境变量）        |
| MiniCssExtractPlugin       | 抽离 CSS 成独立文件          |
| CleanWebpackPlugin         | 清理 dist 目录            |
| CopyWebpackPlugin          | 拷贝静态资源                |
| ProvidePlugin              | 自动加载全局变量，如 `$`、`_`    |
| HotModuleReplacementPlugin | 热更新模块                 |
| ESLintWebpackPlugin        | 代码检查                  |
| TerserWebpackPlugin        | JS 压缩                 |
| CssMinimizerPlugin         | CSS 压缩                |
| BundleAnalyzerPlugin       | 构建分析可视化               |
| CompressionWebpackPlugin   | 生成 Gzip 压缩包           |
| VueLoaderPlugin            | 解析 .vue 文件            |
| DefinePlugin               | 注入环境变量                |
| EnvironmentPlugin          | 环境变量简化写法              |
| IgnorePlugin               | 忽略不需要的模块              |

下面进入 **详细配置大全** 👇

---

# 🍀 三、常用 Plugins 详细使用

---

# 1️⃣ HtmlWebpackPlugin（最常用）

自动生成 HTML，自动注入打包产物。

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    })
  ]
}
```

---

# 2️⃣ DefinePlugin（注入环境变量）

用于注入静态变量，让前端可用 `process.env.XXX`。

```js
const { DefinePlugin } = require('webpack');

module.exports = {
  plugins: [
    new DefinePlugin({
      'process.env.API_URL': JSON.stringify('https://api.example.com')
    })
  ]
}
```

**面试高频**：DefinePlugin 在构建阶段进行静态替换。

---

# 3️⃣ EnvironmentPlugin（DefinePlugin 的简写版）

```js
const webpack = require('webpack')

plugins: [
  new webpack.EnvironmentPlugin(['NODE_ENV', 'API_URL'])
]
```

效果等同：

```js
'Dprocess.env.NODE_ENV'
```

---

# 4️⃣ MiniCssExtractPlugin（CSS 抽离）

生产环境从 JS 中分离 CSS 避免闪屏（FOUC）。

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css'
    })
  ]
}
```

loader 配合：

```js
{
  test: /\.css$/,
  use: [MiniCssExtractPlugin.loader, 'css-loader']
}
```

---

# 5️⃣ CleanWebpackPlugin（自动清理 dist）

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

plugins: [
  new CleanWebpackPlugin()
]
```

---

# 6️⃣ CopyWebpackPlugin（复制静态文件）

比如复制 public 的静态资源到 dist。

```js
const CopyWebpackPlugin = require('copy-webpack-plugin');

plugins: [
  new CopyWebpackPlugin({
    patterns: [
      { from: 'public', to: 'public' }
    ]
  })
]
```

---

# 7️⃣ ProvidePlugin（自动引入全局变量）

让模块里用 `$` 不需要写 `import $ from 'jquery'`。

```js
const webpack = require('webpack');

plugins: [
  new webpack.ProvidePlugin({
    $: 'jquery',
    _: 'lodash'
  })
]
```

---

# 8️⃣ HotModuleReplacementPlugin（HMR 热更新）

开发环境使用：

```js
const webpack = require('webpack')

plugins: [
  new webpack.HotModuleReplacementPlugin()
]
```

（webpack5 大多数场景已自动开启）

---

# 9️⃣ ESLintWebpackPlugin（代码检查）

```js
const ESLintPlugin = require('eslint-webpack-plugin');

plugins: [
  new ESLintPlugin({
    extensions: ['js', 'jsx', 'ts', 'tsx'],
    fix: true
  })
]
```

---

# 🔟 TerserWebpackPlugin （压缩 JS）

webpack5 production 默认开启，但可以自定义。

```js
const TerserWebpackPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserWebpackPlugin({
        parallel: true,
        extractComments: false
      })
    ]
  }
}
```

---

# 1️⃣1️⃣ CssMinimizerPlugin（压缩 CSS）

```js
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [
      new CssMinimizerPlugin()
    ]
  }
}
```

---

# 1️⃣2️⃣ BundleAnalyzerPlugin（打包体积可视化）

非常常用！

```js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

plugins: [
  new BundleAnalyzerPlugin()
]
```

运行后会在浏览器展示依赖图。

---

# 1️⃣3️⃣ CompressionWebpackPlugin（生成 .gz 文件）

服务器可直接 gzip 资源。

```js
const CompressionWebpackPlugin = require('compression-webpack-plugin');

plugins: [
  new CompressionWebpackPlugin({
    test: /\.(js|css|html|svg)$/,
    threshold: 10240
  })
]
```

---

# 1️⃣4️⃣ IgnorePlugin（忽略指定模块，减少体积）

例如忽略 moment.js 的本地化文件：

```js
new webpack.IgnorePlugin({
  resourceRegExp: /^\.\/locale$/,
  contextRegExp: /moment$/
})
```

可减少几百 KB。

---

# 1️⃣5️⃣ VueLoaderPlugin（解析 .vue 文件）

Vue 项目必须配置：

```js
const { VueLoaderPlugin } = require('vue-loader')

plugins: [
  new VueLoaderPlugin()
]
```

---

# 1️⃣6️⃣ DefinePlugin（再次强调）

面试会问：**webpack 如何区分开发/生产环境？**

一般用：

```js
new DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
})
```

---

# 🍎 四、常见组合方案

---

## 开发环境常用 Plugins

| 插件                         | 目的        |
| -------------------------- | --------- |
| HtmlWebpackPlugin          | 自动生成 html |
| HotModuleReplacementPlugin | 热更新       |
| DefinePlugin               | 注入环境变量    |
| ProvidePlugin              | 全局注入变量    |
| ESLintWebpackPlugin        | 代码检查      |

---

## 生产环境常用 Plugins

| 插件                       | 目的       |
| ------------------------ | -------- |
| MiniCssExtractPlugin     | 抽离 CSS   |
| CssMinimizerPlugin       | 压缩 CSS   |
| TerserWebpackPlugin      | 压缩 JS    |
| CleanWebpackPlugin       | 清理 dist  |
| CopyWebpackPlugin        | 拷贝静态资源   |
| CompressionWebpackPlugin | gzip 资源  |
| BundleAnalyzerPlugin     | 体积分析     |
| DefinePlugin             | 注入生产环境变量 |

---

# 🍉 五、面试高频问题：Plugin 和 Loader 区别？

回答模板：

> Loader 只处理某一类文件并返回处理结果，比如把 TS 变成 JS；
> Plugin 功能更广泛，在 webpack 构建生命周期中注入钩子，可以做压缩、环境注入、清理目录、生成 HTML、分析体积等。
> Loader 是“文件级转换”，Plugin 是“构建流程增强”。

---

# 📘 六、终极总结（背诵版）

> webpack 中常见 Plugin 包括：HtmlWebpackPlugin、DefinePlugin、MiniCssExtractPlugin、CleanWebpackPlugin、CopyWebpackPlugin、BundleAnalyzerPlugin、CompressionWebpackPlugin、ESLintWebpackPlugin、TerserWebpackPlugin、CssMinimizerPlugin 等。
> 它们分别负责自动生成 HTML、注入环境、抽离 CSS、清理目录、复制资源、分析打包、gzip 压缩、代码检查和 JS/CSS 的压缩优化。
> Plugin 的核心价值是通过 tapable 的生命周期钩子扩展打包构建流程，Loader 则只负责文件级别的内容转换。

---

如果你需要，我还可以整理一份 **webpack 配置模板（包含 loader + plugin 一整套）** 或 **webpack 面试题大全 + 答案**，你想要哪种？

# 💯💯💯 手写plugin

那咱们来整一个 **难度刚刚好、看起来很专业** 的 webpack 插件：
👉 **BuildInfoPlugin：自动生成 `build-info.json` 的插件**

功能：每次打包时在 `dist` 目录里生成一个 `build-info.json`，记录：

* 打包 hash
* 构建时间
* 所有产物的文件名 & 文件大小
  （还能可选在控制台打印一个简单的构建报告）

这个既不low（不是简单 `console.log` 插件），又不至于上来就是 AST、自动上传 OSS 那种复杂度，面试讲起来非常合适。

---

## 一、插件完整代码（BuildInfoPlugin.js）

你可以放在：`plugins/BuildInfoPlugin.js`

```js
// plugins/BuildInfoPlugin.js
const { validate } = require('schema-utils');

const schema = {
  type: 'object',
  properties: {
    filename: {
      type: 'string',
      description: '生成的构建信息文件名'
    },
    showLog: {
      type: 'boolean',
      description: '是否在控制台输出构建信息'
    }
  },
  additionalProperties: false
};

class BuildInfoPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {
    // 1. 校验配置，避免使用出错
    validate(schema, this.options, {
      name: 'BuildInfoPlugin'
    });

    const pluginName = BuildInfoPlugin.name;
    const { webpack } = compiler;
    const { RawSource } = webpack.sources;

    // 2. 监听 thisCompilation 钩子，拿到 compilation 对象
    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      // 3. 在处理资源阶段插入我们自己的逻辑（webpack5 写法）
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          stage: webpack.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE
        },
        (assets) => {
          // 4. 整理构建信息
          const buildInfo = {
            hash: compilation.hash,
            builtAt: new Date().toISOString(),
            assets: Object.keys(assets).map((name) => {
              const size = compilation.getAsset(name).source.size();
              return {
                name,
                size
              };
            })
          };

          const json = JSON.stringify(buildInfo, null, 2);
          const filename = this.options.filename || 'build-info.json';

          // 5. 往构建结果里“塞”一个新的虚拟文件
          compilation.emitAsset(
            filename,
            new RawSource(json)
          );

          // 6. 可选：在控制台简单打印一下信息
          if (this.options.showLog) {
            console.log(`\n[BuildInfoPlugin] emit ${filename}`);
            console.log(
              `[BuildInfoPlugin] assets count: ${buildInfo.assets.length}`
            );
          }
        }
      );
    });
  }
}

module.exports = BuildInfoPlugin;
```

---

## 二、webpack 中如何使用这个插件？

```js
// webpack.config.js
const path = require('path');
const BuildInfoPlugin = require('./plugins/BuildInfoPlugin');

module.exports = {
  // ... entry / output 等略
  plugins: [
    new BuildInfoPlugin({
      filename: 'meta/build-info.json', // 默认是 build-info.json
      showLog: true                     // 控制台打印构建信息
    })
  ]
};
```

打包后，你会在 `dist/meta/build-info.json` 里看到类似内容：

```json
{
  "hash": "4c7b5f0b7f9f5f15b8d2",
  "builtAt": "2025-11-19T03:12:45.123Z",
  "assets": [
    { "name": "main.abc123.js", "size": 10240 },
    { "name": "vendors~main.def456.js", "size": 523456 },
    { "name": "css/main.7890ab.css", "size": 20480 }
  ]
}
```

---

## 三、这段代码怎么在面试时“讲明白”？（话术模板）

> **面试官：你自己写过 webpack 插件吗？**

你可以这样回答，一层一层展开👇

---

### 1️⃣ 先讲清楚这个插件的功能（第一印象）

> 有自己写过一个 webpack 插件，叫 **BuildInfoPlugin**。
> 它的作用是在每次打包的时候，自动在输出目录里生成一个 `build-info.json`，里面记录这次构建的：
>
> * 打包的 `hash`
> * 构建时间
> * 所有产物的文件名和体积
>   这样方便排查问题或者给后端做版本信息展示。
>   插件还支持两个配置：输出文件名 `filename`，以及是否在控制台打印日志 `showLog`。

---

### 2️⃣ 说明你知道插件的基本结构

> webpack 插件本质上是一个带有 `apply(compiler)` 方法的对象，一般是一个 class：
>
> * 在 `constructor` 里接收 `options`；
> * 在 `apply` 里通过各种 hooks 去介入 webpack 的构建流程。

可以顺手指代码里这段：

```js
class BuildInfoPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {
    // ...
  }
}
```

---

### 3️⃣ 讲讲 options 校验（显示你“工程化思维”）

> 我用 `schema-utils` 对插件的 options 做了一层校验：
>
> * `filename` 要求是字符串；
> * `showLog` 是布尔值；
> * 不允许多余字段。
>   这样如果配置写错，构建时会有比较友好的错误提示。

引用下 schema：

```js
const schema = {
  type: 'object',
  properties: {
    filename: { type: 'string' },
    showLog: { type: 'boolean' }
  },
  additionalProperties: false
};

validate(schema, this.options, { name: 'BuildInfoPlugin' });
```

---

### 4️⃣ 核心：你怎么挂钩到 webpack 生命周期里的？

> 在 `apply` 里我用的是 `compiler.hooks.thisCompilation` 这个钩子，
> 它能拿到本次构建的 `compilation` 对象，然后在 `compilation` 上再去监听处理资源的阶段。

```js
compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
  compilation.hooks.processAssets.tap(
    {
      name: pluginName,
      stage: webpack.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE
    },
    (assets) => {
      // 这里就是我真正处理构建结果的地方
    }
  );
});
```

你可以顺便说一句：

> `processAssets` 是 webpack5 里的一个钩子，在这个阶段所有资源基本已经生成好了，我可以统计它们并且再新增一个资产（`build-info.json`）进去。

---

### 5️⃣ 怎么生成这个 `build-info.json`？

> 在 `processAssets` 回调里，我主要做了几件事：
>
> 1. 遍历 `assets`，用 `compilation.getAsset(name).source.size()` 获取每个文件的大小；
> 2. 结合 `compilation.hash` 和当前时间拼出一个 `buildInfo` 对象；
> 3. `JSON.stringify` 成字符串；
> 4. 用 `compilation.emitAsset(filename, new RawSource(json))` 把它塞进构建结果里。

对应代码：

```js
const buildInfo = {
  hash: compilation.hash,
  builtAt: new Date().toISOString(),
  assets: Object.keys(assets).map((name) => {
    const size = compilation.getAsset(name).source.size();
    return { name, size };
  })
};

const json = JSON.stringify(buildInfo, null, 2);
compilation.emitAsset(
  filename,
  new RawSource(json)
);
```

---

### 6️⃣ 提一下 `RawSource`，显得你知道 webpack 内置工具

> 这里我用的是 `compiler.webpack.sources.RawSource` 来创建一个“虚拟文件内容”，
> 这个是 webpack5 提供的统一的 source 类型，可以直接被当成一个 asset 输出。

```js
const { webpack } = compiler;
const { RawSource } = webpack.sources;
```

---

### 7️⃣ 提一下同步/异步（简单点到即可）

> 这个插件主要是同步逻辑，所以直接 `tap` 即可。如果要做异步操作，比如从远程接口拉配置、打包完自动上传到 OSS，可以换成 `tapPromise` 或 `tapAsync`，在里边返回 Promise 或调用 callback 就行。

---

### 8️⃣ 最后讲一下在项目里怎么用（落地）

> 实际使用时，就是在 `webpack.config.js` 里 `new BuildInfoPlugin(...)` 一下：
>
> ```js
> const BuildInfoPlugin = require('./plugins/BuildInfoPlugin');
>
> module.exports = {
>   plugins: [
>     new BuildInfoPlugin({
>       filename: 'meta/build-info.json',
>       showLog: true
>     })
>   ]
> };
> ```
>
> 打包后我可以在 `dist/meta/build-info.json` 里看到这次构建的 hash 和所有文件的体积，这对于排查线上问题、做版本页面或者排查包体积变化都挺方便的。

---

## 四、这一套的“难度级别”刚刚好

你这个插件里已经体现出不少关键点：

* 知道插件是 `class + apply(compiler)` 结构
* 用了 `schema-utils` 做参数校验
* 知道 `compiler` / `compilation` / `processAssets` 这些生命周期
* 知道用 `emitAsset` + `RawSource` 往构建结果里加新文件
* 还考虑了简单的配置项（`filename`、`showLog`）

对面试官来说：
👉 “确实自己写过插件，而且理解 webpack 生命周期，不是网上随便抄一个 `console.log` 插件。”

