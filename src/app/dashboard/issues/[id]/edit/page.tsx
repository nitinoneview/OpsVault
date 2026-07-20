import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import IssueForm from '../../issue-form'

export default async function EditIssuePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: issue } = await supabase
    .from('production_issues')
    .select('*')
    .eq('id', id)
    .single()

  if (!issue) {
    notFound()
  }

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')

  return <IssueForm categories={categories || []} existing={issue} />
}
