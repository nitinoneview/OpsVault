'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          setIsAuthenticated(true)
          router.push('/dashboard')
        } else {
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-950 dark:to-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading OpsVault...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Redirecting to dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-950 dark:to-gray-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            🔐 OpsVault
          </div>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition font-medium"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition transform font-medium"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          <div className="inline-block mb-6 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
            <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
              ✨ Your Personal Technical Knowledge Base
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Master Production Support &<br />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              DevOps with OpsVault
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            A private, searchable knowledge base for organizing technical notes, documenting production incidents, and preparing for technical interviews.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg hover:shadow-xl hover:scale-105 transition transform font-semibold text-lg"
            >
              Get Started Free →
            </Link>
            <Link
              href="/login"
              className="border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white px-8 py-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition font-semibold text-lg"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
          Powerful Features
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Secure & Private
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Email/password authentication with admin approval workflow. Your knowledge stays yours.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Markdown Notes
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Write rich notes with syntax-highlighted code blocks. Perfect for technical documentation.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Full-Text Search
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Search notes by title or content instantly. Find what you need in seconds.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Organize by Category
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Browse notes organized by topics: Linux, AWS, SQL, Networking, and more.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Interview Prep
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Q&A format with difficulty levels and a reveal-answer practice mode.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition">
            <div className="text-4xl mb-4">🚨</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Production Issues
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Document incidents: Symptoms → Commands → Troubleshooting → Resolution.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-6">Built with Modern Technology</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            OpsVault is built on a solid foundation of cutting-edge technologies to ensure speed, reliability, and security.
          </p>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div>
              <h3 className="font-bold mb-3">Frontend</h3>
              <p className="text-purple-100">Next.js 16 • React 19 • TypeScript • Tailwind CSS</p>
            </div>
            <div>
              <h3 className="font-bold mb-3">Backend & Database</h3>
              <p className="text-purple-100">PostgreSQL via Supabase • Row Level Security • Real-time Sync</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Ready to Build Your Knowledge Base?
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Join now to organize your technical knowledge and master production support, DevOps, and interview prep.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg hover:shadow-xl hover:scale-105 transition transform font-semibold text-lg"
          >
            Create Free Account →
          </Link>
          <Link
            href="/login"
            className="border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white px-8 py-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition font-semibold text-lg"
          >
            Already have an account?
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">OpsVault</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your personal technical knowledge base
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Features</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-purple-600 transition">Notes & Search</a></li>
                <li><a href="#" className="hover:text-purple-600 transition">Interview Prep</a></li>
                <li><a href="#" className="hover:text-purple-600 transition">Production Issues</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><a href="https://github.com/nitinoneview/OpsVault" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition">GitHub</a></li>
                <li><a href="#" className="hover:text-purple-600 transition">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><a href="https://github.com/nitinoneview" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition">GitHub Profile</a></li>
                <li><a href="https://opsvault-jet.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition">Live Site</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 pt-8 text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2024 OpsVault. Built by <a href="https://github.com/nitinoneview" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Nitin</a>.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
