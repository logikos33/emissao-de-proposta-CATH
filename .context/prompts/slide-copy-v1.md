# Prompt de Copy para Slides — v1

## Uso

Este prompt é opcional — usado apenas se quisermos gerar texto de capa ou introdução da proposta via Claude. A maioria dos campos é preenchida diretamente com dados do colaborador/proposta.

## Prompt de capa (opcional)

```
Você é um redator profissional de propostas comerciais B2B.

Gere um texto breve de abertura (2-3 frases) para uma proposta comercial da Cath,
destinada ao cliente {{cliente}}.

Contexto:
- Data: {{data}}
- Produtos: {{lista_resumida}}
- Tom: profissional, objetivo, sem floreios

Retorne SOMENTE o texto, sem aspas, sem markdown.
```

## Placeholder de validade

A proposta deve incluir prazo de validade padrão: **"Esta proposta tem validade de 7 dias corridos a partir da data de emissão."**

<!-- CONFIRMAR COM LUCAS: o prazo de validade padrão é 7 dias? -->
