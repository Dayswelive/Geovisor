"use client";

import type React from "react";
import { useRef, useEffect, useState, useCallback } from "react";
import type L from "leaflet";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  WMSTileLayer,
  LayersControl,
  useMap,
  Marker,
  Popup,
  FeatureGroup,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import * as turf from "@turf/turf";
import { TILE_LAYERS, type LayerKey } from "../utils/tileLayers";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { SearchControl } from "./SearchControl";
import countriesData from "../data/vectorData.json";
import regeneraLandscapesData from "../data/extraVector1.json";
import regeneraGuardiansData from "../data/extraVector2.json";
import { WMTSTileLayer } from "../layers/WMTSTileLayer";
import { LayerLegends } from "./LayerLegends";
import landscapeData from "../data/vector_current_landscape.json";

// Define the interface for the props
interface BaseMapProps {
  selectedBaseLayer: LayerKey;
  onAreaSelect: (area: any, carbonData?: any) => void;
  onAreaCalculated: (areaInKm: number) => void;
}

// Map initialization component
const MapInitializer: React.FC<{
  onMapReady: (map: L.Map) => void;
}> = ({ onMapReady }) => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      onMapReady(map);
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  }, [map, onMapReady]);

  return null;
};

// Layer state tracker component
const LayerStateTracker: React.FC<{
  onLayerChange: (layerName: string, isActive: boolean) => void;
}> = ({ onLayerChange }) => {
  const map = useMap();

  useEffect(() => {
    const handleOverlayAdd = (e: any) => {
      onLayerChange(e.name, true);
    };

    const handleOverlayRemove = (e: any) => {
      onLayerChange(e.name, false);
    };

    map.on("overlayadd", handleOverlayAdd);
    map.on("overlayremove", handleOverlayRemove);

    return () => {
      map.off("overlayadd", handleOverlayAdd);
      map.off("overlayremove", handleOverlayRemove);
    };
  }, [map, onLayerChange]);

  return null;
};

// Define the MapEvents component to handle map events
const MapEvents = ({
  onAreaSelect,
  onAreaCalculated,
}: {
  onAreaSelect: (area: any, carbonData?: any) => void;
  onAreaCalculated: (areaInKm: number) => void;
}) => {
  const map = useMap();

  useEffect(() => {
    const handleDrawCreated = (e: any) => {
      const { layer } = e;
      const geoJSON = layer.toGeoJSON();
      const area = turf.area(geoJSON);
      const areaInKm = area / 1000000;
      onAreaSelect(geoJSON);
      onAreaCalculated(areaInKm);
    };

    map.on("draw:created", handleDrawCreated);

    return () => {
      map.off("draw:created", handleDrawCreated);
    };
  }, [map, onAreaSelect, onAreaCalculated]);

  return null;
};

const BaseMap: React.FC<BaseMapProps> = ({
  selectedBaseLayer,
  onAreaSelect,
  onAreaCalculated,
}) => {
  const baseLayer = TILE_LAYERS[selectedBaseLayer];
  const featureGroupRef = useRef<L.FeatureGroup>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchResult, setSearchResult] = useState<[number, number] | null>(
    null
  );
  const [waterLayerYear, setWaterLayerYear] = useState("2022");
  const [nppTime, setNppTime] = useState("2023-01-01");
  const [activeLayers, setActiveLayers] = useState<Set<string>>(new Set());
  const [isMapReady, setIsMapReady] = useState(false);

  const ndviDate = "2023-05-21";

  // Generate unique container ID to avoid conflicts
  const containerId = useRef(
    `map-container-${Math.random().toString(36).substr(2, 9)}`
  );

  // Cleanup function
  const cleanupMap = useCallback(() => {
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      } catch (error) {
        console.warn("Error cleaning up map:", error);
      }
    }

    if (containerRef.current) {
      const container = containerRef.current;
      delete (container as any)._leaflet_id;
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    }

    setIsMapReady(false);
  }, []);

  useEffect(() => {
    return () => {
      cleanupMap();
    };
  }, [cleanupMap]);

  const handleMapReady = useCallback((map: L.Map) => {
    mapInstanceRef.current = map;
    setIsMapReady(true);
  }, []);

  const handleLayerChange = useCallback(
    (layerName: string, isActive: boolean) => {
      setActiveLayers((prev) => {
        const newSet = new Set(prev);
        if (isActive) {
          newSet.add(layerName);
        } else {
          newSet.delete(layerName);
        }
        return newSet;
      });
    },
    []
  );

  const handleSearchResult = useCallback((result: [number, number]) => {
    setSearchResult(result);
  }, []);

  const regeneraLandscapeStyle = useCallback((feature: any) => {
    return {
      fillColor: "#34D399",
      weight: 2,
      opacity: 1,
      color: "#059669",
      dashArray: "3",
      fillOpacity: 0.5,
    };
  }, []);

  const currentLandscapeStyle = useCallback((feature: any) => {
    return {
      fillColor: "#F59E0B", // Amber color to distinguish from Regenera landscapes
      weight: 3,
      opacity: 1,
      color: "#D97706",
      dashArray: "5,5",
      fillOpacity: 0.6,
    };
  }, []);

  const onEachRegeneraFeature = useCallback(
    (feature: any, layer: L.Layer) => {
      if (feature.properties?.name) {
        layer.bindPopup(`<strong>${feature.properties.name}</strong>`);
      }
      layer.on("click", async () => {
        const areaSqm = turf.area(feature);
        const areaKm2 = areaSqm / 1e6;
        onAreaCalculated(areaKm2);
        onAreaSelect(feature);
      });
    },
    [onAreaSelect, onAreaCalculated]
  );

  const onEachCurrentLandscapeFeature = useCallback(
    (feature: any, layer: L.Layer) => {
      const properties = feature.properties || {};
      const popupContent = `
      <div style="font-family: Arial, sans-serif;">
        <h3 style="margin: 0 0 8px 0; color: #D97706;">${
          properties.name || "Current Landscape"
        }</h3>
        ${
          properties.description
            ? `<p style="margin: 4px 0;">${properties.description}</p>`
            : ""
        }
        ${
          properties.area
            ? `<p style="margin: 4px 0;"><strong>Area:</strong> ${properties.area} ha</p>`
            : ""
        }
      </div>
    `;
      layer.bindPopup(popupContent);

      layer.on("click", async () => {
        const areaSqm = turf.area(feature);
        const areaKm2 = areaSqm / 1e6;
        onAreaCalculated(areaKm2);
        onAreaSelect(feature);
      });
    },
    [onAreaSelect, onAreaCalculated]
  );

  const isNPPLayerActive = activeLayers.has(
    "NPP - Net Primary Productivity (NASA)"
  );
  const isPrecipitationLayerActive = activeLayers.has(
    "🌊 Precipitation (CHIRPS)"
  );

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <div
        ref={containerRef}
        id={containerId.current}
        style={{ height: "100%", width: "100%" }}
      >
        <MapContainer
          center={[-9.19, -75.0152]}
          zoom={5}
          minZoom={0}
          maxZoom={14}
          style={{
            height: "100%",
            width: "100%",
            cursor: "grab",
          }}
          scrollWheelZoom={true}
          dragging={true}
          touchZoom={true}
          doubleClickZoom={true}
          boxZoom={true}
          keyboard={true}
          zoomControl={true}
          attributionControl={true}
        >
          <MapInitializer onMapReady={handleMapReady} />
          <LayerStateTracker onLayerChange={handleLayerChange} />
          <MapEvents
            onAreaSelect={onAreaSelect}
            onAreaCalculated={onAreaCalculated}
          />
          <SearchControl onSearchResult={handleSearchResult} />

          {searchResult && (
            <Marker position={searchResult}>
              <Popup>Search Result</Popup>
            </Marker>
          )}

          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name={baseLayer.name}>
              <TileLayer
                url={baseLayer.url}
                attribution={baseLayer.attribution}
              />
            </LayersControl.BaseLayer>

            {/* Vector Layers */}
            <LayersControl.Overlay name="Countries (vector)">
              <GeoJSON
                data={countriesData as any}
                style={{ color: "#3388ff", weight: 2, fillOpacity: 0.2 }}
              />
            </LayersControl.Overlay>

            <LayersControl.Overlay checked name="Regenera Landscapes (vector)">
              <GeoJSON
                data={regeneraLandscapesData as any}
                style={regeneraLandscapeStyle}
                onEachFeature={onEachRegeneraFeature}
              />
            </LayersControl.Overlay>

            <LayersControl.Overlay name="Regenera Guardians (vector)">
              <GeoJSON
                data={regeneraGuardiansData as any}
                style={{ color: "#8B5CF6", weight: 2, fillOpacity: 0.2 }}
              />
            </LayersControl.Overlay>

            <LayersControl.Overlay checked name="Current Landscapes (vector)">
              <GeoJSON
                data={landscapeData as any}
                style={currentLandscapeStyle}
                onEachFeature={onEachCurrentLandscapeFeature}
              />
            </LayersControl.Overlay>

            {/* Climate Regulation Layer - GFW Forest Carbon Flux */}
            <LayersControl.Overlay name="🌲 Forest Carbon Flux (GFW)">
              <TileLayer
                url="https://tiles.globalforestwatch.org/gfw_forest_carbon_net_flux/latest/default/{z}/{x}/{y}.png"
                attribution="Global Forest Watch - Forest Carbon Net Flux"
                opacity={0.7}
              />
            </LayersControl.Overlay>

            <LayersControl.Overlay checked name="NDVI 300 m (Copernicus)">
              <WMTSTileLayer
                url="https://globalland.vito.be/wmts"
                layer="clms_global_ndvi_300m_v2_10daily"
                tilematrixSet="EPSG:3857"
                format="image/png"
                time={ndviDate}
                opacity={0.7}
              />
            </LayersControl.Overlay>

            <LayersControl.Overlay name="Soil organic-C stock 0–30 cm">
              <WMSTileLayer
                url="https://maps.isric.org/mapserv?map=/map/ocs.map"
                layers="ocs_0-30cm_mean"
                format="image/png"
                transparent
                opacity={0.7}
              />
            </LayersControl.Overlay>

            <LayersControl.Overlay name="Biodiversity (GBIF Occurrences)">
              <TileLayer
                url="https://api.gbif.org/v2/map/occurrence/density/{z}/{x}/{y}@1x.png"
                attribution="GBIF Biodiversity Data"
                opacity={0.7}
              />
            </LayersControl.Overlay>

            {/* NPP Layer - Using alternative working endpoint */}
            <LayersControl.Overlay name="NPP - Net Primary Productivity (NASA)">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="NASA MODIS NPP via Google Earth Engine"
                opacity={0.7}
              />
            </LayersControl.Overlay>

            {/* Water Stress Index - Using alternative working endpoint */}
            <LayersControl.Overlay name="💧 Water Stress Index (WRI Aqueduct)">
              <TileLayer
                url="https://api.resourcewatch.org/v1/layer/044f4af8-be72-4999-b7dd-13434fc4a394/tile/gee/{z}/{x}/{y}"
                attribution="World Resources Institute - Aqueduct Water Risk Atlas"
                opacity={0.7}
              />
            </LayersControl.Overlay>

            {/* Precipitation - Fixed template variable issue */}
            <LayersControl.Overlay name="🌊 Precipitation (CHIRPS)">
              <TileLayer
                url="https://api.resourcewatch.org/v1/layer/098b33df-6871-4e53-a5ff-b56a7d989f9a/tile/gee/{z}/{x}/{y}"
                attribution="CHIRPS Precipitation Data via Resource Watch"
                opacity={0.7}
              />
            </LayersControl.Overlay>

            {/* Global Water Balance */}
            <LayersControl.Overlay name="💧 Global Water Balance (ESA)">
              <TileLayer
                url="https://api.resourcewatch.org/v1/layer/c05c32fd-289c-4b20-8d73-dc2458234e04/tile/gee/{z}/{x}/{y}"
                attribution="ESA WorldCover via Resource Watch"
                opacity={0.6}
              />
            </LayersControl.Overlay>

            {/* Ecosystem Threats Layers - Fixed GFW endpoints */}
            <LayersControl.Overlay name="🚨 Forest Loss Alerts (GLAD)">
              <TileLayer
                url="https://tiles.globalforestwatch.org/umd_glad_landsat_alerts/latest/default/{z}/{x}/{y}.png"
                attribution="Global Forest Watch - GLAD Landsat Alerts"
                opacity={0.8}
                maxZoom={18}
              />
            </LayersControl.Overlay>

            <LayersControl.Overlay name="🔥 Recent Forest Loss (GFW)">
              <TileLayer
                url="https://tiles.globalforestwatch.org/umd_tree_cover_loss/v1.10/tcd_30/{z}/{x}/{y}.png"
                attribution="Global Forest Watch - Tree Cover Loss"
                opacity={0.7}
                maxZoom={12}
              />
            </LayersControl.Overlay>

            <LayersControl.Overlay name="⚠️ RADD Deforestation Alerts">
              <TileLayer
                url="https://tiles.globalforestwatch.org/wur_radd_alerts/latest/default/{z}/{x}/{y}.png"
                attribution="Global Forest Watch - RADD Alerts"
                opacity={0.8}
                maxZoom={18}
              />
            </LayersControl.Overlay>

            {/* Tree Cover - Fixed endpoint */}
            <LayersControl.Overlay name="🌳 Tree Cover (Esri)">
              <WMSTileLayer
                url="https://gis-gfw.wri.org/arcgis/services/forest_change/MapServer/WMSServer"
                layers="0"
                format="image/png"
                transparent={true}
                opacity={0.7}
              />
            </LayersControl.Overlay>

            {/* Active Fires - Using working NASA endpoint */}
            <LayersControl.Overlay name="🔥 Active Fires (NASA VIIRS)">
              <TileLayer
                url="https://firms.modaps.eosdis.nasa.gov/mapserver/mapserv?map=/var/www/html/mapserver/mapfiles/firms.map&SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&LAYERS=fires_viirs_24&STYLES=&FORMAT=image/png&TRANSPARENT=true&HEIGHT=256&WIDTH=256&SRS=EPSG:3857&BBOX={bbox-epsg-3857}"
                attribution="NASA FIRMS - Fire Information for Resource Management System"
                opacity={0.8}
              />
            </LayersControl.Overlay>

            {/* Biodiversity Hotspots */}
            <LayersControl.Overlay name="🦎 Biodiversity Hotspots">
              <TileLayer
                url="https://api.resourcewatch.org/v1/layer/b584954c-0d8d-40c6-859c-f3fdf3c2c5df/tile/gee/{z}/{x}/{y}"
                attribution="Biodiversity Hotspots via Resource Watch"
                opacity={0.6}
              />
            </LayersControl.Overlay>
          </LayersControl>

          {/* Drawing Controls */}
          <FeatureGroup ref={featureGroupRef}>
            <EditControl
              position="topleft"
              draw={{
                rectangle: true,
                polygon: true,
                circle: false,
                circlemarker: false,
                marker: false,
                polyline: true,
              }}
              edit={{
                edit: true,
                remove: true,
              }}
            />
          </FeatureGroup>
        </MapContainer>
      </div>

      {/* CONDITIONAL: Layer Controls */}
      {(isNPPLayerActive || isPrecipitationLayerActive) && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            display: "flex",
            gap: "10px",
            pointerEvents: "auto",
          }}
        >
          {isNPPLayerActive && (
            <div
              style={{
                background: "white",
                padding: "8px",
                borderRadius: "4px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                border: "1px solid #ccc",
              }}
            >
              <label
                htmlFor="npp-time"
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  marginRight: "5px",
                }}
              >
                NPP Date:
              </label>
              <input
                type="date"
                id="npp-time"
                value={nppTime}
                onChange={(e) => setNppTime(e.target.value)}
                style={{ fontSize: "11px" }}
              />
            </div>
          )}

          {isPrecipitationLayerActive && (
            <div
              style={{
                background: "white",
                padding: "8px",
                borderRadius: "4px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                border: "1px solid #ccc",
              }}
            >
              <label
                htmlFor="water-year"
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  marginRight: "5px",
                }}
              >
                Water Data Year:
              </label>
              <select
                id="water-year"
                value={waterLayerYear}
                onChange={(e) => setWaterLayerYear(e.target.value)}
                style={{ fontSize: "11px" }}
              >
                <option value="2020">2020</option>
                <option value="2021">2021</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
              </select>
            </div>
          )}
        </div>
      )}

      <LayerLegends activeLayers={activeLayers} />
    </div>
  );
};

export default BaseMap;
