'use client'

import { useState, useMemo } from 'react'
import { Author } from '@/lib/drizzle'
import { AuthorCard } from '@/components/author-card'
import { Search, X } from 'lucide-react'

export function AuthorsGrid({ authors }: { authors: Author[] }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return authors
    return authors.filter(
      (a) =>
        a.userName.toLowerCase().includes(q) ||
        a.userXhsId.toLowerCase().includes(q)
    )
  }, [authors, query])

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Search bar */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索创作者姓名或小红书 ID..."
          className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent shadow-sm"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            没有找到与 &ldquo;{query}&rdquo; 相关的创作者
          </p>
        </div>
      ) : (
        <>
          {query && (
            <p className="text-center text-xs text-gray-400 dark:text-gray-500">
              找到 {filtered.length} 位创作者
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((author) => (
              <AuthorCard key={author.id} author={author} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
