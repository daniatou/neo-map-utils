# Neo Layers Panel

A framework-agnostic SDK ecosystem for building production GIS layer panels on top of Leaflet.

The core package owns all business logic, state, events, loading, and map orchestration. Framework packages are thin adapters that render UI and connect user interaction back to the SDK.

## Packages

- `@neo-layers-panel/core` - framework-independent layer engine.
- `@neo-layers-panel/adapter-angular` - standalone Angular adapter and Tailwind UI.
- `@neo-layers-panel/adapter-react` - placeholder adapter surface.
- `@neo-layers-panel/adapter-vue` - placeholder adapter surface.
- `@neo-layers-panel/ui-headless` - rendering-neutral tree and interaction contracts.
- `@neo-layers-panel/icons` - SVG icon registry.
- `@neo-layers-panel/theme` - CSS variables, tokens, theme creator, and Tailwind preset.
- `@neo-layers-panel/utils` - persistence, URL sync, rules, and browser-safe helpers.

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
