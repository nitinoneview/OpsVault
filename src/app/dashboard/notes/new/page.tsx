import { createClient } from '@/lib/supabase/server'
import NoteForm from './note-form'

export default async function NewNotePage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')

  return <NoteForm categories={categories || []} />
}
