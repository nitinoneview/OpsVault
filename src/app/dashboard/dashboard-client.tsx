'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ThemeToggle from '@/components/theme-toggle'
import { Plus, Settings, LogOut, BookOpen, FolderTree, Target, AlertTriangle } from 'lucide-react'

interface RecentNote {
  id: string
  title: string
  created_at: string
  categories: { name: string }[] | null
}

interface DashboardClientProps {
  isAdmin: boolean
  userEmail: string
  recentNotes: RecentNote[]
}

const features = [
  { href: '/dashboard/notes', icon: BookOpen, title: 'All Notes', bg: 'bg-blue-50 dark:bg-blue-950/40', color: 'text-blue-600 dark:text-blue-400' },
  { href: '/dashboard/categories', icon: FolderTree, title: 'Categories', bg: 'bg-orange-50 dark:bg-orange-950/40', color: 'text-orange-600 dark:text-orange-400' },
  { href: '/dashboard/interview', icon: Target, title: 'Interview Prep', bg: 'bg-purple-50 dark:bg-purple-950/40', color: 'text-purple-600 dark:text-purple-400' },
  { href: '/dashboard/issues', icon: AlertTriangle, title: 'Production Issues', bg: 'bg-red-50 dark:bg-red-950/40', color: 'text-red-600 dark:text-red-400' },
]

export default function DashboardClient({ isAdmin, userEmail, recentNotes }: DashboardClientProps) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-500 px-4 sm:px-6 pt-5 pb-4 rounded-b-2xl">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-semibold text-white">OpsVault</h1>
              <p className="text-xs text-white/80 mt-0.5">Personal knowledge base</p>
            </div>
            <div className="flex gap-2 items-center">
              <ThemeToggle />
              <Link
                href="/dashboard/profile"
                className="w-9 h-9 rounded-full bg-white text-purple-700 flex items-center justify-center text-sm font-semibold"
                title="Profile"
              >
                {userEmail.charAt(0).toUpperCase()}
              </Link>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Link
              href="/dashboard/notes/new"
              className="flex-1 bg-white text-purple-700 rounded-lg py-2 text-sm font-medium flex items-center justify-center gap-1.5 hover:opacity-90 transition"
            >
              <Plus size={16} /> Add Note
            </Link>
            {isAdmin && (
              <Link
                href="/dashboard/admin"
                className="w-10 bg-white/20 rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition"
                title="Admin Panel"
              >
                <Settings size={17} />
              </Link>
            )}
            <Link
              href="/dashboard/settings"
              className="w-10 bg-white/20 rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition"
              title="Settings"
            >
              <Settings size={17} />
            </Link>
            <button
              onClick={handleLogout}
              className="w-10 bg-white/20 rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition"
              title="Logout"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 pb-10">
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Quick Access</h2>
        <div className="grid grid-cols-2 gap-3 mb-8">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <Link
                key={f.href}
                href={f.href}
                className={f.bg + " rounded-xl p-4 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition"}
              >
                <Icon className={f.color} size={22} />
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 mt-2">{f.title}</p>
              </Link>
            )
          })}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Recently Added</h2>
            <Link href="/dashboard/notes" className="text-xs text-purple-600 dark:text-purple-400 hover:underline">
              View all
            </Link>
          </div>
          {recentNotes.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 text-center text-gray-400 dark:text-gray-500 border border-gray-100 dark:border-gray-800 text-sm">
              No notes yet. Create your first one!
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
              {recentNotes.map((note) => (
                <Link
                  key={note.id}
                  href={"/dashboard/notes/" + note.id}
                  className="flex justify-between items-center gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition first:rounded-t-xl last:rounded-b-xl"
                >
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{note.title}</span>
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-1 rounded-full whitespace-nowrap">
                    {note.categories?.[0]?.name || 'Uncategorized'}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
