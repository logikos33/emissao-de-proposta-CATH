'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatBRL, parseBRL } from '@/lib/utils/currency'
import type { ItemEditado } from '@/lib/schemas/proposta-form'

interface TabelaItensEditavelProps {
  itens: ItemEditado[]
  onUpdate: (id: string, patch: Partial<Omit<ItemEditado, 'id'>>) => void
  onRemove: (id: string) => void
  onAdd: () => void
}

interface LinhaProps {
  item: ItemEditado
  onUpdate: (patch: Partial<Omit<ItemEditado, 'id'>>) => void
  onRemove: () => void
}

function Linha({ item, onUpdate, onRemove }: LinhaProps) {
  const [editandoValor, setEditandoValor] = useState(formatBRL(item.valor_unitario))
  const baixaConfianca = item.confidence < 0.6 || item.requires_review

  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="py-2 pr-2">
        {baixaConfianca && (
          <Badge
            variant="outline"
            className="mb-1 text-amber-700 border-amber-300 bg-amber-50 text-xs"
          >
            Revisar
          </Badge>
        )}
        <Input
          value={item.descricao}
          onChange={(e) => onUpdate({ descricao: e.target.value })}
          className="h-10 text-base"
          aria-label="Descrição do item"
          style={{ fontSize: '16px' }}
        />
      </td>
      <td className="py-2 px-2 w-20">
        <Input
          type="number"
          min={1}
          value={item.quantidade}
          onChange={(e) => onUpdate({ quantidade: Number(e.target.value) || 1 })}
          className="h-10 text-base text-center"
          aria-label="Quantidade"
          style={{ fontSize: '16px' }}
        />
      </td>
      <td className="py-2 px-2 w-32">
        <Input
          value={editandoValor}
          onChange={(e) => setEditandoValor(e.target.value)}
          onBlur={() => {
            const parsed = parseBRL(editandoValor)
            onUpdate({ valor_unitario: parsed })
            setEditandoValor(formatBRL(parsed))
          }}
          className="h-10 text-base text-right"
          aria-label="Valor unitário"
          style={{ fontSize: '16px' }}
        />
      </td>
      <td className="py-2 pl-2 text-right text-sm font-medium text-slate-700 whitespace-nowrap">
        {formatBRL(item.valor_unitario * item.quantidade)}
      </td>
      <td className="py-2 pl-2">
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remover ${item.descricao}`}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          ✕
        </button>
      </td>
    </tr>
  )
}

export function TabelaItensEditavel({
  itens,
  onUpdate,
  onRemove,
  onAdd,
}: TabelaItensEditavelProps) {
  const subtotal = itens.reduce((s, i) => s + i.valor_unitario * i.quantidade, 0)

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto -mx-4 px-4">
        <table className="w-full min-w-[480px]">
          <thead>
            <tr className="text-xs font-medium text-slate-500 border-b border-slate-200">
              <th className="pb-2 text-left pr-2">Descrição</th>
              <th className="pb-2 text-center px-2 w-20">Qtd</th>
              <th className="pb-2 text-right px-2 w-32">Unit.</th>
              <th className="pb-2 text-right pl-2">Total</th>
              <th className="pb-2 pl-2 w-10" />
            </tr>
          </thead>
          <tbody>
            {itens.map((item) => (
              <Linha
                key={item.id}
                item={item}
                onUpdate={(patch) => onUpdate(item.id, patch)}
                onRemove={() => onRemove(item.id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between pt-1">
        <Button type="button" variant="outline" onClick={onAdd} className="min-h-[44px] text-sm">
          + Adicionar item
        </Button>
        <p className="text-sm font-semibold text-slate-800">Subtotal: {formatBRL(subtotal)}</p>
      </div>
    </div>
  )
}
