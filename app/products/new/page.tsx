'use client'

import { ProductForm } from '@/components/products/product-form'
import { AuthGuard } from '@/components/auth-guard'

function NewProductContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Criar Novo Produto</h1>
        <p className="text-muted-foreground mt-2">
          Adicione um novo produto ao seu sistema de gestão de stock
        </p>
      </div>

      <ProductForm />
    </div>
  )
}

export default function NewProductPage() {
  return (
    <AuthGuard>
      <NewProductContent />
    </AuthGuard>
  )
}
