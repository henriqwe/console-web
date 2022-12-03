import React, { memo } from 'react'
import { EdgeProps, EdgeLabelRenderer, getSmoothStepPath } from 'reactflow'

import { RelationEdgeData } from './types'

const RelationEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  labelStyle,
  labelShowBg,
  labelBgBorderRadius,
  labelBgPadding,
  labelBgStyle,
  data
}: EdgeProps<RelationEdgeData>) => {
  const [path, centerX, centerY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition
  })
  const text = label ? (
    <EdgeLabelRenderer
      x={centerX}
      y={centerY}
      label={label}
      labelStyle={labelStyle}
      labelShowBg={labelShowBg}
      labelBgStyle={labelBgStyle}
      labelBgPadding={labelBgPadding}
      labelBgBorderRadius={labelBgBorderRadius}
      className={'z-50'}
      style={{ zIndex: 99999 }}
    />
  ) : null

  const { relationType } = data!
  const [markerStart, markerEnd] = {
    'm-n': ['url(#er-many)', 'url(#er-many)'],
    '1-n': ['url(#er-1n)', 'url(#er-n1)'],
    '1-1': ['url(#er-one)', 'url(#er-one)']
  }[relationType]

  // TODO: markers look weird when the edge needs to rotate perpendicular to the
  // start or end. Maybe need to edit `getSmoothStepPath` so it adds some sort
  // of padding at start and end to make it look nicer?
  return (
    <>
      <path
        className="text-gray-400 stroke-current stroke-2 fill-transparent"
        d={path}
        markerStart={markerStart}
        markerEnd={markerEnd}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${centerX}px,${centerY}px)`
          }}
          className="bg-white text-xs p-1 dark:bg-slate-600 rounded-md"
        >
          {label}
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

export default memo(RelationEdge)
