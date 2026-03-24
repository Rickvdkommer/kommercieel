'use client'

import { useRef } from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { Deal } from '@/lib/types'

interface Props {
  deal: Deal
  index: number
  onClick: (deal: Deal) => void
}

export default function DealCard({ deal, index, onClick }: Props) {
  const mouseDownPos = useRef<{ x: number; y: number } | null>(null)

  return (
    <Draggable draggableId={deal.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onMouseDown={(e) => {
            mouseDownPos.current = { x: e.clientX, y: e.clientY }
            const dragProps = provided.dragHandleProps as any
            dragProps?.onMouseDown?.(e)
          }}
          onClick={(e) => {
            const selection = window.getSelection()
            if (selection && selection.toString().length > 0) return
            if (mouseDownPos.current) {
              const dx = Math.abs(e.clientX - mouseDownPos.current.x)
              const dy = Math.abs(e.clientY - mouseDownPos.current.y)
              if (dx > 5 || dy > 5) return
            }
            onClick(deal)
          }}
          className={`p-3 rounded-lg border cursor-pointer transition-colors select-text ${
            snapshot.isDragging
              ? 'bg-gray-700 border-gray-500 shadow-lg'
              : 'bg-gray-800 border-gray-700 hover:border-gray-500'
          }`}
        >
          <div className="font-semibold text-sm text-white truncate">
            {deal.company}
          </div>
          {deal.contact && (
            <div className="text-xs text-gray-400 mt-1">{deal.contact}</div>
          )}
          {deal.value > 0 && (
            <div className="text-xs text-green-400 mt-1 font-medium">
              ${deal.value.toLocaleString()}{deal.dealType === 'retainer' ? '/mo' : ''}
            </div>
          )}
          {deal.source && (
            <div className="text-xs text-gray-500 mt-1">{deal.source}</div>
          )}
        </div>
      )}
    </Draggable>
  )
}
