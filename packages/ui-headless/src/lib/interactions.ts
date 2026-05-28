export interface LayerPanelInteractions {
  toggleLayer(layerId: string): void;
  setLayerVisible(layerId: string, visible: boolean): void;
  setBaseLayer(layerId: string): void;
  setLayerVisibilityMany(layerIds: readonly string[], visible: boolean): void;
  setOpacity(layerId: string, value: number): void;
  expandGroup(groupId: string): void;
  collapseGroup(groupId: string): void;
  expandGroups(groupIds: readonly string[]): void;
  collapseGroups(groupIds: readonly string[]): void;
  setSearch(value: string): void;
}
