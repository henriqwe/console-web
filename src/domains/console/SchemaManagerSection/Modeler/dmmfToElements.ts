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
    if (relations[attribute._conf.type.value] as Relation | undefined) {
      relationType.push(relations[attribute._conf.type.value].type)
      return true
    }
  })

  console.group('generateEntityNode')
  console.log('name', name)
  console.log('attributes', attributes)
  console.log('relations', relations)
  console.log('relationType', relationType)
  console.log('__relationsTarget', relationsTarget)
  console.log('__relationsSource', relationsSource)

  console.groupEnd()

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

const generateRelationEdge_ycl = ([relationName, { type, fields }]: [
  string,
  Relation
]): Edge[] => {
  const base = {
    id: `e${relationName}`,
    type: 'relation',
    label: relationName,
    data: { relationType: type }
  }

  if (type === 'm-n')
    return fields.map((col, i) => ({
      ...base,
      id: `e${relationName}-${col.tableName}-${col.type}`,
      source: col.tableName,
      target: `_${relationName}`,
      sourceHandle: `${col.tableName}-${col.relationName}-${col.name}`,
      targetHandle: `_${relationName}-${letters[i]}`
    }))
  else if (type === '1-n') {
    // console.log("fields", fields);
    const source = fields[0]
    const target = fields[1]

    return [
      {
        ...base,
        source: source.name,
        target: target.name,
        sourceHandle: `${source.name}-${relationName}-${target.name}`,
        targetHandle: `${target.name}-${relationName}`
      }
    ]
  } else
    return [
      {
        ...base,
        source: fields[0].tableName,
        target: fields[0].type,
        sourceHandle: `${fields[0].tableName}-${relationName}-${fields[0].name}`,
        targetHandle: `${fields[0].type}-${relationName}`
      }
    ]
}

// issue, need to look into it a bit better at some point.

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

  console.group('-----------------schemaToElements')
  console.log('data.entities', data.entities)

  console.log('relationFields', relationFields)
  console.log('intermediate2', intermediate2)
  console.log('relations', relations)

  console.groupEnd()

  // console.log("relations", relations);
  // const implicitManyToMany = Object.entries(relations)
  //   .filter(([, { type }]) => type === "m-n")
  //   .map(
  //     ([relationName, { fields }]) =>
  //       ({
  //         name: `_${relationName}`,
  //         dbName: null,
  //         fields: fields.map((field, i) => ({
  //           name: letters[i],
  //           kind: "scalar",
  //           isList: false,
  //           isRequired: true,
  //           // CBA to fuck with some other shit in the ModelNode, so this is a
  //           // "hack" to get the corresponding letter on the handle ID. In the
  //           // future it'd probably be a better idea to make __ALL__ handles
  //           // take the shape of `table-columnName-relationName/foreignName`????
  //           relationName: letters[i],
  //           hasDefaultValue: false,
  //           // this is gonna break on composite ids i think lol
  //           type: data.models
  //             .find((m) => m.name === field.type)
  //             ?.fields.find((x) => x.isId)?.type,
  //         })),
  //       } as DMMF.Model)
  //   );

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  for (const entity of data.entities)
    for (const attribute of entity.attributes)
      if (entitiesName.includes(attribute._conf.type.value))
        attribute.relation = true

  return {
    nodes: [
      ...[...data.entities].map((entity) =>
        generateEntityNode(entity, relations)
      )
    ],
    edges: [...Object.entries(relations).flatMap(generateRelationEdge_ycl)]
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
      if (entity.name === relation.entityName) entityRelation1 = entity

      if (entity.name === relation._conf.type.value) entityRelation2 = entity
    }
    objRelation[relation.name] = [entityRelation1, entityRelation2]
  }
  return objRelation
}
