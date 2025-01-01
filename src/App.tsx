import type { Component } from 'solid-js';

import styles from './assets/App.module.css';

const App: Component = () => {
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <img src="./logo.png" class={styles.logo} alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
          Cliuno SolidJS Template
      </header>
    </div>
  );
};

export default App;
