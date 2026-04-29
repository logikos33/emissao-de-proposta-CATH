# Integração OpenAI Whisper — Transcrição de Áudio

## Visão geral

Quando o colaborador grava um áudio do fornecedor ditando o orçamento, enviamos o arquivo para Whisper antes de passar para Claude. Whisper retorna transcrição em texto que segue o fluxo normal de extração.

## Por que Whisper e não Claude?

Claude API não suporta input de áudio diretamente. Whisper é especializado em transcrição e mais barato por minuto de áudio.

## Dependência

```bash
pnpm add openai
```

## Formatos suportados

`mp3`, `mp4`, `mpeg`, `mpga`, `m4a`, `wav`, `webm`

Limite: **25 MB** por arquivo. Para gravações longas, considerar chunking (PRP futuro).

## Implementação

```typescript
// src/lib/openai/whisper.ts
import OpenAI from 'openai'
import { Readable } from 'stream'

const openai = new OpenAI({ apiKey: process.env['OPENAI_API_KEY'] })

/**
 * Transcreve um arquivo de áudio usando OpenAI Whisper.
 * Retorna o texto transcrito em português brasileiro.
 *
 * @param audioBuffer - Buffer do arquivo de áudio
 * @param fileName - Nome do arquivo com extensão (ex: "orcamento.m4a")
 */
export async function transcribeAudio(audioBuffer: Buffer, fileName: string): Promise<string> {
  const file = new File([audioBuffer], fileName)

  const transcription = await openai.audio.transcriptions.create({
    file,
    model: 'whisper-1',
    language: 'pt', // Português BR — melhora precisão e reduz custo
    response_format: 'text',
  })

  return transcription
}
```

## Dicas de qualidade

- `language: 'pt'` melhora precisão para orçamentos em português e reduz tokens de detecção
- Áudios muito ruidosos podem gerar transcrições imprecisas — Claude vai lidar com o ruído via prompt
- O texto transcrito vai direto para o prompt de extração do Claude (ver `prompts/extract-budget-v1.md`)
