import Link from 'next/link'
import { UserTable } from '@/components/admin/user-table'

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            ← 返回首页
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-3">用户管理</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            管理用户套餐，为付款用户升级账户
          </p>
        </div>

        <UserTable />
      </div>
    </main>
  )
}
