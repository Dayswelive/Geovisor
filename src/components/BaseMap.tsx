"use client";

import type React from "react";
import { useRef, useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  WMSTileLayer,
  ImageOverlay,
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
import type L from "leaflet";
import { SearchControl } from "./SearchControl";

// Mock data for the layers
import countriesData from "../data/vectorData.json";
import regeneraLandscapesData from "../data/extraVector1.json";
import regeneraGuardiansData from "../data/extraVector2.json";

// Define the interface for the props
interface BaseMapProps {
  selectedBaseLayer: LayerKey;
  onAreaSelect: (area: any) => void;
  onAreaCalculated: (areaInKm: number) => void;
}

// Define the MapEvents component to handle map events
const MapEvents = ({
  onAreaSelect,
  onAreaCalculated,
}: {
  onAreaSelect: (area: any) => void;
  onAreaCalculated: (areaInKm: number) => void;
}) => {
  const map = useMap();

  useEffect(() => {
    // Add event handlers for the map
    map.on("draw:created", (e: any) => {
      const { layer } = e;
      const geoJSON = layer.toGeoJSON();

      // Calculate area in square kilometers
      const area = turf.area(geoJSON);
      const areaInKm = area / 1000000; // Convert to square kilometers

      onAreaSelect(geoJSON);
      onAreaCalculated(areaInKm);
    });

    return () => {
      map.off("draw:created");
    };
  }, [map, onAreaSelect, onAreaCalculated]);

  return null;
};

// Add this function before the BaseMap component
const peruBoundary = {
  type: "Feature",
  properties: { name: "Peru" },
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [-81.4109, -18.3479],
        [-69.99, -18.2599],
        [-69.7709, -17.9836],
        [-69.4521, -17.506],
        [-69.4966, -17.0151],
        [-69.7576, -16.3358],
        [-70.0001, -15.8896],
        [-70.4813, -15.7922],
        [-70.6489, -16.043],
        [-70.8855, -16.2735],
        [-71.3779, -16.0772],
        [-71.4613, -15.6301],
        [-71.6734, -15.3321],
        [-71.9966, -15.0974],
        [-72.2496, -14.9813],
        [-72.3032, -14.5349],
        [-72.7548, -14.0008],
        [-73.0006, -13.8126],
        [-73.2567, -13.7583],
        [-73.558, -13.7647],
        [-73.9874, -14.1138],
        [-74.2966, -14.3377],
        [-74.9739, -14.2731],
        [-75.186, -14.3554],
        [-75.511, -14.4066],
        [-76.009, -14.0742],
        [-76.4235, -13.8232],
        [-76.9399, -13.5351],
        [-77.1158, -12.9883],
        [-77.21, -12.4869],
        [-77.4299, -11.968],
        [-77.6595, -11.3968],
        [-77.8374, -10.9061],
        [-78.0963, -10.3777],
        [-78.4514, -9.4173],
        [-78.7787, -8.8732],
        [-79.0309, -8.1855],
        [-79.436, -7.5521],
        [-79.7601, -7.1903],
        [-80.0374, -6.82],
        [-80.4422, -6.0626],
        [-80.7025, -5.1007],
        [-81.0968, -4.0362],
        [-81.1096, -3.1631],
        [-80.5841, -2.685],
        [-80.0759, -2.2676],
        [-79.6524, -1.9939],
        [-79.2996, -2.0002],
        [-79.1187, -2.2262],
        [-78.8119, -2.4238],
        [-78.6151, -2.7834],
        [-78.4055, -3.0297],
        [-77.9248, -3.0123],
        [-77.5101, -2.9987],
        [-77.1274, -2.8706],
        [-76.7789, -2.6837],
        [-76.2166, -2.553],
        [-75.8018, -2.2691],
        [-75.4007, -1.9744],
        [-75.2337, -1.7053],
        [-75.1446, -1.4077],
        [-75.3806, -1.1983],
        [-75.6206, -0.9572],
        [-75.7172, -0.6082],
        [-75.6877, -0.2952],
        [-75.4525, 0.1521],
        [-75.1965, 0.2227],
        [-74.9482, 0.3834],
        [-74.7465, 0.5548],
        [-74.5374, 0.7361],
        [-74.1532, 1.0142],
        [-73.8303, 1.3605],
        [-73.655, 1.6866],
        [-73.3045, 1.9999],
        [-73.0702, 2.2258],
        [-72.8202, 2.5247],
        [-72.458, 2.8486],
        [-72.1261, 3.0085],
        [-71.917, 3.8493],
        [-71.3315, 4.1391],
        [-70.5948, 4.117],
        [-70.2092, 3.9853],
        [-69.974, 4.2982],
        [-69.377, 4.2407],
        [-69.136, 4.5199],
        [-69.2518, 4.8472],
        [-69.452, 5.0583],
        [-69.9048, 5.0371],
        [-70.047, 5.253],
        [-70.0159, 5.5415],
        [-69.7854, 5.9112],
        [-69.2379, 6.0956],
        [-69.252, 6.273],
        [-69.452, 6.4154],
        [-69.804, 6.4615],
        [-70.047, 6.173],
        [-70.2159, 6.0415],
        [-70.5948, 6.117],
        [-70.8315, 6.0391],
        [-71.117, 5.9853],
        [-71.474, 5.9982],
        [-71.917, 6.0493],
        [-72.198, 5.9853],
        [-72.458, 5.7486],
        [-72.8202, 5.6247],
        [-73.0702, 5.5258],
        [-73.3045, 5.3999],
        [-73.655, 5.0866],
        [-73.8303, 4.8605],
        [-74.1532, 4.5142],
        [-74.5374, 4.2361],
        [-74.7465, 4.0548],
        [-74.9482, 3.8834],
        [-75.1965, 3.7227],
        [-75.4525, 3.6521],
        [-75.6877, 3.2952],
        [-75.7172, 2.9082],
        [-75.6206, 2.5572],
        [-75.3806, 2.3983],
        [-75.1446, 2.1077],
        [-75.2337, 1.8053],
        [-75.4007, 1.5744],
        [-75.8018, 1.2691],
        [-76.2166, 0.953],
        [-76.7789, 0.8837],
        [-77.1274, 0.6706],
        [-77.5101, 0.5987],
        [-77.9248, 0.6123],
        [-78.4055, 0.6297],
        [-78.6151, 0.3834],
        [-78.8119, 0.0238],
        [-79.1187, -0.1762],
        [-79.2996, -0.4002],
        [-79.6524, -0.6939],
        [-80.0759, -0.9676],
        [-80.5841, -1.385],
        [-81.1096, -1.8631],
        [-81.0968, -2.7362],
        [-80.7025, -3.6007],
        [-80.4422, -4.5626],
        [-80.0374, -5.32],
        [-79.7601, -5.9903],
        [-79.436, -6.5521],
        [-79.0309, -7.1855],
        [-78.7787, -7.7732],
        [-78.4514, -8.3173],
        [-78.0963, -9.2777],
        [-77.8374, -9.8061],
        [-77.6595, -10.3968],
        [-77.4299, -10.968],
        [-77.21, -11.4869],
        [-77.1158, -11.9883],
        [-76.9399, -12.4351],
        [-76.4235, -12.8232],
        [-76.009, -13.0742],
        [-75.511, -13.4066],
        [-75.186, -13.3554],
        [-74.9739, -13.2731],
        [-74.2966, -13.3377],
        [-73.9874, -13.6138],
        [-73.558, -13.2647],
        [-73.2567, -13.2583],
        [-73.0006, -13.3126],
        [-72.7548, -13.5008],
        [-72.3032, -14.0349],
        [-72.2496, -14.4813],
        [-71.9966, -14.5974],
        [-71.6734, -14.8321],
        [-71.4613, -15.1301],
        [-71.3779, -15.5772],
        [-70.8855, -15.7735],
        [-70.6489, -15.543],
        [-70.4813, -15.2922],
        [-70.0001, -15.3896],
        [-69.7576, -15.8358],
        [-69.4966, -16.5151],
        [-69.4521, -17.006],
        [-69.7709, -17.4836],
        [-69.99, -17.7599],
        [-81.4109, -17.8479],
        [-81.4109, -18.3479],
      ],
    ],
  },
};

// Update the BaseMap component to include Peru highlighting and better styling for Regenera landscapes
const BaseMap: React.FC<BaseMapProps> = ({
  selectedBaseLayer,
  onAreaSelect,
  onAreaCalculated,
}) => {
  const baseLayer = TILE_LAYERS[selectedBaseLayer];
  const featureGroupRef = useRef<L.FeatureGroup>(null);
  const [searchResult, setSearchResult] = useState<[number, number] | null>(
    null
  );

  // Handle search results
  const handleSearchResult = (result: [number, number]) => {
    setSearchResult(result);
  };

  // Style function for Regenera landscapes
  const regeneraLandscapeStyle = (feature: any) => {
    return {
      fillColor: "#34D399",
      weight: 2,
      opacity: 1,
      color: "#059669",
      dashArray: "3",
      fillOpacity: 0.5,
    };
  };

  // Style function for Peru
  const peruStyle = () => {
    return {
      fillColor: "#4B5563",
      weight: 2,
      opacity: 0.7,
      color: "#1F2937",
      dashArray: "0",
      fillOpacity: 0.2,
    };
  };

  // Popup function for Regenera landscapes
  const onEachRegeneraFeature = (feature: any, layer: any) => {
    if (feature.properties && feature.properties.name) {
      layer.bindPopup(`
        <div style="font-family: Arial, sans-serif; padding: 8px;">
          <h3 style="margin: 0 0 8px 0; color: #059669;">${
            feature.properties.name
          }</h3>
          <p style="margin: 0 0 5px 0;">${
            feature.properties.description || ""
          }</p>
          ${
            feature.properties.area
              ? `<p style="margin: 0; font-weight: bold;">Area: ${feature.properties.area} hectares</p>`
              : ""
          }
        </div>
      `);
    }
  };

  return (
    <MapContainer
      center={[-9.19, -75.0152]}
      zoom={5}
      style={{ height: "100vh", width: "100%" }}
    >
      {/* Add the map events component */}
      <MapEvents
        onAreaSelect={onAreaSelect}
        onAreaCalculated={onAreaCalculated}
      />

      {/* Add search control */}
      <SearchControl onSearchResult={handleSearchResult} />

      {/* Show search result marker if available */}
      {searchResult && (
        <Marker position={searchResult}>
          <Popup>Search Result</Popup>
        </Marker>
      )}

      {/* Base Layers Control */}
      <LayersControl position="topright">
        {/* Base Tile Layers */}
        {Object.entries(TILE_LAYERS).map(([key, layer]) => (
          <LayersControl.BaseLayer
            key={key}
            checked={layer.name === baseLayer.name}
            name={layer.name}
          >
            <TileLayer url={layer.url} attribution={layer.attribution} />
          </LayersControl.BaseLayer>
        ))}

        {/* Peru Boundary */}
        <LayersControl.Overlay checked name="Peru">
          <GeoJSON data={peruBoundary as any} style={peruStyle} />
        </LayersControl.Overlay>

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

        {/* Raster Layers */}
        <LayersControl.Overlay name="IUCN ecosystem typology (vector)">
          <GeoJSON
            data={
              {
                type: "FeatureCollection",
                features: [
                  {
                    type: "Feature",
                    properties: { name: "IUCN Sample" },
                    geometry: {
                      type: "Polygon",
                      coordinates: [
                        [
                          [0, 0],
                          [10, 0],
                          [10, 10],
                          [0, 10],
                          [0, 0],
                        ],
                      ],
                    },
                  },
                ],
              } as any
            }
            style={{ color: "orange", weight: 2, fillOpacity: 0.2 }}
          />
        </LayersControl.Overlay>

        {/* Raster Layers */}
        <LayersControl.Overlay name="Regenera classification system (raster)">
          <WMSTileLayer
            url="https://ows.terrestris.de/osm/service"
            layers="OSM-WMS"
            format="image/png"
            transparent={true}
            opacity={0.6}
          />
        </LayersControl.Overlay>

        <LayersControl.Overlay name="Condition Index 1 (raster)">
          <WMSTileLayer
            url="https://ows.terrestris.de/osm/service"
            layers="TOPO-WMS"
            format="image/png"
            transparent={true}
            opacity={0.6}
          />
        </LayersControl.Overlay>

        <LayersControl.Overlay name="Condition Index 2 (raster)">
          <ImageOverlay
            url="https://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg"
            bounds={[
              [40, -74],
              [41, -73],
            ]}
            opacity={0.5}
          />
        </LayersControl.Overlay>

        <LayersControl.Overlay name="Condition Index 3 (raster)">
          <WMSTileLayer
            url="https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi"
            layers="MODIS_Terra_CorrectedReflectance_TrueColor"
            format="image/png"
            transparent={true}
            opacity={0.6}
          />
        </LayersControl.Overlay>

        <LayersControl.Overlay name="Condition Index 4 (raster)">
          <WMSTileLayer
            url="https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi"
            layers="MODIS_Terra_SurfaceReflectance_Bands721"
            format="image/png"
            transparent={true}
            opacity={0.6}
          />
        </LayersControl.Overlay>

        <LayersControl.Overlay name="Condition accounting (raster)">
          <WMSTileLayer
            url="https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi"
            layers="MODIS_Terra_Land_Surface_Temp_Day"
            format="image/png"
            transparent={true}
            opacity={0.6}
          />
        </LayersControl.Overlay>

        <LayersControl.Overlay name="CO2 equivalent flux (raster)">
          <WMSTileLayer
            url="https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi"
            layers="MODIS_Terra_Aerosol"
            format="image/png"
            transparent={true}
            opacity={0.6}
          />
        </LayersControl.Overlay>

        <LayersControl.Overlay name="Water flow (raster)">
          <WMSTileLayer
            url="https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi"
            layers="MODIS_Terra_Water_Vapor"
            format="image/png"
            transparent={true}
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
  );
};

export default BaseMap;
