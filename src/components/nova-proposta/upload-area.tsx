'use client'

import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface UploadAreaProps {
  onFile: (file: File) => void
  disabled?: boolean
}

export function UploadArea({ onFile, disabled }: UploadAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onFile(file)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) onFile(file)
    e.target.value = ''
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Área de upload — clique ou arraste um arquivo"
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
      }}
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer',
        dragging
          ? 'border-slate-600 bg-slate-50'
          : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      <div className="text-3xl" aria-hidden>
        📄
      </div>
      <p className="text-sm font-medium text-slate-700">Arraste um PDF ou áudio aqui</p>
      <p className="text-xs text-slate-400">PDF até 20 MB · Áudio até 25 MB</p>
      <span className="mt-1 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white min-h-[44px] flex items-center">
        Escolher arquivo
      </span>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,audio/*"
        className="sr-only"
        onChange={handleChange}
        disabled={disabled}
        aria-hidden
      />
    </div>
  )
}
