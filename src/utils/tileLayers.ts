// src/utils/tileLayers.ts

export const TILE_LAYERS = {
  OpenStreetMap: {
    name: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors",
  },
  Satellite: {
    name: "Esri Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "&copy; Esri & contributors",
  },
  Topographic: {
    name: "OpenTopoMap",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenTopoMap contributors",
  },
  DarkMode: {
    name: "Dark Mode",
    url: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
    attribution: "&copy; CartoDB, OpenStreetMap contributors",
  },
  Terrain: {
    name: "Terrain",
    url: "https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png",
    attribution: "&copy; Stamen Design, OpenStreetMap contributors",
  },
} as const;

export type LayerKey = keyof typeof TILE_LAYERS;
