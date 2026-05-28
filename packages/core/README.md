# Core

Framework-agnostic GIS layer panel engine. This package has no Angular, React, or Vue dependency.

```ts
import { LayerPanelCore } from '@leaflet-layer-panel/core';

const panel = new LayerPanelCore({ groups: [] });
panel.subscribe((event) => console.log(event));
panel.toggleLayer('roads');
```
