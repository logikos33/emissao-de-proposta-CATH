# CLAUDE.md — Gerador de Propostas Cath

## Identidade

Sistema PWA mobile-first que automatiza a geração de propostas comerciais da Cath: recebe orçamento do fornecedor (PDF, texto ou áudio), extrai produtos com IA, aplica markup e mão de obra, e gera proposta em PDF via Google Slides.

---

## Stack travada (não revalidar, não sugerir alternativas)

| Camada          | Tecnologia                              | Versão             |
| --------------- | --------------------------------------- | ------------------ |
| Framework       | Next.js (App Router)                    | 16.x               |
| Linguagem       | TypeScript                              | 5.x (strict total) |
| Estilo          | Tailwind CSS + shadcn/ui                | 4.x / latest       |
| Auth            | NextAuth (Google OAuth)                 | latest             |
| IA Extração     | Claude API (Anthropic SDK)              | claude-sonnet-4-5+ |
| IA Áudio        | Whisper API (OpenAI SDK)                | latest             |
| Apresentação    | Google Slides API + Drive API           | v1                 |
| Deploy          | Vercel                                  | latest             |
| Package manager | pnpm                                    | 10.x               |
| Testes          | Vitest (unit) + Playwright (e2e fase 4) | latest             |

---

## Convenções de código

- **TypeScript strict total**: sem `any`, sem `!` (non-null assertion), sem `as` para forçar tipos, sem `// @ts-ignore`
- **Módulos puros para lógica de negócio**: `src/lib/pricing/` e `src/lib/schemas/` não importam nada de Next.js, React ou APIs externas — 100% testáveis em isolamento
- **Documentação em PT-BR**: comentários, `.context/`, PRPs e README em português
- **Código e identificadores em inglês**: nomes de variáveis, funções, tipos e arquivos em inglês
- **JSDoc em funções públicas**: toda função exportada de `src/lib/` deve ter JSDoc descrevendo parâmetros e retorno
- **Comentários apenas onde o WHY não é óbvio**: não comentar o que o código faz, comentar por que uma decisão foi tomada

---

## Regra de pastas

```
src/
├── app/
│   ├── (auth)/           # Rotas protegidas por NextAuth (session obrigatória)
│   ├── api/
│   │   ├── extract/      # POST /api/extract — orçamento (PDF/texto/áudio) → JSON Produto[]
│   │   ├── propose/      # POST /api/propose — Produto[] → URL do PDF no Drive
│   │   └── auth/         # NextAuth handler (Google OAuth)
│   └── propostas/        # Páginas de listagem e detalhes de propostas
├── lib/
│   ├── claude/           # Cliente Anthropic SDK + estratégia de prompts (tool use)
│   ├── openai/           # Cliente OpenAI SDK para Whisper (transcrição de áudio)
│   ├── google/           # Slides API (batchUpdate) + Drive API (export PDF)
│   ├── pricing/          # Módulo puro: calcularItem(), calcularProposta() — sem deps externas
│   └── schemas/          # Schemas Zod: ProdutoSchema, PropostaSchema — fonte da verdade dos tipos
├── components/
│   └── ui/               # Componentes shadcn/ui gerados via CLI
└── types/
    └── index.ts          # Re-exports de tipos inferidos dos schemas Zod
```

---

## Como rodar localmente

```bash
# Instalar dependências
pnpm install

# Copiar variáveis de ambiente
cp .env.example .env.local
# Preencher ANTHROPIC_API_KEY, OPENAI_API_KEY, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET

# Iniciar servidor de desenvolvimento
pnpm dev
# → http://localhost:3000
```

## Como testar / lintar / checar tipos

```bash
pnpm typecheck   # TypeScript strict — deve passar sem erros
pnpm lint        # ESLint — deve passar sem warnings
pnpm test        # Vitest — roda testes em src/lib/**/*.test.ts
pnpm test:watch  # Vitest em modo watch
```

---

## Regra de ouro: toda feature passa por PRP antes de código

1. Leia o PRP relevante em `prps/` (ex: `prps/001-extracao-multimodal.md`)
2. Leia todos os arquivos `.context/` listados no PRP
3. Só então escreva código
4. Ao finalizar, rode a validação descrita no PRP

**Nunca implemente uma feature sem um PRP aprovado.**

---

## Agentes disponíveis

| Agente               | Quando invocar                                                                |
| -------------------- | ----------------------------------------------------------------------------- |
| `corretor-de-codigo` | Após escrever ou modificar código — aplica clean code e boas práticas         |
| `dev-cleanup`        | Ambiente lento ou travando — elimina processos zumbis, libera recursos        |
| `guardiao-login`     | Após alterar NextAuth, providers ou middleware — protege performance do login |
| `doc-versionador`    | Após finalizar feature ou PRP — documenta e versiona alterações               |

---

## Arquivos `.context/` a ler antes de qualquer task

Leia nesta ordem para ter contexto completo antes de implementar qualquer coisa:

1. `.context/README.md` — índice e instruções de uso
2. `.context/architecture.md` — diagrama do fluxo e decisões de arquitetura
3. `.context/domain/proposal-flow.md` — fluxo de negócio detalhado
4. `.context/domain/pricing-rules.md` — regras de markup e mão de obra
5. `.context/domain/product-schema.md` — schemas Zod canônicos (fonte da verdade)
6. `.context/integrations/claude-extraction.md` — como usar a Anthropic SDK
7. `.context/prompts/extract-budget-v1.md` — prompt de extração com exemplos few-shot
