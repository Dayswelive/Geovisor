"use client";

import type React from "react";
import { useRef, useEffect, useState } from "react";
import L from "leaflet";
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
import { SearchControl } from "./SearchControl";
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
    map.on("draw:created", (e: any) => {
      const { layer } = e;
      const geoJSON = layer.toGeoJSON();
      const area = turf.area(geoJSON);
      const areaInKm = area / 1000000;
      onAreaSelect(geoJSON);
      onAreaCalculated(areaInKm);
    });

    return () => {
      map.off("draw:created");
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

  // Popup function for Regenera landscapes
  // const onEachRegeneraFeature = (feature: any, layer: any) => {
  //   if (feature.properties && feature.properties.name) {
  //     layer.bindPopup(`
  //       <div style="font-family: Arial, sans-serif; padding: 8px;">
  //         <h3 style="margin: 0 0 8px 0; color: #059669;">${
  //           feature.properties.name
  //         }</h3>
  //         <p style="margin: 0 0 5px 0;">${
  //           feature.properties.description || ""
  //         }</p>
  //         ${
  //           feature.properties.area
  //             ? `<p style="margin: 0; font-weight: bold;">Area: ${feature.properties.area} hectares</p>`
  //             : ""
  //         }
  //       </div>
  //     `);
  //   }
  // };
  const onEachRegeneraFeature = (feature: any, layer: L.Layer) => {
    // retain your popup…
    if (feature.properties?.name) {
      layer.bindPopup(`<strong>${feature.properties.name}</strong>`);
    }
    // when the user clicks one of your predefined landscapes:
    layer.on("click", () => {
      const areaSqm = turf.area(feature);
      const areaKm2 = areaSqm / 1e6;
      // props passed from MapWrapper:
      onAreaCalculated(areaKm2);
      onAreaSelect(feature);
    });
  };

  return (
    <MapContainer
      center={[-9.19, -75.0152]}
      zoom={5}
      style={{ height: "100vh", width: "100%" }}
    >
      {" "}
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
        {Object.entries(TILE_LAYERS).map(([key, layer]) => (
          <LayersControl.BaseLayer
            key={key}
            checked={layer.name === baseLayer.name}
            name={layer.name}
          >
            <TileLayer url={layer.url} attribution={layer.attribution} />
          </LayersControl.BaseLayer>
        ))}

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

        <LayersControl.Overlay name="NDVI (NASA GIBS WMTS)">
          <TileLayer
            url="https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_NDVI/default/2025-05-22/250m/{z}/{y}/{x}.png"
            attribution="Imagery courtesy NASA GIBS"
            tileSize={256}
            opacity={0.6}
            maxZoom={8}
            crossOrigin="anonymous"
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
