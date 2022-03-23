# call、apply、bind

## call

```js
Function.prototype.myCall = function (context = window, ...args) {
  content.fn = this
  let res = content.fn(...args)
  delete content.fn
  return res
}
```

## apply

```js
Function.prototype.myApply = function (content = window, args) {
  content.fn = this
  let res = content.fn(...args)
  delete content.fn
  return res
}
```

## bind

```js
Function.prototype.mybind = function (content = window, ...args) {
  let fn = Symbol()
  context[fn] = this
  let _this = this

  const result = function (...innerArgs) {
    // 第一种情况 :若是将 bind 绑定之后的函数当作构造函数，通过 new 操作符使用，则不绑定传入的 this，而是将 this 指向实例化出来的对象
    // 此时由于new操作符作用  this指向result实例对象  而result又继承自传入的_this 根据原型链知识可得出以下结论
    // this.__proto__ === result.prototype   //this instanceof result =>true
    // this.__proto__.__proto__ === result.prototype.__proto__ === _this.prototype; //this instanceof _this =>true
    if (this instanceof _this === true) {
      // 此时this指向指向result的实例  这时候不需要改变this指向
      this[fn] = _this
      this[fn](...[...args, ...innerArgs]) //这里使用es6的方法让bind支持参数合并
    } else {
      // 如果只是作为普通函数调用  那就很简单了 直接改变this指向为传入的context
      context[fn](...[...args, ...innerArgs])
    }
  }
  // 如果绑定的是构造函数 那么需要继承构造函数原型属性和方法
  // 实现继承的方式: 使用Object.create
  result.prototype = Object.create(this.prototype)
  return result
}
```
