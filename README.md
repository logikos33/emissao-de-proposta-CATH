# Gerador de Propostas Cath

PWA mobile-first que automatiza a geração de propostas comerciais: recebe orçamento do fornecedor (PDF, texto ou áudio), extrai produtos com Claude API, aplica markup de 45% + mão de obra, e gera proposta em PDF via Google Slides.

---

## Como rodar localmente

```bash
# Requisito: Node 22 (use nvm: nvm use)
pnpm install
cp .env.example .env.local
# Preencher as variáveis no .env.local (ver seção abaixo)
pnpm dev
# → http://localhost:3000
```

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

| Variável                        | Descrição                                               |
| ------------------------------- | ------------------------------------------------------- |
| `ANTHROPIC_API_KEY`             | Chave da Anthropic (extração de orçamentos)             |
| `OPENAI_API_KEY`                | Chave da OpenAI (Whisper, transcrição de áudio)         |
| `GOOGLE_CLIENT_ID`              | Client ID do Google Cloud (OAuth)                       |
| `GOOGLE_CLIENT_SECRET`          | Client Secret do Google Cloud                           |
| `GOOGLE_SLIDES_TEMPLATE_ID`     | ID do template Slides da Cath no Drive                  |
| `GOOGLE_DRIVE_OUTPUT_FOLDER_ID` | ID da pasta onde PDFs serão salvos                      |
| `NEXTAUTH_SECRET`               | String aleatória ≥ 32 chars (`openssl rand -base64 32`) |
| `NEXTAUTH_URL`                  | URL base (`http://localhost:3000` em dev)               |

## Comandos

```bash
pnpm dev          # servidor de desenvolvimento
pnpm build        # build de produção
pnpm typecheck    # checar tipos TypeScript (deve passar sem erros)
pnpm lint         # ESLint (deve passar sem warnings)
pnpm test         # Vitest — testes unitários
pnpm test:watch   # Vitest em modo watch
```

---

## Como navegar o `.context/`

O diretório `.context/` contém toda a documentação de engenharia. **Leia antes de implementar qualquer feature.**

```
.context/
├── README.md               ← comece aqui
├── architecture.md         ← fluxo completo + decisões
├── domain/                 ← regras de negócio e schemas
├── integrations/           ← como usar cada API externa
├── prompts/                ← prompts de IA com exemplos
└── ui/                     ← especificação das telas mobile
```

---

## Como executar um PRP

Os PRPs em `prps/` definem o que implementar, em qual ordem e como validar.

**Sequência recomendada:**

```
PRP-001 → Extração multimodal (Claude + Whisper)
PRP-002 → Pricing engine (módulo puro + testes)
PRP-003 → Geração Slides + export PDF  ← requer template criado
PRP-004 → Fluxo mobile PWA (4 telas)  ← requer PRPs 1-3 concluídos
```

**Para executar um PRP:**

1. Abra o arquivo `prps/00X-nome.md`
2. Leia a seção "Contexto necessário" e abra os arquivos listados
3. Implemente seguindo o "Plano de implementação"
4. Rode os comandos de "Validação" antes de fechar

---

## Pontos pendentes antes do PRP-003

- [ ] Criar template Google Slides da Cath e registrar `GOOGLE_SLIDES_TEMPLATE_ID`
- [ ] Confirmar cores/fontes da identidade visual Cath (`.context/ui/design-tokens.md`)
- [ ] Confirmar enum de condições de pagamento (`.context/domain/product-schema.md`)
