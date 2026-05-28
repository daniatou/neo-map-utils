export type LayerType = 'geojson' | 'tile' | 'wms' | 'marker';
export type LayerKind = 'base' | 'overlay';
export type LayerPanelDensity = 'comfortable' | 'compact';
export type LayerVisibilityControl = 'eye' | 'checkbox';
export type BaseLayerControl = 'select' | 'radio' | 'hidden';
export type LayerPanelLayout = 'sidebar' | 'floating';

export interface LayerPanelConfig {
  readonly groups: readonly LayerGroup[];
  readonly options?: PanelOptions;
  readonly ui?: LayerPanelUiConfig;
}

export interface PanelOptions {
  readonly lazyLoad?: boolean;
  readonly cacheLoadedLayers?: boolean;
  readonly urlSync?: boolean;
  readonly persistState?: boolean;
  readonly initialSearch?: string;
}

export interface LayerPanelUiConfig {
  readonly showSearch?: boolean;
  readonly showOpacity?: boolean;
  readonly showGlobalVisibilityActions?: boolean;
  readonly showGroupExpansionAction?: boolean;
  readonly visibilityControl?: LayerVisibilityControl;
  readonly baseLayerControl?: BaseLayerControl;
  readonly density?: LayerPanelDensity;
  readonly layout?: LayerPanelLayout;
  readonly width?: string;
  readonly maxWidth?: string;
  readonly height?: string;
  readonly maxHeight?: string;
  readonly labels?: LayerPanelLabels;
}

export interface LayerPanelLabels {
  readonly subtitle?: string;
  readonly searchPlaceholder?: string;
  readonly baseLayer?: string;
  readonly opacity?: string;
  readonly showAll?: string;
  readonly hideAll?: string;
  readonly expandAll?: string;
  readonly collapseAll?: string;
}

export interface LayerGroup {
  readonly id: string;
  readonly name: string;
  readonly icon?: string;
  readonly expanded?: boolean;
  readonly children?: readonly LayerGroup[];
  readonly layers: readonly LayerItem[];
}

export interface LayerItem {
  readonly id: string;
  readonly name: string;
  readonly type: LayerType;
  readonly layer?: unknown;
  readonly url?: string;
  readonly icon?: string;
  readonly kind?: LayerKind;
  readonly visible?: boolean;
  readonly opacity?: number;
  readonly minZoom?: number;
  readonly maxZoom?: number;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface LayerRecord extends LayerItem {
  readonly kind: LayerKind;
  readonly visible: boolean;
  readonly opacity: number;
  readonly loading: boolean;
  readonly loaded: boolean;
  readonly error?: string;
  readonly resolvedLayer?: unknown;
}

export interface LayerPanelState {
  readonly layers: Readonly<Record<string, LayerRecord>>;
  readonly groups: readonly LayerGroup[];
  readonly expandedGroups: Readonly<Record<string, boolean>>;
  readonly activeBaseLayerId?: string;
  readonly search: string;
  readonly errors: Readonly<Record<string, string>>;
}

export type Listener = (event: LayerPanelEvent, state: LayerPanelState) => void;
export type UnsubscribeFn = () => void;

export type LayerPanelEvent =
  | { readonly type: 'layer:added'; readonly payload: { readonly layer: LayerRecord } }
  | { readonly type: 'layer:removed'; readonly payload: { readonly layerId: string } }
  | {
      readonly type: 'layer:toggled';
      readonly payload: { readonly layerId: string; readonly active: boolean };
    }
  | {
      readonly type: 'base-layer:changed';
      readonly payload: { readonly layerId: string };
    }
  | {
      readonly type: 'layer:opacity-changed';
      readonly payload: { readonly layerId: string; readonly opacity: number };
    }
  | { readonly type: 'layer:loading'; readonly payload: { readonly layerId: string } }
  | { readonly type: 'layer:loaded'; readonly payload: { readonly layerId: string; layer: unknown } }
  | {
      readonly type: 'layer:failed';
      readonly payload: { readonly layerId: string; readonly error: string };
    }
  | {
      readonly type: 'group:expanded';
      readonly payload: { readonly groupId: string; readonly expanded: boolean };
    }
  | { readonly type: 'state:changed'; readonly payload: LayerPanelState };

export interface LayerAdapter {
  setVisible(layer: LayerRecord, visible: boolean): void | Promise<void>;
  setOpacity(layer: LayerRecord, opacity: number): void | Promise<void>;
  addLayer(layer: LayerRecord): void | Promise<void>;
  removeLayer(layer: LayerRecord): void | Promise<void>;
}

export interface LayerLoaderResult {
  readonly layer: unknown;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface LayerLoaderStrategy {
  canLoad(layer: LayerItem): boolean;
  load(layer: LayerItem, signal?: AbortSignal): Promise<LayerLoaderResult>;
}
