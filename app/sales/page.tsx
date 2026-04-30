import { SalesRecorder } from '@/components/sales/sales-recorder'

export const metadata = {
  title: 'Registar Vendas - Stock Manager',
  description: 'Registre suas vendas e atualize automaticamente o stock',
}

export default function SalesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Registar Vendas</h1>
        <p className="text-muted-foreground mt-2">
          Selecione produtos, defina quantidades e registre suas vendas. O stock será atualizado automaticamente.
        </p>
      </div>

      <SalesRecorder />
    </div>
  )
}
