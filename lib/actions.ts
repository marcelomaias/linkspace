"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { links, users } from "@/lib/schema";
import { eq, and, ne } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createId } from "@paralleldrive/cuid2";

async function getSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

// ─── Link actions ────────────────────────────────────────────────────────────

export async function createLink(formData: FormData) {
  const user = await getSessionUser();
  const label = formData.get("label") as string;
  const url = formData.get("url") as string;
  const iconUrl = formData.get("iconUrl") as string | null;

  const [link] = await db
    .insert(links)
    .values({
      id: createId(),
      label,
      url,
      iconUrl: iconUrl || null,
      userId: user.id,
      updatedAt: new Date(),
    })
    .returning();

  revalidatePath("/dashboard");
  revalidatePath(`/u/${user.username}`);
  return link;
}

export async function updateLink(id: string, formData: FormData) {
  const user = await getSessionUser();
  const label = formData.get("label") as string;
  const url = formData.get("url") as string;
  const iconUrl = formData.get("iconUrl") as string | null;

  const [existing] = await db.select().from(links).where(eq(links.id, id));
  if (!existing || existing.userId !== user.id) throw new Error("Forbidden");

  const [link] = await db
    .update(links)
    .set({
      label,
      url,
      ...(iconUrl !== null && { iconUrl: iconUrl || null }),
      updatedAt: new Date(),
    })
    .where(eq(links.id, id))
    .returning();

  revalidatePath("/dashboard");
  revalidatePath(`/u/${user.username}`);
  return link;
}

export async function deleteLink(id: string) {
  const user = await getSessionUser();

  const [existing] = await db.select().from(links).where(eq(links.id, id));
  if (!existing || existing.userId !== user.id) throw new Error("Forbidden");

  await db.delete(links).where(eq(links.id, id));

  revalidatePath("/dashboard");
  revalidatePath(`/u/${user.username}`);
}

export async function reorderLinks(orderedIds: string[]) {
  const user = await getSessionUser();

  await Promise.all(
    orderedIds.map((id, index) =>
      db
        .update(links)
        .set({ order: index, updatedAt: new Date() })
        .where(and(eq(links.id, id), eq(links.userId, user.id))),
    ),
  );

  revalidatePath("/dashboard");
}

// ─── Profile actions ─────────────────────────────────────────────────────────

export async function updateProfile(formData: FormData) {
  const user = await getSessionUser();
  const username = formData.get("username") as string;
  const pictureUrl = formData.get("pictureUrl") as string | null;

  if (username) {
    const [existing] = await db
      .select()
      .from(users)
      .where(and(eq(users.username, username), ne(users.id, user.id)));
    if (existing) return { error: "Username already taken" };
  }

  await db
    .update(users)
    .set({
      ...(username && { username }),
      ...(pictureUrl !== null && { pictureUrl }),
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  revalidatePath("/profile");
  revalidatePath(`/u/${username}`);
  return { success: true };
}

// ─── Admin actions ───────────────────────────────────────────────────────────

export async function adminDeleteUser(userId: string) {
  const user = await getSessionUser();
  if (user.role !== "ADMIN") throw new Error("Forbidden");

  await db.delete(users).where(eq(users.id, userId));
  revalidatePath("/admin/users");
}

export async function adminDeleteLink(id: string) {
  const user = await getSessionUser();
  if (user.role !== "ADMIN") throw new Error("Forbidden");

  await db.delete(links).where(eq(links.id, id));
  revalidatePath("/admin/links");
}

export async function adminPromoteUser(userId: string) {
  const user = await getSessionUser();
  if (user.role !== "ADMIN") throw new Error("Forbidden");

  await db
    .update(users)
    .set({ role: "ADMIN", updatedAt: new Date() })
    .where(eq(users.id, userId));

  revalidatePath("/admin/users");
}
