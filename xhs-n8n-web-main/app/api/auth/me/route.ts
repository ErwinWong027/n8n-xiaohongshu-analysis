import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db, userProfilesTable } from '@/lib/drizzle'
import { eq } from 'drizzle-orm'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  const [profile] = await db
    .select()
    .from(userProfilesTable)
    .where(eq(userProfilesTable.id, user.id))
    .limit(1)

  if (!profile) {
    return NextResponse.json({ user: null }, { status: 404 })
  }

  return NextResponse.json({
    user: {
      id: profile.id,
      email: profile.email,
      plan: profile.plan,
      planExpiresAt: profile.planExpiresAt,
      dailyUsageCount: profile.dailyUsageCount,
      lastUsageDate: profile.lastUsageDate,
      isAdmin: profile.isAdmin,
    },
  })
}
