## 🧱 一、基础概念篇（理解核心原理）

1. 什么是 Webpack？解决了哪些问题？
2. Webpack 的核心思想是什么？
3. Webpack 的主要组成部分有哪些？
4. Entry、Output、Loader、Plugin 的作用分别是什么？
5. Webpack 的打包流程是怎样的？
6. 什么是模块打包（Module Bundling）？
7. Webpack 默认支持哪些模块规范？
8. 什么是 AST？Webpack 构建中如何用到 AST？
9. 什么是依赖图谱（Dependency Graph）？
10. Webpack 和传统打包工具（如 Gulp、Rollup）有什么区别？

---

## ⚙️ 二、配置与用法篇（常见配置项）

1. Webpack 的 Entry 配置可以有哪些写法？
2. Output 的 filename 和 chunkFilename 区别是什么？
3. Loader 是如何工作的？
4. 常见的 Loader 有哪些？（如 babel-loader、css-loader、url-loader 等）
5. Plugin 与 Loader 的区别？
6. 常见的 Plugin 有哪些？
7. 如何配置 Webpack 的别名 alias？
8. Webpack 配置多入口多出口该如何实现？
9. Webpack 的 Mode 有哪几种？作用是什么？
10. Webpack 的配置文件是如何被解析和执行的？

---

## 🔁 三、打包流程篇（进阶理解）

1. Webpack 打包时发生了哪些步骤？
2. Webpack 的依赖收集是如何实现的？
3. Loader 的执行顺序是怎样的？（从右到左、从下到上）
4. Plugin 的执行原理？（基于 Tapable 的发布订阅机制）
5. Webpack 的构建生命周期（Compilation、Compiler）是怎样的？
6. Webpack 如何解析模块路径？
7. 什么是 Chunk？什么是 Bundle？
8. Webpack 中的 Hash、ChunkHash、ContentHash 区别？
9. Webpack 构建时为什么会很慢？
10. 如何分析 Webpack 的打包性能瓶颈？

---

## 🧩 四、性能优化篇（核心考点）

1. 如何优化 Webpack 的构建速度？
2. 如何优化 Webpack 的打包体积？
3. 什么是 Tree Shaking？实现原理？
4. Tree Shaking 有哪些局限性？
5. 什么是代码分割（Code Splitting）？
6. 如何配置动态导入（Dynamic Import）？
7. 如何开启持久化缓存（Persistent Caching）？
8. 如何利用 `externals` 优化构建？
9. 什么是懒加载（Lazy Loading）？
10. 如何减少重复代码和依赖？

---

## 💡 五、模块与依赖篇（机制与兼容）

1. Webpack 如何处理 ESModule 和 CommonJS 混用？
2. Webpack 是如何实现模块化加载的？
3. 什么是 HMR（热更新）？原理是什么？
4. Webpack 中 `require.context()` 的作用是什么？
5. Webpack 中的 `sideEffects` 属性有什么作用？
6. Babel 与 Webpack 的关系是什么？
7. 如何在 Webpack 中使用 TypeScript？
8. Webpack 中如何配置 polyfill？
9. Webpack 与 Node.js 的模块系统区别？
10. Webpack 打包后的代码是如何执行的？

---

## 🚀 六、进阶与实战篇（项目实用）

1. 如何在 Webpack 中配置环境变量？
2. 如何让 Webpack 支持 CSS/SCSS/LESS？
3. 如何提取公共代码（SplitChunksPlugin）？
4. 如何配置图片、字体等静态资源？
5. 如何使用 Babel 优化老旧浏览器兼容？
6. 如何在 Webpack 中开启 gzip 压缩？
7. 如何使用 Webpack 配置 React/Vue 项目？
8. 如何用 Webpack 实现 SSR（服务端渲染）？
9. 如何使用 Webpack 打包库（library）？
10. 如何在 Webpack 中集成 ESLint、Prettier？

---

## 🧠 七、调试与分析篇（高级优化）

1. 如何查看 Webpack 打包结果体积？
2. 如何使用 `webpack-bundle-analyzer`？
3. 如何调试 Webpack 构建过程？
4. 什么是 Source Map？有哪些类型？
5. 开发环境与生产环境的 Source Map 区别？
6. Webpack 中的缓存策略有哪些？
7. 如何排查依赖包重复打包？
8. 如何让 Webpack 输出详细日志？
9. 如何使用 Profile 查看性能瓶颈？
10. 如何减少首次构建与增量构建的时间？

---

## 🧩 八、原理与源码篇（高级必问）

1. Webpack 的核心架构是怎样的？
2. Compiler 和 Compilation 的区别？
3. Tapable 是做什么的？
4. Loader 的 Pitch 阶段是什么？
5. Plugin 如何通过 Hook 介入生命周期？
6. Webpack 打包时如何生成依赖图？
7. Webpack 的 AST 是如何生成的？
8. Tree Shaking 的底层是如何基于 ESModule 实现的？
9. Webpack 中的 Scope Hoisting 是什么？
10. Webpack 打包输出的 IIFE（自执行函数）做了什么？

---

## ⚙️ 九、与其他工具对比篇（常见延伸问题）

1. Webpack vs Vite 的区别？
2. Webpack vs Rollup 的区别？
3. 为什么 Webpack 构建慢，而 Vite 快？
4. Webpack 与 esbuild 的关系？
5. Webpack 如何与 SWC 配合使用？
6. Webpack5 相比 Webpack4 有哪些变化？
7. Webpack5 的 Module Federation 是什么？
8. Webpack 可以被替代吗？
9. 如何从 Webpack 迁移到 Vite？
10. Webpack 在现代前端中的定位是什么？

---

## 🧠 十、开放性与思维题（高频面试）

1. 如果让你从零搭建一个 Webpack 构建系统，你会怎么做？
2. 如果构建速度太慢，你会如何排查？
3. 如何设计一个自定义 Loader？
4. 如何设计一个自定义 Plugin？
5. 说说你项目中做过的 Webpack 优化？
6. 生产环境和开发环境的构建配置有哪些不同？
7. 如何配置 Webpack 支持多语言打包（国际化）？
8. 如何让 Webpack 支持热更新并保持状态？
9. Webpack 与前端微服务的关系？
10. Webpack 的未来发展趋势？


