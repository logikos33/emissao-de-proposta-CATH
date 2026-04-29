# Schemas Canônicos — Produto e Proposta

Estes schemas são a **fonte da verdade** dos tipos do domínio. Os tipos TypeScript são inferidos deles via `z.infer<>`. Qualquer mudança de contrato começa aqui.

Implementar em `src/lib/schemas/index.ts`.

## ProdutoSchema

Representa um item extraído do orçamento do fornecedor (antes do cálculo de pricing).

```typescript
import { z } from 'zod'

export const ProdutoSchema = z.object({
  /** UUID gerado no frontend ao criar o item */
  id: z.string().uuid(),

  /** Nome do produto conforme orçamento */
  nome: z.string().min(1),

  /** Descrição adicional (ex: especificação técnica) — pode ser nulo */
  descricao: z.string().nullable(),

  /** Quantidade de unidades */
  qtd: z.number().positive(),

  /** Unidade de medida (ex: "un", "rolo", "m", "kg") */
  unidade: z.string().min(1),

  /** Preço unitário do fornecedor em BRL */
  valor_unitario: z.number().nonnegative(),

  /** Nome do fornecedor que enviou o orçamento */
  fornecedor: z.string().nullable(),

  /** Observações do orçamento (ex: "prazo de entrega 5 dias") */
  observacao: z.string().nullable(),

  /** Valor fixo de mão de obra adicionado pelo colaborador (BRL) */
  mao_de_obra: z.number().nonnegative().default(0),

  /** Sobrescreve o markup padrão de 45% para este item específico */
  markup_override: z.number().nonnegative().optional(),
})

export type Produto = z.infer<typeof ProdutoSchema>
```

## ItemFinalSchema

Representa um item após aplicação do pricing (output de `calcularItem()`).

```typescript
export const ItemFinalSchema = ProdutoSchema.extend({
  /** Valor unitário com markup aplicado */
  valor_com_markup: z.number().nonnegative(),

  /** Valor total do item: (valor_unitario * (1 + markup) + mao_de_obra) * qtd */
  valor_final: z.number().nonnegative(),
})

export type ItemFinal = z.infer<typeof ItemFinalSchema>
```

## CondicaoPagamentoSchema

```typescript
export const CondicoesPagamento = [
  'a_vista',
  '30_dias',
  '30_60_dias',
  '30_60_90_dias',
  '45_90_dias',
  'sinal_30_dias',
  'sinal_30_60_dias',
  'customizado',
] as const

export const CondicaoPagamentoSchema = z.enum(CondicoesPagamento)

export type CondicaoPagamento = z.infer<typeof CondicaoPagamentoSchema>

/** Mapa de exibição para o PDF */
export const CONDICAO_LABEL: Record<CondicaoPagamento, string> = {
  a_vista: 'À vista',
  '30_dias': '30 dias',
  '30_60_dias': '30/60 dias',
  '30_60_90_dias': '30/60/90 dias',
  '45_90_dias': '45/90 dias',
  sinal_30_dias: 'Sinal + 30 dias',
  sinal_30_60_dias: 'Sinal + 30/60 dias',
  customizado: 'Personalizado',
}
```

> Quando `condicoes_pagamento === "customizado"`, o campo `condicoes_customizadas: string` é obrigatório na proposta.

## PropostaSchema

Representa a proposta completa pronta para gerar o Slides/PDF.

```typescript
export const PropostaSchema = z.object({
  /** UUID da proposta */
  id: z.string().uuid(),

  /** Nome do cliente para quem a proposta é destinada */
  cliente: z.string().min(1),

  /** Data da proposta (ISO 8601) */
  data: z.string().datetime(),

  /** Nome do colaborador que gerou a proposta */
  colaborador: z.string().min(1),

  /** Lista de itens com pricing aplicado */
  itens: z.array(ItemFinalSchema).min(1),

  /** Soma total de todos os itens */
  total: z.number().nonnegative(),

  /** Condição de pagamento selecionada pelo colaborador */
  condicoes_pagamento: CondicaoPagamentoSchema,

  /** Observações gerais da proposta (ex: validade, frete) */
  observacoes: z.string().nullable(),
})

export type Proposta = z.infer<typeof PropostaSchema>
```
