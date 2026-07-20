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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Link href="/dashboard/notes" className="text-blue-600 text-sm">
            ← Back to Notes
          </Link>
          <Link
            href={"/dashboard/notes/" + note.id + "/edit"}
            className="bg-yellow-500 text-white px-3 py-1.5 rounded text-sm hover:bg-yellow-600"
          >
            Edit
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold mb-2">
            {note.is_favorite && '⭐ '}
            {note.is_important && '🔥 '}
            {note.title}
          </h1>
          <p className="text-sm text-gray-500 mb-6">
                        {(Array.isArray(note.categories) ? note.categories[0]?.name : (note.categories as { name: string } | null)?.name) || 'Uncategorized'} •{' '}
            {new Date(note.created_at).toLocaleDateString()}
          </p>

          <MarkdownContent content={note.content} />
        </div>
      </div>
    </div>
  )
}
