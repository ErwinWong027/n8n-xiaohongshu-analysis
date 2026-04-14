import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db, userProfilesTable } from '@/lib/drizzle'
import { eq } from 'drizzle-orm'

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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()
  const { plan, planExpiresAt } = body as {
    plan: 'free' | 'pro' | 'max'
    planExpiresAt: string | null
  }

  if (!['free', 'pro', 'max'].includes(plan)) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const [updated] = await db
    .update(userProfilesTable)
    .set({
      plan,
      planExpiresAt: planExpiresAt ? new Date(planExpiresAt) : null,
    })
    .where(eq(userProfilesTable.id, id))
    .returning()

  if (!updated) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({
    user: {
      id: updated.id,
      email: updated.email,
      plan: updated.plan,
      planExpiresAt: updated.planExpiresAt,
    },
  })
}
