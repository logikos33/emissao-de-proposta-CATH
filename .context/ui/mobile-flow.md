# Fluxo Mobile — 4 Telas

Todas as telas são mobile-first (375px mínimo), sem scroll horizontal, touch-friendly (mínimo 44px de altura em elementos interativos).

## Tela 1: Upload

**Rota:** `/propostas/nova`

**Elementos:**

- Título: "Novo orçamento"
- 3 botões grandes (full-width, empilhados):
  - "Enviar PDF" → abre file picker (accept=".pdf")
  - "Colar texto" → abre textarea
  - "Gravar áudio" → abre gravador ou file picker (accept="audio/\*")
- Loading state: spinner + "Extraindo produtos..." (enquanto Claude processa)

**Transição:** após extração bem-sucedida → Tela 2

---

## Tela 2: Revisão de produtos

**Rota:** `/propostas/nova/revisao`

**Elementos:**

- Título: "Revise os produtos"
- Lista de cards (um por produto extraído):
  - Nome (editável inline)
  - Qtd + Unidade (editável)
  - Valor unitário R$ (editável)
  - Botão remover (ícone trash)
- Botão flutuante: "+ Adicionar produto manualmente"
- Botão fixo no rodapé: "Continuar →"

**Validação:** bloquear "Continuar" se qualquer `valor_unitario` for 0 ou negativo.

---

## Tela 3: Mão de obra

**Rota:** `/propostas/nova/mao-de-obra`

**Elementos:**

- Título: "Mão de obra por item"
- Subtítulo: "Markup de 45% já aplicado. Adicione mão de obra se necessário."
- Lista de cards (mesmos produtos da Tela 2):
  - Nome do produto (readonly)
  - Campo R$ mão de obra (default: 0, editável)
  - Preview do valor final calculado em tempo real
- Campo: "Condições de pagamento" (select com enum)
- Campo: "Observações" (textarea, opcional)
- Botão fixo no rodapé: "Gerar proposta →"

---

## Tela 4: Preview e download

**Rota:** `/propostas/[id]`

**Elementos:**

- Título: "Proposta gerada"
- Card com resumo: cliente, data, total, condições
- Botão primário: "Baixar PDF" (abre link do Drive)
- Botão secundário: "Copiar link" (clipboard)
- Botão terciário: "Nova proposta" (volta à Tela 1)

**Estado de loading:** "Gerando apresentação..." enquanto Slides/Drive processa.
