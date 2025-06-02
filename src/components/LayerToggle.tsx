// "use client";

// import type React from "react";
// import type { LayerKey } from "../utils/tileLayers";
// import { Layers, Map } from "lucide-react";

// interface LayerToggleProps {
//   selectedLayer: LayerKey;
//   onChange: (layer: LayerKey) => void;
// }

// const layers: LayerKey[] = [
//   "OpenStreetMap",
//   "Satellite",
//   "Topographic",
//   "DarkMode",
//   "Terrain",
// ];

// const LayerToggle: React.FC<LayerToggleProps> = ({
//   selectedLayer,
//   onChange,
// }) => {
//   return (
//     <div
//       style={{
//         position: "absolute",
//         top: "60px",
//         right: "10px",
//         zIndex: 999,
//         backgroundColor: "white",
//         padding: "12px",
//         borderRadius: "8px",
//         boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//         border: "1px solid rgba(0,0,0,0.1)",
//         width: "220px",
//       }}
//     >
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           marginBottom: "10px",
//           borderBottom: "1px solid #e5e7eb",
//           paddingBottom: "8px",
//         }}
//       >
//         <Map size={18} style={{ marginRight: "8px", color: "#059669" }} />
//         <strong style={{ fontSize: "14px", color: "#1f2937" }}>
//           Base Map Selection
//         </strong>
//       </div>

//       <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
//         {layers.map((layer) => (
//           <label
//             key={layer}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               padding: "6px 8px",
//               borderRadius: "4px",
//               cursor: "pointer",
//               backgroundColor:
//                 selectedLayer === layer ? "#f0fdf4" : "transparent",
//               border:
//                 selectedLayer === layer
//                   ? "1px solid #d1fae5"
//                   : "1px solid transparent",
//               transition: "all 0.2s ease",
//             }}
//           >
//             <input
//               type="radio"
//               value={layer}
//               checked={selectedLayer === layer}
//               onChange={() => onChange(layer)}
//               style={{ marginRight: "8px" }}
//             />
//             <span
//               style={{
//                 fontSize: "14px",
//                 color: selectedLayer === layer ? "#059669" : "#4b5563",
//                 fontWeight: selectedLayer === layer ? "500" : "normal",
//               }}
//             >
//               {layer}
//             </span>
//           </label>
//         ))}
//       </div>

//       <div
//         style={{
//           marginTop: "12px",
//           fontSize: "12px",
//           color: "#6b7280",
//           padding: "8px",
//           backgroundColor: "#f9fafb",
//           borderRadius: "4px",
//         }}
//       >
//         <Layers
//           size={14}
//           style={{
//             display: "inline",
//             marginRight: "4px",
//             verticalAlign: "middle",
//           }}
//         />
//         Use the layers control in the top-right corner to toggle additional data
//         layers.
//       </div>
//     </div>
//   );
// };

// export default LayerToggle;

"use client";

import type React from "react";
import type { LayerKey } from "../utils/tileLayers";
import {
  Layers,
  Map,
  Satellite,
  Mountain,
  Moon,
  TreesIcon as Terrain,
} from "lucide-react";

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

const getLayerIcon = (layer: LayerKey) => {
  switch (layer) {
    case "OpenStreetMap":
      return <Map size={16} />;
    case "Satellite":
      return <Satellite size={16} />;
    case "Topographic":
      return <Mountain size={16} />;
    case "DarkMode":
      return <Moon size={16} />;
    case "Terrain":
      return <Terrain size={16} />;
    default:
      return <Map size={16} />;
  }
};

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
        backgroundColor: "rgba(255, 255, 255, 0.98)",
        backdropFilter: "blur(10px)",
        padding: "16px",
        borderRadius: "12px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
        border: "1px solid rgba(255,255,255,0.2)",
        width: "260px",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "14px",
          borderBottom: "2px solid #f1f5f9",
          paddingBottom: "12px",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #059669, #10b981)",
            borderRadius: "8px",
            padding: "6px",
            marginRight: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Layers size={18} style={{ color: "white" }} />
        </div>
        <div>
          <strong
            style={{ fontSize: "15px", color: "#1e293b", fontWeight: "600" }}
          >
            Base Map Layers
          </strong>
          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
            Choose your map style
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {layers.map((layer) => (
          <label
            key={layer}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 12px",
              borderRadius: "8px",
              cursor: "pointer",
              backgroundColor:
                selectedLayer === layer
                  ? "rgba(16, 185, 129, 0.1)"
                  : "transparent",
              border:
                selectedLayer === layer
                  ? "2px solid #10b981"
                  : "2px solid transparent",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              if (selectedLayer !== layer) {
                e.currentTarget.style.backgroundColor =
                  "rgba(248, 250, 252, 0.8)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              if (selectedLayer !== layer) {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.transform = "translateY(0)";
              }
            }}
          >
            <input
              type="radio"
              value={layer}
              checked={selectedLayer === layer}
              onChange={() => onChange(layer)}
              style={{
                width: "18px",
                height: "18px",
                marginRight: "12px",
                accentColor: "#10b981",
                cursor: "pointer",
              }}
            />
            <div
              style={{
                color: selectedLayer === layer ? "#10b981" : "#64748b",
                marginRight: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {getLayerIcon(layer)}
            </div>
            <span
              style={{
                fontSize: "14px",
                color: selectedLayer === layer ? "#10b981" : "#334155",
                fontWeight: selectedLayer === layer ? "600" : "500",
                flex: 1,
              }}
            >
              {layer === "OpenStreetMap" ? "Street Map" : layer}
            </span>
            {selectedLayer === layer && (
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#10b981",
                  marginLeft: "auto",
                }}
              />
            )}
          </label>
        ))}
      </div>

      <div
        style={{
          marginTop: "16px",
          fontSize: "12px",
          color: "#64748b",
          padding: "12px",
          backgroundColor: "rgba(241, 245, 249, 0.6)",
          borderRadius: "8px",
          border: "1px solid rgba(226, 232, 240, 0.8)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Layers
          size={14}
          style={{
            marginRight: "6px",
            color: "#94a3b8",
          }}
        />
        <span>
          Use the layers panel to toggle data overlays and analysis tools
        </span>
      </div>
    </div>
  );
};

export default LayerToggle;
