"use client";

import type React from "react";
import type { LayerKey } from "../utils/tileLayers";
import { Layers, Map } from "lucide-react";

interface LayerToggleProps {
  selectedLayer: LayerKey;
  onChange: (layer: LayerKey) => void;
}

const layers: LayerKey[] = [
  "OpenStreetMap",
  "Satellite",
  "Topographic",
  "DarkMode",
  "Terrain",
];

const LayerToggle: React.FC<LayerToggleProps> = ({
  selectedLayer,
  onChange,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "60px",
        right: "10px",
        zIndex: 999,
        backgroundColor: "white",
        padding: "12px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        border: "1px solid rgba(0,0,0,0.1)",
        width: "220px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "10px",
          borderBottom: "1px solid #e5e7eb",
          paddingBottom: "8px",
        }}
      >
        <Map size={18} style={{ marginRight: "8px", color: "#059669" }} />
        <strong style={{ fontSize: "14px", color: "#1f2937" }}>
          Base Map Selection
        </strong>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {layers.map((layer) => (
          <label
            key={layer}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "6px 8px",
              borderRadius: "4px",
              cursor: "pointer",
              backgroundColor:
                selectedLayer === layer ? "#f0fdf4" : "transparent",
              border:
                selectedLayer === layer
                  ? "1px solid #d1fae5"
                  : "1px solid transparent",
              transition: "all 0.2s ease",
            }}
          >
            <input
              type="radio"
              value={layer}
              checked={selectedLayer === layer}
              onChange={() => onChange(layer)}
              style={{ marginRight: "8px" }}
            />
            <span
              style={{
                fontSize: "14px",
                color: selectedLayer === layer ? "#059669" : "#4b5563",
                fontWeight: selectedLayer === layer ? "500" : "normal",
              }}
            >
              {layer}
            </span>
          </label>
        ))}
      </div>

      <div
        style={{
          marginTop: "12px",
          fontSize: "12px",
          color: "#6b7280",
          padding: "8px",
          backgroundColor: "#f9fafb",
          borderRadius: "4px",
        }}
      >
        <Layers
          size={14}
          style={{
            display: "inline",
            marginRight: "4px",
            verticalAlign: "middle",
          }}
        />
        Use the layers control in the top-right corner to toggle additional data
        layers.
      </div>
    </div>
  );
};

export default LayerToggle;
