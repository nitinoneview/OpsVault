'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Category {
  id: string
  name: string
}

interface ExistingIssue {
  id: string
  title: string
  symptoms: string
  commands_used: string
  troubleshooting_steps: string
  root_cause: string
  resolution: string
  category_id: string | null
}

export default function IssueForm({
  categories,
  existing,
}: {
  categories: Category[]
  existing?: ExistingIssue
}) {
  const [title, setTitle] = useState(existing?.title || '')
  const [symptoms, setSymptoms] = useState(existing?.symptoms || '')
  const [commandsUsed, setCommandsUsed] = useState(existing?.commands_used || '')
  const [troubleshootingSteps, setTroubleshootingSteps] = useState(existing?.troubleshooting_steps || '')
  const [rootCause, setRootCause] = useState(existing?.root_cause || '')
  const [resolution, setResolution] = useState(existing?.resolution || '')
  const [categoryId, setCategoryId] = useState(existing?.category_id || '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()

    const payload = {
      title,
      symptoms,
      commands_used: commandsUsed,
      troubleshooting_steps: troubleshootingSteps,
      root_cause: rootCause,
      resolution,
      category_id: categoryId || null,
    }

    if (existing) {
      const { error } = await supabase
        .from('production_issues')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', existing.id)

      setLoading(false)
      if (error) {
        setError(error.message)
        return
      }
    } else {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('Login expired')
        setLoading(false)
        return
      }

      const { error } = await supabase
        .from('production_issues')
        .insert({ ...payload, user_id: user.id })

      setLoading(false)
      if (error) {
        setError(error.message)
        return
      }
    }

    router.push('/dashboard/issues')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard/issues" className="text-blue-600 text-sm mb-4 inline-block">
          ← Back to Issues
        </Link>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">
            {existing ? 'Edit Issue' : 'Add Production Issue'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Issue Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full border rounded px-3 py-2"
                placeholder="e.g. Disk Space Full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">-- Select --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Symptoms</label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={3}
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="e.g. Filesystem usage reached 100%"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Commands Used</label>
              <textarea
                value={commandsUsed}
                onChange={(e) => setCommandsUsed(e.target.value)}
                rows={4}
                className="w-full border rounded px-3 py-2 font-mono text-sm"
                placeholder="df -h&#10;du -sh *"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Troubleshooting Steps</label>
              <textarea
                value={troubleshootingSteps}
                onChange={(e) => setTroubleshootingSteps(e.target.value)}
                rows={6}
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="1. Identify the full mount point&#10;2. Find large directories&#10;..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Root Cause</label>
              <textarea
                value={rootCause}
                onChange={(e) => setRootCause(e.target.value)}
                rows={2}
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="e.g. Application logs were not rotating correctly"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Resolution</label>
              <textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                rows={3}
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="e.g. Configured log rotation and removed old logs after approval"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : existing ? 'Update Issue' : 'Save Issue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
