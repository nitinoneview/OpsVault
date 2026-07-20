import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function NotesListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>
}) {
  const { q, category } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('notes')
    .select('id, title, content, is_favorite, is_important, created_at, categories(id, name)')
    .order('created_at', { ascending: false })

  if (q) {
    query = query.or(`title.ilike.%${q}%,content.ilike.%${q}%`)
  }

  if (category) {
    query = query.eq('category_id', category)
  }

  const { data: notes } = await query

  // Agar category filter active hai, uska naam dikhane ke liye fetch karo
  let categoryName = ''
  if (category) {
    const { data: cat } = await supabase
      .from('categories')
      .select('name')
      .eq('id', category)
      .single()
    categoryName = cat?.name || ''
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <Link href="/dashboard" className="text-blue-600 text-sm">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold mt-2">
              {categoryName ? `${categoryName} Notes` : 'All Notes'}
            </h1>
          </div>
          <Link
            href="/dashboard/notes/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            + Add Note
          </Link>
        </div>

        {category && (
          <Link
            href="/dashboard/notes"
            className="inline-block text-sm text-gray-500 hover:text-blue-600 mb-4"
          >
            ✕ Clear category filter
          </Link>
        )}

        <form method="GET" className="mb-6">
          {category && <input type="hidden" name="category" value={category} />}
          <input
            type="text"
            name="q"
            defaultValue={q || ''}
            placeholder="Search notes by title or content..."
            className="w-full border rounded px-4 py-2 shadow-sm"
          />
        </form>

        {(!notes || notes.length === 0) && (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            {q || category ? 'Koi matching note nahi mila.' : 'Koi note nahi mila. Pehla note add karo!'}
          </div>
        )}

        <div className="space-y-3">
          {notes?.map((note) => (
            <Link
              key={note.id}
              href={`/dashboard/notes/${note.id}`}
              className="block bg-white rounded-lg shadow p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold text-lg">
                    {note.is_favorite && '⭐ '}
                    {note.is_important && '🔥 '}
                    {note.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                                        {(Array.isArray(note.categories) ? note.categories[0]?.name : (note.categories as { name: string } | null)?.name) || 'Uncategorized'}
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(note.created_at).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
