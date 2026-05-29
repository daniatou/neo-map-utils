# Contributing

Thanks for your interest in contributing to Neo Maps.

Neo Maps is built as a modular GIS SDK ecosystem. The current module is Leaflet Layer Panel, with a framework-agnostic core and Angular as the first adapter.

## Development

```bash
corepack enable
pnpm install
pnpm nx serve demo-angular
```

## Checks

Before opening a pull request, run:

```bash
pnpm nx run-many -t build
pnpm nx run-many -t test
```

## Architecture Rules

- Keep business logic in framework-agnostic packages.
- Do not put map orchestration inside UI components.
- Angular, React, and Vue packages should remain adapters.
- Prefer strict TypeScript models over loose objects.
- Keep UI styling token-based through the theme package.
- Avoid unsafe DOM APIs and unsanitized SVG/HTML.

## Package Boundaries

- `core` owns state, events, layer loading, and map contracts.
- `adapter-angular` owns Angular rendering and service integration.
- `ui-headless` owns rendering-neutral UI models.
- `icons` owns SVG registration and lookup.
- `theme` owns tokens, CSS variables, and Tailwind preset.
- `utils` owns shared persistence, URL sync, and browser-safe helpers.

## Pull Requests

Please keep changes focused. If a change touches multiple packages, explain why in the pull request description.
