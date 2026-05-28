import type { LayerGroup, LayerItem, LayerPanelState, LayerRecord } from './models';

export function createInitialState(groups: readonly LayerGroup[]): LayerPanelState {
  const layers: Record<string, LayerRecord> = {};
  const expandedGroups: Record<string, boolean> = {};
  let activeBaseLayerId: string | undefined;

  const visit = (group: LayerGroup): void => {
    expandedGroups[group.id] = group.expanded ?? false;
    for (const layer of group.layers) {
      const record = normalizeLayer(layer);
      if (record.kind === 'base' && record.visible) {
        if (activeBaseLayerId) {
          layers[record.id] = { ...record, visible: false };
        } else {
          activeBaseLayerId = record.id;
          layers[record.id] = record;
        }
      } else {
        layers[record.id] = record;
      }
    }
    for (const child of group.children ?? []) {
      visit(child);
    }
  };

  for (const group of groups) {
    visit(group);
  }

  return { layers, groups, expandedGroups, activeBaseLayerId, search: '', errors: {} };
}

export function normalizeLayer(layer: LayerItem): LayerRecord {
  return {
    ...layer,
    kind: layer.kind ?? 'overlay',
    visible: layer.visible ?? false,
    opacity: clampOpacity(layer.opacity ?? 1),
    loading: false,
    loaded: Boolean(layer.layer),
    resolvedLayer: layer.layer
  };
}

export function clampOpacity(value: number): number {
  if (!Number.isFinite(value)) {
    return 1;
  }
  return Math.min(1, Math.max(0, value));
}
