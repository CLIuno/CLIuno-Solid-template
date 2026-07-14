import type { ValidComponent, VoidProps } from 'solid-js'
import { splitProps } from 'solid-js'
import * as CheckboxPrimitive from '@kobalte/core/checkbox'
import type { PolymorphicProps } from '@kobalte/core/polymorphic'
import { Check } from 'lucide-solid'

import { cn } from '@/lib/utils'

type checkboxRootProps<T extends ValidComponent = 'div'> = VoidProps<
  CheckboxPrimitive.CheckboxRootProps<T> & { class?: string }
>

const Checkbox = <T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, checkboxRootProps<T>>,
) => {
  const [local, others] = splitProps(props as checkboxRootProps, ['class'])
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      class={cn('inline-flex items-center', local.class)}
      {...others}
    >
      <CheckboxPrimitive.Input class="peer" />
      <CheckboxPrimitive.Control
        data-slot="checkbox-control"
        class="size-4 shrink-0 rounded-[4px] border border-input shadow-xs transition-shadow outline-none peer-focus-visible:border-ring peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground data-disabled:cursor-not-allowed data-disabled:opacity-50 dark:bg-input/30 dark:data-checked:bg-primary"
      >
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-indicator"
          class="grid place-content-center text-current transition-none"
        >
          <Check class="size-3.5" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Control>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
