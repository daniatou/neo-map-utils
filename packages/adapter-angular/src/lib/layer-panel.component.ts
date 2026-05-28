import { ChangeDetectionStrategy, Component, Input, OnChanges, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import type {
  BaseLayerControl,
  LayerAdapter,
  LayerGroup,
  LayerPanelConfig,
  LayerPanelLayout,
  LayerRecord,
  LayerVisibilityControl
} from '@leaflet-layer-panel/core';
import type { SimpleChanges } from '@angular/core';
import { LlpIconComponent } from './icon.component';
import { LayerPanelAngularService } from './layer-panel-angular.service';

interface ResolvedLayerPanelUi {
  readonly showSearch: boolean;
  readonly showOpacity: boolean;
  readonly showGlobalVisibilityActions: boolean;
  readonly showGroupExpansionAction: boolean;
  readonly visibilityControl: LayerVisibilityControl;
  readonly baseLayerControl: BaseLayerControl;
  readonly density: 'comfortable' | 'compact';
  readonly layout: LayerPanelLayout;
  readonly width: string;
  readonly maxWidth: string;
  readonly height: string;
  readonly maxHeight: string;
  readonly labels: {
    readonly subtitle: string;
    readonly searchPlaceholder: string;
    readonly baseLayer: string;
    readonly opacity: string;
    readonly showAll: string;
    readonly hideAll: string;
    readonly expandAll: string;
    readonly collapseAll: string;
  };
}

@Component({
  selector: 'llp-layer-panel',
  standalone: true,
  imports: [CommonModule, LlpIconComponent],
  providers: [LayerPanelAngularService],
  templateUrl: './layer-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayerPanelComponent implements OnChanges {
  @Input({ required: true }) config!: LayerPanelConfig;
  @Input() layerAdapter?: LayerAdapter;
  @Input() title = 'Layers';
  @Input() variant: 'default' | 'compact' | 'enterprise' | 'floating' | 'minimal' = 'default';

  readonly panel = inject(LayerPanelAngularService);
  readonly state = this.panel.state;
  readonly groups = computed(() => this.state()?.groups ?? []);
  readonly baseLayers = computed(() =>
    Object.values(this.state()?.layers ?? {}).filter((layer) => layer.kind === 'base')
  );
  readonly resolvedUi = computed<ResolvedLayerPanelUi>(() => {
    const labels = this.config.ui?.labels ?? {};
    return {
      showSearch: this.config.ui?.showSearch ?? true,
      showOpacity: this.config.ui?.showOpacity ?? true,
      showGlobalVisibilityActions: this.config.ui?.showGlobalVisibilityActions ?? true,
      showGroupExpansionAction: this.config.ui?.showGroupExpansionAction ?? true,
      visibilityControl: this.config.ui?.visibilityControl ?? 'eye',
      baseLayerControl: this.config.ui?.baseLayerControl ?? 'select',
      density: this.config.ui?.density ?? 'comfortable',
      layout: this.config.ui?.layout ?? 'sidebar',
      width: this.config.ui?.width ?? '100%',
      maxWidth: this.config.ui?.maxWidth ?? '24rem',
      height: this.config.ui?.height ?? 'auto',
      maxHeight: this.config.ui?.maxHeight ?? 'min(720px, calc(100vh - 2rem))',
      labels: {
        subtitle: labels.subtitle ?? 'Gestion des couches',
        searchPlaceholder: labels.searchPlaceholder ?? 'Search layers',
        baseLayer: labels.baseLayer ?? 'Fond de carte',
        opacity: labels.opacity ?? 'Opacity',
        showAll: labels.showAll ?? 'Show all',
        hideAll: labels.hideAll ?? 'Hide all',
        expandAll: labels.expandAll ?? 'Expand all',
        collapseAll: labels.collapseAll ?? 'Collapse all'
      }
    };
  });

  readonly panelStyle = computed(() => ({
    width: this.resolvedUi().width,
    'max-width': this.resolvedUi().maxWidth,
    height: this.resolvedUi().height,
    'max-height': this.resolvedUi().maxHeight
  }));

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['config'] || changes['layerAdapter']) && this.config) {
      this.panel.initialize(this.config, this.layerAdapter);
    }
  }

  layerById(id: string): LayerRecord | undefined {
    return this.state()?.layers[id];
  }

  isExpanded(groupId: string): boolean {
    return this.state()?.expandedGroups[groupId] ?? false;
  }

  allGroupsExpanded(): boolean {
    const groupIds = this.allGroupIds();
    return groupIds.length > 0 && groupIds.every((groupId) => this.isExpanded(groupId));
  }

  setExpanded(groupId: string, expanded: boolean): void {
    if (expanded) {
      this.panel.expandGroup(groupId);
    } else {
      this.panel.collapseGroup(groupId);
    }
  }

  expandAll(): void {
    this.panel.expandGroups(this.allGroupIds());
  }

  collapseAll(): void {
    this.panel.collapseGroups(this.allGroupIds());
  }

  setAllVisible(visible: boolean): void {
    this.panel.setLayerVisibilityMany(this.allOverlayLayerIds(), visible);
  }

  areAllOverlaysVisible(): boolean {
    const overlayIds = this.allOverlayLayerIds();
    return overlayIds.length > 0 && overlayIds.every((layerId) => this.layerById(layerId)?.visible);
  }

  toggleAllVisible(): void {
    this.setAllVisible(!this.areAllOverlaysVisible());
  }

  groupLayerIds(group: LayerGroup): readonly string[] {
    return collectLayerIds(group);
  }

  groupOverlayLayerIds(group: LayerGroup): readonly string[] {
    return this.groupLayerIds(group).filter((layerId) => this.layerById(layerId)?.kind !== 'base');
  }

  groupVisibleCount(group: LayerGroup): number {
    const state = this.state();
    if (!state) {
      return 0;
    }
    return this.groupOverlayLayerIds(group).filter((layerId) => state.layers[layerId]?.visible).length;
  }

  groupLayerCount(group: LayerGroup): number {
    return this.groupOverlayLayerIds(group).length;
  }

  isGroupChecked(group: LayerGroup): boolean {
    const count = this.groupLayerCount(group);
    return count > 0 && this.groupVisibleCount(group) === count;
  }

  isGroupIndeterminate(group: LayerGroup): boolean {
    const visibleCount = this.groupVisibleCount(group);
    return visibleCount > 0 && visibleCount < this.groupLayerCount(group);
  }

  setGroupVisible(group: LayerGroup, visible: boolean, event?: Event): void {
    event?.stopPropagation();
    this.panel.setLayerVisibilityMany(this.groupOverlayLayerIds(group), visible);
  }

  onGroupCheckbox(group: LayerGroup, event: Event): void {
    const checked = event.target instanceof HTMLInputElement ? event.target.checked : false;
    this.setGroupVisible(group, checked, event);
  }

  toggleGroupVisible(group: LayerGroup, event?: Event): void {
    this.setGroupVisible(group, !this.isGroupChecked(group), event);
  }

  onLayerCheckbox(layerId: string, event: Event): void {
    const checked = event.target instanceof HTMLInputElement ? event.target.checked : false;
    this.panel.setLayerVisible(layerId, checked);
  }

  onBaseLayerRadio(layerId: string): void {
    this.panel.setBaseLayer(layerId);
  }

  onBaseLayerSelect(event: Event): void {
    const layerId = event.target instanceof HTMLSelectElement ? event.target.value : '';
    if (layerId) {
      this.panel.setBaseLayer(layerId);
    }
  }

  isBaseLayer(layer: LayerRecord): boolean {
    return layer.kind === 'base';
  }

  isOverlayLayer(layer: LayerRecord): boolean {
    return layer.kind !== 'base';
  }

  hasOverlayContent(group: LayerGroup): boolean {
    return this.groupLayerCount(group) > 0 || (group.children ?? []).some((child) => this.hasOverlayContent(child));
  }

  onSearch(event: Event): void {
    const input = event.target instanceof HTMLInputElement ? event.target.value : '';
    this.panel.setSearch(input);
  }

  onOpacity(layerId: string, event: Event): void {
    const input = event.target instanceof HTMLInputElement ? Number(inputValue(event.target)) : 1;
    this.panel.setOpacity(layerId, input / 100);
  }

  matchesSearch(layer: LayerRecord): boolean {
    const search = this.state()?.search.trim().toLowerCase() ?? '';
    return !search || layer.name.toLowerCase().includes(search);
  }

  activeBaseLayerId(): string {
    return this.state()?.activeBaseLayerId ?? this.baseLayers()[0]?.id ?? '';
  }

  visibleLayerCount(): number {
    const state = this.state();
    if (!state) {
      return 0;
    }
    return Object.values(state.layers).filter((layer) => layer.kind !== 'base' && layer.visible).length;
  }

  totalLayerCount(): number {
    return this.allOverlayLayerIds().length;
  }

  private allLayerIds(): readonly string[] {
    return this.groups().flatMap((group) => collectLayerIds(group));
  }

  private allOverlayLayerIds(): readonly string[] {
    return this.allLayerIds().filter((layerId) => this.layerById(layerId)?.kind !== 'base');
  }

  private allGroupIds(): readonly string[] {
    return this.groups().flatMap((group) => collectGroupIds(group));
  }
}

function inputValue(input: HTMLInputElement): string {
  return input.value;
}

function collectLayerIds(group: LayerGroup): readonly string[] {
  return [
    ...group.layers.map((layer) => layer.id),
    ...(group.children ?? []).flatMap((child) => collectLayerIds(child))
  ];
}

function collectGroupIds(group: LayerGroup): readonly string[] {
  return [group.id, ...(group.children ?? []).flatMap((child) => collectGroupIds(child))];
}
