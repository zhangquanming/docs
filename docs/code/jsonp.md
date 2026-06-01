# 实现 jsonp

```js
//jsonp
function JSONP (url, callbackName, callbackFunc) {
  let script = document.createElement('script');
  script.src = `${url}?callback=${callbackName}`
  document.body.appendChild(script)
  window[callbackName] = function (data) {
    callbackFunc(data)
    document.body.remove(script)
  }
}
```
