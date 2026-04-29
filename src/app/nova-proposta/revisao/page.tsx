'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ExtracaoLoading } from '@/components/nova-proposta/extracao-loading'
import { TabelaItensEditavel } from '@/components/nova-proposta/tabela-itens-editavel'
import { usePropostaStore } from '@/lib/stores/proposta.store'
import type { ItemEditado } from '@/lib/schemas/proposta-form'

export default function RevisaoPage() {
  const router = useRouter()
  const { itens, extracao, updateItem, removeItem, addItem } = usePropostaStore()

  function handleAddItem() {
    const novo: ItemEditado = {
      id: `item-manual-${Date.now()}`,
      descricao: 'Novo item',
      quantidade: 1,
      valor_unitario: 0,
      unidade: null,
      confidence: 1,
      requires_review: false,
    }
    addItem(novo)
  }

  if (extracao.status === 'loading') {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-8">
        <ExtracaoLoading />
      </div>
    )
  }

  if (extracao.status === 'idle' && itens.length === 0) {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-8 text-center space-y-4">
        <p className="text-slate-500">Nenhum orçamento carregado.</p>
        <Button onClick={() => router.push('/nova-proposta/upload')} className="min-h-[44px]">
          Voltar ao upload
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">Revisar itens</h1>
        <p className="text-sm text-slate-500">
          Verifique e edite os itens extraídos. Itens marcados com{' '}
          <span className="font-medium text-amber-700">Revisar</span> precisam de atenção.
        </p>
      </div>

      <TabelaItensEditavel
        itens={itens}
        onUpdate={updateItem}
        onRemove={removeItem}
        onAdd={handleAddItem}
      />

      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          onClick={() => router.push('/nova-proposta/upload')}
          className="flex-1 min-h-[44px]"
        >
          Voltar
        </Button>
        <Button
          onClick={() => router.push('/nova-proposta/detalhes')}
          disabled={itens.length === 0}
          className="flex-1 min-h-[44px]"
        >
          Próximo
        </Button>
      </div>
    </div>
  )
}
