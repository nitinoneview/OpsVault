import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EditNoteForm from './edit-note-form'

export default async function EditNotePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: note } = await supabase
    .from('notes')
    .select('*')
    .eq('id', id)
    .single()

  if (!note) {
    notFound()
  }

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')

  const { data: topics } = await supabase
    .from('interview_topics')
    .select('id, name')
    .order('sort_order')

  return <EditNoteForm note={note} categories={categories || []} topics={topics || []} />
}
