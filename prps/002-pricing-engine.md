# PRP-002 — Pricing Engine

## Objetivo

Implementar o módulo puro `src/lib/pricing/` com as funções `calcularItem()` e `calcularProposta()`, com 100% de cobertura de testes.

## Contexto necessário (ler antes de implementar)

1. `.context/domain/pricing-rules.md` — fórmula, markup default, arredondamento, casos de borda
2. `.context/domain/product-schema.md` — `ItemFinalSchema`, `Produto`, `ItemFinal`

## Critérios de aceite

- [ ] `calcularItem()` retorna `ItemFinal` com `valor_com_markup` e `valor_final` corretos
- [ ] Markup default de 0.45 é aplicado quando `markup_override` é `undefined`
- [ ] `markup_override` sobrescreve o markup padrão por item
- [ ] Arredondamento correto em BRL (2 casas, sem erros de float)
- [ ] `calcularProposta()` retorna `total` = soma de todos os `valor_final`
- [ ] `qtd = 0` retorna `valor_final = 0`
- [ ] Módulo não importa nada de Next.js, React ou APIs externas
- [ ] 100% de cobertura de linhas em `src/lib/pricing/`

## Plano de implementação

1. Criar `src/lib/pricing/index.ts` com `calcularItem()` e `calcularProposta()`
2. Criar `src/lib/pricing/pricing.test.ts` com todos os casos de borda listados em `pricing-rules.md`
3. Garantir que os tipos de entrada/saída são `Produto` e `ItemFinal` de `src/lib/schemas/`

## Validação

```bash
pnpm test                              # todos os testes passando
pnpm test --coverage                   # 100% coverage em src/lib/pricing/
pnpm typecheck                         # sem erros

# Casos críticos nos testes:
# calcularItem(100, 1, 0.45, 0)   → 145.00
# calcularItem(100, 1, 0, 50)     → 150.00
# calcularItem(10.333, 3, 0.45, 0) → 44.95  (arredondamento)
# calcularItem(100, 0, 0.45, 0)   → 0
# calcularTotal([{valorFinal: 100}, {valorFinal: 50.50}]) → 150.50
```

## Fora de escopo

- UI de revisão (PRP-004)
- Integração com API routes (PRP-001 orquestra)
- Persistência de propostas (FASE 5)
