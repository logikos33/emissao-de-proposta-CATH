import { describe, expect, it } from 'vitest'
import { MARKUP_DEFAULT } from '../constants'
import {
  MaoDeObraInvalidaError,
  MarkupInvalidoError,
  PricingError,
  QuantidadeInvalidaError,
  ValorInvalidoError,
} from '../erros'
import { calcularItem } from '../calcular-item'
import { fx1, fx2, fx3, fx4, fx5, fx6, fx7 } from './fixtures'

describe('calcularItem', () => {
  describe('fixture 1 — simples, sem mão de obra, qtd 1', () => {
    it('aplica markup default e retorna campos corretos', () => {
      const result = calcularItem(fx1)
      expect(result.markup_efetivo).toBe(MARKUP_DEFAULT)
      expect(result.preco_com_markup_unit).toBe(145)
      expect(result.preco_final_unit).toBe(145)
      expect(result.subtotal).toBe(145)
      expect(result.mao_de_obra).toBe(0)
    })
  })

  describe('fixture 2 — com mão de obra, qtd 1', () => {
    it('soma mão de obra ao preço final', () => {
      const result = calcularItem(fx2)
      expect(result.preco_com_markup_unit).toBe(145)
      expect(result.preco_final_unit).toBe(195)
      expect(result.subtotal).toBe(195)
      expect(result.mao_de_obra).toBe(50)
    })
  })

  describe('fixture 3 — com mão de obra, qtd 3', () => {
    it('multiplica preco_final_unit pela quantidade no subtotal', () => {
      const result = calcularItem(fx3)
      expect(result.preco_final_unit).toBe(195)
      expect(result.subtotal).toBe(585) // 195 × 3
      expect(result.quantidade).toBe(3)
    })
  })

  describe('fixture 4 — markup_override 0.20', () => {
    it('usa markup_override no lugar do default', () => {
      const result = calcularItem(fx4)
      expect(result.markup_efetivo).toBe(0.2)
      expect(result.preco_com_markup_unit).toBe(120)
      expect(result.subtotal).toBe(120)
    })
  })

  describe('fixture 5 — markup_override 0 (custo direto)', () => {
    it('aceita markup zero sem lançar erro', () => {
      const result = calcularItem(fx5)
      expect(result.markup_efetivo).toBe(0)
      expect(result.preco_com_markup_unit).toBe(100)
      expect(result.subtotal).toBe(100)
    })
  })

  describe('fixture 6 — valor pequeno R$0,99 × 100, mão de obra R$0,50', () => {
    it('arredonda corretamente em valores com muitas casas decimais', () => {
      const result = calcularItem(fx6)
      expect(result.preco_com_markup_unit).toBe(1.44) // roundBRL(0.99 × 1.45) = roundBRL(1.4355)
      expect(result.preco_final_unit).toBe(1.94)
      expect(result.subtotal).toBe(194)
    })
  })

  describe('fixture 7 — valor grande R$125.000', () => {
    it('calcula corretamente sem overflow ou perda de precisão', () => {
      const result = calcularItem(fx7)
      expect(result.preco_com_markup_unit).toBe(181250)
      expect(result.subtotal).toBe(181250)
    })
  })

  describe('passthrough de campos de entrada', () => {
    it('retorna valor_unitario e quantidade inalterados', () => {
      const result = calcularItem(fx1)
      expect(result.valor_unitario).toBe(fx1.valor_unitario)
      expect(result.quantidade).toBe(fx1.quantidade)
    })
  })

  describe('erros de validação', () => {
    it('lança ValorInvalidoError para valor_unitario = 0', () => {
      expect(() => calcularItem({ valor_unitario: 0, quantidade: 1 })).toThrow(ValorInvalidoError)
    })

    it('lança ValorInvalidoError para valor_unitario negativo', () => {
      expect(() => calcularItem({ valor_unitario: -10, quantidade: 1 })).toThrow(ValorInvalidoError)
    })

    it('lança QuantidadeInvalidaError para quantidade = 0', () => {
      expect(() => calcularItem({ valor_unitario: 10, quantidade: 0 })).toThrow(
        QuantidadeInvalidaError,
      )
    })

    it('lança QuantidadeInvalidaError para quantidade negativa', () => {
      expect(() => calcularItem({ valor_unitario: 10, quantidade: -1 })).toThrow(
        QuantidadeInvalidaError,
      )
    })

    it('lança QuantidadeInvalidaError para quantidade fracionária', () => {
      expect(() => calcularItem({ valor_unitario: 10, quantidade: 1.5 })).toThrow(
        QuantidadeInvalidaError,
      )
    })

    it('lança MarkupInvalidoError para markup_override negativo', () => {
      expect(() =>
        calcularItem({ valor_unitario: 10, quantidade: 1, markup_override: -0.1 }),
      ).toThrow(MarkupInvalidoError)
    })

    it('lança MarkupInvalidoError para markup_override > 5', () => {
      expect(() => calcularItem({ valor_unitario: 10, quantidade: 1, markup_override: 6 })).toThrow(
        MarkupInvalidoError,
      )
    })

    it('lança MaoDeObraInvalidaError para mao_de_obra negativa', () => {
      expect(() => calcularItem({ valor_unitario: 10, quantidade: 1, mao_de_obra: -5 })).toThrow(
        MaoDeObraInvalidaError,
      )
    })

    it('todos os erros são instâncias de PricingError', () => {
      const cases = [
        () => calcularItem({ valor_unitario: 0, quantidade: 1 }),
        () => calcularItem({ valor_unitario: 10, quantidade: 0 }),
        () => calcularItem({ valor_unitario: 10, quantidade: 1, markup_override: -0.1 }),
        () => calcularItem({ valor_unitario: 10, quantidade: 1, mao_de_obra: -5 }),
      ]
      for (const fn of cases) {
        expect(fn).toThrow(PricingError)
      }
    })

    it('erros expõem campo e valor corretos', () => {
      try {
        calcularItem({ valor_unitario: -10, quantidade: 1 })
      } catch (err) {
        expect(err).toBeInstanceOf(ValorInvalidoError)
        const e = err as ValorInvalidoError
        expect(e.campo).toBe('valor_unitario')
        expect(e.valor).toBe(-10)
        expect(e.name).toBe('ValorInvalidoError')
      }
    })
  })

  describe('markup_override no limite superior aceito (5)', () => {
    it('aceita markup_override = 5 sem lançar erro', () => {
      const result = calcularItem({ valor_unitario: 10, quantidade: 1, markup_override: 5 })
      expect(result.markup_efetivo).toBe(5)
      expect(result.preco_com_markup_unit).toBe(60) // 10 × 6
    })
  })
})
