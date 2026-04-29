'use client'

import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { ClienteSchema, type ClienteForm } from '@/lib/schemas/proposta-form'
import { makeZodResolver } from '@/lib/utils/zod-resolver'

interface FormClienteProps {
  defaultValues: ClienteForm
  onChange: (data: ClienteForm) => void
}

export function FormCliente({ defaultValues, onChange }: FormClienteProps) {
  const {
    register,
    getValues,
    formState: { errors },
  } = useForm<ClienteForm>({
    resolver: makeZodResolver(ClienteSchema),
    defaultValues,
    mode: 'onBlur',
  })

  function handleBlur() {
    onChange(getValues())
  }

  return (
    <fieldset className="space-y-4">
      <legend className="text-base font-semibold text-slate-900">Dados do cliente</legend>

      <div className="space-y-1">
        <label htmlFor="cliente_nome" className="text-sm font-medium text-slate-700">
          Nome <span className="text-red-500">*</span>
        </label>
        <Input
          id="cliente_nome"
          {...register('nome')}
          onBlur={handleBlur}
          placeholder="Nome completo"
          className="h-11"
          style={{ fontSize: '16px' }}
          aria-required="true"
          aria-invalid={!!errors.nome}
        />
        {errors.nome && (
          <p className="text-xs text-red-600" role="alert">
            {errors.nome.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="cliente_empresa" className="text-sm font-medium text-slate-700">
          Empresa <span className="text-slate-400">(opcional)</span>
        </label>
        <Input
          id="cliente_empresa"
          {...register('empresa')}
          onBlur={handleBlur}
          placeholder="Razão social ou nome fantasia"
          className="h-11"
          style={{ fontSize: '16px' }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label htmlFor="cliente_telefone" className="text-sm font-medium text-slate-700">
            Telefone
          </label>
          <Input
            id="cliente_telefone"
            type="tel"
            {...register('telefone')}
            onBlur={handleBlur}
            placeholder="(11) 99999-9999"
            className="h-11"
            style={{ fontSize: '16px' }}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="cliente_email" className="text-sm font-medium text-slate-700">
            Email
          </label>
          <Input
            id="cliente_email"
            type="email"
            inputMode="email"
            {...register('email')}
            onBlur={handleBlur}
            placeholder="email@exemplo.com"
            className="h-11"
            style={{ fontSize: '16px' }}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-xs text-red-600" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>
    </fieldset>
  )
}
