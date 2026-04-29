/** Produto recebido do orçamento do fornecedor — input do módulo de pricing. */
export interface Produto {
  /** Preço unitário do fornecedor em BRL. Deve ser positivo. */
  valor_unitario: number
  /** Quantidade de unidades. Deve ser inteiro positivo. */
  quantidade: number
  /** Mão de obra aplicada por unidade em BRL. Default 0. Não pode ser negativa. */
  mao_de_obra?: number
  /** Sobrescreve o markup padrão para este item. Intervalo [0, 5]. */
  markup_override?: number
}

/** Item após aplicação de markup e mão de obra — output de calcularItem(). */
export interface ItemCalculado {
  valor_unitario: number
  quantidade: number
  /** Mão de obra por unidade (normalizado — nunca undefined). */
  mao_de_obra: number
  /** Markup efetivamente aplicado (markup_override ?? MARKUP_DEFAULT). */
  markup_efetivo: number
  /** valor_unitario × (1 + markup_efetivo), arredondado para 2 casas. */
  preco_com_markup_unit: number
  /** preco_com_markup_unit + mao_de_obra, arredondado para 2 casas. */
  preco_final_unit: number
  /** preco_final_unit × quantidade, arredondado para 2 casas. */
  subtotal: number
}

/** Resultado agregado de uma lista de produtos calculados — output de calcularProposta(). */
export interface PropostaCalculada {
  itens: ItemCalculado[]
  /** Soma de (valor_unitario × quantidade) sem markup — custo bruto total. */
  subtotal_produtos: number
  /** Soma do markup monetário aplicado sobre todos os itens. */
  total_markup: number
  /** Soma da mão de obra total (mao_de_obra × quantidade) de todos os itens. */
  total_mao_de_obra: number
  /** Total final: subtotal_produtos + total_markup + total_mao_de_obra. */
  total_geral: number
  /** Número de linhas de produto (itens distintos). */
  quantidade_itens: number
  /** Soma das quantidades de todas as linhas. */
  quantidade_unidades: number
}
