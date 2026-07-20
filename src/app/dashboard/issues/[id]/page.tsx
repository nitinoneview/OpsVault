import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import MarkdownContent from '@/components/markdown-content'

export default async function IssueViewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: issue } = await supabase
    .from('production_issues')
    .select('*, categories(name)')
    .eq('id', id)
    .single()

  if (!issue) {
    notFound()
  }

  const sections = [
    { label: 'Symptoms', value: issue.symptoms },
    { label: 'Commands Used', value: issue.commands_used, mono: true },
    { label: 'Troubleshooting Steps', value: issue.troubleshooting_steps },
    { label: 'Root Cause', value: issue.root_cause },
    { label: 'Resolution', value: issue.resolution },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Link href="/dashboard/issues" className="text-blue-600 text-sm">
            ← Back to Issues
          </Link>
          <Link
            href={"/dashboard/issues/" + issue.id + "/edit"}
            className="bg-yellow-500 text-white px-3 py-1.5 rounded text-sm hover:bg-yellow-600"
          >
            Edit
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold mb-1">{issue.title}</h1>
          <p className="text-sm text-gray-500 mb-6">
            {/* @ts-expect-error - Supabase join type */}
            {issue.categories?.name || 'Uncategorized'} •{' '}
            {new Date(issue.created_at).toLocaleDateString()}
          </p>

          {sections.map((section) => (
            section.value && (
              <div key={section.label} className="mb-5">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  {section.label}
                </h3>
                <div className={section.mono ? "font-mono text-sm bg-gray-50 p-3 rounded" : ""}>
                  <MarkdownContent content={section.value} />
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  )
}
