import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function InterviewTopicsPage() {
  const supabase = await createClient()

  const { data: topics } = await supabase
    .from('interview_topics')
    .select('id, name')
    .order('sort_order')

  const topicsWithCount = await Promise.all(
    (topics || []).map(async (t) => {
      const { count: questionsCount } = await supabase
        .from('interview_questions')
        .select('*', { count: 'exact', head: true })
        .eq('topic_id', t.id)
      const { count: notesCount } = await supabase
        .from('notes')
        .select('*', { count: 'exact', head: true })
        .eq('topic_id', t.id)
      return { ...t, questionsCount: questionsCount || 0, notesCount: notesCount || 0 }
    })
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 transition-colors">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl p-4 mb-4">
          <Link href="/dashboard" className="text-white/80 text-xs">
            ← Back to Dashboard
          </Link>
          <h1 className="text-lg font-semibold text-white mt-1">Interview Prep</h1>
          <p className="text-xs text-white/80 mt-0.5">{topicsWithCount.length} topics · organized by area</p>
        </div>

        <div className="flex flex-col gap-2">
          {topicsWithCount.map((t, i) => (
            <Link
              key={t.id}
              href={"/dashboard/interview/topic/" + t.id}
              className="bg-white dark:bg-gray-900 rounded-lg px-4 py-3 border border-gray-100 dark:border-gray-800 flex justify-between items-center hover:border-gray-200 dark:hover:border-gray-700 transition"
            >
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {i + 1}. {t.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {t.notesCount} notes · {t.questionsCount} questions
                </p>
              </div>
              <span className="text-gray-400 dark:text-gray-600">›</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
