# PRP-001 — Extração Multimodal de Orçamentos

## Objetivo

Implementar o pipeline completo de entrada (PDF / áudio / texto) que retorna um array `Produto[]` validado por Zod, pronto para a UI de revisão.

## Contexto necessário (ler antes de implementar)

1. `.context/architecture.md` — fluxo geral e decisão de tool use
2. `.context/domain/proposal-flow.md` — passos 1 a 3 do fluxo
3. `.context/domain/product-schema.md` — `ProdutoSchema` e `Produto` type
4. `.context/integrations/claude-extraction.md` — cliente Anthropic, tool definition, retry
5. `.context/integrations/whisper.md` — transcrição de áudio
6. `.context/prompts/extract-budget-v1.md` — system prompt + exemplos few-shot

## Critérios de aceite

- [ ] `POST /api/extract` aceita `multipart/form-data` com campo `file` (PDF ou áudio) ou `text` (string)
- [ ] PDF é enviado para Claude como `document` source (não base64 de imagem)
- [ ] Áudio passa primeiro pelo Whisper, depois o texto vai para Claude
- [ ] Resposta é validada pelo `ProdutoSchema` via Zod — campos ausentes chegam como `null`
- [ ] Erros de validação retornam HTTP 422 com mensagem clara
- [ ] Retry automático em falhas transitórias (3 tentativas, exponential backoff)
- [ ] Testes unitários em `src/lib/claude/` cobrindo: PDF, texto, transcrição, campo nulo

## Plano de implementação

1. Criar `src/lib/schemas/index.ts` com `ProdutoSchema`, `PropostaSchema`, `CondicaoPagamentoSchema`
2. Criar `src/lib/claude/client.ts` com instância singleton do Anthropic SDK
3. Criar `src/lib/claude/tools.ts` com `extractBudgetTool` (tool definition)
4. Criar `src/lib/claude/prompts.ts` com `EXTRACT_BUDGET_SYSTEM_PROMPT`
5. Criar `src/lib/claude/extract.ts` com `extractBudget()` + retry
6. Criar `src/lib/openai/whisper.ts` com `transcribeAudio()`
7. Criar `src/app/api/extract/route.ts` — Route Handler que orquestra tudo
8. Escrever testes em `src/lib/claude/extract.test.ts`

## Validação

```bash
pnpm typecheck   # sem erros
pnpm lint        # sem warnings
pnpm test        # testes de extração passando

# Teste manual (servidor rodando):
curl -X POST http://localhost:3000/api/extract \
  -F "text=5 unidades de parafuso M6 - R$ 0,80 cada"
# Esperado: [{ "nome": "Parafuso M6", "qtd": 5, "valor_unitario": 0.80, ... }]
```

## Fora de escopo

- UI de upload (PRP-004)
- Cálculo de pricing (PRP-002)
- Geração de Slides (PRP-003)
- Autenticação NextAuth (configurar separadamente)
