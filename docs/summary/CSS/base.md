## CSS 盒模型

CSS 盒模型由四部分组成：

- 内容边界 Content
- 内边距边界 Padding
- 边框边界 Border
- 外边框边界 Margin

<img :src="$withBase('/assets/box_model.gif')" alt="foo">

盒模型的类型可通过 box-sizing 进行设置。根据计算宽高的区域可分为：

- content-box (W3C 标准盒模型)
- border-box (IE 盒模型)
- padding-box (FireFox 曾经支持)
- margin-box (浏览器未实现)

::: warning
理论上是有上面 4 种盒子，但现在 w3c 与 mdn 规范中均只支持 content-box 与 border-box；
:::

## position

CSS position 属性用于指定一个元素在文档中的定位方式。

- static

  - 默认，即元素在文档常规流中当前的布局位置。

- relative

  - 相对定位，相对于其正常位置进行定位。
  - 未脱离文档流。

- absolute

  - 绝对定位，相对于 static 定位以外的第一个父元素进行定位。
  - 脱离文档流。

- fixed

  - 固定定位，相对于浏览器窗口进行定位。
  - 脱离文档流.
  - `fixed` 属性会创建新的层叠上下文。当元素祖先的 `transform`, `perspective` 或 `filter` 属性非 `none` 时，容器由视口改为该祖先。

- sticky
  - 粘性定位，该值总是创建一个新的层叠上下文（stacking context）,该定位基于用户滚动的位置。它的行为就像 `position:relative`; 而当页面滚动超出目标区域时，它的表现就像 `position:fixed`;，它会固定在目标位置。
  
## flex

<img :src="$withBase('/assets/flex.png')" alt="foo">

在 flex 容器中默认存在两条轴，水平主轴(main axis)和垂直的交叉轴(cross axis)，在容器中每个单元被称之为 flex item。

- `display: flex | inline-flex`

::: warning
当时设置 flex 布局之后，子元素的 float、clear、vertical-align 的属性将会失效。
:::

#### 容器属性

- `flex-direction: row | row-reverse | column | column-reverse;` (决定主轴方向)
- `flex-wrap: nowrap | wrap | wrap-reverse;`（决定容器内项目是否可换行）
- `flex-flow: <flex-direction> || <flex-wrap>;`（flex-direction 和 flex-wrap 的简写形式）
- `justify-content: flex-start | flex-end | center | space-between | space-around;` (定义了项目在主轴的对齐方式)
- `align-items: flex-start | flex-end | center | baseline | stretch;` (定义了项目在交叉轴上的对齐方式)
- `align-content: flex-start | flex-end | center | space-between | space-around | stretch;` (定义了多根轴线的对齐方式，如果项目只有一根轴线，那么该属性将不起作用)

#### flex item 属性

- `order: <integer>;` (定义项目在容器中的排列顺序)
- `flex-basis: <length> | auto;` (指定 flex 元素在主轴方向上的初始大小（基础尺寸）,默认值为 auto，即项目本身大小)
- `flex-grow: <number>;` （定义项目的放大比例，默认值为 0）
- `flex-shrink: <number>;` (定义了项目的缩小比例，默认值为 1)
- `flex: none | auto | [< 'flex-grow' > < 'flex-shrink' >? || < 'flex-basis' > ];` （flex-grow, flex-shrink 和 flex-basis的简写）
	- flex 默认值为 0 1 auto
	- flex: none，等同于 flex: 0 0 auto;
	- flex: auto，等同于 flex: 1 1 auto;
	- flex: 1，等同于 flex: 1 1 0%;
	- flex: 0，等同于 flex 0 1 0%;
- `align-self: auto | flex-start | flex-end | center | baseline | stretch;` (允许单个项目有与其他项目不一样的对齐方式)

## 层叠上下文

层叠上下文(stacking context)，是 HTML 中一个三维的概念。在 CSS2.1 规范中，每个盒模型的位置是三维的，分别是平面画布上的 X 轴，Y 轴以及表示层叠的 Z 轴。

- 层叠上下文的创建:

  - <html></html>本身就具有层叠上下文，称为“根层叠上下文”。
  - 普通元素设置 `position` 为非 `static` 值并设置 `z-index` 属性为具体数值，产生层叠上下文。
  - CSS3 中的新属性也可以产生层叠上下文:
    - `flex`
    - `transform`
    - `opacity`
    - `filter`
    - `will-change`
    - `-webkit-overflow-scrolling`

- 层叠等级：层叠上下文在 z 轴上的排序:
  - 在同一层叠上下文中，层叠等级才有意义。
  - `z-index` 的优先级最高。
    <img :src="$withBase('/assets/css_context.png')" alt="foo">

## BFC(块级格式化上下文)

块级格式化上下文，是一个独立的渲染区域，让处于 BFC 内部的元素与外部的元素相互隔离，使内外元素的定位不会相互影响。
::: tip
IE 下为 Layout，可通过 zoom:1 触发
:::

- 触发条件:

  - 根元素
  - `position: absolute/fixed`
  - `display: inline-block / table`
  - `float 元素`
  - `ovevflow !== visible`

- 特点：

  - 属于同一个 BFC 的两个相邻 Box 垂直排列。
  - 属于同一个 BFC 的两个相邻 Box 的 margin 会发生重叠。
  - BFC 中子元素的 margin box 的左边， 与包含块 (BFC) border box 的左边相接触 (子元素 absolute 除外)。
  - BFC 的区域不会与 float 的元素区域重叠。
  - 计算 BFC 的高度时，浮动子元素也参与计算。
  - 文字层不会被浮动层覆盖，环绕于周围。

- 应用：
  - 阻止 `margin` 重叠。
  - 可以包含浮动元素 —— 清除内部浮动(清除浮动的原理是两个 div 都位于同一个 BFC 区域之中)。
  - 自适应两栏布局。
  - 可以阻止元素被浮动元素覆盖。

## CSS 选择器

- 通用选择器(\*)
- 标签选择器（div）
- class 选择器(.wrap)
- id 选择器（#wrap）
- 属性选择器(E[att], E[att=val], E[att~=val])
  - E[att]： 匹配所有具有 att 属性的 E 元素，不考虑它的值。
  - E[att=val]：匹配所有 att 属性等于"val"的 E 元素。
  - E[att~=val]：匹配所有 att 属性具有多个空格分隔的值、其中一个值等于"val"的 E 元素。
- 相邻选择器(h1 + p)
- 子选择器（ul > li）
- 后代选择器（li a）
- 伪类选择器
  - E:first-child：匹配父元素的第一个子元素。
  - E:link 匹配所有未被点击的链接。
  - E:focus 匹配获得当前焦点的 E 元素。
  - E:not(s) 反选伪类，匹配不符合当前选择器的任何元素。

::: tip

- 选择器优先级：`!important` > 行内样式 > `#id` > `.class` > `tag` > `*` > 继承 > 默认
- 选择器 **从右往左** 解析。
  :::
