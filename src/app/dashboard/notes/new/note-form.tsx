'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Category {
  id: string
  name: string
}

interface Topic {
  id: string
  name: string
}

export default function NoteForm({ categories, topics }: { categories: Category[]; topics: Topic[] }) {
  const searchParams = useSearchParams()
  const projectId = searchParams.get('project') || null
  const preselectedTopic = searchParams.get('topic') || ''
  const [title, setTitle] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [topicId, setTopicId] = useState(preselectedTopic)
  const [content, setContent] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)
  const [isImportant, setIsImportant] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setError('Login expired, please login again')
      setLoading(false)
      return
    }

    const { error } = await supabase.from('notes').insert({
      title,
      content,
      category_id: categoryId || null,
      project_id: projectId,
      topic_id: topicId || null,
      is_favorite: isFavorite,
      is_important: isImportant,
      user_id: user.id,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    router.push(projectId ? '/dashboard/projects/' + projectId : (topicId ? '/dashboard/interview/topic/' + topicId : '/dashboard/notes'))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="text-blue-600 text-sm mb-4 inline-block">
          ← Back to Dashboard
        </Link>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">Add New Note</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full border rounded px-3 py-2"
                placeholder="e.g. How to troubleshoot high CPU usage in Linux?"
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
                  <option value="">-- Select category --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Interview Topic</label>
                <select
                  value={topicId}
                  onChange={(e) => setTopicId(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">-- Select --</option>
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={12}
                className="w-full border rounded px-3 py-2 font-mono text-sm"
                placeholder="Write your notes here... (commands, steps, explanations)"
              />
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={isFavorite}
                  onChange={(e) => setIsFavorite(e.target.checked)}
                />
                ⭐ Favorite
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={isImportant}
                  onChange={(e) => setIsImportant(e.target.checked)}
                />
                🔥 Important
              </label>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Note'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
