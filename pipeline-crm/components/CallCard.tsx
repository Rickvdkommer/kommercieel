'use client'

import { useState, useRef } from 'react'
import { CallAnalysis } from '@/lib/types'

const outcomeColors: Record<string, string> = {
  won: 'bg-green-500/20 text-green-400',
  lost: 'bg-red-500/20 text-red-400',
  'follow-up': 'bg-amber-500/20 text-amber-400',
  'no-show': 'bg-gray-500/20 text-gray-400',
}

function scoreColor(score: number): string {
  if (score >= 8) return 'text-green-400'
  if (score >= 6) return 'text-amber-400'
  return 'text-red-400'
}

export default function CallCard({
  call,
  onEdit,
}: {
  call: CallAnalysis
  onEdit: (call: CallAnalysis) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const mouseDownPos = useRef<{ x: number; y: number } | null>(null)

  function handleMouseDown(e: React.MouseEvent) {
    mouseDownPos.current = { x: e.clientX, y: e.clientY }
  }

  function handleClick(e: React.MouseEvent) {
    const selection = window.getSelection()
    if (selection && selection.toString().length > 0) return
    if (mouseDownPos.current) {
      const dx = Math.abs(e.clientX - mouseDownPos.current.x)
      const dy = Math.abs(e.clientY - mouseDownPos.current.y)
      if (dx > 5 || dy > 5) return
    }
    setExpanded(!expanded)
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div
        className="cursor-pointer select-text"
        onMouseDown={handleMouseDown}
        onClick={handleClick}
      >
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-white font-semibold text-lg">{call.company}</h3>
            <p className="text-gray-400 text-sm">
              {call.contact} &middot; {call.date} &middot; {call.duration}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-2xl font-bold ${scoreColor(call.score)}`}>
              {call.score}/10
            </span>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                outcomeColors[call.outcome]
              }`}
            >
              {call.outcome}
            </span>
          </div>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed">{call.summary}</p>
        <p className="text-gray-500 text-xs mt-2">
          {expanded ? 'Click to collapse' : 'Click to expand analysis'}
        </p>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-800 space-y-4">
          <Section title="What went well" items={call.wentWell} color="text-green-400" />
          <Section title="To improve" items={call.toImprove} color="text-red-400" />
          <Section title="Key takeaways" items={call.keyTakeaways} color="text-blue-400" />

          {call.followUpDate && (
            <p className="text-sm text-gray-400">
              Follow-up date: <span className="text-white">{call.followUpDate}</span>
            </p>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit(call)
            }}
            className="text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-lg transition-colors"
          >
            Edit Analysis
          </button>
        </div>
      )}
    </div>
  )
}

function Section({
  title,
  items,
  color,
}: {
  title: string
  items: string[]
  color: string
}) {
  return (
    <div>
      <h4 className={`text-sm font-semibold mb-1.5 ${color}`}>{title}</h4>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-gray-300 flex gap-2">
            <span className="text-gray-600 shrink-0">&bull;</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
