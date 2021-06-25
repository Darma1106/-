## ~~修改了 gojs 源码中 Model 的接口类型改为了 GraphLinksModel~~ 当使用到 Model 类型的相关 API 时用 as GraphLinksModel 强转成 GraphLinksModel 类型

原因:GraphLinksModel 继承与 Model 但是拓展了 addLinkData、removeLinkData 等关于连线的方法

2021 年 5 月 25 日 16:00:54

---

## gojs 的 diagram 对象不要用 ref 或 reactive API 进行相应化

原因:gojs 的 addNodeData、addNodeDataCollection……以及很多操作画布的 api 都是 class Diagram 类下的私有方法,无法通过 proxy 调用

2021 年 6 月 1 日 15:07:05

---

## 尽量只使用 ref API 进行响应式代理，类型的属性尽量别使用 value

原因:经过查找接口差异以及资料，并未发现 reactive 能做但 ref 做不了的事。ref 响应式可以直接通过.value 赋值而不失去响应式，且统一接口有助于代码阅读。不使用 value 作为属性名同理，即看见.value 就能知道是操作了 ref 对象

2021 年 6 月 25 日 17:17:49
