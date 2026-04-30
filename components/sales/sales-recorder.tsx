'use client'

import { useEffect, useState } from 'react'
import { Product } from '@/lib/db/schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Trash2, Send } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'

interface SaleItem {
  productId: number
  productName: string
  quantity: number
  unitPrice: string
  subtotal: number
  imageUrl?: string
  snapshot?: {
    productId: number
    productName: string
    imageUrl?: string
    unitPrice: string
    quantity: number
    subtotal: number
  }
}

export function SalesRecorder() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<string>('')
  const [quantity, setQuantity] = useState<string>('1')
  const [saleItems, setSaleItems] = useState<SaleItem[]>([])
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        const data = await response.json()
        setProducts(data.filter((p: Product) => p.stockQuantity > 0))
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchProducts()
  }, [])

  const handleAddItem = () => {
    if (!selectedProduct || !quantity) return

    const product = products.find((p) => p.id === parseInt(selectedProduct))
    if (!product) return

    const qty = parseInt(quantity)
    if (qty > product.stockQuantity) {
      alert('Quantidade em stock insuficiente')
      return
    }

    const subtotal = qty * parseFloat(product.unitPrice)

    // Create snapshot of product data at time of sale
    const snapshot = {
      productId: product.id,
      productName: product.name,
      imageUrl: product.imageUrl || undefined,
      unitPrice: product.unitPrice,
      quantity: qty,
      subtotal,
    }

    setSaleItems([
      ...saleItems,
      {
        productId: product.id,
        productName: product.name,
        quantity: qty,
        unitPrice: product.unitPrice,
        subtotal,
        imageUrl: product.imageUrl || undefined,
        snapshot,
      },
    ])

    setSelectedProduct('')
    setQuantity('1')
  }

  const handleRemoveItem = (index: number) => {
    setSaleItems(saleItems.filter((_, i) => i !== index))
  }

  const handleSubmitSale = async () => {
    if (saleItems.length === 0) {
      alert('Adicione pelo menos um item à venda')
      return
    }

    setLoading(true)
    try {
      // Get current user
      const userRes = await fetch('/api/users/me')
      const user = await userRes.json()

      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: saleItems,
          notes: notes || null,
          userId: user.id,
        }),
      })

      if (response.ok) {
        setSaleItems([])
        setNotes('')
        alert('Venda registada com sucesso!')

        // Refresh products
        const productResponse = await fetch('/api/products')
        const data = await productResponse.json()
        setProducts(data.filter((p: Product) => p.stockQuantity > 0))
      } else {
        alert('Erro ao registar venda')
      }
    } catch (error) {
      console.error('Error submitting sale:', error)
      alert('Erro ao registar venda')
    } finally {
      setLoading(false)
    }
  }

  const totalAmount = saleItems.reduce((sum, item) => sum + item.subtotal, 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Registar Nova Venda</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="product">Produto</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger id="product">
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name} (Stock: {product.stockQuantity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedProduct && (() => {
              const selected = products.find((p) => p.id === parseInt(selectedProduct))
              return selected ? (
                <div className="col-span-1 md:col-span-3 border border-border rounded-lg p-4 bg-secondary/5">
                  <div className="flex gap-4 items-start">
                    {selected.imageUrl && (
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <Image
                          src={selected.imageUrl}
                          alt={selected.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{selected.name}</h4>
                      <p className="text-sm text-muted-foreground">{selected.category}</p>
                      <p className="text-lg font-bold text-primary mt-2">
                        €{parseFloat(selected.unitPrice).toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Stock disponível: <span className="font-semibold">{selected.stockQuantity}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ) : null
            })()}

            <div>
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleAddItem}
                className="w-full bg-primary hover:bg-primary/90"
                disabled={!selectedProduct}
              >
                Adicionar
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Input
              id="notes"
              placeholder="Adicione notas sobre a venda..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {saleItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Itens da Venda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/20">
                    <TableHead>Imagem</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Preço Unit.</TableHead>
                    <TableHead>Subtotal</TableHead>
                    <TableHead>Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {saleItems.map((item, index) => (
                    <TableRow key={index} className="hover:bg-secondary/10">
                      <TableCell>
                        {item.imageUrl && (
                          <div className="relative w-12 h-12">
                            <Image
                              src={item.imageUrl}
                              alt={item.productName}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.productName}
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        €{parseFloat(item.unitPrice).toFixed(2)}
                      </TableCell>
                      <TableCell className="font-semibold">
                        €{item.subtotal.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveItem(index)}
                          className="border-destructive/50 hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-primary/10 font-bold">
                    <TableCell colSpan={3} className="text-right">
                      Total:
                    </TableCell>
                    <TableCell className="text-lg">
                      €{totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <Button
              onClick={handleSubmitSale}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 h-10"
            >
              <Send className="w-4 h-4 mr-2" />
              {loading ? 'Registando...' : 'Registar Venda'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
