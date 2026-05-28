import type { Config } from 'tailwindcss';

const preset: Partial<Config> = {
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        llp: {
          primary: 'rgb(var(--llp-primary) / <alpha-value>)',
          surface: 'rgb(var(--llp-surface) / <alpha-value>)',
          panel: 'rgb(var(--llp-panel) / <alpha-value>)',
          text: 'rgb(var(--llp-text) / <alpha-value>)',
          muted: 'rgb(var(--llp-muted) / <alpha-value>)',
          border: 'rgb(var(--llp-border) / <alpha-value>)'
        }
      },
      borderRadius: {
        llp: 'var(--llp-radius)'
      },
      boxShadow: {
        llp: 'var(--llp-shadow-soft)'
      },
      fontFamily: {
        llp: 'var(--llp-font-family)'
      },
      spacing: {
        llp: 'var(--llp-spacing)'
      }
    }
  }
};

export default preset;
