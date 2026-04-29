import OpenAI from 'openai'
import { registrarOrcamentoTool } from './tool-schema'

const MODEL = process.env['GLM_MODEL'] ?? 'glm-4-flash'
const RETRY_DELAYS_MS = [1000, 2000, 4000] as const

let _client: OpenAI | undefined

function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({
      apiKey: process.env['GLM_API_KEY'],
      baseURL: 'https://open.bigmodel.cn/api/paas/v4/',
    })
  }
  return _client
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function chamarClaudeExtracao(
  systemPrompt: string,
  userPrompt: string,
  pdfBuffer?: Buffer,
): Promise<unknown> {
  const client = getClient()

  const userContent: OpenAI.ChatCompletionContentPart[] = pdfBuffer
    ? [
        {
          type: 'text',
          text: `[PDF em base64 omitido — processe o texto abaixo]\n\n${userPrompt}`,
        },
      ]
    : [{ type: 'text', text: userPrompt }]

  let lastError: unknown

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await client.chat.completions.create({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent },
        ],
        tools: [registrarOrcamentoTool],
        tool_choice: { type: 'function', function: { name: 'registrar_orcamento' } },
      })

      const toolCall = response.choices[0]?.message?.tool_calls?.[0]
      if (!toolCall || toolCall.type !== 'function') {
        throw new Error('Nenhum tool_call na resposta do GLM')
      }

      return JSON.parse(toolCall.function.arguments) as unknown
    } catch (err) {
      lastError = err
      if (attempt < 2) await sleep(RETRY_DELAYS_MS[attempt] ?? 1000)
    }
  }

  throw lastError
}
