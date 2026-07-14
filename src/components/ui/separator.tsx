import type { ValidComponent, VoidProps } from 'solid-js'
import { splitProps } from 'solid-js'
import type { PolymorphicProps } from '@kobalte/core/polymorphic'
import * as SeparatorPrimitive from '@kobalte/core/separator'

import { cn } from '@/lib/utils'

type separatorRootProps<T extends ValidComponent = 'hr'> = VoidProps<
  SeparatorPrimitive.SeparatorRootProps<T> & { class?: string }
>

const Separator = <T extends ValidComponent = 'hr'>(
  props: PolymorphicProps<T, separatorRootProps<T>>,
) => {
  const [local, others] = splitProps(props as separatorRootProps, ['class'])
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      class={cn(
        'shrink-0 border-none bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
        local.class,
      )}
      {...others}
    />
  )
}

export { Separator }
