import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUsageStatus } from '@/lib/usage'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
  }

  const status = await getUsageStatus(user.id)
  if (!status) {
    return NextResponse.json({ error: 'user not found' }, { status: 404 })
  }

  return NextResponse.json(status)
}
