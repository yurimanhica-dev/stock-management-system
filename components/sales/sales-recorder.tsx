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
import { Package, Send, ShoppingCart, X, CreditCard } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { MpesaPaymentModal } from "./mpesa-payment-modal";

interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  imageUrl?: string;
  snapshot?: any;
  discountPercentage?: number;
  discountAmount?: number;
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

  const dims = useMemo(
    () => (size === "sm" ? "w-8 h-8" : size === "lg" ? "w-16 h-16" : "w-10 h-10"),
    [size]
  );
  const iconSize = useMemo(
    () => (size === "sm" ? "w-3 h-3" : size === "lg" ? "w-7 h-7" : "w-4 h-4"),
    [size]
  );

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
  const [discountPercentage, setDiscountPercentage] = useState<string>("");
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const [lastSaleId, setLastSaleId] = useState<string | null>(null);

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

  // Group products by category (memoized)
  const groupedProducts = useMemo(() => {
    return products.reduce(
      (acc, product) => {
        const category = product.category || "Sem categoria";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(product);
        return acc;
      },
      {} as Record<string, Product[]>,
    );
  }, [products]);

  // Sort categories alphabetically (memoized)
  const sortedCategories = useMemo(
    () => Object.keys(groupedProducts).sort(),
    [groupedProducts]
  );

  // Filter products based on search term (memoized)
  const filteredGroupedProducts = useMemo(() => {
    if (!searchTerm) return groupedProducts;
    
    return Object.entries(groupedProducts).reduce(
      (acc, [category, categoryProducts]) => {
        const filtered = categoryProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchTerm.toLowerCase()),
        );
        if (filtered.length > 0) {
          acc[category] = filtered;
        }
        return acc;
      },
      {} as Record<string, Product[]>,
    );
  }, [groupedProducts, searchTerm]);

  const selectedProductData = products.find((p) => p.id === selectedProduct);

  const handleAddItem = useCallback(() => {
    if (!selectedProduct || !quantity) return;
    const product = products.find((p) => p.id === selectedProduct);
    if (!product) return;

    const qty = parseInt(quantity);
    const price = Number(product.unitPrice);
    const discount = discountPercentage ? parseFloat(discountPercentage) : 0;

    const existingQty = saleItems
      .filter((i) => i.productId === product.id)
      .reduce((sum, i) => sum + i.quantity, 0);

    if (existingQty + qty > product.stockQuantity) {
      toast.error("Stock insuficiente");
      return;
    }

    const subtotalBeforeDiscount = qty * price;
    const discountAmount =
      discount > 0
        ? Number((subtotalBeforeDiscount * (discount / 100)).toFixed(2))
        : 0;
    const subtotal = Number(
      (subtotalBeforeDiscount - discountAmount).toFixed(2),
    );

    const existingIndex = saleItems.findIndex(
      (i) => i.productId === product.id,
    );

    if (existingIndex !== -1) {
      const updated = [...saleItems];
      updated[existingIndex].quantity += qty;
      updated[existingIndex].discountPercentage = discount;
      const newSubtotalBeforeDiscount =
        updated[existingIndex].quantity * price;
      const newDiscountAmount =
        discount > 0
          ? Number((newSubtotalBeforeDiscount * (discount / 100)).toFixed(2))
          : 0;
      updated[existingIndex].subtotal = Number(
        (newSubtotalBeforeDiscount - newDiscountAmount).toFixed(2),
      );
      updated[existingIndex].discountAmount = newDiscountAmount;
      setSaleItems(updated);
    } else {
      const snapshot = {
        productId: product.id,
        productName: product.name,
        imageUrl: product.imageUrl || null,
        unitPrice: price,
        quantity: qty,
        subtotal,
        discountPercentage: discount,
        discountAmount,
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
          discountPercentage: discount,
          discountAmount,
        },
      ]);
    }

    setSelectedProduct("");
    setQuantity("1");
    setDiscountPercentage("");
  }, [products, selectedProduct, quantity, discountPercentage, saleItems]);

  const handleRemoveItem = useCallback((index: number) => {
    setSaleItems((items) => items.filter((_, i) => i !== index));
  }, []);

  const handleSubmitSale = useCallback(async () => {
    if (saleItems.length === 0) {
      toast.error("Nenhum item adicionado à venda");
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
      
      // Store the sale ID to use in M-Pesa payment
      setLastSaleId(data.saleId);
      
      // Show M-Pesa payment modal
      setShowMpesaModal(true);
      
      // Reset form
      setSaleItems([]);
      setNotes("");
      setSelectedProduct("");
      setQuantity("1");
      setDiscountPercentage("");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao registar venda");
    } finally {
      setLoading(false);
    }
  }, [saleItems, notes]);

  const handlePaymentSuccess = useCallback(() => {
    toast.success("Pagamento concluído com sucesso!");
    setShowMpesaModal(false);
    setLastSaleId(null);
  }, []);

  const { totalAmount, totalItems, totalWithoutDiscount, totalDiscount } = useMemo(() => {
    const total = saleItems.reduce((sum, i) => sum + i.subtotal, 0);
    const items = saleItems.reduce((sum, i) => sum + i.quantity, 0);
    const withoutDiscount = saleItems.reduce(
      (sum, i) => sum + i.quantity * i.unitPrice,
      0
    );
    const discount = saleItems.reduce(
      (sum, i) => sum + (i.discountAmount || 0),
      0
    );
    return { totalAmount: total, totalItems: items, totalWithoutDiscount: withoutDiscount, totalDiscount: discount };
  }, [saleItems]);

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
          <div className="space-y-3">
            <Label className="text-xs text-muted-foreground">
              Procurar Producto
            </Label>
            <Input
              placeholder="Procure por nome ou SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10"
            />
          </div>

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
                <SelectContent className="max-h-96">
                  {Object.keys(filteredGroupedProducts).length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      Nenhum produto encontrado
                    </div>
                  ) : (
                    Object.entries(filteredGroupedProducts).map(
                      ([category, categoryProducts]) => (
                        <div key={category}>
                          <div className="sticky top-0 bg-background px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                            {category}
                          </div>
                          {categoryProducts.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              <div className="flex items-center gap-2">
                                <ProductImage
                                  src={p.imageUrl}
                                  alt={p.name}
                                  size="sm"
                                />
                                <span className="flex-1">{p.name}</span>
                                <span className="text-xs text-muted-foreground ml-2">
                                  Stock: {p.stockQuantity}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </div>
                      ),
                    )
                  )}
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

            <div className="w-28 shrink-0">
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Desconto %
              </Label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                placeholder="0"
                className="h-10 text-center"
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleAddItem}
                disabled={!selectedProduct || loading}
                className="h-10 px-5"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Adicionar"
                )}
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
                  {discountPercentage && parseFloat(discountPercentage) > 0 ? (
                    <div>
                      <p className="text-xs text-muted-foreground line-through">
                        {(
                          parseInt(quantity) *
                          Number(selectedProductData.unitPrice)
                        ).toFixed(2)}
                      </p>
                      <p className="text-lg font-semibold text-green-600">
                        {(
                          parseInt(quantity) *
                          Number(selectedProductData.unitPrice) *
                          (1 - parseFloat(discountPercentage) / 100)
                        ).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {discountPercentage}% off
                      </p>
                    </div>
                  ) : (
                    <p className="text-lg font-semibold">
                      {(
                        parseInt(quantity) *
                        Number(selectedProductData.unitPrice)
                      ).toFixed(2)}
                    </p>
                  )}
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

      {/* Sale Items Section */}
      {saleItems.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Itens da Venda ({totalItems})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {saleItems.map((item, i) => {
              const subtotalBeforeDiscount = item.quantity * item.unitPrice;
              return (
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
                    {item.discountPercentage && item.discountPercentage > 0 && (
                      <p className="text-xs text-green-600 mt-1">
                        Desconto: {item.discountPercentage.toFixed(1)}%
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    {item.discountPercentage && item.discountPercentage > 0 ? (
                      <div>
                        <p className="text-xs text-muted-foreground line-through">
                          {subtotalBeforeDiscount.toFixed(2)}
                        </p>
                        <p className="font-semibold text-sm text-green-600">
                          {item.subtotal.toFixed(2)}
                        </p>
                      </div>
                    ) : (
                      <p className="font-semibold text-sm">
                        {item.subtotal.toFixed(2)}
                      </p>
                    )}
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
              );
            })}

            {/* Summary */}
            <div className="space-y-2 pt-3 border-t border-border/50 mt-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">
                  {totalWithoutDiscount.toFixed(2)} MZN
                </span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex items-center justify-between text-sm text-green-600">
                  <span className="text-muted-foreground">Desconto</span>
                  <span className="font-medium">-{totalDiscount.toFixed(2)} MZN</span>
                </div>
              )}
              <div className="flex items-center justify-between text-lg font-bold pt-2 border-t border-border/50">
                <span>Total</span>
                <span>{totalAmount.toFixed(2)} MZN</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setSaleItems([])}
                className="flex-1"
              >
                Limpar
              </Button>
              <Button
                onClick={handleSubmitSale}
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    A processar...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Finalizar Venda
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* M-Pesa Payment Modal */}
      {lastSaleId && (
        <MpesaPaymentModal
          isOpen={showMpesaModal}
          onClose={() => {
            setShowMpesaModal(false);
            setLastSaleId(null);
          }}
          saleId={lastSaleId}
          amount={totalWithoutDiscount - totalDiscount}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
