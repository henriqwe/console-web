import React, { memo } from 'react'
import {
  EdgeProps,
  EdgeText,
  getEdgeCenter,
  getSmoothStepPath
} from 'react-flow-renderer'

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
  const [centerX, centerY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition
  })
  const path = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 8
  })

  const text = label ? (
    <EdgeText
      x={centerX}
      y={centerY}
      label={label}
      labelStyle={labelStyle}
      labelShowBg={labelShowBg}
      labelBgStyle={labelBgStyle}
      labelBgPadding={labelBgPadding}
      labelBgBorderRadius={labelBgBorderRadius}
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
        className="text-gray-400 stroke-current stroke-2 fill-none"
        d={path}
        markerStart={markerStart}
        markerEnd={markerEnd}
      />
      {text}
    </>
  )
}

export default memo(RelationEdge)
