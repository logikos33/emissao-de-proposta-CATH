# Integração Claude API — Extração de Orçamentos

## Visão geral

Usamos a Anthropic SDK para extrair dados estruturados de orçamentos via **tool use**. Tool use é preferido sobre JSON mode porque força o modelo a respeitar o schema exato, sem texto extra ao redor do JSON.

## Dependência

```bash
pnpm add @anthropic-ai/sdk
```

## Modelo

```typescript
// Usar claude-sonnet-4-5 ou superior — balanço custo/qualidade para extração
const MODEL = process.env['ANTHROPIC_MODEL'] ?? 'claude-sonnet-4-5'
```

## Inicialização do cliente

```typescript
// src/lib/claude/client.ts
import Anthropic from '@anthropic-ai/sdk'

// Instância singleton — evita criar novo cliente a cada request
export const anthropic = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'],
})
```

## Tool definition para extração

```typescript
// src/lib/claude/tools.ts
import type Anthropic from '@anthropic-ai/sdk'

/** Tool que força Claude a retornar Produto[] no schema exato */
export const extractBudgetTool: Anthropic.Tool = {
  name: 'extract_budget_items',
  description: 'Extrai itens de um orçamento de fornecedor e retorna lista estruturada de produtos',
  input_schema: {
    type: 'object',
    properties: {
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            nome: { type: 'string' },
            descricao: { type: ['string', 'null'] },
            qtd: { type: 'number' },
            unidade: { type: 'string' },
            valor_unitario: { type: 'number' },
            fornecedor: { type: ['string', 'null'] },
            observacao: { type: ['string', 'null'] },
          },
          required: ['nome', 'qtd', 'unidade', 'valor_unitario'],
        },
      },
    },
    required: ['items'],
  },
}
```

## Envio de PDF nativo

Claude suporta PDF como `document` source — não é necessário extrair texto com pdfplumber ou similar.

```typescript
// Enviar PDF como document source (não como base64 de imagem)
const pdfContent: Anthropic.DocumentBlockParam = {
  type: 'document',
  source: {
    type: 'base64',
    media_type: 'application/pdf',
    data: Buffer.from(pdfBuffer).toString('base64'),
  },
}
```

## Retry com exponential backoff

```typescript
/**
 * Chama Claude com retry automático em caso de rate limit ou erro transitório.
 * 3 tentativas com delays 1s → 2s → 4s.
 */
async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (err) {
      if (i === attempts - 1) throw err
      // Backoff exponencial: 1s, 2s, 4s
      await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, i)))
    }
  }
  throw new Error('unreachable')
}
```

## Fluxo completo de extração

```typescript
import { anthropic } from './client'
import { extractBudgetTool } from './tools'
import { EXTRACT_BUDGET_SYSTEM_PROMPT } from './prompts'

/**
 * Extrai produtos de um orçamento (PDF buffer ou texto).
 * Retorna array de itens não validados — validar com ProdutoSchema após.
 */
export async function extractBudget(
  input: { type: 'pdf'; buffer: Buffer } | { type: 'text'; content: string },
): Promise<unknown[]> {
  const userContent =
    input.type === 'pdf'
      ? [
          {
            type: 'document' as const,
            source: {
              type: 'base64' as const,
              media_type: 'application/pdf' as const,
              data: input.buffer.toString('base64'),
            },
          },
        ]
      : [{ type: 'text' as const, text: input.content }]

  const response = await withRetry(() =>
    anthropic.messages.create({
      model: MODEL,
      max_tokens: 2048,
      system: EXTRACT_BUDGET_SYSTEM_PROMPT,
      tools: [extractBudgetTool],
      // Forçar uso da tool — impede resposta em texto livre
      tool_choice: { type: 'tool', name: 'extract_budget_items' },
      messages: [{ role: 'user', content: userContent }],
    }),
  )

  // Extrair o input da tool call da resposta
  const toolUse = response.content.find((b) => b.type === 'tool_use')
  if (!toolUse || toolUse.type !== 'tool_use') {
    throw new Error('Claude não retornou tool use — resposta inesperada')
  }

  const { items } = toolUse.input as { items: unknown[] }
  return items
}
```
