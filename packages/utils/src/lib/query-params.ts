export function parseLayerParam(value: string | null): readonly string[] {
  if (!value) {
    return [];
  }
  return value
    .split(',')
    .map((item) => decodeURIComponent(item.trim()))
    .filter(Boolean);
}

export function stringifyLayerParam(layerIds: readonly string[]): string {
  return layerIds.map((id) => encodeURIComponent(id)).join(',');
}
