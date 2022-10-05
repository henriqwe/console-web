import { Edge, Node } from 'react-flow-renderer'

import {
  EnumNodeData,
  DMMFToElementsResult,
  ModelNodeData,
  RelationType,
  schemaType,
  entitiesType,
  relationFieldType,
  attributesTYPE
} from './types'

interface Relation {
  type: RelationType
  fields: entitiesType[]
}

const letters = ['A', 'B']

// TODO: figure out a good way to random spread the nodes
const generateEntityNode = (
  { name, attributes }: entitiesType,
  relations: Readonly<Record<string, Relation>>
): Node<ModelNodeData> => {
  const relationType: string[] = []
  const relationsSource: attributesTYPE[] = []
  Object.keys(relations).map((key) => {
    if (
      relations[key].fields[0].name !== name &&
      relations[key].fields[1].name === name
    )
      relationsSource.push({ ...relations[key], name: key })
  })
  const relationsTarget = attributes.filter((attribute) => {
    if (relations[attribute?._conf.type.value] as Relation | undefined) {
      relationType.push(relations[attribute._conf.type.value].type)
      return true
    }
  })

  const obj = {
    id: name,
    type: 'entity',
    position: { x: 250, y: 25 },
    data: {
      type: 'entity',
      name,
      relationsTarget,
      relationType,
      relationsSource,
      columns: attributes.map(
        ({
          name,
          _conf,
          relation
          // relationName,
          // relationFromFields,
          // relationToFields,
          // isRequired,
          // hasDefaultValue,
          // default: def,
        }) => ({
          name,
          // documentation,
          // isList = false,
          // isRequired,
          relationName: (relations[_conf.type.value] as Relation | undefined)
            ? _conf.type.value
            : undefined,
          relation,
          // relationFromFields,
          // relationToFields,
          relationType: (
            (_conf.type.value && relations[_conf.type.value]) as
              | Relation
              | undefined
          )?.type,
          // `isList` and `isRequired` are mutually exclusive as per the spec
          displayType: _conf.type.value,
          type: _conf.type.value
          // defaultValue: !hasDefaultValue
          //   ? null
          //   : typeof def === "object"
          //   ? // JSON.stringify gives us the quotes to show it's a string.
          //     // Not a perfect thing but it works ¯\_(ツ)_/¯
          //     // TODO: handle array type?
          //     `${(def as DMMF.FieldDefault).name}(${(
          //       def as DMMF.FieldDefault
          //     ).args
          //       .map((x) => JSON.stringify(x))
          //       .join(", ")})`
          //   : def.toString(),
        })
      )
    }
  }

  return obj
}

const generateRelationEdge = ([relationName, { type, fields }]: [
  string,
  Relation
]): Edge[] => {
  const base = {
    id: `e${relationName}`,
    type: 'relation',
    label: relationName,
    data: { relationType: type }
  }
  const source = fields[0]
  const target = fields[1]
  if (type === 'm-n') {
    return fields.map((col, i) => ({
      ...base,
      id: `e${relationName}-${col.name}`,
      source: col.name,
      target: `_${relationName}`,
      sourceHandle: `${source.name}-${relationName}-${target.name}`,
      targetHandle: `_${target.name}-${relationName}`
    }))
  }
  if (type === '1-n') {
    return [
      {
        ...base,
        source: source.name,
        target: target.name,
        sourceHandle: `${source.name}-${relationName}-${target.name}`,
        targetHandle: `${target.name}-${relationName}`
      }
    ]
  }
  return [
    {
      ...base,
      source: source.name,
      target: target.name,
      sourceHandle: `${source.name}-${relationName}-${target.name}`,
      targetHandle: `${target.name}-${relationName}`
    }
  ]
}

export const schemaToElements = (data: schemaType): DMMFToElementsResult => {
  const entitiesName = data.entities.map((entity) => entity.name)

  const filterFields = () =>
    data.entities.flatMap(({ name: entityName, attributes }) => {
      return attributes
        .filter((entity) => entitiesName.includes(entity?._conf.type.value))
        .map((entity) => ({ ...entity, entityName }))
    })

  const relationFields = filterFields()
  // // `pipe` typing broke so I have to do this for now. Reeeeaaaally fucking need
  // // that pipeline operator.

  const intermediate1 = groupByRelationship({
    entities: data.entities,
    relationFields
  })

  const intermediate2 = Object.entries(intermediate1).map(
    ([key, [one, two]]) => {
      return [key, { type: '1-n', fields: [one, two] }]
      // if (one.isList && two.isList)
      //   return [key, { type: "m-n", fields: [one, two] }];
      // else if (one.isList || two.isList)
      //   return [key, { type: "1-n", fields: [one, two] }];
      // else return [key, { type: "1-1", fields: [one, two] }];
    }
  )

  const relations: Readonly<Record<string, Relation>> =
    Object.fromEntries(intermediate2)

  for (const entity of data.entities) {
    for (const attribute of entity.attributes) {
      if (entitiesName.includes(attribute._conf.type.value)) {
        attribute.relation = true
      }
    }
  }
  return {
    nodes: [
      ...[...data.entities].map((entity) =>
        generateEntityNode(entity, relations)
      )
    ],
    edges: [...Object.entries(relations).flatMap(generateRelationEdge)]
  }
}

export function groupByRelationship({
  entities,
  relationFields
}: {
  entities: entitiesType[]
  relationFields: relationFieldType[]
}) {
  const objRelation: Record<string, entitiesType[]> = {}
  for (const relation of relationFields) {
    let entityRelation1: entitiesType
    let entityRelation2: entitiesType

    for (const entity of entities) {
      if (entity.name === relation.entityName) {
        entityRelation1 = entity
      }

      if (entity.name === relation._conf.type.value) {
        entityRelation2 = entity
      }
    }
    objRelation[relation.name] = [entityRelation1, entityRelation2]
  }
  return objRelation
}
