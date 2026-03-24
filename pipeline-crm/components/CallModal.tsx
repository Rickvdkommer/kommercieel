'use client'

import { useState, useEffect } from 'react'
import { CallAnalysis, CallOutcome } from '@/lib/types'

const OUTCOMES: CallOutcome[] = ['won', 'lost', 'follow-up', 'no-show']

export default function CallModal({
  call,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: {
  call: CallAnalysis | null
  isOpen: boolean
  onClose: () => void
  onSave: (call: CallAnalysis) => void
  onDelete: (id: string) => void
}) {
  const [form, setForm] = useState<CallAnalysis>(emptyCall())

  useEffect(() => {
    if (call) {
      setForm(call)
    } else {
      setForm(emptyCall())
    }
  }, [call, isOpen])

  if (!isOpen) return null

  function set(field: keyof CallAnalysis, value: string | number | string[]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleArrayChange(field: 'wentWell' | 'toImprove' | 'keyTakeaways', value: string) {
    set(field, value.split('\n').filter(Boolean))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-lg font-bold text-white mb-4">
          {call ? 'Edit Call Analysis' : 'New Call Analysis'}
        </h2>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <Input label="Company" value={form.company} onChange={(v) => set('company', v)} />
          <Input label="Contact" value={form.contact} onChange={(v) => set('contact', v)} />
          <Input label="Date" value={form.date} onChange={(v) => set('date', v)} type="date" />
          <Input label="Duration" value={form.duration} onChange={(v) => set('duration', v)} placeholder="e.g. 14:31" />
          <Input label="Deal ID" value={form.dealId} onChange={(v) => set('dealId', v)} />
          <Input label="Transcript File" value={form.transcriptFile} onChange={(v) => set('transcriptFile', v)} />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Outcome</label>
            <select
              value={form.outcome}
              onChange={(e) => set('outcome', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
            >
              {OUTCOMES.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Score (1-10)</label>
            <input
              type="number"
              min={1}
              max={10}
              value={form.score}
              onChange={(e) => set('score', parseInt(e.target.value) || 1)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>
        </div>

        <TextArea label="Summary" value={form.summary} onChange={(v) => set('summary', v)} />
        <TextArea
          label="What went well (one per line)"
          value={form.wentWell.join('\n')}
          onChange={(v) => handleArrayChange('wentWell', v)}
        />
        <TextArea
          label="To improve (one per line)"
          value={form.toImprove.join('\n')}
          onChange={(v) => handleArrayChange('toImprove', v)}
        />
        <TextArea
          label="Key takeaways (one per line)"
          value={form.keyTakeaways.join('\n')}
          onChange={(v) => handleArrayChange('keyTakeaways', v)}
        />

        <Input label="Follow-up date" value={form.followUpDate || ''} onChange={(v) => set('followUpDate', v)} type="date" />

        <div className="flex justify-between mt-5">
          <div>
            {call && (
              <button
                onClick={() => onDelete(call.id)}
                className="text-sm text-red-400 hover:text-red-300 px-3 py-2"
              >
                Delete
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="text-sm text-gray-400 hover:text-white px-4 py-2 border border-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(form)}
              className="text-sm text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function emptyCall(): CallAnalysis {
  return {
    id: `call-${Date.now()}`,
    dealId: '',
    company: '',
    contact: '',
    date: new Date().toISOString().split('T')[0],
    transcriptFile: '',
    duration: '',
    outcome: 'follow-up',
    score: 5,
    summary: '',
    wentWell: [],
    toImprove: [],
    keyTakeaways: [],
  }
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
}) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
      />
    </div>
  )
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="mb-3">
      <label className="block text-xs text-gray-400 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white resize-none"
      />
    </div>
  )
}
