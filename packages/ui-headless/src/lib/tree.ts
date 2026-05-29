import type { LayerGroup, LayerPanelState } from '@neo-maps/leaflet-layer-panel';

export interface LayerTreeNode {
  readonly id: string;
  readonly label: string;
  readonly icon?: string;
  readonly active: boolean;
  readonly loading?: boolean;
  readonly opacity?: number;
  readonly children?: readonly LayerTreeNode[];
}

function isTreeNode(node: LayerTreeNode | undefined): node is LayerTreeNode {
  return node !== undefined;
}

export function createLayerTree(state: LayerPanelState): readonly LayerTreeNode[] {
  const search = state.search.trim().toLowerCase();
  const mapGroup = (group: LayerGroup): LayerTreeNode | undefined => {
    const layerNodes = group.layers
      .map((layer) => state.layers[layer.id])
      .filter((layer) => Boolean(layer))
      .map((layer) => ({
        id: layer.id,
        label: layer.name,
        icon: layer.icon,
        active: layer.visible,
        loading: layer.loading,
        opacity: layer.opacity
      }))
      .filter((node) => !search || node.label.toLowerCase().includes(search));

    const childNodes = (group.children ?? []).map(mapGroup).filter(isTreeNode);
    const children = [...layerNodes, ...childNodes];
    if (search && children.length === 0 && !group.name.toLowerCase().includes(search)) {
      return undefined;
    }
    return {
      id: group.id,
      label: group.name,
      icon: group.icon,
      active: children.some((node) => node.active),
      children
    };
  };

  return state.groups.map(mapGroup).filter(isTreeNode);
}
