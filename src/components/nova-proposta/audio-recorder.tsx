'use client'

import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface AudioRecorderProps {
  onRecording: (file: File) => void
  disabled?: boolean
}

type RecorderState = 'idle' | 'recording' | 'done'

export function AudioRecorder({ onRecording, disabled }: AudioRecorderProps) {
  const [state, setState] = useState<RecorderState>('idle')
  const [segundos, setSegundos] = useState(0)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  async function iniciarGravacao() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
    chunksRef.current = []

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }

    recorder.onstop = () => {
      stream.getTracks().forEach((t) => t.stop())
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
      const file = new File([blob], `gravacao-${Date.now()}.webm`, { type: 'audio/webm' })
      onRecording(file)
      setState('done')
    }

    recorder.start()
    recorderRef.current = recorder
    setState('recording')
    setSegundos(0)
    timerRef.current = setInterval(() => setSegundos((s) => s + 1), 1000)
  }

  function pararGravacao() {
    recorderRef.current?.stop()
    if (timerRef.current) clearInterval(timerRef.current)
  }

  function formatarTempo(s: number) {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  if (state === 'done') {
    return (
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-2xl" aria-hidden>
          🎙️
        </span>
        <p className="text-sm text-slate-600 font-medium">Áudio gravado</p>
        <button
          onClick={() => {
            setState('idle')
            setSegundos(0)
          }}
          className="text-xs text-slate-500 underline"
        >
          Gravar novamente
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {state === 'recording' && (
        <p className="text-sm font-mono text-red-600 font-semibold" aria-live="polite">
          ● {formatarTempo(segundos)}
        </p>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={state === 'idle' ? iniciarGravacao : pararGravacao}
        aria-label={state === 'idle' ? 'Iniciar gravação de áudio' : 'Parar gravação'}
        className={cn(
          'flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors',
          state === 'idle'
            ? 'bg-red-600 text-white hover:bg-red-700'
            : 'bg-slate-800 text-white hover:bg-slate-900',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      >
        {state === 'idle' ? '🎙️ Gravar áudio' : '⏹ Parar'}
      </button>
    </div>
  )
}
