import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import {
  ArquivoMuitoGrandeError,
  ExtracaoInvalidaError,
  TipoNaoSuportadoError,
  TranscricaoError,
  extrairOrcamento,
} from '@/lib/extraction'
import type { EntradaExtracao } from '@/lib/extraction'

export async function POST(request: NextRequest): Promise<NextResponse> {
  const contentType = request.headers.get('content-type') ?? ''

  let entrada: EntradaExtracao

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData()
    const file = formData.get('file')

    if (file instanceof File) {
      const buffer = Buffer.from(await file.arrayBuffer())
      entrada = { buffer, mimeType: file.type, nomeArquivo: file.name }
    } else {
      const text = formData.get('text')
      if (typeof text !== 'string' || !text.trim()) {
        return NextResponse.json(
          { error: 'Envie um arquivo (file) ou texto (text).' },
          { status: 400 },
        )
      }
      entrada = { texto: text }
    }
  } else {
    const body = (await request.json()) as { text?: unknown }
    if (typeof body.text !== 'string' || !body.text.trim()) {
      return NextResponse.json(
        { error: 'Envie um arquivo multipart ou JSON com campo "text".' },
        { status: 400 },
      )
    }
    entrada = { texto: body.text }
  }

  try {
    const resultado = await extrairOrcamento(entrada)
    return NextResponse.json(resultado)
  } catch (err) {
    if (err instanceof ArquivoMuitoGrandeError) {
      return NextResponse.json({ error: err.message }, { status: 413 })
    }
    if (err instanceof TipoNaoSuportadoError) {
      return NextResponse.json({ error: err.message }, { status: 415 })
    }
    if (err instanceof ExtracaoInvalidaError || err instanceof TranscricaoError) {
      return NextResponse.json({ error: err.message }, { status: 422 })
    }
    throw err
  }
}
