import { describe, expect, it } from 'vitest'
import { extracaoToProduto } from '../adapter'

describe('extracaoToProduto', () => {
  it('mapeia valor_unitario e quantidade do ProdutoExtraido', () => {
    const result = extracaoToProduto({
      nome: 'Cabo elétrico',
      descricao: 'Flexível',
      quantidade: 10,
      unidade: 'm',
      valor_unitario: 4.5,
      fornecedor: 'Elétrica ABC',
      observacao: null,
      confidence: 0.95,
    })
    expect(result).toEqual({ valor_unitario: 4.5, quantidade: 10 })
  })

  it('não inclui campos extras no resultado', () => {
    const result = extracaoToProduto({
      nome: 'Parafuso',
      descricao: null,
      quantidade: 100,
      unidade: 'un',
      valor_unitario: 0.45,
      fornecedor: null,
      observacao: null,
      confidence: 0.8,
    })
    expect(Object.keys(result)).toEqual(['valor_unitario', 'quantidade'])
  })
})
