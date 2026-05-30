# @neo-maps/leaflet-layer-panel-angular

[![npm version](https://img.shields.io/npm/v/@neo-maps/leaflet-layer-panel-angular.svg)](https://www.npmjs.com/package/@neo-maps/leaflet-layer-panel-angular)
[![npm downloads](https://img.shields.io/npm/dm/@neo-maps/leaflet-layer-panel-angular.svg)](https://www.npmjs.com/package/@neo-maps/leaflet-layer-panel-angular)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/daniatou/neo-map-utils/blob/main/LICENSE)
[![Angular](https://img.shields.io/badge/Angular-standalone-c3002f?logo=angular&logoColor=white)](https://angular.dev)
[![Leaflet](https://img.shields.io/badge/Leaflet-GIS-199900?logo=leaflet&logoColor=white)](https://leafletjs.com)

Standalone Angular adapter for **Neo Maps Leaflet Layer Panel**.

This package provides the Angular UI layer for the framework-agnostic `@neo-maps/leaflet-layer-panel` SDK. It renders the layer panel, connects user interactions to the core engine, and provides a Leaflet adapter for real map integration.

## Install

```bash
npm install leaflet @neo-maps/leaflet-layer-panel-angular
```

The Angular adapter installs the required Neo Maps runtime packages:

```text
@neo-maps/leaflet-layer-panel
@neo-maps/layer-panel-icons
@neo-maps/layer-panel-theme
```

Your application must provide Angular and Leaflet.

## Styles

Add these imports to your global stylesheet:

```css
@import 'leaflet/dist/leaflet.css';
@import '@neo-maps/layer-panel-theme/styles/theme.css';
@import '@neo-maps/leaflet-layer-panel-angular/styles.css';
```

`theme.css` is the recommended entry point because it bundles the CSS variables and base panel styles in a single import.

## Basic Usage

```ts
import { Component, AfterViewInit, ElementRef, ViewChild, signal } from '@angular/core';
import {
  LayerPanelComponent,
  LeafletLayerAdapter,
  type LayerAdapter,
  type LayerPanelConfig
} from '@neo-maps/leaflet-layer-panel-angular';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [LayerPanelComponent],
  template: `
    <div class="map-shell">
      <div #mapRoot class="map"></div>
      <llp-layer-panel
        title="Layers"
        variant="floating"
        [config]="config"
        [layerAdapter]="layerAdapter()"
      />
    </div>
  `,
  styles: [`
    .map-shell { position: relative; height: 100vh; }
    .map       { position: absolute; inset: 0; }
  `]
})
export class MapComponent implements AfterViewInit {
  @ViewChild('mapRoot') mapRoot!: ElementRef<HTMLDivElement>;

  readonly layerAdapter = signal<LayerAdapter | undefined>(undefined);

  readonly config: LayerPanelConfig = {
    groups: [
      {
        id: 'basemaps',
        name: 'Fond de carte',
        layers: [
          {
            id: 'osm',
            name: 'OpenStreetMap',
            type: 'tile',
            kind: 'base',
            visible: true,
            layer: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
          }
        ]
      }
    ]
  };

  ngAfterViewInit(): void {
    const map = L.map(this.mapRoot.nativeElement).setView([48.85, 2.35], 12);
    this.layerAdapter.set(new LeafletLayerAdapter(map));
  }
}
```

## Features

- standalone Angular component
- Leaflet map adapter
- grouped overlays
- base layer selection
- layer visibility controls
- opacity controls
- search/filtering
- layer ordering
- dark mode ready styling
- CSS variable based theming
- SVG icon registry support

## Advanced Configuration

`LayerPanelConfig` controls runtime behavior through `options` and presentation through `ui`.

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
    showGlobalVisibilityActions: true,
    showGroupExpansionAction: true,
    enableOrdering: true,
    orderingMode: 'dedicated-view',
    visibilityControl: 'eye',
    baseLayerControl: 'select'
  },
  groups: []
};
```

`layout: 'floating'` is designed for map overlays. In that mode, define `width`, `maxWidth`, and `maxHeight` so the host app controls how the panel sits above the map.

## Internationalization

Use `ui.labels` to translate panel copy:

```ts
const config: LayerPanelConfig = {
  ui: {
    labels: {
      subtitle: 'Gestion des couches',
      searchPlaceholder: 'Rechercher une couche',
      baseLayer: 'Fond de carte',
      opacity: 'Opacité',
      showAll: 'Tout voir',
      hideAll: 'Tout cacher',
      expandAll: 'Tout ouvrir',
      collapseAll: 'Tout fermer',
      editOrder: "Modifier l'ordre",
      finishEditOrder: 'Terminer',
      orderViewTitle: "Ordre d'affichage",
      backToLayers: 'Retour aux couches'
    }
  },
  groups: []
};
```

## Layer Groups

Leaflet layer groups can be passed as normal layer instances:

```ts
const markers = L.layerGroup([L.marker([33.57, -7.59])]);

const config: LayerPanelConfig = {
  groups: [
    {
      id: 'poi',
      name: 'Points d’intérêt',
      layers: [
        {
          id: 'poi-markers',
          name: 'Marqueurs',
          type: 'layerGroup',
          layer: markers,
          visible: true
        }
      ]
    }
  ]
};
```

You can also create configurations with the builder:

```ts
import { LayerPanelBuilder } from '@neo-maps/leaflet-layer-panel-angular';

const config = new LayerPanelBuilder()
  .addGroup({ id: 'poi', name: 'Points d’intérêt', layers: [] })
  .addLayerGroup('poi', {
    id: 'poi-markers',
    name: 'Marqueurs',
    layer: markers,
    visible: true
  })
  .build();
```

## Component API

```html
<llp-layer-panel
  [config]="config"
  [layerAdapter]="layerAdapter"
  title="Layers"
  variant="default"
/>
```

| Input | Type | Description |
| --- | --- | --- |
| `config` | `LayerPanelConfig` | Layer groups, panel options, and UI configuration. |
| `layerAdapter` | `LayerAdapter \| undefined` | Adapter used to connect the core SDK to Leaflet. |
| `title` | `string` | Panel title. |
| `variant` | `'default' \| 'compact' \| 'enterprise' \| 'floating' \| 'minimal'` | Visual variant. |

## Leaflet Adapter

Use `LeafletLayerAdapter` to connect an existing Leaflet map to the panel:

```ts
const map = L.map('map').setView([33.55, -7.62], 11);
const adapter = new LeafletLayerAdapter(map);
```

Then pass the adapter to the panel:

```html
<llp-layer-panel [config]="config" [layerAdapter]="adapter" />
```

UI components never manipulate Leaflet directly. All map interaction goes through the adapter and the framework-agnostic core.

## Theming

The package uses the shared Neo Maps theme tokens from `@neo-maps/layer-panel-theme`.

You can override CSS variables globally:

```css
:root {
  --llp-primary: 37 99 235;
  --llp-radius: 14px;
  --llp-panel: 243 244 246;
}
```

## CSS Architecture

The adapter currently ships a small CSS file for component-specific primitives and consumes the shared theme variables. The long-term package goal is to publish a fully precompiled CSS bundle so consumers do not need Tailwind at all.

Until that build step is finalized, import:

```css
@import '@neo-maps/layer-panel-theme/styles/theme.css';
@import '@neo-maps/leaflet-layer-panel-angular/styles.css';
```

## Showcase

See the standalone Angular showcase:

```bash
cd showcases/demo-angular
npm install
npm start
```

## Documentation

- Angular guide: `docs/angular.md`
- Theming guide: `docs/theming.md`
- Architecture: `docs/architecture.md`
- Release notes: `RELEASE_NOTES.md`

## License

MIT
