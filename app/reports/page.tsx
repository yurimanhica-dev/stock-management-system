'use client'

import { DailyReport } from '@/components/reports/daily-report'
import { AuthGuard } from '@/components/auth-guard'

function ReportsContent() {
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

export default function ReportsPage() {
  return (
    <AuthGuard>
      <ReportsContent />
    </AuthGuard>
  )
}
