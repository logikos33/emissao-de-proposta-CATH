import { describe, expect, it } from 'vitest'
import { registrarOrcamentoTool } from '../tool-schema'

describe('registrarOrcamentoTool', () => {
  it('tem name = registrar_orcamento', () => {
    expect(registrarOrcamentoTool.name).toBe('registrar_orcamento')
  })

  it('tem description não vazia', () => {
    expect(registrarOrcamentoTool.description.length).toBeGreaterThan(10)
  })

  it('input_schema é objeto com type = object', () => {
    expect(registrarOrcamentoTool.input_schema).toHaveProperty('type', 'object')
  })

  it('input_schema contém properties dos campos do orçamento', () => {
    const props = (registrarOrcamentoTool.input_schema as { properties?: Record<string, unknown> })
      .properties
    expect(props).toHaveProperty('fornecedor_principal')
    expect(props).toHaveProperty('itens')
  })
})
