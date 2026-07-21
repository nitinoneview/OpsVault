import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EntityTabs from '@/components/entity-tabs'

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: project } = await supabase
    .from('projects')
    .select('name')
    .eq('id', id)
    .single()

  if (!project) {
    notFound()
  }

  const { data: notes } = await supabase
    .from('notes')
    .select('id, title, is_favorite, is_important')
    .eq('project_id', id)
    .order('created_at', { ascending: false })

  const { data: questions } = await supabase
    .from('interview_questions')
    .select('id, question, answer, difficulty, status')
    .eq('project_id', id)
    .order('created_at', { ascending: false })

  return (
    <EntityTabs
      backHref="/dashboard/projects"
      backLabel="Back to Projects"
      title={project.name}
      notes={notes || []}
      questions={questions || []}
      addNoteHref={"/dashboard/notes/new?project=" + id}
      addQuestionHref={"/dashboard/interview/new?project=" + id}
    />
  )
}
