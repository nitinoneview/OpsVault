import { createClient } from '@/lib/supabase/server'
import QuestionForm from '../question-form'

export default async function NewQuestionPage() {
  const supabase = await createClient()

  const { data: topics } = await supabase
    .from('interview_topics')
    .select('id, name')
    .order('sort_order')

  return <QuestionForm topics={topics || []} />
}
