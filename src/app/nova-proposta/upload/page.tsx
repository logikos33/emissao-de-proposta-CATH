'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { UploadArea } from '@/components/nova-proposta/upload-area'
import { AudioRecorder } from '@/components/nova-proposta/audio-recorder'
import { extractOrcamento } from '@/lib/api/extract-client'
import { usePropostaStore } from '@/lib/stores/proposta.store'

export default function UploadPage() {
  const router = useRouter()
  const { extracao, iniciarExtracao, concluirExtracao, falharExtracao } = usePropostaStore()
  const [texto, setTexto] = useState('')
  const isLoading = extracao.status === 'loading'

  async function processar(input: Parameters<typeof extractOrcamento>[0]) {
    iniciarExtracao()
    const result = await extractOrcamento(input)
    if (result.ok) {
      concluirExtracao(result.data)
      router.push('/nova-proposta/revisao')
    } else {
      falharExtracao(result.error)
      toast.error(result.error)
    }
  }

  function handleFile(file: File) {
    processar({ type: 'arquivo', file })
  }

  function handleSubmitTexto() {
    if (!texto.trim()) {
      toast.warning('Digite o texto do orçamento antes de continuar.')
      return
    }
    processar({ type: 'texto', texto })
  }

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">Nova proposta</h1>
        <p className="text-sm text-slate-500">
          Envie o orçamento do fornecedor para extrair os itens automaticamente.
        </p>
      </div>

      <section aria-label="Upload de arquivo">
        <UploadArea onFile={handleFile} disabled={isLoading} />
      </section>

      <div className="flex items-center gap-3">
        <hr className="flex-1 border-slate-200" />
        <span className="text-xs text-slate-400 font-medium">ou grave um áudio</span>
        <hr className="flex-1 border-slate-200" />
      </div>

      <section aria-label="Gravação de áudio" className="flex justify-center">
        <AudioRecorder onRecording={handleFile} disabled={isLoading} />
      </section>

      <div className="flex items-center gap-3">
        <hr className="flex-1 border-slate-200" />
        <span className="text-xs text-slate-400 font-medium">ou cole o texto</span>
        <hr className="flex-1 border-slate-200" />
      </div>

      <section aria-label="Texto do orçamento" className="space-y-3">
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          disabled={isLoading}
          placeholder="Cole aqui o texto do orçamento (email, WhatsApp, etc.)"
          rows={5}
          className="w-full rounded-lg border border-slate-200 p-3 text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-50 resize-none"
          style={{ fontSize: '16px' }}
          aria-label="Texto do orçamento"
        />
        <Button
          onClick={handleSubmitTexto}
          disabled={isLoading || !texto.trim()}
          className="w-full min-h-[44px]"
        >
          Extrair itens
        </Button>
      </section>

      {isLoading && (
        <p className="text-center text-sm text-slate-500 animate-pulse" aria-live="polite">
          Analisando orçamento com IA…
        </p>
      )}
    </div>
  )
}
