import { beforeEach, describe, expect, it, vi } from 'vitest'
import { extractOrcamento } from '@/lib/api/extract-client'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

beforeEach(() => {
  vi.clearAllMocks()
})

function makeResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  }
}

describe('extractOrcamento — texto', () => {
  it('envia POST com Content-Type JSON', async () => {
    mockFetch.mockResolvedValueOnce(makeResponse({ orcamento: { itens: [] }, meta: {} }))
    await extractOrcamento({ type: 'texto', texto: 'parafuso' })
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/extract',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      }),
    )
  })

  it('inclui o texto no body JSON', async () => {
    mockFetch.mockResolvedValueOnce(makeResponse({ orcamento: { itens: [] }, meta: {} }))
    await extractOrcamento({ type: 'texto', texto: 'parafuso M6' })
    const call = mockFetch.mock.calls[0] as [string, RequestInit]
    const body = JSON.parse(call[1].body as string) as { text: string }
    expect(body.text).toBe('parafuso M6')
  })

  it('retorna ok:true com a data da resposta', async () => {
    const data = { orcamento: { itens: [], fornecedor_principal: null }, meta: {} }
    mockFetch.mockResolvedValueOnce(makeResponse(data))
    const result = await extractOrcamento({ type: 'texto', texto: 'x' })
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.data).toEqual(data)
  })
})

describe('extractOrcamento — arquivo', () => {
  it('envia POST com FormData (sem Content-Type header explícito)', async () => {
    mockFetch.mockResolvedValueOnce(makeResponse({ orcamento: { itens: [] }, meta: {} }))
    const file = new File(['pdf'], 'orcamento.pdf', { type: 'application/pdf' })
    await extractOrcamento({ type: 'arquivo', file })
    const call = mockFetch.mock.calls[0] as [string, RequestInit]
    expect(call[1].body).toBeInstanceOf(FormData)
  })
})

describe('extractOrcamento — erros', () => {
  it('retorna ok:false com status 422 e mensagem de erro', async () => {
    mockFetch.mockResolvedValueOnce(makeResponse({ error: 'Extração inválida' }, 422))
    const result = await extractOrcamento({ type: 'texto', texto: 'x' })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.status).toBe(422)
      expect(result.error).toBe('Extração inválida')
    }
  })

  it('retorna ok:false em caso de falha de rede', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))
    const result = await extractOrcamento({ type: 'texto', texto: 'x' })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.status).toBe(0)
  })
})
