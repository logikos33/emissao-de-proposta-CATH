import type { ResultadoExtracao } from '@/lib/extraction/types'

type ExtractInput = { type: 'texto'; texto: string } | { type: 'arquivo'; file: File }

type ExtractResult =
  | { ok: true; data: ResultadoExtracao }
  | { ok: false; error: string; status: number }

export async function extractOrcamento(input: ExtractInput): Promise<ExtractResult> {
  try {
    let response: Response

    if (input.type === 'texto') {
      response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input.texto }),
      })
    } else {
      const form = new FormData()
      form.append('file', input.file)
      response = await fetch('/api/extract', {
        method: 'POST',
        body: form,
      })
    }

    if (!response.ok) {
      const body = await response.json().catch(() => ({ error: 'Erro desconhecido' }))
      return {
        ok: false,
        error: (body as { error?: string }).error ?? `HTTP ${response.status}`,
        status: response.status,
      }
    }

    const data = (await response.json()) as ResultadoExtracao
    return { ok: true, data }
  } catch {
    return { ok: false, error: 'Falha de conexão. Verifique sua internet.', status: 0 }
  }
}
