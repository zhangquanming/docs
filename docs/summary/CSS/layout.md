## 两列布局

### absolute + margin 方式

```html
<div class="container">
  <div class="sidebar">固定</div>
  <div class="main">自适应</div>
</div>
```

```css
.container {
  position: relative;
}
.sidebar {
  position: absolute;
  top: 0;
  left: 0;
  height: 300px;
  width: 200px;
  background: #67c23a;
}
.main {
  margin-left: 200px;
  height: 300px;
  background: #e6a23c;
}
```

修改 `css` 就可实现 `位置调换`，如下：

```css
.sidebar {
  right: 0;
  /* ... */
}
.main {
  margin-right: 200px;
  /* ... */
}
```

- 优点： 交换`<div class="sidebar">固定</div>` 、 `<div class="main">自适应</div>`顺序 ，实现主要内容优先加载渲染。
- 缺点：`absolute` 定位，脱离文档流，当 sidebar 列的高度，超过 main 列的高度，会遮住下面的元素。需要给父盒子设置 overflow 属性。

### float + margin 方式

```html
<div class="container">
  <div class="sidebar">固定</div>
  <div class="main">自适应</div>
</div>
```

```css
.sidebar {
  float: left;
  top: 0;
  right: 0;
  height: 300px;
  width: 200px;
  background: #67c23a;
}
.main {
  margin-left: 200px;
  height: 300px;
  background: #e6a23c;
}
```

也支持位置调换：

```css
.sidebar {
  float: right;
  /* ... */
}
.main {
  margin-right: 200px;
  /* ... */
}
```

- 缺点：不能实现主要内容优先加载渲染。

### float + 负 margin 方式

```html
<div class="wrap">
  <div class="main">自适应</div>
</div>
<div class="sidebar">固定</div>
```

```css
.wrap {
  float: left;
  width: 100%;
}
.main {
  margin-left: 200px;
  height: 300px;
  background: #e6a23c;
}
.sidebar {
  float: left;
  margin-left: -100%;
  height: 300px;
  width: 200px;
  background: #67c23a;
}
```

位置调换：

```css
.main {
  margin-right: 200px;
  /* ... */
}
.sidebar {
  float: right;
  margin-left: -200px;
  /* ... */
}
```

### flex 方式

```html
<div class="container">
  <div class="main">自适应</div>
  <div class="sidebar">固定</div>
</div>
```

```css
.container {
  display: flex;
}
.main {
  flex: 1;
  height: 300px;
  background: #e6a23c;
}
.sidebar {
  flex: none;
  /* height: 300px; */
  width: 200px;
  background: #67c23a;
}
```

这里有一点需要注意：`.sidebar`没有设置高度，会和`.container`保持一样的高度。`.container`的高度是被`.main`撑开的，也就是和`.main`高度一样。

位置调换：

```css
.container {
  display: flex;
  flex-direction: row-reverse;
}
```

### grid 方式

```html
<div class="container">
  <div class="main">自适应</div>
  <div class="sidebar">固定</div>
</div>
```

```css
.container {
  display: grid;
  grid-template-columns: auto 200px;
  grid-template-rows: 300px;
}
.main {
  background: #e6a23c;
}
.sidebar {
  background: #67c23a;
}
```

这里`.main`和`.sidebar`高度不单独设置的话，也是同样的高度。

位置调换：

```css
.container {
  display: grid;
  grid-template-columns: 200px auto;
  grid-template-rows: 300px;
  grid-template-areas: 'a b';
}
.main {
  grid-area: b;
  background: #e6a23c;
}
.sidebar {
  grid-area: a;
  background: #67c23a;
}
```

### float + BFC 方式

```html
<div class="container">
  <div class="sidebar">固定</div>
  <div class="main">自适应</div>
</div>
```

```css
.sidebar {
  float: left;
  width: 200px;
  height: 300px;
  background: #67c23a;
}
.main {
  overflow: hidden;
  height: 300px;
  background: #e6a23c;
}
```

位置调换：

```css
.sidebar {
  float: right;
  /* ... */
}
```

这里让`.main`成为`BFC`主要是消除`.sidebar`因`float`带来的影响，只要能让`.main`成为`BFC`就行。

## 三列布局

三栏布局中，经典中的经典应该就是圣杯布局、双飞翼布局没跑了。双飞翼布局和圣杯布局其实是一样的，只不过在写法上有些不同，其布局都是左右固定宽度，中间宽度自适应。

先熟悉一下圣杯布局、双飞翼布局中的特点：

- 两侧定宽，中间自适应
- 主要内容优先渲染

### 圣杯布局

```html
<div class="container">
  <div class="main">main</div>
  <div class="left">left</div>
  <div class="right">right</div>
</div>
```

(1) 首先设置好`.main`、`.left`、`.right`的宽度并浮动，为左右两列预留出空间。

```css
.container {
  padding-left: 200px; /* 预留左侧空间，为.left宽度*/
  padding-right: 300px; /* 预留右侧空间，为.right宽度*/
}
.main {
  float: left;
  width: 100%;
  height: 300px;
  background: #67c23a;
}
.left {
  float: left;
  width: 200px;
  height: 300px;
  background: #e6a23c;
}
.right {
  float: left;
  width: 300px;
  height: 300px;
  background: #f56c6c;
}
```

(2) 通过`负margin`、`position`把`<div class="left">left</div>`移动到左侧预留位置。

```css
.left {
  float: left;
  margin-left: -100%; /* 移动到左侧，100%是一个父元素宽度，这里也就是.container的宽度 */
  position: relative; /* 因为.container设置了padding */
  right: 200px; /* 所以需要再向左移动自身宽度,left: -200px;也是可以的 */
  width: 200px;
  height: 300px;
  background: #e6a23c;
}
```

(3) 通过`负margin`把`<div class="right">right</div>`移动到右侧预留位置。

```css
.right {
  float: left;
  margin-right: -300px; /* 移动到右侧，自身宽度*/
  width: 300px;
  height: 300px;
  background: #f56c6c;
}
```

完整代码：

```css
.container {
  padding-left: 200px; /* 预留左侧空间，为.left宽度*/
  padding-right: 300px; /* 预留左侧空间，为.right宽度*/
}
.main {
  float: left;
  width: 100%;
  height: 300px;
  background: #67c23a;
}
.left {
  float: left;
  margin-left: -100%; /* 移动到左侧，100%是一个父元素宽度，这里也就是.container的宽度 */
  position: relative; /* 因为.container设置了padding*/
  right: 200px; /* 所以需要再向左移动自身宽度,left: -200px;也是可以的 */
  width: 200px;
  height: 300px;
  background: #e6a23c;
}
.right {
  float: left;
  margin-right: -300px; /* 移动到右侧，自身宽度*/
  width: 300px;
  height: 300px;
  background: #f56c6c;
}
```

### 双飞翼布局

```html
<div class="main-wrap">
  <div class="main">main</div>
</div>
<div class="left">left</div>
<div class="right">right</div>
```

(1) 首先设置好`.wrap`、`.main-wrap`、`.left`、`.right`的宽度并浮动，为左右两列预留出空间。

```css
.main-wrap {
  float: left;
  width: 100%; /* 这个必须设置，不然浮动起来，没宽度 */
}
.main {
  margin-left: 200px; /* 预留左侧空间，为.left宽度 */
  margin-right: 300px; /* 预留左侧空间，为.right宽度 */
  height: 300px;
  background: #67c23a;
}
.left {
  float: left;
  width: 200px;
  height: 300px;
  background: #e6a23c;
}
.right {
  float: left;
  width: 300px;
  height: 300px;
  background: #f56c6c;
}
```

(2) 通过`负margin`把`<div class="left">left</div>`移动到左侧预留位置。

```css
.left {
  float: left;
  margin-left: -100%; /* 移动到左侧，100%是一个父元素宽度，这里也就是body的宽度*/
  width: 200px;
  height: 300px;
  background: #e6a23c;
}
```

(3) 通过`负margin`把`<div class="right">right</div>`移动到右侧预留位置。

```css
.right {
  float: left;
  margin-left: -300px; /* 移动到右侧，自身宽度*/
  width: 300px;
  height: 300px;
  background: #f56c6c;
}
```

完整代码：

```css
.main-wrap {
  float: left;
  width: 100%;
}
.main {
  margin-left: 200px; /* 预留左侧空间，为.left宽度*/
  margin-right: 300px; /* 预留左侧空间，为.right宽度*/
  height: 300px;
  background: #67c23a;
}
.left {
  float: left;
  margin-left: -100%; /* 移动到左侧，100%是一个父元素宽度，这里也就是body的宽度*/
  width: 200px;
  height: 300px;
  background: #e6a23c;
}
.right {
  float: left;
  margin-left: -300px; /* 移动到右侧，自身宽度*/
  width: 300px;
  height: 300px;
  background: #f56c6c;
}
```
