import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db, userProfilesTable } from '@/lib/drizzle'
import { eq, ilike, or } from 'drizzle-orm'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [profile] = await db
    .select()
    .from(userProfilesTable)
    .where(eq(userProfilesTable.id, user.id))
    .limit(1)

  return profile?.isAdmin ? profile : null
}

export async function GET(request: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const search = request.nextUrl.searchParams.get('search') ?? ''

  const users = await db
    .select({
      id: userProfilesTable.id,
      email: userProfilesTable.email,
      plan: userProfilesTable.plan,
      planExpiresAt: userProfilesTable.planExpiresAt,
      isAdmin: userProfilesTable.isAdmin,
      dailyUsageCount: userProfilesTable.dailyUsageCount,
      lastUsageDate: userProfilesTable.lastUsageDate,
      createdAt: userProfilesTable.createdAt,
    })
    .from(userProfilesTable)
    .where(search ? ilike(userProfilesTable.email, `%${search}%`) : undefined)
    .orderBy(userProfilesTable.createdAt)
    .limit(100)

  return NextResponse.json({ users })
}
