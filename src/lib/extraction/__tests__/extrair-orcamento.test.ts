import { beforeEach, describe, expect, it, vi } from 'vitest'
import { chamarClaudeExtracao } from '../claude'
import { transcreverAudio } from '../whisper'
import { extrairOrcamento } from '../extrair-orcamento'
import audioFixture from './fixtures/audio-falado.json'
import pdfFixture from './fixtures/pdf-tabelado.json'
import textoFixture from './fixtures/texto-solto.json'

vi.mock('../claude', () => ({ chamarClaudeExtracao: vi.fn() }))
vi.mock('../whisper', () => ({
  transcreverAudio: vi.fn().mockResolvedValue('transcrição mockada'),
}))

const mockClaude = vi.mocked(chamarClaudeExtracao)
const mockWhisper = vi.mocked(transcreverAudio)

beforeEach(() => {
  vi.clearAllMocks()
  mockWhisper.mockResolvedValue('transcrição mockada')
})

describe('extrairOrcamento', () => {
  describe('happy path — texto', () => {
    it('retorna ResultadoExtracao com tipo_entrada texto', async () => {
      mockClaude.mockResolvedValueOnce(textoFixture)
      const result = await extrairOrcamento({ texto: 'parafuso M6 x 100 un a R$0,45' })
      expect(result.orcamento.itens).toHaveLength(3)
      expect(result.meta.tipo_entrada).toBe('texto')
      expect(result.meta.tentativas).toBe(1)
      expect(typeof result.meta.duracao_ms).toBe('number')
    })
  })

  describe('happy path — áudio', () => {
    it('transcreve e retorna ResultadoExtracao com tipo_entrada audio', async () => {
      mockClaude.mockResolvedValueOnce(audioFixture)
      const result = await extrairOrcamento({
        buffer: Buffer.from('fake-audio'),
        mimeType: 'audio/mpeg',
        nomeArquivo: 'orcamento.mp3',
      })
      expect(result.meta.tipo_entrada).toBe('audio')
      expect(result.meta.tentativas).toBe(1)
      expect(result.orcamento.itens).toHaveLength(2)
      expect(mockWhisper).toHaveBeenCalledOnce()
    })
  })

  describe('happy path — PDF', () => {
    it('retorna ResultadoExtracao com tipo_entrada pdf', async () => {
      mockClaude.mockResolvedValueOnce(pdfFixture)
      const result = await extrairOrcamento({
        buffer: Buffer.from('%PDF-1.4'),
        mimeType: 'application/pdf',
        nomeArquivo: 'orcamento.pdf',
      })
      expect(result.meta.tipo_entrada).toBe('pdf')
      expect(result.orcamento.itens).toHaveLength(3)
      expect(mockWhisper).not.toHaveBeenCalled()
    })
  })

  describe('confidence_media e requires_review', () => {
    it('calcula confidence_media como média dos itens', async () => {
      mockClaude.mockResolvedValueOnce(pdfFixture)
      const result = await extrairOrcamento({ texto: 'qualquer coisa' })
      const esperado =
        pdfFixture.itens.reduce((s, i) => s + i.confidence, 0) / pdfFixture.itens.length
      expect(result.meta.confidence_media).toBeCloseTo(esperado, 5)
    })

    it('requires_review = false quando confidence_media >= 0.6', async () => {
      mockClaude.mockResolvedValueOnce(pdfFixture)
      const result = await extrairOrcamento({ texto: 'qualquer' })
      expect(result.meta.requires_review).toBe(false)
    })

    it('requires_review = true quando confidence_media < 0.6', async () => {
      const baixaConfianca = {
        ...textoFixture,
        itens: textoFixture.itens.map((i) => ({ ...i, confidence: 0.4 })),
      }
      mockClaude.mockResolvedValueOnce(baixaConfianca)
      const result = await extrairOrcamento({ texto: 'qualquer' })
      expect(result.meta.requires_review).toBe(true)
    })
  })
})
