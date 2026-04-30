'use client'

import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import Link from 'next/link'

export function Navbar() {
  const { theme, setTheme } = useTheme()

  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/50 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:inline">
              Stock Manager
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" className="text-foreground hover:bg-secondary/50">
                Dashboard
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="ghost" className="text-foreground hover:bg-secondary/50">
                Produtos
              </Button>
            </Link>
            <Link href="/sales">
              <Button variant="ghost" className="text-foreground hover:bg-secondary/50">
                Vendas
              </Button>
            </Link>
            <Link href="/reports">
              <Button variant="ghost" className="text-foreground hover:bg-secondary/50">
                Relatórios
              </Button>
            </Link>

            <Button
              size="icon"
              variant="outline"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="border-primary/50 hover:bg-primary/10"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-primary" />
              ) : (
                <Moon className="h-4 w-4 text-primary" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
