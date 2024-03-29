## 原型/构造函数/实例

- 原型 `(prototype)`: 一个简单的对象，用于实现对象的**属性继承**。在 Firefox 和 Chrome 中，每个 JavaScript 对象中都包含一个 `__proto__` (非标准)的属性指向它父类(该对象的原型)，可通过 `obj.__proto__` 进行访问。
- 构造函数: 可以通过 `new` 来**新建一个对象**的函数。
- 实例: 通过构造函数和 `new` 创建出来的对象，便是实例。 实例通过 `__proto__` 指向原型，通过 `constructor` 指向构造函数。

<img :src="$withBase('/assets/prototype_1.png')" alt="执行上下文的组成">

## 原型链

原型链是由原型对象组成，每个对象都有 `__proto__` 属性，指向了创建该对象的构造函数的原型，`__proto__` 将对象连接起来组成了原型链。是一个用来实现继承和共享属性的有限的对象链。

- **属性查找机制**: 当查找对象的属性时，如果实例对象自身不存在该属性，则沿着原型链往上一级查找，找到时则输出，不存在时，则继续沿着原型链往上一级查找，直至最顶级的原型对象 `Object.prototype`，如还是没找到，则输出 `undefined`；
- **属性修改机制**: 只会修改实例对象本身的属性，如果不存在，则进行添加该属性，如果需要修改原型的属性时，则可以用: `b.prototype.x = 2`；但是这样会造成所有继承于该对象的实例的属性发生改变。

## 执行上下文

执行上下文：指当前执行环境中的变量、函数声明，参数（arguments），作用域链，this 等信息。

#### 上下文类型

- 全局执行上下文
- 函数执行上下文
- `eval` 执行上下文

#### 上下文组成

- 变量对象(VO)
- 作用域链(词法作用域)
- `this` 指向
  <img :src="$withBase('/assets/ec_1.png')" alt="执行上下文的组成">

#### 生命周期

- **创建阶段**
  - 生成变量对象
    - 创建 arguments
    - 函数声明
    - 变量声明
  - 建立作用域链
  - 确定 this 的指向
- **执行阶段**
  - 变量赋值
  - 函数的引用
  - 执行其他代码

<img :src="$withBase('/assets/ec_2.jpg')" alt="执行上下文生命周期：">

#### 变量对象

变量对象，是执行上下文中的一部分，可以抽象为一种**数据作用域**，它存储着该执行上下文中的所有 **变量和函数声明(不包含函数表达式)** 。

::: tip
活动对象 (AO): 当变量对象所处的上下文为 active EC 时，称为活动对象。
:::

#### 执行过程

- 创建 **全局上下文** (global EC)。
- 全局执行上下文 (caller) 逐行**自上而下**执行。遇到函数时，**函数执行上下文** (callee) 被 `push` 到执行栈顶层。
- 函数执行上下文被激活，成为 active EC, 开始执行函数中的代码，caller 被挂起。
- 函数执行完后，callee 被 `pop` 移除出执行栈，控制权交还全局上下文 (caller)，继续执行。

## 作用域

执行上下文中还包含作用域链。理解作用域之前，先介绍下作用域。作用域其实可理解为该上下文中声明的 **变量和声明的作用范围**。可分为 **块级作用域** 和 **函数作用域**。

#### 特性:

- **声明提前**: 一个声明在函数体内都是可见的, 函数优先于变量。
- 非匿名自执行函数，函数变量为 **只读** 状态，无法修改。

```js
let foo = function () {
  console.log(1)
}
;(function foo() {
  foo = 10 // 由于foo在函数中只为可读，因此赋值无效
  console.log(foo)
})()

// 结果打印：  ƒ foo() { foo = 10 ; console.log(foo) }
```

## 作用域链

在执行上下文中访问到父级甚至全局的变量，这便是作用域链的作用。作用域链可以理解为一组对象列表，包含**父级和自身的变量对象**，因此我们便能通过作用域链访问到父级里声明的变量或者函数。

- 由两部分组成:
  - `[[scope]]` 属性: 指向父级变量对象和作用域链，也就是包含了父级的 `[[scope]]` 和 `AO`。
  - `AO`: 自身活动对象

因此 `[[scopr]]` 包含 `[[scope]]`，便自上而下形成一条**链式作用域**。

## 闭包

#### 什么是闭包？

闭包是指有权访问另一个函数作用域中的变量的函数。

#### 闭包原理

利用了函数作用域的特性，一个函数内部定义的函数会将外部函数的活动对象添加到他的作用域链中，函数执行完毕，其执行作用域链销毁，但因内部函数的作用域链仍然在应用这个活动对象，所以其活动对象不会被销毁。只有内部函数被销毁时才被销毁。

#### 优点

- 可以从内部函数访问外部函数作用域中的变量，且访问的变量长期驻扎在内存中，可供之后使用
- 避免变量污染全局
- 把变量存在独立的作用域，作为私有成员存在

#### 缺点

- 因长驻内存中，对内存有消耗。使用不当会导致内存泄漏
- 对处理速度具有负面影响。闭包的层级决定了引用的外部变量在查找时经过的作用域链长度

#### 应用场景

- 模块封装，在各模块规范出现之前，都是用这样的方式防止变量污染全局。
- 在循环中创建闭包，防止取到意外的值。
- 闭包的应用场景非常多，只要用到了函数柯里化的地方就有闭包的身影，比如防抖节流、定时器、惰性处理等

## script 引入方式

- html 静态 `<script>` 引入。
- js 动态插入 `<script>` 。
- `<script defer>` : 延迟加载，元素解析完成后执行。
- `<script async>` : 异步加载，但执行时会阻塞元素渲染。

## 对象的拷贝

- 浅拷贝: 以赋值的形式拷贝引用对象，仍指向同一个地址，**修改时原对象也会受到影响**。

  - `Object.assign`
  - 展开运算符(...)

- 深拷贝: 完全拷贝一个新对象，**修改时原对象不再受到任何影响**。
  - JSON.parse(JSON.stringify(obj)): 性能最快。
    - 具有循环引用的对象时，报错。
    - 当值为函数、undefined、或 symbol 时，无法拷贝。
  - 递归进行逐一赋值。

## new 运算符的执行过程

- 新生成一个对象。
- 链接到原型: `obj.__proto__ = Con.prototype`。
- 绑定 `this`: `apply`。
- 返回新对象(如果构造函数有自己 retrun 时，则返回该值)。

## instanceof 原理

能在实例的 **原型对象链** 中找到该构造函数的 `prototype` 属性所指向的 **原型对象**，就返回 true。

即:

```js
// __proto__: 代表原型对象链
instance.[__proto__...] === instance.constructor.prototype

// return true
```

## 代码的复用

当你发现任何代码开始写第二遍时，就要开始考虑如何复用。一般有以下的方式:

- 函数封装
- 继承
- 复制 `extend`
- 混入 `mixin`
- 借用 `apply/call`

## 继承

在 JS 中，继承通常指的便是 **原型链继承**，也就是通过指定原型，并可以通过原型链继承原型上的属性或者方法。

- 原型链继承：内存空间是共享的，实例之间相互影响。
- 构造函数继承：无法复用父类原型属性和方法，缺少复用性。
- 组合是继承：共享父类原型方法与属性，但是调用两次构造函数。
- 原型式继承：子类构建时无法向父类传参，私有引用属性共享。
- 寄生式继承： 原型式继承加强版，缺点类同。
- 寄生组合式：集各模式所长, 总体来说就是解决了 组合模式 两次调用父类构造方法的弊端，减少子类父类属性 重复的问题，减少了内存占用。
- 最优化：圣杯模式

```js
var inherit = (function (c, p) {
  var F = function () {}
  return function (c, p) {
    F.prototype = p.prototype
    c.prototype = new F()
    c.uber = p.prototype
    c.prototype.constructor = c
  }
})()
```

- 使用 ES6 的语法糖 `class / extends`

## 类型转换

JS 中在使用运算符号或者对比符时，会自带隐式转换，规则如下:

- -、\*、/、% ：一律转换成数值后计算
- +：
  - 数字 + 字符串 = 字符串， 运算顺序是从左到右
  - 数字 + 对象， 优先调用对象的 `valueOf` -> `toString`
  - 数字 + `boolean/null` -> 数字
  - 数字 + `undefined` -> `NaN`
- `[1].toString() === '1'`
- `{}.toString() === '[object object]'`
- `NaN !== NaN` 、`+undefined` 为 `NaN`

## 类型判断

判断 Target 的类型，单单用 typeof 并无法完全满足，这其实并不是 bug，本质原因是 JS 的万物皆对象的理论。因此要真正完美判断时，我们需要区分对待:

- 基本类型(`null`): 使用 `String(null)`。
- 基本类型(`string / number / boolean / undefined`) + `function`: 直接使用 `typeof` 即可。
- 其余引用类型(`Array / Date / RegExp Error`): 调用 `toString` 后根据 `[object XXX]` 进行判断。

### typeof

```js
console.log(typeof 1) // number
console.log(typeof true) // boolean
console.log(typeof 'mc') // string
console.log(typeof Symbol) // function
console.log(typeof function () {}) // function
console.log(typeof console.log()) // undefined
console.log(typeof []) // object
console.log(typeof {}) // object
console.log(typeof null) // object
console.log(typeof undefined) // undefined
```

优点：能够快速区分基本数据类型

缺点：不能将 Object、Array 和 Null 区分，都返回 object

### instanceof

```js
console.log(1 instanceof Number) // false
console.log(true instanceof Boolean) // false
console.log('str' instanceof String) // false
console.log([] instanceof Array) // true
console.log(function () {} instanceof Function) // true
console.log({} instanceof Object) // true
```

优点：能够区分 Array、Object 和 Function，适合用于判断自定义的类实例对象

缺点：Number，Boolean，String 基本数据类型不能判断

### Object.prototype.toString.call()

```js
var toString = Object.prototype.toString
console.log(toString.call(1)) //[object Number]
console.log(toString.call(true)) //[object Boolean]
console.log(toString.call('mc')) //[object String]
console.log(toString.call([])) //[object Array]
console.log(toString.call({})) //[object Object]
console.log(toString.call(function () {})) //[object Function]
console.log(toString.call(undefined)) //[object Undefined]
console.log(toString.call(null)) //[object Null]
```

优点：精准判断数据类型

缺点：写法繁琐不容易记，推荐进行封装后使用

很稳的判断封装:

```js
let class2type = {}
'Array Date RegExp Object Error'.split(' ').forEach((e) => (class2type['[object ' + e + ']'] = e.toLowerCase()))

function type(obj) {
  if (obj == null) return String(obj)
  return typeof obj === 'object' ? class2type[Object.prototype.toString.call(obj)] || 'object' : typeof obj
}
```

## 模块化

模块化开发在现代开发中已是必不可少的一部分，它大大提高了项目的可维护、可拓展和可协作性。通常，我们 **在浏览器中使用 ES6 的模块化支持，在 Node 中使用 commonjs 的模块化支持**。

- 分类:

  - es6: `import / export`
  - commonjs: `require / module.exports / exports`
  - amd: `require / defined`(依赖前置)
  - cmd: (依赖就近)

- `require` 与 `import` 的区别:
  - `require` 支持 动态导入，`import` 不支持，正在提案 (babel 下可支持)。
  - `require` 是 同步 导入，`import` 属于 **异步** 导入。
  - `require` 是 **值拷贝**，导出值变化不会影响导入值；`import` 指向 **内存地址**，导入值会随导出值而变化。

## 防抖与节流

防抖与节流函数是一种最常用的 **高频触发优化方式**，能对性能有较大的帮助。

- **防抖 (debounce)**: 将多次高频操作优化为只在最后一次执行，通常使用的场景是：用户输入，只需再输入完成后做一次输入校验即可。

```js
function debounce(fn, wait, immediate) {
  let timer = null

  return function () {
    let args = arguments
    let context = this

    if (immediate && !timer) {
      fn.apply(context, args)
    }

    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(context, args)
    }, wait)
  }
}
```

- **节流(throttle)**: 每隔一段时间后执行一次，也就是降低频率，将高频操作优化成低频操作，通常使用场景: 滚动条事件 或者 resize 事件，通常每隔 100~500 ms 执行一次即可。

```js
function throttle(fn, wait, immediate) {
  let timer = null
  let callNow = immediate

  return function () {
    let context = this,
      args = arguments

    if (callNow) {
      fn.apply(context, args)
      callNow = false
    }

    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(context, args)
        timer = null
      }, wait)
    }
  }
}
```

## 函数执行改变 this

由于 JS 的设计原理: 在函数中，可以引用运行环境中的变量。因此就需要一个机制来让我们可以在函数体内部获取当前的运行环境，这便是 `this`。

要明白 `this` 指向，其实就是要搞清楚 函数的运行环境，实际就是谁调用了函数。例如:

- `obj.fn()`，便是 `obj` 调用了函数，既函数中的 `this === obj`
- `fn()`，这里可以看成 `window.fn()`，因此 `this === window`

但这种机制并不完全能满足我们的业务需求，因此提供了三种方式可以手动修改 `this` 的指向:

- `call: fn.call(target, 1, 2)`
- `apply: fn.apply(target, [1, 2])`
- `bind: fn.bind(target)(1,2)`

## ES6/ES7

由于 Babel 的强大和普及，现在 ES6/ES7 基本上已经是现代化开发的必备了。通过新的语法糖，能让代码整体更为简洁和易读。

- 声明
  - `let / const`: 块级作用域、不存在变量提升、暂时性死区、不允许重复声明
  - `const`: 声明常量，无法修改
- 解构赋值
- `class / extend`: 类声明与继承
- `Set / Map`: 新的数据结构
- 异步解决方案:
  - `Promise` 的使用与实现
  - `generator` :
    - yield: 暂停代码
    - next(): 继续执行代码
  - `await / async`: 是 `generator` 的语法糖， babel 中是基于 `promise` 实现

## AST

**抽象语法树 (Abstract Syntax Tree)**，是将代码逐字母解析成 **树状对象** 的形式。这是语言之间的转换、代码语法检查，代码风格检查，代码格式化，代码高亮，代码错误提示，代码自动补全等等的基础。

## babel 编译原理

Babel 是一个 JavaScript 编译器，是一个工具链，主要用于将采用 ECMAScript 2015+ 语法编写的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。

- babylon 将 ES6/ES7 代码解析成 AST
- babel-traverse 对 AST 进行遍历转译，得到新的 AST
- 新 AST 通过 babel-generator 转换成 ES5

`Babel` 的功能很纯粹，它只是一个编译器。大多数编译器的工作过程可以分为三部分：

- **解析（Parse）** ：将源代码转换成更加抽象的表示方法（例如抽象语法树）。包括词法分析和语法分析。词法分析主要把字符流源代码（Char Stream）转换成令牌流（ Token Stream），语法分析主要是将令牌流转换成抽象语法树（Abstract Syntax Tree，AST）。
- **转换（Transform）** ：通过 Babel 的插件能力，对（抽象语法树）做一些特殊处理，将高版本语法的 AST 转换成支持低版本语法的 AST。让它符合编译器的期望，当然在此过程中也可以对 AST 的 Node 节点进行优化操作，比如添加、更新以及移除节点等。
- **生成（Generate）** ：将 AST 转换成字符串形式的低版本代码，同时也能创建 Source Map 映射。

## 函数柯里化

在一个函数中，首先填充几个参数，然后再返回一个新的函数的技术，称为函数的柯里化。通常可用于在不侵入函数的前提下，为函数 **预置通用参数**，供多次重复调用。

```js
const add = function add(x) {
  return function (y) {
    return x + y
  }
}

const add1 = add(1)

add1(2) === 3
add1(20) === 21
```

## 数组(Array) 常用方法

- `map` : 遍历数组，返回回调返回值组成的新数组
- `forEach`: 无法 `break`，可以用 `try/catch` 中 `throw new Error` 来停止
- `filter` : 过滤
- `some`: 有一项返回 `true`，则整体为 `true`
- `every` : 有一项返回 `false`，则整体为 `false`
- `join` : 通过指定连接符生成字符串
- `push / pop` : 末尾推入和弹出，改变原数组， `push` 返回数组长度, `pop` 返回原数组最后一项
- `unshift / shift` : 头部推入和弹出，改变原数组，`unshift` 返回数组长度，`shift` 返回原数组第一项
- `sort(fn) / reverse` : 排序与反转，改变原数组
- `concat` : 连接数组，不影响原数组， 浅拷贝
- `slice(start, end)` : 返回截断后的新数组，不改变原数组
- `splice(start, number, value...)` : 返回删除元素组成的数组，`value` 为插入项，改变原数组
- `indexOf / lastIndexOf(value, fromIndex)` : 查找数组项，返回对应的下标
- `reduce / reduceRight(fn(prev, cur)， defaultPrev)` : 两两执行，`prev` 为上次化简函数的 `return` 值，`cur` 为当前值
  - 当传入 `defaultPrev` 时，从第一项开始；
  - 当未传入时，则为第二项
- 数组乱序：

```js
var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
arr.sort(function () {
  return Math.random() - 0.5
})
```

- 数组扁平化: flat: `[1,[2,3]] --> [1, 2, 3]`

```js
Array.prototype.flat = function () {
  return this.toString()
    .split(',')
    .map((item) => +item)
}
```

## 类数组转换数组

- 转换方法
  - `Array.from()`
  - `Array.prototype.slice.call()`
  - `Array.prototype.forEach()` 进行属性遍历并组成新的数组
- 装换须知
  - 转换后的数组长度由 length 属性决定。索引不连续时转换结果是连续的，会自动补位。
