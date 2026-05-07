import { auth, clerkClient } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

const memoryCache = new Map<string, any>(); // temporário (melhor: Redis)

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  // 1. cache layer (evita Clerk + DB repeat)
  if (memoryCache.has(userId)) {
    return NextResponse.json(memoryCache.get(userId));
  }

  // 2. DB first
  let user = await sql`
    SELECT id, name, email, role
    FROM users
    WHERE clerk_id = ${userId}
    LIMIT 1
  `;

  // 3. fallback Clerk (APENAS 1x por user)
  if (user.length === 0) {
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);

    user = [
      {
        id: null,
        name:
          clerkUser.firstName && clerkUser.lastName
            ? `${clerkUser.firstName} ${clerkUser.lastName}`
            : clerkUser.emailAddresses[0]?.emailAddress,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        role: clerkUser.publicMetadata?.role ?? "user",
      },
    ];
  }

  const result = {
    user: user[0],
  };

  memoryCache.set(userId, result);

  return NextResponse.json(result);
}
