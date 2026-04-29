const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatBRL(value: number): string {
  return formatter.format(value)
}

export function parseBRL(str: string): number {
  const clean = str
    .replace(/R\$\s?/g, '')
    .replace(/\./g, '')
    .replace(',', '.')
    .trim()
  const parsed = parseFloat(clean)
  return isNaN(parsed) ? 0 : parsed
}
