'use client'

import { useState, useEffect, useCallback } from 'react'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { Deal, Stage, STAGES } from '@/lib/types'
import Column from './Column'
import DealModal from './DealModal'

export default function Board() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchDeals = useCallback(async () => {
    const res = await fetch('/api/deals')
    const data = await res.json()
    setDeals(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchDeals()
  }, [fetchDeals])

  async function handleDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return

    const deal = deals.find((d) => d.id === draggableId)
    if (!deal) return

    const newStage = destination.droppableId as Stage
    const updated = { ...deal, stage: newStage }

    // Optimistic update
    setDeals((prev) =>
      prev.map((d) => (d.id === draggableId ? updated : d))
    )

    await fetch('/api/deals', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
  }

  async function handleSave(deal: Deal) {
    const isNew = !deals.find((d) => d.id === deal.id)
    const method = isNew ? 'POST' : 'PUT'

    await fetch('/api/deals', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deal),
    })

    if (isNew) {
      setDeals((prev) => [...prev, deal])
    } else {
      setDeals((prev) => prev.map((d) => (d.id === deal.id ? deal : d)))
    }
    setModalOpen(false)
    setEditingDeal(null)
  }

  async function handleDelete(id: string) {
    await fetch('/api/deals', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setDeals((prev) => prev.filter((d) => d.id !== id))
    setModalOpen(false)
    setEditingDeal(null)
  }

  function openEdit(deal: Deal) {
    setEditingDeal(deal)
    setModalOpen(true)
  }

  function openNew() {
    setEditingDeal(null)
    setModalOpen(true)
  }

  const activeDeals = deals.filter((d) => d.stage !== 'lost')
  const retainerValue = activeDeals
    .filter((d) => d.dealType === 'retainer')
    .reduce((sum, d) => sum + d.value, 0)
  const oneTimeValue = activeDeals
    .filter((d) => d.dealType === 'one-time')
    .reduce((sum, d) => sum + d.value, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Loading pipeline...
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-49px)] flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div>
          <p className="text-sm text-gray-400">
            {deals.length} deals &middot; $
            {retainerValue.toLocaleString()}/mo{oneTimeValue > 0 && ` + $${oneTimeValue.toLocaleString()} one-time`}
          </p>
        </div>
        <button
          onClick={openNew}
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Add Deal
        </button>
      </header>

      <div className="flex-1 overflow-x-auto p-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-3 h-full">
            {STAGES.map((stage) => (
              <Column
                key={stage.id}
                stageId={stage.id}
                deals={deals.filter((d) => d.stage === stage.id)}
                onDealClick={openEdit}
              />
            ))}
          </div>
        </DragDropContext>
      </div>

      <DealModal
        deal={editingDeal}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingDeal(null)
        }}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  )
}
