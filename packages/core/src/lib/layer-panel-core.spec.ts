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

  it('reorders overlay layers without moving base layers into the order', () => {
    const core = new LayerPanelCore({
      groups: [
        {
          id: 'base',
          name: 'Base',
          layers: [
            { id: 'osm', name: 'OSM', type: 'tile', kind: 'base', visible: true },
            { id: 'roads', name: 'Roads', type: 'tile' },
            { id: 'water', name: 'Water', type: 'geojson' },
            { id: 'wms', name: 'WMS', type: 'wms' }
          ]
        }
      ]
    });

    core.reorderLayer('wms', 'roads');

    expect(core.getState().layerOrder).toEqual(['wms', 'roads', 'water']);
  });

  it('moves overlay layers up and down', () => {
    const core = new LayerPanelCore({
      groups: [
        {
          id: 'layers',
          name: 'Layers',
          layers: [
            { id: 'roads', name: 'Roads', type: 'tile' },
            { id: 'water', name: 'Water', type: 'geojson' },
            { id: 'wms', name: 'WMS', type: 'wms' }
          ]
        }
      ]
    });

    core.moveLayerUp('wms');
    core.moveLayerDown('roads');

    expect(core.getState().layerOrder).toEqual(['wms', 'roads', 'water']);
  });
});
