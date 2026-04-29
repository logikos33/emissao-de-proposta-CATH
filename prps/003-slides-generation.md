# PRP-003 — Geração Google Slides + Export PDF

## Objetivo

Implementar o pipeline que recebe `Proposta` (com itens precificados), duplica o template Slides da Cath, preenche os dados e exporta um PDF via Drive API.

## Contexto necessário (ler antes de implementar)

1. `.context/architecture.md` — decisão de usar Slides + Drive
2. `.context/domain/proposal-flow.md` — passos 6 e 7 do fluxo
3. `.context/domain/product-schema.md` — `PropostaSchema`, `ItemFinal`
4. `.context/integrations/google-slides.md` — placeholders, batchUpdate, template
5. `.context/integrations/google-drive.md` — export PDF, upload para pasta
6. `.context/prompts/slide-copy-v1.md` — copy de capa (opcional)

## Pré-requisito

<!-- CONFIRMAR COM LUCAS: o template Google Slides da Cath precisa ser criado antes de implementar este PRP -->

Após criar o template, registrar o ID em `.env.local`:

```bash
GOOGLE_SLIDES_TEMPLATE_ID=<ID_DO_TEMPLATE>
GOOGLE_DRIVE_OUTPUT_FOLDER_ID=<ID_DA_PASTA>
```

## Critérios de aceite

- [ ] `POST /api/propose` aceita `Proposta` no body e retorna `{ pdfUrl, fileId }`
- [ ] Template é duplicado (não modificado) — original permanece intacto
- [ ] Todos os placeholders de texto são substituídos corretamente
- [ ] Tabela de produtos é preenchida com todos os itens (incluindo `valor_final` formatado)
- [ ] PDF é exportado e salvo na pasta `GOOGLE_DRIVE_OUTPUT_FOLDER_ID`
- [ ] Nome do arquivo: `Proposta - {cliente} - {data}.pdf`
- [ ] Erros de API Google retornam HTTP 502 com mensagem clara
- [ ] Arquivo temporário (Slides duplicado) pode ser excluído após export (opcional, decidir)

## Plano de implementação

1. Criar `src/lib/google/auth.ts` — helper para criar cliente auth com token NextAuth
2. Criar `src/lib/google/slides.ts` com `duplicateTemplate()` e `fillPlaceholders()`
3. Criar `src/lib/google/drive.ts` com `exportAsPdf()` e `uploadToFolder()`
4. Criar `src/app/api/propose/route.ts` — Route Handler que orquestra Slides + Drive
5. Validar input com `PropostaSchema` antes de chamar as APIs

## Validação

```bash
pnpm typecheck   # sem erros
pnpm lint        # sem warnings

# Teste manual (requer template criado e .env configurado):
curl -X POST http://localhost:3000/api/propose \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <session_token>" \
  -d '{ "cliente": "Empresa Teste", "itens": [...], "condicoes_pagamento": "30d" }'
# Esperado: { "pdfUrl": "https://drive.google.com/...", "fileId": "..." }
```

## Fora de escopo

- Extração de orçamento (PRP-001)
- Cálculo de pricing (PRP-002)
- UI do fluxo (PRP-004)
- Histórico de propostas (FASE 5)
