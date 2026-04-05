'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Author } from '@/lib/drizzle'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { MarkdownRenderer } from '@/components/markdown-renderer'
import { FileText, Users, Heart, Eye } from 'lucide-react'

interface AuthorCardProps {
  author: Author
  className?: string
}

export function AuthorCard({ author, className }: AuthorCardProps) {
  const [isReportOpen, setIsReportOpen] = useState(false)

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
    <div
      className={cn(
        'group relative bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300',
        'border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700',
        'transform hover:-translate-y-1',
        className
      )}
    >
      {/* Header with profile info */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
            {author.userName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
              {author.userName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              @{author.userXhsId}
            </p>
          </div>
        </div>

        {/* Report button */}
        {author.report && (
          <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
            <DialogTrigger asChild>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>作者报告 - {author.userName}</DialogTitle>
              </DialogHeader>
              <MarkdownRenderer content={author.report} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4" />
            <span className="text-sm">关注</span>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatNumber(author.subscribers)}
          </p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 text-gray-600 dark:text-gray-400">
            <Eye className="w-4 h-4" />
            <span className="text-sm">粉丝</span>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatNumber(author.followers)}
          </p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 text-gray-600 dark:text-gray-400">
            <Heart className="w-4 h-4" />
            <span className="text-sm">获赞</span>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatNumber(author.likes)}
          </p>
        </div>
      </div>

      {/* View details button */}
      <Link
        href={`/author/${author.id}`}
        className="block w-full bg-gradient-to-r from-red-500 to-red-600 text-white text-center py-2 px-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105"
      >
        查看详情
      </Link>
    </div>
  )
}