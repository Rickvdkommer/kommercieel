import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { CallAnalysis } from '@/lib/types'

const DATA_FILE = path.join(process.cwd(), 'data', 'calls.json')

function readCalls(): CallAnalysis[] {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8')
  return JSON.parse(raw)
}

function writeCalls(calls: CallAnalysis[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(calls, null, 2))
}

export async function GET() {
  const calls = readCalls()
  return NextResponse.json(calls)
}

export async function POST(req: NextRequest) {
  const call: CallAnalysis = await req.json()
  const calls = readCalls()
  calls.push(call)
  writeCalls(calls)
  return NextResponse.json(call, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const updated: CallAnalysis = await req.json()
  const calls = readCalls()
  const index = calls.findIndex((c) => c.id === updated.id)
  if (index === -1) {
    return NextResponse.json({ error: 'Call not found' }, { status: 404 })
  }
  calls[index] = updated
  writeCalls(calls)
  return NextResponse.json(calls[index])
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  let calls = readCalls()
  calls = calls.filter((c) => c.id !== id)
  writeCalls(calls)
  return NextResponse.json({ success: true })
}
