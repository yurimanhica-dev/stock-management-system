'use client'

import { ReactNode } from 'react'
import { useAuth } from '@clerk/nextjs'

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isLoaded, userId } = useAuth()

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!userId) {
    return null
  }

  return <>{children}</>
}
