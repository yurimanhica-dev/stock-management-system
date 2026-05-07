import { auth, clerkClient } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  // 🧠 1. DB FIRST (fonte principal)
  let dbUser = await sql`
    SELECT id, name, email, role
    FROM users
    WHERE clerk_id = ${userId}
    LIMIT 1
  `;

  let user: any;

  if (dbUser.length > 0) {
    user = dbUser[0];
  } else {
    // 🔐 2. fallback Clerk
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    const name =
      clerkUser.firstName && clerkUser.lastName
        ? `${clerkUser.firstName} ${clerkUser.lastName}`
        : email;

    const role = (clerkUser.publicMetadata as any)?.role ?? "sales_person";

    // 💾 opcional: criar na DB (sync automático)
    const inserted = await sql`
      INSERT INTO users (clerk_id, name, email, role)
      VALUES (${userId}, ${name}, ${email}, ${role})
      RETURNING id, name, email, role
    `;

    user = inserted[0];
  }

  // 📊 STATS (mantido igual)
  const statsRows = await sql`
    SELECT
      COUNT(DISTINCT s.id)::int AS total_sales,
      COALESCE(SUM(si.subtotal), 0)::float AS total_revenue,
      COALESCE(AVG(s.total_amount), 0)::float AS average_ticket
    FROM sales s
    LEFT JOIN sale_items si ON si.sale_id = s.id
    WHERE s.created_at >= CURRENT_DATE
  `;

  const productsCountRow = await sql`
    SELECT COUNT(DISTINCT si.product_id)::int AS products_count
    FROM sale_items si
    JOIN sales s ON s.id = si.sale_id
    WHERE s.created_at >= CURRENT_DATE
  `;

  const hourlyRows = await sql`
    SELECT
      TO_CHAR(s.created_at, 'HH24:00') AS hour,
      COUNT(s.id)::int AS sales,
      COALESCE(SUM(si.subtotal), 0)::float AS revenue
    FROM sales s
    LEFT JOIN sale_items si ON si.sale_id = s.id
    WHERE s.created_at >= CURRENT_DATE
    GROUP BY TO_CHAR(s.created_at, 'HH24:00')
    ORDER BY hour
  `;

  const hourlyMap: Record<string, any> = {};

  for (const row of hourlyRows) {
    hourlyMap[row.hour] = {
      sales: row.sales,
      revenue: row.revenue,
    };
  }

  const salesByHour = Array.from({ length: 24 }, (_, h) => {
    const key = `${h.toString().padStart(2, "0")}:00`;
    return {
      hour: key,
      sales: hourlyMap[key]?.sales ?? 0,
      revenue: hourlyMap[key]?.revenue ?? 0,
    };
  });

  const COLORS = [
    "#a855f7",
    "#d946ef",
    "#ec4899",
    "#f43f5e",
    "#f97316",
    "#eab308",
    "#84cc16",
    "#22c55e",
    "#10b981",
    "#14b8a6",
  ];

  const productRows = await sql`
    SELECT
      p.name,
      SUM(si.quantity)::int AS quantity,
      SUM(si.subtotal)::float AS revenue
    FROM sale_items si
    JOIN products p ON p.id = si.product_id
    JOIN sales s ON s.id = si.sale_id
    WHERE s.created_at >= CURRENT_DATE
    GROUP BY p.name
    ORDER BY quantity DESC
    LIMIT 10
  `;

  const productSales = productRows.map((r, i) => ({
    name: r.name,
    quantity: r.quantity,
    revenue: r.revenue,
    color: COLORS[i % COLORS.length],
  }));

  // 🚀 RESPONSE FINAL LIMPO
  return NextResponse.json({
    user,
    stats: {
      totalSales: statsRows[0].total_sales,
      totalRevenue: Number(statsRows[0].total_revenue.toFixed(2)),
      productsCount: productsCountRow[0].products_count,
      averageTicket: Number(statsRows[0].average_ticket.toFixed(2)),
    },
    salesByHour,
    productSales,
  });
}
