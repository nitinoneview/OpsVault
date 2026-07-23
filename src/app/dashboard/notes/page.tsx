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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8 transition-colors">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <Link href="/dashboard" className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">
              {categoryName ? `${categoryName} Notes` : 'All Notes'}
            </h1>
          </div>
          <Link
            href="/dashboard/notes/new"
            className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-600 text-sm transition"
          >
            + Add Note
          </Link>
        </div>

        {category && (
          <Link
            href="/dashboard/notes"
            className="inline-block text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-4"
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
            className="w-full border border-gray-300 dark:border-gray-700 rounded px-4 py-2 shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </form>

        {(!notes || notes.length === 0) && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-8 text-center text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-800">
            {q || category ? 'Koi matching note nahi mila.' : 'Koi note nahi mila. Pehla note add karo!'}
          </div>
        )}

        <div className="space-y-3">
          {notes?.map((note) => (
            <Link
              key={note.id}
              href={`/dashboard/notes/${note.id}`}
              className="block bg-white dark:bg-gray-900 rounded-lg shadow p-4 hover:shadow-md dark:hover:shadow-lg transition border border-gray-100 dark:border-gray-800"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {note.is_favorite && '⭐ '}
                    {note.is_important && '🔥 '}
                    {note.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {(Array.isArray(note.categories) ? note.categories[0]?.name : (note.categories as { name: string } | null)?.name) || 'Uncategorized'}
                  </p>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500">
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
