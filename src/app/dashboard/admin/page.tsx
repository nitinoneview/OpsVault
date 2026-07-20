'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Profile {
  id: string
  email: string
  role: string
  status: string
  created_at: string
}

export default function AdminPanel() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  const loadProfiles = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    setProfiles(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadProfiles()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    const supabase = createClient()
    await supabase.from('profiles').update({ status }).eq('id', id)
    loadProfiles()
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Panel — User Approvals</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Signed up</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p) => (
              <tr key={p.id} className="border-t text-sm">
                <td className="p-3">{p.email}</td>
                <td className="p-3">{p.role}</td>
                <td className="p-3">
                  <span
                    className={
                      p.status === 'approved'
                        ? 'text-green-600'
                        : p.status === 'pending'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }
                  >
                    {p.status}
                  </span>
                </td>
                <td className="p-3">
                  {new Date(p.created_at).toLocaleDateString()}
                </td>
                <td className="p-3 space-x-2">
                  {p.status !== 'approved' && (
                    <button
                      onClick={() => updateStatus(p.id, 'approved')}
                      className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                    >
                      Approve
                    </button>
                  )}
                  {p.status !== 'rejected' && (
                    <button
                      onClick={() => updateStatus(p.id, 'rejected')}
                      className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                    >
                      Reject
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
