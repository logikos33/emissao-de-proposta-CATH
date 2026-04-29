import { describe, expect, it } from 'vitest'
import { roundBRL } from '../round'

describe('roundBRL', () => {
  describe('casos half-up (0.005 → 0.01)', () => {
    it('arredonda 0.005 para 0.01', () => {
      expect(roundBRL(0.005)).toBe(0.01)
    })

    it('arredonda 0.004 para 0.00', () => {
      expect(roundBRL(0.004)).toBe(0)
    })

    it('arredonda 1.005 para 1.01 (caso clássico de erro float)', () => {
      // 1.005 * 100 = 100.50000000000001 em JS → Math.round = 101 → correto
      expect(roundBRL(1.005)).toBe(1.01)
    })

    it('arredonda 0.125 para 0.13', () => {
      expect(roundBRL(0.125)).toBe(0.13)
    })

    it('arredonda 123.456 para 123.46', () => {
      expect(roundBRL(123.456)).toBe(123.46)
    })
  })

  describe('zero', () => {
    it('retorna 0 para input 0', () => {
      expect(roundBRL(0)).toBe(0)
    })
  })

  describe('negativos (half-up simétrico — longe do zero)', () => {
    it('arredonda -0.005 para -0.01', () => {
      expect(roundBRL(-0.005)).toBe(-0.01)
    })

    it('arredonda -0.004 para 0.00', () => {
      expect(roundBRL(-0.004)).toBe(0)
    })
  })

  describe('valores já arredondados', () => {
    it('preserva inteiros', () => {
      expect(roundBRL(100)).toBe(100)
    })

    it('preserva valores com 2 casas decimais', () => {
      expect(roundBRL(1.5)).toBe(1.5)
      expect(roundBRL(99.99)).toBe(99.99)
    })
  })
})
