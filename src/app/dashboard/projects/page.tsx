import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function ProjectsPage() {
  const supabase = await createClient()

  const { data: projects } = await supabase
    .from('projects')
    .select('id, name')
    .order('sort_order')

  const withCounts = await Promise.all(
    (projects || []).map(async (p) => {
      const { count: notesCount } = await supabase
        .from('notes')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', p.id)
      const { count: questionsCount } = await supabase
        .from('interview_questions')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', p.id)
      return { ...p, notesCount: notesCount || 0, questionsCount: questionsCount || 0 }
    })
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 transition-colors">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl p-4 mb-4">
          <Link href="/dashboard" className="text-white/80 text-xs">
            ← Back to Dashboard
          </Link>
          <h1 className="text-lg font-semibold text-white mt-1">Projects</h1>
          <p className="text-xs text-white/80 mt-0.5">{withCounts.length} projects</p>
        </div>

        <div className="flex flex-col gap-2">
          {withCounts.map((p) => (
            <Link
              key={p.id}
              href={"/dashboard/projects/" + p.id}
              className="bg-white dark:bg-gray-900 rounded-lg px-4 py-3 border border-gray-100 dark:border-gray-800 flex justify-between items-center hover:border-gray-200 dark:hover:border-gray-700 transition"
            >
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{p.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {p.notesCount} notes · {p.questionsCount} questions
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
