import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Package, ShoppingCart, BarChart3, Settings } from 'lucide-react'

export const metadata = {
  title: 'Dashboard - Stock Manager',
  description: 'Visualize o estado atual do seu stock e vendas',
}

export default function Dashboard() {
  const features = [
    {
      title: 'Gestão de Produtos',
      description: 'Crie, edite e gerencie seus produtos com preços e quantidades',
      href: '/products',
      icon: Package,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Registar Vendas',
      description: 'Registre vendas rapidamente com atualização automática de stock',
      href: '/sales',
      icon: ShoppingCart,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Relatórios Diários',
      description: 'Visualize vendas, stock e receitas com opção de imprimir e PDF',
      href: '/reports',
      icon: BarChart3,
      color: 'from-purple-500 to-purple-600',
    },
  ]

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Sistema de Gestão de Stock
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Gerencie seus produtos, registre vendas e gere relatórios diários de forma eficiente e profissional.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <Link key={feature.href} href={feature.href}>
              <Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all duration-300 cursor-pointer">
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-foreground">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-foreground">Sobre o Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>
              Um sistema completo de gestão de stock desenvolvido com tecnologia moderna que permite:
            </p>
            <ul className="space-y-2 ml-4">
              <li>✓ Gerir catálogo de produtos com SKU único</li>
              <li>✓ Registar vendas com múltiplos itens</li>
              <li>✓ Atualização automática de stock</li>
              <li>✓ Relatórios diários completos</li>
              <li>✓ Impressão e exportação em PDF</li>
              <li>✓ Tema claro e escuro</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-foreground">Tecnologia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>Construído com as melhores tecnologias:</p>
            <ul className="space-y-2 ml-4">
              <li>✓ Next.js 15 - Framework React moderno</li>
              <li>✓ PostgreSQL via Neon - Banco de dados robusto</li>
              <li>✓ Drizzle ORM - Query builder type-safe</li>
              <li>✓ shadcn/ui - Componentes acessíveis</li>
              <li>✓ Tailwind CSS - Estilo responsivo</li>
              <li>✓ TypeScript - Type safety garantido</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8 text-center border border-primary/20">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Pronto para começar?
        </h2>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
          Comece a registar seus produtos e acompanhe o seu stock em tempo real.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/products">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Package className="w-5 h-5 mr-2" />
              Ir para Produtos
            </Button>
          </Link>
          <Link href="/sales">
            <Button
              size="lg"
              variant="outline"
              className="border-primary/50 hover:bg-primary/10"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Registar Venda
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
