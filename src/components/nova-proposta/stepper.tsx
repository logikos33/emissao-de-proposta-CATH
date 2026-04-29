'use client'

import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const PASSOS = [
  { label: 'Upload', href: '/nova-proposta/upload' },
  { label: 'Revisão', href: '/nova-proposta/revisao' },
  { label: 'Detalhes', href: '/nova-proposta/detalhes' },
  { label: 'Preview', href: '/nova-proposta/preview' },
]

export function Stepper() {
  const pathname = usePathname()
  const atual = PASSOS.findIndex((p) => pathname.startsWith(p.href))

  return (
    <nav
      aria-label="Progresso"
      className="no-print w-full px-4 py-3 bg-white border-b border-slate-200"
    >
      <ol className="flex items-center justify-between max-w-lg mx-auto">
        {PASSOS.map((passo, idx) => {
          const concluido = idx < atual
          const ativo = idx === atual

          return (
            <li key={passo.href} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1 flex-1">
                <span
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                    concluido && 'bg-slate-800 text-white',
                    ativo && 'bg-slate-900 text-white ring-2 ring-offset-2 ring-slate-900',
                    !concluido && !ativo && 'bg-slate-100 text-slate-400',
                  )}
                  aria-current={ativo ? 'step' : undefined}
                >
                  {concluido ? '✓' : idx + 1}
                </span>
                <span
                  className={cn('text-xs font-medium', ativo ? 'text-slate-900' : 'text-slate-400')}
                >
                  {passo.label}
                </span>
              </div>
              {idx < PASSOS.length - 1 && (
                <div
                  className={cn(
                    'h-px flex-1 mx-2 mb-5 transition-colors',
                    idx < atual ? 'bg-slate-800' : 'bg-slate-200',
                  )}
                  aria-hidden
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
