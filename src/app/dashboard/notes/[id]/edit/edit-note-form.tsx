'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Category {
  id: string
  name: string
}

interface Note {
  id: string
  title: string
  content: string
  category_id: string | null
  is_favorite: boolean
  is_important: boolean
}

export default function EditNoteForm({
  note,
  categories,
}: {
  note: Note
  categories: Category[]
}) {
  const [title, setTitle] = useState(note.title)
  const [categoryId, setCategoryId] = useState(note.category_id || '')
  const [content, setContent] = useState(note.content)
  const [isFavorite, setIsFavorite] = useState(note.is_favorite)
  const [isImportant, setIsImportant] = useState(note.is_important)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()

    const { error } = await supabase
      .from('notes')
      .update({
        title,
        content,
        category_id: categoryId || null,
        is_favorite: isFavorite,
        is_important: isImportant,
        updated_at: new Date().toISOString(),
      })
      .eq('id', note.id)

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    router.push(`/dashboard/notes/${note.id}`)
  }

  const handleDelete = async () => {
    const confirmed = confirm('Kya tum sach mein ye note delete karna chahte ho?')
    if (!confirmed) return

    const supabase = createClient()
    const { error } = await supabase.from('notes').delete().eq('id', note.id)

    if (error) {
      setError(error.message)
      return
    }

    router.push('/dashboard/notes')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Link href={`/dashboard/notes/${note.id}`} className="text-blue-600 text-sm mb-4 inline-block">
          ← Back to Note
        </Link>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Edit Note</h1>
            <button
              onClick={handleDelete}
              className="text-red-600 text-sm hover:underline"
              type="button"
            >
              Delete Note
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>

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
              <label className="block text-sm font-medium mb-1">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={12}
                className="w-full border rounded px-3 py-2 font-mono text-sm"
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
              {loading ? 'Updating...' : 'Update Note'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
