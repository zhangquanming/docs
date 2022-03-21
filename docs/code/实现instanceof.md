# 实现 instanceof

## instanceof 语法

```js
object instanceof constructor
// 等同于
constructor.prototype.isPrototypeOf(object)
```

- object: 要检测的对象
- constructor: 某个构造函数

## instanceof 的实现

```js
function instanceof(L, R) {
  const O = R.prototype
  L = L.__proto__
  while (true) {
    if (L === null) {
      return false
    }
    if (L === O) {
      return true
    }
    L = L.__proto__
  }
}
```

`instanceof` 原理： 检测 `constructor.prototype` 是否存在于参数 `object` 的原型链上。 `instanceof` 查找的过程中会遍历 `object` 的原型链，直到找到 `constructor` 的 `prototype` ,如果查找失败，则会返回 `false`，表示 `object` 并非是 `constructor` 的实例。

## Symbol.hasInstance

对象的 `Symbol.hasInstance` 属性，指向一个内部方法。当其他对象使用 `instanceof` 运算符，判断是否为该对象的实例时，会调用这个方法。比如，`foo instanceof Foo` 在语言内部，实际调用的是 `FooSymbol.hasInstance`。

```js
class MyClass {
  [Symbol.hasInstance](foo) {
    return foo instanceof Array
  }
}

;[1, 2, 3] instanceof new MyClass() // true
```
