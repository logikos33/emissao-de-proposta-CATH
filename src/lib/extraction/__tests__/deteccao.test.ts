import { describe, expect, it } from 'vitest'
import { detectarTipo } from '../deteccao'
import { ArquivoMuitoGrandeError, TipoNaoSuportadoError } from '../erros'

const MB = 1024 * 1024

describe('detectarTipo', () => {
  describe('PDF', () => {
    it('detecta PDF por mimeType', () => {
      expect(detectarTipo('application/pdf', 'orcamento.pdf', MB)).toBe('pdf')
    })

    it('detecta PDF por extensão .pdf', () => {
      expect(detectarTipo('application/octet-stream', 'doc.pdf', MB)).toBe('pdf')
    })

    it('lança ArquivoMuitoGrandeError para PDF > 20MB', () => {
      expect(() => detectarTipo('application/pdf', 'grande.pdf', 21 * MB)).toThrow(
        ArquivoMuitoGrandeError,
      )
    })

    it('ArquivoMuitoGrandeError expõe limite correto (20MB)', () => {
      try {
        detectarTipo('application/pdf', 'grande.pdf', 21 * MB)
      } catch (err) {
        expect(err).toBeInstanceOf(ArquivoMuitoGrandeError)
        expect((err as ArquivoMuitoGrandeError).limiteBytes).toBe(20 * MB)
        expect((err as ArquivoMuitoGrandeError).tamanhoBytes).toBe(21 * MB)
      }
    })
  })

  describe('Áudio', () => {
    it('detecta audio/mpeg por mimeType', () => {
      expect(detectarTipo('audio/mpeg', 'voice.mp3', MB)).toBe('audio')
    })

    it('detecta audio/wav por mimeType', () => {
      expect(detectarTipo('audio/wav', 'rec.wav', MB)).toBe('audio')
    })

    it('detecta audio/webm por mimeType', () => {
      expect(detectarTipo('audio/webm', 'clip.webm', 5 * MB)).toBe('audio')
    })

    it('detecta áudio por extensão .m4a', () => {
      expect(detectarTipo('application/octet-stream', 'orcamento.m4a', MB)).toBe('audio')
    })

    it('lança ArquivoMuitoGrandeError para áudio > 25MB', () => {
      expect(() => detectarTipo('audio/mpeg', 'longo.mp3', 26 * MB)).toThrow(
        ArquivoMuitoGrandeError,
      )
    })

    it('ArquivoMuitoGrandeError expõe limite correto (25MB)', () => {
      try {
        detectarTipo('audio/mpeg', 'longo.mp3', 26 * MB)
      } catch (err) {
        expect(err).toBeInstanceOf(ArquivoMuitoGrandeError)
        expect((err as ArquivoMuitoGrandeError).limiteBytes).toBe(25 * MB)
      }
    })
  })

  describe('Texto', () => {
    it('detecta text/plain', () => {
      expect(detectarTipo('text/plain', 'orcamento.txt', 1024)).toBe('texto')
    })
  })

  describe('Tipo desconhecido', () => {
    it('lança TipoNaoSuportadoError para mime desconhecido', () => {
      expect(() => detectarTipo('application/msword', 'doc.docx', 1024)).toThrow(
        TipoNaoSuportadoError,
      )
    })

    it('expõe o mimeType no TipoNaoSuportadoError', () => {
      try {
        detectarTipo('video/mp4', 'video.mp4', 1024)
      } catch (err) {
        expect(err).toBeInstanceOf(TipoNaoSuportadoError)
        expect((err as TipoNaoSuportadoError).mimeType).toBe('video/mp4')
      }
    })
  })
})
