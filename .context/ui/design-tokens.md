# Design Tokens — Identidade Visual Cath

<!-- CONFIRMAR COM LUCAS: cores primárias, fontes e logo da Cath não foram fornecidos. Preencher antes de executar o PRP-004. -->

## Paleta de cores

```css
/* Cores da Cath — CONFIRMAR COM LUCAS */
--color-primary: /* Cor principal da marca */;
--color-secondary: /* Cor secundária */;
--color-accent: /* Destaque/CTA */;
--color-background: /* Fundo das páginas */;
--color-surface: /* Fundo de cards */;
--color-text: /* Texto principal */;
--color-text-muted: /* Texto secundário */;
```

## Tipografia

```css
/* Fontes da Cath — CONFIRMAR COM LUCAS */
--font-sans: /* Fonte principal */;
--font-heading: /* Fonte de títulos (pode ser a mesma) */;
```

## Logo

```
<!-- CONFIRMAR COM LUCAS: fornecer URL ou arquivo do logo Cath em SVG/PNG -->
```

## Placeholder temporário

Até receber os tokens oficiais, usar as defaults do shadcn/ui (neutral) configuradas em `src/app/globals.css`.

## Breakpoints (mobile-first)

```css
/* Breakpoints padrão Tailwind — não alterar sem justificativa */
sm:  640px   /* Tablet pequeno */
md:  768px   /* Tablet */
lg:  1024px  /* Desktop */
```

## Componentes críticos mobile

- **Altura mínima de botões:** 44px (acessibilidade touch)
- **Padding lateral mínimo:** 16px (evitar conteúdo colado na borda)
- **Font size mínimo:** 16px em inputs (evita zoom automático no iOS)
