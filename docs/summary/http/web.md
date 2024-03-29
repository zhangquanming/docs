## 跨标签页通讯

不同标签页间的通讯，本质原理就是去运用一些可以 **共享的中间介质**，因此比较常用的有以下方法:

- 通过父页面 `window.open()` 和子页面 `postMessage`

  - 异步下，通过 `window.open('about: blank')` 和 `tab.location.href = '*'`

- 设置同域下共享的 `localStorage` 与监听 `window.onstorage`

  - 重复写入相同的值无法触发
  - 会受到浏览器隐身模式等的限制

- 设置共享 `cookie` 与不断轮询脏检查( `setInterval` )

- 借助服务端或者中间层实现

## 浏览器架构

- 用户界面
- Browser 进程
- 第三方插件进程 （每种类型的插件对应一个进程，当使用该插件时才创建）
- GPU 进程 （该进程也只有一个，用于 3D 绘制等等）
- 内核（渲染进程 Renderer）
  - GUI 渲染线程
  - JS 引擎线程
    - 执行栈
  - 事件触发线程
    - 消息队列
      - 微任务
      - 宏任务
  - 异步 HTTP 线程
  - 定时器线程

## 事件循环(Event Loop)

事件循环是指: JS 引擎线程只会执行执行栈中的事件，执行栈中的代码执行完毕，就会读取事件队列中的事件并添加到执行栈中继续执行，这样反反复复就是我们所谓的事件循环(Event Loop)

- 宏任务 `macrotask(task)`:
  - 主代码块
  - setTimeout
  - setInterval
  - setImmediate - Node
  - requestAnimationFrame - 浏览器
- 微任务 `microtask(jobs)`:
  - process.nextTick () - Node
  - Promise.then()
  - catch
  - finally
  - Object.observe
  - MutationObserver

## 从输入 url 到展示的过程

- 查找缓存
- DNS 解析
- TCP 三次握手
- 发送请求，分析 url，设置请求报文(头，主体)
- 服务器返回请求的文件 (html)
- 关闭 TCP 连接：通过四次挥手释放 TCP 连接
- 浏览器渲染
  - HTML parser --> DOM Tree
    - 标记化算法，进行元素状态的标记
    - dom 树构建
  - CSS parser --> Style Tree
    - 解析 css 代码，生成样式树
  - attachment --> Render Tree
    - 结合 dom 树 与 style 树，生成渲染树
  - layout: 布局
  - GPU painting: 像素绘制页面

## 重绘与回流

当元素的样式发生变化时，浏览器需要触发更新，重新绘制元素。这个过程中，有两种类型的操作，即重绘与回流。

- **重绘(repaint)**: 当元素样式的改变不影响布局时，浏览器将使用重绘对元素进行更新，此时由于只需要 UI 层面的重新像素绘制，因此 **损耗较少**
- **回流(reflow)**: 当元素的尺寸、结构或触发某些属性时，浏览器会重新渲染页面，称为回流。此时，浏览器需要重新经过计算，计算后还需要重新页面布局，因此是较重的操作。会触发回流的操作:
  - 页面初次渲染
  - 浏览器窗口大小改变
  - 元素尺寸、位置、内容发生改变
  - 元素字体大小变化
  - 添加或者删除可见的 dom 元素
  - 激活 CSS 伪类（例如：:hover）
  - 查询某些属性或调用某些方法
    - clientWidth、clientHeight、clientTop、clientLeft
    - offsetWidth、offsetHeight、offsetTop、offsetLeft
    - scrollWidth、scrollHeight、scrollTop、scrollLeft
    - getComputedStyle()
    - getBoundingClientRect()
    - scrollTo()

回流必定触发重绘，重绘不一定触发回流。重绘的开销较小，回流的代价较高。

## 存储

我们经常需要对业务中的一些数据进行存储，通常可以分为 短暂性存储 和 持久性储存。

- 短暂性的时候，我们只需要将数据存在内存中，只在运行时可用
- 持久性存储，可以分为 浏览器端 与 服务器端
  - 浏览器:
    - `cookie`: 通常用于存储用户身份，登录状态等
      - `http` 中自动携带， 体积上限为 4K， 可自行设置过期时间
    - `localStorage / sessionStorage`: 长久储存/窗口关闭删除， 体积限制为 4~5M
    - `indexDB`
  - 服务器:
    - 分布式缓存 redis
    - 数据库

## Web Worker

现代浏览器为 `JavaScript` 创造的 **多线程环境**。可以新建并将部分任务分配到 `worker` 线程并行运行，两个线程可 **独立运行，互不干扰**，可通过自带的 **消息机制** 相互通信。

#### 基本用法:

```js
// 创建 worker
const worker = new Worker('work.js')

// 向 worker 线程推送消息
worker.postMessage('Hello World')

// 监听 worker 线程发送过来的消息
worker.onmessage = function (event) {
  console.log('Received message ' + event.data)
}
```

#### 限制:

- 同源限制
- 无法使用 `document` / `window` / `alert` / `confirm`
- 无法加载本地资源

## V8 垃圾回收机制

V8 的垃圾回收策略主要基于 **分代式垃圾回收机制**，根据根据**对象的存活时间**将内存的垃圾回收进行不同的分代，然后根据不同的分代采用不同的垃圾回收算法，其主要分成 **新生代空间** 和 **老生代空间**。

- **新生代空间**: 用于存活较短的对象
  - 又分成两个空间: from 空间 与 to 空间
  - Scavenge GC 算法: 当 from 空间被占满时，启动 GC 算法
    - 存活的对象从 from space 转移到 to space
    - 清空 from space
    - from space 与 to space 互换
    - 完成一次新生代 GC
- **老生代空间**: 用于存活时间较长的对象
  - 从 新生代空间 转移到 老生代空间 的条件
    - 经历过一次以上 Scavenge GC 的对象
    - 当 to space 体积超过 25%
  - **标记清除**: 标记存活的对象，未被标记的则被释放
  - **标记整理**: 将内存中清除后导致的碎片化对象往内存堆的一端移动，解决 **内存的碎片化**
  - **增量标记与惰性清理**
  - **并发回收**

## 内存泄露

- 意外的**全局变量**: 无法被回收
- **定时器**: 未被正确关闭，导致所引用的外部变量无法被释放
- **事件监听**: 没有正确销毁 (低版本浏览器可能出现)
- **闭包**: 会导致父级中的变量无法被释放
- **dom 引用**: dom 元素被删除时，内存中的引用未被正确清空
