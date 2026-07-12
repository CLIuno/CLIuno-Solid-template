import type { Component } from 'solid-js'

const FooterComp: Component = () => {
  return (
    <footer class="tw:footer tw:footer-center tw:p-4 tw:bg-base-200 tw:text-base-content">
      <div>
        <p>&copy; {new Date().getFullYear()} — Built with 💖 using SolidJS</p>
      </div>
    </footer>
  )
}

export default FooterComp
