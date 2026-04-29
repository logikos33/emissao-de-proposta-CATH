import { describe, expect, it } from 'vitest'
import { registrarOrcamentoTool } from '../tool-schema'

describe('registrarOrcamentoTool', () => {
  it('tem type = function', () => {
    expect(registrarOrcamentoTool.type).toBe('function')
  })

  it('tem name = registrar_orcamento', () => {
    expect(registrarOrcamentoTool.function.name).toBe('registrar_orcamento')
  })

  it('tem description não vazia', () => {
    expect(registrarOrcamentoTool.function.description.length).toBeGreaterThan(10)
  })

  it('parameters é objeto com type = object', () => {
    expect(registrarOrcamentoTool.function.parameters).toHaveProperty('type', 'object')
  })

  it('parameters contém properties dos campos do orçamento', () => {
    const props = (
      registrarOrcamentoTool.function.parameters as { properties?: Record<string, unknown> }
    ).properties
    expect(props).toHaveProperty('fornecedor_principal')
    expect(props).toHaveProperty('itens')
  })
})
