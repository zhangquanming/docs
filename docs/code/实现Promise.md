# 实现 Promise

## Promise 简介

#### Promise.resolve

- 参数是以 Promise 的实例，那么 Promise.resolve 将不做任何修改，原封不动的返回这个实例。
- 如果参数是一个原始值，或者是一个不具备 then 方法的对象，则 Promise.resolve 返回一个新的 Promise，状态为 resolved。

#### Promise.all

- Promise.all 方法(p)接受一个数组作为参数，数组的每一项都是 Promise 的实例(p1, p2, p3)，如果不是，就会调用 Promise.resolve 将参数转为 Promise 实例，再进行下一步处理。
- 返回值组成一个数组。
- p1、p2、p3 中如果有一个被 rejected，那么 p 的状态就变成 rejected，此时第一个 reject 的实例返回值，会传递给 p 的回调函数。

#### Promise.race

- Promise.race 参数和 Promise.all 一样，如果不是 Promise 实例，就转为 Promise 实例。
- 返回最先改变状态的 Promise 实例的返回值。

## 代码实现

```js
class Promise {
  constructor(fn) {
    /**
     * 三种状态
     * pending  进行中
     * fulfilled  已成功
     * rejected  已失败
     */
    this.status = 'pending'
    this.resolveList = [] // 成功后回调函数
    this.rejectList = [] // 失败后回调函数

    fn(this.resolve.bind(this), this.reject.bind(this))
  }
  then(scb, fcb) {
    if (scb) {
      this.resolveList.push(scb)
    }
    if (fcb) {
      this.rejectList.push(fcb)
    }
    return this
  }
  catch(cb) {
    if (cb) {
      this.rejectList.push(cb)
    }
    return this
  }
  resolve(data) {
    if (this.status !== 'pending') return
    this.status = 'fulfilled'
    setTimeout(() => {
      this.resolveList.forEach((s) => {
        data = s(data)
      })
    }, 0)
  }
  reject(err) {
    if (this.status !== 'pending') return
    this.status = 'rejected'
    setTimeout(() => {
      this.rejectList.forEach((f) => {
        err = f(err)
      })
    }, 0)
  }

  // 实现 Promise.resolve
  static resolve(data) {
    if (data instanceof Promise) {
      return data
    } else {
      return new Promise((resolve, reject) => {
        resolve(data)
      })
    }
  }
  // 实现 Promise.reject
  static reject(err) {
    if (err instanceof Promise) {
      return err
    } else {
      return new Promise((resolve, reject) => {
        reject(err)
      })
    }
  }
  // 实现 Promise.all
  static all(promises) {
    return new Promise((resolve, reject) => {
      let promiseCount = 0
      let promisesLength = promises.length
      let result = []
      for (let i = 0; i < promises.length; i++) {
        // promises[i] 可能不是 Promise 类型，可能不存在 then 方法，中间如果出错,直接返回错误
        Promise.resolve(promises[i]).then(
          (res) => {
            promiseCount++
            // 注意这是赋值应该用下标去赋值而不是用 push，因为毕竟是异步的，哪个 promise 先完成还不一定
            result[i] = res
            if (promiseCount === promisesLength) {
              return resolve(result)
            }
          },
          (err) => {
            return reject(err)
          }
        )
      }
    })
  }
  // 实现 Promise.race
  static race(promises) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        Promise.resolve(promises[i]).then(
          (res) => {
            return resolve(res)
          },
          (err) => {
            return reject(err)
          }
        )
      }
    })
  }
}
```

## 测试

#### Promise.then

```js
const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('resolve')
    resolve(222)
  }, 1000)
})

p.then((data) => {
  setTimeout(() => {
    console.log('data', data)
  })
  return 3333
})
  .then((data2) => {
    console.log('data2', data2)
  })
  .catch((err) => {
    console.error('err', err)
  })
```

#### Promise.reject

```js
const p1 = Promise.reject('出错了')
p1.then(null, function (s) {
  console.log(s) // 出错了
})
```

#### Promise.all & Promise.race

```js
const q1 = new Promise((resolve, reject) => {
  resolve('hello')
})
const q2 = new Promise((resolve, reject) => {
  resolve('world')
})

Promise.all([q1, q2]).then((res) => {
  console.log('all：', res) // [ 'hello', 'world' ]
})
Promise.race([q1, q2]).then((res) => {
  console.log('race：', res) // hello
})
```
