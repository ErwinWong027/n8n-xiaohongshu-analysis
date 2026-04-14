import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/components/auth-provider'

export const metadata = {
  title: '主理Note - 小红书内容创作助手',
  description:
    '探索优秀小红书创作者的内容世界，借助AI智能助手创作出色的笔记内容',
}

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.variable}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
