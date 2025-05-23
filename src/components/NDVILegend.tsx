import React from "react";

const NDVILegend: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "20px",
        right: "10px",
        zIndex: 999,
        backgroundColor: "white",
        padding: "12px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        border: "1px solid rgba(0,0,0,0.1)",
        width: "200px",
      }}
    >
      <strong style={{ fontSize: "14px", marginBottom: "6px" }}>
        NDVI Legend
      </strong>
      <div style={{ display: "flex", marginTop: "8px" }}>
        <div style={{ flex: 1, background: "red", height: "10px" }} />
        <div style={{ flex: 1, background: "orange", height: "10px" }} />
        <div style={{ flex: 1, background: "yellow", height: "10px" }} />
        <div style={{ flex: 1, background: "lightgreen", height: "10px" }} />
        <div style={{ flex: 1, background: "green", height: "10px" }} />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "10px",
          color: "#4B5563",
          marginTop: "6px",
        }}
      >
        <span>-1</span>
        <span>0</span>
        <span>1</span>
      </div>
    </div>
  );
};

export default NDVILegend;
