# Theme

CSS variables, design tokens, theme creator, and Tailwind preset shared by every adapter.

```css
@import '@neo-maps/layer-panel-theme/styles/theme.css';
```

`theme.css` bundles the default variables and base panel styles. Advanced consumers can still import `styles/variables.css` and `styles/base.css` separately.

```ts
import { createTheme } from '@neo-maps/layer-panel-theme';

const css = createTheme({ primary: '#2563eb', radius: '24px' });
```
