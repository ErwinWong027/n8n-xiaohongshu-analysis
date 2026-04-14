'use client'

import { useState, useEffect, useCallback } from 'react'
import { Loader2, Search, Crown, Sparkles, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

type UserRow = {
  id: string
  email: string
  plan: string
  planExpiresAt: string | null
  isAdmin: boolean
  dailyUsageCount: number
  lastUsageDate: string | null
  createdAt: string
}

const PLAN_LABELS: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  free: { label: '免费版', icon: <User className="w-3 h-3" />, color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' },
  pro: { label: 'Pro', icon: <Sparkles className="w-3 h-3" />, color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400' },
  max: { label: 'Max', icon: <Crown className="w-3 h-3" />, color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400' },
}

function PlanBadge({ plan }: { plan: string }) {
  const meta = PLAN_LABELS[plan] ?? PLAN_LABELS.free
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${meta.color}`}>
      {meta.icon}{meta.label}
    </span>
  )
}

function UpgradeForm({ user, onSaved }: { user: UserRow; onSaved: () => void }) {
  const [plan, setPlan] = useState(user.plan)
  const [expiresAt, setExpiresAt] = useState(
    user.planExpiresAt ? new Date(user.planExpiresAt).toISOString().slice(0, 10) : ''
  )
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    await fetch(`/api/admin/users/${user.id}/plan`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, planExpiresAt: expiresAt || null }),
    })
    setSaving(false)
    setSaved(true)
    onSaved()
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <select
        value={plan}
        onChange={(e) => setPlan(e.target.value)}
        className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
      >
        <option value="free">免费版</option>
        <option value="pro">Pro</option>
        <option value="max">Max</option>
      </select>
      <input
        type="date"
        value={expiresAt}
        onChange={(e) => setExpiresAt(e.target.value)}
        placeholder="到期日期"
        className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
      />
      <Button
        size="sm"
        onClick={handleSave}
        disabled={saving}
        className="text-xs h-7 px-3"
        variant="gradient"
      >
        {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : saved ? '已保存 ✓' : '保存'}
      </Button>
    </div>
  )
}

export function UserTable() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchUsers = useCallback(async (q: string) => {
    setLoading(true)
    const res = await fetch(`/api/admin/users?search=${encodeURIComponent(q)}`)
    if (res.ok) {
      const data = await res.json()
      setUsers(data.users)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(search), 300)
    return () => clearTimeout(timer)
  }, [search, fetchUsers])

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索用户邮箱..."
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : users.length === 0 ? (
        <p className="text-center text-gray-400 py-12 text-sm">没有找到用户</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">邮箱</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">套餐</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">今日用量</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">注册时间</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">修改套餐</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b last:border-0 border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700 dark:text-gray-200">{u.email}</span>
                      {u.isAdmin && (
                        <span className="text-xs bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400 px-1.5 py-0.5 rounded-full">管理员</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      <PlanBadge plan={u.plan} />
                      {u.planExpiresAt && (
                        <p className="text-xs text-gray-400">到期：{new Date(u.planExpiresAt).toLocaleDateString('zh-CN')}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {u.lastUsageDate === new Date().toISOString().slice(0, 10) ? u.dailyUsageCount : 0} 次
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">
                    {new Date(u.createdAt).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-4 py-3">
                    <UpgradeForm user={u} onSaved={() => fetchUsers(search)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-gray-400 text-right">共 {users.length} 位用户</p>
    </div>
  )
}
