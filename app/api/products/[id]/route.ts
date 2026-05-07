import { db } from "@/lib/db/client";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const product = await db.select().from(products).where(eq(products.id, id));

    return NextResponse.json(product[0] || null);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar produto" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await db
      .update(products)
      .set({
        name: body.name,
        sku: body.sku,
        description: body.description,
        unitPrice: body.unitPrice,
        stockQuantity: body.stockQuantity,
        imageUrl: body.imageUrl,
        category: body.category,
      })
      .where(eq(products.id, id))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao atualizar produto" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const body = await request.json();
    const {
      name,
      sku,
      description,
      unitPrice,
      stockQuantity,
      imageUrl,
      category,
    } = body;

    const updated = await db
      .update(products)
      .set({
        name: name || undefined,
        sku: sku || undefined,
        description: description ?? undefined,
        unitPrice: unitPrice ? String(parseFloat(unitPrice)) : undefined,
        stockQuantity:
          stockQuantity !== undefined ? parseInt(stockQuantity) : undefined,
        imageUrl: imageUrl || undefined,
        category: category || undefined,
        updatedAt: new Date(),
      })
      .where(eq(products.id, (await params).id))
      .returning();

    return NextResponse.json(updated[0] || null);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params; // 👈 AQUI está a correção

    const deleted = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE error:", error);

    return NextResponse.json(
      { error: "Erro ao eliminar produto" },
      { status: 500 },
    );
  }
}
