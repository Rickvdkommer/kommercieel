'use client'

import { Droppable } from '@hello-pangea/dnd'
import { Deal, Stage, STAGES } from '@/lib/types'
import DealCard from './DealCard'

interface Props {
  stageId: Stage
  deals: Deal[]
  onDealClick: (deal: Deal) => void
}

export default function Column({ stageId, deals, onDealClick }: Props) {
  const stage = STAGES.find((s) => s.id === stageId)!
  const totalValue = deals.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="flex flex-col min-w-[260px] w-[260px] bg-gray-900 rounded-xl">
      <div className="p-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
          <span className="font-semibold text-sm text-white">
            {stage.label}
          </span>
          <span className="text-xs text-gray-500 ml-auto">
            {deals.length}
          </span>
        </div>
        {totalValue > 0 && (
          <div className="text-xs text-gray-400 mt-1">
            ${totalValue.toLocaleString()}/mo
          </div>
        )}
      </div>
      <Droppable droppableId={stageId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-2 space-y-2 overflow-y-auto column-scroll min-h-[100px] transition-colors rounded-b-xl ${
              snapshot.isDraggingOver ? 'bg-gray-800/50' : ''
            }`}
          >
            {deals.map((deal, i) => (
              <DealCard
                key={deal.id}
                deal={deal}
                index={i}
                onClick={onDealClick}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
