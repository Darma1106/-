import type { ColumnProps } from 'ant-design-vue/lib/table/interface'
interface DataItem {
  key: string
  name?: string
  age?: number | string
  address?: string
}
export interface MTable {
  data: DataItem[]
  colums: ColumnProps[]
}
export const dataMap: Map<string, MTable | string> = new Map()
const dataSource: DataItem[] = [
  {
    key: '0',
    name: 'Edward King 0',
    age: 32,
    address: 'London, Park Lane no. 0'
  },
  {
    key: '1',
    name: 'Edward King 1',
    age: 32,
    address: 'London, Park Lane no. 1'
  }
]
const data002: MTable = {
  colums: [
    {
      title: '任务名称',
      dataIndex: 'name',
      width: '30%',
      slots: { customRender: 'name' }
    },
    {
      title: '效能',
      dataIndex: 'age'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      slots: { customRender: 'operation' }
    }
  ],
  data: [
    {
      key: '0',
      name: '任务1'
    }
  ]
}

const data102: MTable = {
  colums: [
    {
      title: '任务名称',
      dataIndex: 'name',
      width: '30%',
      slots: { customRender: 'name' }
    },
    {
      title: '效能',
      dataIndex: 'age'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      slots: { customRender: 'operation' }
    }
  ],
  data: [
    {
      key: '0',
      name: '任务1'
    }
  ]
}

const data200: MTable = {
  colums: [
    {
      title: '属性名称',
      dataIndex: 'name',
      width: '30%',
      slots: { customRender: 'name' }
    },
    {
      title: '属性值',
      dataIndex: 'age'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      slots: { customRender: 'operation' }
    }
  ],
  data: [
    {
      key: '0',
      name: '属性1'
    }
  ]
}

const data201: MTable = {
  colums: [
    {
      title: '服务名称',
      dataIndex: 'name',
      width: '30%',
      slots: { customRender: 'name' }
    },
    {
      title: '效能',
      dataIndex: 'age'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      slots: { customRender: 'operation' }
    }
  ],
  data: [
    {
      key: '0',
      name: '活动1'
    }
  ]
}

const data300: MTable = {
  colums: [
    {
      title: '资源名称',
      dataIndex: 'name',
      width: '30%',
      slots: { customRender: 'name' }
    },
    {
      title: '效能',
      dataIndex: 'age'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      slots: { customRender: 'operation' }
    }
  ],
  data: [
    {
      key: '0',
      name: '资源1'
    }
  ]
}

const data301: MTable = {
  colums: [
    {
      title: '属性名称',
      dataIndex: 'name',
      width: '30%',
      slots: { customRender: 'name' }
    },
    {
      title: '效能',
      dataIndex: 'age'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      slots: { customRender: 'operation' }
    }
  ],
  data: [
    {
      key: '0',
      name: '属性1'
    }
  ]
}

dataMap.set('0-0-2', data002)
dataMap.set('0-2-2', data102)
dataMap.set('0-3-0', data200)
dataMap.set('0-3-1', data201)
dataMap.set('0-4-0', data300)
dataMap.set('0-4-1', data301)

const lct = `{ "class": "GraphLinksModel",
  "copiesArrays": true,
  "copiesArrayObjects": true,
  "nodeDataArray": [ 
{"key":"ec2fbd92-14e9-4936-b143-014cfef3078e", "figure":"RoundedRectangle", "fill":"#FFFEDF", "text":"活动", "category":"defaultNode", "type":"ServiceTask", "showContext":false, "loc":"-263.503125 -354"},
{"key":"75e1672b-0e42-4057-903e-8ddfd0f3b6f7", "figure":"RoundedRectangle", "fill":"#FFFEDF", "text":"活动", "category":"defaultNode", "type":"ServiceTask", "showContext":false, "loc":"-430.953125 -289"},
{"key":"21a08b5a-2773-4d9e-aa2a-ed21b07bf90a", "figure":"RoundedRectangle", "fill":"#FFFEDF", "text":"活动", "category":"defaultNode", "type":"ServiceTask", "showContext":false, "loc":"-430.953125 -411"},
{"key":"fe8a2d0a-0f67-4ef3-94e2-dc79d3849448", "figure":"Diamond", "fill":"#FFFEDF", "text":"活动", "category":"defaultNode", "type":"ServiceTask", "showContext":false, "loc":"-76.203125 -354"},
{"key":"3d371456-b877-45cc-bc57-b4d57914a1aa", "figure":"RoundedRectangle", "fill":"#FFFEDF", "text":"活动", "category":"defaultNode", "type":"ServiceTask", "showContext":false, "loc":"90.796875 -508", "size":"100 45"},
{"key":"cc4ba31d-60b7-423e-9ade-87b5699bcdbd", "figure":"RoundedRectangle", "fill":"#FFFEDF", "text":"活动", "category":"defaultNode", "type":"ServiceTask", "showContext":false, "loc":"108.796875 -344", "size":"100 45"},
{"key":"9921a908-b54b-4102-9deb-f743778f4713", "figure":"RoundedRectangle", "fill":"#FFFEDF", "text":"活动", "category":"defaultNode", "type":"ServiceTask", "showContext":false, "loc":"282.396875 -165", "size":"100 45"},
{"key":"501b6c19-3e3c-4e9c-8286-38d075ccd68f", "figure":"Diamond", "fill":"#FFFEDF", "text":"活动", "category":"defaultNode", "type":"ServiceTask", "showContext":false, "loc":"500.0968749999997 -165"},
{"key":"277c57f4-1687-43bd-95cb-24bb66e214fc", "figure":"Diamond", "fill":"#FFFEDF", "text":"活动", "category":"defaultNode", "type":"ServiceTask", "showContext":false, "loc":"312.446875 -354"},
{"key":"32db6357-a49f-4fc2-9bfb-a8b17d04767b", "figure":"RoundedRectangle", "fill":"#FFFEDF", "text":"活动", "category":"defaultNode", "type":"ServiceTask", "showContext":false, "loc":"83.796875 -165", "size":"100 45"},
{"key":"3d371456-b877-45cc-bc57-b4d57914a1aa2", "figure":"RoundedRectangle", "fill":"#FFFEDF", "text":"活动", "category":"defaultNode", "type":"ServiceTask", "showContext":false, "loc":"333.296875 -505.5", "size":"100 40"},
{"key":"32db6357-a49f-4fc2-9bfb-a8b17d04767b2", "figure":"RoundedRectangle", "fill":"#FFFEDF", "text":"活动", "category":"defaultNode", "type":"ServiceTask", "showContext":false, "loc":"391.4468750000001 -423.29999999999995", "size":"100 45"},
{"key":"9921a908-b54b-4102-9deb-f743778f47132", "figure":"RoundedRectangle", "fill":"#FFFEDF", "text":"活动", "category":"defaultNode", "type":"ServiceTask", "showContext":false, "loc":"590.0468750000001 -423.29999999999995", "size":"100 45"},
{"key":"9921a908-b54b-4102-9deb-f743778f471322", "figure":"RoundedRectangle", "fill":"#FFFEDF", "text":"活动", "category":"defaultNode", "type":"ServiceTask", "showContext":false, "loc":"738.0968750000001 -423.29999999999995", "size":"100 45"},
{"key":"9921a908-b54b-4102-9deb-f743778f4713222", "figure":"RoundedRectangle", "fill":"#FFFEDF", "text":"活动", "category":"defaultNode", "type":"ServiceTask", "showContext":false, "loc":"918.7948859374998 -278.3999999999999", "size":"100 45"},
{"key":"9921a908-b54b-4102-9deb-f743778f471323", "figure":"RoundedRectangle", "fill":"#FFFEDF", "text":"活动", "category":"defaultNode", "type":"ServiceTask", "showContext":false, "loc":"598.446875 -278.3999999999999", "size":"100 45"},
{"key":"32db6357-a49f-4fc2-9bfb-a8b17d04767b22", "figure":"RoundedRectangle", "fill":"#FFFEDF", "text":"活动", "category":"defaultNode", "type":"ServiceTask", "showContext":false, "loc":"399.84687499999995 -278.3999999999999", "size":"100 45"},
{"key":"9921a908-b54b-4102-9deb-f743778f4713223", "figure":"RoundedRectangle", "fill":"#FFFEDF", "text":"活动", "category":"defaultNode", "type":"ServiceTask", "showContext":false, "loc":"1034.1941975 -423.2999999999999", "size":"100 45"},
{"key":"9921a908-b54b-4102-9deb-f743778f471324", "figure":"RoundedRectangle", "fill":"#FFFEDF", "text":"活动", "category":"defaultNode", "type":"ServiceTask", "showContext":false, "loc":"884.1441975000001 -423.29999999999995", "size":"100 45"},
{"key":"9921a908-b54b-4102-9deb-f743778f47132222", "figure":"RoundedRectangle", "fill":"#FFFEDF", "text":"活动", "category":"defaultNode", "type":"ServiceTask", "showContext":false, "loc":"1204.8078700460937 -308", "size":"120 25"}
 ],
  "linkDataArray": [ 
{"from":"21a08b5a-2773-4d9e-aa2a-ed21b07bf90a", "to":"ec2fbd92-14e9-4936-b143-014cfef3078e", "category":"avoidLink", "id":"f7c3e58c-161d-46a4-ba6c-c1c62b578432", "text":"流程条件", "points":[-365.953125,-378.5,-355.953125,-378.5,-314.728125,-378.5,-314.728125,-332.3333333333333,-273.503125,-332.3333333333333,-263.503125,-332.3333333333333]},
{"from":"75e1672b-0e42-4057-903e-8ddfd0f3b6f7", "to":"ec2fbd92-14e9-4936-b143-014cfef3078e", "category":"avoidLink", "id":"5580bc17-b95c-465e-af30-e05aecc5a315", "text":"流程条件", "points":[-365.953125,-256.5,-355.953125,-256.5,-314.728125,-256.5,-314.728125,-310.6666666666667,-273.503125,-310.6666666666667,-263.503125,-310.6666666666667]},
{"from":"ec2fbd92-14e9-4936-b143-014cfef3078e", "to":"fe8a2d0a-0f67-4ef3-94e2-dc79d3849448", "category":"avoidLink", "id":"361e7ee8-145e-4cb9-a760-a5f5b8a0ef60", "text":"流程条件", "points":[-198.503125,-321.5,-188.503125,-321.5,-137.353125,-321.5,-137.353125,-321.5,-86.203125,-321.5,-76.203125,-321.5]},
{"from":"fe8a2d0a-0f67-4ef3-94e2-dc79d3849448", "to":"cc4ba31d-60b7-423e-9ade-87b5699bcdbd", "category":"avoidLink", "id":"c87765e8-6ae9-4eb2-b0ba-541401f4e969", "text":"流程条件", "points":[-11.203125,-321.5,-1.203125,-321.5,98.796875,-321.5,108.796875,-321.5]},
{"from":"fe8a2d0a-0f67-4ef3-94e2-dc79d3849448", "to":"3d371456-b877-45cc-bc57-b4d57914a1aa", "category":"avoidLink", "id":"42895b9f-a10c-46f6-9e9a-c1f99abb7f5b", "text":"流程条件", "points":[-43.703125,-354,-43.703125,-364,-43.703125,-475.5,18.546875,-475.5,80.796875,-475.5,90.796875,-475.5], "fromSpot":"TopSide", "toSpot":"LeftSide"},
{"from":"fe8a2d0a-0f67-4ef3-94e2-dc79d3849448", "to":"32db6357-a49f-4fc2-9bfb-a8b17d04767b", "category":"avoidLink", "id":"864daeb3-e2f0-44ee-a60c-6dea2a42fe67", "text":"流程条件", "points":[-43.703125,-289,-43.703125,-279,-43.703125,-132.5,15.046875,-132.5,73.796875,-132.5,83.796875,-132.5], "fromSpot":"BottomSide", "toSpot":"LeftSide"},
{"from":"3d371456-b877-45cc-bc57-b4d57914a1aa", "to":"3d371456-b877-45cc-bc57-b4d57914a1aa2", "category":"avoidLink", "id":"ec25f638-f90b-4951-b083-949b81bcc5ef", "text":"流程条件", "points":[210.796875,-475.5,220.796875,-475.5,272.046875,-475.5,272.046875,-475.5,323.296875,-475.5,333.296875,-475.5]},
{"from":"cc4ba31d-60b7-423e-9ade-87b5699bcdbd", "to":"277c57f4-1687-43bd-95cb-24bb66e214fc", "category":"avoidLink", "id":"7817dad2-7899-4168-ac49-fd021c20ca1d", "text":"流程条件", "points":[208.796875,-321.5,218.796875,-321.5,302.446875,-321.5,312.446875,-321.5]},
{"from":"32db6357-a49f-4fc2-9bfb-a8b17d04767b", "to":"9921a908-b54b-4102-9deb-f743778f4713", "category":"avoidLink", "id":"bfe2b4c3-ac21-489b-908a-8640ed3b79c3", "text":"流程条件", "points":[203.796875,-132.5,213.796875,-132.5,243.096875,-132.5,243.096875,-132.5,272.396875,-132.5,282.396875,-132.5]},
{"from":"9921a908-b54b-4102-9deb-f743778f4713", "to":"501b6c19-3e3c-4e9c-8286-38d075ccd68f", "category":"avoidLink", "id":"e9915571-b156-4f29-a2c7-75ecb4897e17", "text":"流程条件", "points":[402.396875,-132.5,412.396875,-132.5,451.2468749999999,-132.5,451.2468749999999,-132.5,490.0968749999997,-132.5,500.0968749999997,-132.5]},
{"from":"32db6357-a49f-4fc2-9bfb-a8b17d04767b2", "to":"9921a908-b54b-4102-9deb-f743778f47132", "category":"avoidLink", "id":"bfe2b4c3-ac21-489b-908a-8640ed3b79c3", "text":"流程条件", "points":[491.4468750000001,-400.79999999999995,501.4468750000001,-400.79999999999995,540.746875,-400.79999999999995,540.746875,-400.79999999999995,580.0468750000001,-400.79999999999995,590.0468750000001,-400.79999999999995]},
{"from":"9921a908-b54b-4102-9deb-f743778f47132", "to":"9921a908-b54b-4102-9deb-f743778f471322", "category":"avoidLink", "id":"9e4fde80-e8d5-43ca-a93a-623f773dd7c4", "text":"流程条件", "points":[690.0468750000001,-400.79999999999995,700.0468750000001,-400.79999999999995,714.0718750000001,-400.79999999999995,714.0718750000001,-400.79999999999995,728.0968750000001,-400.79999999999995,738.0968750000001,-400.79999999999995]},
{"from":"277c57f4-1687-43bd-95cb-24bb66e214fc", "to":"32db6357-a49f-4fc2-9bfb-a8b17d04767b2", "category":"avoidLink", "id":"083f79b1-e2a0-4fcb-85c5-81c35b03574d", "text":"流程条件", "points":[344.946875,-354,344.946875,-364,344.946875,-400.79999999999995,363.19687500000003,-400.79999999999995,381.4468750000001,-400.79999999999995,391.4468750000001,-400.79999999999995], "fromSpot":"TopSide", "toSpot":"LeftSide"},
{"from":"9921a908-b54b-4102-9deb-f743778f471323", "to":"9921a908-b54b-4102-9deb-f743778f4713222", "category":"avoidLink", "id":"9e4fde80-e8d5-43ca-a93a-623f773dd7c4", "text":"流程条件", "points":[698.446875,-255.89999999999992,708.446875,-255.89999999999992,808.6208804687499,-255.89999999999992,808.6208804687499,-255.89999999999992,908.7948859374998,-255.89999999999992,918.7948859374998,-255.89999999999992]},
{"from":"32db6357-a49f-4fc2-9bfb-a8b17d04767b22", "to":"9921a908-b54b-4102-9deb-f743778f471323", "category":"avoidLink", "id":"bfe2b4c3-ac21-489b-908a-8640ed3b79c3", "text":"流程条件", "points":[499.84687499999995,-255.89999999999992,509.84687499999995,-255.89999999999992,549.1468749999999,-255.89999999999992,549.1468749999999,-255.89999999999992,588.446875,-255.89999999999992,598.446875,-255.89999999999992]},
{"from":"277c57f4-1687-43bd-95cb-24bb66e214fc", "to":"32db6357-a49f-4fc2-9bfb-a8b17d04767b22", "category":"avoidLink", "id":"42c93169-8bc0-4184-ab13-40bb6a086d74", "text":"流程条件", "points":[344.946875,-289,344.946875,-279,344.946875,-255.89999999999992,367.39687499999997,-255.89999999999992,389.84687499999995,-255.89999999999992,399.84687499999995,-255.89999999999992], "fromSpot":"BottomSide", "toSpot":"LeftSide"},
{"from":"9921a908-b54b-4102-9deb-f743778f471324", "to":"9921a908-b54b-4102-9deb-f743778f4713223", "category":"avoidLink", "id":"9e4fde80-e8d5-43ca-a93a-623f773dd7c4", "text":"流程条件", "points":[984.1441975000001,-400.79999999999995,994.1441975000001,-400.79999999999995,1024.1941975,-400.7999999999999,1034.1941975,-400.7999999999999]},
{"from":"9921a908-b54b-4102-9deb-f743778f471322", "to":"9921a908-b54b-4102-9deb-f743778f471324", "category":"avoidLink", "id":"8b201954-7e3c-4c0b-8b11-f2552ab34729", "text":"流程条件", "points":[838.0968750000001,-400.79999999999995,848.0968750000001,-400.79999999999995,874.1441975000001,-400.79999999999995,884.1441975000001,-400.79999999999995]},
{"from":"501b6c19-3e3c-4e9c-8286-38d075ccd68f", "to":"9921a908-b54b-4102-9deb-f743778f471323", "category":"avoidLink", "id":"0dde34f4-25a9-4cdd-8462-834ae977b893", "text":"流程条件", "points":[565.0968749999997,-132.5,575.0968749999997,-132.5,648.446875,-132.5,648.446875,-177.94999999999996,648.446875,-223.39999999999992,648.446875,-233.39999999999992]},
{"from":"9921a908-b54b-4102-9deb-f743778f4713222", "to":"9921a908-b54b-4102-9deb-f743778f47132222", "category":"avoidLink", "id":"666f8462-06e5-4c10-bbf9-74e752c8d609", "text":"流程条件", "points":[1018.7948859374998,-255.89999999999992,1028.7948859374997,-255.89999999999992,1194.807921871988,-287.1360511392755,1204.807921871988,-287.1360511392755], "fromSpot":"RightSide", "toSpot":"BottomSide"},
{"from":"3d371456-b877-45cc-bc57-b4d57914a1aa2", "to":"9921a908-b54b-4102-9deb-f743778f47132222", "category":"avoidLink", "id":"960f9d62-5a02-4c3a-942b-9829f6532927", "text":"流程条件", "points":[433.296875,-485.5,443.296875,-485.5,1293.359375,-475,1290.0805696447765,-317.80844189044655,1290.0805696447765,-307.80844189044655], "toSpot":"RightSide"},
{"from":"9921a908-b54b-4102-9deb-f743778f4713223", "to":"9921a908-b54b-4102-9deb-f743778f47132222", "category":"avoidLink", "id":"0a9f0c4e-2f5f-4205-a1da-e1007d87256e", "text":"流程条件", "points":[1134.1941975,-400.7999999999999,1144.1941975,-400.7999999999999,1267.359375,-399,1264.8078700460937,-318,1264.8078700460937,-308], "fromSpot":"RightSide"}
 ]}`

const hdt = `{ "class": "GraphLinksModel",
  "copiesArrays": true,
  "copiesArrayObjects": true,
  "nodeDataArray": [ 
{"key":"265e9bd8-946c-41d2-a368-d0eb66638417", "figure":"RoundedRectangle", "fill":"green", "fontColor":"white", "text":"地面运控\\应用系统", "category":"defaultNode", "showContext":false, "loc":"-72.953125 -310", "size":"360 180"},
{"key":"b2cac7d0-82f3-40ea-ac11-c4b1cf805de5", "figure":"RoundedRectangle", "fill":"green", "fontColor":"white", "text":"航天侦察情报信息共享服务系统 (二代分发系统)", "category":"defaultNode", "showContext":false, "loc":"439.046875 -85", "size":"120 120"},
{"key":"1673a377-cb80-451f-b631-7465b40ced2f", "figure":"RoundedRectangle", "fill":"green", "fontColor":"white", "text":"航天侦察用户", "category":"defaultNode", "showContext":false, "loc":"130.046875 133", "size":"120 120"},
{"key":"f9234fdb-7a97-407a-9005-e361ef63cb70", "figure":"RoundedRectangle", "fill":"green", "fontColor":"white", "text":"测控系统", "category":"defaultNode", "showContext":false, "loc":"-45.953125 133", "size":"120 120"},
{"key":"ca5a513a-5e00-44d0-90ca-2b8b214bec35", "figure":"RoundedRectangle", "fill":"green", "fontColor":"white", "text":"中继系统", "category":"defaultNode", "showContext":false, "loc":"-395.953125 -287", "size":"120 120"},
{"key":"7377709d-8450-4620-8638-c12bcd956623", "figure":"RoundedRectangle", "fill":"green", "fontColor":"white", "text":"卫星", "category":"defaultNode", "showContext":false, "loc":"-395.953125 133", "size":"120 120"}
 ],
  "linkDataArray": [ 
{"from":"265e9bd8-946c-41d2-a368-d0eb66638417", "to":"b2cac7d0-82f3-40ea-ac11-c4b1cf805de5", "category":"defaultLink", "id":"9b40984e-4043-4871-b1a3-94a7fe9a08b9", "text":"数据产品\n情报产品", "points":[287.046875,-220,297.046875,-220,429.046875,-25,439.046875,-25], "toSpot":"LeftSide", "fromSpot":"RightSide"},
{"from":"b2cac7d0-82f3-40ea-ac11-c4b1cf805de5", "to":"1673a377-cb80-451f-b631-7465b40ced2f", "category":"defaultLink", "id":"2ec4b2fe-58f7-4597-bd8e-d127eec938eb", "text":"数据产品\n情报产品", "points":[499.046875,35,499.046875,45,260.046875,193,250.046875,193], "fromSpot":"BottomSide", "toSpot":"RightSide"},
{"from":"1673a377-cb80-451f-b631-7465b40ced2f", "to":"265e9bd8-946c-41d2-a368-d0eb66638417", "category":"defaultLink", "id":"6b15be21-65bd-443a-bd2d-ea301d4a4d78", "text":"数据需求\n情报需求", "points":[190.046875,133,190.046875,123,176.05841372967126,-120.10339033898086,176.05841372967126,-130.10339033898086], "fromSpot":"TopSide", "toSpot":"BottomSide"},
{"from":"265e9bd8-946c-41d2-a368-d0eb66638417", "to":"f9234fdb-7a97-407a-9005-e361ef63cb70", "category":"defaultLink", "id":"0edcb52e-36eb-4391-8402-de47e4415aaa", "text":"轨道根数\n尖兵卫星\n侦察数据", "points":[-39.45992854179076,-130.23878937932537,-39.45992854179076,-120.23878937932537,-36.42536102801312,123.11768606845902,-36.42536102801312,133.11768606845902]},
{"from":"f9234fdb-7a97-407a-9005-e361ef63cb70", "to":"265e9bd8-946c-41d2-a368-d0eb66638417", "category":"defaultLink", "id":"293c6fd8-9ad1-40ed-b920-756bce4472df", "text":"载荷指令\n载荷测控计划\n跟踪接收计划", "points":[65.88158809644516,133.12196935410645,65.88158809644516,123.12196935410645,67.0660279891955,-120.04309422568988,67.0660279891955,-130.04309422568988], "toSpot":"BottomSide"},
{"from":"ca5a513a-5e00-44d0-90ca-2b8b214bec35", "to":"265e9bd8-946c-41d2-a368-d0eb66638417", "category":"defaultLink", "id":"6915a66e-b0be-4ffd-9a06-3bd845c50f84", "text":"跟踪接收计划", "points":[-275.953125,-247,-265.953125,-247,-82.953125,-250,-72.953125,-250]},
{"from":"265e9bd8-946c-41d2-a368-d0eb66638417", "to":"ca5a513a-5e00-44d0-90ca-2b8b214bec35", "category":"defaultLink", "id":"1cd68415-73ac-428d-866f-b88ecec1c643", "text":"侦察数据", "points":[-72.953125,-190,-82.953125,-190,-265.953125,-207,-275.953125,-207]},
{"from":"ca5a513a-5e00-44d0-90ca-2b8b214bec35", "to":"7377709d-8450-4620-8638-c12bcd956623", "category":"defaultLink", "id":"63920d18-207d-468b-a4e0-10b7b0ad03b3", "text":"\n载荷控制指令(紧急情况下)", "points":[-382.2361214778106,-167.10435749930392,-382.2361214778106,-157.10435749930392,-380.6551522810731,123.09928344336205,-380.6551522810731,133.09928344336205], "toSpot":"TopSide"},
{"from":"7377709d-8450-4620-8638-c12bcd956623", "to":"ca5a513a-5e00-44d0-90ca-2b8b214bec35", "category":"defaultLink", "id":"748f780e-b06d-48bf-9611-9597de2c9adf", "text":"侦察数据\n遥测数据\n\n\n\n\n\n\n.", "points":[-291.67766859989285,133.09791192926684,-291.67766859989285,123.09791192926684,-288.5062795385152,-157.10808031910935,-288.5062795385152,-167.10808031910935], "toSpot":"BottomSide"},
{"from":"7377709d-8450-4620-8638-c12bcd956623", "to":"f9234fdb-7a97-407a-9005-e361ef63cb70", "category":"defaultLink", "id":"d34bbbcb-662f-4d92-aea0-e027083b28c8", "text":"测控系统_卫星", "points":[-275.953125,213,-265.953125,213,-55.953125,213,-45.953125,213], "fromSpot":"RightSide", "toSpot":"LeftSide"},
{"from":"f9234fdb-7a97-407a-9005-e361ef63cb70", "to":"7377709d-8450-4620-8638-c12bcd956623", "category":"defaultLink", "id":"c475cbd0-a940-4595-8392-59fa4d42e79e", "text":"卫星_测控系统", "points":[-45.953125,173,-55.953125,173,-265.953125,173,-275.953125,173], "toSpot":"RightSide"}
 ]}`

dataMap.set('lct', lct)
dataMap.set('hdt', hdt)
