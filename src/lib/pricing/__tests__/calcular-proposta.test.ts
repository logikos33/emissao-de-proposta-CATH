import { describe, expect, it } from 'vitest'
// Importa do index para exercitar a API pública e garantir cobertura de index.ts
import { MARKUP_DEFAULT, ValorInvalidoError, calcularItem, calcularProposta } from '../'
import { fx1, fx8Produtos, fx9Produtos } from './fixtures'

const INVARIANT_TOLERANCE = 0.01

function assertInvariante(result: ReturnType<typeof calcularProposta>): void {
  const soma = result.subtotal_produtos + result.total_markup + result.total_mao_de_obra
  expect(Math.abs(result.total_geral - soma)).toBeLessThanOrEqual(INVARIANT_TOLERANCE)
}

describe('calcularProposta', () => {
  describe('array vazia', () => {
    it('retorna proposta zerada para array vazia', () => {
      const result = calcularProposta([])
      expect(result.itens).toHaveLength(0)
      expect(result.subtotal_produtos).toBe(0)
      expect(result.total_markup).toBe(0)
      expect(result.total_mao_de_obra).toBe(0)
      expect(result.total_geral).toBe(0)
      expect(result.quantidade_itens).toBe(0)
      expect(result.quantidade_unidades).toBe(0)
    })
  })

  describe('item único — consistência com calcularItem', () => {
    it('resultado de array unitária é idêntico ao calcularItem direto', () => {
      const fromProposta = calcularProposta([fx1])
      const fromItem = calcularItem(fx1)
      expect(fromProposta.itens).toHaveLength(1)
      expect(fromProposta.itens[0]).toEqual(fromItem)
      expect(fromProposta.total_geral).toBe(fromItem.subtotal)
    })
  })

  describe('fixture 8 — 3 itens', () => {
    it('calcula subtotal_produtos corretamente', () => {
      const result = calcularProposta(fx8Produtos)
      // 100×2 + 50×1 + 200×1 = 450
      expect(result.subtotal_produtos).toBe(450)
    })

    it('calcula total_mao_de_obra corretamente', () => {
      const result = calcularProposta(fx8Produtos)
      // 0×2 + 20×1 + 0×1 = 20
      expect(result.total_mao_de_obra).toBe(20)
    })

    it('calcula total_markup corretamente', () => {
      const result = calcularProposta(fx8Produtos)
      // 100×0.45×2 + 50×0.45×1 + 200×0.30×1 = 90 + 22.5 + 60 = 172.5
      expect(result.total_markup).toBe(172.5)
    })

    it('calcula total_geral corretamente', () => {
      const result = calcularProposta(fx8Produtos)
      expect(result.total_geral).toBe(642.5)
    })

    it('conta itens e unidades corretamente', () => {
      const result = calcularProposta(fx8Produtos)
      expect(result.quantidade_itens).toBe(3)
      expect(result.quantidade_unidades).toBe(4) // 2+1+1
    })

    it('satisfaz invariante total_geral = subtotal + markup + mao_de_obra', () => {
      assertInvariante(calcularProposta(fx8Produtos))
    })
  })

  describe('fixture 9 — caso real Cath (5 itens mistos)', () => {
    it('calcula subtotal_produtos corretamente', () => {
      const result = calcularProposta(fx9Produtos)
      // 450×10 + 1200×2 + 86×5 + 3500×1 + 22×20 = 4500+2400+430+3500+440 = 11270
      expect(result.subtotal_produtos).toBe(11270)
    })

    it('calcula total_mao_de_obra corretamente', () => {
      const result = calcularProposta(fx9Produtos)
      // 30×10 + 0 + 15×5 + 500×1 + 0 = 300+75+500 = 875
      expect(result.total_mao_de_obra).toBe(875)
    })

    it('calcula total_markup corretamente', () => {
      const result = calcularProposta(fx9Produtos)
      // 450×0.45×10 + 1200×0.35×2 + 86×0.45×5 + 3500×0.20×1 + 22×0.45×20
      // = 2025 + 840 + 193.5 + 700 + 198 = 3956.5
      expect(result.total_markup).toBe(3956.5)
    })

    it('calcula total_geral corretamente', () => {
      const result = calcularProposta(fx9Produtos)
      expect(result.total_geral).toBe(16101.5)
    })

    it('conta itens e unidades corretamente', () => {
      const result = calcularProposta(fx9Produtos)
      expect(result.quantidade_itens).toBe(5)
      expect(result.quantidade_unidades).toBe(38) // 10+2+5+1+20
    })

    it('satisfaz invariante total_geral = subtotal + markup + mao_de_obra', () => {
      assertInvariante(calcularProposta(fx9Produtos))
    })

    it('cada item carrega markup_efetivo correto', () => {
      const result = calcularProposta(fx9Produtos)
      const [i1, i2, i3, i4, i5] = result.itens
      expect(i1?.markup_efetivo).toBe(MARKUP_DEFAULT)
      expect(i2?.markup_efetivo).toBe(0.35)
      expect(i3?.markup_efetivo).toBe(MARKUP_DEFAULT)
      expect(i4?.markup_efetivo).toBe(0.2)
      expect(i5?.markup_efetivo).toBe(MARKUP_DEFAULT)
    })
  })

  describe('propagação de erros', () => {
    it('propaga ValorInvalidoError de calcularItem para o item inválido', () => {
      expect(() =>
        calcularProposta([
          { valor_unitario: 100, quantidade: 1 },
          { valor_unitario: 0, quantidade: 1 },
        ]),
      ).toThrow(ValorInvalidoError)
    })
  })
})
