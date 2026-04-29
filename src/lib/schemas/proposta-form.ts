import { z } from 'zod'

export const ItemEditadoSchema = z.object({
  id: z.string(),
  descricao: z.string().min(1, 'Descrição obrigatória'),
  quantidade: z.number().positive('Deve ser positivo'),
  valor_unitario: z.number().nonnegative('Deve ser ≥ 0'),
  unidade: z.string().nullable(),
  confidence: z.number().min(0).max(1),
  requires_review: z.boolean(),
})

export type ItemEditado = z.infer<typeof ItemEditadoSchema>

export const MaoDeObraSchema = z.object({
  taxa_hora: z.number().nonnegative('Deve ser ≥ 0'),
  horas_estimadas: z.number().nonnegative('Deve ser ≥ 0'),
  descricao: z.string().optional(),
})

export type MaoDeObraForm = z.infer<typeof MaoDeObraSchema>

export const ClienteSchema = z.object({
  nome: z.string().min(1, 'Nome obrigatório'),
  empresa: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
})

export type ClienteForm = z.infer<typeof ClienteSchema>

export const CondicaoPagamentoEnum = z.enum([
  'a_vista',
  '30_dias',
  '30_60_dias',
  '30_60_90_dias',
  '45_90_dias',
  'sinal_30_dias',
  'sinal_30_60_dias',
  'customizado',
])

export type CondicaoPagamento = z.infer<typeof CondicaoPagamentoEnum>

export const CONDICAO_PAGAMENTO_LABELS: Record<CondicaoPagamento, string> = {
  a_vista: 'À vista',
  '30_dias': '30 dias',
  '30_60_dias': '30/60 dias',
  '30_60_90_dias': '30/60/90 dias',
  '45_90_dias': '45/90 dias',
  sinal_30_dias: 'Sinal + 30 dias',
  sinal_30_60_dias: 'Sinal + 30/60 dias',
  customizado: 'Customizado',
}

export const PropostaSchema = z.object({
  itens: z.array(ItemEditadoSchema).min(1, 'Adicione ao menos um item'),
  mao_de_obra: MaoDeObraSchema,
  cliente: ClienteSchema,
  condicao_pagamento: CondicaoPagamentoEnum,
  validade_dias: z.number().int().positive().default(30),
})

export type PropostaForm = z.infer<typeof PropostaSchema>
