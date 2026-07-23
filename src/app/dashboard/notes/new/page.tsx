import { createClient } from '@/lib/supabase/server'
import NoteForm from './note-form'

export default async function NewNotePage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')

  const { data: topics } = await supabase
    .from('interview_topics')
    .select('id, name')
    .order('sort_order')

  return <NoteForm categories={categories || []} topics={topics || []} />
}
