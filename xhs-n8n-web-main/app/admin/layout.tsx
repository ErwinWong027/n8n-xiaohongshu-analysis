import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { db, userProfilesTable } from '@/lib/drizzle'
import { eq } from 'drizzle-orm'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const [profile] = await db
    .select()
    .from(userProfilesTable)
    .where(eq(userProfilesTable.id, user.id))
    .limit(1)

  if (!profile?.isAdmin) {
    redirect('/')
  }

  return <>{children}</>
}
