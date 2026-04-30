'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, ShoppingCart, DollarSign, Package } from 'lucide-react'
import { AuthGuard } from '@/components/auth-guard'

interface SalesData {
  hour: string
  sales: number
  revenue: number
}

interface ProductSales {
  name: string
  quantity: number
  revenue: number
  color: string
}

const COLORS = [
  '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#f97316',
  '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6',
  '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6'
]

function DashboardContent() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [salesByHour, setSalesByHour] = useState<SalesData[]>([])
  const [productSales, setProductSales] = useState<ProductSales[]>([])
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    productsCount: 0,
    averageTicket: 0,
  })

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        setUser(JSON.parse(userStr))
      } catch {
        setUser(null)
      }
    }
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Generate sales by hour
      const hourlyData: SalesData[] = []

      // Initialize 24 hours
      for (let h = 0; h < 24; h++) {
        hourlyData.push({
          hour: `${h.toString().padStart(2, '0')}:00`,
          sales: 0,
          revenue: 0,
        })
      }

      // Simulate data for demo purposes
      const demoSales = [
        { hour: 8, sales: 5, revenue: 150 },
        { hour: 9, sales: 8, revenue: 240 },
        { hour: 10, sales: 12, revenue: 360 },
        { hour: 11, sales: 15, revenue: 450 },
        { hour: 12, sales: 20, revenue: 600 },
        { hour: 13, sales: 18, revenue: 540 },
        { hour: 14, sales: 14, revenue: 420 },
        { hour: 15, sales: 16, revenue: 480 },
        { hour: 16, sales: 19, revenue: 570 },
        { hour: 17, sales: 22, revenue: 660 },
        { hour: 18, sales: 25, revenue: 750 },
        { hour: 19, sales: 28, revenue: 840 },
        { hour: 20, sales: 24, revenue: 720 },
        { hour: 21, sales: 20, revenue: 600 },
        { hour: 22, sales: 15, revenue: 450 },
      ]

      demoSales.forEach(({ hour, sales, revenue }) => {
        hourlyData[hour] = { ...hourlyData[hour], sales, revenue }
      })

      setSalesByHour(hourlyData)

      // Generate product sales
      const demoProducts: ProductSales[] = [
        { name: 'Coca-Cola', quantity: 45, revenue: 135, color: COLORS[0] },
        { name: 'Agua Natural', quantity: 38, revenue: 76, color: COLORS[1] },
        { name: 'Suco Natural', quantity: 32, revenue: 128, color: COLORS[2] },
        { name: 'Cafe', quantity: 28, revenue: 112, color: COLORS[3] },
        { name: 'Cha Verde', quantity: 22, revenue: 66, color: COLORS[4] },
      ]

      setProductSales(demoProducts)

      // Calculate stats
      const totalSales = demoSales.reduce((sum, s) => sum + s.sales, 0)
      const totalRevenue = demoSales.reduce((sum, s) => sum + s.revenue, 0)
      const productsCount = demoProducts.length
      const avgTicket = totalSales > 0 ? totalRevenue / totalSales : 0

      setStats({
        totalSales,
        totalRevenue,
        productsCount,
        averageTicket: parseFloat(avgTicket.toFixed(2)),
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Carregando dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Bem-vindo, {user?.name || 'Utilizador'}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {new Date().toLocaleDateString('pt-PT', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-primary/20 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Vendas</p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {stats.totalSales}
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Receita Total</p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  €{stats.totalRevenue}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Produtos Distintos</p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {stats.productsCount}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ticket Médio</p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  €{stats.averageTicket}
                </p>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-lg">
                <TrendingUp className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales by Hour */}
        <Card className="lg:col-span-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Vendas por Hora</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesByHour}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-slate-700" />
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                  }}
                  labelStyle={{ color: '#f3f4f6' }}
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
                  name="Receita (€)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
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
                  fill="#8884d8"
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

      {/* Products Revenue Bar Chart */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">Receita por Produto</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productSales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-slate-700" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Legend />
              <Bar dataKey="quantity" fill="#a855f7" name="Quantidade Vendida" />
              <Bar dataKey="revenue" fill="#10b981" name="Receita (€)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
