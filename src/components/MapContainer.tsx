// "use client";

// import type React from "react";
// import { useState } from "react";
// import BaseMap from "./BaseMap";
// import LayerToggle from "./LayerToggle";
// import Dashboard from "./Dashboard";
// import type { LayerKey } from "../utils/tileLayers";
// // import NDVILegend from "./NDVILegend";

// const MapWrapper: React.FC = () => {
//   const [selectedBaseLayer, setSelectedLayer] =
//     useState<LayerKey>("OpenStreetMap");
//   const [selectedArea, setSelectedArea] = useState<any>(null);
//   const [areaInKm, setAreaInKm] = useState<number>(0);
//   const [isDashboardOpen, setIsDashboardOpen] = useState<boolean>(false);
//   const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
//   const [currentStep, setCurrentStep] = useState<number>(1);

//   // Handle area selection
//   const handleAreaSelect = (area: any) => {
//     setSelectedArea(area);
//     setIsDashboardOpen(true);
//     setCurrentStep(1);
//   };

//   // Handle area calculation
//   const handleAreaCalculated = (area: number) => {
//     setAreaInKm(area);
//   };

//   // Handle dashboard close
//   const handleDashboardClose = () => {
//     setIsDashboardOpen(false);
//     // Reset dashboard state
//     setCurrentStep(1);
//     setSelectedTopic(null);
//   };

//   // Handle topic selection
//   const handleTopicSelect = (topic: string) => {
//     setSelectedTopic(topic);
//   };

//   // Handle next step
//   const handleNextStep = () => {
//     setCurrentStep((prev) => Math.min(prev + 1, 3));
//   };

//   // Handle previous step
//   const handlePrevStep = () => {
//     setCurrentStep((prev) => Math.max(prev - 1, 1));
//   };

//   return (
//     <>
//       <LayerToggle
//         selectedLayer={selectedBaseLayer}
//         onChange={setSelectedLayer}
//       />
//       <BaseMap
//         selectedBaseLayer={selectedBaseLayer}
//         onAreaSelect={handleAreaSelect}
//         onAreaCalculated={handleAreaCalculated}
//       />
//       {/* <NDVILegend /> */}
//       <Dashboard
//         isOpen={isDashboardOpen}
//         onClose={handleDashboardClose}
//         selectedArea={selectedArea}
//         areaInKm={areaInKm}
//         selectedTopic={selectedTopic}
//         onTopicSelect={handleTopicSelect}
//         currentStep={currentStep}
//         onNextStep={handleNextStep}
//         onPrevStep={handlePrevStep}
//       />
//     </>
//   );
// };

// export default MapWrapper;

"use client";

import type React from "react";
import { useState, useCallback } from "react";
import BaseMap from "./BaseMap";
import LayerToggle from "./LayerToggle";
import Dashboard from "./Dashboard";
import type { LayerKey } from "../utils/tileLayers";

const MapWrapper: React.FC = () => {
  const [selectedBaseLayer, setSelectedLayer] =
    useState<LayerKey>("OpenStreetMap");
  const [selectedArea, setSelectedArea] = useState<any>(null);
  const [areaInKm, setAreaInKm] = useState<number>(0);
  const [isDashboardOpen, setIsDashboardOpen] = useState<boolean>(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Handle area selection
  const handleAreaSelect = useCallback((area: any) => {
    setSelectedArea(area);
    setIsDashboardOpen(true);
    setCurrentStep(1);
  }, []);

  // Handle area calculation
  const handleAreaCalculated = useCallback((area: number) => {
    setAreaInKm(area);
  }, []);

  // Handle dashboard close
  const handleDashboardClose = useCallback(() => {
    setIsDashboardOpen(false);
    // Reset dashboard state
    setCurrentStep(1);
    setSelectedTopic(null);
  }, []);

  // Handle topic selection
  const handleTopicSelect = useCallback((topic: string) => {
    setSelectedTopic(topic);
  }, []);

  // Handle next step
  const handleNextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  }, []);

  // Handle previous step
  const handlePrevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  return (
    <div style={{ position: "relative", height: "100vh", width: "100%" }}>
      <LayerToggle
        selectedLayer={selectedBaseLayer}
        onChange={setSelectedLayer}
      />
      <BaseMap
        selectedBaseLayer={selectedBaseLayer}
        onAreaSelect={handleAreaSelect}
        onAreaCalculated={handleAreaCalculated}
      />
      <Dashboard
        isOpen={isDashboardOpen}
        onClose={handleDashboardClose}
        selectedArea={selectedArea}
        areaInKm={areaInKm}
        selectedTopic={selectedTopic}
        onTopicSelect={handleTopicSelect}
        currentStep={currentStep}
        onNextStep={handleNextStep}
        onPrevStep={handlePrevStep}
      />
    </div>
  );
};

export default MapWrapper;
