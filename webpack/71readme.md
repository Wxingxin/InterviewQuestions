

## 🔁 三、打包流程篇（进阶理解）

1. Webpack 打包时发生了哪些步骤？
2. Webpack 的依赖收集是如何实现的？

5. Webpack 的构建生命周期（Compilation、Compiler）是怎样的？
6. Webpack 如何解析模块路径？
7. 什么是 Chunk？什么是 Bundle？
8. Webpack 中的 Hash、ChunkHash、ContentHash 区别？
9. Webpack 构建时为什么会很慢？
10. 如何分析 Webpack 的打包性能瓶颈？



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

3. 如何提取公共代码（SplitChunksPlugin）？
4. 如何配置图片、字体等静态资源？
5. 如何使用 Babel 优化老旧浏览器兼容？
6. 如何在 Webpack 中开启 gzip 压缩？

8. 如何用 Webpack 实现 SSR（服务端渲染）？
9. 如何使用 Webpack 打包库（library）？

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
