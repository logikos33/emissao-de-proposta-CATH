# Arquitetura — Gerador de Propostas Cath

## Fluxo completo

```mermaid
flowchart TD
    A[Colaborador no campo] -->|Upload: PDF, texto ou áudio| B[Next.js App]
    B --> C{Tipo de input}
    C -->|Áudio| D[POST /api/extract\nWhisper → transcrição]
    C -->|PDF ou texto| E[POST /api/extract\nClaude API]
    D --> E
    E -->|Anthropic SDK\ntool use| F[JSON validado por Zod\nProduto[]]
    F --> G[UI mobile de revisão\neditar linhas + mão de obra]
    G --> H[POST /api/propose\nEngine de pricing]
    H --> I[calcularProposta\nmarkup 45% + mão de obra]
    I --> J[Google Slides API\nduplicar template + batchUpdate]
    J --> K[Drive API\nexportar PDF]
    K --> L[Link/PDF para o cliente]
```

## Decisões de arquitetura

### Por que tool use em vez de JSON mode (Claude)?

Tool use é mais robusto: o modelo é forçado a respeitar o schema exato, sem texto extra ao redor do JSON. JSON mode pode retornar markdown com o JSON embutido, quebrando o parse.

### Por que Whisper (OpenAI) em vez de Claude para áudio?

Claude API não suporta input de áudio diretamente. Whisper é especializado em transcrição e mais barato por minuto. O fluxo é: Whisper transcreve → texto vai para Claude extrair produtos.

### Por que Google Slides para o PDF?

A Cath já tem template aprovado no Slides com identidade visual. Duplicar o template via API preserva formatação, fontes e cores sem recriar do zero. Export para PDF é nativo via Drive API.

### Por que módulos puros em `src/lib/pricing/` e `src/lib/schemas/`?

Lógica de negócio sem dependências externas é 100% testável em isolamento com Vitest. Não precisa mockar Next.js, React ou APIs.

### Por que Next.js App Router?

Server Actions e Route Handlers simplificam o backend sem precisar de servidor separado. Vercel deploy é zero-config.

## Estrutura de pastas (resumo)

```
src/
├── app/api/extract/    → recebe orçamento, chama Claude/Whisper, retorna Produto[]
├── app/api/propose/    → recebe Produto[], gera Slides, retorna URL do PDF
├── lib/claude/         → cliente Anthropic SDK, retry, tool definition
├── lib/openai/         → cliente Whisper, upload de áudio
├── lib/google/         → Slides batchUpdate, Drive export
├── lib/pricing/        → calcularItem(), calcularProposta() — módulo puro
└── lib/schemas/        → ProdutoSchema, PropostaSchema — fonte da verdade Zod
```
