import { Edge, Node } from 'reactflow'

export type RelationType = '1-1' | '1-n' | 'm-n'

export interface SchemaError {
  reason: string
  row: string
}

export interface EnumNodeData {
  type: 'enum'
  name: string
  dbName?: string | null
  documentation?: string
  values: string[]
}

export interface ModelNodeData {
  type: 'model'
  name: string
  command: '' | 'c' | 'd'
  dbName?: string | null
  documentation?: string
  relationsTarget?: attributesTYPE[]
  relationsSource?: attributesTYPE[]
  relationType?: string[]
  columns: Array<{
    name: string
    command: '' | 'c' | 'd' | 'u'
    type: string
    displayType: string
    kind: string
    documentation?: string
    isList: boolean
    isRequired: boolean
    relation?: boolean
    relationName?: string | null
    relationFromFields?: string[] | null
    relationToFields?: string[] | null
    defaultValue?: string | null
    relationType?: RelationType | null
  }>
}

export interface RelationEdgeData {
  relationType: RelationType
}

export enum ErrorTypes {
  Prisma,
  Other
}
/* eslint-enable */

export interface DMMFToElementsResult {
  nodes: Array<Node<EnumNodeData> | Node<ModelNodeData>>
  edges: Edge[]
}

export interface schemaType {
  command: string
  entities: entitiesType[]
  name: string
  _conf: {
    enable: {
      command: string
      value: boolean
    }
  }
}

export interface entitiesType {
  attributes: attributesTYPE[]
  command: string
  name: string
  _conf: {
    accessControl: { read: string[]; write: string[] }
    businessRule: boolean
    concurrencyControl: boolean
    dbType: string
    indexKey: any[]
    uniqueKey: any[]
  }
}

export interface attributesTYPE {
  command: string
  name: string
  relationName?: string
  relation?: boolean
  _conf: {
    nullable?: boolean
    length?: string
    type: {
      value: string
      command: string
    }
  }
}

export interface relationFieldType {
  entityName: string
  command: string
  name: string
  _conf: {
    type: {
      value: string
      command: string
    }
  }
}
