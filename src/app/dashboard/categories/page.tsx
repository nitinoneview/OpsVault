import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function CategoriesPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, description')
    .order('name')

  // Har category ke notes count nikalo
  const categoriesWithCount = await Promise.all(
    (categories || []).map(async (cat) => {
      const { count } = await supabase
        .from('notes')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', cat.id)

      return { ...cat, noteCount: count || 0 }
    })
  )

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="text-blue-600 text-sm">
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold mt-2 mb-6">Browse by Category</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categoriesWithCount.map((cat) => (
            <Link
              key={cat.id}
              href={`/dashboard/notes?category=${cat.id}`}
              className="bg-white shadow rounded-lg p-5 hover:shadow-md transition"
            >
              <h2 className="font-semibold text-lg">{cat.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{cat.description}</p>
              <p className="text-xs text-blue-600 mt-3 font-medium">
                {cat.noteCount} note{cat.noteCount !== 1 ? 's' : ''}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
