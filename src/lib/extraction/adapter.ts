import type { ProdutoExtraido } from '@/lib/schemas/produto'
import type { Produto } from '@/lib/pricing/types'

export function extracaoToProduto(p: ProdutoExtraido): Produto {
  return { valor_unitario: p.valor_unitario, quantidade: p.quantidade }
}
