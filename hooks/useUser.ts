import { useEffect, useState } from 'react'

interface User {
  id: number
  auth0_id: string
  email: string
  name: string
  role: 'event_manager' | 'sales_person'
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // First sync the user
        await fetch('/api/users/sync', { method: 'POST' })

        // Then get the user data
        const response = await fetch('/api/users/me')
        if (!response.ok) {
          throw new Error('Failed to fetch user')
        }
        const data = await response.json()
        setUser(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { user, loading, error }
}
