'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface RecentNote {
  id: string
  title: string
  created_at: string
  categories: { name: string } | null
}

interface DashboardClientProps {
  isAdmin: boolean
  totalNotes: number
  totalCategories: number
  recentNotes: RecentNote[]
}

const features = [
  {
    href: '/dashboard/notes',
    icon: '📚',
    title: 'All Notes',
    desc: 'Apne saare notes dekho',
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-100',
  },
  {
    href: '/dashboard/notes/new',
    icon: '➕',
    title: 'Add New Note',
    desc: 'Naya note likho',
    bg: 'bg-green-50',
    iconBg: 'bg-green-100',
  },
  {
    href: '/dashboard/categories',
    icon: '🗂️',
    title: 'Browse by Category',
    desc: 'Category select karke dekho',
    bg: 'bg-orange-50',
    iconBg: 'bg-orange-100',
  },
  {
    href: '/dashboard/interview',
    icon: '🎯',
    title: 'Interview Prep',
    desc: 'Practice questions',
    bg: 'bg-purple-50',
    iconBg: 'bg-purple-100',
  },
  {
    href: '/dashboard/issues',
    icon: '🚨',
    title: 'Production Issues',
    desc: 'RCA & troubleshooting log',
    bg: 'bg-red-50',
    iconBg: 'bg-red-100',
  },
]

export default function DashboardClient({
  isAdmin,
  totalNotes,
  totalCategories,
  recentNotes,
}: DashboardClientProps) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top header banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-5xl mx-auto px-8 py-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">OpsVault</h1>
            <p className="text-blue-100 text-sm mt-1">Your personal technical knowledge base</p>
          </div>
          <div className="flex gap-3 items-center">
            {isAdmin && (
              <Link
                href="/dashboard/admin"
                className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md text-sm font-medium transition"
              >
                Admin Panel
              </Link>
            )}
            <Link
              href="/dashboard/settings"
              className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md text-sm font-medium transition"
            >
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md text-sm font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 -mt-6">
        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">Total Notes</p>
            <p className="text-4xl font-bold mt-1 text-blue-600">{totalNotes}</p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">Total Categories</p>
            <p className="text-4xl font-bold mt-1 text-indigo-600">{totalCategories}</p>
          </div>
        </div>

        {/* Feature cards */}
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {features.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className={f.bg + " rounded-xl p-5 hover:shadow-md transition border border-transparent hover:border-gray-200"}
            >
              <div className={f.iconBg + " w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-3"}>
                {f.icon}
              </div>
              <h3 className="font-semibold text-gray-800">{f.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{f.desc}</p>
            </Link>
          ))}
        </div>

        {/* Recently added notes */}
        <div className="pb-10">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Recently Added Notes</h2>
          {recentNotes.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-400 border border-gray-100">
              Abhi tak koi note nahi hai.
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y">
              {recentNotes.map((note) => (
                <Link
                  key={note.id}
                  href={"/dashboard/notes/" + note.id}
                  className="flex justify-between items-center px-5 py-4 hover:bg-gray-50 transition first:rounded-t-xl last:rounded-b-xl"
                >
                  <span className="font-medium text-gray-800">{note.title}</span>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                    {note.categories?.name || 'Uncategorized'}
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
