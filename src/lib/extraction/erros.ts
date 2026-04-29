/** Arquivo enviado excede o limite de tamanho aceito. */
export class ArquivoMuitoGrandeError extends Error {
  readonly tamanhoBytes: number
  readonly limiteBytes: number

  constructor(tamanhoBytes: number, limiteBytes: number) {
    super(
      `Arquivo muito grande: ${tamanhoBytes} bytes (limite: ${limiteBytes} bytes / ${Math.round(limiteBytes / 1024 / 1024)} MB)`,
    )
    this.name = 'ArquivoMuitoGrandeError'
    this.tamanhoBytes = tamanhoBytes
    this.limiteBytes = limiteBytes
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

/** MIME type ou extensão não suportados pelo pipeline de extração. */
export class TipoNaoSuportadoError extends Error {
  readonly mimeType: string

  constructor(mimeType: string) {
    super(
      `Tipo de arquivo não suportado: "${mimeType}". Aceitos: application/pdf, audio/*, text/plain`,
    )
    this.name = 'TipoNaoSuportadoError'
    this.mimeType = mimeType
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

/**
 * Extração falhou após 1 retry: o output do Claude não passou na validação Zod em nenhuma tentativa.
 * O `outputCru` contém a última resposta recebida para diagnóstico.
 */
export class ExtracaoInvalidaError extends Error {
  readonly mensagemZod: string
  readonly outputCru: unknown

  constructor(mensagemZod: string, outputCru: unknown) {
    super(`Extração inválida após retry — falha de validação: ${mensagemZod}`)
    this.name = 'ExtracaoInvalidaError'
    this.mensagemZod = mensagemZod
    this.outputCru = outputCru
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

/** Falha ao transcrever áudio via Whisper (erro de API ou formato inválido). */
export class TranscricaoError extends Error {
  readonly causa: unknown

  constructor(causa: unknown) {
    const msg = causa instanceof Error ? causa.message : String(causa)
    super(`Falha na transcrição de áudio via Whisper: ${msg}`)
    this.name = 'TranscricaoError'
    this.causa = causa
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
