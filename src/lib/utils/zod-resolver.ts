import type { FieldErrors, FieldValues, Resolver } from 'react-hook-form'
import type { z } from 'zod'

export function makeZodResolver<TSchema extends z.ZodType<FieldValues>>(
  schema: TSchema,
): Resolver<z.infer<TSchema>> {
  return async (values) => {
    const result = schema.safeParse(values)
    if (result.success) {
      return { values: result.data as z.infer<TSchema>, errors: {} }
    }
    const errors: Record<string, { type: string; message: string }> = {}
    for (const issue of result.error.issues) {
      const path = issue.path.join('.')
      if (path && !(path in errors)) {
        errors[path] = { type: 'validation', message: issue.message }
      }
    }
    // Cast: FieldErrors<T> is a deep mapped type — our flat record is runtime-compatible
    return { values: {} as Record<string, never>, errors: errors as FieldErrors<z.infer<TSchema>> }
  }
}
