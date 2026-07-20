import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import InterviewList from '../../interview-list'

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
    .select('id, question, answer, difficulty, status, categories(name)')
    .eq('topic_id', id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 transition-colors">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <Link href="/dashboard/interview" className="text-purple-600 dark:text-purple-400 text-xs">
              ← Back to Topics
            </Link>
            <h1 className="text-lg font-semibold mt-1 text-gray-900 dark:text-gray-100">{topic.name}</h1>
          </div>
          <Link
            href={"/dashboard/interview/new?topic=" + id}
            className="bg-purple-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-700"
          >
            + Add
          </Link>
        </div>

        <InterviewList questions={questions || []} />
      </div>
    </div>
  )
}
