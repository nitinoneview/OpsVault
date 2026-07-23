import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardClient from './dashboard-client'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.status === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-8 transition-colors">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md text-center max-w-md border border-gray-100 dark:border-gray-800">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Waiting for Approval</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tumhara account admin approval ka wait kar raha hai.
            Approve hote hi tum notes access kar paoge.
          </p>
        </div>
      </div>
    )
  }

  if (profile?.status === 'rejected') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-8 transition-colors">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md text-center max-w-md border border-gray-100 dark:border-gray-800">
          <h1 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tumhara access request reject ho gaya hai.
          </p>
        </div>
      </div>
    )
  }

  // Recent 5 notes
  const { data: recentNotes } = await supabase
    .from('notes')
    .select('id, title, created_at, categories(name)')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <DashboardClient
      isAdmin={profile?.role === 'admin'}
      userEmail={user.email || ''}
      recentNotes={recentNotes || []}
    />
  )
}
