"use client";

import { AuthGuard } from "@/components/auth-guard";
import { ProductForm } from "@/components/products/product-form";
import { ProductFormSkeleton } from "@/components/products/product-form-skeleton";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  unitPrice: string;
  stockQuantity: string;
  imageUrl: string;
  category: string;
}

function EditProductContent({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        setProduct(null);
      } else {
        const data = await response.json();
        setProduct(data);
      }
    } catch {
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ProductFormSkeleton />;
  }

  if (!product) {
    return <div className="text-center py-8">Produto não encontrado</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Editar Produto</h1>
        <p className="text-muted-foreground mt-2">
          Atualize os dados do produto
        </p>
      </div>

      <ProductForm initialData={product} />
    </div>
  );
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AuthGuard>
      <EditProductContent productId={id} />
    </AuthGuard>
  );
}
