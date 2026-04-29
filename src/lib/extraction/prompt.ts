import type { TipoEntrada } from './types'

export function buildSystemPrompt(): string {
  return `Você é um extrator especializado de orçamentos de fornecedores em português brasileiro.
Analise o documento fornecido e extraia todos os itens usando a ferramenta registrar_orcamento.

Regras:
- Extraia TODOS os itens listados
- valor_unitario: float positivo em BRL (ex: 85.5, não "R$ 85,50")
- quantidade: inteiro positivo
- unidade: normalizada ("un", "rolo", "m", "kg", "caixa") ou null se ausente
- confidence: 0.0 (incerto) a 1.0 (certeza absoluta) — por item
- Campos ausentes no documento: null
- Datas: ISO 8601 (ex: "2024-03-15") ou null
- Use SEMPRE a ferramenta registrar_orcamento

Exemplo:

Entrada: "Orçamento Elétrica Central - 10/01/2024
- Cabo PP 2x1,5mm²: 50m a R$ 3,20/m
- Tomada 2P+T Tramontina: 12 un a R$ 8,50
Validade: 15 dias"

Saída esperada da ferramenta:
{
  "fornecedor_principal": "Elétrica Central",
  "data_orcamento": "2024-01-10",
  "validade": "2024-01-25",
  "itens": [
    {
      "nome": "Cabo PP 2x1,5mm²",
      "descricao": null,
      "quantidade": 50,
      "unidade": "m",
      "valor_unitario": 3.20,
      "fornecedor": "Elétrica Central",
      "observacao": null,
      "confidence": 0.96
    },
    {
      "nome": "Tomada 2P+T Tramontina",
      "descricao": null,
      "quantidade": 12,
      "unidade": "un",
      "valor_unitario": 8.50,
      "fornecedor": "Elétrica Central",
      "observacao": null,
      "confidence": 0.98
    }
  ],
  "observacoes_gerais": null
}`
}

export function buildUserPrompt(tipo: TipoEntrada, texto?: string, zodErro?: string): string {
  let base: string

  if (tipo === 'pdf') {
    base = 'Extraia os dados do orçamento do PDF em anexo.'
  } else if (tipo === 'audio') {
    base = `Extraia os dados do orçamento da transcrição de áudio abaixo:\n\n${texto ?? ''}`
  } else {
    base = `Extraia os dados do orçamento do texto abaixo:\n\n${texto ?? ''}`
  }

  if (!zodErro) return base

  return `${base}

ATENÇÃO: a extração anterior falhou na validação com os seguintes erros:
${zodErro}

Corrija os problemas e retorne dados válidos.`
}
