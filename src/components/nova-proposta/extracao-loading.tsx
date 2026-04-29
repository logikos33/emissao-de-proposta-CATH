import { Skeleton } from '@/components/ui/skeleton'

export function ExtracaoLoading() {
  return (
    <div className="space-y-3" aria-label="Extraindo itens do orçamento" aria-busy="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-3 items-center">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-24" />
        </div>
      ))}
      <p className="text-xs text-slate-400 text-center pt-2">Analisando orçamento com IA…</p>
    </div>
  )
}
