import type { LayerGroup, LayerItem, LayerPanelConfig, PanelOptions } from './models';

export class LayerPanelBuilder {
  private readonly groups = new Map<string, LayerGroup>();
  private options: PanelOptions | undefined;

  setOptions(options: PanelOptions): this {
    this.options = options;
    return this;
  }

  addGroup(group: LayerGroup): this {
    this.groups.set(group.id, group);
    return this;
  }

  addBaseLayer(groupId: string, layer: Omit<LayerItem, 'kind'>): this {
    return this.addLayer(groupId, { ...layer, kind: 'base' });
  }

  addOverlayLayer(groupId: string, layer: Omit<LayerItem, 'kind'>): this {
    return this.addLayer(groupId, { ...layer, kind: 'overlay' });
  }

  addLayerGroup(groupId: string, layer: Omit<LayerItem, 'type' | 'kind'>): this {
    return this.addOverlayLayer(groupId, { ...layer, type: 'layerGroup' });
  }

  build(): LayerPanelConfig {
    return {
      groups: [...this.groups.values()],
      ...(this.options ? { options: this.options } : {})
    };
  }

  private addLayer(groupId: string, layer: LayerItem): this {
    const group = this.groups.get(groupId) ?? {
      id: groupId,
      name: groupId,
      layers: []
    };

    this.groups.set(groupId, {
      ...group,
      layers: [...group.layers, layer]
    });

    return this;
  }
}
