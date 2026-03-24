'use client'

import { useState, useEffect, useCallback } from 'react'
import { TodoItem, TodoStatus, Deal, TODO_CATEGORIES } from '@/lib/types'
import TodoCard from '@/components/TodoCard'
import TodoModal from '@/components/TodoModal'

export default function TodosPage() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null)
  const [filterDealId, setFilterDealId] = useState<string>('all')
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const fetchData = useCallback(async () => {
    const [todosRes, dealsRes] = await Promise.all([
      fetch('/api/todos'),
      fetch('/api/deals'),
    ])
    const todosData = await todosRes.json()
    const dealsData = await dealsRes.json()
    setTodos(todosData)
    setDeals(dealsData)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const filteredTodos =
    filterDealId === 'all' ? todos : todos.filter((t) => t.dealId === filterDealId)

  const activeTodos = filteredTodos.filter((t) => t.status !== 'done')
  const completedTodos = filteredTodos
    .filter((t) => t.status === 'done')
    .sort((a, b) => (b.completedAt || b.updatedAt).localeCompare(a.completedAt || a.updatedAt))

  const totalItems = filteredTodos.length
  const doneCount = completedTodos.length
  const pendingCount = activeTodos.length

  function getClientName(dealId: string): string {
    return deals.find((d) => d.id === dealId)?.company || 'Unknown'
  }

  async function handleToggle(todo: TodoItem) {
    const nextStatus: Record<TodoStatus, TodoStatus> = {
      pending: 'in-progress',
      'in-progress': 'done',
      done: 'pending',
    }
    const now = new Date().toISOString()
    const nextSt = nextStatus[todo.status]
    const updated = {
      ...todo,
      status: nextSt,
      updatedAt: now,
      completedAt: nextSt === 'done' ? now : undefined,
    }

    await fetch('/api/todos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
    setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)))
  }

  async function handleMarkDone(todo: TodoItem) {
    const now = new Date().toISOString()
    const updated = {
      ...todo,
      status: 'done' as TodoStatus,
      updatedAt: now,
      completedAt: now,
    }

    await fetch('/api/todos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
    setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)))
  }

  async function handleSave(todo: TodoItem) {
    const isNew = !todos.find((t) => t.id === todo.id)
    const method = isNew ? 'POST' : 'PUT'

    await fetch('/api/todos', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    })

    if (isNew) {
      setTodos((prev) => [...prev, todo])
    } else {
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? todo : t)))
    }
    setModalOpen(false)
    setEditingTodo(null)
  }

  async function handleDelete(id: string) {
    await fetch('/api/todos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setTodos((prev) => prev.filter((t) => t.id !== id))
    setModalOpen(false)
    setEditingTodo(null)
  }

  function toggleSection(categoryId: string) {
    setCollapsed((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh] text-gray-400">
        Loading to-dos...
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">To-Dos</h1>
          <select
            value={filterDealId}
            onChange={(e) => setFilterDealId(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white"
          >
            <option value="all">All Clients</option>
            {deals.map((d) => (
              <option key={d.id} value={d.id}>{d.company}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => {
            setEditingTodo(null)
            setModalOpen(true)
          }}
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Add To-Do
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Items" value={String(totalItems)} />
        <StatCard label="Completed" value={String(doneCount)} />
        <StatCard label="Pending" value={String(pendingCount)} />
      </div>

      <div className="space-y-6">
        {TODO_CATEGORIES.map((category) => {
          const categoryTodos = activeTodos.filter((t) => t.category === category.id)
          if (categoryTodos.length === 0) return null
          const isCollapsed = collapsed[category.id]

          return (
            <div key={category.id}>
              <button
                onClick={() => toggleSection(category.id)}
                className="flex items-center gap-2 mb-3 group w-full text-left"
              >
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${isCollapsed ? '' : 'rotate-90'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                <span className={`w-2 h-2 rounded-full ${category.color}`} />
                <h2 className="text-sm font-semibold text-white">
                  {category.label}
                </h2>
                <span className="text-xs text-gray-500">
                  {categoryTodos.length}
                </span>
              </button>

              {!isCollapsed && (
                <div className="space-y-2 ml-6">
                  {categoryTodos.map((todo) => (
                    <TodoCard
                      key={todo.id}
                      todo={todo}
                      clientName={getClientName(todo.dealId)}
                      onToggle={handleToggle}
                      onMarkDone={handleMarkDone}
                      onClick={(t) => {
                        setEditingTodo(t)
                        setModalOpen(true)
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {activeTodos.length === 0 && completedTodos.length === 0 && (
          <p className="text-gray-500 text-center py-12">
            No to-dos yet. Add your first one above.
          </p>
        )}

        {activeTodos.length === 0 && completedTodos.length > 0 && (
          <p className="text-green-400/60 text-center py-8 text-sm">
            All done! Check your completed items below.
          </p>
        )}
      </div>

      {completedTodos.length > 0 && (
        <div className="mt-10">
          <button
            onClick={() => toggleSection('__completed')}
            className="flex items-center gap-2 mb-4 w-full text-left"
          >
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${collapsed['__completed'] ? '' : 'rotate-90'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <h2 className="text-sm font-semibold text-white">Completed</h2>
            <span className="text-xs text-gray-500">{completedTodos.length}</span>
          </button>

          {!collapsed['__completed'] && (
            <div className="space-y-2 ml-6">
              {completedTodos.map((todo) => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  clientName={getClientName(todo.dealId)}
                  onToggle={handleToggle}
                  onMarkDone={handleMarkDone}
                  onClick={(t) => {
                    setEditingTodo(t)
                    setModalOpen(true)
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <TodoModal
        todo={editingTodo}
        isOpen={modalOpen}
        deals={deals}
        onClose={() => {
          setModalOpen(false)
          setEditingTodo(null)
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
