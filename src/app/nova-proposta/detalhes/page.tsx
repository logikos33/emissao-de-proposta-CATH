'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FormMaoDeObra } from '@/components/nova-proposta/form-mao-de-obra'
import { FormCliente } from '@/components/nova-proposta/form-cliente'
import {
  CONDICAO_PAGAMENTO_LABELS,
  CondicaoPagamentoEnum,
  type CondicaoPagamento,
} from '@/lib/schemas/proposta-form'
import { usePropostaStore } from '@/lib/stores/proposta.store'

export default function DetalhesPage() {
  const router = useRouter()
  const {
    itens,
    maoDeObra,
    cliente,
    condicaoPagamento,
    validadeDias,
    setMaoDeObra,
    setCliente,
    setCondicaoPagamento,
    setValidadeDias,
  } = usePropostaStore()

  if (itens.length === 0) {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-8 text-center space-y-4">
        <p className="text-slate-500">Nenhum item encontrado. Volte e faça o upload.</p>
        <Button onClick={() => router.push('/nova-proposta/upload')} className="min-h-[44px]">
          Ir para o upload
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">Detalhes</h1>
        <p className="text-sm text-slate-500">Preencha mão de obra e dados do cliente.</p>
      </div>

      <FormMaoDeObra defaultValues={maoDeObra} onChange={setMaoDeObra} />

      <hr className="border-slate-200" />

      <FormCliente defaultValues={cliente} onChange={setCliente} />

      <hr className="border-slate-200" />

      <div className="space-y-4">
        <p className="text-base font-semibold text-slate-900">Condições comerciais</p>

        <div className="space-y-1">
          <label htmlFor="condicao" className="text-sm font-medium text-slate-700">
            Condição de pagamento
          </label>
          <Select
            value={condicaoPagamento}
            onValueChange={(v) => setCondicaoPagamento(v as CondicaoPagamento)}
          >
            <SelectTrigger id="condicao" className="h-11" style={{ fontSize: '16px' }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CondicaoPagamentoEnum.options.map((op) => (
                <SelectItem key={op} value={op}>
                  {CONDICAO_PAGAMENTO_LABELS[op]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label htmlFor="validade" className="text-sm font-medium text-slate-700">
            Validade (dias)
          </label>
          <Input
            id="validade"
            type="number"
            min={1}
            value={validadeDias}
            onChange={(e) => setValidadeDias(Number(e.target.value) || 30)}
            className="h-11 w-28"
            style={{ fontSize: '16px' }}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          onClick={() => router.push('/nova-proposta/revisao')}
          className="flex-1 min-h-[44px]"
        >
          Voltar
        </Button>
        <Button
          onClick={() => router.push('/nova-proposta/preview')}
          className="flex-1 min-h-[44px]"
        >
          Gerar Preview
        </Button>
      </div>
    </div>
  )
}
