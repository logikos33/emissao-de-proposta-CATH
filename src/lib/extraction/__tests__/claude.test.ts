import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { chamarClaudeExtracao } from '../claude'

const { mockCreate } = vi.hoisted(() => ({
  mockCreate: vi.fn(),
}))

vi.mock('openai', () => ({
  default: vi.fn(function () {
    return { chat: { completions: { create: mockCreate } } }
  }),
}))

const toolInput = {
  fornecedor_principal: 'Fornecedor X',
  data_orcamento: null,
  validade: null,
  itens: [
    {
      nome: 'Produto',
      descricao: null,
      quantidade: 1,
      unidade: 'un',
      valor_unitario: 10,
      fornecedor: null,
      observacao: null,
      confidence: 0.9,
    },
  ],
  observacoes_gerais: null,
}

const toolCallResponse = {
  choices: [
    {
      message: {
        tool_calls: [
          {
            type: 'function',
            function: {
              name: 'registrar_orcamento',
              arguments: JSON.stringify(toolInput),
            },
          },
        ],
      },
    },
  ],
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.useFakeTimers()
  process.env['GLM_API_KEY'] = 'testid.testsecret'
})

afterEach(() => {
  vi.useRealTimers()
})

describe('chamarClaudeExtracao', () => {
  it('retorna o input do tool_call em chamada bem-sucedida', async () => {
    mockCreate.mockResolvedValueOnce(toolCallResponse)
    const result = await chamarClaudeExtracao('system', 'user')
    expect(result).toEqual(toolInput)
  })

  it('passa texto como content quando sem pdfBuffer', async () => {
    mockCreate.mockResolvedValueOnce(toolCallResponse)
    await chamarClaudeExtracao('system', 'meu prompt')
    const call = mockCreate.mock.calls[0] as [
      { messages: Array<{ role: string; content: unknown }> },
    ]
    const userMsg = call[0].messages.find((m) => m.role === 'user')
    expect(Array.isArray(userMsg?.content)).toBe(true)
    const parts = userMsg?.content as Array<{ type: string; text?: string }>
    expect(parts[0]?.type).toBe('text')
    expect(parts[0]?.text).toBe('meu prompt')
  })

  it('inclui nota de PDF quando pdfBuffer fornecido', async () => {
    mockCreate.mockResolvedValueOnce(toolCallResponse)
    await chamarClaudeExtracao('system', 'user', Buffer.from('%PDF-1.4'))
    const call = mockCreate.mock.calls[0] as [
      { messages: Array<{ role: string; content: unknown }> },
    ]
    const userMsg = call[0].messages.find((m) => m.role === 'user')
    const parts = userMsg?.content as Array<{ type: string; text?: string }>
    expect(parts[0]?.text).toContain('PDF')
  })

  it('lança erro quando resposta não tem tool_call', async () => {
    mockCreate.mockResolvedValue({ choices: [{ message: { tool_calls: [] } }] })
    const promise = chamarClaudeExtracao('system', 'user')
    const assertion = expect(promise).rejects.toThrow('Nenhum tool_call')
    await vi.runAllTimersAsync()
    await assertion
    expect(mockCreate).toHaveBeenCalledTimes(3)
  })

  it('retenta 3x em erro de API e lança o último erro', async () => {
    mockCreate.mockRejectedValue(new Error('rate limit'))
    const promise = chamarClaudeExtracao('system', 'user')
    const assertion = expect(promise).rejects.toThrow('rate limit')
    await vi.runAllTimersAsync()
    await assertion
    expect(mockCreate).toHaveBeenCalledTimes(3)
  })

  it('sucede na 2ª tentativa após falha de API', async () => {
    mockCreate.mockRejectedValueOnce(new Error('timeout')).mockResolvedValueOnce(toolCallResponse)
    const promise = chamarClaudeExtracao('system', 'user')
    const assertion = promise.then((r) => {
      expect(r).toEqual(toolInput)
    })
    await vi.runAllTimersAsync()
    await assertion
    expect(mockCreate).toHaveBeenCalledTimes(2)
  })
})
