import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { chamarClaudeExtracao } from '../claude'

const { mockCreate } = vi.hoisted(() => ({
  mockCreate: vi.fn(),
}))

vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn(function () {
    return { messages: { create: mockCreate } }
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

const toolUseResponse = {
  content: [
    { type: 'tool_use' as const, id: 'tu1', name: 'registrar_orcamento', input: toolInput },
  ],
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('chamarClaudeExtracao', () => {
  it('retorna o input do tool_use em chamada bem-sucedida', async () => {
    mockCreate.mockResolvedValueOnce(toolUseResponse)
    const result = await chamarClaudeExtracao('system', 'user')
    expect(result).toBe(toolInput)
  })

  it('passa texto como content quando sem pdfBuffer', async () => {
    mockCreate.mockResolvedValueOnce(toolUseResponse)
    await chamarClaudeExtracao('system', 'meu prompt')
    const call = mockCreate.mock.calls[0] as [{ messages: Array<{ content: unknown }> }]
    expect(call[0].messages[0]?.content).toBe('meu prompt')
  })

  it('passa document block quando pdfBuffer fornecido', async () => {
    mockCreate.mockResolvedValueOnce(toolUseResponse)
    await chamarClaudeExtracao('system', 'user', Buffer.from('%PDF-1.4'))
    const call = mockCreate.mock.calls[0] as [{ messages: Array<{ content: unknown }> }]
    const content = call[0].messages[0]?.content
    expect(Array.isArray(content)).toBe(true)
    if (Array.isArray(content)) {
      expect((content[0] as { type: string }).type).toBe('document')
    }
  })

  it('lança erro quando resposta não tem tool_use block', async () => {
    mockCreate.mockResolvedValue({ content: [{ type: 'text', text: 'oops' }] })
    const promise = chamarClaudeExtracao('system', 'user')
    const assertion = expect(promise).rejects.toThrow('Nenhum tool_use block')
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
    mockCreate.mockRejectedValueOnce(new Error('timeout')).mockResolvedValueOnce(toolUseResponse)
    const promise = chamarClaudeExtracao('system', 'user')
    const assertion = promise.then((r) => {
      expect(r).toBe(toolInput)
    })
    await vi.runAllTimersAsync()
    await assertion
    expect(mockCreate).toHaveBeenCalledTimes(2)
  })
})
