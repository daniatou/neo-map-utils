# Angular Usage

Use the Angular adapter when your application already owns the Leaflet map and you want a polished layer panel connected to the Neo Maps core.

> **Installation** — The Angular adapter includes the Neo Maps runtime packages it needs. Your app still provides Angular and Leaflet.

```bash
npm install leaflet @neo-maps/leaflet-layer-panel-angular
```

Add the required styles to your global stylesheet:

```css
@import 'leaflet/dist/leaflet.css';
@import '@neo-maps/layer-panel-theme/styles/theme.css';
@import '@neo-maps/leaflet-layer-panel-angular/styles.css';
```

`theme.css` is the recommended theme entry point because it contains both the CSS variables and the base panel styles.

```ts
import { Component } from '@angular/core';
import { LayerPanelComponent, type LayerPanelConfig } from '@neo-maps/leaflet-layer-panel-angular';

@Component({
  standalone: true,
  imports: [LayerPanelComponent],
  template: `<llp-layer-panel [config]="config" />`
})
export class MapShellComponent {}
```

Angular components are standalone and use OnPush change detection.

> **Adapter boundary** — The component renders the panel and forwards user interactions. Business logic stays in `LayerPanelCore`, and Leaflet calls go through the layer adapter.

## Layout

The panel can be used as a normal sidebar or placed absolutely over a map by the host app.

```ts
const config: LayerPanelConfig = {
  options: {
    lazyLoad: true,
    cacheLoadedLayers: true,
    urlSync: true,
    persistState: true
  },
  ui: {
    layout: 'floating',
    width: '22rem',
    maxWidth: 'calc(100vw - 2rem)',
    maxHeight: 'calc(100vh - 2rem)',
    showSearch: true,
    showOpacity: true,
    enableOrdering: true,
    visibilityControl: 'eye',
    baseLayerControl: 'select',
    labels: {
      subtitle: 'Gestion des couches',
      searchPlaceholder: 'Rechercher une couche',
      baseLayer: 'Fond de carte',
      opacity: 'Opacité',
      showAll: 'Tout voir',
      hideAll: 'Tout cacher',
      expandAll: 'Tout ouvrir',
      collapseAll: 'Tout fermer'
    }
  },
  groups: []
};
```

```html
<!-- Note: the classes below use Tailwind CSS. Replace with plain CSS if Tailwind is not in your project. -->
<div class="relative h-screen">
  <div id="map" class="absolute inset-0"></div>
  <llp-layer-panel class="absolute left-4 top-4 z-[500]" [config]="config" />
</div>
```

The SDK controls the panel dimensions through `ui.width`, `ui.maxWidth`, `ui.height`, and `ui.maxHeight`. Positioning stays in the host layout, so Angular, React, Vue, or plain apps can decide whether the panel is a sidebar, floating card, drawer, or map overlay.

> **Styles** — Do not forget the adapter stylesheet. Without it, the component still works, but it will look almost unstyled.
