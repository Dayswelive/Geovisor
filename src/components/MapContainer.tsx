import React, { useState } from "react";
import BaseMap from "./BaseMap";
import LayerToggle from "./LayerToggle";
import type { LayerKey } from "../utils/tileLayers";

const MapWrapper: React.FC = () => {
  const [selectedBaseLayer, setSelectedLayer] =
    useState<LayerKey>("OpenStreetMap");

  return (
    <>
      <LayerToggle
        selectedLayer={selectedBaseLayer}
        onChange={setSelectedLayer}
      />
      <BaseMap selectedBaseLayer={selectedBaseLayer} />
    </>
  );
};

export default MapWrapper;
