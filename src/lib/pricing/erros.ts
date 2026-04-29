/**
 * Classe base para todos os erros de pricing.
 * Expõe `campo` e `valor` para facilitar diagnóstico e logging estruturado.
 */
export class PricingError extends Error {
  readonly campo: string
  readonly valor: unknown

  constructor(message: string, campo: string, valor: unknown) {
    super(message)
    this.name = this.constructor.name
    this.campo = campo
    this.valor = valor
    // Garante instanceof correto após transpilação TypeScript → ES5
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

/** Lançado quando valor_unitario é zero ou negativo. */
export class ValorInvalidoError extends PricingError {}

/** Lançado quando quantidade é zero, negativa ou não é inteiro. */
export class QuantidadeInvalidaError extends PricingError {}

/** Lançado quando markup_override está fora do intervalo [0, 5]. */
export class MarkupInvalidoError extends PricingError {}

/** Lançado quando mao_de_obra é negativa. */
export class MaoDeObraInvalidaError extends PricingError {}
