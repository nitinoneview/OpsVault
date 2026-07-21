'use client'

import { useState } from 'react'
import Link from 'next/link'
import MarkdownContent from '@/components/markdown-content'
import InterviewList from '../../interview/interview-list'

interface Note {
  id: string
  title: string
  content: string
  is_favorite: boolean
  is_important: boolean
  created_at: string
}

interface Question {
  id: string
  question: string
  answer: string
  difficulty: string
  status: string
}

export default function ProjectTabs({
  projectId,
  projectName,
  notes,
  questions,
}: {
  projectId: string
  projectName: string
  notes: Note[]
  questions: Question[]
}) {
  const [tab, setTab] = useState<'notes' | 'questions'>('notes')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 transition-colors">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl p-4 mb-4">
          <Link href="/dashboard/projects" className="text-white/80 text-xs">
            ← Back to Projects
          </Link>
          <h1 className="text-lg font-semibold text-white mt-1">{projectName}</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white dark:bg-gray-900 rounded-lg p-1 mb-4 border border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setTab('notes')}
            className={
              "flex-1 text-center py-2 rounded-md text-sm font-medium transition " +
              (tab === 'notes'
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                : 'text-gray-500 dark:text-gray-400')
            }
          >
            Notes ({notes.length})
          </button>
          <button
            onClick={() => setTab('questions')}
            className={
              "flex-1 text-center py-2 rounded-md text-sm font-medium transition " +
              (tab === 'questions'
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                : 'text-gray-500 dark:text-gray-400')
            }
          >
            Questions ({questions.length})
          </button>
        </div>

        <div className="flex justify-end mb-3">
          {tab === 'notes' ? (
            <Link
              href={"/dashboard/notes/new?project=" + projectId}
              className="bg-purple-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-700"
            >
              + Add Note
            </Link>
          ) : (
            <Link
              href={"/dashboard/interview/new?project=" + projectId}
              className="bg-purple-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-700"
            >
              + Add Question
            </Link>
          )}
        </div>

        {tab === 'notes' ? (
          notes.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 text-center text-gray-400 dark:text-gray-500 border border-gray-100 dark:border-gray-800 text-sm">
              No notes in this project yet.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {notes.map((note) => (
                <Link
                  key={note.id}
                  href={"/dashboard/notes/" + note.id}
                  className="bg-white dark:bg-gray-900 rounded-lg px-4 py-3 border border-gray-100 dark:border-gray-800 block hover:border-gray-200 dark:hover:border-gray-700 transition"
                >
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {note.is_favorite && '⭐ '}
                    {note.is_important && '🔥 '}
                    {note.title}
                  </p>
                </Link>
              ))}
            </div>
          )
        ) : (
          <InterviewList questions={questions.map((q) => ({ ...q, categories: null }))} />
        )}
      </div>
    </div>
  )
}
