import { describe, expect, it } from 'vitest'
import {
  ArquivoMuitoGrandeError,
  ExtracaoInvalidaError,
  TipoNaoSuportadoError,
  TranscricaoError,
} from '../erros'

describe('Erros de extração', () => {
  it('ArquivoMuitoGrandeError — expõe campos e name', () => {
    const err = new ArquivoMuitoGrandeError(25_000_000, 20_971_520)
    expect(err).toBeInstanceOf(Error)
    expect(err).toBeInstanceOf(ArquivoMuitoGrandeError)
    expect(err.name).toBe('ArquivoMuitoGrandeError')
    expect(err.tamanhoBytes).toBe(25_000_000)
    expect(err.limiteBytes).toBe(20_971_520)
    expect(err.message).toContain('20')
  })

  it('TipoNaoSuportadoError — expõe mimeType e name', () => {
    const err = new TipoNaoSuportadoError('application/msword')
    expect(err).toBeInstanceOf(TipoNaoSuportadoError)
    expect(err.name).toBe('TipoNaoSuportadoError')
    expect(err.mimeType).toBe('application/msword')
    expect(err.message).toContain('application/msword')
  })

  it('ExtracaoInvalidaError — expõe mensagemZod e outputCru', () => {
    const raw = { invalid: true }
    const err = new ExtracaoInvalidaError('campo itens obrigatório', raw)
    expect(err).toBeInstanceOf(ExtracaoInvalidaError)
    expect(err.name).toBe('ExtracaoInvalidaError')
    expect(err.mensagemZod).toBe('campo itens obrigatório')
    expect(err.outputCru).toBe(raw)
  })

  it('TranscricaoError — encapsula causa Error', () => {
    const causa = new Error('network timeout')
    const err = new TranscricaoError(causa)
    expect(err).toBeInstanceOf(TranscricaoError)
    expect(err.name).toBe('TranscricaoError')
    expect(err.causa).toBe(causa)
    expect(err.message).toContain('network timeout')
  })

  it('TranscricaoError — causa não-Error vira string', () => {
    const err = new TranscricaoError('erro desconhecido')
    expect(err.message).toContain('erro desconhecido')
  })
})
