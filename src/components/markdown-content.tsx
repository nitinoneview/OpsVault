import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose prose-sm md:prose-base max-w-none 
      prose-headings:text-gray-900 dark:prose-headings:text-white
      prose-p:text-gray-700 dark:prose-p:text-gray-300
      prose-a:text-blue-600 dark:prose-a:text-blue-400
      prose-a:hover:text-blue-700 dark:prose-a:hover:text-blue-300
      prose-strong:text-gray-900 dark:prose-strong:text-white
      prose-code:text-pink-600 dark:prose-code:text-pink-400
      prose-code:before:content-none prose-code:after:content-none
      prose-pre:bg-gray-900 dark:prose-pre:bg-gray-800
      prose-pre:text-gray-100 dark:prose-pre:text-gray-200
      prose-pre:border dark:prose-pre:border-gray-700
      prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400
      prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-700
      prose-table:text-gray-900 dark:prose-table:text-gray-300
      prose-th:bg-gray-100 dark:prose-th:bg-gray-800
      prose-th:border-gray-300 dark:prose-th:border-gray-700
      prose-td:border-gray-300 dark:prose-td:border-gray-700
      prose-hr:border-gray-300 dark:prose-hr:border-gray-700">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
