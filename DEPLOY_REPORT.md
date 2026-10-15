# Deploy Report — Cath Propostas v1

## URL produção
https://emissao-de-proposta-cath.vercel.app

## Build
- Data: 2026-04-29
- Tempo: ~55s (build Vercel) + 15.6s (webpack compile)
- Status: ✅ READY
- Deployment ID: dpl_Br8X3bhc9no1Xemf5K1DioJ4dt5A
- Bundle: 8 rotas (6 estáticas, 1 dinâmica `/api/extract`, 1 not-found)
- Node: 22 LTS (Vercel auto-detect via engines field)
- Pnpm: 10.x (auto-detectado por data de criação)

## Env vars configuradas
- [x] ANTHROPIC_API_KEY (production)
- [ ] ANTHROPIC_API_KEY (preview) — CLI bug na versão atual, adicionar via dashboard Vercel
- [ ] OPENAI_API_KEY — deixado de fora intencionalmente (sem créditos por ora; áudio desativado)
- [ ] ANTHROPIC_MODEL (opcional, usa default do código)

## Smoke test produção
- Home: ⬜ pendente
- Upload texto: ⬜ pendente
- Extração (chamada real Claude): ⬜ pendente
- Edição itens: ⬜ pendente
- Forms tela 3: ⬜ pendente
- Preview + print: ⬜ pendente
- PWA install: ⬜ pendente
- Persistência F5: ⬜ pendente

## Mudanças aplicadas pré-deploy
1. `src/app/api/extract/route.ts` — adicionado `maxDuration=60`, `runtime=nodejs`, `dynamic=force-dynamic`
2. `next.config.ts` — adicionado security headers + `serverActions.bodySizeLimit: '25mb'`
3. `package.json` — `build` script usa `--webpack` (next-pwa incompatível com Turbopack default do Next 16), `engines.node >= 22`
4. `.gitignore` — adicionado padrão `swe-worker-*` para artefatos PWA

## Bugs / problemas encontrados
1. Next.js 16 usa Turbopack por padrão, incompatível com `@ducanh2912/next-pwa` que injeta config webpack — resolvido com `next build --webpack`
2. `vercel env add ... preview` com `--yes` está com bug na CLI v51.6.1 (exige branch mas ignora a flag) — workaround: adicionar via dashboard

## Limitações conhecidas
- Plan Hobby: timeout 10s pode estourar em áudio longo + Claude lento (maxDuration=60 só vale no Pro)
- Sem auth: URL aberta a qualquer um com o link
- Áudio (Whisper) desativado enquanto não tiver OPENAI_API_KEY com crédito
- Preview branches sem ANTHROPIC_API_KEY até fix manual no dashboard

## Como operar

### Logs
```bash
vercel logs https://emissao-de-proposta-cath.vercel.app
```

### Reverter deploy
```bash
vercel rollback
```

### Adicionar env var nova
```bash
vercel env add NOME_VAR production
```

### Forçar rebuild
```bash
git commit --allow-empty -m "chore: trigger rebuild" && git push origin main
```

## Próximos passos (pré-PRP-003)
- [ ] Smoke test completo no celular do Lucas
- [ ] Adicionar ANTHROPIC_API_KEY em preview via dashboard Vercel
- [ ] Avaliar upgrade para Pro se latência Claude estourar 10s no Hobby
- [ ] Custom domain (opcional)
- [ ] Auth via Google (PRP-AUTH)
- [ ] Template Google Slides (PRP-003)
- [ ] OPENAI_API_KEY quando áudio entrar no escopo
