import type { JSX, ValidComponent } from 'solid-js'
import { splitProps } from 'solid-js'
import * as DialogPrimitive from '@kobalte/core/dialog'
import type { PolymorphicProps } from '@kobalte/core/polymorphic'
import { X } from 'lucide-solid'

import { cn } from '@/lib/utils'

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger

type dialogContentProps<T extends ValidComponent = 'div'> =
  DialogPrimitive.DialogContentProps<T> & {
    class?: string
    children?: JSX.Element
  }

const DialogContent = <T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, dialogContentProps<T>>,
) => {
  const [local, others] = splitProps(props as dialogContentProps, ['class', 'children'])
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        data-slot="dialog-overlay"
        class="fixed inset-0 z-50 animate-overlay-in bg-black/50"
      />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        class={cn(
          'fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] animate-content-in gap-4 rounded-lg border bg-background p-6 shadow-lg sm:max-w-lg',
          local.class,
        )}
        {...others}
      >
        {local.children}
        <DialogPrimitive.CloseButton
          data-slot="dialog-close"
          class="absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity outline-none hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0"
        >
          <X class="size-4" />
          <span class="sr-only">Close</span>
        </DialogPrimitive.CloseButton>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

const DialogHeader = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['class'])
  return (
    <div
      data-slot="dialog-header"
      class={cn('flex flex-col gap-2 text-center sm:text-left', local.class)}
      {...others}
    />
  )
}

const DialogFooter = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['class'])
  return (
    <div
      data-slot="dialog-footer"
      class={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', local.class)}
      {...others}
    />
  )
}

type dialogTitleProps<T extends ValidComponent = 'h2'> = DialogPrimitive.DialogTitleProps<T> & {
  class?: string
}

const DialogTitle = <T extends ValidComponent = 'h2'>(
  props: PolymorphicProps<T, dialogTitleProps<T>>,
) => {
  const [local, others] = splitProps(props as dialogTitleProps, ['class'])
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      class={cn('text-lg leading-none font-semibold', local.class)}
      {...others}
    />
  )
}

type dialogDescriptionProps<T extends ValidComponent = 'p'> =
  DialogPrimitive.DialogDescriptionProps<T> & { class?: string }

const DialogDescription = <T extends ValidComponent = 'p'>(
  props: PolymorphicProps<T, dialogDescriptionProps<T>>,
) => {
  const [local, others] = splitProps(props as dialogDescriptionProps, ['class'])
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      class={cn('text-sm text-muted-foreground', local.class)}
      {...others}
    />
  )
}

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
