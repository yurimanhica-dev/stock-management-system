import { ProductForm } from '@/components/products/product-form'
import { neon } from '@neondatabase/serverless'

export const metadata = {
  title: 'Editar Produto | Stock Manager',
  description: 'Editar um produto existente',
}

export default async function EditProductPage({
  params,
}: {
  params: { id: string }
}) {
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) throw new Error('Database URL not configured')

  const db = neon(dbUrl)
  const product = await db`
    SELECT * FROM products WHERE id = ${parseInt(params.id)}
  `

  if (product.length === 0) {
    return <div className="text-center py-8">Produto não encontrado</div>
  }

  const p = product[0]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Editar Produto</h1>
        <p className="text-muted-foreground mt-2">
          Atualize os dados do produto
        </p>
      </div>

      <ProductForm
        initialData={{
          id: p.id,
          name: p.name,
          sku: p.sku,
          description: p.description,
          unitPrice: p.unit_price,
          stockQuantity: p.stock_quantity.toString(),
          imageUrl: p.image_url,
          category: p.category,
        }}
      />
    </div>
  )
}
