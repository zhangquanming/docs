## http/https 协议

- 1.0 协议缺陷:
  - 无法复用链接，完成即断开，**重新慢启动和 TCP 3 次握手**
  - head of line blocking: **线头阻塞**，导致请求之间互相影响
- 1.1 改进:
  - **长连接**(默认 keep-alive)，复用
  - host 字段指定对应的虚拟站点
  - 新增功能:
    - 断点续传
    - 身份认证
    - 状态管理
    - cache 缓存
      - Cache-Control
      - Expires
      - Last-Modified
      - Etag
- 2.0:
  - 多路复用
  - 二进制分帧层: 应用层和传输层之间
  - 首部压缩
  - 服务端推送
- https: 较为安全的网络传输协议
  - 证书(公钥)
  - SSL 加密
  - 端口 443
- TCP:
  - 三次握手
  - 四次挥手
  - 滑动窗口: 流量控制
  - 拥塞处理
    - 慢开始
    - 拥塞避免
    - 快速重传
    - 快速恢复
- 缓存策略: 可分为 **强缓存** 和 **协商缓存**
  - Cache-Control/Expires: 浏览器判断缓存是否过期，未过期时，直接使用强缓存，**Cache-Control 的 max-age 优先级高于 Expires**
  - 当缓存已经过期时，使用协商缓存
    - 唯一标识方案: Etag(response 携带) & If-None-Match(request 携带，上一次返回的 Etag): 服务器判断资源是否被修改
    - 最后一次修改时间: Last-Modified(response) & If-Modified-Since (request，上一次返回的 Last-Modified)
      - 如果一致，则直接返回 304 通知浏览器使用缓存
      - 如不一致，则服务端返回新的资源
  - Last-Modified 缺点：
    - 周期性修改，但内容未变时，会导致缓存失效
    - 最小粒度只到 s， s 以内的改动无法检测到
  - Etag 的优先级高于 Last-Modified

## 常见状态码

- 1xx: 接受，继续处理
- 200: 成功，并返回数据
- 201: 已创建
- 202: 已接受
- 203: 成为，但未授权
- 204: 成功，无内容
- 205: 成功，重置内容
- 206: 成功，部分内容
- 301: 永久移动，重定向
- 302: 临时移动，可使用原有 URI
- 304: 资源未修改，可使用缓存
- 305: 需代理访问
- 400: 请求语法错误
- 401: 要求身份认证
- 403: 拒绝请求
- 404: 资源不存在
- 500: 服务器错误

## get / post

|                | GET                                   | POST                                                                                 |
| -------------- | ------------------------------------- | ------------------------------------------------------------------------------------ |
| 后退按钮/刷新  | 无害                                  | 数据会被重新提交                                                                     |
| 书签           | 可收藏                                | 不可收藏                                                                             |
| 缓存           | 能被缓存                              | 不能缓存                                                                             |
| 编码类型       | appLication/x-www-form-urlencoded     | appLication/x-www-form-urlencoded 或 multipart/form-data。为二进制数据使用多重编码。 |
| 历史           | 参数保留在浏览器历史中                | 参数不会保存在浏览器历史中                                                           |
| 对数据长度限制 | URL 的最大长度 2048 个字符            | 无限制                                                                               |
| 对数据类型限制 | 只允许 ASCII 字符                     | 没有限制，也允许二进制数据。                                                         |
| 安全性         | 相对较差，所发送的数据是 URL 的一部分 | 相对较安全，参数不会被保存在浏览器历史                                               |
| 可见性         | 数据在 URL 中所有人都是可见的         | 数据不会显示在 URL 中                                                                |

## TCP 三次握手

建立连接前，客户端和服务端需要通过握手来确认对方:

- 客户端发送 syn(同步序列编号) 请求，进入 syn_send 状态，等待确认
- 服务端接收并确认 syn 包后发送 syn+ack 包，进入 syn_recv 状态
- 客户端接收 syn+ack 包后，发送 ack 包，双方进入 established 状态

## TCP 四次挥手

- 客户端 -- FIN --> 服务端， FIN—WAIT
- 服务端 -- ACK --> 客户端， CLOSE-WAIT
- 服务端 -- ACK,FIN --> 客户端， LAST-ACK
- 客户端 -- ACK --> 服务端，CLOSED

## 解决无状态问题

HTTP 协议是无状态的，无状态意味着，服务器无法给不同的客户端响应不同的信息。这样一些交互业务就无法支撑了。

#### 1. Cookie

cookie 的传递会经过下边这 4 步：

1. Client 发送 HTTP 请求给 Server
2. Server 响应，并附带 Set-Cookie 的头部信息
3. Client 保存 Cookie，之后请求 Server 会附带 Cookie 的头部信息
4. Server 从 Cookie 知道 Client 是谁了，返回相应的响应

Server 拿到 Cookie 后，通过什么信息才能判断是哪个 Client 呢？服务器的 SessionID。

#### 2. Session

如果把用户名、密码等重要隐私都存到客户端的 Cookie 中，还是有泄密风险。为了更安全，把机密信息保存到服务器上，这就是 Session。Session 是服务器上维护的客户档案，可以理解为服务器端数据库中有一张 user 表，里面存放了客户端的用户信息。SessionID 就是这张表的主键 ID。

Session 信息存到服务器，必然占用内存。用户多了以后，开销必然增大。为了提高效率，需要做分布式，做负载均衡。因为认证的信息保存在内存中，用户访问哪台服务器，下次还得访问相同这台服务器才能拿到授权信息，这就限制了负载均衡的能力。而且 SeesionID 存在 Cookie，还是有暴露的风险，比如 CSRF(Cross-Site Request Forgery，跨站请求伪造)。

如何解决这些问题呢？基于 Token 令牌鉴权。

#### 3. Token

首先，Token 不需要再存储用户信息，节约了内存。其次，由于不存储信息，客户端访问不同的服务器也能进行鉴权，增强了扩展能力。然后，Token 可以采用不同的加密方式进行签名，提高了安全性。

Token 就是一段字符串，Token 传递的过程跟 Cookie 类似，只是传递对象变成了 Token。用户使用用户名、密码请求服务器后，服务器就生成 Token，在响应中返给客户端，客户端再次请求时附带上 Token，服务器就用这个 Token 进行认证鉴权。

Token 虽然很好的解决了 Session 的问题，但仍然不够完美。服务器在认证 Token 的时候，仍然需要去数据库查询认证信息做校验。为了不查库，直接认证，JWT 出现了。

#### 4. JWT

JWT 的英文全称是 JSON Web Token。JWT 把所有信息都存在自己身上了，包括用户名密码、加密信息等，且以 JSON 对象存储的。

JWT 长相是 xxxxx.yyyyy.zzzzz，极具艺术感。包括三部分内容

- Header 包括 token 类型和加密算法(HMAC SHA256 RSA)

```js
{ "alg": "HS256", "typ": "JWT"}
```

- Payload 传入内容

```js
{ "sub": "1234567890", "name": "John Doe", "admin": true}
```

- Signature
  签名，把 header 和 payload 用 base64 编码后"."拼接，加盐 secret(服务器私钥)。

```js
HMACSHA256(base64UrlEncode(header) + '.' + base64UrlEncode(payload), secret)
```

最终的 token 就是这样一个字符串

```js
eyJhbGciOiJIUzI1NiJ9
  .eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ
  .yKOB4jkGWu7twu8Ts9zju01E10_CPedLJkoJFCan5J4
```

给 Token 穿个外套

```js
Authorization: Bearer
```

## 跨域

- JSONP: 利用 `<script>` 标签不受跨域限制的特点，缺点是只能支持 get 请求

  ```js
  function jsonp(url, jsonpCallback, success) {
    const script = document.createElement('script')
    script.src = url
    script.async = true
    script.type = 'text/javascript'
    window[jsonpCallback] = function (data) {
      success && success(data)
    }
    document.body.appendChild(script)
  }
  ```

- 设置 CORS: Access-Control-Allow-Origin：\*
- postMessage

## 安全

- XSS: 跨站脚本攻击
  - cookie 设置 httpOnly, 禁止 JavaScript 读取某些敏感 Cookie
  - 转义页面上的输入内容和输出内容
- CSRF: 跨站请求伪造，防护:
  - get 不修改数据
  - 不被第三方网站访问到用户的 cookie
  - 设置白名单，不被第三方网站请求
  - 请求校验
