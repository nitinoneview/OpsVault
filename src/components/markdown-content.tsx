import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose prose-sm md:prose-base max-w-none 
      prose-headings:text-gray-900 dark:prose-headings:text-white
      prose-h1:text-2xl dark:prose-h1:text-2xl
      prose-h2:text-xl dark:prose-h2:text-xl
      prose-h3:text-lg dark:prose-h3:text-lg
      prose-p:text-gray-700 dark:prose-p:text-gray-200
      prose-li:text-gray-700 dark:prose-li:text-gray-200
      prose-a:text-blue-600 dark:prose-a:text-blue-400
      prose-a:hover:text-blue-700 dark:prose-a:hover:text-blue-300
      prose-strong:text-gray-900 dark:prose-strong:text-white
      prose-strong:font-bold
      prose-em:text-gray-800 dark:prose-em:text-gray-100
      prose-code:text-pink-600 dark:prose-code:text-pink-300
      prose-code:bg-pink-50 dark:prose-code:bg-pink-900/30
      prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
      prose-code:before:content-none prose-code:after:content-none
      prose-pre:bg-gray-900 dark:prose-pre:bg-gray-800
      prose-pre:text-gray-100 dark:prose-pre:text-gray-100
      prose-pre:border dark:prose-pre:border-gray-700
      prose-pre:overflow-x-auto
      prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300
      prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600
      prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-800/50
      prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:rounded
      prose-table:text-gray-900 dark:prose-table:text-gray-200
      prose-th:bg-gray-100 dark:prose-th:bg-gray-800
      prose-th:text-gray-900 dark:prose-th:text-gray-100
      prose-th:border-gray-300 dark:prose-th:border-gray-700
      prose-th:font-semibold
      prose-td:border-gray-300 dark:prose-td:border-gray-700
      prose-td:text-gray-700 dark:prose-td:text-gray-300
      prose-tr:border-gray-200 dark:prose-tr:border-gray-700
      prose-hr:border-gray-300 dark:prose-hr:border-gray-600
      prose-ul:text-gray-700 dark:prose-ul:text-gray-200
      prose-ol:text-gray-700 dark:prose-ol:text-gray-200
      space-y-3">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
