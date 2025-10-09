非常棒 👍，这是前端中高频的一类面试题 —— **Vite 面试题大全（含详细解析与对比 Webpack）**。
我会分为三个层次帮你整理：
1️⃣ 基础原理题
2️⃣ 实际使用题
3️⃣ 进阶与源码题
并附上**简答思路 + 面试官关注点**，帮你快速拿高分。

---

## 🧩 一、基础原理篇

### 1. 什么是 Vite？为什么叫 Vite？

* **Vite** 是一种新型前端构建工具，
* 名字来源于法语「vite」，意为「快」。
* 目标是 **让前端开发更快、更轻量、更现代化**。

**考点**：理念——Vite 利用浏览器原生 ES 模块（ESM）支持，在开发阶段**无需打包**。

---

### 2. Vite 的工作原理是什么？

**回答结构**：

1. 开发阶段：

   * 直接利用浏览器原生 `ESM`。
   * 按需加载模块（只编译请求的文件）。
   * 使用 `esbuild` 预构建依赖（极快）。
2. 生产阶段：

   * 内部调用 `Rollup` 打包为可部署产物。

**一句话总结**：

> “Vite 开发时用 esbuild + ESM，生产时用 Rollup 打包。”

---

### 3. Vite 为什么启动速度快？

**原因**：

1. 不需要打包整个项目（按需加载）；
2. 依赖使用 `esbuild`（Go 写的，比 JS 快几十倍）；
3. 原生 ESM 支持让热更新粒度更小；
4. 启动时只转换当前页面依赖。

---

### 4. Vite 和 Webpack 的区别？

| 对比点   | Vite              | Webpack        |
| :---- | :---------------- | :------------- |
| 启动速度  | 几乎瞬间              | 随项目变大越来越慢      |
| 打包原理  | ESM 原生加载          | 依赖图 + 打包构建     |
| 依赖构建  | esbuild（快）        | JS 构建（慢）       |
| HMR   | 原生 ESM 级别热更新      | 模块替换机制较复杂      |
| 插件体系  | Rollup 插件 + 自定义钩子 | 自己的 Tapable 体系 |
| 生产构建  | 调用 Rollup         | 自身打包           |
| 配置复杂度 | 简单                | 复杂             |
| 生态    | 新，但在成长            | 成熟、插件丰富        |

---

### 5. 为什么 Vite 选择 Rollup 而不是 Webpack？

* Rollup 更适合 **ESM 格式打包**；
* 输出更干净（Tree-shaking 更彻底）；
* 插件机制与 Vite 开发期结构相容。

---

### 6. Vite 默认支持哪些语言？

* 原生支持：JS、TS、CSS、JSON、静态资源；
* 内置插件支持：Vue、React（通过官方插件）；
* 自动加载 `.env` 环境变量。

---

## ⚙️ 二、实战与配置篇

### 7. Vite 如何配置环境变量？

* 在项目根目录创建 `.env` 文件，例如：

  ```bash
  .env.development
  .env.production
  ```
* 使用 `VITE_` 前缀的变量才会被暴露到客户端：

  ```bash
  VITE_API_URL=https://api.example.com
  ```
* 在代码中访问：

  ```js
  import.meta.env.VITE_API_URL
  ```

---

### 8. 如何在 Vite 中实现代理请求（解决跨域）？

在 `vite.config.js` 中配置：

```js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'https://backend.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
}
```

---

### 9. Vite 的插件机制是怎样的？

* 基于 Rollup 插件体系；
* 支持自定义钩子（例如 `configResolved`, `transform`, `handleHotUpdate`）；
* 可同时兼容 Vite 独有功能（如 DevServer API）。

```js
export default function myPlugin() {
  return {
    name: 'my-plugin',
    transform(code, id) {
      if (id.endsWith('.js')) {
        return code.replace('__VERSION__', '1.0.0')
      }
    }
  }
}
```

---

### 10. Vite 如何实现 HMR（热更新）？

* 基于原生 ESM；
* 当文件变化时，只重新编译该模块；
* 浏览器仅重新加载受影响模块，而不是整页刷新；
* 内部通过 WebSocket 连接开发服务器。

---

### 11. Vite 如何配置别名？

```js
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
```

---

### 12. Vite 如何优化打包体积？

* 使用动态导入（`import()`）；
* 开启 Rollup Tree Shaking；
* 使用 `vite-plugin-compression`；
* 移除 console/log；
* 预构建公共依赖。

---

## 🧠 三、进阶与源码篇

### 13. Vite 中 esbuild 的作用是什么？

* **依赖预构建（pre-bundling）**；
* **TS / JSX 转译**；
* 极快的解析速度（Go 编译）；
* 替代 Babel 做部分编译工作。

---

### 14. Vite 为什么需要依赖预构建？

* 第三方包可能使用 CommonJS；
* 浏览器不识别 CJS；
* 所以 Vite 用 esbuild 预先转成 ESM；
* 同时减少网络请求数量。

---

### 15. 说一下 Vite 的构建流程

1. 读取配置文件；
2. 使用 `esbuild` 预构建依赖；
3. 启动本地服务；
4. 拦截浏览器请求；
5. 转换文件并返回；
6. 热更新文件；
7. 生产模式下调用 Rollup 打包。

---

### 16. Vite 与 esbuild、Rollup 的关系？

* **Vite** 是“统筹者”；
* **esbuild**：负责开发期的依赖编译；
* **Rollup**：负责生产期打包。

---

### 17. Vite 常见性能优化技巧？

* 使用 `optimizeDeps.include` 提前打包依赖；
* 使用懒加载和路由分块；
* 按需导入组件；
* 利用 CDN；
* 生产时开启 gzip/brotli 压缩。

---

### 18. Vite 有哪些常用插件？

| 插件                        | 功能           |
| :------------------------ | :----------- |
| `@vitejs/plugin-vue`      | 支持 Vue 文件    |
| `@vitejs/plugin-react`    | 支持 React JSX |
| `vite-plugin-compression` | gzip 压缩      |
| `vite-plugin-svg-icons`   | SVG 图标管理     |
| `vite-plugin-mock`        | 模拟后端接口       |
| `vite-plugin-inspect`     | 调试插件执行顺序     |
| `vite-plugin-pwa`         | PWA 支持       |

---

### 19. Vite 打包产物是什么结构？

* 默认输出到 `dist/`；
* 包含：

  ```
  dist/
  ├── assets/
  │   ├── index.[hash].js
  │   └── style.[hash].css
  └── index.html
  ```
* 所有资源文件会带 hash，支持缓存。

---

### 20. 如何在 Vite 中使用 TypeScript？

开箱即用，无需额外配置。
可以直接编写 `.ts` / `.tsx` 文件。
若需要类型检查，可额外使用：

```bash
npm install -D vite-plugin-checker
```

---

## 🚀 加分题：面试官常问

| 问题                          | 关键词提示                                                           |
| :-------------------------- | :-------------------------------------------------------------- |
| Vite 的 HMR 比 Webpack 快在哪？   | 模块级更新，不重编译全局依赖                                                  |
| Vite 如何处理第三方依赖？             | esbuild 预构建                                                     |
| 为什么 Vite 不完全用 esbuild 打包生产？ | Rollup 支持更多优化功能                                                 |
| Vite 支持 SSR 吗？              | 支持，有 `createServer` 和 `ssrLoadModule`                           |
| Vite 中的插件生命周期？              | config → buildStart → transform → handleHotUpdate → closeBundle |

---

是否希望我帮你整理一份

> ✅ 「Vite 面试题速记表（PDF版）」
> 可以直接打印或在面试前速读？

# vite的分包

这题属于前端性能优化 + Vite 原理类面试题 ✅，下面整理成面试易答版。

---

## 💡 1. 什么是 Vite 分包（Code Splitting）

> 分包是指将应用的代码拆分成多个小文件，按需加载，减少首屏加载体积，提高性能。

* Vite 基于 **ESM + Rollup** 实现按需分包。
* 常见场景：

  1. **动态 import** 按路由懒加载。
  2. **第三方库分包**（vendor chunk）。

---

## ⚙️ 2. Vite 分包实现原理

### 2.1 基于 Rollup 的静态分析

* Vite 使用 Rollup 做构建。
* Rollup 会分析模块依赖关系，生成 **依赖图**。
* 将公共依赖抽取成独立的 chunk（如 `vendor.js`）。

### 2.2 按需加载

* 对动态 `import()` 的模块，生成独立文件。

```js
// 路由懒加载示例
import { createRouter } from 'vue-router'

const routes = [
  { path: '/home', component: () => import('./views/Home.vue') },
  { path: '/about', component: () => import('./views/About.vue') }
]
```

* 打包后：

  * `/home` 对应 `home.[hash].js`
  * `/about` 对应 `about.[hash].js`
* 用户访问 `/home` 时只加载 `home.js`，减少首屏请求体积。

### 2.3 公共依赖抽取

* Vite 会将多个模块共同依赖的库打包成 **vendor chunk**：

```js
import _ from 'lodash'
import axios from 'axios'
```

* 这样多个页面共享 `lodash` 和 `axios`，避免重复打包。

---

## 🔹 3. 配置分包策略（vite.config.js）

```js
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // 把第三方库打成 vendor.js
          }
        }
      }
    }
  }
})
```

* `manualChunks`：手动指定分包逻辑。
* 动态 import 会自动拆分 chunk。

---

## 📝 4. 面试简答模板

> Vite 的分包是通过 Rollup 静态分析模块依赖生成多个 chunk 实现的。
> 核心点：
>
> 1. 动态 `import()` 按路由或模块拆分，实现懒加载；
> 2. 公共依赖抽取为 vendor chunk，避免重复打包；
> 3. 可通过 `rollupOptions.output.manualChunks` 配置自定义分包策略；
> 4. 目的：减少首屏请求体积，提高性能。
