import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  signal
} from '@angular/core';
import { LeafletLayerAdapter, LayerPanelComponent } from '@neo-maps/leaflet-layer-panel-angular';
import type { LayerAdapter, LayerPanelConfig } from '@neo-maps/leaflet-layer-panel';
import * as L from 'leaflet';

type DemoGeometry =
  | { readonly type: 'LineString'; readonly coordinates: readonly [number, number][] }
  | { readonly type: 'Polygon'; readonly coordinates: readonly (readonly [number, number][])[] };

interface DemoFeature<TGeometry extends DemoGeometry> {
  readonly type: 'Feature';
  readonly properties: Readonly<Record<string, unknown>>;
  readonly geometry: TGeometry;
}

@Component({
  selector: 'llp-demo-root',
  standalone: true,
  imports: [LayerPanelComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoAppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapRoot', { static: true }) private mapRoot?: ElementRef<HTMLDivElement>;

  readonly dark = signal(false);
  readonly layerAdapter = signal<LayerAdapter | undefined>(undefined);

  private map?: L.Map;

  readonly config: LayerPanelConfig = {
    options: {
      lazyLoad: true,
      cacheLoadedLayers: true,
      urlSync: true,
      persistState: true
    },
    ui: {
      showSearch: true,
      showOpacity: true,
      showGlobalVisibilityActions: true,
      showGroupExpansionAction: true,
      enableOrdering: true,
      orderingControl: 'buttons',
      orderingMode: 'dedicated-view',
      visibilityControl: 'eye',
      baseLayerControl: 'select',
      density: 'comfortable',
      layout: 'sidebar',
      width: '100%',
      maxWidth: '24rem',
      maxHeight: 'min(720px, calc(100vh - 2rem))',
      labels: {
        subtitle: 'Gestion des couches avec la config de niania',
        searchPlaceholder: 'Rechercher une couche',
        baseLayer: 'Fond de carte',
        opacity: 'Opacite',
        showAll: 'Tout afficher',
        hideAll: 'Tout cacher',
        expandAll: 'Tout ouvrir',
        collapseAll: 'Tout fermer',
        editOrder: "Modifier l'ordre",
        finishEditOrder: "Terminer l'ordre",
        orderViewTitle: "Ordre d'affichage",
        backToLayers: 'Couches'
      }
    },
    groups: [
      {
        id: 'basemaps',
        name: 'Fond de carte',
        icon: 'map',
        expanded: true,
        layers: [
          {
            id: 'osm',
            name: 'OpenStreetMap',
            type: 'tile',
            kind: 'base',
            icon: 'map',
            visible: true,
            layer: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19,
              attribution: '&copy; OpenStreetMap contributors'
            })
          },
          {
            id: 'opentopo',
            name: 'OpenTopoMap',
            type: 'tile',
            kind: 'base',
            icon: 'map',
            layer: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
              maxZoom: 17,
              attribution: '&copy; OpenTopoMap contributors'
            })
          }
        ]
      },
      {
        id: 'transport',
        name: 'Transport',
        icon: 'layers',
        expanded: true,
        layers: [
          {
            id: 'roads',
            name: 'Primary roads',
            type: 'geojson',
            icon: 'roads',
            visible: true,
            opacity: 0.9,
            layer: L.geoJSON(
              feature(
                {
                  type: 'LineString',
                  coordinates: [
                    [-7.72, 33.49],
                    [-7.64, 33.55],
                    [-7.55, 33.58]
                  ]
                },
                { name: 'Demo road' }
              ),
              { style: { color: '#2563eb', weight: 5, opacity: 0.9 } }
            )
          },
          {
            id: 'rail',
            name: 'Rail corridors',
            type: 'geojson',
            icon: 'roads',
            opacity: 0.65,
            layer: L.geoJSON(
              feature(
                {
                  type: 'LineString',
                  coordinates: [
                    [-7.69, 33.61],
                    [-7.61, 33.57],
                    [-7.52, 33.52]
                  ]
                },
                { name: 'Demo rail' }
              ),
              { style: { color: '#334155', dashArray: '8 6', weight: 4, opacity: 0.65 } }
            )
          }
        ]
      },
      {
        id: 'environment',
        name: 'Environment',
        expanded: true,
        layers: [
          {
            id: 'water',
            name: 'Water bodies',
            type: 'geojson',
            icon: 'water',
            visible: true,
            opacity: 0.72,
            layer: L.geoJSON(
              feature(
                {
                  type: 'Polygon',
                  coordinates: [
                    [
                      [-7.66, 33.5],
                      [-7.58, 33.5],
                      [-7.57, 33.54],
                      [-7.67, 33.55],
                      [-7.66, 33.5]
                    ]
                  ]
                },
                { name: 'Demo water' }
              ),
              { style: { color: '#0284c7', fillColor: '#38bdf8', fillOpacity: 0.28, weight: 2 } }
            )
          },
          {
            id: 'parks',
            name: 'Protected areas',
            type: 'geojson',
            icon: 'map',
            opacity: 0.5,
            minZoom: 8,
            layer: L.geoJSON(
              feature(
                {
                  type: 'Polygon',
                  coordinates: [
                    [
                      [-7.75, 33.56],
                      [-7.7, 33.6],
                      [-7.63, 33.59],
                      [-7.64, 33.54],
                      [-7.75, 33.56]
                    ]
                  ]
                },
                { name: 'Demo park' }
              ),
              { style: { color: '#16a34a', fillColor: '#86efac', fillOpacity: 0.3, weight: 2 } }
            )
          },
          // {
          //   id: 'zone-vocation',
          //   name: 'Zone vocation',
          //   type: 'wms',
          //   icon: 'wms',
          //   opacity: 0.75,
          //   layer: L.tileLayer.wms('https://geoserver.fr/geoserver/wms', {
          //     layers: 'Poas:zone_vocation',
          //     format: 'image/png',
          //     transparent: true,
          //     version: '1.1.1'
          //   })
          // }
        ],
        children: [
          {
            id: 'risk',
            name: 'Risk overlays',
            expanded: false,
            layers: [
              {
                id: 'flood',
                name: 'Flood exposure',
                type: 'geojson',
                icon: 'water',
                opacity: 0.45,
                layer: L.circle([33.555, -7.62], {
                  radius: 3500,
                  color: '#dc2626',
                  fillColor: '#fb7185',
                  fillOpacity: 0.22,
                  weight: 2
                })
              }
            ]
          }
        ]
      }
    ]
  };

  ngAfterViewInit(): void {
    if (!this.mapRoot) {
      return;
    }
    this.map = L.map(this.mapRoot.nativeElement, {
      zoomControl: true,
      center: [33.55, -7.62],
      zoom: 11
    });
    this.layerAdapter.set(new LeafletLayerAdapter(this.map));
    queueMicrotask(() => this.map?.invalidateSize());
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  toggleTheme(): void {
    this.dark.update((value) => !value);
  }
}

function feature<TGeometry extends DemoGeometry>(
  geometry: TGeometry,
  properties: Readonly<Record<string, unknown>>
): DemoFeature<TGeometry> {
  return {
    type: 'Feature',
    properties,
    geometry
  };
}
