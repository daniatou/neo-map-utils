---
sidebar_position: 1
slug: /
---

# Neo Maps

Neo Maps is a modular open-source GIS UI ecosystem for Leaflet. It starts with a framework-agnostic layer management SDK and grows outward through framework adapters, themes, icons, utilities, and real showcase projects.

:::tip What this project gives you

Build GIS layer panels without locking your product to Angular, React, Vue, or any single UI framework.

:::

## Modules

| Package | Purpose |
| --- | --- |
| `@neo-maps/leaflet-layer-panel` | Core SDK: state, events, layer loading, ordering and map contracts. |
| `@neo-maps/leaflet-layer-panel-angular` | First framework adapter with standalone Angular components. |
| `@neo-maps/layer-panel-theme` | CSS variables, design tokens and Tailwind preset. |
| `@neo-maps/layer-panel-icons` | Runtime SVG icon registry and GIS icon pack. |
| `@neo-maps/layer-panel-utils` | URL sync, persistence, rules and browser-safe helpers. |

## Start Here

- [Angular usage](guides/angular.md)
- [Architecture](guides/architecture.md)
- [Theming](guides/theming.md)
- [API reference](api)

:::info Documentation model

Guides are written by hand for product-level understanding. The API reference is generated from the TypeScript source with TypeDoc.

:::

## Local Documentation Commands

```bash
pnpm docs:start
pnpm docs:build
```

`pnpm docs:build` synchronizes the repository docs, generates TypeScript API pages with TypeDoc, then builds the Docusaurus site.
