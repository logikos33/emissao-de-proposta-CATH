import { OrcamentoExtraidoSchema } from '@/lib/schemas/produto'
import { chamarClaudeExtracao } from './claude'
import { detectarTipo } from './deteccao'
import { ExtracaoInvalidaError } from './erros'
import { buildSystemPrompt, buildUserPrompt } from './prompt'
import type {
  EntradaExtracao,
  MetaExtracao,
  OrcamentoExtraido,
  ResultadoExtracao,
  TipoEntrada,
} from './types'
import { transcreverAudio } from './whisper'

export async function extrairOrcamento(entrada: EntradaExtracao): Promise<ResultadoExtracao> {
  const inicio = Date.now()

  let tipoEntrada: TipoEntrada
  let pdfBuffer: Buffer | undefined
  let textoEntrada: string | undefined

  if ('texto' in entrada) {
    tipoEntrada = 'texto'
    textoEntrada = entrada.texto
  } else {
    tipoEntrada = detectarTipo(entrada.mimeType, entrada.nomeArquivo, entrada.buffer.length)
    if (tipoEntrada === 'pdf') {
      pdfBuffer = entrada.buffer
    } else {
      textoEntrada = await transcreverAudio(entrada.buffer, entrada.nomeArquivo)
    }
  }

  const systemPrompt = buildSystemPrompt()
  const modelo_usado = process.env['ANTHROPIC_MODEL'] ?? 'claude-sonnet-4-6'

  const outputCru1 = await chamarClaudeExtracao(
    systemPrompt,
    buildUserPrompt(tipoEntrada, textoEntrada),
    pdfBuffer,
  )
  const parse1 = OrcamentoExtraidoSchema.safeParse(outputCru1)

  let tentativas: 1 | 2 = 1
  let orcamento: OrcamentoExtraido

  if (parse1.success) {
    orcamento = parse1.data
  } else {
    tentativas = 2
    const outputCru2 = await chamarClaudeExtracao(
      systemPrompt,
      buildUserPrompt(tipoEntrada, textoEntrada, parse1.error.message),
      pdfBuffer,
    )
    const parse2 = OrcamentoExtraidoSchema.safeParse(outputCru2)
    if (!parse2.success) throw new ExtracaoInvalidaError(parse2.error.message, outputCru2)
    orcamento = parse2.data
  }

  const confidence_media =
    orcamento.itens.reduce((sum, item) => sum + item.confidence, 0) / orcamento.itens.length

  const meta: MetaExtracao = {
    tipo_entrada: tipoEntrada,
    modelo_usado,
    duracao_ms: Date.now() - inicio,
    tentativas,
    confidence_media,
    requires_review: confidence_media < 0.6,
  }

  return { orcamento, meta }
}
