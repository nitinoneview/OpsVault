import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import MarkdownContent from '@/components/markdown-content'

export default async function NoteViewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: note } = await supabase
    .from('notes')
    .select('*, categories(name)')
    .eq('id', id)
    .single()

  if (!note) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4 gap-3">
          <Link href="/dashboard/notes" className="text-blue-600 dark:text-blue-400 text-sm hover:underline whitespace-nowrap">
            ← Back to Notes
          </Link>
          <Link
            href={"/dashboard/notes/" + note.id + "/edit"}
            className="bg-yellow-500 dark:bg-yellow-600 text-white px-3 py-1.5 rounded text-sm hover:bg-yellow-600 dark:hover:bg-yellow-700 transition whitespace-nowrap"
          >
            Edit
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100 dark:border-gray-800">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 text-gray-900 dark:text-white break-words">
            {note.is_favorite && '⭐ '}
            {note.is_important && '🔥 '}
            {note.title}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6">
            {(Array.isArray(note.categories) ? note.categories[0]?.name : (note.categories as { name: string } | null)?.name) || 'Uncategorized'} •{' '}
            {new Date(note.created_at).toLocaleDateString()}
          </p>

          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none overflow-x-auto">
            <MarkdownContent content={note.content} />
          </div>
        </div>
      </div>
    </div>
  )
}
