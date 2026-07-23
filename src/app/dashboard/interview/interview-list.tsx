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
  not_started: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
  learning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  revised: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  confident: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
}

const difficultyColors: Record<string, string> = {
  easy: 'text-green-600 dark:text-green-400',
  medium: 'text-yellow-600 dark:text-yellow-400',
  hard: 'text-red-600 dark:text-red-400',
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
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-8 text-center text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-800">
        Koi interview question nahi hai abhi. Pehla add karo!
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {questions.map((q) => {
        const isRevealed = revealedIds.has(q.id)
        return (
          <div key={q.id} className="bg-white dark:bg-gray-900 rounded-lg shadow p-5 border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-start mb-2">
              <p className="font-semibold flex-1 text-gray-900 dark:text-white">{q.question}</p>
              <span className={"text-xs font-medium ml-3 " + difficultyColors[q.difficulty]}>
                {q.difficulty}
              </span>
            </div>

            <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
              {q.categories?.[0]?.name || 'Uncategorized'}
            </p>

            {isRevealed ? (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded p-3 mb-3 border border-gray-100 dark:border-gray-700">
                <MarkdownContent content={q.answer} />
              </div>
            ) : (
              <button
                onClick={() => toggleReveal(q.id)}
                className="text-blue-600 dark:text-blue-400 text-sm hover:underline mb-3"
              >
                Show Answer
              </button>
            )}

            {isRevealed && (
              <button
                onClick={() => toggleReveal(q.id)}
                className="text-gray-400 dark:text-gray-500 text-xs hover:underline block mb-3"
              >
                Hide Answer
              </button>
            )}

            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
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
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
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
