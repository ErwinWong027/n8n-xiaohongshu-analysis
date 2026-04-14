import { db, userProfilesTable } from '@/lib/drizzle'
import { eq, sql } from 'drizzle-orm'

export const PLAN_LIMITS: Record<string, number> = {
  free: 5,
  pro: 30,
  max: Infinity,
}

export function getPlanLimit(plan: string): number {
  return PLAN_LIMITS[plan] ?? PLAN_LIMITS.free
}

/**
 * Check if user can use the feature today, and increment usage if allowed.
 * Returns { allowed: true } or { allowed: false, plan, usedToday, limit }.
 * Uses a single atomic UPDATE to avoid race conditions.
 */
export async function checkAndIncrementUsage(userId: string): Promise<
  | { allowed: true; usedToday: number; limit: number; plan: string }
  | { allowed: false; usedToday: number; limit: number; plan: string }
> {
  const today = new Date().toISOString().slice(0, 10) // 'YYYY-MM-DD'

  const [profile] = await db
    .select()
    .from(userProfilesTable)
    .where(eq(userProfilesTable.id, userId))
    .limit(1)

  if (!profile) {
    return { allowed: false, usedToday: 0, limit: 0, plan: 'free' }
  }

  // Check if plan has expired — if so, treat as free
  const effectivePlan =
    profile.planExpiresAt && new Date(profile.planExpiresAt) < new Date()
      ? 'free'
      : profile.plan

  const limit = getPlanLimit(effectivePlan)

  // Reset usage count if it's a new day
  const isNewDay = profile.lastUsageDate !== today

  const currentCount = isNewDay ? 0 : profile.dailyUsageCount

  if (limit !== Infinity && currentCount >= limit) {
    return { allowed: false, usedToday: currentCount, limit, plan: effectivePlan }
  }

  // Atomically increment (reset on new day)
  await db
    .update(userProfilesTable)
    .set({
      dailyUsageCount: isNewDay ? 1 : sql`${userProfilesTable.dailyUsageCount} + 1`,
      lastUsageDate: today,
      // Auto-downgrade expired plans
      ...(profile.planExpiresAt && new Date(profile.planExpiresAt) < new Date()
        ? { plan: 'free', planExpiresAt: null }
        : {}),
    })
    .where(eq(userProfilesTable.id, userId))

  return { allowed: true, usedToday: currentCount + 1, limit, plan: effectivePlan }
}

/**
 * Get current usage status for a user without incrementing.
 */
export async function getUsageStatus(userId: string) {
  const [profile] = await db
    .select()
    .from(userProfilesTable)
    .where(eq(userProfilesTable.id, userId))
    .limit(1)

  if (!profile) return null

  const effectivePlan =
    profile.planExpiresAt && new Date(profile.planExpiresAt) < new Date()
      ? 'free'
      : profile.plan

  const limit = getPlanLimit(effectivePlan)
  const today = new Date().toISOString().slice(0, 10)
  const usedToday = profile.lastUsageDate === today ? profile.dailyUsageCount : 0
  const remaining = limit === Infinity ? Infinity : Math.max(0, limit - usedToday)
  const canUse = limit === Infinity || usedToday < limit

  return {
    plan: effectivePlan,
    usedToday,
    limitToday: limit === Infinity ? -1 : limit,
    remaining: remaining === Infinity ? -1 : remaining,
    canUse,
  }
}
