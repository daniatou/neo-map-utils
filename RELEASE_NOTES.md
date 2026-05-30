# Release Notes

## 0.1.6 - Developer Experience Improvements

### Developer Experience

- Added `@neo-maps/layer-panel-theme/styles/theme.css` as a single reliable CSS entry point for theme variables and base panel styles.
- Updated documentation to recommend `theme.css` instead of importing split theme files.
- Broadened Angular adapter peer dependencies to Angular 17, 18, 19, and 20.
- Added `group` and `layerGroup` to `LayerType` for Leaflet layer group use cases.
- Added `LayerPanelBuilder` to simplify typed layer panel configuration.
- Expanded Angular README examples with advanced `options`, `ui`, floating layout sizing, i18n labels, and Leaflet layer group usage.

## 0.1.5 - npm Metadata Refresh

- Refreshed npm metadata for the published packages.
- Added package descriptions, keywords, repository links, issue links, and package file allowlists.
- Expanded the Angular adapter npm README with badges, install instructions, styling setup, usage, adapter notes, and theming details.

## 0.1.4 - Publishable Angular Adapter

- Re-published the Angular adapter after switching to Angular Package Format.
- Depends on corrected `0.1.2` runtime packages.
- Intended as the first package version suitable for the npm-based Angular showcase.

## 0.1.3 - Angular Package Format

- Built the Angular adapter with `ng-packagr` instead of plain TypeScript compilation.
- Fixed Angular metadata so `LayerPanelComponent` is recognized as a standalone component in consumer apps.
- Kept the public `styles.css` export for user-facing showcase projects.

## 0.1.2 - Runtime Package Export Fix

- Fixed runtime package exports for the `@nx/js:tsc` output structure.
- Updated core, icons, and theme packages to publish valid `src/index.js` entry points.
- Fixed Angular adapter dependencies to resolve corrected runtime packages.

## 0.1.1 - Showcase Packaging

- Added a public `./styles.css` export to `@neo-maps/leaflet-layer-panel-angular`.
- Re-exported common core types from the Angular adapter for simpler consumer imports.
- Split the repository examples into npm-based `showcases/` and local contributor `development/` demos.

## 0.1.0 - Initial Preview

Neo Maps starts with its first module: **Leaflet Layer Panel**, a framework-agnostic SDK for building modern GIS layer management panels on top of Leaflet.

This release is an early preview focused on architecture, package boundaries, Angular integration, and a working demo application.

### Highlights

- Introduced the Neo Maps monorepo architecture with Nx and pnpm.
- Added a framework-agnostic core SDK for Leaflet layer management.
- Added the first Angular adapter with standalone components.
- Added a real Leaflet demo application.
- Added grouped overlay panels, visibility controls, opacity controls, search, base layer selection, and layer ordering.
- Added a reusable SVG icon registry.
- Added a shared theme package based on CSS variables, design tokens, and Tailwind.
- Added utility packages for persistence, URL sync, layer rules, and safe browser helpers.
- Added placeholder adapter packages for React and Vue.

### Core SDK

- `LayerPanelCore` manages layer state, visibility, opacity, groups, base layers, and ordering.
- Event-driven architecture with layer added, removed, toggled, loaded, failed, opacity changed, group expanded, and order changed events.
- Framework-independent store and map contracts.
- Leaflet interactions are isolated behind adapter and map engine abstractions.
- Base layers are exclusive and always kept below overlays.
- Overlay ordering follows the visual stack: the layer at the top of the order list is rendered above the others.

### Angular Adapter

- Standalone `llp-layer-panel` component.
- OnPush change detection.
- Angular service wrapper around the core SDK.
- Leaflet adapter implementation for real map integration.
- Modern panel UI with search, custom base layer dropdown, group accordion, layer visibility controls, opacity sliders, and ordering view.
- Sidebar and floating layout support.

### Theme And Icons

- CSS variable based theme architecture.
- Tailwind preset support.
- Light and dark mode foundations.
- Runtime SVG icon registry.
- Generated GIS icon pack from local icon banks.
- Fallback icon support.

### Demo

- Angular demo app with Leaflet map integration.
- OpenStreetMap and OpenTopoMap base layers.
- GeoJSON overlays.
- WMS overlay example.
- Layer ordering and visibility controls wired to the map.

### Documentation

- Added README with project overview, badges, screenshots, package list, and roadmap.
- Added architecture and theming documentation.
- Added Angular integration documentation.
- Added MIT license, contribution guide, and security policy.

### Known Limitations

- React and Vue packages are placeholders only.
- Release automation and semantic versioning workflow are not finalized yet.
- Accessibility can still be improved around advanced keyboard interactions for custom controls.

### Migration Notes

This is the first release, so there are no migration steps.
