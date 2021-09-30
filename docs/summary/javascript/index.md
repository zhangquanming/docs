## 原型/构造函数/实例

+ 原型 `(prototype)`: 一个简单的对象，用于实现对象的**属性继承**。在 Firefox 和 Chrome 中，每个JavaScript对象中都包含一个 `__proto__` (非标准)的属性指向它父类(该对象的原型)，可通过 `obj.__proto__` 进行访问。
+ 构造函数: 可以通过 `new` 来**新建一个对象**的函数。
+ 实例: 通过构造函数和 `new` 创建出来的对象，便是实例。 实例通过 `__proto__` 指向原型，通过 `constructor` 指向构造函数。

<img :src="$withBase('/assets/prototype_1.png')" alt="执行上下文的组成">

## 原型链

原型链是由原型对象组成，每个对象都有 `__proto__` 属性，指向了创建该对象的构造函数的原型，`__proto__` 将对象连接起来组成了原型链。是一个用来实现继承和共享属性的有限的对象链。

+ **属性查找机制**: 当查找对象的属性时，如果实例对象自身不存在该属性，则沿着原型链往上一级查找，找到时则输出，不存在时，则继续沿着原型链往上一级查找，直至最顶级的原型对象 `Object.prototype`，如还是没找到，则输出 `undefined`；
+ **属性修改机制**: 只会修改实例对象本身的属性，如果不存在，则进行添加该属性，如果需要修改原型的属性时，则可以用: `b.prototype.x = 2`；但是这样会造成所有继承于该对象的实例的属性发生改变。

## 执行上下文

执行上下文：指当前执行环境中的变量、函数声明，参数（arguments），作用域链，this等信息。

#### 上下文类型
+ 全局执行上下文
+ 函数执行上下文
+ `eval` 执行上下文

#### 上下文组成
+ 变量对象(VO)
+ 作用域链(词法作用域)
+ `this` 指向
<img :src="$withBase('/assets/ec_1.png')" alt="执行上下文的组成">

#### 生命周期
+ **创建阶段**
  + 生成变量对象
    + 创建arguments
    + 函数声明
    + 变量声明
  + 建立作用域链
  + 确定this的指向
+ **执行阶段**
  + 变量赋值
  + 函数的引用
  + 执行其他代码

<img :src="$withBase('/assets/ec_2.jpg')" alt="执行上下文生命周期：">

#### 变量对象
变量对象，是执行上下文中的一部分，可以抽象为一种**数据作用域**，它存储着该执行上下文中的所有 **变量和函数声明(不包含函数表达式)** 。

::: tip
活动对象 (AO): 当变量对象所处的上下文为 active EC 时，称为活动对象。
:::

#### 执行过程
+ 创建 **全局上下文** (global EC)。
+ 全局执行上下文 (caller) 逐行**自上而下**执行。遇到函数时，**函数执行上下文** (callee) 被 `push` 到执行栈顶层。
+ 函数执行上下文被激活，成为 active EC, 开始执行函数中的代码，caller 被挂起。
+ 函数执行完后，callee 被 `pop` 移除出执行栈，控制权交还全局上下文 (caller)，继续执行。

## 作用域

执行上下文中还包含作用域链。理解作用域之前，先介绍下作用域。作用域其实可理解为该上下文中声明的 **变量和声明的作用范围**。可分为 **块级作用域** 和 **函数作用域**。

#### 特性:
+ **声明提前**: 一个声明在函数体内都是可见的, 函数优先于变量。
+ 非匿名自执行函数，函数变量为 **只读** 状态，无法修改。

```js
let foo = function() { console.log(1) };
(function foo() {
    foo = 10  // 由于foo在函数中只为可读，因此赋值无效
    console.log(foo)
}()) 

// 结果打印：  ƒ foo() { foo = 10 ; console.log(foo) }
```

## 作用域链 

在执行上下文中访问到父级甚至全局的变量，这便是作用域链的作用。作用域链可以理解为一组对象列表，包含**父级和自身的变量对象**，因此我们便能通过作用域链访问到父级里声明的变量或者函数。

+ 由两部分组成:
  + `[[scope]]` 属性: 指向父级变量对象和作用域链，也就是包含了父级的 `[[scope]]` 和 `AO`。
  + `AO`: 自身活动对象

因此 `[[scopr]]` 包含 `[[scope]]`，便自上而下形成一条**链式作用域**。

## 闭包

闭包属于一种特殊的作用域，称为**静态作用域**。它的定义可以理解为: **父函数被销毁**的情况下，返回出的子函数的 `[[scope]]` 中仍然保留着父级的单变量对象和作用域链，因此可以继续访问到父级的变量对象，这样的函数称为闭包。

#### 闭包会产生一个很经典的问题:
  + 多个子函数的 `[[scope]]` 都是同时指向父级，是完全共享的。因此当父级的变量对象被修改时，所有子函数都受到影响。

#### 解决:
  + 变量可以通过 **函数参数的形式** 传入，避免使用默认的 `[[scope]]` 向上查找。
  + 使用 `setTimeout` 包裹，通过第三个参数传入。
  + 使用 **块级作用域**，让变量成为自己上下文的属性，避免共享。

## script 引入方式

+ html 静态 `<script>` 引入。
+ js 动态插入 `<script>`  。
+ `<script defer>` : 延迟加载，元素解析完成后执行。
+ `<script async>` : 异步加载，但执行时会阻塞元素渲染。

## 对象的拷贝

+ 浅拷贝: 以赋值的形式拷贝引用对象，仍指向同一个地址，**修改时原对象也会受到影响**。
  + `Object.assign`
  + 展开运算符(...)

+ 深拷贝: 完全拷贝一个新对象，**修改时原对象不再受到任何影响**。
  + JSON.parse(JSON.stringify(obj)): 性能最快。
    + 具有循环引用的对象时，报错。
    + 当值为函数、undefined、或symbol时，无法拷贝。
  + 递归进行逐一赋值。

## new运算符的执行过程

+ 新生成一个对象。
+ 链接到原型: `obj.__proto__ = Con.prototype`。
+ 绑定 `this`: `apply`。
+ 返回新对象(如果构造函数有自己 retrun 时，则返回该值)。

## instanceof原理

能在实例的 **原型对象链** 中找到该构造函数的 `prototype` 属性所指向的 **原型对象**，就返回true。

即:
```js
// __proto__: 代表原型对象链
instance.[__proto__...] === instance.constructor.prototype

// return true
```

## 代码的复用

当你发现任何代码开始写第二遍时，就要开始考虑如何复用。一般有以下的方式:

+ 函数封装
+ 继承
+ 复制 `extend`
+ 混入 `mixin`
+ 借用 `apply/call`

## 继承

在 JS 中，继承通常指的便是 **原型链继承**，也就是通过指定原型，并可以通过原型链继承原型上的属性或者方法。

+ 最优化: 圣杯模式
```js
var inherit = (function(c,p){
	var F = function(){};
	return function(c,p){
		F.prototype = p.prototype;
		c.prototype = new F();
		c.uber = p.prototype;
		c.prototype.constructor = c;
	}
})();
```
+ 使用 ES6 的语法糖 `class / extends`

## 类型转换

JS 中在使用运算符号或者对比符时，会自带隐式转换，规则如下:
+ -、*、/、% ：一律转换成数值后计算
+ +：
  + 数字 + 字符串 = 字符串， 运算顺序是从左到右
  + 数字 + 对象， 优先调用对象的 `valueOf` -> `toString`
  + 数字 + `boolean/null` -> 数字
  + 数字 + `undefined` -> `NaN`
+ `[1].toString() === '1'`
+ `{}.toString() === '[object object]'`
+ `NaN !== NaN` 、`+undefined` 为 `NaN`

## 类型判断

判断 Target 的类型，单单用 typeof 并无法完全满足，这其实并不是 bug，本质原因是 JS 的万物皆对象的理论。因此要真正完美判断时，我们需要区分对待:
+ 基本类型(`null`): 使用 `String(null)`。
+ 基本类型(`string / number / boolean / undefined`) + `function`: 直接使用 `typeof` 即可。
+ 其余引用类型(`Array / Date / RegExp Error`): 调用 `toString` 后根据 `[object XXX]` 进行判断。

很稳的判断封装:
```js
let class2type = {}
'Array Date RegExp Object Error'.split(' ').forEach(e => class2type[ '[object ' + e + ']' ] = e.toLowerCase()) 

function type(obj) {
    if (obj == null) return String(obj)
    return typeof obj === 'object' ? class2type[ Object.prototype.toString.call(obj) ] || 'object' : typeof obj
}
```

## 模块化

模块化开发在现代开发中已是必不可少的一部分，它大大提高了项目的可维护、可拓展和可协作性。通常，我们 **在浏览器中使用 ES6 的模块化支持，在 Node 中使用 commonjs 的模块化支持**。

+ 分类:
  + es6: `import / export`
  + commonjs: `require / module.exports / exports`
  + amd:  `require / defined`

+ `require` 与 `import` 的区别:
  + `require` 支持 动态导入，`import` 不支持，正在提案 (babel 下可支持)。
  + `require` 是 同步 导入，`import` 属于 **异步** 导入。
  + `require` 是 **值拷贝**，导出值变化不会影响导入值；`import` 指向 **内存地址**，导入值会随导出值而变化。

## 防抖与节流

防抖与节流函数是一种最常用的 **高频触发优化方式**，能对性能有较大的帮助。

+ **防抖 (debounce)**: 将多次高频操作优化为只在最后一次执行，通常使用的场景是：用户输入，只需再输入完成后做一次输入校验即可。
```js
function debounce(fn, wait, immediate) {
    let timer = null

    return function() {
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

+ **节流(throttle)**: 每隔一段时间后执行一次，也就是降低频率，将高频操作优化成低频操作，通常使用场景: 滚动条事件 或者 resize 事件，通常每隔 100~500 ms执行一次即可。
```js
function throttle(fn, wait, immediate) {
    let timer = null
    let callNow = immediate
    
    return function() {
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
