import OpenAI, { toFile } from 'openai'
import { TranscricaoError } from './erros'

let _client: OpenAI | undefined

function getClient(): OpenAI {
  if (!_client) _client = new OpenAI()
  return _client
}

export async function transcreverAudio(buffer: Buffer, nomeArquivo: string): Promise<string> {
  try {
    const file = await toFile(buffer, nomeArquivo)
    const result = await getClient().audio.transcriptions.create({
      file,
      model: 'whisper-1',
      language: 'pt',
    })
    return result.text
  } catch (err) {
    throw new TranscricaoError(err)
  }
}
