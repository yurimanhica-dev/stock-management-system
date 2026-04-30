'use client'

import { useTheme } from 'next-themes'
import { useUser } from '@/hooks/useUser'
import { Button } from '@/components/ui/button'
import { Moon, Sun, LogOut, Menu } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const { user, loading } = useUser()
  const router = useRouter()
  const [open, setOpen] = useState(false)

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
            {user && (
              <>
                <Link href="/">
                  <Button variant="ghost" className="text-foreground hover:bg-secondary/50">
                    Dashboard
                  </Button>
                </Link>
                {user.role === 'event_manager' && (
                  <Link href="/products">
                    <Button variant="ghost" className="text-foreground hover:bg-secondary/50">
                      Produtos
                    </Button>
                  </Link>
                )}
                <Link href="/sales">
                  <Button variant="ghost" className="text-foreground hover:bg-secondary/50">
                    Vendas
                  </Button>
                </Link>
                {user.role === 'event_manager' && (
                  <Link href="/reports">
                    <Button variant="ghost" className="text-foreground hover:bg-secondary/50">
                      Relatórios
                    </Button>
                  </Link>
                )}
              </>
            )}

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

            {loading ? (
              <Button disabled variant="outline" className="w-24">
                ...
              </Button>
            ) : user ? (
              <>
                <span className="text-sm text-foreground/70 hidden sm:inline">
                  {user.name}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/api/auth/logout')}
                  className="border-primary/50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={() => router.push('/api/auth/login')}
                className="bg-primary hover:bg-primary/90"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
