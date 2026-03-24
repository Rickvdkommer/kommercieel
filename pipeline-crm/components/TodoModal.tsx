'use client'

import { useState, useEffect } from 'react'
import { TodoItem, TodoCategory, TodoStatus, TODO_CATEGORIES, Deal } from '@/lib/types'

export default function TodoModal({
  todo,
  isOpen,
  deals,
  onClose,
  onSave,
  onDelete,
}: {
  todo: TodoItem | null
  isOpen: boolean
  deals: Deal[]
  onClose: () => void
  onSave: (todo: TodoItem) => void
  onDelete: (id: string) => void
}) {
  const [form, setForm] = useState<TodoItem>(emptyTodo())

  useEffect(() => {
    if (todo) {
      setForm(todo)
    } else {
      setForm(emptyTodo())
    }
  }, [todo, isOpen])

  if (!isOpen) return null

  function set(field: keyof TodoItem, value: string) {
    setForm((prev) => ({ ...prev, [field]: value, updatedAt: new Date().toISOString() }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-lg font-bold text-white mb-4">
          {todo ? 'Edit To-Do' : 'New To-Do'}
        </h2>

        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Client</label>
            <select
              value={form.dealId}
              onChange={(e) => set('dealId', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="">Select client...</option>
              {deals.map((d) => (
                <option key={d.id} value={d.id}>{d.company}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
            >
              {TODO_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => set('status', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white resize-none"
            />
          </div>
        </div>

        <div className="flex justify-between mt-5">
          <div>
            {todo && (
              <button
                onClick={() => onDelete(todo.id)}
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

function emptyTodo(): TodoItem {
  const now = new Date().toISOString()
  return {
    id: `todo-${Date.now()}`,
    dealId: 'deal-1',
    title: '',
    description: '',
    category: 'immediate',
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  }
}
