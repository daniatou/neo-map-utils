# Neo Maps Documentation Site

This folder contains the Docusaurus documentation site for Neo Maps.

The site combines:

- hand-written guides from the repository `docs/` folder;
- static images from `docs/assets`;
- generated TypeScript API documentation from TypeDoc.

## Commands

From the repository root:

```bash
pnpm docs:start
pnpm docs:build
pnpm docs:api
```

`pnpm docs:build` is the CI-friendly command. It synchronizes guides and images, generates the API reference, then builds the static Docusaurus site.

## Node Version

Use Node 22 LTS for documentation builds.

Docusaurus static builds can be unstable on Node 23+ in this workspace because of bundler/runtime compatibility.
