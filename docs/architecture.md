# Architecture

`leaflet-layer-panel` is framework-agnostic first.

## Layers

- Core owns state, events, layer loading, map orchestration, and public SDK classes.
- UI Headless owns rendering-neutral tree and interaction contracts.
- Icons owns safe SVG registration.
- Theme owns design tokens, CSS variables, and Tailwind preset.
- Framework adapters own rendering and framework integration only.

## Dependency Rule

Adapters depend inward on core packages. Core never imports Angular, React, Vue, or adapter packages.

## Event Flow

1. UI calls an adapter interaction.
2. Adapter delegates to `LayerPanelCore`.
3. Core updates `LayerPanelStore`.
4. Core emits typed events.
5. `MapEngine` delegates to a map adapter.

## Leaflet Boundary

Leaflet-specific operations are isolated behind `LayerAdapter` and `MapEngine`. Components never manipulate Leaflet directly.
