## 🧩 一、Vite 基础概念题

### 1. 什么是 Vite？

> **答：**
> Vite 是一个新一代前端构建工具。它利用 **原生 ES Modules（ESM）** 实现极速的开发启动，并在生产环境使用 **Rollup** 进行打包。

核心思想：

- 开发阶段不再进行打包，直接使用浏览器原生模块加载。
- 生产阶段使用 Rollup 进行打包优化。

---

### 2. Vite 的主要特点有哪些？

> **答：**

1. ⚡ **快速冷启动**：利用原生 ES 模块，无需打包。
2. 🔥 **热更新（HMR）快**：基于模块的 HMR。
3. 📦 **内置优化**：支持 TypeScript、JSX、CSS、PostCSS 等。
4. 🧠 **按需编译**：访问哪个文件编译哪个。
5. 🧰 **插件机制**：基于 Rollup 插件生态。
6. 🌐 **内置本地服务器**：基于 ESBuild + Node 实现。

---

### 3. Vite 和 Webpack 的区别？

| 对比项     | Vite                          | Webpack                |
| ---------- | ----------------------------- | ---------------------- |
| 启动方式   | 按需编译（原生 ESM）          | 打包后启动（bundle）   |
| 热更新速度 | 极快（ESM 局部更新）          | 较慢（需重新打包模块） |
| 构建工具   | 开发用 esbuild，生产用 Rollup | 开发与生产均用 Webpack |
| 配置复杂度 | 简洁，零配置可用              | 配置复杂               |
| 插件机制   | 基于 Rollup 插件              | 自有插件机制           |
| 冷启动速度 | 秒级                          | 随项目体积线性增长     |

---

### 4. Vite 默认支持哪些前端框架？

> Vue、React、Preact、Svelte、Lit、Vanilla JS/TS。

---

### 5. Vite 为什么快？

> **原因：**

1. 使用 **ESBuild（Go 编写）** 进行预构建，速度远超 JS。
2. **按需编译**，访问哪个文件才编译哪个。
3. **浏览器缓存** + **HTTP 头缓存策略**（304 + 强缓存）。
4. HMR 只替换变化模块，不重新打包。

---

## ⚙️ 二、Vite 原理与内部机制

### 6. Vite 的运行流程是什么？

> **答：**

1. 启动开发服务器（Dev Server）。
2. 对依赖（node_modules）进行 **esbuild 预构建**。
3. 浏览器访问时按需编译源代码（ESM 格式）。
4. 使用 HMR 更新修改模块。
5. 生产构建时调用 Rollup 打包优化。

---

### 7. Vite 为什么要用 ESBuild？

> **答：**
> ESBuild 用 Go 编写，比 JS 编译器快 **10~100 倍**，可用于：

- TS、JS、JSX 编译；
- 依赖预构建；
- 压缩（minify）；
- 转换 CommonJS → ESM。

---

### 8. Vite 的依赖预构建（Pre-Bundling）是什么？

> **答：**
> 在首次启动时，Vite 会使用 ESBuild 将 node_modules 中的包：

- 转换为 ESM 格式；
- 合并有依赖的模块；
- 缓存到 `node_modules/.vite` 中。

作用：

- 加快冷启动；
- 解决浏览器加载依赖过多的模块请求问题；
- 支持 CommonJS 模块。

---

### 9. Vite 如何实现 HMR？

> **答：**

1. Vite Dev Server 通过 **WebSocket** 与浏览器通信。
2. 当某个模块变动，Vite 仅重新编译该模块。
3. 通过 `import.meta.hot` API 通知浏览器替换模块，无需刷新页面。

---

### 10. 为什么 Vite 在开发模式不打包？

> **答：**
> 因为现代浏览器支持原生 ESM，Vite 可以让浏览器直接解析 `import`，不必提前打包。
> 只需在运行时根据请求按需返回模块即可。

---

## 🧩 三、配置与使用题

### 11. Vite 配置文件的名称是什么？

> `vite.config.js` 或 `vite.config.ts`

---

### 12. 如何在 Vite 中使用别名 alias？

```js
// vite.config.js
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
```

---

### 13. 如何在 Vite 中配置环境变量？

> `.env` 文件机制：

- `.env.development`
- `.env.production`

在代码中通过：

```js
import.meta.env.VITE_API_URL;
```

---

### 14. 如何自定义 Vite 插件？

> 插件系统遵循 Rollup 的机制，支持 hooks。

```js
export default function myPlugin() {
  return {
    name: "my-plugin",
    transform(code, id) {
      if (id.endsWith(".js")) {
        return code.replace("__REPLACE__", "Hello");
      }
    },
  };
}
```

---

### 15. 如何在 Vite 中使用代理？

```js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      rewrite: path => path.replace(/^\/api/, '')
    }
  }
}
```

---

## 🚀 四、生产环境与优化题

### 16. Vite 打包使用什么工具？

> 生产打包使用 **Rollup**，而不是 ESBuild。

---

### 17. 如何优化 Vite 的打包体积？

> 方法：

1. 使用动态 import（懒加载）。
2. 配置 `build.rollupOptions.output.manualChunks` 拆包。
3. 使用 `vite-plugin-compression` 进行 gzip/br 压缩。
4. 移除 console/log。
5. 开启缓存与 CDN。

---

### 18. 如何分析打包体积？

```bash
npm i rollup-plugin-visualizer -D
```

```js
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [visualizer()],
});
```

---

### 19. Vite 打包慢的常见原因？

- 第三方库过大（未拆分）；
- 未配置依赖预构建；
- 图片资源太多；
- 插件执行耗时；
- 生产环境中 source map 未关闭。

---

### 20. Vite 支持哪些 CSS 功能？

- PostCSS、CSS Modules
- CSS 预处理器（Sass / Less / Stylus）
- TailwindCSS 支持
- 原子化类库（如 UnoCSS）

---

## 🧠 五、原理与进阶题

### 21. 为什么 Vite 使用 Rollup 而不是 Webpack 打包？

> 因为 Rollup 打包产物更小、更优化，适合生产环境 Tree-shaking；
> Webpack 的 runtime 较大，适合大型工程开发阶段。

---

### 22. Vite 与 Esbuild 的关系？

> Vite = Dev 阶段用 Esbuild（预构建） + Prod 阶段用 Rollup（打包）。

---

### 23. Vite 的热更新是如何知道哪个模块变动的？

> 利用文件系统监听（chokidar）监听文件变化；
> 当文件更新，生成模块依赖图（Module Graph），
> 找到受影响模块 → 通过 HMR 更新浏览器。

---

### 24. Vite 的 Module Graph 是什么？

> 是一个记录模块之间依赖关系的图结构；
> 每个模块都有依赖信息，用于 HMR 更新与缓存。

---

### 25. 为什么 Vite 启动速度几乎不随项目体积增长？

> 因为：

- 启动不打包；
- 依赖预构建只执行一次；
- 源代码按需编译。

---

## 💡 六、常见实战题

### 26. Vite 项目如何接入 React？

```bash
npm create vite@latest my-app -- --template react
```

---

### 27. 如何在 Vite 中使用 TypeScript？

> Vite 原生支持 TS，只需 `.ts` 文件即可；
> 编译由 ESBuild 处理（仅转译，不类型检查）。

---

### 28. 如何在 Vite 中添加 ESLint / Prettier？

> 安装插件：

```bash
npm i vite-plugin-eslint -D
```

配置：

```js
import eslint from "vite-plugin-eslint";
export default defineConfig({
  plugins: [eslint()],
});
```

---

### 29. 如何在 Vite 中配置跨域 API？

> 使用 `server.proxy`，Vite 内置支持代理转发。

---

### 30. Vite 构建 SSR（服务端渲染）如何实现？

> 通过官方的 `vite-ssr` 或框架方案（如 `Nuxt 3` / `Next.js` / `SvelteKit`）。
> Vite 提供 `ssrLoadModule` API 支持 SSR 模式加载模块。

---

## 🧱 七、总结性问答

| 分类     | 重点问题                               |
| -------- | -------------------------------------- |
| 核心原理 | 为什么 Vite 不打包？依赖预构建的作用？ |
| 性能优化 | HMR 机制、按需编译、缓存策略           |
| 构建阶段 | 开发阶段用 Esbuild、生产阶段用 Rollup  |
| 实战技巧 | 环境变量、代理、别名、插件开发         |
| 框架支持 | React / Vue / TS / Tailwind 集成       |

---

要不要我帮你把这些面试题整理成一份 **「Vite 面试速记笔记 PDF」**（含图解 + 答案总结 + 高频题标注），方便你面试前背一遍？
