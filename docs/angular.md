# Angular Usage

```ts
import { LayerPanelComponent } from '@neo-layers-panel/adapter-angular';

@Component({
  standalone: true,
  imports: [LayerPanelComponent],
  template: `<llp-layer-panel [config]="config" />`
})
export class MapShellComponent {}
```

Angular components are standalone and use OnPush change detection.

## Layout

The panel can be used as a normal sidebar or placed absolutely over a map by the host app.

```ts
const config: LayerPanelConfig = {
  ui: {
    layout: 'floating',
    width: '22rem',
    maxHeight: 'calc(100vh - 2rem)'
  },
  groups: []
};
```

```html
<div class="relative h-screen">
  <div id="map" class="absolute inset-0"></div>
  <llp-layer-panel class="absolute left-4 top-4 z-[500]" [config]="config" />
</div>
```

The SDK controls the panel dimensions through `ui.width`, `ui.maxWidth`, `ui.height`, and `ui.maxHeight`. Positioning stays in the host layout, so Angular, React, Vue, or plain apps can decide whether the panel is a sidebar, floating card, drawer, or map overlay.
