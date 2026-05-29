import type { LayerAdapter, LayerRecord } from '@neo-layers-panel/core';
import type * as Leaflet from 'leaflet';

type LeafletLayer = Leaflet.Layer & {
  setOpacity?: (opacity: number) => void;
  setStyle?: (style: { opacity?: number; fillOpacity?: number }) => void;
  setZIndex?: (zIndex: number) => void;
  bringToFront?: () => void;
  bringToBack?: () => void;
};

export class LeafletLayerAdapter implements LayerAdapter {
  private readonly layers = new Map<string, LeafletLayer>();
  private readonly layerRecords = new Map<string, LayerRecord>();
  private layerOrder: readonly string[] = [];

  constructor(private readonly map: Leaflet.Map) {}

  addLayer(layer: LayerRecord): void {
    const leafletLayer = this.resolveLayer(layer);
    if (!leafletLayer) {
      return;
    }
    this.layerRecords.set(layer.id, layer);
    this.layers.set(layer.id, leafletLayer);
    this.applyLayerOrder(layer, leafletLayer);
    if (layer.visible && !this.map.hasLayer(leafletLayer)) {
      leafletLayer.addTo(this.map);
      this.applyLayerOrder(layer, leafletLayer);
      this.reorderVisibleLayers();
    }
  }

  removeLayer(layer: LayerRecord): void {
    const leafletLayer = this.layers.get(layer.id);
    if (leafletLayer && this.map.hasLayer(leafletLayer)) {
      this.map.removeLayer(leafletLayer);
    }
    this.layers.delete(layer.id);
    this.layerRecords.delete(layer.id);
  }

  setVisible(layer: LayerRecord, visible: boolean): void {
    const leafletLayer = this.resolveLayer(layer);
    if (!leafletLayer) {
      return;
    }
    this.layerRecords.set(layer.id, layer);
    this.layers.set(layer.id, leafletLayer);
    this.applyLayerOrder(layer, leafletLayer);
    if (visible && !this.map.hasLayer(leafletLayer)) {
      leafletLayer.addTo(this.map);
      this.applyLayerOrder(layer, leafletLayer);
      this.reorderVisibleLayers();
    }
    if (!visible && this.map.hasLayer(leafletLayer)) {
      this.map.removeLayer(leafletLayer);
    }
  }

  setOpacity(layer: LayerRecord, opacity: number): void {
    const leafletLayer = this.layers.get(layer.id) ?? this.resolveLayer(layer);
    leafletLayer?.setOpacity?.(opacity);
    leafletLayer?.setStyle?.({ opacity, fillOpacity: opacity });
  }

  setLayerOrder(layerOrder: readonly string[]): void {
    this.layerOrder = layerOrder;
    this.reorderVisibleLayers();
  }

  private resolveLayer(layer: LayerRecord): LeafletLayer | undefined {
    return (layer.resolvedLayer ?? layer.layer) as LeafletLayer | undefined;
  }

  private applyLayerOrder(layer: LayerRecord, leafletLayer: LeafletLayer): void {
    if (layer.kind === 'base') {
      leafletLayer.setZIndex?.(100);
      leafletLayer.bringToBack?.();
      return;
    }

    const orderIndex = this.layerOrder.indexOf(layer.id);
    const orderOffset = orderIndex >= 0 ? orderIndex : this.layerOrder.length;
    const zIndex = 450 + (this.layerOrder.length - orderOffset) * 10;
    leafletLayer.setZIndex?.(zIndex);
    leafletLayer.bringToFront?.();
  }

  private reorderVisibleLayers(): void {
    for (const [id, leafletLayer] of this.layers) {
      if (!this.map.hasLayer(leafletLayer)) {
        continue;
      }
      const layer = this.findLayerRecord(id);
      if (layer?.kind === 'base') {
        this.applyLayerOrder(layer, leafletLayer);
      }
    }

    for (const id of [...this.layerOrder].reverse()) {
      const leafletLayer = this.layers.get(id);
      const layer = this.findLayerRecord(id);
      if (leafletLayer && layer && this.map.hasLayer(leafletLayer)) {
        this.applyLayerOrder(layer, leafletLayer);
      }
    }
  }

  private findLayerRecord(id: string): LayerRecord | undefined {
    return this.layerRecords.get(id);
  }
}
