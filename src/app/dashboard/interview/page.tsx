import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import InterviewList from './interview-list'

export default async function InterviewPage() {
  const supabase = await createClient()

  const { data: questions } = await supabase
    .from('interview_questions')
    .select('id, question, answer, difficulty, status, categories(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link href="/dashboard" className="text-blue-600 text-sm">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold mt-2">Interview Prep</h1>
          </div>
          <Link
            href="/dashboard/interview/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            + Add Question
          </Link>
        </div>

        <InterviewList questions={questions || []} />
      </div>
    </div>
  )
}
