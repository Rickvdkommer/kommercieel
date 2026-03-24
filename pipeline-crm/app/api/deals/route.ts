import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { Deal } from '@/lib/types'

const DATA_FILE = path.join(process.cwd(), 'data', 'pipeline.json')

function readDeals(): Deal[] {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8')
  return JSON.parse(raw)
}

function writeDeals(deals: Deal[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(deals, null, 2))
}

export async function GET() {
  const deals = readDeals()
  return NextResponse.json(deals)
}

export async function POST(req: NextRequest) {
  const deal: Deal = await req.json()
  const deals = readDeals()
  deals.push(deal)
  writeDeals(deals)
  return NextResponse.json(deal, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const updated: Deal = await req.json()
  const deals = readDeals()
  const index = deals.findIndex((d) => d.id === updated.id)
  if (index === -1) {
    return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
  }
  deals[index] = { ...updated, updatedAt: new Date().toISOString() }
  writeDeals(deals)
  return NextResponse.json(deals[index])
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  let deals = readDeals()
  deals = deals.filter((d) => d.id !== id)
  writeDeals(deals)
  return NextResponse.json({ success: true })
}
