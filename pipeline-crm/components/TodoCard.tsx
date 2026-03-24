'use client'

import { useRef } from 'react'
import { TodoItem, TODO_CATEGORIES } from '@/lib/types'

const statusStyles: Record<string, string> = {
  pending: 'border-gray-600',
  'in-progress': 'border-amber-500 bg-amber-500/20',
  done: 'border-green-500 bg-green-500',
}

export default function TodoCard({
  todo,
  clientName,
  onToggle,
  onMarkDone,
  onClick,
}: {
  todo: TodoItem
  clientName: string
  onToggle: (todo: TodoItem) => void
  onMarkDone: (todo: TodoItem) => void
  onClick: (todo: TodoItem) => void
}) {
  const category = TODO_CATEGORIES.find((c) => c.id === todo.category)
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
    onClick(todo)
  }

  return (
    <div
      className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-start gap-3 cursor-pointer hover:border-gray-700 transition-colors select-text"
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggle(todo)
        }}
        className={`mt-0.5 w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center transition-colors ${statusStyles[todo.status]}`}
      >
        {todo.status === 'done' && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
        {todo.status === 'in-progress' && (
          <div className="w-2 h-2 rounded-full bg-amber-500" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3
            className={`text-sm font-medium ${
              todo.status === 'done' ? 'text-gray-500 line-through' : 'text-white'
            }`}
          >
            {todo.title}
          </h3>
        </div>
        {todo.description && (
          <p className="text-xs text-gray-400 line-clamp-2 mb-2">{todo.description}</p>
        )}
        <div className="flex items-center gap-2">
          {category && (
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${category.color}/20 text-white`}
            >
              {category.label}
            </span>
          )}
          <span className="text-[10px] text-gray-500">{clientName}</span>
          {todo.status !== 'done' && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMarkDone(todo)
              }}
              className="ml-auto text-[10px] font-medium text-green-400 hover:text-green-300 border border-green-400/30 hover:border-green-400/60 px-2 py-0.5 rounded-full transition-colors"
            >
              Mark Done
            </button>
          )}
          {todo.completedAt && (
            <span className="ml-auto text-[10px] text-gray-500">
              Done {new Date(todo.completedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
