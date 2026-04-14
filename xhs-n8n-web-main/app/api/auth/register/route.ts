import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  if (!email || !password || password.length < 6) {
    return NextResponse.json({ error: '邮箱或密码不合法' }, { status: 400 })
  }

  // 用 admin 创建用户，email_confirm: true 直接跳过邮箱验证
  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (error) {
    if (error.message.includes('already registered')) {
      return NextResponse.json({ error: '该邮箱已注册，请直接登录' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ userId: data.user.id })
}
