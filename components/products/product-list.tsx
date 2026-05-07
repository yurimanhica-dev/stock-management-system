"use client";

import { Button } from "@/components/ui/button";
import { Product } from "@/lib/db/schema";
import { Edit2, Loader2, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "../ui/card";
import ProductCardSkeleton from "./product-card-skeleton";

interface ProductListProps {
  onProductSelect?: (product: Product) => void;
}

export function ProductList({ onProductSelect }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleting, setDeleting] = useState(false);

  const router = useRouter();

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    if (deleteInput.trim().toUpperCase() !== "DELETE") return;

    setDeleting(true);

    try {
      const response = await fetch(`/api/products/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao eliminar produto");
      }

      // refresh list
      await fetchProducts();

      // reset modal
      setDeleteTarget(null);
      setDeleteInput("");

      // 🎉 TOAST SUCCESS
      toast.success("Producto eliminado com sucesso", {
        description: deleteTarget.name,
      });
    } catch (error) {
      console.error("Error deleting product:", error);

      toast.error("Falha ao eliminar producto", {
        description: "Tente novamente mais tarde",
      });
    } finally {
      setDeleting(false);
    }
  };

  const isDeleteAllowed = deleteInput.trim().toUpperCase() === "DELETE";

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-6 w-32 bg-muted rounded animate-pulse" />
          <div className="h-10 w-40 bg-muted rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Productos</h2>

        <Link href="/products/new">
          <Button className="bg-primary hover:bg-primary/85 shadow-md">
            <Plus className="w-4 h-4 mr-2" />
            Novo Productos
          </Button>
        </Link>
      </div>

      {/* EMPTY STATE */}
      {products.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum produto registado ainda
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="border border-border rounded-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-card"
            >
              {product.imageUrl && (
                <div className="relative w-full aspect-4/3 overflow-hidden rounded-md rounded-b-none">
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
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.sku}</p>
                  <div className="mt-1 text-muted-foreground text-sm space-y-1">
                    <p className="bg-primary disabled:opacity-50 text-xs text-primary-foreground inline-block px-2 py-0.5 rounded">
                      {product.category}
                    </p>
                    <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <p className="font-bold text-primary">
                    Preço: {parseFloat(product.unitPrice).toFixed(2)} MZN
                  </p>

                  <p
                    className={`font-bold ${
                      product.stockQuantity > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    Stock: {product.stockQuantity}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/products/${product.id}/edit`}
                    className="flex-1"
                  >
                    <Button size="sm" className="w-full" disabled={creating}>
                      {creating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Carregando...
                        </>
                      ) : (
                        <>
                          <Edit2 className="w-4 h-4 mr-1" />
                          Editar
                        </>
                      )}
                    </Button>
                  </Link>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteTarget(product)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteTarget && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => {
            setDeleteTarget(null);
            setDeleteInput("");
          }}
        >
          <Card
            className="w-[420px] border-destructive/30 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <h2 className="text-lg font-bold text-foreground">
                Confirmar eliminação
              </h2>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Para apagar este produto, digite <b>DELETE</b> abaixo:
              </p>

              <div className="p-3 rounded-md bg-muted font-medium">
                {deleteTarget.name}
              </div>

              <input
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                placeholder="Digite DELETE"
                className="w-full px-3 py-2 border rounded-md bg-background"
              />

              <p className="text-xs text-red-500">Esta ação é irreversível.</p>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDeleteTarget(null);
                    setDeleteInput("");
                  }}
                >
                  Cancelar
                </Button>

                <Button
                  onClick={handleDelete}
                  disabled={!isDeleteAllowed || deleting}
                  className="bg-destructive hover:bg-destructive/90 disabled:opacity-50"
                >
                  {deleting ? "A eliminar..." : "Eliminar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
