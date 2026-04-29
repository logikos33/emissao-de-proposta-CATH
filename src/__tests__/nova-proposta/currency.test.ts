import { describe, expect, it } from 'vitest'
import { formatBRL, parseBRL } from '@/lib/utils/currency'

describe('formatBRL', () => {
  it('formata valor inteiro', () => {
    expect(formatBRL(100)).toBe('R$\u00a0100,00')
  })

  it('formata valor com centavos', () => {
    expect(formatBRL(1234.56)).toBe('R$\u00a01.234,56')
  })

  it('formata zero', () => {
    expect(formatBRL(0)).toBe('R$\u00a00,00')
  })

  it('formata valor negativo', () => {
    expect(formatBRL(-50)).toContain('50,00')
  })
})

describe('parseBRL', () => {
  it('parseia string com R$', () => {
    expect(parseBRL('R$ 1.234,56')).toBeCloseTo(1234.56)
  })

  it('parseia string sem símbolo', () => {
    expect(parseBRL('1.234,56')).toBeCloseTo(1234.56)
  })

  it('parseia zero', () => {
    expect(parseBRL('0,00')).toBe(0)
  })

  it('parseia string vazia como 0', () => {
    expect(parseBRL('')).toBe(0)
  })

  it('retorna 0 para entrada inválida', () => {
    expect(parseBRL('abc')).toBe(0)
  })

  it('roundtrip: parseBRL(formatBRL(x)) ≈ x', () => {
    const valor = 999.99
    expect(parseBRL(formatBRL(valor))).toBeCloseTo(valor)
  })
})
