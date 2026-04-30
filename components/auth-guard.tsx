'use client'

import { useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface AuthGuardProps {
  children: ReactNode
  requiredRole?: 'admin' | 'event_manager' | 'sales_person'
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')

    if (!token || !userStr) {
      router.push('/login')
      return
    }

    try {
      const user = JSON.parse(userStr)
      
      if (requiredRole && user.role !== requiredRole) {
        router.push('/')
        return
      }

      setIsAuthorized(true)
    } catch {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
