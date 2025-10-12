好的，我帮你整理一份 **Node.js 面试题大全**，涵盖基础、模块、异步、性能、安全、调试等方面。内容分门别类，方便快速复习。

---

## **一、基础概念**

1. **Node.js 是什么？**

   * Node.js 是基于 **Chrome V8 引擎** 的 **JavaScript 运行环境**，用于服务器端开发。
   * 特点：单线程、事件驱动、非阻塞 I/O。

2. **Node.js 与前端 JS 的区别？**

   * Node.js 没有 DOM、BOM。
   * Node.js 支持文件系统、网络、进程等服务器 API。
   * 模块化机制不同：Node.js 使用 CommonJS / ES Modules。

3. **Node.js 单线程为什么能处理高并发？**

   * 事件循环 + 异步 I/O（非阻塞）
   * 单线程处理事件队列，I/O 操作由内核或线程池完成。

4. **事件循环（Event Loop）原理？**

   * phases：timers → pending callbacks → idle/prepare → poll → check → close callbacks
   * 微任务队列：`process.nextTick` > `Promise.then` > `queueMicrotask`

---

## **二、模块系统**

1. **CommonJS 与 ES Module 的区别？**

   | 特性    | CommonJS         | ES Module              |
   | ----- | ---------------- | ---------------------- |
   | 导出    | `module.exports` | `export`               |
   | 导入    | `require()`      | `import`               |
   | 执行方式  | 同步               | 异步（支持 tree-shaking）    |
   | 文件扩展名 | .js              | .mjs 或 "type":"module" |

2. **Node.js 如何实现模块加载？**

   * 模块缓存
   * 路径解析
   * require() → 读取文件 → 包装 → 执行 → 缓存

3. **__dirname 与 __filename 区别？**

   * `__dirname`：当前文件所在目录
   * `__filename`：当前文件完整路径

---

## **三、文件系统与流**

1. **fs.readFile 与 fs.createReadStream 区别？**

   * readFile：一次性读取整个文件（阻塞/异步）
   * createReadStream：流式读取，适合大文件

2. **stream 有哪些类型？**

   * Readable / Writable / Duplex / Transform / PassThrough
   * 常用于文件、HTTP、网络操作

3. **管道（pipe）原理？**

   * Readable → Transform → Writable
   * 事件驱动，减少内存消耗

---

## **四、异步与事件**

1. **process.nextTick 与 setImmediate 区别？**

   * nextTick：当前阶段微任务队列，优先执行
   * setImmediate：进入下一个事件循环阶段

2. **Promise、async/await 在 Node.js 中的应用**

   * 异步编程的主要方式
   * 错误捕获：`.catch()` / try...catch

3. **EventEmitter**

   * 基础事件注册/触发机制

   ```js
   const EventEmitter = require('events');
   const emitter = new EventEmitter();
   emitter.on('msg', data => console.log(data));
   emitter.emit('msg', 'hello');
   ```

---

## **五、HTTP 与网络**

1. **http.createServer 与 Express 区别？**

   * createServer：原生 Node.js HTTP 服务器
   * Express：封装路由、中间件、请求/响应工具

2. **Node.js 支持哪些协议？**

   * HTTP / HTTPS / TCP / UDP / WebSocket

3. **WebSocket 在 Node.js 中如何使用？**

   * `ws` 库，`socket.on('message', callback)`

---

## **六、性能优化**

1. **Node.js 如何处理高并发？**

   * 非阻塞 I/O
   * 单线程 + 事件循环
   * 使用集群（cluster 模块）或 PM2 多进程

2. **内存泄漏常见原因**

   * 全局变量未释放
   * 事件监听未移除
   * 缓存无限增长

3. **性能调优**

   * profiler、heap snapshot
   * stream 替代 buffer
   * 使用缓存（memory / redis）

---

## **七、安全相关**

1. **防止命令注入**

   * 使用 child_process.spawn 替代 exec
   * 参数化输入

2. **防止 XSS / CSRF**

   * 输入过滤
   * 使用中间件（helmet, csurf）

3. **环境隔离**

   * 不在生产环境暴露敏感信息（process.env）

---

## **八、调试与测试**

1. **调试方法**

   * Node 内置 `--inspect`
   * VSCode 调试
   * console.log / debugger

2. **单元测试**

   * 常用框架：Mocha / Jest / AVA
   * 异步测试需返回 Promise 或 done

---

## **九、进阶题目（面试高频）**

1. Node.js 的事件循环 + setTimeout / setImmediate / nextTick 执行顺序？
2. Node.js 如何处理 CPU 密集型任务？
3. cluster 与 child_process 区别？
4. Node.js 如何处理 uncaughtException 与 unhandledRejection？
5. Buffer 与 ArrayBuffer、TypedArray 区别？
6. 如何实现一个简单的模块热更新（HMR）？
7. Stream 的 backpressure 原理？

---

如果你愿意，我可以帮你整理一份 **Node.js 面试题思维导图**，
把 **基础/模块/异步/网络/性能/安全/调试** 全部可视化，面试复习更高效。

你希望我画吗？
