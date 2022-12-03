import { useCallback, useEffect, useMemo, useState } from 'react'
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  Node,
  applyNodeChanges,
  applyEdgeChanges
} from 'reactflow'
import dagre from 'dagre'
import EnumNode from './EnumNode'
import ModelNode from './ModelNode'
import RelationEdge from './RelationEdge'
import { schemaToElements } from './dmmfToElements'
import type {
  DMMFToElementsResult,
  EnumNodeData,
  ModelNodeData,
  schemaType
} from './types'

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
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))

  const nodeWidth = 250
  const nodeHeight = 250

  const getLayoutedElements = (
    nodes: (Node<EnumNodeData> | Node<ModelNodeData>)[],
    edges: Edge<any>[],
    direction = 'TB'
  ) => {
    const isHorizontal = direction === 'LR'
    dagreGraph.setGraph({ rankdir: direction })

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
    })

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target)
    })

    dagre.layout(dagreGraph)

    nodes.forEach((node) => {
      const nodeWithPosition = dagreGraph.node(node.id)
      node.targetPosition = isHorizontal ? 'left' : 'top'
      node.sourcePosition = isHorizontal ? 'right' : 'bottom'

      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2
      }

      return node
    })

    return { nodes, edges }
  }

  const { nodes, edges } = useMemo(
    () =>
      schema
        ? schemaToElements(schema)
        : ({ nodes: [], edges: [] } as DMMFToElementsResult),
    [schema]
  )

  const [initialNodes, setInitialNodes] = useState(nodes)
  const [initialEdges, setInitialEdges] = useState(edges)

  const onNodesChange = useCallback(
    (changes) => setInitialNodes((nds) => applyNodeChanges(changes, nds)),
    []
  )
  const onEdgesChange = useCallback(
    (changes) => setInitialEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  )

  useEffect(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges
    )
    setInitialNodes(layoutedNodes)
    setInitialEdges(layoutedEdges)
  }, [nodes, edges])

  return (
    <>
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        minZoom={0.1}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        fitView
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
            markerWidth="12.5"
            markerHeight="12.5"
            viewBox="-10 -10 20 20"
            orient="auto-start-reverse"
            refX="0"
            refY="0"
          >
            <polyline
              className="text-gray-400 stroke-current"
              strokeWidth="3"
              strokeLinecap="square"
              fill="none"
              points="-10,-8 -10,8"
            />
          </marker>

          <marker
            id="er-n1"
            markerWidth="12.5"
            markerHeight="12.5"
            viewBox="-10 -10 20 20"
            orient="auto-start-reverse"
            refX="0"
            refY="0"
          >
            <polyline
              className="text-gray-400 stroke-current"
              strokeLinejoin="round"
              strokeLinecap="square"
              strokeWidth="1.5"
              fill="none"
              points="0,-8 -10,0 0,8"
            />
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
