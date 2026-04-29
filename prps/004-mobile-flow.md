# PRP-004 — Fluxo Mobile PWA

## Objetivo

Implementar as 4 telas do fluxo mobile-first (Upload → Revisão → Mão de obra → Preview), integrando os endpoints dos PRPs anteriores.

## Contexto necessário (ler antes de implementar)

1. `.context/ui/mobile-flow.md` — especificação das 4 telas
2. `.context/ui/design-tokens.md` — cores, fontes e tokens visuais Cath (**confirmar antes**)
3. `.context/domain/pricing-rules.md` — preview de valor em tempo real (Tela 3)
4. `.context/domain/product-schema.md` — tipos `Produto`, `ItemFinal`, `CondicaoPagamento`

## Pré-requisitos

- PRP-001 concluído (`POST /api/extract` funcionando)
- PRP-002 concluído (`calcularItem()` disponível para preview em tempo real)
- PRP-003 concluído (`POST /api/propose` funcionando)
- Tokens de design confirmados com Lucas

## Critérios de aceite

- [ ] Tela 1 (Upload): aceita PDF, texto colado e arquivo de áudio
- [ ] Tela 1: exibe loading "Extraindo produtos..." durante chamada à API
- [ ] Tela 2 (Revisão): todos os campos editáveis inline (nome, qtd, valor, unidade)
- [ ] Tela 2: botão "Adicionar produto" adiciona linha editável
- [ ] Tela 2: botão remover exclui item da lista
- [ ] Tela 3 (Mão de obra): preview do valor final atualiza em tempo real ao digitar
- [ ] Tela 3: select de condições de pagamento com os 4 valores do enum
- [ ] Tela 4 (Preview): exibe link funcional do PDF gerado
- [ ] Tela 4: botão "Copiar link" copia URL para clipboard
- [ ] Fluxo navegável em 375px sem scroll horizontal
- [ ] Todos os elementos interativos com altura mínima de 44px
- [ ] Inputs de texto com `font-size: 16px` (evita zoom automático no iOS)
- [ ] PWA manifest criado (`public/manifest.json`) com ícone e `display: standalone`

## Plano de implementação

1. Configurar NextAuth com Google Provider em `src/app/api/auth/[...nextauth]/route.ts`
2. Criar layout para rotas protegidas em `src/app/(auth)/layout.tsx`
3. Criar Tela 1: `src/app/(auth)/propostas/nova/page.tsx`
4. Criar Tela 2: `src/app/(auth)/propostas/nova/revisao/page.tsx`
5. Criar Tela 3: `src/app/(auth)/propostas/nova/mao-de-obra/page.tsx`
6. Criar Tela 4: `src/app/(auth)/propostas/[id]/page.tsx`
7. Criar componentes reutilizáveis em `src/components/` (ProdutoCard, PricingPreview)
8. Criar `public/manifest.json` para PWA

## Validação

```bash
pnpm typecheck   # sem erros
pnpm lint        # sem warnings
pnpm dev         # testar no Chrome DevTools em modo mobile (375px)

# Testar fluxo completo:
# 1. Fazer upload de um texto de orçamento
# 2. Editar um produto na Tela 2
# 3. Adicionar mão de obra na Tela 3
# 4. Verificar se o PDF é gerado e o link funciona
```

## Fora de escopo

- Autenticação por domínio (qualquer conta Google pode entrar)
- Histórico de propostas (FASE 5)
- Testes Playwright e2e (pós-PRP-004, FASE 4 polish)
