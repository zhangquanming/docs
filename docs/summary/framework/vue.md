## MVVM

`视图模型双向绑定（Model-View-ViewModel）`,也就是把 `MVC` 中的 `Controller` 演变成 `ViewModel`。`Model`层代表数据模型，`View`代表 UI 组件，`ViewModel` 是 `View` 和 `Model` 的桥梁，数据会绑定到 `ViewModel` 层并自动将数据渲染到页面中。视图变化的时候会通知 `ViewModel` 层更新数据。以前是操作 DOM 结构更新视图，现在是 `数据驱动视图`。

## nextTick

`nextTick` 主要使用了宏任务和微任务。 根据执行环境分别尝试采用 `Promise`、`MutationObserver`、`setImmediate`，如果以上都不行则采用 `setTimeout` 定义了一个异步方法，多次调用 `nextTick` 会将方法存入队列中，通过这个异步方法清空当前队列。
在下次 DOM 更新循环结束之后执行延迟回调，在修改数据之后立即使用 nextTick 来获取更新后的 DOM。
Vue 在更新 DOM 时是异步执行的。只要侦听到数据变化，Vue 将开启 1 个队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个 watcher 被多次触发，只会被推入到队列中一次。

::: tip
nextTick 主要使用了宏任务和微任务。 根据执行环境分别尝试采用 `Promise`、`MutationObserver`、`setImmediate`，如果以上都不行则采用 `setTimeout` 定义了一个异步方法，多次调用 nextTick 会将方法存入队列中，通过这个异步方法清空当前队列。
:::

## keep-alive 的实现

- 作用： 实现组件的缓存，保持组件的状态，以避免反复渲染导致的性能问题。需要缓存组件频繁切换，不需要重复渲染，如：tabs 标签页。
- 原理： `Vue.js` 内部将 `DOM` 节点抽象成一个个的 `Vnode` 节点，`keep-alive` 组件的缓存也是基于 `Vnode` 的而不是直接存储`DOM`结构。它将满足条件 `(pruneCache与pruneCache)` 的组件在 `cache` 对象中缓存起来，在需要重新渲染的时候在 `cache` 对象中取出再重新渲染。
  ::: tip
  nextTick 主要使用了宏任务和微任务。 根据执行环境分别尝试采用 `Promise`、`MutationObserver`、`setImmediate`，如果以上都不行则采用 `setTimeout` 定义了一个异步方法，多次调用 nextTick 会将方法存入队列中，通过这个异步方法清空当前队列。
  :::

## 生命周期

- `_init_`
  - `initLifecycle`/`Event`，往 vm 上挂载各种属性
  - `callHook`: `beforeCreated`: 实例刚创建
  - `initInjection`/`initState`: 初始化注入和 `data` 响应性
  - `created`: 创建完成，属性已经绑定， 但还未生成真实 `dom`
  - 进行元素的挂载： `$el` / `vm.$mount()`
  - 是否有 `template`: 解析成 `render function`
    - `.vue` 文件: `vue-loader` 会将`<template>`编译成 `render function`
  - `beforeMount`: 模板编译/挂载之前
  - 执行 `render function`，生成真实的 `dom`，并替换到 `dom tree` 中
  - `mounted`: 组件已挂载
- `update`
  - 执行 `diff` 算法，比对改变是否需要触发 UI 更新
  - `flushScheduleQueue`
    - `watcher.before`: 触发 `beforeUpdate` 钩子 - `watcher.run()`: 执行 `watcher` 中的 `notify`，通知所有依赖项更新 UI
  - 触发 `updated` 钩子: 组件已更新
- `actived` / `deactivated(keep-alive)` : 不销毁，缓存，组件激活与失活
- `destroy`
  - `beforeDestroy`: 销毁开始
  - 销毁自身且递归销毁子组件以及事件监听
    - `remove()`: 删除节点
    - `watcher.teardown()`: 清空依赖
    - `vm.$off()`: 解绑监听
  - `destroyed`: 完成后触发钩子

## 数据响应(数据劫持)

数据响应的实现由两部分构成: **观察者( watcher )** 和 **依赖收集器( Dep )**，其核心是 `defineProperty` 这个方法，它可以 **重写属性的 get 与 set 方法**，从而完成监听数据的改变。

- Observe (观察者)观察 `props` 与 `state`
  - 遍历 `props` 与 `state`，对每个属性创建独立的监听器( watcher )
- 使用 `defineProperty` 重写每个属性的 get/set(`defineReactive`）
  - `get`: 收集依赖
    - `Dep.depend()`
      - `watcher.addDep()`
  - `set`: 派发更新
    - `Dep.notify()`
    - `watcher.update()`
    - `queenWatcher()`
    - `nextTick`
    - `flushScheduleQueue`
    - `watcher.run()`
    - `updateComponent()`

## virtual dom 原理实现

- 创建 dom 树
- 树的 `diff`，同层对比
  - 没有新的节点，返回
  - 新的节点 `tagName` 与 `key` 不变， 对比 `props`，继续递归遍历子树
    - 对比属性(对比新旧属性列表):
      - 旧属性是否存在与新属性列表中
      - 都存在的是否有变化
      - 是否出现旧列表中没有的新属性
    - `tagName` 和 `key` 值变化了，则直接替换成新节点
- 渲染差异
  - 遍历 `patch`， 把需要更改的节点取出来
  - 局部更新 `dom`

## Proxy 相比于 defineProperty 的优势

- 数组变化也能监听到
- 不需要深度遍历监听

```js
let data = { a: 1 }
let reactiveData = new Proxy(data, {
  get: function (target, name) {
    // ...
  },
  // ...
})
```

## vue-router

- mode
  - `hash` ： hashchange
  - `history` ： popstate、pushState、replaceState
- 跳转
  - `this.$router.push()`
  - `<router-link to=""></router-link>`
- 占位
  - `<router-view></router-view>`

## vuex

- `state`: 状态中心
- `mutations`: 更改状态
- `actions`: 异步更改状态
- `getters`: 获取状态
- `modules`: 将 `state` 分成多个 `modules`，便于管理
