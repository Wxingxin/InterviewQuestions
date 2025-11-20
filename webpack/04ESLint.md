下面我给你整理一份 **「Webpack + ESLint 面试题大全（附重点答案要点）」**，专门围绕“在 Webpack 项目中如何使用和设计 ESLint”。
你可以拿去当：复习提纲 / 面试题库 / 笔试题。

---

## 一、基础认知类

### 1. 为什么要在 Webpack 项目中使用 ESLint，而不是单独跑 ESLint？

**答题要点：**

* 保证 **构建过程 + 代码质量检查** 一体化：

  * 开发时 `webpack-dev-server` 一跑，错误立刻出现在终端或浏览器 overlay 中；
  * 构建失败可以阻止不合格代码进入产物。
* 避免“本地没跑 lint，代码已经打包上线”的情况；
* 统一入口：研发只需要执行 `npm run build / start`，不需要额外记 `npm run lint`（当然也可以保留单独 lint 脚本）。

---

### 2. Webpack 与 ESLint 之间的关系是什么？Webpack 本身会检查代码质量吗？

**答题要点：**

* Webpack：**模块打包工具**，核心是依赖解析和产物构建；
* ESLint：**静态分析工具**，检测语法错误和风格/潜在 bug；
* Webpack 本身不做代码质量检查，需要借助：

  * 以前的 `eslint-loader`（已废弃）
  * 现在推荐的 `eslint-webpack-plugin`。

---

## 二、接入方式与插件

### 3. 以前常用的 `eslint-loader` 现在怎样了？现在的推荐方案是什么？

**答题要点：**

* `eslint-loader` **已废弃**（deprecated），不建议再使用；
* 官方推荐使用 [`eslint-webpack-plugin`]：

  * 以插件的方式在构建时调用 ESLint；
  * 和 loader 相比，架构更清晰，维护更积极；
  * 支持缓存、并行等更完整的选项。

---

### 4. 请写出一个最简单的 `eslint-webpack-plugin` 集成代码示例。

**答题要点（简化代码即可）：**

```js
// webpack.config.js
const ESLintPlugin = require("eslint-webpack-plugin");

module.exports = {
  // ...
  plugins: [
    new ESLintPlugin({
      extensions: ["js", "jsx"] // 检查的文件后缀
    })
  ]
};
```

说明一下：

* 只要在 `plugins` 里 new 一下；
* 项目根目录需要有 `.eslintrc.*` 配置文件。

---

### 5. `eslint-webpack-plugin` 的常用配置项有哪些？分别有什么作用？

**答题要点：**

常见字段：

* `extensions`: 要检查的扩展名，如 `["js", "jsx", "ts", "tsx"]`
* `context`: 起始目录，如 `path.resolve(__dirname, "src")`
* `files`: 支持 glob，覆盖 `context` + `extensions` 的默认行为
* `cache`: 是否启用缓存，加快重复构建
* `emitWarning`: 把 ESLint 问题当作 warning 输出
* `emitError`: 把 ESLint 问题当作 error 输出
* `failOnError`: true 时，有 error 直接让 Webpack 构建失败（适合生产）
* `overrideConfigFile`: 指定 ESLint 的配置文件路径（不在默认位置时）

---

### 6. 在实际项目中，如何区分“开发环境”和“生产环境”对 ESLint 的策略？

**答题要点：**

常见做法：

* **开发环境（dev）**：

  * `emitWarning: true`
  * `failOnError: false`
  * 方便先跑起来，看页面再慢慢改 lint；
* **生产环境（prod）**：

  * `emitError: true`
  * `failOnError: true`
  * 有 lint error 直接打包失败，保证上线代码质量。

示例：

```js
const isProd = process.env.NODE_ENV === "production";

new ESLintPlugin({
  extensions: ["js", "jsx"],
  emitWarning: !isProd,
  failOnError: isProd,
  cache: true
});
```

---

## 三、Webpack 构建链路中的 ESLint 时机和影响

### 7. ESLint 在 Webpack 的构建流程中大致发生在什么时候？和 Babel / ts-loader 有关系吗？

**答题要点：**

* `eslint-webpack-plugin` 会在构建时，通过 Webpack 的钩子调用 ESLint：

  * 基本上是读取源文件、解析 AST、执行规则；
* 与 `babel-loader` 或 `ts-loader` **是不同阶段**：

  * ESLint 检查的是源代码；
  * Babel/TS 负责编译转换；
* 你可以把 ESLint 理解为 **一个单独的检查步骤**，和其它 loader/插件平行。

---

### 8. 如果一个文件既被 Babel 处理，又被 ESLint 检查，会不会重复浪费性能？如何优化？

**答题要点：**

* 它们的确都要解析代码为 AST 各自处理，这是成本；
* 优化思路：

  * 开启 ESLint 缓存 (`cache: true`)；
  * 设置 `context` / `files` 避免检查不必要的文件；
  * 在 CI 中使用 `eslint .` 单独跑检查，Webpack 中可以只在开发环境开 ESLint 插件；
  * 或者用 `lint-staged` 只 lint 改动的文件。

---

## 四、配置文件与规则组织

### 9. 在 Webpack 项目中常见的 ESLint 配置文件有哪些？你更推荐哪种？

**答题要点：**

* `.eslintrc.js`
* `.eslintrc.json`
* `.eslintrc.yaml`
* `package.json` 中的 `eslintConfig`

很多人更推荐 `.eslintrc.js`：

* 可写条件逻辑（根据 NODE_ENV 或是否是 monorepo 选择不同配置）；
* 对大型工程更灵活。

---

### 10. Webpack 中已经用 Babel 编译了 ES6+，ESLint 的 `parserOptions` 和 `env` 应该怎么配？

**答题要点：**

```js
// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  parserOptions: {
    ecmaVersion: 12, // 或 'latest'
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  // ...
};
```

注意：

* Webpack + Babel 只是运行时/打包层面的事；
* ESLint 自己还是需要知道“我能解析到哪个 ES 版本”“是否有 JSX”。

---

### 11. Webpack 项目里使用 React / TypeScript 时，ESLint 的 `parser` 和 `plugins` 要注意什么？

**答题要点：**

* React：

```js
plugins: ["react", "react-hooks"],
extends: [
  "plugin:react/recommended",
  "plugin:react-hooks/recommended"
]
```

* TypeScript：

```js
parser: "@typescript-eslint/parser",
plugins: ["@typescript-eslint"],
extends: ["plugin:@typescript-eslint/recommended"]
```

* 与 Webpack 没有直接关联，但都是同一个工程里的“前端基础设施”，需要配合使用。

---

## 五、性能与工程化

### 12. Webpack + ESLint 的性能问题如何优化？（构建很慢怎么办）

**答题要点：**

* 在 `eslint-webpack-plugin` 中开启 `cache: true`
* 限制 `context` / `files` 范围为 `src`，不要把 `dist` / `node_modules` 也扔进去；
* 在 dev 环境中：

  * 可以考虑关闭 `failOnError`，只输出 warning；
  * 有些项目干脆开发时不开 ESLint 插件，改用 `lint-staged` + IDE 实时提示；
* 在 CI 环境中：直接 `eslint .`，不必一定通过 Webpack 跑。

---

### 13. 你会如何在一个 Webpack 多入口或多包（monorepo）项目中复用 ESLint 配置？

**答题要点：**

* 方案一：项目根目录放单一 `.eslintrc.js`，所有子包共用；
* 方案二：写一个内部 npm 包，比如 `@company/eslint-config-webpack-app`，内部是：

```js
module.exports = {
  // 通用规则...
};
```

子项目中的 `.eslintrc.js`：

```js
module.exports = {
  extends: ["@company/eslint-config-webpack-app"]
};
```

* Webpack 的所有子配置（如多个 `webpack.*.js` 文件）都遵循这一套规则。

---

## 六、错误处理与实际问题

### 14. Webpack 构建时 ESLint 报错，但你希望“开发的时候不因为 lint 卡住”，如何配置？

**答题要点：**

在 `webpack.config.js` 中：

```js
new ESLintPlugin({
  emitWarning: true,
  failOnError: false
});
```

* emitWarning: 只作为警告输出；
* failOnError: 即使有 error，也先让构建继续。

---

### 15. 当 ESLint 与 Webpack 同时引入 Prettier 时，如何避免冲突？

**答题要点：**

1. 安装：

```bash
npm i -D prettier eslint-config-prettier eslint-plugin-prettier
```

2. 在 `.eslintrc.js` 里：

```js
extends: [
  "eslint:recommended",
  "plugin:react/recommended",
  "plugin:prettier/recommended" // 放在最后
]
```

* `eslint-config-prettier` 会关闭与 Prettier 冲突的 ESLint 规则；
* `eslint-plugin-prettier` 会把 Prettier 的格式化结果作为 ESLint 规则来报错。

3. Webpack 仍然通过 `eslint-webpack-plugin` 跑 ESLint，这时格式问题会一起显示在构建日志中。

---

### 16. 你在 Webpack 项目中遇到过哪些和 ESLint 集成相关的坑？怎么排查？

**可以从这些方向回答：**

* **坑 1：某些依赖下的源码被 ESLint 检查导致构建巨慢**

  * 解决：设定 `context: "src"` 或 `files: "src/**/*.{js,jsx}"`；
* **坑 2：ESLint 报“Parsing error: Unexpected token”**

  * 检查 parserOptions 是否支持当前语法；
  * 如果是 TS，则要替换 parser；
* **坑 3：VSCode 里显示的 ESLint 错误和 Webpack 输出不一致**

  * 确认 VSCode 使用的是本地 ESLint；
  * 确认 `.eslintrc` 和 Webpack 插件使用的是同一套配置文件。

---

## 七、开放性设计题（加分项）

### 17. 如果让你从零设计一个「Webpack + ESLint + Prettier + React」脚手架，你会如何安排这些工具的职责和边界？

**答题要点方向：**

* Webpack：打包、dev-server、HMR；
* Babel：转译语法、支持 JSX / TS；
* ESLint：代码质量 + 一部分风格（未被 Prettier 接管的部分）；
* Prettier：全权负责代码格式；
* 运行策略：

  * dev：Webpack 中开启 ESLint 插件（warning），VSCode + ESLint 插件 + 保存自修；
  * CI：单独跑 `npm run lint`，lint 不过直接 fail；
  * prod build：Webpack 中 `failOnError: true`。

---

### 18. 现在团队决定“旧代码先不强制修，新增/改动代码必须通过 ESLint”，结合 Webpack 你会怎么实施？

**答题要点方向：**

* 本质上和 Webpack 关系不大，主要是 git 流程设计：

  * 使用 `husky + lint-staged`，只对 staged 的文件跑 ESLint；
* Webpack 中可以继续保留 ESLint 插件，但只作为开发提示（不要 fail 构建）；
* 等存量问题慢慢消化完，再把 Webpack 里的 `failOnError` 打开。

---

如果你愿意，我可以在这套题的基础上再帮你：

* 按 **“初级 / 中级 / 高级 / 架构设计题”** 分类整理一份 Markdown 面试题；
* 或者根据你们公司实际的 Webpack 配置，帮你出一套 **带参考答案的笔试题**（比如让候选人改写一份 `webpack.config.js + .eslintrc.js`）。



下面我给你来一套 **“把 ESLint 一步步接到 Webpack 项目里的代码示例”**，从**最最简单**到**比较完善的项目级配置**，你可以按阶段抄着用。

> 下面以一个典型的 Webpack + Babel（可带 React）项目为例，目录大致像这样：

```text
project
├─ src
│  ├─ index.js / index.jsx
│  └─ ...
├─ webpack.config.js
├─ package.json
└─ ...
```

---

## 阶段 0：安装 ESLint（准备工作）

先在项目里装上 ESLint：

```bash
npm install -D eslint
# 或者 pnpm add -D eslint / yarn add -D eslint
```

你可以用交互式初始化：

```bash
npx eslint --init
```

如果不想一步步回答问题，下面的阶段我直接给你配置文件写法。

---

## 阶段 1：**最最简单** —— 纯命令行使用 ESLint（不接 Webpack）

先在项目根目录建一个最简 `.eslintrc.js`：

```js
// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module"
  },
  rules: {}
};
```

在 `package.json` 里加一个脚本：

```json
{
  "scripts": {
    "lint": "eslint src --ext .js,.jsx"
  }
}
```

现在你就可以这样用：

```bash
npm run lint
```

> 这个阶段：
>
> * **Webpack 完全没参与**。
> * ESLint 只是单独检查代码，适合先把规则搞定再接到打包链路里。

---

## 阶段 2：为 React / JSX 做好 ESLint 支持（仍然不接 Webpack）

如果你项目里有 React + JSX，可以补上对应配置。

### 1）安装 React/JSX 相关依赖

```bash
npm install -D eslint-plugin-react eslint-plugin-react-hooks
```

### 2）更新 `.eslintrc.js`

```js
// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    // 示例：不允许未使用变量
    "no-unused-vars": "warn",
    // 示例：React 组件必须首字母大写
    "react/jsx-pascal-case": "warn"
  }
};
```

`package.json` 的 `lint` 脚本不变：

```json
"scripts": {
  "lint": "eslint src --ext .js,.jsx"
}
```

> 到这一步：
>
> * ESLint 已经可以比较舒服地检查 React 代码了。
> * **但仍然没和 Webpack 集成**——构建成功与否不受 ESLint 影响。

---

## 阶段 3：**把 ESLint 接入 Webpack 构建（最简单的集成）**

历史上常用 `eslint-loader`，但它已经废弃了。现在推荐用 **`eslint-webpack-plugin`**。

### 1）安装 eslint-webpack-plugin

```bash
npm install -D eslint-webpack-plugin
```

### 2）在 `webpack.config.js` 中使用插件（最简单版）

```js
// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.jsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.[contenthash].js",
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: "babel-loader"
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    }),

    // 💡 这里就是把 ESLint 接入 Webpack 的最关键一行：
    new ESLintPlugin({
      extensions: ["js", "jsx"] // 检查这些后缀
    })
  ],
  devServer: {
    static: path.resolve(__dirname, "dist"),
    port: 3000,
    hot: true,
    open: true
  },
  devtool: "source-map"
};
```

> 现在：
>
> * 当你跑 `webpack-dev-server` 或 `webpack` 打包时，ESLint 会顺便跑。
> * 有错误会在终端/浏览器 overlay 里看到。
> * 这就是“最简单的 Webpack 集成版本”。

---

## 阶段 4：让 ESLint 变得“好用一点”的 Webpack 配置

在阶段 3 的基础上，我们给 `ESLintPlugin` 加点常用选项：

```js
// webpack.config.js
const ESLintPlugin = require("eslint-webpack-plugin");

module.exports = {
  // ... 省略其他配置
  plugins: [
    // ...HtmlWebpackPlugin 等其他插件

    new ESLintPlugin({
      extensions: ["js", "jsx"],
      emitWarning: true, // 开发环境只给 warning，不一定卡住构建
      failOnError: false, // 开发环境有 error 也先跑起来
      cache: true,        // 开启缓存，加快二次构建
      context: "src"      // 只检查 src 目录
      // overrideConfigFile: ".eslintrc.js" // 如需指定配置文件路径可加
    })
  ]
};
```

再配合 `.eslintrc.js` 一起工作。

> 小套路：
>
> * **开发环境**：`failOnError: false`，不阻塞开发。
> * **生产构建**可以单独开一个 `webpack.prod.js`，里头设 `failOnError: true`，保证打出的包是干净的。

---

## 阶段 5：比较“香”的完整项目配置（含：Webpack + ESLint + Prettier）

到了这一步，我们搞一个比较“实战”的组合版本。

### 1）额外安装 Prettier 相关包

```bash
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
```

### 2）升级 `.eslintrc.js` 成“较完善版本”

```js
// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",

    // 💄 把 Prettier 集成进来
    "plugin:prettier/recommended"
  ],
  plugins: ["react", "react-hooks", "prettier"],
  rules: {
    // 代码质量规则
    "no-unused-vars": "warn",
    "no-console": "off",

    // 让 Prettier 的结果当作 ESLint 规则来报错
    "prettier/prettier": "error"
  },
  settings: {
    react: {
      version: "detect"
    }
  }
};
```

同时在项目根目录放一个最简单的 `prettier.config.cjs` 或 `.prettierrc`：

```js
// prettier.config.cjs
module.exports = {
  singleQuote: true,
  semi: true,
  trailingComma: "none",
  printWidth: 100
};
```

### 3）Webpack 中 ESLint 插件用“略高级一点”配置

```js
// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

const isProd = process.env.NODE_ENV === "production";

module.exports = {
  mode: isProd ? "production" : "development",
  entry: "./src/index.jsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: isProd ? "js/[name].[contenthash].js" : "js/[name].js",
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    }),

    new ESLintPlugin({
      extensions: ["js", "jsx"],
      context: path.resolve(__dirname, "src"),
      cache: true,
      emitWarning: !isProd,   // 开发：只警告
      failOnError: isProd     // 生产：有 error 直接让构建失败
    })
  ],
  devtool: isProd ? "source-map" : "eval-cheap-module-source-map",
  devServer: {
    static: path.resolve(__dirname, "dist"),
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true
  }
};
```

### 4）在 package.json 里加上 lint 相关命令

```json
{
  "scripts": {
    "start": "webpack serve --config webpack.config.js",
    "build": "NODE_ENV=production webpack --config webpack.config.js",
    "lint": "eslint src --ext .js,.jsx",
    "lint:fix": "eslint src --ext .js,.jsx --fix"
  }
}
```

---


## 总结一下每个阶段在干嘛

* **阶段 1**：只是在项目里装 ESLint，手动 `npm run lint` 检查。
* **阶段 2**：支持 React / JSX，适合前端项目。
* **阶段 3**：用 `eslint-webpack-plugin` 把 ESLint 接进 Webpack 构建链路。
* **阶段 4**：针对 dev / prod 做不同策略（开发不阻塞，发布严格）。
* **阶段 5**：和 Prettier 整合成一个“比较好用”的工程级配置。
* **阶段 6**：配合 husky + lint-staged，形成完整的“提交即检查”闭环。

