# Theming

The theme package is framework-independent and based on CSS variables plus a Tailwind preset.

```ts
import { createTheme } from '@leaflet-layer-panel/theme';

const css = createTheme({
  primary: '#2563eb',
  radius: '24px',
  surface: '#ffffff',
  panelBackground: '#f8fafc'
});
```

## Tailwind

```ts
import preset from '@leaflet-layer-panel/theme/tailwind';

export default {
  presets: [preset]
};
```

Components consume `--llp-*` variables and Tailwind tokens such as `bg-llp-panel`, `text-llp-text`, `border-llp-border`, and `rounded-llp`.
