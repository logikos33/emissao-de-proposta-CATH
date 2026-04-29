# .context/ — Contexto de Engenharia

Este diretório contém toda a documentação de contexto do projeto. **Leia antes de implementar qualquer feature.**

## Como usar

1. Leia `architecture.md` para entender o fluxo geral
2. Leia os arquivos `domain/` para entender as regras de negócio
3. Leia os arquivos `integrations/` relevantes para a feature que vai implementar
4. Consulte `prompts/` antes de alterar qualquer chamada à Claude API

## Índice

| Arquivo                             | Conteúdo                                    |
| ----------------------------------- | ------------------------------------------- |
| `architecture.md`                   | Diagrama mermaid + decisões de arquitetura  |
| `domain/proposal-flow.md`           | Fluxo completo do negócio (upload → PDF)    |
| `domain/pricing-rules.md`           | Regras de markup 45% + mão de obra          |
| `domain/product-schema.md`          | Schemas Zod canônicos de Produto e Proposta |
| `integrations/claude-extraction.md` | Anthropic SDK, tool use, retry/backoff      |
| `integrations/google-slides.md`     | batchUpdate, placeholders, template         |
| `integrations/google-drive.md`      | Export PDF via files.export                 |
| `integrations/whisper.md`           | Transcrição de áudio com OpenAI Whisper     |
| `prompts/extract-budget-v1.md`      | Prompt completo com exemplos few-shot       |
| `prompts/slide-copy-v1.md`          | Geração de copy para capa e intro do Slides |
| `ui/mobile-flow.md`                 | 4 telas do fluxo mobile                     |
| `ui/design-tokens.md`               | Cores, fontes e identidade visual Cath      |
