import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  ClienteForm,
  CondicaoPagamento,
  ItemEditado,
  MaoDeObraForm,
} from '@/lib/schemas/proposta-form'
import type { ResultadoExtracao } from '@/lib/extraction/types'

type ExtracaoState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; resultado: ResultadoExtracao }
  | { status: 'error'; mensagem: string }

interface PropostaState {
  itens: ItemEditado[]
  maoDeObra: MaoDeObraForm
  cliente: ClienteForm
  condicaoPagamento: CondicaoPagamento
  validadeDias: number
  extracao: ExtracaoState
  totalCalculado: number
}

interface PropostaActions {
  setItens: (itens: ItemEditado[]) => void
  updateItem: (id: string, patch: Partial<Omit<ItemEditado, 'id'>>) => void
  removeItem: (id: string) => void
  addItem: (item: ItemEditado) => void
  setMaoDeObra: (maoDeObra: MaoDeObraForm) => void
  setCliente: (cliente: ClienteForm) => void
  setCondicaoPagamento: (condicao: CondicaoPagamento) => void
  setValidadeDias: (dias: number) => void
  iniciarExtracao: () => void
  concluirExtracao: (resultado: ResultadoExtracao) => void
  falharExtracao: (mensagem: string) => void
  resetar: () => void
}

function calcularTotal(itens: ItemEditado[], maoDeObra: MaoDeObraForm): number {
  const subtotalItens = itens.reduce((acc, i) => acc + i.valor_unitario * i.quantidade, 0)
  const totalMdo = maoDeObra.taxa_hora * maoDeObra.horas_estimadas
  return subtotalItens + totalMdo
}

const INITIAL_MAO_DE_OBRA: MaoDeObraForm = {
  taxa_hora: 0,
  horas_estimadas: 0,
  descricao: '',
}

const INITIAL_CLIENTE: ClienteForm = {
  nome: '',
  empresa: '',
  telefone: '',
  email: '',
}

const INITIAL_STATE: PropostaState = {
  itens: [],
  maoDeObra: INITIAL_MAO_DE_OBRA,
  cliente: INITIAL_CLIENTE,
  condicaoPagamento: 'a_vista',
  validadeDias: 30,
  extracao: { status: 'idle' },
  totalCalculado: 0,
}

export const usePropostaStore = create<PropostaState & PropostaActions>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      setItens: (itens) =>
        set((s) => ({ itens, totalCalculado: calcularTotal(itens, s.maoDeObra) })),

      updateItem: (id, patch) =>
        set((s) => {
          const itens = s.itens.map((item) => (item.id === id ? { ...item, ...patch } : item))
          return { itens, totalCalculado: calcularTotal(itens, s.maoDeObra) }
        }),

      removeItem: (id) =>
        set((s) => {
          const itens = s.itens.filter((item) => item.id !== id)
          return { itens, totalCalculado: calcularTotal(itens, s.maoDeObra) }
        }),

      addItem: (item) =>
        set((s) => {
          const itens = [...s.itens, item]
          return { itens, totalCalculado: calcularTotal(itens, s.maoDeObra) }
        }),

      setMaoDeObra: (maoDeObra) =>
        set((s) => ({ maoDeObra, totalCalculado: calcularTotal(s.itens, maoDeObra) })),

      setCliente: (cliente) => set({ cliente }),

      setCondicaoPagamento: (condicaoPagamento) => set({ condicaoPagamento }),

      setValidadeDias: (validadeDias) => set({ validadeDias }),

      iniciarExtracao: () => set({ extracao: { status: 'loading' } }),

      concluirExtracao: (resultado) => {
        const itens: ItemEditado[] = resultado.orcamento.itens.map((p, idx) => ({
          id: `item-${idx}-${Date.now()}`,
          descricao: p.nome,
          quantidade: p.quantidade,
          valor_unitario: p.valor_unitario,
          unidade: p.unidade,
          confidence: p.confidence,
          requires_review: p.confidence < 0.6,
        }))
        set((s) => ({
          extracao: { status: 'success', resultado },
          itens,
          totalCalculado: calcularTotal(itens, s.maoDeObra),
        }))
      },

      falharExtracao: (mensagem) => set({ extracao: { status: 'error', mensagem } }),

      resetar: () => set({ ...INITIAL_STATE }),
    }),
    {
      name: 'cath-proposta-rascunho-v1',
      // Nunca persistir estado de loading — reset para idle no hydrate
      partialize: (state) => ({
        itens: state.itens,
        maoDeObra: state.maoDeObra,
        cliente: state.cliente,
        condicaoPagamento: state.condicaoPagamento,
        validadeDias: state.validadeDias,
        totalCalculado: state.totalCalculado,
        extracao:
          state.extracao.status === 'loading' ? { status: 'idle' as const } : state.extracao,
      }),
    },
  ),
)
