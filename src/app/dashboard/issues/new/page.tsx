import { createClient } from '@/lib/supabase/server'
import IssueForm from '../issue-form'

export default async function NewIssuePage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')

  return <IssueForm categories={categories || []} />
}
