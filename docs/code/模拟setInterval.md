# settimeout 模拟实现 setinterval

setInterval 用来实现循环定时调用可能会存在一定的问题，用 setTimeout 解决

## 实现

```js
function mySettimeout(fn, t) {
  let timer = null
  function interval() {
    fn()
    timer = setTimeout(interval, t)
  }
  interval()
  // 返回清楚方法
  return {
    cancel: () => {
      clearTimeout(timer)
    },
  }
}
```

## 测试

```js
let a = mySettimeout(() => {
  console.log(111)
}, 1000)
```
