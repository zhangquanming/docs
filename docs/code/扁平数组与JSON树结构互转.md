# 扁平数组与 JSON 树结构互转

## 扁平数据结构转换为 JSON 树型结构

- **数据**

```js
let flatArr = [
  { id: 1, title: '解忧杂货铺1', parent_id: 0 },
  { id: 2, title: '解忧杂货铺2', parent_id: 0 },
  { id: 3, title: '解忧杂货铺2-1', parent_id: 2 },
  { id: 4, title: '解忧杂货铺3-1', parent_id: 3 },
  { id: 5, title: '解忧杂货铺4-1', parent_id: 4 },
  { id: 6, title: '解忧杂货铺2-2', parent_id: 2 },
]
```

- **代码**

```js
function convert(list) {
  const res = []
  const map = list.reduce((pre, next) => {
    pre[next.id] = next
    return pre
  }, {})
  for (const item of list) {
    if (item.parent_id === 0) {
      res.push(item)
      continue
    }
    if (item.parent_id in map) {
      const parent = map[item.parent_id]
      parent.children = parent.children || []
      parent.children.push(item)
    }
  }
  return res
}
let returnTree = convert(flatArr)
console.log(returnTree)
```

- **结果输出**

```js
let JsonTree = [
  {
    id: 1,
    title: '解忧杂货铺1',
    parent_id: 0,
  },
  {
    id: 2,
    title: '解忧杂货铺2',
    parent_id: 0,
    children: [
      {
        id: 3,
        title: '解忧杂货铺2-1',
        parent_id: 2,
        children: [
          {
            id: 4,
            title: '解忧杂货铺3-1',
            parent_id: 3,
            children: [
              {
                id: 5,
                title: '解忧杂货铺4-1',
                parent_id: 4,
              },
            ],
          },
        ],
      },
      {
        id: 6,
        title: '解忧杂货铺2-2',
        parent_id: 2,
      },
    ],
  },
]
```

## JSON 树型结构转换扁平结构

根据上面已经装换好的 JSON 树形结构，进行还原成扁平结构

- **代码**

```js
function flatten(tree) {
  return tree.reduce((pre, next) => {
    let { children = [], ...rest } = next
    return pre.concat([{ ...rest }], flatten(children))
  }, [])
}
let flatArr = flatten(JsonTree)
console.log(flatArr)
```

- **结果输出**

```js
let flatArr = [
  { id: 1, title: '解忧杂货铺1', parent_id: 0 },
  { id: 2, title: '解忧杂货铺2', parent_id: 0 },
  { id: 3, title: '解忧杂货铺2-1', parent_id: 2 },
  { id: 4, title: '解忧杂货铺3-1', parent_id: 3 },
  { id: 5, title: '解忧杂货铺4-1', parent_id: 4 },
  { id: 6, title: '解忧杂货铺2-2', parent_id: 2 },
]
```
