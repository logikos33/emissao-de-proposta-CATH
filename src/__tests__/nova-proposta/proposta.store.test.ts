import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock persist to a no-op so Zustand doesn't touch localStorage in tests
vi.mock('zustand/middleware', () => ({
  persist: (config: (set: unknown, get: unknown, api: unknown) => unknown) => config,
}))

import { usePropostaStore } from '@/lib/stores/proposta.store'
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

const item2: ItemEditado = {
  id: 'b',
  descricao: 'Chumbador',
  quantidade: 5,
  valor_unitario: 2,
  unidade: 'un',
  confidence: 0.8,
  requires_review: false,
}

beforeEach(() => {
  usePropostaStore.getState().resetar()
})

describe('setItens', () => {
  it('define a lista de itens', () => {
    usePropostaStore.getState().setItens([item1])
    expect(usePropostaStore.getState().itens).toHaveLength(1)
  })

  it('recalcula totalCalculado', () => {
    usePropostaStore.getState().setItens([item1, item2])
    // 10 * 0.5 + 5 * 2 = 5 + 10 = 15
    expect(usePropostaStore.getState().totalCalculado).toBeCloseTo(15)
  })
})

describe('updateItem', () => {
  it('atualiza campo de um item pelo id', () => {
    usePropostaStore.getState().setItens([item1])
    usePropostaStore.getState().updateItem('a', { quantidade: 20 })
    expect(usePropostaStore.getState().itens[0]?.quantidade).toBe(20)
  })

  it('recalcula total após update', () => {
    usePropostaStore.getState().setItens([item1])
    usePropostaStore.getState().updateItem('a', { quantidade: 20 })
    // 20 * 0.5 = 10
    expect(usePropostaStore.getState().totalCalculado).toBeCloseTo(10)
  })
})

describe('removeItem', () => {
  it('remove item pelo id', () => {
    usePropostaStore.getState().setItens([item1, item2])
    usePropostaStore.getState().removeItem('a')
    expect(usePropostaStore.getState().itens).toHaveLength(1)
    expect(usePropostaStore.getState().itens[0]?.id).toBe('b')
  })

  it('recalcula total após remoção', () => {
    usePropostaStore.getState().setItens([item1, item2])
    usePropostaStore.getState().removeItem('a')
    // 5 * 2 = 10
    expect(usePropostaStore.getState().totalCalculado).toBeCloseTo(10)
  })
})

describe('resetar', () => {
  it('limpa itens e zera o total', () => {
    usePropostaStore.getState().setItens([item1])
    usePropostaStore.getState().resetar()
    expect(usePropostaStore.getState().itens).toHaveLength(0)
    expect(usePropostaStore.getState().totalCalculado).toBe(0)
  })

  it('reseta estado de extração para idle', () => {
    usePropostaStore.getState().iniciarExtracao()
    usePropostaStore.getState().resetar()
    expect(usePropostaStore.getState().extracao.status).toBe('idle')
  })
})

describe('totalCalculado com mão de obra', () => {
  it('inclui taxa × horas no total', () => {
    usePropostaStore.getState().setItens([item1])
    usePropostaStore.getState().setMaoDeObra({ taxa_hora: 80, horas_estimadas: 2 })
    // 5 (itens) + 160 (mdo) = 165
    expect(usePropostaStore.getState().totalCalculado).toBeCloseTo(165)
  })
})
