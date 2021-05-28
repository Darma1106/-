import type { NodeData, LinkData } from './type'

export const nodeData: NodeData[] = [
  {
    key: 1,
    name: '通知',
    location: { x: 703.632273358529, y: -58.500000000000028 },
    properties: [
      { name: 'faultList', type: '故障单', visibility: 'private' },
      { name: 'require', type: '制接需求单', visibility: 'private' },
      { name: 'influenceServiceList', type: '影响业务', visibility: 'private' }
    ]
  },
  {
    key: 11,
    name: '制接需求单',
    location: { x: 706.7645467170579, y: 261.5 }
  },
  {
    key: 12,
    name: '影响业务',
    location: { x: 941.7645467170579, y: 259.5 }
  },
  {
    key: 13,
    name: '故障单',
    location: { x: 1311.7645467170582, y: -42 }
  },
  {
    key: 14,
    name: '通知电路',
    location: { x: 1104.7645467170582, y: 101.5 }
  },
  {
    key: 121,
    name: '业务',
    location: { x: 1211.7645467170582, y: 258.5 }
  },
  {
    key: 2,
    name: 'Notice',
    location: { x: 627.509124763087, y: -276.5 },
    properties: [
      { name: 'id', type: 'Long', visibility: 'private' },
      { name: 'name', type: 'String', visibility: 'private' },
      { name: 'replyList', type: 'List', visibility: 'private' }
    ]
  },
  {
    key: 3,
    name: 'NoticeService',
    type: 'interface',
    location: { x: 274, y: -287.5 }
  },
  {
    key: 31,
    name: 'NoticeServiceImpl',
    location: { x: 274, y: -79.5 },
    properties: [{ name: 'baseDao', type: 'baseDao', visibility: 'private' }],
    methods: [
      { name: 'save', parameters: [{ name: 'Notice', type: 'Notice' }], type: 'void', visibility: 'public' },
      { name: 'findNoticeByID', parameters: [{ name: 'Long', type: 'Long' }], type: 'void', visibility: 'public' }
    ]
  },
  {
    key: 311,
    name: 'BaseDao',
    location: { x: 274, y: 88.5 },
    properties: [{ name: 'findObjectById(Long)', type: 'Notice', visibility: 'private' }]
  },
  {
    key: 3111,
    location: { x: 274, y: 265.5 },
    name: 'BaseDaoImpl'
  },
  {
    key: 4,
    name: '回复',
    location: { x: 1009.5533040557319, y: -437.5 }
  },
  {
    key: 5,
    name: '业务重保通知',
    location: { x: 1009.5533040557319, y: -260 }
  },
  {
    key: 51,
    name: '预案库',
    location: { x: 1339.5533040557319, y: -260 }
  }
]

export const linkData: LinkData[] = [
  { from: 121, to: 12, relationship: 'Aggregation' },
  { from: 12, to: 1, relationship: 'Composition' },
  { from: 11, to: 1, relationship: 'Aggregation' },
  { from: 1, to: 2, relationship: 'Generalization' },
  { from: 1, to: 13, relationship: 'Association' },
  { from: 14, to: 13, relationship: 'Dependency', fromPort: 'T', toPort: 'L' },
  { from: 31, to: 2, relationship: 'Dependency', fromPort: 'R', toPort: 'L' },
  { from: 31, to: 3, relationship: 'Realization' },
  { from: 31, to: 311, relationship: 'Dependency' },
  { from: 3111, to: 311, relationship: 'Realization' },
  { from: 4, to: 2, relationship: 'Composition' },
  { from: 5, to: 2, relationship: 'Generalization' },
  { from: 51, to: 5, relationship: 'Aggregation' }
]
