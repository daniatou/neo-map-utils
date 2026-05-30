# Theming

The theme package is framework-independent and based on CSS variables plus a Tailwind preset.

:::tip One theme engine

Angular, React, Vue and future adapters should consume the same `--llp-*` design tokens.

:::

```ts
import { createTheme } from '@neo-maps/layer-panel-theme';

const css = createTheme({
  primary: '#2563eb',
  radius: '24px',
  surface: '#ffffff',
  panelBackground: '#f8fafc'
});
```

## Tailwind

```ts
import preset from '@neo-maps/layer-panel-theme/tailwind';

export default {
  presets: [preset]
};
```

Components consume `--llp-*` variables and Tailwind tokens such as `bg-llp-panel`, `text-llp-text`, `border-llp-border`, and `rounded-llp`.

:::info Customization surface

The user can override colors, radius, shadows, spacing, typography, panel backgrounds, variants, panel modes and dark mode values without changing adapter code.

:::
