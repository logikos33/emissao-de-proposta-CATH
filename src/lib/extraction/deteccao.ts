import path from 'node:path'
import { ArquivoMuitoGrandeError, TipoNaoSuportadoError } from './erros'
import type { TipoEntrada } from './types'

const LIMITE_PDF_BYTES = 20 * 1024 * 1024
const LIMITE_AUDIO_BYTES = 25 * 1024 * 1024

const AUDIO_MIMES = new Set(['audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/webm', 'audio/x-m4a'])

const AUDIO_EXTS = new Set(['.mp3', '.mp4', '.mpeg', '.mpga', '.m4a', '.wav', '.webm'])

export function detectarTipo(
  mimeType: string,
  nomeArquivo: string,
  tamanhoBytes: number,
): TipoEntrada {
  const ext = path.extname(nomeArquivo).toLowerCase()

  if (mimeType === 'application/pdf' || ext === '.pdf') {
    if (tamanhoBytes > LIMITE_PDF_BYTES)
      throw new ArquivoMuitoGrandeError(tamanhoBytes, LIMITE_PDF_BYTES)
    return 'pdf'
  }

  if (AUDIO_MIMES.has(mimeType) || AUDIO_EXTS.has(ext)) {
    if (tamanhoBytes > LIMITE_AUDIO_BYTES)
      throw new ArquivoMuitoGrandeError(tamanhoBytes, LIMITE_AUDIO_BYTES)
    return 'audio'
  }

  if (mimeType === 'text/plain') return 'texto'

  throw new TipoNaoSuportadoError(mimeType)
}
