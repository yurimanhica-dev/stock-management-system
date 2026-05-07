"use client";

import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, Check } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProductFormProps {
  initialData?: {
    id?: string;
    name: string;
    sku: string;
    description?: string;
    unitPrice: string;
    stockQuantity: string;
    imageUrl?: string;
    category?: string;
  };
}

export function ProductForm({ initialData }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [skuError, setSkuError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleCheckSku = async (sku: string) => {
    if (!sku) return;
    try {
      const res = await fetch(`/api/products/check-sku?sku=${sku}`);
      const data = await res.json();
      if (data.exists && !initialData?.id) {
        setSkuError("SKU já existe no sistema");
      } else {
        setSkuError("");
      }
    } catch (error) {
      console.error("Error checking SKU:", error);
    }
  };

  async function handleSubmit(formData: FormData) {
    if (skuError || !imageUrl) {
      if (!imageUrl) alert("Selecione uma imagem para o produto");
      return;
    }

    setLoading(true);
    try {
      const data = {
        name: formData.get("name"),
        sku: formData.get("sku"),
        description: formData.get("description"),
        unitPrice: parseFloat(formData.get("unitPrice") as string),
        stockQuantity: parseInt(formData.get("stockQuantity") as string),
        imageUrl,
        category: formData.get("category"),
      };

      const url = initialData?.id
        ? `/api/products/${initialData.id}`
        : "/api/products";
      const method = initialData?.id ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("API ERROR:", errorText);
        throw new Error(errorText || "Failed to save product");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/products");
        router.refresh();
      }, 1500);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro ao guardar produto");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {success && (
        <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
          <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
          <span className="text-green-800 dark:text-green-200">
            {initialData?.id
              ? "Produto atualizado com sucesso!"
              : "Produto criado com sucesso!"}
          </span>
        </div>
      )}

      <form action={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">
            Informações Básicas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nome do Produto
              </label>
              <Input
                name="name"
                defaultValue={initialData?.name}
                placeholder="Ex: Água Mineral 1.5L"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                SKU
              </label>
              <Input
                name="sku"
                defaultValue={initialData?.sku}
                placeholder="Ex: AGUA-001"
                onBlur={(e) => handleCheckSku(e.target.value)}
                required
              />
              {skuError && (
                <div className="flex items-center gap-2 mt-1 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  {skuError}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Preço Unitário (€)
              </label>
              <Input
                name="unitPrice"
                type="number"
                step="0.01"
                defaultValue={initialData?.unitPrice}
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Quantidade em Stock
              </label>
              <Input
                name="stockQuantity"
                type="number"
                defaultValue={initialData?.stockQuantity}
                placeholder="0"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Categoria
              </label>
              <Input
                name="category"
                defaultValue={initialData?.category}
                placeholder="Ex: Bebidas, Lanches, etc"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Descrição
              </label>
              <textarea
                name="description"
                defaultValue={initialData?.description}
                placeholder="Descrição detalhada do produto"
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                rows={4}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">
            Imagem do Produto
          </h3>

          <div className="space-y-4">
            {imageUrl && (
              <div className="flex gap-4">
                <div className="relative w-32 h-32">
                  <Image
                    src={imageUrl}
                    alt="Preview"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="text-sm text-red-600 dark:text-red-400 hover:underline self-start"
                >
                  Remover imagem
                </button>
              </div>
            )}

            {!imageUrl && (
              <FileUpload
                onUploadComplete={(url) => {
                  setImageUrl(url);
                }}
              />
            )}
          </div>
        </Card>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={loading || !!skuError || !imageUrl}
            className="bg-primary hover:bg-primary/90 disabled:opacity-50"
          >
            {loading
              ? "Guardando..."
              : initialData?.id
                ? "Atualizar"
                : "Criar Produto"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/products")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
