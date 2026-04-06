'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { VisuallyHidden } from '@/components/ui/visually-hidden'
import { Button } from '@/components/ui/button'
import { MarkdownRenderer } from '@/components/markdown-renderer'
import { cn } from '@/lib/utils'
import { Sparkles, Send, Copy, RefreshCw } from 'lucide-react'
import { Author } from '@/lib/drizzle'

interface AIRewriteDialogProps {
  author?: Author
  children?: React.ReactNode
}

export function AIRewriteDialog({ author, children }: AIRewriteDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState('')
  const [addEmojis, setAddEmojis] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)

  const handleRewrite = async () => {
    if (!content.trim()) return

    setIsLoading(true)
    setIsStreaming(true)
    setGeneratedContent('')

    try {
      const response = await fetch('/api/ai-rewrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          addEmojis,
          authorId: author?.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate content')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') {
                setIsStreaming(false)
                break
              }
              try {
                const parsed = JSON.parse(data)
                if (parsed.content) {
                  setGeneratedContent(prev => prev + parsed.content)
                }
              } catch (e) {
                // Ignore parsing errors
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error generating content:', error)
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
    }
  }

  const handleCopy = async () => {
    if (generatedContent) {
      await navigator.clipboard.writeText(generatedContent)
    }
  }

  const handleReset = () => {
    setGeneratedContent('')
    setContent('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          基于该作者仿写
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 flex flex-col">
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>AI 小红书笔记仿写</DialogTitle>
          </DialogHeader>
        </VisuallyHidden>
        <div className="flex flex-1 min-h-0">
          {/* Left Panel - Configuration */}
          <div className="w-1/2 border-r border-gray-200 dark:border-gray-700 p-6 overflow-y-auto flex-shrink-0 min-h-0">
            <div className="space-y-6 h-full">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-red-600" />
                <h2 className="text-xl font-semibold">AI 小红书笔记仿写</h2>
              </div>

              {author && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="font-medium mb-2">当前作者</h3>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {author.userName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{author.userName}</p>
                      <p className="text-xs text-gray-500">@{author.userXhsId}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  内容主题和创作要求
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="请输入您想要创作的主题和具体要求，例如：&#10;&#10;主题：夏日穿搭分享&#10;要求：适合学生党，预算在500元以内，风格清新甜美，包含具体的搭配建议..."
                  className={cn(
                    'w-full h-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg',
                    'focus:ring-2 focus:ring-red-500 focus:border-transparent',
                    'dark:bg-gray-700 dark:text-white resize-none'
                  )}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="addEmojis"
                  checked={addEmojis}
                  onChange={(e) => setAddEmojis(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="addEmojis" className="text-sm">
                  添加 emoji 表情
                </label>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleRewrite}
                  disabled={!content.trim() || isLoading}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      开始仿写
                    </>
                  )}
                </Button>

                {generatedContent && (
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleCopy}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      复制
                    </Button>
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      重置
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Generated Content */}
          <div className="w-1/2 p-6 flex flex-col min-h-0">
            <div className="flex-shrink-0 mb-4">
              <h3 className="text-lg font-semibold">生成结果</h3>
            </div>
            
            <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 min-h-0 relative">
              <div className="absolute inset-4 overflow-y-auto dialog-scroll">
                {generatedContent ? (
                  <div>
                    <MarkdownRenderer 
                      content={generatedContent} 
                      className="text-sm"
                    />
                    {isStreaming && (
                      <span className="inline-block w-2 h-5 bg-red-600 ml-1 animate-pulse" />
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    <div className="text-center">
                      <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>在左侧输入内容，点击&ldquo;开始仿写&rdquo;来生成小红书笔记</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}