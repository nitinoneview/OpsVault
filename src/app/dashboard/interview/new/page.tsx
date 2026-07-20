import { createClient } from '@/lib/supabase/server'
import QuestionForm from '../question-form'

export default async function NewQuestionPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')

  return <QuestionForm categories={categories || []} />
}
