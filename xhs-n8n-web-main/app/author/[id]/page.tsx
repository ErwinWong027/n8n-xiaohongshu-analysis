import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db, authorsTable, notesTable } from '@/lib/drizzle'
import { eq } from 'drizzle-orm'
import { AIRewriteDialog } from '@/components/ai-rewrite-dialog'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Users, Heart, Eye, Bookmark, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AuthorPageProps {
  params: Promise<{
    id: string
  }>
}

async function AuthorDetail({ id }: { id: number }) {
  const author = await db
    .select()
    .from(authorsTable)
    .where(eq(authorsTable.id, id))
    .limit(1)

  if (author.length === 0) {
    notFound()
  }

  const notes = await db
    .select()
    .from(notesTable)
    .where(eq(notesTable.authorId, id))
    .orderBy(notesTable.createdAt)

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Author Header */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-800 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {author[0].userName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {author[0].userName}
              </h1>
              <p className="text-lg text-gray-500 dark:text-gray-400">
                @{author[0].userXhsId}
              </p>
            </div>
          </div>

          <AIRewriteDialog author={author[0]} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400 mb-2">
              <Users className="w-5 h-5" />
              <span>关注数</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(author[0].subscribers)}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400 mb-2">
              <Eye className="w-5 h-5" />
              <span>粉丝数</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(author[0].followers)}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400 mb-2">
              <Heart className="w-5 h-5" />
              <span>获赞数</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(author[0].likes)}
            </p>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          笔记作品 ({notes.length})
        </h2>
        
        {notes.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl p-12 shadow-lg border border-gray-100 dark:border-gray-800 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              该作者暂无笔记数据
            </p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className={cn(
                  'masonry-item bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-800',
                  'hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1',
                  note.isTop10 && 'ring-2 ring-red-500 ring-opacity-50'
                )}
              >
                {note.isTop10 && (
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 mb-3">
                    🔥 Top10 爆款
                  </div>
                )}
                
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-3">
                  {note.title}
                </h3>
                
                {note.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                    {note.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{formatNumber(note.likes || 0)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Bookmark className="w-4 h-4" />
                      <span>{formatNumber(note.collects || 0)}</span>
                    </div>
                  </div>
                  <span className="text-xs">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function AuthorDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Author Header Skeleton */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-800 mb-8 animate-pulse">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
          </div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="text-center">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes Skeleton */}
      <div className="mb-8">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-6"></div>
        <div className="columns-1 md:columns-2 lg:columns-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="masonry-item bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 animate-pulse"
              style={{ height: Math.random() * 200 + 200 }} // Random heights for masonry effect
            >
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const resolvedParams = await params
  const authorId = parseInt(resolvedParams.id)
  
  if (isNaN(authorId)) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回首页</span>
        </Link>

        <Suspense fallback={<AuthorDetailSkeleton />}>
          <AuthorDetail id={authorId} />
        </Suspense>
      </div>
    </main>
  )
}