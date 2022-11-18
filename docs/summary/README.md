### 前言

- ES6-ES12 新特性
- 单线程下的 JavaScript 异步模式执行机制，根治此类面试题
- JavaScript 处理异步任务的消息队列和事件循环，宏任务和微任务
- JavaScript 自有类型系统的不足和解决方案
- 常用设计模式

---

- Vue Router、Vuex 等 Vue.js 生态下主要库的实现原理、手写源码
- 理解虚拟 DOM 机制，掌握 Diff 算法的实现原理及工作过程
- 理解 Vue.js 的整体实现过程及相关源码、响应式机制、模板编译、组件实现机制
- 如何开发符合企业个性化需求的 Vue.js 组件库
- Vue3.0 新语法 reactive/ref/effect、组合式 API

---

- React 设计思想及优势，React fiber 的引入究竟对 react 有什么架构层面的影响
- React 框架下 Virtual DOM 实现原理与 Vue.js 框架的差异点
- React 框架中的调度算法： Fiber、requestIdleCallback API
- 大型 React 项目中的数据流管理方案 Redux 和 Mobx
- 理解 Redux 核心模块实现原理，掌握手写 Redux 核心模块源码
- 关于 React diff。react 的 diff 与 vue2 的 diff 有什么区别？与 vue3 呢？
- 关于 React schedule。 schedule 究竟以一个什么形式，什么规律来运行，中断和恢复呢？lane 解决了什么问题？

---

- Node 平台下核心机制：非阻塞 IO、EventLoop、消息队列
- Node 模块加载机制、第三方包机制、CommonJS 实现原理
- Node 平台下网络编程、TCP/IP 协议、HTTP 服务器搭建、Session 原理
- 多进程 Node 应用开发以及 Node 集群搭建、结合 Nginx 反向代理
- 关于 node eventloop。在 node 里，udp 和文件 api 任务什么区别吗？什么是快 io 什么是慢 io？nodejs 如何调度快慢 io 的？node10 之前的事件循环是怎么样的？libuv 是以一种什么样的趋向去调度 io 任务的？async task 的抽象是什么呢？什么是 tickcallback？
- 关于 node runtime。node 是怎么启动的？node 怎么 console 调试？console 什么时候注入 node 的？
- 关于 node addon。node_api 是一种什么抽象？jsvalue 为什么是 Object 的二级指针？cpp 和 js 层面的共享内存靠什么实现最为简单？ffi 是怎么实现的？
- 关于 v8。什么是 isolate？什么是 context？值的抽象？v8 是怎么管理内存的？怎么直接用 v8 api 写 node-addon？

---

- Babel 编译、Polyfill 等方案处理新特性兼容问题
- 使用 Webpack 实现前端项目模块化的实践方式
- Webpack 最核心的 Loader 和 Plugin 机制，开发自定义扩展
- 前端工程化的定义及组成，以及对现代前端的重要性
- 脚手架工具的设计思想和目标，掌握通用型脚手架的使用和扩展
- 如何设计并开发一款符合自己企业个性化需求的脚手架工具
- Monorepo、Yarn workspace、Lerna、Rollup、自动化测试
- 关于工程化。webpack5 是怎么做持久化储存的？mf 是怎么服务于微前端的，又是怎么解决 external 的问题的？mf 的原理是什么？hardsourceplugin 的原理是什么，它为什么这么快？lerna 的最佳实践？submodule 的最佳实践？webpack 和 gulp 怎么配合？tapable 究竟是什么抽象？

---

- 关于 js 优化。自己会熟练使用 js profiler 吗？甚至是否是从未使用过？做过 ms 级别的优化吗？自己问的问题是否真的需要在 js trick 层面进行优化？
- 关于 js-native 框架。知道 js 到 native 端的详细通信过程吗？做过 binding 吗？知道 jsbridge 的实现吗？知道怎么热更新吗？知道热更新的原理吗？知道怎么手写 js 引擎去做热更新吗？
- 浏览器。render object 的晋升过程？css 和 dom 的融会时机？slp 和 raf 的时机？什么是 rafwithtimeout，存在的意义？vsync 影响了什么？为什么不要为滚动增加事件监听？为什么要 eval(“debugger”)？
