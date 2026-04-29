# Integração Google Slides API

## Visão geral

Duplicamos o template Slides da Cath e preenchemos os placeholders via `batchUpdate`. O PDF é exportado via Drive API (ver `google-drive.md`).

## Template

<!-- CONFIRMAR COM LUCAS: o template Slides ainda não existe no Drive. Criar na FASE 0 (PRP-003) e registrar o ID aqui -->

```bash
GOOGLE_SLIDES_TEMPLATE_ID=<ID_DO_TEMPLATE_QUANDO_CRIADO>
```

## Autenticação

Usar OAuth2 com as credenciais do Google Cloud configuradas via NextAuth. O access token do usuário autenticado é reutilizado para chamar as APIs.

## Dependência

```bash
pnpm add googleapis
```

## Placeholders no template

Convenção: `{{placeholder}}` no texto dos slides.

| Placeholder               | Valor                                     |
| ------------------------- | ----------------------------------------- |
| `{{cliente}}`             | Nome do cliente                           |
| `{{data}}`                | Data formatada (ex: "29/04/2026")         |
| `{{colaborador}}`         | Nome do colaborador logado                |
| `{{total}}`               | Valor total formatado (ex: "R$ 1.250,00") |
| `{{condicoes_pagamento}}` | Label da condição (ex: "30/60 dias")      |
| `{{observacoes}}`         | Observações gerais (ou string vazia)      |

A tabela de produtos é preenchida linha a linha — ver PRP-003 para estratégia exata.

## Fluxo de geração

```typescript
// 1. Duplicar template
const copiedFile = await drive.files.copy({
  fileId: TEMPLATE_ID,
  requestBody: { name: `Proposta - ${cliente} - ${data}` },
})
const presentationId = copiedFile.data.id

// 2. Substituir placeholders via batchUpdate
await slides.presentations.batchUpdate({
  presentationId,
  requestBody: {
    requests: [
      {
        replaceAllText: {
          containsText: { text: '{{cliente}}', matchCase: true },
          replaceText: cliente,
        },
      },
      // ... demais placeholders
    ],
  },
})
```

## Notas importantes

- `batchUpdate` é transacional: todas as operações acontecem em uma única chamada
- Placeholders devem ser únicos no template para evitar substituições parciais
- A tabela de produtos requer estratégia diferente de `replaceAllText` — ver PRP-003
