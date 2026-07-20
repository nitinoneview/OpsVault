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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Waiting for Approval</h1>
          <p className="text-gray-600">
            Tumhara account admin approval ka wait kar raha hai.
            Approve hote hi tum notes access kar paoge.
          </p>
        </div>
      </div>
    )
  }

  if (profile?.status === 'rejected') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h1>
          <p className="text-gray-600">
            Tumhara access request reject ho gaya hai.
          </p>
        </div>
      </div>
    )
  }

  // ---- Stats fetch karo ----

  // Total notes count
  const { count: totalNotes } = await supabase
    .from('notes')
    .select('*', { count: 'exact', head: true })

  // Total categories count
  const { count: totalCategories } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true })

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
      totalNotes={totalNotes || 0}
      totalCategories={totalCategories || 0}
      recentNotes={recentNotes || []}
    />
  )
}
