import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function IssuesListPage() {
  const supabase = await createClient()

  const { data: issues } = await supabase
    .from('production_issues')
    .select('id, title, root_cause, created_at, categories(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link href="/dashboard" className="text-blue-600 text-sm">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold mt-2">Production Issues</h1>
          </div>
          <Link
            href="/dashboard/issues/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            + Add Issue
          </Link>
        </div>

        {(!issues || issues.length === 0) && (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            Koi production issue record nahi hai abhi. Pehla add karo!
          </div>
        )}

        <div className="space-y-3">
          {issues?.map((issue) => (
            <Link
              key={issue.id}
              href={"/dashboard/issues/" + issue.id}
              className="block bg-white rounded-lg shadow p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold text-lg">{issue.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                                        {(Array.isArray(issue.categories) ? issue.categories[0]?.name : (issue.categories as { name: string } | null)?.name) || 'Uncategorized'}
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(issue.created_at).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
