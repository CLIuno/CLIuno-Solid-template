import type { ValidComponent } from 'solid-js'
import { splitProps } from 'solid-js'
import * as ImagePrimitive from '@kobalte/core/image'
import type { PolymorphicProps } from '@kobalte/core/polymorphic'

import { cn } from '@/lib/utils'

type avatarRootProps<T extends ValidComponent = 'span'> = ImagePrimitive.ImageRootProps<T> & {
  class?: string
}

const Avatar = <T extends ValidComponent = 'span'>(
  props: PolymorphicProps<T, avatarRootProps<T>>,
) => {
  const [local, others] = splitProps(props as avatarRootProps, ['class'])
  return (
    <ImagePrimitive.Root
      data-slot="avatar"
      class={cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', local.class)}
      {...others}
    />
  )
}

type avatarImageProps<T extends ValidComponent = 'img'> = ImagePrimitive.ImageImgProps<T> & {
  class?: string
}

const AvatarImage = <T extends ValidComponent = 'img'>(
  props: PolymorphicProps<T, avatarImageProps<T>>,
) => {
  const [local, others] = splitProps(props as avatarImageProps, ['class'])
  return (
    <ImagePrimitive.Img
      data-slot="avatar-image"
      class={cn('aspect-square size-full object-cover', local.class)}
      {...others}
    />
  )
}

type avatarFallbackProps<T extends ValidComponent = 'span'> =
  ImagePrimitive.ImageFallbackProps<T> & { class?: string }

const AvatarFallback = <T extends ValidComponent = 'span'>(
  props: PolymorphicProps<T, avatarFallbackProps<T>>,
) => {
  const [local, others] = splitProps(props as avatarFallbackProps, ['class'])
  return (
    <ImagePrimitive.Fallback
      data-slot="avatar-fallback"
      class={cn(
        'flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground select-none',
        local.class,
      )}
      {...others}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
