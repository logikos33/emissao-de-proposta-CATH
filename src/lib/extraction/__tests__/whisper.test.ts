import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TranscricaoError } from '../erros'
import { transcreverAudio } from '../whisper'

const { mockTranscribe, mockToFile } = vi.hoisted(() => ({
  mockTranscribe: vi.fn(),
  mockToFile: vi.fn(),
}))

vi.mock('openai', () => ({
  default: vi.fn(function () {
    return { audio: { transcriptions: { create: mockTranscribe } } }
  }),
  toFile: mockToFile,
}))

const fakeFile = new File([''], 'test.mp3')

beforeEach(() => {
  vi.clearAllMocks()
  mockToFile.mockResolvedValue(fakeFile)
})

describe('transcreverAudio', () => {
  it('retorna o texto da transcrição', async () => {
    mockTranscribe.mockResolvedValueOnce({ text: 'transcrição do áudio' })
    const result = await transcreverAudio(Buffer.from('audio data'), 'voice.mp3')
    expect(result).toBe('transcrição do áudio')
  })

  it('chama Whisper com model whisper-1 e language pt', async () => {
    mockTranscribe.mockResolvedValueOnce({ text: 'ok' })
    await transcreverAudio(Buffer.from('audio'), 'rec.wav')
    expect(mockTranscribe).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'whisper-1', language: 'pt' }),
    )
  })

  it('lança TranscricaoError em caso de falha da API', async () => {
    mockTranscribe.mockRejectedValueOnce(new Error('API unavailable'))
    await expect(transcreverAudio(Buffer.from('audio'), 'broken.mp3')).rejects.toThrow(
      TranscricaoError,
    )
  })

  it('TranscricaoError encapsula a mensagem original', async () => {
    mockTranscribe.mockRejectedValueOnce(new Error('timeout'))
    const err = await transcreverAudio(Buffer.from('audio'), 'file.mp3').catch((e) => e)
    expect(err).toBeInstanceOf(TranscricaoError)
    expect((err as TranscricaoError).message).toContain('timeout')
  })
})
