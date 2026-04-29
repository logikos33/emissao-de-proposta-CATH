'use client'

import { useSyncExternalStore } from 'react'
import { Toaster } from 'sonner'
import { Stepper } from '@/components/nova-proposta/stepper'

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
}

function HydrationGuard({ children }: { children: React.ReactNode }) {
  const isClient = useIsClient()
  if (!isClient) return null
  return <>{children}</>
}

export default function NovaPropostaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-slate-50">
      <Stepper />
      <main className="flex flex-1 flex-col">
        <HydrationGuard>{children}</HydrationGuard>
      </main>
      <Toaster position="bottom-center" richColors />
    </div>
  )
}
