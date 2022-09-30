/* eslint-disable react/no-unknown-property */
import React, { useMemo } from 'react'
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls
} from 'react-flow-renderer'

import EnumNode from './EnumNode'
import ModelNode from './ModelNode'
import RelationEdge from './RelationEdge'
import { schemaToElements } from './dmmfToElements'
import type { DMMFToElementsResult, schemaType } from './types'

const nodeTypes = {
  entity: ModelNode,
  enum: EnumNode
}

const edgeTypes = {
  relation: RelationEdge
}

const FlowView = ({ schema }: FlowViewProps) => {
  // TODO: move to controlled nodes/edges, and change this to generate a NodeChanges[] as a diff so that positions gets preserved.
  // Will be more complex but gives us better control over how they're handled, and makes storing locations EZ.
  // https://reactflow.dev/docs/guides/migrate-to-v10/#11-controlled-nodes-and-edges

  const { nodes: nodes_ycl, edges: edges_ycl } = useMemo(
    () =>
      schema
        ? schemaToElements(schema)
        : ({ nodes: [], edges: [] } as DMMFToElementsResult),
    [schema]
  )

  return (
    <>
      <ReactFlow
        defaultNodes={nodes_ycl}
        defaultEdges={edges_ycl}
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        minZoom={0.1}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={2}
          color="currentColor"
          className="text-gray-200 dark:text-gray-700"
        />
        <Controls />
      </ReactFlow>
      <svg width="0" height="0">
        <defs>
          <marker
            id="er-1n"
            markerWidth="32.5"
            markerHeight="12.5"
            viewBox="-20 0 20 20"
            orient="auto-start-reverse"
            refX="0"
            refY="0"
          >
            <text
              x="-35"
              y="15"
              fill="gray"
              className="text-gray-400 stroke-current text-xs"
            >
              1..*
            </text>
          </marker>
          <marker
            id="er-n1"
            markerWidth="22.5"
            markerHeight="12.5"
            viewBox="-10 -20 20 20"
            orient="auto-start-reverse"
            refX="0"
            refY="0"
          >
            <text
              x="-10"
              y="-15"
              fill="gray"
              className="text-gray-400 stroke-current text-xs"
              rotate={180}
            >
              1
            </text>
          </marker>
        </defs>
      </svg>
    </>
  )
}

export interface FlowViewProps {
  schema: schemaType | undefined
}

export default FlowView
