import type { LayerAdapter, LayerRecord } from './models';

export class NullLayerAdapter implements LayerAdapter {
  setVisible(): void {}
  setOpacity(): void {}
  addLayer(): void {}
  removeLayer(): void {}
}

export class MapEngine {
  constructor(private readonly adapter: LayerAdapter = new NullLayerAdapter()) {}

  async add(layer: LayerRecord): Promise<void> {
    await this.adapter.addLayer(layer);
  }

  async remove(layer: LayerRecord): Promise<void> {
    await this.adapter.removeLayer(layer);
  }

  async setVisible(layer: LayerRecord, visible: boolean): Promise<void> {
    await this.adapter.setVisible(layer, visible);
  }

  async setOpacity(layer: LayerRecord, opacity: number): Promise<void> {
    await this.adapter.setOpacity(layer, opacity);
  }

  async setLayerOrder(layerOrder: readonly string[]): Promise<void> {
    await this.adapter.setLayerOrder?.(layerOrder);
  }
}
