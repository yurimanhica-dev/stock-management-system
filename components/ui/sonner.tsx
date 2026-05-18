'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group font-sans"
      position="top-right"
      expand={false}
      richColors
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--success-bg': '#10b981',
          '--success-text': '#ffffff',
          '--error-bg': '#ef4444',
          '--error-text': '#ffffff',
          '--warning-bg': '#f59e0b',
          '--warning-text': '#ffffff',
          '--info-bg': '#3b82f6',
          '--info-text': '#ffffff',
        } as React.CSSProperties
      }
      toastOptions={{
        classNameFunction: () => 'text-sm font-medium px-4 py-3 rounded-lg',
        style: {
          fontFamily: 'inherit',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
