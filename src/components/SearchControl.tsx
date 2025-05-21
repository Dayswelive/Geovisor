"use client";

import type React from "react";
import { useState } from "react";
import { useMap } from "react-leaflet";
import { Search } from "lucide-react";

interface SearchControlProps {
  onSearchResult: (result: [number, number]) => void;
}

export const SearchControl: React.FC<SearchControlProps> = ({
  onSearchResult,
}) => {
  const map = useMap();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock geocoding function - in a real app, you'd use a geocoding service
  const geocodeLocation = (query: string): Promise<[number, number]> => {
    return new Promise((resolve) => {
      // More comprehensive location database with real coordinates
      const mockLocations: Record<string, [number, number]> = {
        // Countries
        peru: [-9.19, -75.0152],
        india: [20.5937, 78.9629],
        brazil: [-14.235, -51.9253],
        usa: [37.0902, -95.7129],
        "united states": [37.0902, -95.7129],
        mexico: [23.6345, -102.5528],
        canada: [56.1304, -106.3468],
        china: [35.8617, 104.1954],
        russia: [61.524, 105.3188],
        australia: [-25.2744, 133.7751],

        // Cities
        lima: [-12.0464, -77.0428],
        "new delhi": [28.6139, 77.209],
        "new york": [40.7128, -74.006],
        london: [51.5074, -0.1278],
        tokyo: [35.6762, 139.6503],
        paris: [48.8566, 2.3522],
        berlin: [52.52, 13.405],
        madrid: [40.4168, -3.7038],
        rome: [41.9028, 12.4964],

        // Regenera Landscapes
        raquena: [-5.5258, -73.7592],
        pacurtambo: [-13.6392, -72.8814],
        "machu picchu": [-13.1631, -72.545],
        cañete: [-13.0778, -76.3864],
        canete: [-13.0778, -76.3864],
        "cañete landscape": [-13.0778, -76.3864],
        "canete landscape": [-13.0778, -76.3864],
        abancay: [-13.6339, -72.8894],
        "abancay landscape": [-13.6339, -72.8894],
        manu: [-12.25, -71.0],
        "manu landscape": [-12.25, -71.0],

        // Amazon regions
        amazon: [-3.4653, -62.2159],
        "amazon rainforest": [-3.4653, -62.2159],
        amazonia: [-3.4653, -62.2159],
      };

      const normalizedQuery = query.toLowerCase().trim();

      // Try to find an exact match first
      let location = mockLocations[normalizedQuery];

      // If no exact match, try to find a partial match
      if (!location) {
        const matchingKey = Object.keys(mockLocations).find(
          (key) =>
            key.includes(normalizedQuery) || normalizedQuery.includes(key)
        );

        if (matchingKey) {
          location = mockLocations[matchingKey];
        } else {
          location = [-9.19, -75.0152]; // Default to Peru if not found
        }
      }

      setTimeout(() => {
        resolve(location);
      }, 300); // Reduced delay for better UX
    });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) return;

    try {
      const result = await geocodeLocation(searchTerm);
      map.flyTo(result, 10);
      onSearchResult(result);
    } catch (error) {
      console.error("Error searching location:", error);
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "60px",
        zIndex: 1000,
        width: "320px",
      }}
    >
      <form
        onSubmit={handleSearch}
        style={{
          display: "flex",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a location (e.g., Peru, Machu Picchu)"
          style={{
            flex: 1,
            padding: "12px 16px",
            border: "none",
            fontSize: "14px",
            outline: "none",
          }}
        />
        <button
          type="submit"
          style={{
            background: "linear-gradient(135deg, #34D399 0%, #059669 100%)",
            border: "none",
            color: "white",
            padding: "0 20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.3s ease",
          }}
        >
          <Search size={18} />
        </button>
      </form>
    </div>
  );
};
