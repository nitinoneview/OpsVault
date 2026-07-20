'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Category {
  id: string
  name: string
}

interface ExistingQuestion {
  id: string
  question: string
  answer: string
  category_id: string | null
  difficulty: string
}

export default function QuestionForm({
  categories,
  existing,
}: {
  categories: Category[]
  existing?: ExistingQuestion
}) {
  const [question, setQuestion] = useState(existing?.question || '')
  const [answer, setAnswer] = useState(existing?.answer || '')
  const [categoryId, setCategoryId] = useState(existing?.category_id || '')
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
          category_id: categoryId || null,
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
        category_id: categoryId || null,
        difficulty,
        user_id: user.id,
      })

      setLoading(false)
      if (error) {
        setError(error.message)
        return
      }
    }

    router.push('/dashboard/interview')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard/interview" className="text-blue-600 text-sm mb-4 inline-block">
          ← Back to Interview Prep
        </Link>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">
            {existing ? 'Edit Question' : 'Add Interview Question'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Question</label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
                className="w-full border rounded px-3 py-2"
                placeholder="e.g. What is the difference between ps and top?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Answer</label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                required
                rows={8}
                className="w-full border rounded px-3 py-2 font-mono text-sm"
                placeholder="Detailed answer with examples..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">-- Select --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : existing ? 'Update Question' : 'Save Question'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
