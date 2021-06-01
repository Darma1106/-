### 修改了 gojs 源码中 Model 的接口类型改为了 GraphLinksModel

2021 年 5 月 25 日 16:00:54
原因:GraphLinksModel 继承与 Model 但是拓展了 addLinkData、removeLinkData 等关于连线的方法

### gojs 的 diagram 对象不要用 ref 或 reactive API 进行相应化

2021 年 6 月 1 日 15:07:05
原因:gojs 的 addNodeData、addNodeDataCollection……以及很多操作画布的 api 都是 class Diagram 类下的私有方法,无法通过 proxy 调用
