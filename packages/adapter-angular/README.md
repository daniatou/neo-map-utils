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
@import '@neo-maps/layer-panel-theme/styles/base.css';
@import '@neo-maps/leaflet-layer-panel-angular/styles.css';
```

## Basic Usage

```ts
import { Component, signal } from '@angular/core';
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
        [config]="config"
        [layerAdapter]="layerAdapter()"
      />
    </div>
  `
})
export class MapComponent {
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

  connectMap(map: L.Map): void {
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
