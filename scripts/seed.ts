import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../lib/db/schema'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema })

async function seed() {
  console.log('Starting seed...')

  try {
    // Clear existing data
    await sql`DELETE FROM sale_items`
    await sql`DELETE FROM sales`
    await sql`DELETE FROM products`

    // Insert sample products
    const products = await db
      .insert(schema.products)
      .values([
        {
          name: 'Laptop Dell XPS 13',
          sku: 'DELL-XPS-13-001',
          description: 'Laptop ultraportátil de alta performance',
          unitPrice: '999.99',
          stockQuantity: 5,
        },
        {
          name: 'Mouse Logitech MX Master 3',
          sku: 'LOG-MX-MASTER-3',
          description: 'Mouse ergonômico para profissionais',
          unitPrice: '99.99',
          stockQuantity: 15,
        },
        {
          name: 'Teclado Mecânico RGB',
          sku: 'KEY-RGB-MECH-001',
          description: 'Teclado mecânico com iluminação RGB',
          unitPrice: '149.99',
          stockQuantity: 10,
        },
        {
          name: 'Monitor LG 27" 4K',
          sku: 'LG-MONITOR-27-4K',
          description: 'Monitor 4K com suporte USB-C',
          unitPrice: '499.99',
          stockQuantity: 3,
        },
        {
          name: 'Webcam Logitech C920',
          sku: 'LOG-C920-WEBCAM',
          description: 'Câmera Full HD para streaming',
          unitPrice: '79.99',
          stockQuantity: 8,
        },
        {
          name: 'Hub USB-C 7 em 1',
          sku: 'HUB-USB-C-7IN1',
          description: 'Hub multiportas para USB-C',
          unitPrice: '59.99',
          stockQuantity: 20,
        },
      ])
      .returning()

    console.log(`✓ Inseridos ${products.length} produtos`)

    // Insert sample sales
    const sale = await db
      .insert(schema.sales)
      .values({
        totalAmount: '1299.97',
        notes: 'Venda de teste',
      })
      .returning()

    // Insert sample sale items
    await db.insert(schema.saleItems).values([
      {
        saleId: sale[0].id,
        productId: products[0].id,
        quantity: 1,
        unitPrice: '999.99',
        subtotal: '999.99',
      },
      {
        saleId: sale[0].id,
        productId: products[1].id,
        quantity: 3,
        unitPrice: '99.99',
        subtotal: '299.97',
      },
    ])

    console.log('✓ Dados de exemplo inseridos com sucesso!')
  } catch (error) {
    console.error('Erro ao fazer seed:', error)
    throw error
  }
}

seed()
