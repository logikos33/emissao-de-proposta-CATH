import { formatBRL } from '@/lib/utils/currency'
import { CONDICAO_PAGAMENTO_LABELS } from '@/lib/schemas/proposta-form'
import type {
  ItemEditado,
  ClienteForm,
  MaoDeObraForm,
  CondicaoPagamento,
} from '@/lib/schemas/proposta-form'

interface PropostaPreviewProps {
  itens: ItemEditado[]
  cliente: ClienteForm
  maoDeObra: MaoDeObraForm
  condicaoPagamento: CondicaoPagamento
  validadeDias: number
  dataEmissao: Date
}

export function PropostaPreview({
  itens,
  cliente,
  maoDeObra,
  condicaoPagamento,
  validadeDias,
  dataEmissao,
}: PropostaPreviewProps) {
  const subtotalItens = itens.reduce((s, i) => s + i.valor_unitario * i.quantidade, 0)
  const totalMdo = maoDeObra.taxa_hora * maoDeObra.horas_estimadas
  const totalGeral = subtotalItens + totalMdo

  const formatData = (d: Date) =>
    d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

  const vencimento = new Date(dataEmissao)
  vencimento.setDate(vencimento.getDate() + validadeDias)

  return (
    <div className="proposta-preview bg-white p-8 max-w-2xl mx-auto space-y-8 print:p-0 print:max-w-full">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between border-b border-slate-200 pb-6">
        <div>
          {/* TODO(design): substituir por logo real */}
          <div className="text-2xl font-bold text-slate-900">CATH</div>
          <p className="text-xs text-slate-400 mt-0.5">Proposta Comercial</p>
        </div>
        <div className="text-right text-sm text-slate-600 space-y-0.5">
          <p>Emissão: {formatData(dataEmissao)}</p>
          <p>Validade: {formatData(vencimento)}</p>
        </div>
      </div>

      {/* Cliente */}
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Cliente</p>
        <p className="text-base font-semibold text-slate-900">{cliente.nome}</p>
        {cliente.empresa && <p className="text-sm text-slate-600">{cliente.empresa}</p>}
        {cliente.telefone && <p className="text-sm text-slate-600">{cliente.telefone}</p>}
        {cliente.email && <p className="text-sm text-slate-600">{cliente.email}</p>}
      </div>

      {/* Itens */}
      <div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wide">
              <th className="pb-2 text-left font-medium">Descrição</th>
              <th className="pb-2 text-center font-medium w-14">Qtd</th>
              <th className="pb-2 text-right font-medium w-24">Unit.</th>
              <th className="pb-2 text-right font-medium w-24">Total</th>
            </tr>
          </thead>
          <tbody>
            {itens.map((item) => (
              <tr key={item.id} className="border-b border-slate-100 last:border-0">
                <td className="py-2 pr-4">{item.descricao}</td>
                <td className="py-2 text-center">{item.quantidade}</td>
                <td className="py-2 text-right">{formatBRL(item.valor_unitario)}</td>
                <td className="py-2 text-right font-medium">
                  {formatBRL(item.valor_unitario * item.quantidade)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totais */}
      <div className="space-y-1 pt-2 border-t border-slate-200">
        <div className="flex justify-between text-sm text-slate-600">
          <span>Subtotal materiais</span>
          <span>{formatBRL(subtotalItens)}</span>
        </div>
        {totalMdo > 0 && (
          <div className="flex justify-between text-sm text-slate-600">
            <span>
              Mão de obra
              {maoDeObra.descricao && ` (${maoDeObra.descricao})`}
            </span>
            <span>{formatBRL(totalMdo)}</span>
          </div>
        )}
        <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
          <span>Total geral</span>
          <span>{formatBRL(totalGeral)}</span>
        </div>
      </div>

      {/* Condições */}
      <div className="text-sm text-slate-600 space-y-1 pt-2 border-t border-slate-100">
        <p>
          <span className="font-medium">Pagamento:</span>{' '}
          {CONDICAO_PAGAMENTO_LABELS[condicaoPagamento]}
        </p>
        <p>
          <span className="font-medium">Validade da proposta:</span> {validadeDias} dias
        </p>
      </div>
    </div>
  )
}
