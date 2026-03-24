'use client'

import { useState, useEffect } from 'react'
import { Deal, DealType, Stage, STAGES } from '@/lib/types'

interface Props {
  deal: Deal | null
  isOpen: boolean
  onClose: () => void
  onSave: (deal: Deal) => void
  onDelete?: (id: string) => void
  defaultStage?: Stage
}

export default function DealModal({
  deal,
  isOpen,
  onClose,
  onSave,
  onDelete,
  defaultStage = 'lead',
}: Props) {
  const [form, setForm] = useState({
    company: '',
    contact: '',
    email: '',
    source: '',
    value: 0,
    dealType: 'retainer' as DealType,
    notes: '',
    stage: defaultStage as Stage,
  })

  useEffect(() => {
    if (deal) {
      setForm({
        company: deal.company,
        contact: deal.contact,
        email: deal.email,
        source: deal.source,
        value: deal.value,
        dealType: deal.dealType || 'retainer',
        notes: deal.notes,
        stage: deal.stage,
      })
    } else {
      setForm({
        company: '',
        contact: '',
        email: '',
        source: '',
        value: 0,
        dealType: 'retainer',
        notes: '',
        stage: defaultStage,
      })
    }
  }, [deal, defaultStage])

  if (!isOpen) return null

  const isEdit = !!deal

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const now = new Date().toISOString()
    onSave({
      id: deal?.id || `deal-${Date.now()}`,
      ...form,
      createdAt: deal?.createdAt || now,
      updatedAt: now,
    })
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-white mb-4">
          {isEdit ? 'Edit Deal' : 'New Deal'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Company *
            </label>
            <input
              required
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Contact
              </label>
              <input
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Source
              </label>
              <input
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                placeholder="Referral, LinkedIn, etc."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Value ($)
              </label>
              <input
                type="number"
                min={0}
                value={form.value}
                onChange={(e) =>
                  setForm({ ...form, value: Number(e.target.value) })
                }
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Deal Type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, dealType: 'retainer' })}
                className={`flex-1 text-sm py-2 rounded-lg border transition-colors ${
                  form.dealType === 'retainer'
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                Retainer
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, dealType: 'one-time' })}
                className={`flex-1 text-sm py-2 rounded-lg border transition-colors ${
                  form.dealType === 'one-time'
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                One-time
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Stage</label>
            <select
              value={form.stage}
              onChange={(e) =>
                setForm({ ...form, stage: e.target.value as Stage })
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              {STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium py-2 rounded-lg transition-colors"
            >
              {isEdit ? 'Save Changes' : 'Add Deal'}
            </button>
            {isEdit && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(deal!.id)}
                className="px-4 bg-red-600/20 hover:bg-red-600/40 text-red-400 text-sm font-medium py-2 rounded-lg transition-colors"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
