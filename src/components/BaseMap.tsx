// "use client";

// import type React from "react";
// import { useRef, useEffect, useState, useCallback } from "react";
// import type L from "leaflet";
// import {
//   MapContainer,
//   TileLayer,
//   GeoJSON,
//   WMSTileLayer,
//   LayersControl,
//   useMap,
//   Marker,
//   Popup,
//   FeatureGroup,
// } from "react-leaflet";
// import { EditControl } from "react-leaflet-draw";
// import * as turf from "@turf/turf";
// import { TILE_LAYERS, type LayerKey } from "../utils/tileLayers";
// import "leaflet/dist/leaflet.css";
// import "leaflet-draw/dist/leaflet.draw.css";
// import { SearchControl } from "./SearchControl";
// import countriesData from "../data/vectorData.json";
// import regeneraLandscapesData from "../data/extraVector1.json";
// import regeneraGuardiansData from "../data/extraVector2.json";
// import { WMTSTileLayer } from "../layers/WMTSTileLayer";
// import { LayerLegends } from "./LayerLegends";
// import landscapeData from "../data/vector_current_landscape.json";
// // Import your new guardian data
// import newGuardianData from "../data/vector_guardians_MachuPicchu.json";

// // Define the interface for the props
// interface BaseMapProps {
//   selectedBaseLayer: LayerKey;
//   onAreaSelect: (area: any, carbonData?: any) => void;
//   onAreaCalculated: (areaInKm: number) => void;
// }

// // Map initialization component
// const MapInitializer: React.FC<{
//   onMapReady: (map: L.Map) => void;
// }> = ({ onMapReady }) => {
//   const map = useMap();

//   useEffect(() => {
//     if (map) {
//       onMapReady(map);
//       setTimeout(() => {
//         map.invalidateSize();
//       }, 100);
//     }
//   }, [map, onMapReady]);

//   return null;
// };

// // Layer state tracker component
// const LayerStateTracker: React.FC<{
//   onLayerChange: (layerName: string, isActive: boolean) => void;
// }> = ({ onLayerChange }) => {
//   const map = useMap();

//   useEffect(() => {
//     const handleOverlayAdd = (e: any) => {
//       onLayerChange(e.name, true);
//     };

//     const handleOverlayRemove = (e: any) => {
//       onLayerChange(e.name, false);
//     };

//     map.on("overlayadd", handleOverlayAdd);
//     map.on("overlayremove", handleOverlayRemove);

//     return () => {
//       map.off("overlayadd", handleOverlayAdd);
//       map.off("overlayremove", handleOverlayRemove);
//     };
//   }, [map, onLayerChange]);

//   return null;
// };

// // Define the MapEvents component to handle map events
// const MapEvents = ({
//   onAreaSelect,
//   onAreaCalculated,
// }: {
//   onAreaSelect: (area: any, carbonData?: any) => void;
//   onAreaCalculated: (areaInKm: number) => void;
// }) => {
//   const map = useMap();

//   useEffect(() => {
//     const handleDrawCreated = (e: any) => {
//       const { layer } = e;
//       const geoJSON = layer.toGeoJSON();
//       const area = turf.area(geoJSON);
//       const areaInKm = area / 1000000;
//       onAreaSelect(geoJSON);
//       onAreaCalculated(areaInKm);
//     };

//     map.on("draw:created", handleDrawCreated);

//     return () => {
//       map.off("draw:created", handleDrawCreated);
//     };
//   }, [map, onAreaSelect, onAreaCalculated]);

//   return null;
// };

// const BaseMap: React.FC<BaseMapProps> = ({
//   selectedBaseLayer,
//   onAreaSelect,
//   onAreaCalculated,
// }) => {
//   const baseLayer = TILE_LAYERS[selectedBaseLayer];
//   const featureGroupRef = useRef<L.FeatureGroup>(null);
//   const mapInstanceRef = useRef<L.Map | null>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [searchResult, setSearchResult] = useState<[number, number] | null>(
//     null
//   );
//   const [waterLayerYear, setWaterLayerYear] = useState("2022");
//   const [nppTime, setNppTime] = useState("2023-01-01");
//   const [activeLayers, setActiveLayers] = useState<Set<string>>(new Set());
//   const [isMapReady, setIsMapReady] = useState(false);

//   const ndviDate = "2023-05-21";

//   // Generate unique container ID to avoid conflicts
//   const containerId = useRef(
//     `map-container-${Math.random().toString(36).substr(2, 9)}`
//   );

//   // Cleanup function
//   const cleanupMap = useCallback(() => {
//     if (mapInstanceRef.current) {
//       try {
//         mapInstanceRef.current.remove();
//         mapInstanceRef.current = null;
//       } catch (error) {
//         console.warn("Error cleaning up map:", error);
//       }
//     }

//     if (containerRef.current) {
//       const container = containerRef.current;
//       delete (container as any)._leaflet_id;
//       while (container.firstChild) {
//         container.removeChild(container.firstChild);
//       }
//     }

//     setIsMapReady(false);
//   }, []);

//   useEffect(() => {
//     return () => {
//       cleanupMap();
//     };
//   }, [cleanupMap]);

//   const handleMapReady = useCallback((map: L.Map) => {
//     mapInstanceRef.current = map;
//     setIsMapReady(true);
//   }, []);

//   const handleLayerChange = useCallback(
//     (layerName: string, isActive: boolean) => {
//       setActiveLayers((prev) => {
//         const newSet = new Set(prev);
//         if (isActive) {
//           newSet.add(layerName);
//         } else {
//           newSet.delete(layerName);
//         }
//         return newSet;
//       });
//     },
//     []
//   );

//   const handleSearchResult = useCallback((result: [number, number]) => {
//     setSearchResult(result);
//   }, []);

//   const regeneraLandscapeStyle = useCallback((feature: any) => {
//     return {
//       fillColor: "#34D399",
//       weight: 2,
//       opacity: 1,
//       color: "#059669",
//       dashArray: "3",
//       fillOpacity: 0.5,
//     };
//   }, []);

//   const currentLandscapeStyle = useCallback((feature: any) => {
//     return {
//       fillColor: "#F59E0B", // Amber color to distinguish from Regenera landscapes
//       weight: 3,
//       opacity: 1,
//       color: "#D97706",
//       dashArray: "5,5",
//       fillOpacity: 0.6,
//     };
//   }, []);

//   // New guardian layer styling
//   const newGuardianStyle = useCallback((feature: any) => {
//     return {
//       fillColor: "#10B981", // Emerald green for guardians
//       weight: 2,
//       opacity: 1,
//       color: "#047857",
//       dashArray: "2,4",
//       fillOpacity: 0.4,
//     };
//   }, []);

//   const onEachRegeneraFeature = useCallback(
//     (feature: any, layer: L.Layer) => {
//       if (feature.properties?.name) {
//         layer.bindPopup(`<strong>${feature.properties.name}</strong>`);
//       }
//       layer.on("click", async () => {
//         const areaSqm = turf.area(feature);
//         const areaKm2 = areaSqm / 1e6;
//         onAreaCalculated(areaKm2);
//         onAreaSelect(feature);
//       });
//     },
//     [onAreaSelect, onAreaCalculated]
//   );

//   const onEachCurrentLandscapeFeature = useCallback(
//     (feature: any, layer: L.Layer) => {
//       const properties = feature.properties || {};
//       const popupContent = `
//       <div style="font-family: Arial, sans-serif;">
//         <h3 style="margin: 0 0 8px 0; color: #D97706;">${
//           properties.name || "Current Landscape"
//         }</h3>
//         ${
//           properties.description
//             ? `<p style="margin: 4px 0;">${properties.description}</p>`
//             : ""
//         }
//         ${
//           properties.area
//             ? `<p style="margin: 4px 0;"><strong>Area:</strong> ${properties.area} ha</p>`
//             : ""
//         }
//       </div>
//     `;
//       layer.bindPopup(popupContent);

//       layer.on("click", async () => {
//         const areaSqm = turf.area(feature);
//         const areaKm2 = areaSqm / 1e6;
//         onAreaCalculated(areaKm2);
//         onAreaSelect(feature);
//       });
//     },
//     [onAreaSelect, onAreaCalculated]
//   );

//   // New guardian feature handler
//   const onEachNewGuardianFeature = useCallback(
//     (feature: any, layer: L.Layer) => {
//       const attributes = feature.properties || {};
//       const popupContent = `
//       <div style="font-family: Arial, sans-serif;">
//         <h3 style="margin: 0 0 8px 0; color: #047857;">🛡️ ${
//           attributes.Nombre || "Guardian Area"
//         }</h3>
//         <div style="margin: 4px 0;">
//           <p style="margin: 2px 0;"><strong>Object ID:</strong> ${
//             attributes.OBJECTID || "N/A"
//           }</p>
//           <p style="margin: 2px 0;"><strong>Area:</strong> ${
//             attributes.Area_ha ? `${attributes.Area_ha.toFixed(2)} ha` : "N/A"
//           }</p>
//           <p style="margin: 2px 0;"><strong>Perimeter:</strong> ${
//             attributes.Shape_Length
//               ? `${attributes.Shape_Length.toFixed(4)} units`
//               : "N/A"
//           }</p>
//           <p style="margin: 2px 0;"><strong>Shape Area:</strong> ${
//             attributes.Shape_Area
//               ? `${attributes.Shape_Area.toFixed(6)} sq units`
//               : "N/A"
//           }</p>
//         </div>
//       </div>
//     `;
//       layer.bindPopup(popupContent);

//       layer.on("click", async () => {
//         const areaSqm = turf.area(feature);
//         const areaKm2 = areaSqm / 1e6;
//         onAreaCalculated(areaKm2);
//         onAreaSelect(feature);
//       });
//     },
//     [onAreaSelect, onAreaCalculated]
//   );

//   const isNPPLayerActive = activeLayers.has(
//     "NPP - Net Primary Productivity (NASA)"
//   );
//   const isPrecipitationLayerActive = activeLayers.has(
//     "🌊 Precipitation (CHIRPS)"
//   );

//   return (
//     <div
//       style={{
//         position: "relative",
//         height: "100vh",
//         width: "100%",
//         overflow: "hidden",
//       }}
//     >
//       <div
//         ref={containerRef}
//         id={containerId.current}
//         style={{ height: "100%", width: "100%" }}
//       >
//         <MapContainer
//           center={[-9.19, -75.0152]}
//           zoom={5}
//           minZoom={0}
//           maxZoom={14}
//           style={{
//             height: "100%",
//             width: "100%",
//             cursor: "grab",
//           }}
//           scrollWheelZoom={true}
//           dragging={true}
//           touchZoom={true}
//           doubleClickZoom={true}
//           boxZoom={true}
//           keyboard={true}
//           zoomControl={true}
//           attributionControl={true}
//         >
//           <MapInitializer onMapReady={handleMapReady} />
//           <LayerStateTracker onLayerChange={handleLayerChange} />
//           <MapEvents
//             onAreaSelect={onAreaSelect}
//             onAreaCalculated={onAreaCalculated}
//           />
//           <SearchControl onSearchResult={handleSearchResult} />

//           {searchResult && (
//             <Marker position={searchResult}>
//               <Popup>Search Result</Popup>
//             </Marker>
//           )}

//           <LayersControl position="topright">
//             <LayersControl.BaseLayer checked name={baseLayer.name}>
//               <TileLayer
//                 url={baseLayer.url}
//                 attribution={baseLayer.attribution}
//               />
//             </LayersControl.BaseLayer>

//             {/* Vector Layers */}
//             <LayersControl.Overlay name="Countries (vector)">
//               <GeoJSON
//                 data={countriesData as any}
//                 style={{ color: "#3388ff", weight: 2, fillOpacity: 0.2 }}
//               />
//             </LayersControl.Overlay>

//             <LayersControl.Overlay checked name="Regenera Landscapes (vector)">
//               <GeoJSON
//                 data={regeneraLandscapesData as any}
//                 style={regeneraLandscapeStyle}
//                 onEachFeature={onEachRegeneraFeature}
//               />
//             </LayersControl.Overlay>

//             <LayersControl.Overlay name="Regenera Guardians (vector)">
//               <GeoJSON
//                 data={regeneraGuardiansData as any}
//                 style={{ color: "#8B5CF6", weight: 2, fillOpacity: 0.2 }}
//               />
//             </LayersControl.Overlay>

//             {/* NEW: Updated Guardian Layer with your new data */}
//             <LayersControl.Overlay checked name="🛡️ Guardian Areas (Updated)">
//               <GeoJSON
//                 data={newGuardianData as any}
//                 style={newGuardianStyle}
//                 onEachFeature={onEachNewGuardianFeature}
//               />
//             </LayersControl.Overlay>

//             <LayersControl.Overlay checked name="Current Landscapes (vector)">
//               <GeoJSON
//                 data={landscapeData as any}
//                 style={currentLandscapeStyle}
//                 onEachFeature={onEachCurrentLandscapeFeature}
//               />
//             </LayersControl.Overlay>

//             {/* Climate Regulation Layer - GFW Forest Carbon Flux */}
//             <LayersControl.Overlay name="🌲 Forest Carbon Flux (GFW)">
//               <TileLayer
//                 url="https://tiles.globalforestwatch.org/gfw_forest_carbon_net_flux/latest/default/{z}/{x}/{y}.png"
//                 attribution="Global Forest Watch - Forest Carbon Net Flux"
//                 opacity={0.7}
//               />
//             </LayersControl.Overlay>

//             <LayersControl.Overlay checked name="NDVI 300 m (Copernicus)">
//               <WMTSTileLayer
//                 url="https://globalland.vito.be/wmts"
//                 layer="clms_global_ndvi_300m_v2_10daily"
//                 tilematrixSet="EPSG:3857"
//                 format="image/png"
//                 time={ndviDate}
//                 opacity={0.7}
//               />
//             </LayersControl.Overlay>

//             <LayersControl.Overlay name="Soil organic-C stock 0–30 cm">
//               <WMSTileLayer
//                 url="https://maps.isric.org/mapserv?map=/map/ocs.map"
//                 layers="ocs_0-30cm_mean"
//                 format="image/png"
//                 transparent
//                 opacity={0.7}
//               />
//             </LayersControl.Overlay>

//             <LayersControl.Overlay name="Biodiversity (GBIF Occurrences)">
//               <TileLayer
//                 url="https://api.gbif.org/v2/map/occurrence/density/{z}/{x}/{y}@1x.png"
//                 attribution="GBIF Biodiversity Data"
//                 opacity={0.7}
//               />
//             </LayersControl.Overlay>

//             {/* NPP Layer - Using alternative working endpoint */}
//             <LayersControl.Overlay name="NPP - Net Primary Productivity (NASA)">
//               <TileLayer
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 attribution="NASA MODIS NPP via Google Earth Engine"
//                 opacity={0.7}
//               />
//             </LayersControl.Overlay>

//             {/* Global Water Balance */}
//             <LayersControl.Overlay name="💧 Global Water Balance (ESA)">
//               <TileLayer
//                 url="https://api.resourcewatch.org/v1/layer/c05c32fd-289c-4b20-8d73-dc2458234e04/tile/gee/{z}/{x}/{y}"
//                 attribution="ESA WorldCover via Resource Watch"
//                 opacity={0.6}
//               />
//             </LayersControl.Overlay>

//             {/* Ecosystem Threats Layers - Fixed GFW endpoints */}
//             <LayersControl.Overlay name="🚨 Forest Loss Alerts (GLAD)">
//               <TileLayer
//                 url="https://tiles.globalforestwatch.org/umd_glad_landsat_alerts/latest/default/{z}/{x}/{y}.png"
//                 attribution="Global Forest Watch - GLAD Landsat Alerts"
//                 opacity={0.8}
//                 maxZoom={18}
//               />
//             </LayersControl.Overlay>

//             <LayersControl.Overlay name="🔥 Recent Forest Loss (GFW)">
//               <TileLayer
//                 url="https://tiles.globalforestwatch.org/umd_tree_cover_loss/v1.10/tcd_30/{z}/{x}/{y}.png"
//                 attribution="Global Forest Watch - Tree Cover Loss"
//                 opacity={0.7}
//                 maxZoom={12}
//               />
//             </LayersControl.Overlay>

//             <LayersControl.Overlay name="⚠️ RADD Deforestation Alerts">
//               <TileLayer
//                 url="https://tiles.globalforestwatch.org/wur_radd_alerts/latest/default/{z}/{x}/{y}.png"
//                 attribution="Global Forest Watch - RADD Alerts"
//                 opacity={0.8}
//                 maxZoom={18}
//               />
//             </LayersControl.Overlay>

//             {/* Tree Cover - Fixed endpoint */}
//             <LayersControl.Overlay name="🌳 Tree Cover (Esri)">
//               <WMSTileLayer
//                 url="https://gis-gfw.wri.org/arcgis/services/forest_change/MapServer/WMSServer"
//                 layers="0"
//                 format="image/png"
//                 transparent={true}
//                 opacity={0.7}
//               />
//             </LayersControl.Overlay>

//             {/* Active Fires - Using working NASA endpoint */}
//             <LayersControl.Overlay name="🔥 Active Fires (NASA VIIRS)">
//               <TileLayer
//                 url="https://firms.modaps.eosdis.nasa.gov/mapserver/mapserv?map=/var/www/html/mapserver/mapfiles/firms.map&SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&LAYERS=fires_viirs_24&STYLES=&FORMAT=image/png&TRANSPARENT=true&HEIGHT=256&WIDTH=256&SRS=EPSG:3857&BBOX={bbox-epsg-3857}"
//                 attribution="NASA FIRMS - Fire Information for Resource Management System"
//                 opacity={0.8}
//               />
//             </LayersControl.Overlay>
//           </LayersControl>

//           {/* Drawing Controls */}
//           <FeatureGroup ref={featureGroupRef}>
//             <EditControl
//               position="topleft"
//               draw={{
//                 rectangle: true,
//                 polygon: true,
//                 circle: false,
//                 circlemarker: false,
//                 marker: false,
//                 polyline: true,
//               }}
//               edit={{
//                 edit: true,
//                 remove: true,
//               }}
//             />
//           </FeatureGroup>
//         </MapContainer>
//       </div>

//       {/* CONDITIONAL: Layer Controls */}
//       {(isNPPLayerActive || isPrecipitationLayerActive) && (
//         <div
//           style={{
//             position: "absolute",
//             top: "10px",
//             left: "50%",
//             transform: "translateX(-50%)",
//             zIndex: 1000,
//             display: "flex",
//             gap: "10px",
//             pointerEvents: "auto",
//           }}
//         >
//           {isNPPLayerActive && (
//             <div
//               style={{
//                 background: "white",
//                 padding: "8px",
//                 borderRadius: "4px",
//                 boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//                 border: "1px solid #ccc",
//               }}
//             >
//               <label
//                 htmlFor="npp-time"
//                 style={{
//                   fontSize: "12px",
//                   fontWeight: "bold",
//                   marginRight: "5px",
//                 }}
//               >
//                 NPP Date:
//               </label>
//               <input
//                 type="date"
//                 id="npp-time"
//                 value={nppTime}
//                 onChange={(e) => setNppTime(e.target.value)}
//                 style={{ fontSize: "11px" }}
//               />
//             </div>
//           )}
//         </div>
//       )}

//       <LayerLegends activeLayers={activeLayers} />
//     </div>
//   );
// };

// export default BaseMap;

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
// Import your new guardian data
import newGuardianData from "../data/vector_guardians_MachuPicchu.json";

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

  // New guardian layer styling
  const newGuardianStyle = useCallback((feature: any) => {
    return {
      fillColor: "#10B981", // Emerald green for guardians
      weight: 2,
      opacity: 1,
      color: "#047857",
      dashArray: "2,4",
      fillOpacity: 0.4,
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

  // New guardian feature handler
  const onEachNewGuardianFeature = useCallback(
    (feature: any, layer: L.Layer) => {
      const attributes = feature.properties || {};
      const popupContent = `
      <div style="font-family: Arial, sans-serif;">
        <h3 style="margin: 0 0 8px 0; color: #047857;">🛡️ ${
          attributes.Nombre || "Guardian Area"
        }</h3>
        <div style="margin: 4px 0;">
          <p style="margin: 2px 0;"><strong>Object ID:</strong> ${
            attributes.OBJECTID || "N/A"
          }</p>
          <p style="margin: 2px 0;"><strong>Area:</strong> ${
            attributes.Area_ha ? `${attributes.Area_ha.toFixed(2)} ha` : "N/A"
          }</p>
          <p style="margin: 2px 0;"><strong>Perimeter:</strong> ${
            attributes.Shape_Length
              ? `${attributes.Shape_Length.toFixed(4)} units`
              : "N/A"
          }</p>
          <p style="margin: 2px 0;"><strong>Shape Area:</strong> ${
            attributes.Shape_Area
              ? `${attributes.Shape_Area.toFixed(6)} sq units`
              : "N/A"
          }</p>
        </div>
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
    "📊 NPP - Net Primary Productivity (NASA)"
  );
  const isPrecipitationLayerActive = activeLayers.has(
    "🌊 Precipitation (CHIRPS)"
  );

  // Custom CSS for beautiful layer control
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .leaflet-control-layers {
        background: rgba(255, 255, 255, 0.98) !important;
        backdrop-filter: blur(10px) !important;
        border-radius: 12px !important;
        box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08) !important;
        border: 1px solid rgba(255,255,255,0.2) !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        min-width: 280px !important;
        max-height: 70vh !important;
        overflow-y: auto !important;
      }
      
      .leaflet-control-layers-toggle {
        background: linear-gradient(135deg, #059669, #10b981) !important;
        border-radius: 8px !important;
        width: 40px !important;
        height: 40px !important;
        background-image: none !important;
      }
      
      .leaflet-control-layers-toggle:after {
        content: "🗂️ Add Layers" !important;
        font-size: 18px !important;
        position: absolute !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
      }
      
      .leaflet-control-layers-list {
        padding: 16px !important;
      }
      
      .leaflet-control-layers-base {
        margin-bottom: 16px !important;
        padding-bottom: 16px !important;
        border-bottom: 2px solid #f1f5f9 !important;
      }
      
      .leaflet-control-layers-base label,
      .leaflet-control-layers-overlays label {
        display: flex !important;
        align-items: center !important;
        padding: 8px 12px !important;
        margin: 4px 0 !important;
        border-radius: 8px !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
        font-weight: 500 !important;
        font-size: 14px !important;
        color: #334155 !important;
      }
      
      .leaflet-control-layers-base label:hover,
      .leaflet-control-layers-overlays label:hover {
        background-color: rgba(248, 250, 252, 0.8) !important;
        transform: translateY(-1px) !important;
      }
      
      .leaflet-control-layers-base input,
      .leaflet-control-layers-overlays input {
        margin-right: 10px !important;
        accent-color: #10b981 !important;
        width: 16px !important;
        height: 16px !important;
      }
      
      .leaflet-control-layers-separator {
        border-top: 2px solid #f1f5f9 !important;
        margin: 12px 0 !important;
      }
      
      .leaflet-control-layers-scrollbar {
        scrollbar-width: thin !important;
        scrollbar-color: #cbd5e1 transparent !important;
      }
      
      .leaflet-control-layers-scrollbar::-webkit-scrollbar {
        width: 6px !important;
      }
      
      .leaflet-control-layers-scrollbar::-webkit-scrollbar-track {
        background: transparent !important;
      }
      
      .leaflet-control-layers-scrollbar::-webkit-scrollbar-thumb {
        background-color: #cbd5e1 !important;
        border-radius: 3px !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

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
            <LayersControl.Overlay name="🌍 Countries (vector)">
              <GeoJSON
                data={countriesData as any}
                style={{ color: "#3388ff", weight: 2, fillOpacity: 0.2 }}
              />
            </LayersControl.Overlay>

            <LayersControl.Overlay checked name="🌿 Regenera Landscapes">
              <GeoJSON
                data={regeneraLandscapesData as any}
                style={regeneraLandscapeStyle}
                onEachFeature={onEachRegeneraFeature}
              />
            </LayersControl.Overlay>

            <LayersControl.Overlay name="🛡️ Regenera Guardians (Legacy)">
              <GeoJSON
                data={regeneraGuardiansData as any}
                style={{ color: "#8B5CF6", weight: 2, fillOpacity: 0.2 }}
              />
            </LayersControl.Overlay>

            <LayersControl.Overlay
              checked
              name="🛡️ Guardian Areas (Machu Picchu)"
            >
              <GeoJSON
                data={newGuardianData as any}
                style={newGuardianStyle}
                onEachFeature={onEachNewGuardianFeature}
              />
            </LayersControl.Overlay>

            <LayersControl.Overlay checked name="🏞️ Current Landscapes">
              <GeoJSON
                data={landscapeData as any}
                style={currentLandscapeStyle}
                onEachFeature={onEachCurrentLandscapeFeature}
              />
            </LayersControl.Overlay>

            {/* Climate & Environmental Layers */}
            <LayersControl.Overlay name="🌲 Forest Carbon Flux (GFW)">
              <TileLayer
                url="https://tiles.globalforestwatch.org/gfw_forest_carbon_net_flux/latest/default/{z}/{x}/{y}.png"
                attribution="Global Forest Watch - Forest Carbon Net Flux"
                opacity={0.7}
              />
            </LayersControl.Overlay>

            <LayersControl.Overlay checked name="🌱 NDVI 300m (Copernicus)">
              <WMTSTileLayer
                url="https://globalland.vito.be/wmts"
                layer="clms_global_ndvi_300m_v2_10daily"
                tilematrixSet="EPSG:3857"
                format="image/png"
                time={ndviDate}
                opacity={0.7}
              />
            </LayersControl.Overlay>

            <LayersControl.Overlay name="🌱 Soil Organic Carbon (0-30cm)">
              <WMSTileLayer
                url="https://maps.isric.org/mapserv?map=/map/ocs.map"
                layers="ocs_0-30cm_mean"
                format="image/png"
                transparent
                opacity={0.7}
              />
            </LayersControl.Overlay>

            <LayersControl.Overlay name="🦋 Biodiversity (GBIF Occurrences)">
              <TileLayer
                url="https://api.gbif.org/v2/map/occurrence/density/{z}/{x}/{y}@1x.png"
                attribution="GBIF Biodiversity Data"
                opacity={0.7}
              />
            </LayersControl.Overlay>

            <LayersControl.Overlay name="📊 NPP - Net Primary Productivity (NASA)">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="NASA MODIS NPP via Google Earth Engine"
                opacity={0.7}
              />
            </LayersControl.Overlay>

            <LayersControl.Overlay name="💧 Global Water Balance (ESA)">
              <TileLayer
                url="https://api.resourcewatch.org/v1/layer/c05c32fd-289c-4b20-8d73-dc2458234e04/tile/gee/{z}/{x}/{y}"
                attribution="ESA WorldCover via Resource Watch"
                opacity={0.6}
              />
            </LayersControl.Overlay>

            {/* Threat & Alert Layers */}
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

            <LayersControl.Overlay name="🌳 Tree Cover (Esri)">
              <WMSTileLayer
                url="https://gis-gfw.wri.org/arcgis/services/forest_change/MapServer/WMSServer"
                layers="0"
                format="image/png"
                transparent={true}
                opacity={0.7}
              />
            </LayersControl.Overlay>
            {/* 
            <LayersControl.Overlay name="🔥 Active Fires (NASA VIIRS)">
              <TileLayer
                url="https://firms.modaps.eosdis.nasa.gov/mapserver/mapserv?map=/var/www/html/mapserver/mapfiles/firms.map&SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&LAYERS=fires_viirs_24&STYLES=&FORMAT=image/png&TRANSPARENT=true&HEIGHT=256&WIDTH=256&SRS=EPSG:3857&BBOX={bbox-epsg-3857}"
                attribution="NASA FIRMS - Fire Information for Resource Management System"
                opacity={0.8}
              />
            </LayersControl.Overlay> */}
            <LayersControl.Overlay name="🔥 Active Fires (NASA VIIRS)">
              <WMSTileLayer
                url="https://firms.modaps.eosdis.nasa.gov/wms/?"
                layers="fires_viirs"
                format="image/png"
                transparent={true}
                attribution="NASA FIRMS"
                opacity={0.8}
                version="1.3.0" // Recommended to specify
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
            gap: "12px",
            pointerEvents: "auto",
          }}
        >
          {isNPPLayerActive && (
            <div
              style={{
                background: "rgba(255, 255, 255, 0.98)",
                backdropFilter: "blur(10px)",
                padding: "12px 16px",
                borderRadius: "10px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <label
                htmlFor="npp-time"
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                📊 NPP Date:
              </label>
              <input
                type="date"
                id="npp-time"
                value={nppTime}
                onChange={(e) => setNppTime(e.target.value)}
                style={{
                  fontSize: "12px",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  backgroundColor: "white",
                }}
              />
            </div>
          )}
        </div>
      )}

      <LayerLegends activeLayers={activeLayers} />
    </div>
  );
};

export default BaseMap;
