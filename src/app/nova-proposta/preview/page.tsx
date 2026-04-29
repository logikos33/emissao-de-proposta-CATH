'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PropostaPreview } from '@/components/nova-proposta/proposta-preview'
import { usePropostaStore } from '@/lib/stores/proposta.store'

export default function PreviewPage() {
  const router = useRouter()
  const { itens, cliente, maoDeObra, condicaoPagamento, validadeDias, resetar } = usePropostaStore()

  if (itens.length === 0) {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-8 text-center space-y-4">
        <p className="text-slate-500">Nenhuma proposta gerada ainda.</p>
        <Button onClick={() => router.push('/nova-proposta/upload')} className="min-h-[44px]">
          Começar
        </Button>
      </div>
    )
  }

  function handleNovaProposta() {
    resetar()
    router.push('/nova-proposta/upload')
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 space-y-6">
      <div className="no-print flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl font-bold text-slate-900">Preview da proposta</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()} className="min-h-[44px]">
            Editar
          </Button>
          <Button variant="outline" onClick={handleNovaProposta} className="min-h-[44px]">
            Nova proposta
          </Button>
          <Button onClick={() => window.print()} className="min-h-[44px]">
            Imprimir / PDF
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <PropostaPreview
          itens={itens}
          cliente={cliente}
          maoDeObra={maoDeObra}
          condicaoPagamento={condicaoPagamento}
          validadeDias={validadeDias}
          dataEmissao={new Date()}
        />
      </div>
    </div>
  )
}
