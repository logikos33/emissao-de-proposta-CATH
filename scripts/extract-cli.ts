#!/usr/bin/env tsx
import { readFileSync } from 'node:fs'
import { calcularProposta } from '../src/lib/pricing'
import { extracaoToProduto, extrairOrcamento } from '../src/lib/extraction'
import type { EntradaExtracao } from '../src/lib/extraction'

const MIME_BY_EXT: Record<string, string> = {
  pdf: 'application/pdf',
  mp3: 'audio/mpeg',
  mp4: 'audio/mp4',
  wav: 'audio/wav',
  m4a: 'audio/x-m4a',
  webm: 'audio/webm',
  mpga: 'audio/mpeg',
}

function buildEntrada(arg: string): EntradaExtracao {
  try {
    const buffer = readFileSync(arg)
    const ext = arg.split('.').pop()?.toLowerCase() ?? ''
    return { buffer, mimeType: MIME_BY_EXT[ext] ?? 'application/octet-stream', nomeArquivo: arg }
  } catch {
    return { texto: arg }
  }
}

function fmt(v: number): string {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

async function main(): Promise<void> {
  const arg = process.argv[2]
  if (!arg) {
    console.error('Uso: pnpm extract <arquivo.pdf|audio.mp3> ou "texto do orçamento"')
    process.exit(1)
  }

  console.log('Extraindo orçamento...\n')
  const { orcamento, meta } = await extrairOrcamento(buildEntrada(arg))

  console.log(`Fornecedor : ${orcamento.fornecedor_principal ?? '(não identificado)'}`)
  console.log(`Data       : ${orcamento.data_orcamento ?? '(não informada)'}`)
  console.log(`Validade   : ${orcamento.validade ?? '(não informada)'}`)
  console.log(`Tipo       : ${meta.tipo_entrada}  |  Tentativas: ${meta.tentativas}`)
  console.log(
    `Confidence : ${(meta.confidence_media * 100).toFixed(1)}%${meta.requires_review ? '  ⚠ REVISÃO RECOMENDADA' : ''}`,
  )
  console.log()

  console.log('Itens extraídos:')
  console.log('─'.repeat(72))
  for (const item of orcamento.itens) {
    const conf = `${(item.confidence * 100).toFixed(0)}%`
    const total = fmt(item.valor_unitario * item.quantidade)
    console.log(`  ${item.nome}`)
    console.log(
      `    ${item.quantidade} ${item.unidade ?? 'un'} × ${fmt(item.valor_unitario)} = ${total}  [conf: ${conf}]`,
    )
    if (item.observacao) console.log(`    Obs: ${item.observacao}`)
  }
  console.log()

  const proposta = calcularProposta(orcamento.itens.map(extracaoToProduto))
  console.log('Proposta calculada (markup padrão 45%):')
  console.log('─'.repeat(72))
  console.log(`  Subtotal produtos : ${fmt(proposta.subtotal_produtos)}`)
  console.log(`  Total markup      : ${fmt(proposta.total_markup)}`)
  console.log(`  Total mão de obra : ${fmt(proposta.total_mao_de_obra)}`)
  console.log(`  TOTAL GERAL       : ${fmt(proposta.total_geral)}`)
  console.log(`  Itens: ${proposta.quantidade_itens}  |  Unidades: ${proposta.quantidade_unidades}`)
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})
