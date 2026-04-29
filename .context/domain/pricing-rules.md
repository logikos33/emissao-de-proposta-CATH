# Regras de Pricing — Proposta Cath

## Fórmula base

```
valor_final = (valor_unitario × (1 + markup)) + mao_de_obra
```

## Parâmetros

| Parâmetro        | Tipo     | Default | Descrição                                                         |
| ---------------- | -------- | ------- | ----------------------------------------------------------------- |
| `valor_unitario` | `number` | —       | Valor do produto conforme orçamento do fornecedor (BRL)           |
| `markup`         | `number` | `0.45`  | Percentual de markup (45% = 0.45). Pode ser sobrescrito por item. |
| `mao_de_obra`    | `number` | `0`     | Valor fixo de mão de obra adicionado ao item (BRL)                |

## Função pura (implementar em `src/lib/pricing/`)

```typescript
/**
 * Calcula o valor final de um item da proposta.
 * Aplica markup sobre o valor unitário e soma a mão de obra.
 *
 * @param valorUnitario - Preço do fornecedor por unidade (BRL)
 * @param qtd - Quantidade de unidades
 * @param markup - Percentual de markup como decimal (ex: 0.45 para 45%)
 * @param maoDeObra - Valor fixo de mão de obra por item (BRL, default 0)
 * @returns Valor total do item com markup e mão de obra aplicados
 */
function calcularItem(
  valorUnitario: number,
  qtd: number,
  markup: number = 0.45,
  maoDeObra: number = 0,
): number {
  const valorComMarkup = valorUnitario * (1 + markup)
  const valorTotal = (valorComMarkup + maoDeObra) * qtd
  // Arredondamento BRL: evita erros de ponto flutuante (ex: 0.1 + 0.2 = 0.30000000000000004)
  return Math.round(valorTotal * 100) / 100
}
```

## Arredondamento

- Sempre 2 casas decimais
- Usar `Math.round(v * 100) / 100` — não usar `toFixed()` para cálculos intermediários (retorna string)
- `toFixed(2)` pode ser usado apenas para formatação de display final

## Casos de borda a cobrir nos testes (PRP-002)

1. `markup_override = 0` (sem markup, só mão de obra)
2. `mao_de_obra = 0` (sem mão de obra, só markup)
3. Valores com muitas casas decimais (ex: `valor_unitario = 10.333`)
4. `qtd = 0` (deve retornar 0)
5. `markup_override = 1.0` (markup de 100%)
6. Total da proposta = soma de todos os itens

## Total da proposta

```typescript
/**
 * Calcula o valor total de uma proposta somando todos os itens.
 *
 * @param itens - Lista de itens com valorFinal já calculado
 * @returns Soma total em BRL, arredondada para 2 casas decimais
 */
function calcularTotal(itens: ItemFinal[]): number {
  const soma = itens.reduce((acc, item) => acc + item.valorFinal, 0)
  return Math.round(soma * 100) / 100
}
```
