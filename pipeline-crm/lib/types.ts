export type Stage =
  | 'lead'
  | 'contacted'
  | 'discovery'
  | 'proposal'
  | 'negotiation'
  | 'won'
  | 'lost'

export type DealType = 'retainer' | 'one-time'

export interface Deal {
  id: string
  company: string
  contact: string
  email: string
  source: string
  value: number
  dealType: DealType
  notes: string
  stage: Stage
  createdAt: string
  updatedAt: string
}

export type CallOutcome = 'won' | 'lost' | 'follow-up' | 'no-show'

export interface CallAnalysis {
  id: string
  dealId: string
  company: string
  contact: string
  date: string
  transcriptFile: string
  duration: string
  outcome: CallOutcome
  score: number
  summary: string
  wentWell: string[]
  toImprove: string[]
  keyTakeaways: string[]
  followUpDate?: string
}

export type TodoCategory = 'immediate' | 'amazon-sts' | 'phase-2' | 'misc'
export type TodoStatus = 'pending' | 'in-progress' | 'done'

export interface TodoItem {
  id: string
  dealId: string
  title: string
  description: string
  category: TodoCategory
  status: TodoStatus
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export const TODO_CATEGORIES: { id: TodoCategory; label: string; color: string }[] = [
  { id: 'immediate', label: 'Immediate / This Week', color: 'bg-red-500' },
  { id: 'amazon-sts', label: 'Amazon STS Deliverables', color: 'bg-amber-500' },
  { id: 'phase-2', label: 'Later / Phase 2', color: 'bg-blue-500' },
  { id: 'misc', label: 'Misc Notes', color: 'bg-gray-500' },
]

export const STAGES: { id: Stage; label: string; color: string }[] = [
  { id: 'lead', label: 'Lead', color: 'bg-slate-500' },
  { id: 'contacted', label: 'Contacted', color: 'bg-blue-500' },
  { id: 'discovery', label: 'Discovery', color: 'bg-purple-500' },
  { id: 'proposal', label: 'Proposal', color: 'bg-amber-500' },
  { id: 'negotiation', label: 'Negotiation', color: 'bg-orange-500' },
  { id: 'won', label: 'Won', color: 'bg-green-500' },
  { id: 'lost', label: 'Lost', color: 'bg-red-500' },
]
