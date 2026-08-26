import { auth } from "@clerk/nextjs/server";

export async function requireAdmin(): Promise<{ userId: string } | null> {
  const { userId, sessionClaims } = await auth();
  if (!userId) return null;
  const role = (sessionClaims?.publicMetadata as { role?: string })?.role;
  if (role !== "admin") return null;
  return { userId };
}
