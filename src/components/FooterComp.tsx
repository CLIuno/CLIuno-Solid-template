import type { Component } from 'solid-js'

const FooterComp: Component = () => {
  return (
    <footer class="border-t py-6 text-center text-sm text-muted-foreground">
      <p>&copy; {new Date().getFullYear()} &mdash; Built with 💖 using SolidJS</p>
    </footer>
  )
}

export default FooterComp
