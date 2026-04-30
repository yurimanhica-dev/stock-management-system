'use client'

import { ChangeEvent, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X } from 'lucide-react'

interface FileUploadProps {
  onUploadComplete: (url: string) => void
  accept?: string
  maxSize?: number
}

export function FileUpload({
  onUploadComplete,
  accept = 'image/*',
  maxSize = 4 * 1024 * 1024,
}: FileUploadProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > maxSize) {
      setError(`Arquivo muito grande. Máximo: ${maxSize / (1024 * 1024)}MB`)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      onUploadComplete(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-primary/30 rounded-lg cursor-pointer hover:border-primary/50 transition">
        <Upload className="w-4 h-4" />
        <span className="text-sm">{loading ? 'Enviando...' : 'Click para selecionar imagem'}</span>
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={loading}
          className="hidden"
        />
      </label>
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
          <X className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  )
}
