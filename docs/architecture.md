# Architecture

`@neo-maps/leaflet-layer-panel` is framework-agnostic first.

:::tip Core rule

Angular is an adapter, not the product core. The same core must stay usable from React, Vue, plain TypeScript, or future adapters.

:::

## Layers

- Core owns state, events, layer loading, map orchestration, and public SDK classes.
- UI Headless owns rendering-neutral tree and interaction contracts.
- Icons owns safe SVG registration.
- Theme owns design tokens, CSS variables, and Tailwind preset.
- Framework adapters own rendering and framework integration only.

## Dependency Rule

Adapters depend inward on core packages. Core never imports Angular, React, Vue, or adapter packages.

```text
framework adapter -> headless UI contracts -> core SDK -> map contracts
```

## Event Flow

1. UI calls an adapter interaction.
2. Adapter delegates to `LayerPanelCore`.
3. Core updates `LayerPanelStore`.
4. Core emits typed events.
5. `MapEngine` delegates to a map adapter.

## Leaflet Boundary

Leaflet-specific operations are isolated behind `LayerAdapter` and `MapEngine`. Components never manipulate Leaflet directly.

:::info Why this matters

This boundary keeps layer ordering, visibility, loading, URL sync and persistence testable without a browser framework.

:::
