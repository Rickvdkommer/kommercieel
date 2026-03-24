import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { TodoItem } from '@/lib/types'

const DATA_FILE = path.join(process.cwd(), 'data', 'todos.json')

function readTodos(): TodoItem[] {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8')
  return JSON.parse(raw)
}

function writeTodos(todos: TodoItem[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2))
}

export async function GET() {
  const todos = readTodos()
  return NextResponse.json(todos)
}

export async function POST(req: NextRequest) {
  const todo: TodoItem = await req.json()
  const todos = readTodos()
  todos.push(todo)
  writeTodos(todos)
  return NextResponse.json(todo, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const updated: TodoItem = await req.json()
  const todos = readTodos()
  const index = todos.findIndex((t) => t.id === updated.id)
  if (index === -1) {
    return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
  }
  todos[index] = updated
  writeTodos(todos)
  return NextResponse.json(todos[index])
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  let todos = readTodos()
  todos = todos.filter((t) => t.id !== id)
  writeTodos(todos)
  return NextResponse.json({ success: true })
}
