## Fiber

React 的核心流程可以分为两个部分:

- reconciliation (**调度算法**，也可称为 render):
  - 更新 state 与 props；
  - 调用生命周期钩子；
  - 生成 virtual dom；
    - 这里应该称为 Fiber Tree 更为符合；
  - 通过新旧 vdom 进行 diff 算法，获取 vdom change；
  - 确定是否需要重新渲染
- commit:
  - 如需要，则操作 dom 节点更新；

要了解 Fiber，我们首先来看为什么需要它？

- **问题**: 随着应用变得越来越庞大，整个更新渲染的过程开始变得吃力，大量的组件渲染会导致主进程长时间被占用，导致一些动画或高频操作出现卡顿和掉帧的情况。而关键点，便是 **同步阻塞**。在之前的调度算法中，React 需要实例化每个类组件，生成一颗组件树，使用 **同步递归** 的方式进行遍历渲染，而这个过程最大的问题就是无法 **暂停和恢复**。

- **解决方案**: 解决同步阻塞的方法，通常有两种: **异步** 与 **任务分割**。而 React Fiber 便是为了实现任务分割而诞生的。

- **简述**:

  - 在 React V16 将调度算法进行了重构， 将之前的 stack reconciler 重构成新版的 fiber reconciler，变成了具有链表和指针的 **单链表树遍历算法**。通过指针映射，每个单元都记录着遍历当下的上一步与下一步，从而使遍历变得可以被暂停和重启。
  - 这里我理解为是一种 **任务分割调度算法**，主要是 将原先同步更新渲染的任务分割成一个个独立的 **小任务单位**，根据不同的优先级，将小任务分散到浏览器的空闲时间执行，充分利用主进程的事件循环机制。

- **核心**:

  - Fiber 这里可以具象为一个 **数据结构**:

  ```js
  class Fiber {
    constructor(instance) {
      this.instance = instance
      // 指向第一个 child 节点
      this.child = child
      // 指向父节点
      this.return = parent
      // 指向第一个兄弟节点
      this.sibling = previous
    }
  }
  ```

  - **链表树遍历算法**: 通过 **节点保存与映射**，便能够随时地进行 **停止和重启**，这样便能达到实现任务分割的基本前提；

    - 1、首先通过不断遍历子节点，到树末尾；
    - 2、开始通过 sibling 遍历兄弟节点；
    - 3、return 返回父节点，继续执行 2；
    - 4、直到 root 节点后，跳出遍历；

  - **任务分割**，React 中的渲染更新可以分成两个阶段:

    - **reconciliation 阶段**: vdom 的数据对比，是个适合拆分的阶段，比如对比一部分树后，先暂停执行个动画调用，待完成后再回来继续比对。
    - **Commit 阶段**: 将 change list 更新到 dom 上，并不适合拆分，才能保持数据与 UI 的同步。否则可能由于阻塞 UI 更新，而导致数据更新和 UI 不一致的情况。

  - **分散执行**: 任务分割后，就可以把小任务单元分散到浏览器的空闲期间去排队执行，而实现的关键是两个新 API: `requestIdleCallback` 与 `requestAnimationFrame`

    - 低优先级的任务交给 `requestIdleCallback` 处理，这是个浏览器提供的事件循环空闲期的回调函数，需要 pollyfill，而且拥有 deadline 参数，限制执行事件，以继续切分任务；
    - 高优先级的任务交给 `requestAnimationFrame` 处理；

  - **优先级策略**: 文本框输入 > 本次调度结束需完成的任务 > 动画过渡 > 交互反馈 > 数据更新 > 不会显示但以防将来会显示的任务

::: tip
Fiber 其实可以算是一种编程思想，在其它语言中也有许多应用(Ruby Fiber)。核心思想是 任务拆分和协同，主动把执行权交给主线程，使主线程有时间空挡处理其他高优先级任务。

当遇到进程阻塞的问题时，任务分割、异步调用 和 缓存策略 是三个显著的解决思路。
:::

## 生命周期

在新版本中，React 官方对生命周期有了新的 **变动建议**:

- 使用 `getDerivedStateFromProps` 替换 `componentWillMount` 与 `componentWillReceiveProps`；
- 使用 `getSnapshotBeforeUpdate` 替换 `componentWillUpdate`；
- 避免使用 `componentWillReceiveProps`;

其实该变动的原因，正是由于上述提到的 Fiber。首先，从上面我们知道 React 可以分成 reconciliation 与 commit 两个阶段，对应的生命周期如下:

- **reconciliation**:

  - `componentWillMount`
  - `componentWillReceiveProps`
  - `shouldComponentUpdate`
  - `componentWillUpdate`

- **commit**:

  - `componentDidMount`
  - `componentDidUpdate`
  - `componentWillUnmount`

在 Fiber 中，reconciliation 阶段进行了任务分割，涉及到 **暂停** 和 **重启**，因此可能会导致 reconciliation 中的生命周期函数在一次更新渲染循环中被 **多次调用** 的情况，产生一些意外错误。

```js
class Component extends React.Component {
  // 替换 `componentWillReceiveProps` ，
  // 初始化和 update 时被调用
  // 静态函数，无法使用 this
  static getDerivedStateFromProps(nextProps, prevState) {}

  // 判断是否需要更新组件
  // 可以用于组件性能优化
  shouldComponentUpdate(nextProps, nextState) {}

  // 组件被挂载后触发
  componentDidMount() {}

  // 替换 componentWillUpdate
  // 可以在更新之前获取最新 dom 数据
  getSnapshotBeforeUpdate() {}

  // 组件更新后调用
  componentDidUpdate() {}

  // 组件即将销毁
  componentWillUnmount() {}

  // 组件已销毁
  componentDidUnmount() {}
}
```

- **使用建议**:

  - 在 `constructor` 初始化 state；
  - 在 `componentDidMount` 中进行事件监听，并在 `componentWillUnmount` 中解绑事件；
  - 在 `componentDidMount` 中进行数据的请求，而不是在 `componentWillMount`；
  - 需要根据 props 更新 state 时，使用 `getDerivedStateFromProps(nextProps, prevState)`；

    - 旧 props 需要自己存储，以便比较；

    ```js
    public static getDerivedStateFromProps(nextProps, prevState) {
      // 当新 props 中的 data 发生变化时，同步更新到 state 上
      if (nextProps.data !== prevState.data) {
        return {
          data: nextProps.data
        }
      } else {
        return null1
      }
    }
    ```

  - 可以在 `componentDidUpdate` 监听 props 或者 state 的变化，例如:

  ```js
  componentDidUpdate(prevProps) {
    // 当 id 发生变化时，重新获取数据
    if (this.props.id !== prevProps.id) {
      this.fetchData(this.props.id);
    }
  }
  ```

  - 在 `componentDidUpdate` 使用 `setState` 时，必须加条件，否则将进入死循环；
  - `getSnapshotBeforeUpdate(prevProps, prevState)` 可以在更新之前获取最新的渲染数据，它的调用是在 render 之后， update 之前；
  - `shouldComponentUpdate`: 默认每次调用 `setState`，一定会最终走到 diff 阶段，但可以通过 `shouldComponentUpdate` 的生命钩子返回 `false` 来直接阻止后面的逻辑执行，通常是用于做条件渲染，优化渲染的性能。

## setState

11

## HOC(高阶组件)

11

## Redux

1

## React Hooks

1

## SSR

1

## 函数式编程

1
