'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import MarkdownContent from '@/components/markdown-content'

interface Question {
  id: string
  question: string
  answer: string
  difficulty: string
  status: string
  categories: { name: string }[] | null
}

const statusColors: Record<string, string> = {
  not_started: 'bg-gray-100 text-gray-600',
  learning: 'bg-yellow-100 text-yellow-700',
  revised: 'bg-blue-100 text-blue-700',
  confident: 'bg-green-100 text-green-700',
}

const difficultyColors: Record<string, string> = {
  easy: 'text-green-600',
  medium: 'text-yellow-600',
  hard: 'text-red-600',
}

export default function InterviewList({ questions }: { questions: Question[] }) {
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set())
  const router = useRouter()

  const toggleReveal = (id: string) => {
    const newSet = new Set(revealedIds)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setRevealedIds(newSet)
  }

  const updateStatus = async (id: string, status: string) => {
    const supabase = createClient()
    await supabase.from('interview_questions').update({ status }).eq('id', id)
    router.refresh()
  }

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        Koi interview question nahi hai abhi. Pehla add karo!
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {questions.map((q) => {
        const isRevealed = revealedIds.has(q.id)
        return (
          <div key={q.id} className="bg-white rounded-lg shadow p-5">
            <div className="flex justify-between items-start mb-2">
              <p className="font-semibold flex-1">{q.question}</p>
              <span className={"text-xs font-medium ml-3 " + difficultyColors[q.difficulty]}>
                {q.difficulty}
              </span>
            </div>

            <p className="text-xs text-gray-400 mb-3">
              {q.categories?.[0]?.name || 'Uncategorized'}
            </p>

            {isRevealed ? (
              <div className="bg-gray-50 rounded p-3 mb-3">
                <MarkdownContent content={q.answer} />
              </div>
            ) : (
              <button
                onClick={() => toggleReveal(q.id)}
                className="text-blue-600 text-sm hover:underline mb-3"
              >
                Show Answer
              </button>
            )}

            {isRevealed && (
              <button
                onClick={() => toggleReveal(q.id)}
                className="text-gray-400 text-xs hover:underline block mb-3"
              >
                Hide Answer
              </button>
            )}

            <div className="flex items-center justify-between border-t pt-3">
              <select
                value={q.status}
                onChange={(e) => updateStatus(q.id, e.target.value)}
                className={"text-xs px-2 py-1 rounded border-0 " + statusColors[q.status]}
              >
                <option value="not_started">Not Started</option>
                <option value="learning">Learning</option>
                <option value="revised">Revised</option>
                <option value="confident">Confident</option>
              </select>

              <Link
                href={"/dashboard/interview/" + q.id + "/edit"}
                className="text-xs text-gray-500 hover:text-blue-600"
              >
                Edit
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}
