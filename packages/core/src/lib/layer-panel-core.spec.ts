import { describe, expect, it } from 'vitest';
import { LayerPanelCore } from './layer-panel-core';

describe('LayerPanelCore', () => {
  it('toggles layers and emits events', () => {
    const core = new LayerPanelCore({
      groups: [{ id: 'base', name: 'Base', layers: [{ id: 'roads', name: 'Roads', type: 'geojson' }] }]
    });
    const events: string[] = [];
    core.subscribe((event) => events.push(event.type));

    core.toggleLayer('roads');

    expect(core.getState().layers['roads']?.visible).toBe(true);
    expect(events).toContain('layer:toggled');
  });

  it('clamps opacity values', () => {
    const core = new LayerPanelCore({
      groups: [{ id: 'base', name: 'Base', layers: [{ id: 'roads', name: 'Roads', type: 'tile' }] }]
    });

    core.setOpacity('roads', 2);

    expect(core.getState().layers['roads']?.opacity).toBe(1);
  });

  it('updates multiple layers at once', () => {
    const core = new LayerPanelCore({
      groups: [
        {
          id: 'base',
          name: 'Base',
          layers: [
            { id: 'roads', name: 'Roads', type: 'tile' },
            { id: 'water', name: 'Water', type: 'geojson' }
          ]
        }
      ]
    });

    core.setLayerVisibilityMany(['roads', 'water'], true);

    expect(core.getState().layers['roads']?.visible).toBe(true);
    expect(core.getState().layers['water']?.visible).toBe(true);
  });
});
