// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TabelaItensEditavel } from '@/components/nova-proposta/tabela-itens-editavel'
import type { ItemEditado } from '@/lib/schemas/proposta-form'

const item1: ItemEditado = {
  id: 'a',
  descricao: 'Parafuso M6',
  quantidade: 10,
  valor_unitario: 0.5,
  unidade: 'un',
  confidence: 0.9,
  requires_review: false,
}

const itemBaixaConfianca: ItemEditado = {
  id: 'b',
  descricao: 'Item incerto',
  quantidade: 1,
  valor_unitario: 100,
  unidade: null,
  confidence: 0.4,
  requires_review: true,
}

describe('TabelaItensEditavel', () => {
  it('renderiza os itens da lista', () => {
    render(
      <TabelaItensEditavel itens={[item1]} onUpdate={vi.fn()} onRemove={vi.fn()} onAdd={vi.fn()} />,
    )
    expect(screen.getByDisplayValue('Parafuso M6')).toBeInTheDocument()
  })

  it('exibe badge "Revisar" em item com baixa confiança', () => {
    render(
      <TabelaItensEditavel
        itens={[itemBaixaConfianca]}
        onUpdate={vi.fn()}
        onRemove={vi.fn()}
        onAdd={vi.fn()}
      />,
    )
    expect(screen.getByText('Revisar')).toBeInTheDocument()
  })

  it('não exibe badge "Revisar" em item com alta confiança', () => {
    render(
      <TabelaItensEditavel itens={[item1]} onUpdate={vi.fn()} onRemove={vi.fn()} onAdd={vi.fn()} />,
    )
    expect(screen.queryByText('Revisar')).not.toBeInTheDocument()
  })

  it('chama onRemove ao clicar no botão de remoção', () => {
    const onRemove = vi.fn()
    render(
      <TabelaItensEditavel
        itens={[item1]}
        onUpdate={vi.fn()}
        onRemove={onRemove}
        onAdd={vi.fn()}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: /remover parafuso m6/i }))
    expect(onRemove).toHaveBeenCalledWith('a')
  })

  it('chama onAdd ao clicar em "+ Adicionar item"', () => {
    const onAdd = vi.fn()
    render(
      <TabelaItensEditavel itens={[item1]} onUpdate={vi.fn()} onRemove={vi.fn()} onAdd={onAdd} />,
    )
    fireEvent.click(screen.getByRole('button', { name: /adicionar item/i }))
    expect(onAdd).toHaveBeenCalledOnce()
  })

  it('exibe o subtotal calculado', () => {
    render(
      <TabelaItensEditavel itens={[item1]} onUpdate={vi.fn()} onRemove={vi.fn()} onAdd={vi.fn()} />,
    )
    // 10 × 0.5 = 5.00
    expect(screen.getByText(/subtotal/i)).toBeInTheDocument()
  })
})
