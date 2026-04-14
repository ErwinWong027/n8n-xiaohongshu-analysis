'use client'

import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Sparkles, Zap } from 'lucide-react'

type Props = {
  open: boolean
  onClose: () => void
  usedToday: number
  limitToday: number
}

export function UpgradeDialog({ open, onClose, usedToday, limitToday }: Props) {
  const router = useRouter()

  function handleUpgrade() {
    onClose()
    router.push('/pricing')
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold flex items-center justify-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            今日次数已用完
          </DialogTitle>
        </DialogHeader>

        <div className="text-center space-y-4 py-2">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            免费版每日可使用 <span className="font-semibold text-gray-700 dark:text-gray-300">{limitToday} 次</span>，
            今日已使用 <span className="font-semibold text-rose-500">{usedToday} 次</span>
          </p>

          <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">升级 Pro · 9.9元/月</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">每日 30 次，解锁更多创作灵感</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">升级 Max · 39元/月</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">每日无限次，畅享无限创作</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              明天再试
            </Button>
            <Button
              variant="gradient"
              className="flex-1"
              onClick={handleUpgrade}
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              查看套餐
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
