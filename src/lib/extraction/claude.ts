import crypto from 'crypto'
import OpenAI from 'openai'
import { registrarOrcamentoTool } from './tool-schema'

const MODEL = process.env['GLM_MODEL'] ?? 'glm-4-flash'
const RETRY_DELAYS_MS = [1000, 2000, 4000] as const

function generateZhipuToken(apiKey: string): string {
  const dotIndex = apiKey.indexOf('.')
  if (dotIndex === -1) throw new Error('GLM_API_KEY inválida: formato esperado id.secret')
  const id = apiKey.slice(0, dotIndex)
  const secret = apiKey.slice(dotIndex + 1)

  const timestamp = Date.now()
  const exp = timestamp + 3600 * 1000

  const header = Buffer.from(JSON.stringify({ alg: 'HS256', sign_type: 'SIGN' })).toString(
    'base64url',
  )
  const payload = Buffer.from(JSON.stringify({ api_key: id, exp, timestamp })).toString('base64url')
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${payload}`)
    .digest('base64url')

  return `${header}.${payload}.${signature}`
}

function getClient(): OpenAI {
  const rawKey = process.env['GLM_API_KEY'] ?? ''
  const token = generateZhipuToken(rawKey)
  return new OpenAI({
    apiKey: token,
    baseURL: 'https://open.bigmodel.cn/api/paas/v4/',
  })
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
