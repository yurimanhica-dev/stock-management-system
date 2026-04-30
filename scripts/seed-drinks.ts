import { neon } from '@neondatabase/serverless'

const drinks = [
  {
    name: 'Água Mineral 500ml',
    sku: 'AGUA-500',
    category: 'Água',
    unitPrice: 0.5,
    stockQuantity: 150,
    imageUrl: 'https://images.unsplash.com/photo-1522038645885-fbf485ef688e?w=400&h=400&fit=crop',
    description: 'Água mineral natural em garrafa de 500ml',
  },
  {
    name: 'Água Mineral 1.5L',
    sku: 'AGUA-1500',
    category: 'Água',
    unitPrice: 1.0,
    stockQuantity: 100,
    imageUrl: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&h=400&fit=crop',
    description: 'Água mineral natural em garrafa de 1.5 litros',
  },
  {
    name: 'Coca-Cola 330ml',
    sku: 'COCA-330',
    category: 'Refrigerantes',
    unitPrice: 1.5,
    stockQuantity: 200,
    imageUrl: 'https://images.unsplash.com/photo-1554866585-acbb4e54b2b3?w=400&h=400&fit=crop',
    description: 'Coca-Cola em lata de 330ml',
  },
  {
    name: 'Coca-Cola 1.5L',
    sku: 'COCA-1500',
    category: 'Refrigerantes',
    unitPrice: 2.5,
    stockQuantity: 80,
    imageUrl: 'https://images.unsplash.com/photo-1554866585-acbb4e54b2b3?w=400&h=400&fit=crop',
    description: 'Coca-Cola em garrafa de 1.5 litros',
  },
  {
    name: 'Sprite 330ml',
    sku: 'SPRITE-330',
    category: 'Refrigerantes',
    unitPrice: 1.5,
    stockQuantity: 180,
    imageUrl: 'https://images.unsplash.com/photo-1625169565986-dd094c14dfe9?w=400&h=400&fit=crop',
    description: 'Sprite em lata de 330ml',
  },
  {
    name: 'Fanta Laranja 330ml',
    sku: 'FANTA-LAR',
    category: 'Refrigerantes',
    unitPrice: 1.4,
    stockQuantity: 160,
    imageUrl: 'https://images.unsplash.com/photo-1554866585-acbb4e54b2b3?w=400&h=400&fit=crop',
    description: 'Fanta Laranja em lata de 330ml',
  },
  {
    name: 'Sumo Natural Laranja',
    sku: 'SUMO-LAR',
    category: 'Sumos',
    unitPrice: 2.0,
    stockQuantity: 90,
    imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd1fe403?w=400&h=400&fit=crop',
    description: 'Sumo natural de laranja 250ml',
  },
  {
    name: 'Sumo Natural Maçã',
    sku: 'SUMO-MACA',
    category: 'Sumos',
    unitPrice: 2.0,
    stockQuantity: 85,
    imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=400&fit=crop',
    description: 'Sumo natural de maçã 250ml',
  },
  {
    name: 'Iced Coffee',
    sku: 'ICECOFFEE',
    category: 'Café',
    unitPrice: 2.5,
    stockQuantity: 120,
    imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?w=400&h=400&fit=crop',
    description: 'Café gelado pronto a beber 250ml',
  },
  {
    name: 'Chá Gelado Limão',
    sku: 'CHA-LIMAO',
    category: 'Chás',
    unitPrice: 1.8,
    stockQuantity: 110,
    imageUrl: 'https://images.unsplash.com/photo-1597318972922-4881a09a7bae?w=400&h=400&fit=crop',
    description: 'Chá gelado com sabor de limão 330ml',
  },
  {
    name: 'Energético Red Bull',
    sku: 'REDBULL-250',
    category: 'Energéticos',
    unitPrice: 2.8,
    stockQuantity: 75,
    imageUrl: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&h=400&fit=crop',
    description: 'Red Bull energético 250ml',
  },
  {
    name: 'Energético PowerAde',
    sku: 'POWERADE-500',
    category: 'Energéticos',
    unitPrice: 2.0,
    stockQuantity: 95,
    imageUrl: 'https://images.unsplash.com/photo-1528508263409-5d3fcb6c7de2?w=400&h=400&fit=crop',
    description: 'PowerAde bebida desportiva 500ml',
  },
  {
    name: 'Cerveja Sagres 330ml',
    sku: 'SAGRES-330',
    category: 'Bebidas Alcoólicas',
    unitPrice: 1.8,
    stockQuantity: 200,
    imageUrl: 'https://images.unsplash.com/photo-1608270861620-7aaa4d214109?w=400&h=400&fit=crop',
    description: 'Cerveja Sagres em lata de 330ml',
  },
  {
    name: 'Vinho Branco',
    sku: 'VINHO-BRANCO',
    category: 'Bebidas Alcoólicas',
    unitPrice: 5.0,
    stockQuantity: 45,
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2cab2707d?w=400&h=400&fit=crop',
    description: 'Vinho branco regional 750ml',
  },
  {
    name: 'Vinho Tinto',
    sku: 'VINHO-TINTO',
    category: 'Bebidas Alcoólicas',
    unitPrice: 5.5,
    stockQuantity: 50,
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2cab2707d?w=400&h=400&fit=crop',
    description: 'Vinho tinto regional 750ml',
  },
  {
    name: 'Milkshake Morango',
    sku: 'MILKSHAKE-MOR',
    category: 'Bebidas Geladas',
    unitPrice: 3.0,
    stockQuantity: 60,
    imageUrl: 'https://images.unsplash.com/photo-1608270861620-7aaa4d214109?w=400&h=400&fit=crop',
    description: 'Milkshake de morango feito na hora 400ml',
  },
  {
    name: 'Smoothie Tropical',
    sku: 'SMOOTHIE-TROP',
    category: 'Bebidas Geladas',
    unitPrice: 3.5,
    stockQuantity: 70,
    imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd1fe403?w=400&h=400&fit=crop',
    description: 'Smoothie tropical com frutos exóticos 400ml',
  },
]

async function seed() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error('DATABASE_URL is not set')
    process.exit(1)
  }

  const db = neon(databaseUrl)

  try {
    console.log('Starting seed with drinks...')

    // Clear existing products (optional)
    // await db`DELETE FROM products`

    // Insert drinks
    for (const drink of drinks) {
      await db`
        INSERT INTO products (name, sku, category, unit_price, stock_quantity, image_url, description)
        VALUES (${drink.name}, ${drink.sku}, ${drink.category}, ${drink.unitPrice}, ${drink.stockQuantity}, ${drink.imageUrl}, ${drink.description})
        ON CONFLICT (sku) DO UPDATE SET
        stock_quantity = products.stock_quantity + ${drink.stockQuantity},
        image_url = ${drink.imageUrl}
      `
      console.log(`✓ Added/Updated: ${drink.name}`)
    }

    console.log(`\n✅ Seeded ${drinks.length} drinks successfully!`)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seed()
