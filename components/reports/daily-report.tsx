"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatMoneyWithCurrency } from "@/helpers/formatMoney";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, Printer } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { DailyReportSkeleton } from "./daily-report-skeleton";

interface ProductSale {
  productId: number;
  productName: string;
  quantitySold: number;
  totalValue: number;
  imageUrl?: string;
}

interface StockItem {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: string;
}

interface DailyReportData {
  date: string;
  totalSalesCount: number;
  totalRevenue: number;
  productsSold: ProductSale[];
  currentStock: StockItem[];
}

export function DailyReport() {
  const [reportDate, setReportDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [reportData, setReportData] = useState<DailyReportData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async (date: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reports/daily?date=${date}`);
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(reportDate);
  }, [reportDate]);

  const handlePrint = async () => {
    const element = document.getElementById("report-content");
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#ffffff",
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgData = canvas.toDataURL("image/png");
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`relatorio-${reportDate}.pdf`);
  };

  const handlePrintPage = () => {
    window.print();
  };

  if (loading && !reportData) {
    return <DailyReportSkeleton />;
  }

  if (!reportData) {
    return <div className="text-center py-8">Nenhum dado disponível</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div>
          <Label htmlFor="report-date">Data do Relatório</Label>
          <Input
            id="report-date"
            type="date"
            value={reportDate}
            onChange={(e) => setReportDate(e.target.value)}
            className="mt-1"
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handlePrintPage}
            variant="outline"
            className="border-primary/50 hover:bg-primary/10"
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
          <Button
            onClick={handlePrint}
            className="bg-primary hover:bg-primary/90"
          >
            <Download className="w-4 h-4 mr-2" />
            Descarregar PDF
          </Button>
        </div>
      </div>

      <div
        id="report-content"
        className="space-y-6 p-6 rounded-lg bg-background text-foreground"
      >
        {/* Header */}
        <div className="border-b-2 border-primary pb-4">
          <h1 className="text-3xl font-bold text-foreground">
            Relatório de Vendas Diário
          </h1>
          <p className="text-muted-foreground mt-2">
            Data: {new Date(reportDate).toLocaleDateString("pt-PT")}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Vendas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {reportData.totalSalesCount}
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Receita Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatMoneyWithCurrency(reportData.totalRevenue)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Produtos Vendidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {reportData.productsSold.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Sold */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">
            Produtos Vendidos
          </h2>
          {reportData.productsSold.length > 0 ? (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary/10">
                    <TableHead>Imagem</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Valor Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.productsSold.map((product, index) => (
                    <TableRow key={index} className="border-border">
                      <TableCell>
                        {product.imageUrl && (
                          <div className="relative w-12 h-12">
                            <Image
                              src={product.imageUrl}
                              alt={product.productName}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.productName}
                      </TableCell>
                      <TableCell>{product.quantitySold}</TableCell>
                      <TableCell className="font-semibold">
                        {formatMoneyWithCurrency(product.totalValue)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma venda registada neste dia
            </div>
          )}
        </div>

        {/* Current Stock */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">
            Stock Atual
          </h2>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary/10">
                  <TableHead>Produto</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Preço Unitário</TableHead>
                  <TableHead>Valor Total Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.currentStock.map((item, index) => {
                  const totalStockValue =
                    item.quantity * parseFloat(item.unitPrice);
                  return (
                    <TableRow key={index} className="border-border">
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            item.quantity > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.quantity}
                        </span>
                      </TableCell>
                      <TableCell>
                        {formatMoneyWithCurrency(parseFloat(item.unitPrice))}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatMoneyWithCurrency(totalStockValue)}
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow className="bg-muted font-bold">
                  <TableCell colSpan={4} className="text-right">
                    Valor Total do Stock:
                  </TableCell>
                  <TableCell>
                    {formatMoneyWithCurrency(
                      reportData.currentStock.reduce(
                        (sum, item) =>
                          sum + item.quantity * parseFloat(item.unitPrice),
                        0,
                      ),
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-primary pt-4 text-center text-muted-foreground text-sm">
          <p>Relatório gerado em {new Date().toLocaleString("pt-PT")}</p>
        </div>
      </div>
    </div>
  );
}
