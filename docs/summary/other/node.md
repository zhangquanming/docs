## 架构组成

Node.js 是一个构建在 Chrome 浏览器 `V8 引擎`上的 JavaScript 运行环境， 使用 **单线程**、**事件驱动**、**非阻塞 I/O** 的方式实现了高并发请求，`libuv` 为其提供了异步编程的能力。

<img :src="$withBase('/assets/nodejs.png')" alt="foo">

Node.js 底层框架由 **Node.js 标准库**、**Node bindings**、 **底层库**三个部分组成。

### Node.js 标准库

这一层是由 Javascript 编写的，也就是我们使用过程中直接能调用的 API，在源码中的 lib 目录下可以看到，诸如 `http`、`fs`、`events` 等常用核心模块

### Node bindings

这一层可以理解为是 javascript 与 C/C++ 库之间建立连接的桥， 通过这个桥，底层实现的 C/C++库暴露给 javascript 环境，同时把 `js 传入 V8`, 解析后交给 `libuv` 发起 `非阻塞 I/O`, 并等待 `事件循环` 调度；

### 底层库

- **V8**： Google 推出的 Javascript 虚拟机，为 Javascript 提供了在非浏览器端运行的环境；
- **libuv**：为 Node.js 提供了跨平台，线程池，事件池，异步 I/O 等能力，是 Nodejs 之所以高效的主要原因；
- **C-ares**：提供了异步处理 DNS 相关的能力；
- **http_parser、OpenSSL、zlib 等**：提供包括 http 解析、SSL、数据压缩等能力；

## IO(input/output)

- **阻塞 I/O**： 在发起 I/O 操作之后会一直阻塞着进程，不执行其他操作,直到得到响应或者超时为止；
- **非阻塞 I/O**：发起 I/O 操作不等得到响应或者超时就立即返回，让进程继续执行其他操作，但是要通过轮询方式不断地去 check 数据是否已准备好
- **多路复用 I/O**：又分为 select、pool、epool。最大优点就是单个进程就可以同时处理多个网络连接的 IO。基本原理就是 `select/poll` 这个 function 会不断的轮询所负责的所有 socket，当某个 socket 有数据到达了，就通知用户进程。而 epool 通过 callback 回调通知机制.减少内存开销,不因并发量大而降低效率,linux 下最高效率的 I/O 事件机制。
- **同步 I/O**：发起 I/O 操作之后会阻塞进程直到得到响应或者超时。前三者`阻塞 I/O`，`非阻塞 I/O`，`多路复用 I/O` 都属于同步 I/O。注意非阻塞 I/O 在数据从内核拷贝到用户进程时，进程仍然是阻塞的，所以还是属于同步 I/O。
- **异步 I/O**：直接返回继续执行下一条语句，当 I/O 操作完成或数据返回时，以事件的形式通知执行 IO 操作的进程。

## Koa 和 Express

- 中间件模型
  - koa2 的中间件是通过 `async await` 实现的，中间件执行顺序是 **“洋葱圈”** 模型，中间件之间通过 `next` 函数联系,当一个中间件调用 `next()` 后，会将控制权交给下一个中间件, 直到下一个中间件不再执行 `next()` 后, 将会沿路折返,将控制权依次交换给前一个中间件。
  - express 中间件一个接一个的顺序执行, 通常会将 response 响应写在最后一个中间件中
- express 自身集成了路由、视图处理等功能
  - koa 本身不集成任何中间件，需要配合路由、视图等中间件进行开发
- 异步流程控制
  - express 采用 `callback` 来处理异步
  - koa v1 采用 `generator`
  - koa v2 采用 `async/await`
- 错误处理
  - express 使用 `callback` 捕获异常，对于深层次的异常捕获不了
  - koa 使用 `try catch`，能更好地解决异步捕获
