import type { Produto } from '../types'

// Fixture 1 — item simples, sem mão de obra, qtd 1
export const fx1: Produto = {
  valor_unitario: 100,
  quantidade: 1,
}

// Fixture 2 — item com mão de obra, qtd 1
export const fx2: Produto = {
  valor_unitario: 100,
  quantidade: 1,
  mao_de_obra: 50,
}

// Fixture 3 — item com mão de obra, qtd > 1 (validar multiplicação)
export const fx3: Produto = {
  valor_unitario: 100,
  quantidade: 3,
  mao_de_obra: 50,
}

// Fixture 4 — markup_override 0.20 (cliente preferencial)
export const fx4: Produto = {
  valor_unitario: 100,
  quantidade: 1,
  markup_override: 0.2,
}

// Fixture 5 — markup_override 0 (custo direto, sem margem)
export const fx5: Produto = {
  valor_unitario: 100,
  quantidade: 1,
  markup_override: 0,
}

// Fixture 6 — valor pequeno: R$0,99 × 100, mão de obra R$0,50
export const fx6: Produto = {
  valor_unitario: 0.99,
  quantidade: 100,
  mao_de_obra: 0.5,
}

// Fixture 7 — valor grande: R$125.000 × 1
export const fx7: Produto = {
  valor_unitario: 125000,
  quantidade: 1,
}

// Fixture 8 — múltiplos itens (3 linhas) para validar agregação
export const fx8Produtos: Produto[] = [
  { valor_unitario: 100, quantidade: 2 },
  { valor_unitario: 50, quantidade: 1, mao_de_obra: 20 },
  { valor_unitario: 200, quantidade: 1, markup_override: 0.3 },
]

// Fixture 9 — caso real Cath: 5 itens mistos com mão de obra e markups variados
export const fx9Produtos: Produto[] = [
  { valor_unitario: 450, quantidade: 10, mao_de_obra: 30 },
  { valor_unitario: 1200, quantidade: 2, markup_override: 0.35 },
  { valor_unitario: 86, quantidade: 5, mao_de_obra: 15 },
  { valor_unitario: 3500, quantidade: 1, markup_override: 0.2, mao_de_obra: 500 },
  { valor_unitario: 22, quantidade: 20 },
]
