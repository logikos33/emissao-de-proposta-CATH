import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-slate-50 px-4">
      <main className="flex flex-col items-center text-center gap-6 max-w-sm py-20">
        {/* TODO(design): substituir por logo real */}
        <div className="text-4xl font-bold text-slate-900">CATH</div>
        <p className="text-lg text-slate-600 leading-relaxed">
          Gere propostas comerciais profissionais a partir de orçamentos de fornecedores.
        </p>
        <Link
          href="/nova-proposta/upload"
          className="flex min-h-[44px] items-center justify-center rounded-full bg-slate-900 px-8 text-base font-semibold text-white transition-colors hover:bg-slate-800 w-full"
        >
          Criar nova proposta
        </Link>
      </main>
    </div>
  )
}
