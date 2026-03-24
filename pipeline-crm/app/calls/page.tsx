'use client'

import { useState, useEffect, useCallback } from 'react'
import { CallAnalysis } from '@/lib/types'
import CallCard from '@/components/CallCard'
import CallModal from '@/components/CallModal'

export default function CallsPage() {
  const [calls, setCalls] = useState<CallAnalysis[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCall, setEditingCall] = useState<CallAnalysis | null>(null)

  const fetchCalls = useCallback(async () => {
    const res = await fetch('/api/calls')
    const data = await res.json()
    setCalls(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchCalls()
  }, [fetchCalls])

  async function handleSave(call: CallAnalysis) {
    const isNew = !calls.find((c) => c.id === call.id)
    const method = isNew ? 'POST' : 'PUT'

    await fetch('/api/calls', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(call),
    })

    if (isNew) {
      setCalls((prev) => [...prev, call])
    } else {
      setCalls((prev) => prev.map((c) => (c.id === call.id ? call : c)))
    }
    setModalOpen(false)
    setEditingCall(null)
  }

  async function handleDelete(id: string) {
    await fetch('/api/calls', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setCalls((prev) => prev.filter((c) => c.id !== id))
    setModalOpen(false)
    setEditingCall(null)
  }

  const totalCalls = calls.length
  const avgScore = totalCalls
    ? (calls.reduce((sum, c) => sum + c.score, 0) / totalCalls).toFixed(1)
    : '—'
  const winRate = totalCalls
    ? Math.round((calls.filter((c) => c.outcome === 'won').length / totalCalls) * 100)
    : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh] text-gray-400">
        Loading calls...
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Sales Calls</h1>
        <button
          onClick={() => {
            setEditingCall(null)
            setModalOpen(true)
          }}
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Add Call
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Calls" value={String(totalCalls)} />
        <StatCard label="Avg Score" value={avgScore} />
        <StatCard label="Win Rate" value={`${winRate}%`} />
      </div>

      <div className="space-y-4">
        {calls.map((call) => (
          <CallCard
            key={call.id}
            call={call}
            onEdit={(c) => {
              setEditingCall(c)
              setModalOpen(true)
            }}
          />
        ))}
        {calls.length === 0 && (
          <p className="text-gray-500 text-center py-12">
            No call analyses yet. Add your first one above.
          </p>
        )}
      </div>

      <CallModal
        call={editingCall}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingCall(null)
        }}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  )
}
