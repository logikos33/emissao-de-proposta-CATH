import { z } from 'zod'
import { OrcamentoExtraidoSchema } from '@/lib/schemas/produto'

function buildInputSchema(): Record<string, unknown> {
  const full = z.toJSONSchema(OrcamentoExtraidoSchema) as Record<string, unknown>
  delete full['$schema']
  return full
}

export const registrarOrcamentoTool = {
  name: 'registrar_orcamento',
  description:
    'Registra os dados estruturados extraídos de um orçamento de fornecedor, incluindo todos os itens com preços, quantidades e confiança por linha.',
  input_schema: buildInputSchema(),
}
