/**
 * Arredonda um valor monetário para 2 casas decimais usando half-up.
 *
 * Usa a técnica da notação exponencial em string para contornar o erro
 * clássico de ponto flutuante: `1.005 * 100 = 100.4999...` em IEEE 754,
 * enquanto `Number('1.005e2')` = `100.5` exato.
 * Negativos são arredondados para longe do zero (half-up simétrico).
 *
 * @param value - Valor em BRL a arredondar
 * @returns Valor arredondado com no máximo 2 casas decimais
 */
export function roundBRL(value: number): number {
  if (value === 0) return 0
  const sign = value < 0 ? -1 : 1
  const abs = Math.abs(value)
  // Notação exponencial em string evita 1.005*100 = 100.4999... (IEEE 754)
  const rounded = Number(String(Math.round(Number(`${abs}e2`))) + 'e-2')
  return rounded === 0 ? 0 : sign * rounded
}
