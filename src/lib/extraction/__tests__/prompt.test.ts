import { describe, expect, it } from 'vitest'
import { buildSystemPrompt, buildUserPrompt } from '../prompt'

describe('buildSystemPrompt', () => {
  it('snapshot — detecta drift no prompt', () => {
    expect(buildSystemPrompt()).toMatchSnapshot()
  })

  it('menciona registrar_orcamento', () => {
    expect(buildSystemPrompt()).toContain('registrar_orcamento')
  })

  it('menciona confidence', () => {
    expect(buildSystemPrompt()).toContain('confidence')
  })
})

describe('buildUserPrompt', () => {
  it('texto — inclui o conteúdo do texto', () => {
    const result = buildUserPrompt('texto', 'meu orçamento aqui')
    expect(result).toContain('meu orçamento aqui')
    expect(result).not.toContain('ATENÇÃO')
  })

  it('pdf — contém referência ao PDF', () => {
    const result = buildUserPrompt('pdf')
    expect(result).toContain('PDF')
  })

  it('audio — inclui a transcrição', () => {
    const result = buildUserPrompt('audio', 'transcrição do áudio aqui')
    expect(result).toContain('transcrição do áudio aqui')
  })

  it('com zodErro — inclui ATENÇÃO e o erro', () => {
    const result = buildUserPrompt('texto', 'orçamento', 'campo quantidade inválido')
    expect(result).toContain('ATENÇÃO')
    expect(result).toContain('campo quantidade inválido')
  })

  it('sem zodErro — não inclui ATENÇÃO', () => {
    expect(buildUserPrompt('audio', 'texto')).not.toContain('ATENÇÃO')
  })
})
