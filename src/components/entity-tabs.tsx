'use client'

import { useState } from 'react'
import Link from 'next/link'
import InterviewList from '@/app/dashboard/interview/interview-list'

interface Note {
  id: string
  title: string
  is_favorite: boolean
  is_important: boolean
}

interface Question {
  id: string
  question: string
  answer: string
  difficulty: string
  status: string
}

export default function EntityTabs({
  backHref,
  backLabel,
  title,
  notes,
  questions,
  addNoteHref,
  addQuestionHref,
  questionsFirst = false,
}: {
  backHref: string
  backLabel: string
  title: string
  notes: Note[]
  questions: Question[]
  addNoteHref: string
  addQuestionHref: string
  questionsFirst?: boolean
}) {
  const [tab, setTab] = useState<'notes' | 'questions'>(questionsFirst ? 'questions' : 'notes')

  const tabOrder: Array<'notes' | 'questions'> = questionsFirst
    ? ['questions', 'notes']
    : ['notes', 'questions']

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 transition-colors">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl p-4 mb-4">
          <Link href={backHref} className="text-white/80 text-xs">
            ← {backLabel}
          </Link>
          <h1 className="text-lg font-semibold text-white mt-1">{title}</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white dark:bg-gray-900 rounded-lg p-1 mb-4 border border-gray-100 dark:border-gray-800">
          {tabOrder.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                "flex-1 text-center py-2 rounded-md text-sm font-medium transition capitalize " +
                (tab === t
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  : 'text-gray-500 dark:text-gray-400')
              }
            >
              {t === 'notes' ? "Notes (" + notes.length + ")" : "Questions (" + questions.length + ")"}
            </button>
          ))}
        </div>

        <div className="flex justify-end mb-3">
          {tab === 'notes' ? (
            <Link
              href={addNoteHref}
              className="bg-purple-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-700"
            >
              + Add Note
            </Link>
          ) : (
            <Link
              href={addQuestionHref}
              className="bg-purple-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-700"
            >
              + Add Question
            </Link>
          )}
        </div>

        {tab === 'notes' ? (
          notes.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 text-center text-gray-400 dark:text-gray-500 border border-gray-100 dark:border-gray-800 text-sm">
              No notes yet.
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
