'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user
}

// ─── Link actions ────────────────────────────────────────────────────────────

export async function createLink(formData: FormData) {
  const user = await getSessionUser()
  const label = formData.get('label') as string
  const url = formData.get('url') as string
  const iconUrl = formData.get('iconUrl') as string | null

  const link = await prisma.link.create({
    data: { label, url, iconUrl: iconUrl || null, userId: user.id },
  })

  revalidatePath('/dashboard')
  revalidatePath(`/u/${user.username}`)
  return link
}

export async function updateLink(id: string, formData: FormData) {
  const user = await getSessionUser()
  const label = formData.get('label') as string
  const url = formData.get('url') as string
  const iconUrl = formData.get('iconUrl') as string | null

  // Verify ownership
  const existing = await prisma.link.findUnique({ where: { id } })
  if (!existing || existing.userId !== user.id) throw new Error('Forbidden')

  const link = await prisma.link.update({
    where: { id },
    data: { label, url, ...(iconUrl !== null && { iconUrl: iconUrl || null }) },
  })

  revalidatePath('/dashboard')
  revalidatePath(`/u/${user.username}`)
  return link
}

export async function deleteLink(id: string) {
  const user = await getSessionUser()

  const existing = await prisma.link.findUnique({ where: { id } })
  if (!existing || existing.userId !== user.id) throw new Error('Forbidden')

  await prisma.link.delete({ where: { id } })

  revalidatePath('/dashboard')
  revalidatePath(`/u/${user.username}`)
}

export async function reorderLinks(orderedIds: string[]) {
  const user = await getSessionUser()

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.link.updateMany({
        where: { id, userId: user.id },
        data: { order: index },
      })
    )
  )

  revalidatePath('/dashboard')
}

// ─── Profile actions ─────────────────────────────────────────────────────────

export async function updateProfile(formData: FormData) {
  const user = await getSessionUser()
  const username = formData.get('username') as string
  const pictureUrl = formData.get('pictureUrl') as string | null

  // Check username uniqueness (excluding self)
  if (username) {
    const existing = await prisma.user.findFirst({
      where: { username, NOT: { id: user.id } },
    })
    if (existing) return { error: 'Username already taken' }
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      ...(username && { username }),
      ...(pictureUrl !== null && { pictureUrl }),
    },
  })

  revalidatePath('/profile')
  revalidatePath(`/u/${username}`)
  return { success: true }
}

// ─── Admin actions ───────────────────────────────────────────────────────────

export async function adminDeleteUser(userId: string) {
  const user = await getSessionUser()
  if (user.role !== 'ADMIN') throw new Error('Forbidden')

  await prisma.user.delete({ where: { id: userId } })
  revalidatePath('/admin/users')
}

export async function adminDeleteLink(id: string) {
  const user = await getSessionUser()
  if (user.role !== 'ADMIN') throw new Error('Forbidden')

  await prisma.link.delete({ where: { id } })
  revalidatePath('/admin/links')
}

export async function adminPromoteUser(userId: string) {
  const user = await getSessionUser()
  if (user.role !== 'ADMIN') throw new Error('Forbidden')

  await prisma.user.update({
    where: { id: userId },
    data: { role: 'ADMIN' },
  })
  revalidatePath('/admin/users')
}
