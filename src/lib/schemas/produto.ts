import { z } from 'zod'

/**
 * Produto extraído de um orçamento de fornecedor, antes do cálculo de pricing.
 * Inclui `confidence` — confiança do Claude na extração desta linha (0–1).
 */
export const ProdutoExtraidoSchema = z.object({
  nome: z.string().min(1),
  descricao: z.string().nullable(),
  /** Deve ser inteiro positivo. Se o orçamento informar fração, separar em qtd + unidade. */
  quantidade: z.number().int().positive(),
  /** Unidade normalizada: "un", "rolo", "m", "kg", "caixa", etc. Null se ausente. */
  unidade: z.string().nullable(),
  /** Preço unitário em BRL como float (ex: 85.5, não "R$ 85,50"). Deve ser positivo. */
  valor_unitario: z.number().positive(),
  fornecedor: z.string().nullable(),
  observacao: z.string().nullable(),
  /** Confiança do Claude nesta linha de item (0 = incerto, 1 = certeza absoluta). */
  confidence: z.number().min(0).max(1),
})

export type ProdutoExtraido = z.infer<typeof ProdutoExtraidoSchema>

/**
 * Orçamento completo extraído de um documento.
 * Output do tool use `registrar_orcamento` do Claude.
 */
export const OrcamentoExtraidoSchema = z.object({
  fornecedor_principal: z.string().nullable(),
  /** Data do orçamento em ISO 8601 ou null se ausente. */
  data_orcamento: z.string().nullable(),
  validade: z.string().nullable(),
  itens: z.array(ProdutoExtraidoSchema).min(1),
  observacoes_gerais: z.string().nullable(),
})

export type OrcamentoExtraido = z.infer<typeof OrcamentoExtraidoSchema>
