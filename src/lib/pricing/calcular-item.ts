import { MARKUP_DEFAULT, MARKUP_MAX, MARKUP_MIN } from './constants'
import {
  MaoDeObraInvalidaError,
  MarkupInvalidoError,
  QuantidadeInvalidaError,
  ValorInvalidoError,
} from './erros'
import { roundBRL } from './round'
import type { ItemCalculado, Produto } from './types'

/**
 * Calcula o preço final de um item da proposta aplicando markup e mão de obra.
 *
 * Fórmula:
 *   preco_com_markup_unit = valor_unitario × (1 + markup_efetivo)
 *   preco_final_unit      = preco_com_markup_unit + mao_de_obra
 *   subtotal              = preco_final_unit × quantidade
 *
 * @param produto - Item com valor do fornecedor e parâmetros de pricing
 * @returns Item calculado com todos os campos de pricing preenchidos
 * @throws {ValorInvalidoError} Se valor_unitario <= 0
 * @throws {QuantidadeInvalidaError} Se quantidade <= 0 ou não for inteiro
 * @throws {MarkupInvalidoError} Se markup_override estiver fora de [0, 5]
 * @throws {MaoDeObraInvalidaError} Se mao_de_obra for negativa
 */
export function calcularItem(produto: Produto): ItemCalculado {
  const { valor_unitario, quantidade, markup_override } = produto
  const mao_de_obra = produto.mao_de_obra ?? 0

  if (valor_unitario <= 0) {
    throw new ValorInvalidoError(
      `valor_unitario deve ser positivo, recebido: ${valor_unitario}`,
      'valor_unitario',
      valor_unitario,
    )
  }

  if (quantidade <= 0 || !Number.isInteger(quantidade)) {
    throw new QuantidadeInvalidaError(
      `quantidade deve ser inteiro positivo, recebido: ${quantidade}`,
      'quantidade',
      quantidade,
    )
  }

  if (
    markup_override !== undefined &&
    (markup_override < MARKUP_MIN || markup_override > MARKUP_MAX)
  ) {
    throw new MarkupInvalidoError(
      `markup_override deve estar entre ${MARKUP_MIN} e ${MARKUP_MAX}, recebido: ${markup_override}`,
      'markup_override',
      markup_override,
    )
  }

  if (mao_de_obra < 0) {
    throw new MaoDeObraInvalidaError(
      `mao_de_obra não pode ser negativa, recebido: ${mao_de_obra}`,
      'mao_de_obra',
      mao_de_obra,
    )
  }

  const markup_efetivo = markup_override ?? MARKUP_DEFAULT
  const preco_com_markup_unit = roundBRL(valor_unitario * (1 + markup_efetivo))
  const preco_final_unit = roundBRL(preco_com_markup_unit + mao_de_obra)
  const subtotal = roundBRL(preco_final_unit * quantidade)

  return {
    valor_unitario,
    quantidade,
    mao_de_obra,
    markup_efetivo,
    preco_com_markup_unit,
    preco_final_unit,
    subtotal,
  }
}
