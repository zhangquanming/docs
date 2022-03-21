# 实现 new

new 的作用:

1. 创建一个空对象 obj
2. 将新对象的原型指向当前函数的原型
3. 新创建的对象绑定到当前 this 上
4. 如果没有返回其他对象，就返回 obj，否则返回其他对象

```js
function _new(constructor, ...arg) {
  // 1. 创建新对象
  const obj = {}
  // 2. 设置原型
  obj.__proto__ = constructor.prototype
  // 3. 绑定 this
  const result = constructor.apply(obj, arg)
  // 4. 返回
  return typeof result === 'object' ? result : obj
}

function Foo(name) {
  this.name = name
}
var luckyStar = _new(Foo, 'luckyStar')
console.log(luckyStar.name) //luckyStar
```
