import type { LayerItem, LayerLoaderResult, LayerLoaderStrategy } from './models';

export class GeoJsonLayerLoader implements LayerLoaderStrategy {
  canLoad(layer: LayerItem): boolean {
    return layer.type === 'geojson' && typeof layer.url === 'string' && layer.url.length > 0;
  }

  async load(layer: LayerItem, signal?: AbortSignal): Promise<LayerLoaderResult> {
    if (!layer.url) {
      throw new Error(`Layer "${layer.id}" does not define a URL.`);
    }

    const response = await fetch(layer.url, {
      signal,
      headers: { Accept: 'application/geo+json, application/json' }
    });

    if (!response.ok) {
      throw new Error(`Failed to load layer "${layer.id}": ${response.status}`);
    }

    return { layer: (await response.json()) as unknown };
  }
}

export class LayerLoader {
  private readonly cache = new Map<string, LayerLoaderResult>();
  private readonly strategies: readonly LayerLoaderStrategy[];

  constructor(
    strategies: readonly LayerLoaderStrategy[] | undefined = undefined,
    private readonly cacheEnabled = true
  ) {
    this.strategies = strategies ?? [new GeoJsonLayerLoader()];
  }

  async load(layer: LayerItem, signal?: AbortSignal): Promise<LayerLoaderResult> {
    const cached = this.cache.get(layer.id);
    if (cached && this.cacheEnabled) {
      return cached;
    }

    const strategy = this.strategies.find((candidate) => candidate.canLoad(layer));
    if (!strategy) {
      return { layer: layer.layer };
    }

    const result = await strategy.load(layer, signal);
    if (this.cacheEnabled) {
      this.cache.set(layer.id, result);
    }

    return result;
  }
}
