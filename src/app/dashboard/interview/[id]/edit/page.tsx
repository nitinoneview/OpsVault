import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import QuestionForm from '../../question-form'

export default async function EditQuestionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: question } = await supabase
    .from('interview_questions')
    .select('*')
    .eq('id', id)
    .single()

  if (!question) {
    notFound()
  }

  const { data: topics } = await supabase
    .from('interview_topics')
    .select('id, name')
    .order('sort_order')

  return <QuestionForm topics={topics || []} existing={question} />
}
