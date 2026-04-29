# Fluxo de Negócio — Proposta Cath

## Contexto

O colaborador da Cath visita clientes, levanta demanda de produtos, pede orçamento ao fornecedor e precisa gerar uma proposta formal para o cliente. Hoje esse processo é 100% manual.

## Atores

- **Colaborador**: usuário primário, opera pelo celular no campo
- **Fornecedor**: envia orçamento em PDF, texto ou por mensagem de áudio
- **Cliente**: recebe a proposta final em PDF

## Passos do fluxo

### 1. Entrada do orçamento

O colaborador recebe o orçamento do fornecedor em um dos formatos:

- **PDF**: arquivo recebido por WhatsApp ou e-mail
- **Texto colado**: conteúdo de e-mail ou mensagem copiado para o campo de texto
- **Áudio**: gravação de voz do fornecedor ditando os produtos e preços

### 2. Pré-processamento

- **Se áudio**: Whisper API transcreve o áudio para texto
- **Se PDF**: enviado diretamente para Claude como `document` source (suporte nativo)
- **Se texto**: enviado diretamente para Claude como mensagem de usuário

### 3. Extração estruturada (Claude API)

Claude extrai os dados do orçamento e retorna um JSON estruturado via tool use:

```json
[
  {
    "nome": "Cabo de aço 3/8\"",
    "descricao": "Rolo 50m galvanizado",
    "qtd": 10,
    "unidade": "rolo",
    "valor_unitario": 85.5,
    "fornecedor": "Distribuidora XYZ",
    "observacao": null
  }
]
```

Regra: campo ausente no orçamento = `null`. Nunca alucinar valores.

### 4. Revisão na UI mobile

O colaborador vê a lista de produtos extraídos e pode:

- Editar qualquer campo (nome, qtd, valor, unidade)
- Adicionar mão de obra por item (valor fixo em R$)
- Remover itens incorretos
- Adicionar itens manualmente

### 5. Cálculo de pricing

Para cada item:

```
valor_final = (valor_unitario × (1 + markup)) + mao_de_obra
```

- `markup` padrão: 0.45 (45%)
- `markup` pode ser sobrescrito por item via `markup_override`
- Arredondamento: 2 casas decimais em BRL

### 6. Geração da proposta (Google Slides)

- Duplica o template Slides da Cath no Drive (<!-- CONFIRMAR COM LUCAS -->)
- Preenche placeholders via `batchUpdate`:
  - `{{cliente}}`, `{{data}}`, `{{colaborador}}`
  - Tabela de produtos com valores finais
  - Total geral e condições de pagamento
- Exporta como PDF via Drive API

### 7. Entrega

O colaborador recebe o link do PDF e compartilha com o cliente via WhatsApp ou e-mail.

## Condições de pagamento (enum)

```
'a_vista'    → "À vista"
'30d'        → "30 dias"
'30_60'      → "30/60 dias"
'30_60_90'   → "30/60/90 dias"
```
