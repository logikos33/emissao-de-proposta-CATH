import { calcularItem } from './calcular-item'
import { roundBRL } from './round'
import type { PropostaCalculada, Produto } from './types'

/**
 * Calcula a proposta completa: aplica pricing em todos os itens e agrega os totais.
 *
 * Invariante: total_geral === subtotal_produtos + total_markup + total_mao_de_obra (±0.01 por arredondamento)
 *
 * @param produtos - Lista de produtos para calcular (pode ser vazia)
 * @returns Proposta calculada com itens individuais e totais agregados
 * @throws Propaga erros de calcularItem se algum produto for inválido
 */
export function calcularProposta(produtos: Produto[]): PropostaCalculada {
  const itens = produtos.map(calcularItem)

  const subtotal_produtos = roundBRL(
    itens.reduce((acc, item) => acc + item.valor_unitario * item.quantidade, 0),
  )
  const total_mao_de_obra = roundBRL(
    itens.reduce((acc, item) => acc + item.mao_de_obra * item.quantidade, 0),
  )
  const total_markup = roundBRL(
    itens.reduce(
      (acc, item) => acc + item.valor_unitario * item.markup_efetivo * item.quantidade,
      0,
    ),
  )
  const total_geral = roundBRL(subtotal_produtos + total_markup + total_mao_de_obra)
  const quantidade_itens = itens.length
  const quantidade_unidades = itens.reduce((acc, item) => acc + item.quantidade, 0)

  return {
    itens,
    subtotal_produtos,
    total_markup,
    total_mao_de_obra,
    total_geral,
    quantidade_itens,
    quantidade_unidades,
  }
}
