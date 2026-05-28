import { Injectable, signal } from '@angular/core';
import {
  MapEngine,
  LayerPanelCore,
  type LayerAdapter,
  type LayerPanelConfig,
  type LayerPanelState,
  type Listener,
  type UnsubscribeFn
} from '@leaflet-layer-panel/core';

@Injectable()
export class LayerPanelAngularService {
  private core?: LayerPanelCore;
  readonly state = signal<LayerPanelState | undefined>(undefined);

  initialize(config: LayerPanelConfig, layerAdapter?: LayerAdapter): void {
    this.core = new LayerPanelCore(config, {
      mapEngine: layerAdapter ? new MapEngine(layerAdapter) : undefined
    });
    this.state.set(this.core.getState());
    this.core.subscribeState((state) => this.state.set(state));
  }

  subscribe(listener: Listener): UnsubscribeFn {
    return this.requireCore().subscribe(listener);
  }

  toggleLayer(id: string): void {
    this.requireCore().toggleLayer(id);
  }

  setLayerVisible(id: string, visible: boolean): void {
    this.requireCore().setLayerVisible(id, visible);
  }

  setBaseLayer(id: string): void {
    this.requireCore().setBaseLayer(id);
  }

  setLayerVisibilityMany(ids: readonly string[], visible: boolean): void {
    this.requireCore().setLayerVisibilityMany(ids, visible);
  }

  setOpacity(id: string, value: number): void {
    this.requireCore().setOpacity(id, value);
  }

  expandGroup(id: string): void {
    this.requireCore().expandGroup(id);
  }

  collapseGroup(id: string): void {
    this.requireCore().collapseGroup(id);
  }

  expandGroups(ids: readonly string[]): void {
    this.requireCore().expandGroups(ids);
  }

  collapseGroups(ids: readonly string[]): void {
    this.requireCore().collapseGroups(ids);
  }

  setSearch(value: string): void {
    this.requireCore().setSearch(value);
  }

  private requireCore(): LayerPanelCore {
    if (!this.core) {
      throw new Error('LayerPanelAngularService must be initialized before use.');
    }
    return this.core;
  }
}
