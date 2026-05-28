import { LayerPanelEventBus } from './events';
import { clampOpacity, createInitialState, normalizeLayer } from './layer-manager';
import { LayerLoader } from './layer-loader';
import { MapEngine } from './map-engine';
import type {
  LayerItem,
  LayerPanelConfig,
  LayerPanelEvent,
  LayerPanelState,
  Listener,
  UnsubscribeFn
} from './models';
import { LayerPanelStore } from './store';

export class LayerPanelCore {
  private readonly events = new LayerPanelEventBus();
  private readonly store: LayerPanelStore;
  private readonly loader: LayerLoader;
  private readonly mapEngine: MapEngine;

  constructor(
    config: LayerPanelConfig,
    dependencies: { readonly loader?: LayerLoader; readonly mapEngine?: MapEngine } = {}
  ) {
    this.store = new LayerPanelStore(createInitialState(config.groups));
    this.loader = dependencies.loader ?? new LayerLoader(undefined, config.options?.cacheLoadedLayers ?? true);
    this.mapEngine = dependencies.mapEngine ?? new MapEngine();
    this.syncInitialVisibleLayers();
  }

  getState(): LayerPanelState {
    return this.store.snapshot();
  }

  addLayer(layer: LayerItem): void {
    const record = normalizeLayer(layer);
    const state = this.store.update((current) => ({
      ...current,
      layers: { ...current.layers, [record.id]: record }
    }));
    this.emit({ type: 'layer:added', payload: { layer: record } }, state);
  }

  removeLayer(id: string): void {
    const existing = this.store.snapshot().layers[id];
    if (!existing) {
      return;
    }
    const state = this.store.update((current) => {
      const { [id]: _removed, ...layers } = current.layers;
      return { ...current, layers };
    });
    void this.mapEngine.remove(existing);
    this.emit({ type: 'layer:removed', payload: { layerId: id } }, state);
  }

  toggleLayer(id: string): void {
    const layer = this.store.snapshot().layers[id];
    if (!layer) {
      return;
    }
    this.setLayerVisible(id, !layer.visible);
  }

  setLayerVisible(id: string, active: boolean): void {
    const layer = this.store.snapshot().layers[id];
    if (!layer || layer.visible === active) {
      return;
    }
    if (layer.kind === 'base' && active) {
      this.setBaseLayer(id);
      return;
    }
    const next = { ...layer, visible: active };
    const state = this.store.update((current) => ({
      ...current,
      layers: { ...current.layers, [id]: next }
    }));

    this.emit({ type: 'layer:toggled', payload: { layerId: id, active } }, state);
    void this.mapEngine.setVisible(next, active);

    if (active && layer.url && !layer.loaded && !layer.loading) {
      void this.loadLayer(id);
    }
  }

  setBaseLayer(id: string): void {
    const target = this.store.snapshot().layers[id];
    if (!target || target.kind !== 'base') {
      return;
    }

    const previousLayers = this.store.snapshot().layers;
    const nextLayers = Object.fromEntries(
      Object.entries(previousLayers).map(([layerId, layer]) => [
        layerId,
        layer.kind === 'base' ? { ...layer, visible: layerId === id } : layer
      ])
    );
    const state = this.store.update((current) => ({
      ...current,
      activeBaseLayerId: id,
      layers: nextLayers
    }));

    for (const layer of Object.values(nextLayers)) {
      if (layer.kind === 'base') {
        void this.mapEngine.setVisible(layer, layer.id === id);
      }
    }
    this.emit({ type: 'base-layer:changed', payload: { layerId: id } }, state);
  }

  setLayerVisibilityMany(ids: readonly string[], active: boolean): void {
    for (const id of ids) {
      this.setLayerVisible(id, active);
    }
  }

  setOpacity(id: string, value: number): void {
    const layer = this.store.snapshot().layers[id];
    if (!layer) {
      return;
    }
    const opacity = clampOpacity(value);
    const next = { ...layer, opacity };
    const state = this.store.update((current) => ({
      ...current,
      layers: { ...current.layers, [id]: next }
    }));
    void this.mapEngine.setOpacity(next, opacity);
    this.emit({ type: 'layer:opacity-changed', payload: { layerId: id, opacity } }, state);
  }

  expandGroup(id: string): void {
    this.setGroupExpanded(id, true);
  }

  collapseGroup(id: string): void {
    this.setGroupExpanded(id, false);
  }

  expandGroups(ids: readonly string[]): void {
    this.setGroupsExpanded(ids, true);
  }

  collapseGroups(ids: readonly string[]): void {
    this.setGroupsExpanded(ids, false);
  }

  setSearch(search: string): void {
    const state = this.store.update((current) => ({ ...current, search }));
    this.emit({ type: 'state:changed', payload: state }, state);
  }

  subscribe(listener: Listener): UnsubscribeFn {
    return this.events.subscribe(listener);
  }

  subscribeState(listener: (state: LayerPanelState) => void): UnsubscribeFn {
    return this.store.subscribe(listener);
  }

  private setGroupExpanded(groupId: string, expanded: boolean): void {
    const state = this.store.update((current) => ({
      ...current,
      expandedGroups: { ...current.expandedGroups, [groupId]: expanded }
    }));
    this.emit({ type: 'group:expanded', payload: { groupId, expanded } }, state);
  }

  private setGroupsExpanded(groupIds: readonly string[], expanded: boolean): void {
    const uniqueGroupIds = [...new Set(groupIds)];
    if (uniqueGroupIds.length === 0) {
      return;
    }
    const state = this.store.update((current) => ({
      ...current,
      expandedGroups: uniqueGroupIds.reduce(
        (expandedGroups, groupId) => ({ ...expandedGroups, [groupId]: expanded }),
        current.expandedGroups
      )
    }));
    for (const groupId of uniqueGroupIds) {
      this.emit({ type: 'group:expanded', payload: { groupId, expanded } }, state);
    }
  }

  private async loadLayer(id: string): Promise<void> {
    const layer = this.store.snapshot().layers[id];
    if (!layer) {
      return;
    }

    let state = this.store.update((current) => ({
      ...current,
      layers: { ...current.layers, [id]: { ...layer, loading: true, error: undefined } }
    }));
    this.emit({ type: 'layer:loading', payload: { layerId: id } }, state);

    try {
      const result = await this.loader.load(layer);
      const loaded = { ...layer, loading: false, loaded: true, resolvedLayer: result.layer };
      state = this.store.update((current) => ({
        ...current,
        layers: { ...current.layers, [id]: loaded }
      }));
      await this.mapEngine.add(loaded);
      this.emit({ type: 'layer:loaded', payload: { layerId: id, layer: result.layer } }, state);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown layer loading error';
      state = this.store.update((current) => ({
        ...current,
        errors: { ...current.errors, [id]: message },
        layers: { ...current.layers, [id]: { ...layer, loading: false, error: message } }
      }));
      this.emit({ type: 'layer:failed', payload: { layerId: id, error: message } }, state);
    }
  }

  private emit(event: LayerPanelEvent, state: LayerPanelState): void {
    this.events.emit(event, state);
  }

  private syncInitialVisibleLayers(): void {
    for (const layer of Object.values(this.store.snapshot().layers)) {
      if (layer.visible) {
        void this.mapEngine.setVisible(layer, true);
      }
    }
  }
}
