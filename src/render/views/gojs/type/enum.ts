export enum PropertyTypeValue {
  public = 'public',
  private = 'private',
  protected = 'protected',
  package = 'package'
}

export enum RelationshipTypeValue {
  // 泛化
  Generalization = 'Generalization',
  // 实现
  Realization = 'Realization',
  // 组合
  Composition = 'Composition',
  // 聚合
  Aggregation = 'Aggregation',
  // 关联
  Association = 'Associations',
  // 依赖
  Dependency = 'Dependency'
}

export enum NodePortTypeValue {
  T = 'T',
  R = 'R',
  B = 'B',
  L = 'L'
}
