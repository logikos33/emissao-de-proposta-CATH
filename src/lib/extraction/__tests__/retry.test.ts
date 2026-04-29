import { beforeEach, describe, expect, it, vi } from 'vitest'
import { chamarClaudeExtracao } from '../claude'
import { ExtracaoInvalidaError } from '../erros'
import { extrairOrcamento } from '../extrair-orcamento'
import pdfFixture from './fixtures/pdf-tabelado.json'

vi.mock('../claude', () => ({ chamarClaudeExtracao: vi.fn() }))
vi.mock('../whisper', () => ({ transcreverAudio: vi.fn() }))

const mockClaude = vi.mocked(chamarClaudeExtracao)

beforeEach(() => {
  vi.clearAllMocks()
})

describe('retry Zod', () => {
  it('1ª falha + 2ª sucesso → tentativas = 2', async () => {
    mockClaude.mockResolvedValueOnce({ invalido: true }).mockResolvedValueOnce(pdfFixture)
    const result = await extrairOrcamento({ texto: 'orçamento qualquer' })
    expect(result.meta.tentativas).toBe(2)
    expect(mockClaude).toHaveBeenCalledTimes(2)
  })

  it('2ª chamada recebe o erro Zod da 1ª no prompt', async () => {
    mockClaude.mockResolvedValueOnce({ invalido: true }).mockResolvedValueOnce(pdfFixture)
    await extrairOrcamento({ texto: 'orçamento' })
    const segundoUserPrompt = (mockClaude.mock.calls[1] as [string, string])[1]
    expect(segundoUserPrompt).toContain('ATENÇÃO')
  })

  it('ambas as tentativas falham → lança ExtracaoInvalidaError', async () => {
    mockClaude
      .mockResolvedValueOnce({ invalido: true })
      .mockResolvedValueOnce({ tambem_invalido: true })
    await expect(extrairOrcamento({ texto: 'orçamento' })).rejects.toThrow(ExtracaoInvalidaError)
  })

  it('ExtracaoInvalidaError expõe o outputCru da 2ª tentativa', async () => {
    const outputFinal = { itens: 'errado' }
    mockClaude.mockResolvedValueOnce({ invalido: true }).mockResolvedValueOnce(outputFinal)
    try {
      await extrairOrcamento({ texto: 'test' })
    } catch (err) {
      expect(err).toBeInstanceOf(ExtracaoInvalidaError)
      expect((err as ExtracaoInvalidaError).outputCru).toBe(outputFinal)
    }
  })
})
