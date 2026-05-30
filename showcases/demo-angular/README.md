# Angular Basic Showcase

This showcase is a user-facing Angular example for **Neo Maps Leaflet Layer Panel**.

It intentionally uses the published npm package instead of the local monorepo source, so it behaves like a real consumer application.

## Install

This showcase requires Node.js `>=20.19.0` or `>=22.12.0`, matching Angular CLI requirements.

```bash
npm install
```

## Run

```bash
npm start
```

Then open the URL printed by Angular, usually:

```text
http://localhost:4200
```

## Packages Used

```bash
npm install leaflet @neo-maps/leaflet-layer-panel-angular
```

Global styles are imported from npm packages:

```css
@import 'leaflet/dist/leaflet.css';
@import '@neo-maps/layer-panel-theme/styles/base.css';
@import '@neo-maps/leaflet-layer-panel-angular/styles.css';
```

The Angular adapter installs the required Neo Maps runtime packages:

```text
@neo-maps/leaflet-layer-panel
@neo-maps/layer-panel-icons
@neo-maps/layer-panel-theme
```

## What This Shows

- Leaflet map integration
- base layer selection
- grouped overlays
- layer visibility
- opacity controls
- layer ordering
- WMS and GeoJSON examples
- custom Neo Maps theme usage

## Important Files

- `src/app/app.component.ts` - Leaflet map setup and layer config
- `src/app/app.component.html` - app layout
- `src/styles.css` - Leaflet, Neo Maps, and Tailwind styles
