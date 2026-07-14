import type { ValidComponent } from 'solid-js'
import { splitProps } from 'solid-js'
import * as DropdownMenuPrimitive from '@kobalte/core/dropdown-menu'
import type { PolymorphicProps } from '@kobalte/core/polymorphic'

import { cn } from '@/lib/utils'

const DropdownMenu = (props: DropdownMenuPrimitive.DropdownMenuRootProps) => {
  return <DropdownMenuPrimitive.Root gutter={4} {...props} />
}

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

type dropdownMenuContentProps<T extends ValidComponent = 'div'> =
  DropdownMenuPrimitive.DropdownMenuContentProps<T> & { class?: string }

const DropdownMenuContent = <T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, dropdownMenuContentProps<T>>,
) => {
  const [local, others] = splitProps(props as dropdownMenuContentProps, ['class'])
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        class={cn(
          'z-50 max-h-(--kb-popper-content-available-height) min-w-32 origin-(--kb-menu-content-transform-origin) animate-menu-in overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none',
          local.class,
        )}
        {...others}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

type dropdownMenuItemProps<T extends ValidComponent = 'div'> =
  DropdownMenuPrimitive.DropdownMenuItemProps<T> & {
    class?: string
    variant?: 'default' | 'destructive'
  }

const DropdownMenuItem = <T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, dropdownMenuItemProps<T>>,
) => {
  const [local, others] = splitProps(props as dropdownMenuItemProps, ['class', 'variant'])
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-variant={local.variant ?? 'default'}
      class={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-accent data-highlighted:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:data-highlighted:bg-destructive/10 data-[variant=destructive]:data-highlighted:text-destructive dark:data-[variant=destructive]:data-highlighted:bg-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:[&_svg]:text-destructive",
        local.class,
      )}
      {...others}
    />
  )
}

type dropdownMenuLabelProps<T extends ValidComponent = 'span'> =
  DropdownMenuPrimitive.DropdownMenuGroupLabelProps<T> & { class?: string }

const DropdownMenuLabel = <T extends ValidComponent = 'span'>(
  props: PolymorphicProps<T, dropdownMenuLabelProps<T>>,
) => {
  const [local, others] = splitProps(props as dropdownMenuLabelProps, ['class'])
  return (
    <DropdownMenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      class={cn('block px-2 py-1.5 text-sm font-medium', local.class)}
      {...others}
    />
  )
}

type dropdownMenuSeparatorProps<T extends ValidComponent = 'hr'> =
  DropdownMenuPrimitive.DropdownMenuSeparatorProps<T> & { class?: string }

const DropdownMenuSeparator = <T extends ValidComponent = 'hr'>(
  props: PolymorphicProps<T, dropdownMenuSeparatorProps<T>>,
) => {
  const [local, others] = splitProps(props as dropdownMenuSeparatorProps, ['class'])
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      class={cn('-mx-1 my-1 h-px border-none bg-border', local.class)}
      {...others}
    />
  )
}

const DropdownMenuGroup = DropdownMenuPrimitive.Group

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
}
