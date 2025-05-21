// src/components/LayerToggle.tsx
import React from "react";
import type { LayerKey } from "../utils/tileLayers";

interface LayerToggleProps {
  selectedLayer: LayerKey;
  onChange: (layer: LayerKey) => void;
}

const layers: LayerKey[] = ["OpenStreetMap", "Satellite", "Topographic"];

const LayerToggle: React.FC<LayerToggleProps> = ({
  selectedLayer,
  onChange,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: 50,
        zIndex: 1000,
        background: "#fff",
        padding: "10px",
        borderRadius: "8px",
      }}
    >
      <strong>Base Layer:</strong>
      {layers.map((layer) => (
        <div key={layer}>
          <input
            type="radio"
            value={layer}
            checked={selectedLayer === layer}
            onChange={() => onChange(layer)}
          />
          {layer}
        </div>
      ))}
    </div>
  );
};

export default LayerToggle;
