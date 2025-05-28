"use client";

import type React from "react";
import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";

interface LayerLegendsProps {
  activeLayers: Set<string>;
}

interface LegendItem {
  color: string;
  label: string;
  value?: string;
}

interface LegendConfig {
  title: string;
  items: LegendItem[];
  unit?: string;
  description?: string;
}

const LEGEND_CONFIGS: Record<string, LegendConfig> = {
  "🌲 Forest Carbon Flux (GFW)": {
    title: "Forest Carbon Net Flux",
    unit: "Mg C/ha/year",
    description: "Net carbon emissions/removals from forests",
    items: [
      { color: "#8B0000", label: "High Emissions", value: "> 50" },
      { color: "#FF4500", label: "Medium Emissions", value: "10-50" },
      { color: "#FFD700", label: "Low Emissions", value: "0-10" },
      { color: "#90EE90", label: "Low Removals", value: "0 to -10" },
      { color: "#32CD32", label: "Medium Removals", value: "-10 to -50" },
      { color: "#006400", label: "High Removals", value: "< -50" },
    ],
  },
  "NDVI 300 m (Copernicus)": {
    title: "NDVI - Vegetation Health",
    unit: "Index (0-1)",
    description: "Normalized Difference Vegetation Index",
    items: [
      { color: "#8B4513", label: "Bare Soil/Rock", value: "0.0-0.1" },
      { color: "#DEB887", label: "Sparse Vegetation", value: "0.1-0.2" },
      { color: "#F0E68C", label: "Moderate Vegetation", value: "0.2-0.4" },
      { color: "#9ACD32", label: "Dense Vegetation", value: "0.4-0.6" },
      { color: "#32CD32", label: "Very Dense Vegetation", value: "0.6-0.8" },
      { color: "#006400", label: "Lush Vegetation", value: "0.8-1.0" },
    ],
  },
  "Soil organic-C stock 0–30 cm": {
    title: "Soil Organic Carbon Stock",
    unit: "tons C/ha",
    description: "Carbon stored in top 30cm of soil",
    items: [
      { color: "#FFEBCD", label: "Very Low", value: "0-20" },
      { color: "#DEB887", label: "Low", value: "20-40" },
      { color: "#CD853F", label: "Medium", value: "40-80" },
      { color: "#A0522D", label: "High", value: "80-120" },
      { color: "#8B4513", label: "Very High", value: "> 120" },
    ],
  },
  "Biodiversity (GBIF Occurrences)": {
    title: "Species Occurrence Density",
    unit: "occurrences/km²",
    description: "Density of recorded species observations",
    items: [
      { color: "#FFFACD", label: "Very Low", value: "1-10" },
      { color: "#FFE4B5", label: "Low", value: "10-50" },
      { color: "#DDA0DD", label: "Medium", value: "50-200" },
      { color: "#9370DB", label: "High", value: "200-500" },
      { color: "#4B0082", label: "Very High", value: "> 500" },
    ],
  },
  "NPP - Net Primary Productivity (NASA)": {
    title: "Net Primary Productivity",
    unit: "kg C/m²/year",
    description: "Annual carbon fixation by vegetation",
    items: [
      { color: "#8B4513", label: "Very Low", value: "0-0.2" },
      { color: "#DEB887", label: "Low", value: "0.2-0.5" },
      { color: "#F0E68C", label: "Medium", value: "0.5-1.0" },
      { color: "#9ACD32", label: "High", value: "1.0-1.5" },
      { color: "#32CD32", label: "Very High", value: "1.5-2.0" },
      { color: "#006400", label: "Extremely High", value: "> 2.0" },
    ],
  },
  "💧 Water Stress Index (WRI Aqueduct)": {
    title: "Water Stress Level",
    unit: "Ratio",
    description: "Water demand vs. available supply",
    items: [
      { color: "#0066CC", label: "Low Stress", value: "< 10%" },
      { color: "#00CCFF", label: "Low-Medium Stress", value: "10-20%" },
      { color: "#FFFF00", label: "Medium-High Stress", value: "20-40%" },
      { color: "#FF9900", label: "High Stress", value: "40-80%" },
      { color: "#FF0000", label: "Extremely High Stress", value: "> 80%" },
    ],
  },
  "🌊 Precipitation (CHIRPS)": {
    title: "Annual Precipitation",
    unit: "mm/year",
    description: "Total annual rainfall",
    items: [
      { color: "#8B4513", label: "Arid", value: "0-200" },
      { color: "#DEB887", label: "Semi-Arid", value: "200-500" },
      { color: "#F0E68C", label: "Sub-Humid", value: "500-1000" },
      { color: "#87CEEB", label: "Humid", value: "1000-2000" },
      { color: "#4169E1", label: "Very Humid", value: "2000-3000" },
      { color: "#0000FF", label: "Extremely Humid", value: "> 3000" },
    ],
  },
  "🌳 Tree Cover (GFW)": {
    title: "Tree Cover Density",
    unit: "Percentage",
    description: "Canopy cover percentage in 2010",
    items: [
      { color: "#FFEBCD", label: "No Cover", value: "0%" },
      { color: "#DEB887", label: "Low Cover", value: "1-25%" },
      { color: "#9ACD32", label: "Medium Cover", value: "25-50%" },
      { color: "#32CD32", label: "High Cover", value: "50-75%" },
      { color: "#006400", label: "Very High Cover", value: "75-100%" },
    ],
  },
  "🔥 Recent Forest Loss (GFW)": {
    title: "Tree Cover Loss",
    unit: "Year",
    description: "Year of forest loss detected",
    items: [
      { color: "#FFFF00", label: "2001-2005", value: "Early Loss" },
      { color: "#FF9900", label: "2006-2010", value: "Mid Loss" },
      { color: "#FF6600", label: "2011-2015", value: "Recent Loss" },
      { color: "#FF3300", label: "2016-2020", value: "Very Recent" },
      { color: "#FF0000", label: "2021+", value: "Latest Loss" },
    ],
  },
  "🚨 Forest Loss Alerts (GLAD)": {
    title: "GLAD Deforestation Alerts",
    unit: "Confidence",
    description: "Recent deforestation detection",
    items: [
      { color: "#00FFFF", label: "Low Confidence", value: "Possible" },
      { color: "#0080FF", label: "Medium Confidence", value: "Likely" },
      { color: "#0000FF", label: "High Confidence", value: "Confirmed" },
    ],
  },
  "⚠️ RADD Deforestation Alerts": {
    title: "RADD Alerts",
    unit: "Date",
    description: "Radar-based deforestation alerts",
    items: [
      { color: "#FFFF00", label: "30+ days ago", value: "Old Alert" },
      { color: "#FF9900", label: "7-30 days ago", value: "Recent Alert" },
      { color: "#FF0000", label: "< 7 days ago", value: "New Alert" },
    ],
  },
  "🔥 Active Fires (NASA VIIRS)": {
    title: "Active Fire Detection",
    unit: "Confidence",
    description: "Real-time fire detection",
    items: [
      { color: "#FFFF00", label: "Low Confidence", value: "30-50%" },
      { color: "#FF9900", label: "Medium Confidence", value: "50-80%" },
      { color: "#FF0000", label: "High Confidence", value: "80-100%" },
    ],
  },
  "🦎 Biodiversity Hotspots": {
    title: "Biodiversity Hotspots",
    unit: "Classification",
    description: "Global biodiversity conservation priorities",
    items: [
      { color: "#FF0000", label: "Biodiversity Hotspot", value: "Critical" },
      { color: "#FF9900", label: "High Priority Area", value: "Important" },
      { color: "#FFFF00", label: "Conservation Area", value: "Moderate" },
    ],
  },
  "Countries (vector)": {
    title: "Country Boundaries",
    unit: "Administrative",
    description: "National boundaries",
    items: [
      { color: "#3388ff", label: "Country Border", value: "International" },
    ],
  },
  "Regenera Landscapes (vector)": {
    title: "Regenera Landscapes",
    unit: "Project Areas",
    description: "Regenerative agriculture project sites",
    items: [
      { color: "#34D399", label: "Active Landscape", value: "Project Area" },
      { color: "#059669", label: "Landscape Boundary", value: "Border" },
    ],
  },
  "Regenera Guardians (vector)": {
    title: "Regenera Guardians",
    unit: "Guardian Areas",
    description: "Community guardian territories",
    items: [
      { color: "#8B5CF6", label: "Guardian Territory", value: "Protected" },
    ],
  },
};

const LegendPanel: React.FC<{
  config: LegendConfig;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}> = ({ config, onClose, isCollapsed, onToggleCollapse }) => {
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #ccc",
        borderRadius: "6px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        minWidth: "200px",
        maxWidth: "280px",
        fontSize: "12px",
        marginBottom: "8px",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "8px 12px",
          borderBottom: isCollapsed ? "none" : "1px solid #eee",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#f8f9fa",
          borderRadius: "6px 6px 0 0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
          <button
            onClick={onToggleCollapse}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "2px",
              marginRight: "6px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
          <span style={{ fontWeight: "bold", fontSize: "11px" }}>
            {config.title}
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "2px",
            color: "#666",
          }}
        >
          <X size={12} />
        </button>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div style={{ padding: "8px 12px" }}>
          {config.description && (
            <div
              style={{
                fontSize: "10px",
                color: "#666",
                marginBottom: "6px",
                fontStyle: "italic",
              }}
            >
              {config.description}
            </div>
          )}
          {config.unit && (
            <div
              style={{ fontSize: "10px", color: "#888", marginBottom: "8px" }}
            >
              Unit: {config.unit}
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {config.items.map((item, index) => (
              <div
                key={index}
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "12px",
                    backgroundColor: item.color,
                    border: "1px solid #ccc",
                    borderRadius: "2px",
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: "10px", flex: 1 }}>{item.label}</span>
                {item.value && (
                  <span style={{ fontSize: "9px", color: "#666" }}>
                    {item.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const LayerLegends: React.FC<LayerLegendsProps> = ({ activeLayers }) => {
  const [collapsedLegends, setCollapsedLegends] = useState<Set<string>>(
    new Set()
  );
  const [closedLegends, setClosedLegends] = useState<Set<string>>(new Set());

  const activeLayersList = Array.from(activeLayers).filter(
    (layer) => LEGEND_CONFIGS[layer] && !closedLegends.has(layer)
  );

  const handleToggleCollapse = (layerName: string) => {
    setCollapsedLegends((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(layerName)) {
        newSet.delete(layerName);
      } else {
        newSet.add(layerName);
      }
      return newSet;
    });
  };

  const handleCloseLegend = (layerName: string) => {
    setClosedLegends((prev) => {
      const newSet = new Set(prev);
      newSet.add(layerName);
      return newSet;
    });
  };

  if (activeLayersList.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        bottom: "20px",
        left: "20px",
        zIndex: 1000,
        maxHeight: "60vh",
        overflowY: "auto",
        pointerEvents: "auto",
      }}
    >
      {activeLayersList.map((layerName) => (
        <LegendPanel
          key={layerName}
          config={LEGEND_CONFIGS[layerName]}
          onClose={() => handleCloseLegend(layerName)}
          isCollapsed={collapsedLegends.has(layerName)}
          onToggleCollapse={() => handleToggleCollapse(layerName)}
        />
      ))}
    </div>
  );
};
