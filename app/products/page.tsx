import { ProductList } from '@/components/products/product-list'

export const metadata = {
  title: 'Produtos - Stock Manager',
  description: 'Gerencie seu catálogo de produtos',
}

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gestão de Produtos</h1>
        <p className="text-muted-foreground mt-2">
          Crie, edite e gerencie seus produtos com preços e quantidades de stock
        </p>
      </div>

      <ProductList />
    </div>
  )
}
