import { Suspense } from 'react'
import { db, authorsTable, Author } from '@/lib/drizzle'
import { AuthorsGrid } from '@/components/authors-grid'

export const dynamic = 'force-dynamic'

async function AuthorsList() {
  let authors: Author[] = []

  try {
    authors = await db.select().from(authorsTable).orderBy(authorsTable.createdAt)
  } catch (error) {
    console.error('Error fetching authors:', error)
  }

  if (authors.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          暂无作者数据，请先添加一些作者信息
        </p>
      </div>
    )
  }

  return <AuthorsGrid authors={authors} />
}

function AuthorsListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 animate-pulse"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
              </div>
            </div>
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="text-center">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 mx-auto mb-2" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto" />
              </div>
            ))}
          </div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent mb-4">
            主理Note
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            探索优秀小红书创作者的内容世界，借助AI智能助手创作出色的笔记内容
          </p>
        </div>

        <Suspense fallback={<AuthorsListSkeleton />}>
          <AuthorsList />
        </Suspense>
      </div>
    </main>
  )
}
