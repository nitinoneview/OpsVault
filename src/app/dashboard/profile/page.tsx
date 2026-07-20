import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { count: myNotesCount } = await supabase
    .from('notes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const initial = (profile?.email || user.email || '?').charAt(0).toUpperCase()
  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '-'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-8 transition-colors">
      <div className="max-w-md mx-auto">
        <Link href="/dashboard" className="text-purple-600 dark:text-purple-400 text-sm">
          ← Back to Dashboard
        </Link>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm mt-4 p-8 text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400 mx-auto flex items-center justify-center text-white text-4xl font-bold">
            {initial}
          </div>

          <h1 className="text-lg font-bold mt-4 text-gray-900 dark:text-gray-100 break-all">
            {profile?.email}
          </h1>
          <span className="inline-block mt-2 text-xs font-medium px-3 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 capitalize">
            {profile?.role}
          </span>

          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{myNotesCount || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Notes Created</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{joinDate}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Member Since</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
