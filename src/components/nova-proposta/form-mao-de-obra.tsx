'use client'

import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { MaoDeObraSchema, type MaoDeObraForm } from '@/lib/schemas/proposta-form'
import { makeZodResolver } from '@/lib/utils/zod-resolver'
import { formatBRL, parseBRL } from '@/lib/utils/currency'

interface FormMaoDeObraProps {
  defaultValues: MaoDeObraForm
  onChange: (data: MaoDeObraForm) => void
}

export function FormMaoDeObra({ defaultValues, onChange }: FormMaoDeObraProps) {
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<MaoDeObraForm>({
    resolver: makeZodResolver(MaoDeObraSchema),
    defaultValues,
    mode: 'onBlur',
  })

  function handleBlur() {
    onChange(getValues())
  }

  return (
    <fieldset className="space-y-4">
      <legend className="text-base font-semibold text-slate-900">Mão de obra</legend>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label htmlFor="taxa_hora" className="text-sm font-medium text-slate-700">
            Taxa / hora
          </label>
          <Input
            id="taxa_hora"
            inputMode="decimal"
            defaultValue={formatBRL(defaultValues.taxa_hora)}
            onChange={(e) => {
              setValue('taxa_hora', parseBRL(e.target.value))
            }}
            onBlur={handleBlur}
            className="h-11"
            style={{ fontSize: '16px' }}
            aria-invalid={!!errors.taxa_hora}
          />
          {errors.taxa_hora && <p className="text-xs text-red-600">{errors.taxa_hora.message}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="horas_estimadas" className="text-sm font-medium text-slate-700">
            Horas estimadas
          </label>
          <Input
            id="horas_estimadas"
            type="number"
            min={0}
            step={0.5}
            {...register('horas_estimadas', { valueAsNumber: true })}
            onBlur={handleBlur}
            className="h-11"
            style={{ fontSize: '16px' }}
            aria-invalid={!!errors.horas_estimadas}
          />
          {errors.horas_estimadas && (
            <p className="text-xs text-red-600">{errors.horas_estimadas.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="descricao_mdo" className="text-sm font-medium text-slate-700">
          Descrição <span className="text-slate-400">(opcional)</span>
        </label>
        <Input
          id="descricao_mdo"
          {...register('descricao')}
          onBlur={handleBlur}
          placeholder="Ex: instalação e configuração"
          className="h-11"
          style={{ fontSize: '16px' }}
        />
      </div>
    </fieldset>
  )
}
