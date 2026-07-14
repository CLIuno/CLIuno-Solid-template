import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

import { cn } from '@/lib/utils'

const Label = (props: JSX.LabelHTMLAttributes<HTMLLabelElement>) => {
  const [local, others] = splitProps(props, ['class'])
  return (
    <label
      data-slot="label"
      class={cn(
        'flex items-center gap-2 text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        local.class,
      )}
      {...others}
    />
  )
}

export { Label }
