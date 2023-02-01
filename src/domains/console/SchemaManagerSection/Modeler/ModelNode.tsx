import cc from 'classcat'
import React, { useEffect, useState } from 'react'
import { Handle, Position } from 'reactflow'

import { ModelNodeData } from './types'

type ColumnData = ModelNodeData['columns'][number]

const isTarget = ({
  kind,
  isList,
  relationFromFields,
  relationName,
  relationType
}: ColumnData) =>
  kind === 'enum' ||
  ((relationType === '1-n' || relationType === 'm-n') && !isList) ||
  (relationType === '1-1' && !relationFromFields?.length) ||
  // Fallback for implicit m-n tables (maybe they should act like the child in a
  // 1-n instead)
  (kind === 'scalar' && !!relationName)

const isSource = ({ isList, relationFromFields, relationType }: ColumnData) =>
  ((relationType === '1-n' || relationType === 'm-n') && isList) ||
  (relationType === '1-1' && !!relationFromFields?.length)

const ModelNode = ({ data }: ModelNodeProps) => {
  const [additionalColumns, setAdditionalColumns] = useState<number[]>([])
  function handleStyle(index: number) {
    return { top: 78 + index * 33, right: -6 }
  }

  useEffect(() => {
    if (data) {
      const columnsLength = data.columns.filter(
        (col) => col.relation !== true
      )?.length
      const relationsTargetLength = data?.relationsTarget?.length!
      const relationsSourceLength = data?.relationsSource?.length!

      if (
        columnsLength < relationsTargetLength ||
        columnsLength < relationsSourceLength
      ) {
        const _additionalColumns: number[] = []
        if (
          relationsTargetLength === relationsSourceLength ||
          relationsTargetLength > relationsSourceLength
        ) {
          _additionalColumns.length = relationsTargetLength - columnsLength
        }

        if (relationsTargetLength < relationsSourceLength) {
          _additionalColumns.length = relationsSourceLength - columnsLength
        }
        _additionalColumns.fill(1, 0)
        setAdditionalColumns(_additionalColumns)
      }
    }
  }, [data])

  return (
    <table
      className="font-sans bg-white border-2 border-separate border-black rounded-lg dark:border-gray-400"
      style={{ minWidth: 200, maxWidth: 500, borderSpacing: 0 }}
    >
      <thead title={data.documentation}>
        <tr>
          <th
            className={cc([
              'p-2 font-extrabold  border-b-2 border-black dark:border-gray-400 rounded-t-md ',
              {
                'bg-gray-200 dark:bg-gray-800': data.command === '',
                'bg-red-200': data.command === 'd',
                'bg-green-200': data.command === 'c'
              }
            ])}
            colSpan={4}
          >
            <div className="flex flex-col">
              <span className="text-xs"> &lt;&lt;Entity&gt;&gt;</span>
              <span>{data.name}</span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.columns
          .filter((col) => col.relation !== true)
          .map((col) => (
            <tr
              key={col.name}
              className={
                '!first:!border-4 !first:!border-red-500 dark:bg-gray-700'
              }
              title={col.documentation}
            >
              <td className="font-mono font-semibold">
                <p
                  className={cc([
                    'relative',
                    'py-1',
                    'px-2',
                    {
                      'cursor-pointer': isTarget(col) || isSource(col),
                      'bg-red-200': col.command === 'd',
                      'bg-green-200': col.command === 'c',
                      'bg-yellow-200': col.command === 'u'
                    }
                  ])}
                >
                  {col.name}:{' '}
                  <span className="text-gray-500">{col.displayType}</span>
                </p>
              </td>
            </tr>
          ))}
        {additionalColumns.map((_, idx) => (
          <tr
            key={idx}
            className={
              '!first:!border-4 !first:!border-red-500 dark:bg-gray-700'
            }
          >
            <td className="font-mono font-semibold">
              <p className={cc(['relative', 'py-1', 'px-2', 'h-6'])}></p>
            </td>
          </tr>
        ))}
        {data.relationsTarget?.map((relations, idx) => {
          return (
            <Handle
              key={`${data.name}-${relations.name}`}
              className={'!border-4 !h-4 !w-4 !bg-gray-700 -ml-1'}
              type="source"
              id={`${data.name}-${relations.name}-${relations._conf.type.value}`}
              position={Position.Right}
              isConnectable={false}
              style={handleStyle(idx)}
            />
          )
        })}
        {data.relationsSource?.map((relations, idx) => {
          return (
            <Handle
              key={`${data.name}-${relations.name}`}
              className={'!border-4 !h-4 !w-4 bg-gray-700'}
              type="target"
              id={`${data.name}-${relations.name}`}
              position={Position.Left}
              isConnectable={false}
              style={handleStyle(idx)}
            />
          )
        })}
      </tbody>
    </table>
  )
}
export interface ModelNodeProps {
  data: ModelNodeData
}

export default ModelNode
