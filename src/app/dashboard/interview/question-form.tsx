'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Topic {
  id: string
  name: string
}

interface ExistingQuestion {
  id: string
  question: string
  answer: string
  topic_id: string | null
  difficulty: string
}

export default function QuestionForm({
  topics,
  existing,
}: {
  topics: Topic[]
  existing?: ExistingQuestion
}) {
  const searchParams = useSearchParams()
  const preselectedTopic = searchParams.get('topic') || ''

  const [question, setQuestion] = useState(existing?.question || '')
  const [answer, setAnswer] = useState(existing?.answer || '')
  const [topicId, setTopicId] = useState(existing?.topic_id || preselectedTopic)
  const [difficulty, setDifficulty] = useState(existing?.difficulty || 'medium')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()

    if (existing) {
      const { error } = await supabase
        .from('interview_questions')
        .update({
          question,
          answer,
          topic_id: topicId || null,
          difficulty,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)

      setLoading(false)
      if (error) {
        setError(error.message)
        return
      }
    } else {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('Login expired')
        setLoading(false)
        return
      }

      const { error } = await supabase.from('interview_questions').insert({
        question,
        answer,
        topic_id: topicId || null,
        difficulty,
        user_id: user.id,
      })

      setLoading(false)
      if (error) {
        setError(error.message)
        return
      }
    }

    router.push(topicId ? "/dashboard/interview/topic/" + topicId : '/dashboard/interview')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 transition-colors">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard/interview" className="text-purple-600 dark:text-purple-400 text-xs mb-4 inline-block">
          ← Back to Interview Prep
        </Link>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 sm:p-8 rounded-xl">
          <h1 className="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100">
            {existing ? 'Edit Question' : 'Add Interview Question'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Question</label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                placeholder="e.g. What is the difference between ps and top?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Answer</label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                required
                rows={8}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 font-mono text-sm text-gray-900 dark:text-gray-100"
                placeholder="Detailed answer with examples..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Topic</label>
                <select
                  value={topicId}
                  onChange={(e) => setTopicId(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                >
                  <option value="">-- Select --</option>
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2.5 rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium"
            >
              {loading ? 'Saving...' : existing ? 'Update Question' : 'Save Question'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
