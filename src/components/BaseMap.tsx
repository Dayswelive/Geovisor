// // src/components/BaseMap.tsx
// import React from "react";
// import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
// import { TILE_LAYERS, LayerKey } from "../utils/tileLayers";
// import vectorData from "../data/vectorData.json";

// interface Props {
//   selectedLayer: LayerKey;
// }

// const BaseMap: React.FC<Props> = ({ selectedLayer }) => {
//   const tileLayer = TILE_LAYERS[selectedLayer];

//   return (
//     <MapContainer
//       center={[51.505, -0.09]}
//       zoom={13}
//       style={{ height: "100vh", width: "100%" }}
//     >
//       <TileLayer attribution={tileLayer.attribution} url={tileLayer.url} />
//       <GeoJSON data={vectorData as any} />
//     </MapContainer>
//   );
// };

// export default BaseMap;

// src/components/BaseMap.tsx
import React from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  WMSTileLayer,
  ImageOverlay,
  LayersControl,
} from "react-leaflet";
import { TILE_LAYERS, LayerKey } from "../utils/tileLayers";
import vectorData from "../data/vectorData.json";
import extraVectorData from "../data/extraVector1.json";
import extraVectorData2 from "../data/extraVector2.json";

const imageBounds: [[number, number], [number, number]] = [
  [51.49, -0.11],
  [51.52, -0.06],
];

interface Props {
  selectedBaseLayer: LayerKey;
}

const BaseMap: React.FC<Props> = ({ selectedBaseLayer }) => {
  const baseLayer = TILE_LAYERS[selectedBaseLayer];

  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
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

        {/* Vector Layers */}
        <LayersControl.Overlay checked name="Primary Vector Layer">
          <GeoJSON data={vectorData as any} />
        </LayersControl.Overlay>

        <LayersControl.Overlay name="Extra Vector Layer 1">
          <GeoJSON data={extraVectorData as any} style={{ color: "green" }} />
        </LayersControl.Overlay>

        <LayersControl.Overlay name="Extra Vector Layer 2">
          <GeoJSON data={extraVectorData2 as any} style={{ color: "purple" }} />
        </LayersControl.Overlay>

        {/* Raster WMS Layer */}
        <LayersControl.Overlay name="NASA Satellite WMS">
          <WMSTileLayer
            url="https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi"
            layers="MODIS_Terra_CorrectedReflectance_TrueColor"
            format="image/png"
            transparent={true}
          />
        </LayersControl.Overlay>

        {/* Image Overlay */}
        <LayersControl.Overlay name="Custom Image Overlay">
          <ImageOverlay
            url="https://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg"
            bounds={imageBounds}
            opacity={0.5}
          />
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  );
};

export default BaseMap;
