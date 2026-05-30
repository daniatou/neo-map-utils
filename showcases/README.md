# Showcases

This folder contains user-facing examples for Neo Maps.

Showcases are intentionally standalone projects. They install Neo Maps packages from npm and should behave like real consumer applications.

## Angular Basic

Requires Node.js `>=20.19.0` or `>=22.12.0`.

```bash
cd showcases/demo-angular
npm install
npm start
```

This showcase uses:

```bash
npm install leaflet @neo-maps/leaflet-layer-panel-angular
```

Use `development/` instead when you want to test changes against the local monorepo packages.
