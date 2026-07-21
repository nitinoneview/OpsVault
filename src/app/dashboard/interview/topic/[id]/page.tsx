import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EntityTabs from '@/components/entity-tabs'

export default async function TopicQuestionsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: topic } = await supabase
    .from('interview_topics')
    .select('name')
    .eq('id', id)
    .single()

  if (!topic) {
    notFound()
  }

  const { data: questions } = await supabase
    .from('interview_questions')
    .select('id, question, answer, difficulty, status')
    .eq('topic_id', id)
    .order('created_at', { ascending: false })

  const { data: notes } = await supabase
    .from('notes')
    .select('id, title, is_favorite, is_important')
    .eq('topic_id', id)
    .order('created_at', { ascending: false })

  return (
    <EntityTabs
      backHref="/dashboard/interview"
      backLabel="Back to Topics"
      title={topic.name}
      notes={notes || []}
      questions={questions || []}
      addNoteHref={"/dashboard/notes/new?topic=" + id}
      addQuestionHref={"/dashboard/interview/new?topic=" + id}
      questionsFirst
    />
  )
}
