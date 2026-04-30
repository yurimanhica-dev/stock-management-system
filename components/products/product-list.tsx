'use client'

import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Product } from '@/lib/db/schema'
import { Trash2, Edit2, Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface ProductListProps {
  onProductSelect?: (product: Product) => void
}

export function ProductList({ onProductSelect }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Tem a certeza que quer deletar este produto?')) return

    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' })
      await fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Carregando produtos...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Produtos</h2>
        <Link href="/products/new">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">
          Carregando produtos...
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum produto registado ainda
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-card"
            >
              {product.imageUrl && (
                <div className="relative w-full h-48">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-foreground">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.sku}</p>
                </div>

                {product.category && (
                  <p className="text-xs bg-primary/10 text-primary px-2 py-1 rounded w-fit">
                    {product.category}
                  </p>
                )}

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Preço</p>
                    <p className="text-lg font-bold text-primary">
                      €{parseFloat(product.unitPrice).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Stock</p>
                    <p
                      className={`text-lg font-bold ${
                        product.stockQuantity > 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {product.stockQuantity}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Link href={`/products/${product.id}/edit`} className="flex-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-primary/50 hover:bg-primary/10"
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(product.id)}
                    className="border-destructive/50 hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
