import Anthropic from '@anthropic-ai/sdk'
import { registrarOrcamentoTool } from './tool-schema'

const MODEL = process.env['ANTHROPIC_MODEL'] ?? 'claude-sonnet-4-5'
const RETRY_DELAYS_MS = [1000, 2000, 4000] as const

let _client: Anthropic | undefined

function getClient(): Anthropic {
  if (!_client) _client = new Anthropic()
  return _client
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function buildUserContent(
  userPrompt: string,
  pdfBuffer?: Buffer,
): Anthropic.MessageParam['content'] {
  if (!pdfBuffer) return userPrompt
  return [
    {
      type: 'document',
      source: {
        type: 'base64',
        media_type: 'application/pdf' as const,
        data: pdfBuffer.toString('base64'),
      },
    },
    { type: 'text', text: userPrompt },
  ] as Anthropic.MessageParam['content']
}

export async function chamarClaudeExtracao(
  systemPrompt: string,
  userPrompt: string,
  pdfBuffer?: Buffer,
): Promise<unknown> {
  const client = getClient()
  const content = buildUserContent(userPrompt, pdfBuffer)
  let lastError: unknown

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await client.messages.create({
        model: MODEL,
        max_tokens: 4096,
        system: systemPrompt,
        tools: [registrarOrcamentoTool as unknown as Anthropic.Tool],
        tool_choice: { type: 'tool', name: 'registrar_orcamento' },
        messages: [{ role: 'user', content }],
      })

      const toolBlock = response.content.find((b) => b.type === 'tool_use')
      if (toolBlock?.type !== 'tool_use') {
        throw new Error('Nenhum tool_use block na resposta do Claude')
      }
      return toolBlock.input
    } catch (err) {
      lastError = err
      if (attempt < 2) await sleep(RETRY_DELAYS_MS[attempt] ?? 1000)
    }
  }

  throw lastError
}
