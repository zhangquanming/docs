# 实现 compose 函数

## 用法

```js
function fn1(x) {
  return x + 1
}

function fn2(x) {
  return x + 2
}

function fn3(x) {
  return x + 3
}

function fn4(x) {
  return x + 4
}

const a = compose(fn1, fn2, fn3, fn4)
// 或  compose(fn1, fn2, fn3, fn4)(1)
console.log(a(1))
// 1+4+3+2+1=11
```

## 实现

```js
function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg
  }
  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
```
