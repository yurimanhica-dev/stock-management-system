"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/lib/db/schema";
import { Package, Send, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  imageUrl?: string;
  snapshot?: any;
}

function ProductImage({
  src,
  alt,
  size = "md",
}: {
  src?: string | null;
  alt: string;
  size?: "sm" | "md" | "lg";
}) {
  const [error, setError] = useState(false);

  const dims =
    size === "sm" ? "w-8 h-8" : size === "lg" ? "w-16 h-16" : "w-10 h-10";
  const iconSize =
    size === "sm" ? "w-3 h-3" : size === "lg" ? "w-7 h-7" : "w-4 h-4";

  if (!src || error) {
    return (
      <div
        className={`${dims} rounded-lg bg-muted flex items-center justify-center shrink-0 border border-border`}
      >
        <Package className={`${iconSize} text-muted-foreground`} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className={`${dims} rounded-lg object-cover shrink-0 border border-border`}
    />
  );
}

export function SalesRecorder() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.filter((p: Product) => p.stockQuantity > 0));
    } catch (error) {
      console.error(error);
    }
  };

  const selectedProductData = products.find((p) => p.id === selectedProduct);

  const handleAddItem = () => {
    if (!selectedProduct || !quantity) return;
    const product = products.find((p) => p.id === selectedProduct);
    if (!product) return;

    const qty = parseInt(quantity);
    const price = Number(product.unitPrice);

    const existingQty = saleItems
      .filter((i) => i.productId === product.id)
      .reduce((sum, i) => sum + i.quantity, 0);

    if (existingQty + qty > product.stockQuantity) {
      toast.error("Stock insuficiente");
      return;
    }

    const subtotal = Number((qty * price).toFixed(2));
    const existingIndex = saleItems.findIndex(
      (i) => i.productId === product.id,
    );

    if (existingIndex !== -1) {
      const updated = [...saleItems];
      updated[existingIndex].quantity += qty;
      updated[existingIndex].subtotal = Number(
        (updated[existingIndex].quantity * price).toFixed(2),
      );
      setSaleItems(updated);
    } else {
      const snapshot = {
        productId: product.id,
        productName: product.name,
        imageUrl: product.imageUrl || null,
        unitPrice: price,
        quantity: qty,
        subtotal,
      };
      setSaleItems([
        ...saleItems,
        {
          productId: product.id,
          productName: product.name,
          quantity: qty,
          unitPrice: price,
          subtotal,
          imageUrl: product.imageUrl || undefined,
          snapshot,
        },
      ]);
    }

    setSelectedProduct("");
    setQuantity("1");
  };

  const handleRemoveItem = (index: number) => {
    setSaleItems(saleItems.filter((_, i) => i !== index));
  };

  const handleSubmitSale = async () => {
    if (saleItems.length === 0) {
      toast.success("Adicione itens à venda");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: saleItems, notes: notes || null }),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }
      setSaleItems([]);
      setNotes("");
      toast.success("Venda registada com sucesso!");
      await fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao registar venda");
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = saleItems.reduce((sum, i) => sum + i.subtotal, 0);
  const totalItems = saleItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        {/* <div>
          <h1 className="text-xl font-semibold tracking-tight">Nova Venda</h1>
          <p className="text-sm text-muted-foreground">
            Adicione produtos e finalize a venda
          </p>
        </div> */}
      </div>

      {/* Product Selector */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium">
            Adicionar Productos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3 flex-wrap md:flex-nowrap">
            <div className="flex-1 min-w-[200px]">
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Producto
              </Label>
              <Select
                value={selectedProduct}
                onValueChange={setSelectedProduct}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      <div className="flex items-center gap-2">
                        <ProductImage src={p.imageUrl} alt={p.name} size="sm" />
                        <span className="flex-1">{p.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          Stock: {p.stockQuantity}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-28 shrink-0">
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Quantidade
              </Label>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="h-10 text-center"
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleAddItem}
                disabled={!selectedProduct}
                className="h-10 px-5"
              >
                Adicionar
              </Button>
            </div>
          </div>

          {/* Product preview card */}
          {selectedProductData && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/50 mt-2">
              <ProductImage
                src={selectedProductData.imageUrl}
                alt={selectedProductData.name}
                size="lg"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {selectedProductData.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Preço unitário:{" "}
                  <span className="font-semibold text-foreground">
                    {Number(selectedProductData.unitPrice).toFixed(2)}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Disponível:{" "}
                  <span className="font-semibold text-foreground">
                    {selectedProductData.stockQuantity} unid.
                  </span>
                </p>
              </div>
              {quantity && parseInt(quantity) > 0 && (
                <div className="text-right shrink-0">
                  <p className="text-xs text-muted-foreground">Subtotal</p>
                  <p className="text-lg font-semibold">
                    {(
                      parseInt(quantity) * Number(selectedProductData.unitPrice)
                    ).toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          )}

          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Notas (opcional)
            </Label>
            <Input
              placeholder="Ex: Cliente habitual, desconto aplicado..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Cart */}
      {saleItems.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">
                Itens da Venda
              </CardTitle>
              <span className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                {totalItems} {totalItems === 1 ? "item" : "itens"}
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-2">
            {saleItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-background hover:bg-muted/30 transition-colors group"
              >
                <ProductImage
                  src={item.imageUrl}
                  alt={item.productName}
                  size="md"
                />

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {item.productName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.quantity} × {item.unitPrice.toFixed(2)}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-semibold text-sm">
                    {item.subtotal.toFixed(2)}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveItem(i)}
                  className="w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}

            {/* Total row */}
            <div className="flex items-center justify-between pt-3 mt-1 border-t border-border">
              <span className="text-sm font-medium text-muted-foreground">
                Total
              </span>
              <span className="text-2xl font-bold tracking-tight">
                {totalAmount.toFixed(2)}
              </span>
            </div>

            <Button
              onClick={handleSubmitSale}
              disabled={loading}
              className="w-full h-11 mt-2 text-sm font-medium"
            >
              <Send className="w-4 h-4 mr-2" />
              {loading ? "A processar..." : "Finalizar Venda"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {saleItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border border-dashed border-border rounded-2xl">
          <ShoppingCart className="w-10 h-10 mb-3 opacity-30" />
          <p className="text-sm font-medium">Carrinho vazio</p>
          <p className="text-xs mt-1 opacity-70">
            Adicione productos para iniciar a venda
          </p>
        </div>
      )}
    </div>
  );
}
