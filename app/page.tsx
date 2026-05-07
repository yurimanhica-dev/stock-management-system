"use client";

import { AuthGuard } from "@/components/auth-guard";
import DashboardSkeleton from "@/components/dashboard/dashboard-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoneyWithCurrency } from "@/helpers/formatMoney";
import {
  Banknote,
  BarChart3,
  Boxes,
  Receipt,
  ShoppingCart,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface SalesData {
  hour: string;
  sales: number;
  revenue: number;
}

interface ProductSales {
  name: string;
  quantity: number;
  revenue: number;
  color: string;
}

interface DashboardStats {
  totalSales: number;
  totalRevenue: number;
  productsCount: number;
  averageTicket: number;
}

function StatCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  prefix = "",
}: {
  label: string;
  value: number | string;
  icon: any;
  iconBg: string;
  iconColor: string;
  prefix?: string;
}) {
  return (
    <Card className="border-primary/20 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold text-foreground mt-2">
              {prefix}
              {value}
            </p>
          </div>
          <div className={`p-3 ${iconBg} rounded-lg`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardContent() {
  // const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [salesByHour, setSalesByHour] = useState<SalesData[]>([]);
  const [user, setUser] = useState<any>(null);
  const [productSales, setProductSales] = useState<ProductSales[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalRevenue: 0,
    productsCount: 0,
    averageTicket: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/dashboard");
      if (!res.ok) throw new Error("Falha ao carregar dados");
      const data = await res.json();
      setUser(data.user);
      setStats(data.stats);
      setSalesByHour(data.salesByHour);
      setProductSales(data.productSales);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar os dados do dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const userName = user?.name || user?.email?.split("@")[0] || "Utilizador";

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  const hasData = stats.totalSales > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Bem-vindo, {userName}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {new Date().toLocaleDateString("pt-PT", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stats */}
      <h1 className="text-3xl font-bold text-foreground">Vendas do Dia</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total de Vendas"
          value={stats.totalSales}
          icon={Receipt}
          iconBg="bg-primary/10"
          iconColor="text-primary"
        />

        <StatCard
          label="Receita Total"
          value={formatMoneyWithCurrency(stats.totalRevenue)}
          icon={Banknote}
          iconBg="bg-green-100 dark:bg-green-900"
          iconColor="text-green-600 dark:text-green-400"
        />

        <StatCard
          label="Produtos Distintos"
          value={stats.productsCount}
          icon={Boxes}
          iconBg="bg-blue-100 dark:bg-blue-900"
          iconColor="text-blue-600 dark:text-blue-400"
        />

        <StatCard
          label="Ticket Médio"
          value={formatMoneyWithCurrency(stats.averageTicket ?? 0)}
          icon={BarChart3}
          iconBg="bg-amber-100 dark:bg-amber-900"
          iconColor="text-amber-600 dark:text-amber-400"
        />
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-2xl text-muted-foreground">
          <ShoppingCart className="w-10 h-10 mb-3 opacity-30" />
          <p className="font-medium">Sem vendas hoje</p>
          <p className="text-xs mt-1 opacity-70">
            Os gráficos aparecerão assim que houver dados.
          </p>
        </div>
      ) : (
        <>
          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Vendas por Hora</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesByHour}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                      className="dark:stroke-slate-700"
                    />
                    <XAxis
                      dataKey="hour"
                      tick={{ fontSize: 11 }}
                      interval={2}
                    />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                      }}
                      labelStyle={{ color: "#f3f4f6" }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#a855f7"
                      strokeWidth={2}
                      dot={false}
                      name="Vendas"
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={false}
                      name="Receita (MZN)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Produtos Top</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={productSales}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      dataKey="quantity"
                    >
                      {productSales.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Bar chart */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Receita por Produto</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productSales}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                    className="dark:stroke-slate-700"
                  />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                    }}
                    labelStyle={{ color: "#f3f4f6" }}
                  />
                  <Legend />
                  <Bar
                    dataKey="quantity"
                    fill="#a855f7"
                    name="Quantidade Vendida"
                  />
                  <Bar dataKey="revenue" fill="#10b981" name="Receita (MZN)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
