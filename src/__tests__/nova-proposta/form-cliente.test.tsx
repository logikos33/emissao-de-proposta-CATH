// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { FormCliente } from '@/components/nova-proposta/form-cliente'
import { ClienteSchema } from '@/lib/schemas/proposta-form'
import type { ClienteForm } from '@/lib/schemas/proposta-form'

const defaultValues: ClienteForm = { nome: '', empresa: '', telefone: '', email: '' }

// Render tests — verifica estrutura do componente
describe('FormCliente — render', () => {
  it('renderiza o campo Nome', () => {
    render(<FormCliente defaultValues={defaultValues} onChange={vi.fn()} />)
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument()
  })

  it('renderiza campos Empresa, Telefone e Email', () => {
    render(<FormCliente defaultValues={defaultValues} onChange={vi.fn()} />)
    expect(screen.getByLabelText(/empresa/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })
})

// Schema tests — validação Zod (comportamento real da validação)
describe('ClienteSchema — validação', () => {
  it('rejeita nome vazio', () => {
    const result = ClienteSchema.safeParse({ nome: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const nomeIssue = result.error.issues.find((i) => i.path.includes('nome'))
      expect(nomeIssue?.message).toBe('Nome obrigatório')
    }
  })

  it('rejeita email com formato inválido', () => {
    const result = ClienteSchema.safeParse({ nome: 'João', email: 'invalido' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const emailIssue = result.error.issues.find((i) => i.path.includes('email'))
      expect(emailIssue?.message).toBe('Email inválido')
    }
  })

  it('aceita email vazio (campo opcional)', () => {
    const result = ClienteSchema.safeParse({ nome: 'João', email: '' })
    expect(result.success).toBe(true)
  })

  it('aceita dados válidos completos', () => {
    const result = ClienteSchema.safeParse({
      nome: 'João Silva',
      empresa: 'ACME Ltda',
      telefone: '(11) 99999-9999',
      email: 'joao@acme.com',
    })
    expect(result.success).toBe(true)
  })
})
