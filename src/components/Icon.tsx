import type { Component } from 'solid-js'

declare module 'solid-js' {
  namespace JSX {
    interface IntrinsicElements {
      'iconify-icon': {
        icon: string
        class?: string
        width?: string | number
        height?: string | number
      }
    }
  }
}

const Icon: Component<{ icon: string; class?: string }> = (props) => {
  return <iconify-icon icon={props.icon} class={props.class} />
}

export default Icon
