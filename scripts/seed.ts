import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../lib/db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log("Starting seed...");

  try {
    await sql`DELETE FROM sale_items`;
    await sql`DELETE FROM sales`;
    await sql`DELETE FROM products`;

    const products = await db
      .insert(schema.products)
      .values([
        {
          name: "Água Mineral 1.5L",
          sku: "AGUA-1500",
          category: "Água",
          unitPrice: "300",
          stockQuantity: 100,
          imageUrl:
            "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=400&fit=crop",
          description: "Água mineral natural em garrafa de 1.5 litros",
        },
        {
          name: "Coca-Cola 330ml",
          sku: "COCA-330",
          category: "Refrigerantes",
          unitPrice: "75",
          stockQuantity: 200,
          imageUrl:
            "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&h=400&fit=crop",
          description: "Coca-Cola em lata de 330ml",
        },
        {
          name: "Coca-Cola 1.5L",
          sku: "COCA-1500",
          category: "Refrigerantes",
          unitPrice: "180",
          stockQuantity: 80,
          imageUrl:
            "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop",
          description: "Coca-Cola em garrafa de 1.5 litros",
        },
        {
          name: "Sprite 330ml",
          sku: "SPRITE-330",
          category: "Refrigerantes",
          unitPrice: "150",
          stockQuantity: 180,
          imageUrl:
            "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=400&h=400&fit=crop",
          description: "Sprite em lata de 330ml",
        },
        {
          name: "Fanta Laranja 330ml",
          sku: "FANTA-LAR",
          category: "Refrigerantes",
          unitPrice: "140",
          stockQuantity: 160,
          imageUrl:
            "https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=400&h=400&fit=crop",
          description: "Fanta Laranja em lata de 330ml",
        },
        {
          name: "Sumo Natural Laranja",
          sku: "SUMO-LAR",
          category: "Sumos",
          unitPrice: "200",
          stockQuantity: 90,
          imageUrl:
            "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=400&fit=crop",
          description: "Sumo natural de laranja 250ml",
        },
        {
          name: "Sumo Natural Maçã",
          sku: "SUMO-MACA",
          category: "Sumos",
          unitPrice: "200",
          stockQuantity: 85,
          imageUrl:
            "https://images.unsplash.com/photo-1576673442511-7e39b6545c87?w=400&h=400&fit=crop",
          description: "Sumo natural de maçã 250ml",
        },
        {
          name: "Iced Coffee",
          sku: "ICECOFFEE",
          category: "Café",
          unitPrice: "130",
          stockQuantity: 120,
          imageUrl:
            "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop",
          description: "Café gelado pronto a beber 250ml",
        },
        {
          name: "Chá Gelado Limão",
          sku: "CHA-LIMAO",
          category: "Chás",
          unitPrice: "180",
          stockQuantity: 110,
          imageUrl:
            "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop",
          description: "Chá gelado com sabor de limão 330ml",
        },
        {
          name: "Energético Red Bull",
          sku: "REDBULL-250",
          category: "Energéticos",
          unitPrice: "150",
          stockQuantity: 75,
          imageUrl:
            "https://images.unsplash.com/photo-1608614933920-7f0b4e6d6c31?w=400&h=400&fit=crop",
          description: "Red Bull energético 250ml",
        },
        {
          name: "Energético PowerAde",
          sku: "POWERADE-500",
          category: "Energéticos",
          unitPrice: "200",
          stockQuantity: 95,
          imageUrl:
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
          description: "PowerAde bebida desportiva 500ml",
        },
        {
          name: "Cerveja Sagres 330ml",
          sku: "SAGRES-330",
          category: "Bebidas Alcoólicas",
          unitPrice: "180",
          stockQuantity: 200,
          imageUrl:
            "https://images.unsplash.com/photo-1618183479302-1e0aa382c36b?w=400&h=400&fit=crop",
          description: "Cerveja Sagres em lata de 330ml",
        },
        {
          name: "Vinho Branco",
          sku: "VINHO-BRANCO",
          category: "Bebidas Alcoólicas",
          unitPrice: "500",
          stockQuantity: 45,
          imageUrl:
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
          description: "Vinho branco regional 750ml",
        },
        {
          name: "Vinho Tinto",
          sku: "VINHO-TINTO",
          category: "Bebidas Alcoólicas",
          unitPrice: "550",
          stockQuantity: 50,
          imageUrl:
            "https://images.unsplash.com/photo-1510812431401-41d2cab2707d?w=400&h=400&fit=crop",
          description: "Vinho tinto regional 750ml",
        },
        {
          name: "Milkshake Morango",
          sku: "MILKSHAKE-MOR",
          category: "Bebidas Geladas",
          unitPrice: "300",
          stockQuantity: 60,
          imageUrl:
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop",
          description: "Milkshake de morango feito na hora 400ml",
        },
        {
          name: "Smoothie Tropical",
          sku: "SMOOTHIE-TROP",
          category: "Bebidas Geladas",
          unitPrice: "350",
          stockQuantity: 70,
          imageUrl:
            "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&h=400&fit=crop",
          description: "Smoothie tropical com frutos exóticos 400ml",
        },
      ])
      .returning();

    console.log(`✓ Inseridos ${products.length} produtos`);
    console.log("✓ Seed concluído com sucesso!");
  } catch (error) {
    console.error("Erro ao fazer seed:", error);
    throw error;
  }
}

seed();
