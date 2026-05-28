# Leaflet Layer Panel

A framework-agnostic SDK ecosystem for building production GIS layer panels on top of Leaflet.

The core package owns all business logic, state, events, loading, and map orchestration. Framework packages are thin adapters that render UI and connect user interaction back to the SDK.

## Packages

- `@leaflet-layer-panel/core` - framework-independent layer engine.
- `@leaflet-layer-panel/adapter-angular` - standalone Angular adapter and Tailwind UI.
- `@leaflet-layer-panel/adapter-react` - placeholder adapter surface.
- `@leaflet-layer-panel/adapter-vue` - placeholder adapter surface.
- `@leaflet-layer-panel/ui-headless` - rendering-neutral tree and interaction contracts.
- `@leaflet-layer-panel/icons` - SVG icon registry.
- `@leaflet-layer-panel/theme` - CSS variables, tokens, theme creator, and Tailwind preset.
- `@leaflet-layer-panel/utils` - persistence, URL sync, rules, and browser-safe helpers.

## Quick Start

```bash
corepack enable
pnpm install
pnpm nx serve demo-angular
```

## Architecture

```text
apps/demo-angular
  -> adapter-angular
    -> core
    -> ui-headless
    -> icons
    -> theme
    -> utils
```

UI components never touch Leaflet directly. They call adapter services, which delegate to `LayerPanelCore`, `MapEngine`, `LayerManager`, and `LayerLoader`.

See [docs/architecture.md](docs/architecture.md) and [docs/theming.md](docs/theming.md).
