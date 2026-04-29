import type { OrcamentoExtraido } from '@/lib/schemas/produto'

export type { OrcamentoExtraido }

export type TipoEntrada = 'pdf' | 'audio' | 'texto'

/**
 * Input para a função extrairOrcamento.
 * - Buffer: arquivo enviado com mimeType e nome para detecção de tipo.
 * - texto: string direta (sem necessidade de detecção ou transcodificação).
 */
export type EntradaExtracao =
  | { buffer: Buffer; mimeType: string; nomeArquivo: string }
  | { texto: string }

/** Metadados gerados durante a extração. */
export interface MetaExtracao {
  tipo_entrada: TipoEntrada
  modelo_usado: string
  duracao_ms: number
  /** Número de chamadas ao Claude (1 = sucesso direto, 2 = usou retry). */
  tentativas: 1 | 2
  /** true quando confidence_media < 0.6 — pedir revisão humana. */
  requires_review: boolean
  confidence_media: number
}

/** Resultado completo da extração, pronto para a UI de revisão. */
export interface ResultadoExtracao {
  orcamento: OrcamentoExtraido
  meta: MetaExtracao
}
