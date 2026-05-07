import { auth, clerkClient } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

async function requireAdmin() {
  const { userId, sessionClaims } = await auth();
  if (!userId) return { error: "Não autorizado", status: 401 };
  const role = (sessionClaims?.metadata as any)?.role;
  if (role !== "admin") return { error: "Acesso negado", status: 403 };

  return { userId };
}

export async function GET() {
  const check = await requireAdmin();
  if ("error" in check)
    return NextResponse.json({ error: check.error }, { status: check.status });

  const users = await sql`
    SELECT id, name, email, role, created_at
    FROM users ORDER BY created_at DESC
  `;
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const check = await requireAdmin();
  if ("error" in check)
    return NextResponse.json({ error: check.error }, { status: check.status });

  const { name, email, role } = await req.json();

  if (!name || !email || !role)
    return NextResponse.json(
      { error: "Campos obrigatórios em falta" },
      { status: 400 },
    );

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
  const redirectUrl = new URL("/sign-in", baseUrl).toString();
  if (existing.length > 0)
    return NextResponse.json({ error: "Email já existe" }, { status: 400 });

  // Send invitation only — Clerk emails the user to set their own password.
  // The real clerk_id is assigned via webhook (user.created) when they accept.
  try {
    const client = await clerkClient();
    await client.invitations.createInvitation({
      emailAddress: email,
      publicMetadata: { role },
      redirectUrl,
    });
  } catch (err: any) {
    console.error("Clerk invitation error:", err);
    const msg = err?.errors?.[0]?.longMessage || "Erro ao enviar convite";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  // Pre-create in DB as inactive — webhook updates clerk_id + is_active when user accepts
  const user = await sql`
    INSERT INTO users (clerk_id, email, name, role)
    VALUES (${"pending|" + email}, ${email}, ${name}, ${role})
    RETURNING id, name, email, role, created_at
  `;

  return NextResponse.json(user[0], { status: 201 });
}

export async function DELETE(req: Request) {
  const check = await requireAdmin();
  if ("error" in check)
    return NextResponse.json({ error: check.error }, { status: check.status });

  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID em falta" }, { status: 400 });

  const rows = await sql`SELECT clerk_id FROM users WHERE id = ${id}`;
  if (rows.length === 0)
    return NextResponse.json(
      { error: "Utilizador não encontrado" },
      { status: 404 },
    );

  const clerkId = rows[0].clerk_id;

  // Only delete from Clerk if user already accepted the invite (has a real clerk_id)
  if (clerkId && !clerkId.startsWith("pending|")) {
    try {
      const client = await clerkClient();
      await client.users.deleteUser(clerkId);
    } catch (err) {
      console.warn("Could not delete from Clerk:", err);
    }
  }

  await sql`DELETE FROM users WHERE id = ${id}`;
  return NextResponse.json({ success: true });
}
