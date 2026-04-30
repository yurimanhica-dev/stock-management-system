import { DailyReport } from '@/components/reports/daily-report'

export const metadata = {
  title: 'Relatórios - Stock Manager',
  description: 'Visualize vendas, stock e receitas com opção de imprimir e PDF',
}

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Relatório Diário</h1>
        <p className="text-muted-foreground mt-2">
          Visualize vendas do dia, produtos vendidos, stock atual e receitas totais. Imprima ou exporte em PDF.
        </p>
      </div>

      <DailyReport />
    </div>
  )
}
