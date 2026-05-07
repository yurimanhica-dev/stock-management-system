import { WebhookEvent } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";
import { headers } from "next/headers";
import { Webhook } from "svix";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) throw new Error("CLERK_WEBHOOK_SECRET not set");

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature)
    return new Response("Missing svix headers", { status: 400 });

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch {
    return new Response("Invalid webhook", { status: 400 });
  }

  if (evt.type === "user.created") {
    const { id, email_addresses, first_name, last_name, public_metadata } =
      evt.data;
    const email = email_addresses[0]?.email_address;
    const name = [first_name, last_name].filter(Boolean).join(" ") || email;
    // Role from publicMetadata set during invitation — fallback to sales_person
    const role = (public_metadata?.role as string) || "sales_person";

    // User was pre-created in DB when invite was sent (clerk_id = "pending|email")
    // Update that row with the real Clerk ID and activate it
    const updated = await sql`
      UPDATE users
      SET clerk_id = ${id}, name = ${name}, role = ${role}, is_active = true
      WHERE email = ${email} AND clerk_id = ${"pending|" + email}
      RETURNING id
    `;

    // User signed up organically (not via invite) — insert fresh
    if (updated.length === 0) {
      await sql`
        INSERT INTO users (clerk_id, email, name, role, is_active)
        VALUES (${id}, ${email}, ${name}, ${role}, true)
        ON CONFLICT (clerk_id) DO NOTHING
      `;
    }
  }

  if (evt.type === "user.deleted") {
    const { id } = evt.data;
    await sql`DELETE FROM users WHERE clerk_id = ${id}`;
  }

  return new Response("OK", { status: 200 });
}
