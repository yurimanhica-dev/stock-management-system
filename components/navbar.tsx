'use client'

import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Moon, Sun, LogOut, Settings } from 'lucide-react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'event_manager' | 'sales_person'
}

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        setUser(JSON.parse(userStr))
      } catch {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }, [])

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
                {user.role === 'admin' && (
                  <Link href="/admin/users">
                    <Button variant="outline" size="sm" className="border-primary/50">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    localStorage.removeItem('token')
                    localStorage.removeItem('user')
                    router.push('/login')
                  }}
                  className="border-primary/50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={() => router.push('/login')}
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
