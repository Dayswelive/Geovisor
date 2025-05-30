"use client";

import type React from "react";
import { useState, useMemo } from "react";
import Modal from "react-modal";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Users,
  Leaf,
  MapPin,
  Phone,
  Mail,
  Globe,
  TrendingUp,
  TrendingDown,
  Droplets,
  TreePine,
  Wind,
  Zap,
  Fish,
  Mountain,
  BarChart3,
} from "lucide-react";
import guardiansData from "../data/guardians-data.json";

// Set the app element for accessibility
if (typeof window !== "undefined") {
  Modal.setAppElement(document.body);
}

interface DashboardProps {
  isOpen: boolean;
  onClose: () => void;
  selectedArea: any;
  areaInKm: number;
  selectedTopic: string | null;
  onTopicSelect: (topic: string) => void;
  currentStep: number;
  onNextStep: () => void;
  onPrevStep: () => void;
}

interface Guardian {
  id: string;
  name: string;
  role: string;
  primaryContact: string;
  email: string;
  country: string;
  region: string;
  yearsOfService: number;
  specialization: string;
  avatar: string;
  status: string;
}

// Custom component interfaces with proper TypeScript support
interface BaseComponentProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

interface ButtonProps extends BaseComponentProps {
  disabled?: boolean;
  variant?: "default" | "outline" | "ghost" | "orange";
  size?: "default" | "icon";
}

interface BadgeProps extends BaseComponentProps {
  variant?: "default" | "secondary";
}

interface ProgressProps {
  value: number;
  className?: string;
  style?: React.CSSProperties;
}

// Custom components with proper TypeScript interfaces
const Card: React.FC<BaseComponentProps> = ({
  children,
  className = "",
  style,
  onClick,
}) => (
  <div
    className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}
    style={{ cursor: onClick ? "pointer" : "default", ...style }}
    onClick={onClick}
  >
    {children}
  </div>
);

const CardHeader: React.FC<BaseComponentProps> = ({
  children,
  className = "",
  style,
}) => (
  <div className={`p-6 pb-4 ${className}`} style={style}>
    {children}
  </div>
);

const CardContent: React.FC<BaseComponentProps> = ({
  children,
  className = "",
  style,
}) => (
  <div className={`p-6 pt-0 ${className}`} style={style}>
    {children}
  </div>
);

const CardTitle: React.FC<BaseComponentProps> = ({
  children,
  className = "",
  style,
}) => (
  <h3 className={`text-lg font-semibold ${className}`} style={style}>
    {children}
  </h3>
);

const CardDescription: React.FC<BaseComponentProps> = ({
  children,
  className = "",
  style,
}) => (
  <p className={`text-sm text-gray-600 ${className}`} style={style}>
    {children}
  </p>
);

const Badge: React.FC<BadgeProps> = ({
  children,
  className = "",
  style,
  variant = "default",
}) => {
  const baseClasses =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  const variantClasses =
    variant === "secondary"
      ? "bg-gray-100 text-gray-800"
      : "bg-emerald-500 text-white";

  return (
    <span
      className={`${baseClasses} ${variantClasses} ${className}`}
      style={style}
    >
      {children}
    </span>
  );
};
const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = "",
  style,
  variant = "orange",
  size = "default",
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300 focus-visible:ring-opacity-50 disabled:opacity-50 disabled:pointer-events-none shadow-lg transform hover:scale-105 active:scale-95";

  const variantClasses = {
    orange:
      "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 hover:shadow-xl border-0 shadow-orange-200",
    default:
      "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl shadow-emerald-200",
    outline:
      "border-2 border-orange-400 text-orange-600 hover:bg-orange-50 hover:border-orange-500 hover:text-orange-700 bg-white shadow-sm",
    ghost:
      "hover:bg-orange-50 text-orange-600 hover:text-orange-700 shadow-none",
  };

  const sizeClasses = {
    default: "h-12 py-3 px-6 text-base",
    icon: "h-12 w-12",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      style={style}
    >
      {children}
    </button>
  );
};
const ButtonWithCSS: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = "",
  style,
  variant = "orange",
  size = "default",
}) => {
  const buttonId = `classy-btn-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <>
      <style>{`
        .${buttonId} {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 12px !important;
          font-weight: 600 !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          outline: none !important;
          border: none !important;
          cursor: pointer !important;
          height: 48px !important;
          padding: 12px 24px !important;
          font-size: 16px !important;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%) !important;
          color: white !important;
          box-shadow: 0 10px 15px -3px rgba(249, 115, 22, 0.2), 0 4px 6px -2px rgba(249, 115, 22, 0.1) !important;
          transform: scale(1) !important;
        }
        
        .${buttonId}:hover:not(:disabled) {
          background: linear-gradient(135deg, #ea580c 0%, #dc2626 100%) !important;
          transform: scale(1.05) !important;
          box-shadow: 0 20px 25px -5px rgba(249, 115, 22, 0.3), 0 10px 10px -5px rgba(249, 115, 22, 0.2) !important;
        }
        
        .${buttonId}:active:not(:disabled) {
          transform: scale(0.98) !important;
        }
        
        .${buttonId}:disabled {
          opacity: 0.5 !important;
          cursor: not-allowed !important;
          transform: scale(1) !important;
        }
        
        .${buttonId}:focus {
          outline: 4px solid rgba(249, 115, 22, 0.3) !important;
          outline-offset: 2px !important;
        }
      `}</style>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${buttonId} ${className}`}
        style={style}
      >
        {children}
      </button>
    </>
  );
};
const Progress: React.FC<ProgressProps> = ({
  value,
  className = "",
  style,
}) => (
  <div
    className={`w-full bg-gray-200 rounded-full h-2 ${className}`}
    style={style}
  >
    <div
      className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({
  isOpen,
  onClose,
  selectedArea,
  areaInKm,
  selectedTopic,
  onTopicSelect,
  currentStep,
  onNextStep,
  onPrevStep,
}) => {
  const [selectedDataType, setSelectedDataType] = useState<string | null>(null);

  // Generate mock nature capital data
  const natureCapitalData = useMemo(
    () => ({
      biodiversity: {
        value: Math.floor(Math.random() * 40) + 60,
        trend: Math.random() > 0.5 ? "up" : "down",
        change: (Math.random() * 10).toFixed(1),
        unit: "Index Score",
      },
      water: {
        value: Math.floor(Math.random() * 30) + 70,
        trend: Math.random() > 0.5 ? "up" : "down",
        change: (Math.random() * 5).toFixed(1),
        unit: "Quality Index",
      },
      carbon: {
        value: Math.floor(Math.random() * 500) + 200,
        trend: "up" as const,
        change: (Math.random() * 15).toFixed(1),
        unit: "tons CO₂/year",
      },
      soilHealth: {
        value: Math.floor(Math.random() * 25) + 65,
        trend: Math.random() > 0.5 ? "up" : "down",
        change: (Math.random() * 8).toFixed(1),
        unit: "Health Score",
      },
      airQuality: {
        value: Math.floor(Math.random() * 20) + 75,
        trend: "up" as const,
        change: (Math.random() * 6).toFixed(1),
        unit: "AQI Score",
      },
      ecosystem: {
        value: Math.floor(Math.random() * 35) + 55,
        trend: Math.random() > 0.5 ? "up" : "down",
        change: (Math.random() * 12).toFixed(1),
        unit: "Service Index",
      },
    }),
    []
  );

  // Get guardians for selected area
  const getGuardiansForArea = (): Guardian[] => {
    const areaName = selectedArea?.properties?.name?.toLowerCase() || "default";
    const landscapeKey =
      Object.keys(guardiansData.landscapes).find(
        (key) => areaName.includes(key.replace("_", " ")) || key === "default"
      ) || "default";

    return (
      guardiansData.landscapes[
        landscapeKey as keyof typeof guardiansData.landscapes
      ] || guardiansData.landscapes.default
    );
  };

  const handleDataTypeSelect = (type: string) => {
    setSelectedDataType(type);
    onTopicSelect(type);
    onNextStep();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            <div style={{ textAlign: "center" }}>
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#065f46",
                  marginBottom: "8px",
                }}
              >
                Confirm Study Area
              </h3>
              <p style={{ color: "#059669" }}>
                Review the selected landscape area before proceeding
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "24px",
              }}
            >
              <Card className="border-emerald-200">
                <CardHeader style={{ backgroundColor: "#ecfdf5" }}>
                  <CardTitle
                    style={{
                      color: "#065f46",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <MapPin size={20} />
                    Area Information
                  </CardTitle>
                </CardHeader>
                <CardContent style={{ paddingTop: "24px" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#059669",
                          marginBottom: "4px",
                        }}
                      >
                        Selected Area
                      </p>
                      <p
                        style={{
                          fontSize: "24px",
                          fontWeight: "bold",
                          color: "#065f46",
                        }}
                      >
                        {areaInKm.toFixed(2)} km²
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#059669",
                          marginBottom: "4px",
                        }}
                      >
                        Location
                      </p>
                      <p style={{ fontWeight: "500", color: "#047857" }}>
                        {selectedArea?.properties?.name ||
                          "Custom Selected Area"}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#059669",
                          marginBottom: "4px",
                        }}
                      >
                        Coordinates
                      </p>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#047857",
                          fontFamily: "monospace",
                        }}
                      >
                        {selectedArea?.geometry?.coordinates
                          ? `${
                              selectedArea.geometry.coordinates[0]?.[0]?.[1]?.toFixed(
                                4
                              ) || "N/A"
                            }, ${
                              selectedArea.geometry.coordinates[0]?.[0]?.[0]?.toFixed(
                                4
                              ) || "N/A"
                            }`
                          : "Coordinates not available"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-200">
                <CardHeader style={{ backgroundColor: "#ecfdf5" }}>
                  <CardTitle style={{ color: "#065f46" }}>
                    Area Visualization
                  </CardTitle>
                </CardHeader>
                <CardContent style={{ paddingTop: "24px" }}>
                  <div
                    style={{
                      height: "192px",
                      background:
                        "linear-gradient(to bottom right, #ecfdf5, #d1fae5)",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px dashed #a7f3d0",
                    }}
                  >
                    {selectedArea ? (
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            width: "64px",
                            height: "64px",
                            backgroundColor: "#10b981",
                            borderRadius: "50%",
                            margin: "0 auto 12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <MapPin size={32} color="white" />
                        </div>
                        <p style={{ color: "#047857", fontWeight: "500" }}>
                          Area Selected
                        </p>
                        <p style={{ fontSize: "14px", color: "#059669" }}>
                          {selectedArea.geometry?.type || "Polygon"} shape
                        </p>
                      </div>
                    ) : (
                      <div style={{ textAlign: "center", color: "#059669" }}>
                        <MapPin
                          size={48}
                          style={{ margin: "0 auto 8px", opacity: 0.5 }}
                        />
                        <p>No area selected</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <ButtonWithCSS
                onClick={onNextStep}
                disabled={!selectedArea}
                className="px-8 py-2"
                variant="orange"
              >
                Confirm Area{" "}
                <ChevronRight size={16} style={{ marginLeft: "8px" }} />
              </ButtonWithCSS>
            </div>
          </div>
        );

      case 2:
        return (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            <div style={{ textAlign: "center" }}>
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#065f46",
                  marginBottom: "8px",
                }}
              >
                Select Data Category
              </h3>
              <p style={{ color: "#059669" }}>
                Choose the type of information you want to explore
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "32px",
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              <Card
                className={`transition-all duration-300 border-2 hover:shadow-lg ${
                  selectedDataType === "management"
                    ? "border-emerald-500 bg-emerald-50 shadow-lg"
                    : "border-emerald-200 hover:border-emerald-400"
                }`}
                onClick={() => setSelectedDataType("management")}
              >
                <CardContent style={{ padding: "32px", textAlign: "center" }}>
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      backgroundColor: "#10b981",
                      borderRadius: "50%",
                      margin: "0 auto 24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Users size={40} color="white" />
                  </div>
                  <h4
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#065f46",
                      marginBottom: "12px",
                    }}
                  >
                    Management Data
                  </h4>
                  <p style={{ color: "#059669", marginBottom: "24px" }}>
                    View information about guardians and stewards protecting
                    this landscape
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      fontSize: "14px",
                      color: "#047857",
                    }}
                  >
                    <p>• Guardian profiles & contacts</p>
                    <p>• Management activities</p>
                    <p>• Conservation efforts</p>
                    <p>• Community involvement</p>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`transition-all duration-300 border-2 hover:shadow-lg ${
                  selectedDataType === "nature"
                    ? "border-emerald-500 bg-emerald-50 shadow-lg"
                    : "border-emerald-200 hover:border-emerald-400"
                }`}
                onClick={() => setSelectedDataType("nature")}
              >
                <CardContent style={{ padding: "32px", textAlign: "center" }}>
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      backgroundColor: "#10b981",
                      borderRadius: "50%",
                      margin: "0 auto 24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Leaf size={40} color="white" />
                  </div>
                  <h4
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#065f46",
                      marginBottom: "12px",
                    }}
                  >
                    Nature Capital & Ecosystem Data
                  </h4>
                  <p style={{ color: "#059669", marginBottom: "24px" }}>
                    Explore biodiversity, carbon, water, and ecosystem service
                    metrics
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      fontSize: "14px",
                      color: "#047857",
                    }}
                  >
                    <p>• Biodiversity indices</p>
                    <p>• Carbon sequestration</p>
                    <p>• Water quality metrics</p>
                    <p>• Ecosystem services</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <ButtonWithCSS variant="outline" onClick={onPrevStep}>
                <ChevronLeft size={16} style={{ marginRight: "8px" }} /> Back
              </ButtonWithCSS>
              <ButtonWithCSS
                onClick={() => handleDataTypeSelect(selectedDataType!)}
                disabled={!selectedDataType}
                className="px-8"
              >
                View Data{" "}
                <ChevronRight size={16} style={{ marginLeft: "8px" }} />
              </ButtonWithCSS>
            </div>
          </div>
        );

      case 3:
        if (selectedTopic === "management") {
          const guardians = getGuardiansForArea();

          return (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              <div style={{ textAlign: "center" }}>
                <h3
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#065f46",
                    marginBottom: "8px",
                  }}
                >
                  Landscape Guardians
                </h3>
                <p style={{ color: "#059669" }}>
                  Meet the dedicated stewards protecting this landscape
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                {guardians.map((guardian) => (
                  <Card
                    key={guardian.id}
                    className="border-emerald-200 hover:shadow-md transition-shadow"
                  >
                    <CardContent style={{ padding: "24px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "24px",
                        }}
                      >
                        <div style={{ flexShrink: 0 }}>
                          <img
                            src={
                              guardian.avatar ||
                              "/placeholder.svg?height=64&width=64"
                            }
                            alt={guardian.name}
                            style={{
                              width: "64px",
                              height: "64px",
                              borderRadius: "50%",
                              border: "2px solid #a7f3d0",
                            }}
                          />
                        </div>

                        <div
                          style={{
                            flex: 1,
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(250px, 1fr))",
                            gap: "24px",
                          }}
                        >
                          <div>
                            <h4
                              style={{
                                fontSize: "18px",
                                fontWeight: "bold",
                                color: "#065f46",
                                marginBottom: "4px",
                              }}
                            >
                              {guardian.name}
                            </h4>
                            <p
                              style={{
                                color: "#059669",
                                fontWeight: "500",
                                marginBottom: "12px",
                              }}
                            >
                              {guardian.role}
                            </p>

                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  fontSize: "14px",
                                }}
                              >
                                <Phone size={16} color="#10b981" />
                                <span style={{ color: "#047857" }}>
                                  {guardian.primaryContact}
                                </span>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  fontSize: "14px",
                                }}
                              >
                                <Mail size={16} color="#10b981" />
                                <span style={{ color: "#047857" }}>
                                  {guardian.email}
                                </span>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  fontSize: "14px",
                                }}
                              >
                                <Globe size={16} color="#10b981" />
                                <span style={{ color: "#047857" }}>
                                  {guardian.country}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "12px",
                              }}
                            >
                              <div>
                                <p
                                  style={{
                                    fontSize: "14px",
                                    color: "#059669",
                                    marginBottom: "4px",
                                  }}
                                >
                                  Region
                                </p>
                                <p
                                  style={{
                                    fontWeight: "500",
                                    color: "#065f46",
                                  }}
                                >
                                  {guardian.region}
                                </p>
                              </div>
                              <div>
                                <p
                                  style={{
                                    fontSize: "14px",
                                    color: "#059669",
                                    marginBottom: "4px",
                                  }}
                                >
                                  Specialization
                                </p>
                                <Badge
                                  variant="secondary"
                                  className="bg-emerald-100 text-emerald-800"
                                >
                                  {guardian.specialization}
                                </Badge>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "16px",
                                }}
                              >
                                <div>
                                  <p
                                    style={{
                                      fontSize: "14px",
                                      color: "#059669",
                                    }}
                                  >
                                    Experience
                                  </p>
                                  <p
                                    style={{
                                      fontWeight: "bold",
                                      color: "#065f46",
                                    }}
                                  >
                                    {guardian.yearsOfService} years
                                  </p>
                                </div>
                                <div>
                                  <p
                                    style={{
                                      fontSize: "14px",
                                      color: "#059669",
                                    }}
                                  >
                                    Status
                                  </p>
                                  <Badge className="bg-emerald-500 text-white">
                                    {guardian.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <ButtonWithCSS variant="outline" onClick={onPrevStep}>
                  <ChevronLeft size={16} style={{ marginRight: "8px" }} /> Back
                  to Categories
                </ButtonWithCSS>
                <ButtonWithCSS>Contact Guardians</ButtonWithCSS>
              </div>
            </div>
          );
        } else {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                maxHeight: "60vh",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  position: "sticky",
                  top: 0,
                  backgroundColor: "white",
                  zIndex: 10,
                  paddingBottom: "16px",
                }}
              >
                <h3
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#065f46",
                    marginBottom: "8px",
                  }}
                >
                  Nature Capital & Ecosystem Data
                </h3>
                <p style={{ color: "#059669" }}>
                  Comprehensive environmental metrics for this landscape
                </p>
              </div>

              {/* Area Overview */}
              <Card
                className="border-emerald-200"
                style={{
                  background: "linear-gradient(to right, #ecfdf5, #f0fdf4)",
                }}
              >
                <CardHeader>
                  <CardTitle
                    style={{
                      color: "#065f46",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <MapPin size={20} />
                    Area Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(120px, 1fr))",
                      gap: "16px",
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <p
                        style={{
                          fontSize: "24px",
                          fontWeight: "bold",
                          color: "#065f46",
                        }}
                      >
                        {areaInKm.toFixed(2)} km²
                      </p>
                      <p style={{ fontSize: "14px", color: "#059669" }}>
                        Total Area
                      </p>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <p
                        style={{
                          fontSize: "24px",
                          fontWeight: "bold",
                          color: "#065f46",
                        }}
                      >
                        {(areaInKm * 100).toFixed(0)} ha
                      </p>
                      <p style={{ fontSize: "14px", color: "#059669" }}>
                        Hectares
                      </p>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <p
                        style={{
                          fontSize: "24px",
                          fontWeight: "bold",
                          color: "#065f46",
                        }}
                      >
                        {selectedArea?.geometry?.type || "Polygon"}
                      </p>
                      <p style={{ fontSize: "14px", color: "#059669" }}>
                        Shape Type
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Metrics Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "24px",
                }}
              >
                <Card className="border-emerald-200">
                  <CardHeader style={{ paddingBottom: "12px" }}>
                    <CardTitle
                      style={{
                        color: "#065f46",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "18px",
                      }}
                    >
                      <TreePine size={20} color="#059669" />
                      Biodiversity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "24px",
                            fontWeight: "bold",
                            color: "#065f46",
                          }}
                        >
                          {natureCapitalData.biodiversity.value}
                        </span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          {natureCapitalData.biodiversity.trend === "up" ? (
                            <TrendingUp size={16} color="#10b981" />
                          ) : (
                            <TrendingDown size={16} color="#ef4444" />
                          )}
                          <span
                            style={{
                              fontSize: "14px",
                              color:
                                natureCapitalData.biodiversity.trend === "up"
                                  ? "#059669"
                                  : "#dc2626",
                            }}
                          >
                            {natureCapitalData.biodiversity.change}%
                          </span>
                        </div>
                      </div>
                      <Progress value={natureCapitalData.biodiversity.value} />
                      <p style={{ fontSize: "14px", color: "#059669" }}>
                        {natureCapitalData.biodiversity.unit}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-emerald-200">
                  <CardHeader style={{ paddingBottom: "12px" }}>
                    <CardTitle
                      style={{
                        color: "#065f46",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "18px",
                      }}
                    >
                      <Droplets size={20} color="#2563eb" />
                      Water Quality
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "24px",
                            fontWeight: "bold",
                            color: "#065f46",
                          }}
                        >
                          {natureCapitalData.water.value}
                        </span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          {natureCapitalData.water.trend === "up" ? (
                            <TrendingUp size={16} color="#10b981" />
                          ) : (
                            <TrendingDown size={16} color="#ef4444" />
                          )}
                          <span
                            style={{
                              fontSize: "14px",
                              color:
                                natureCapitalData.water.trend === "up"
                                  ? "#059669"
                                  : "#dc2626",
                            }}
                          >
                            {natureCapitalData.water.change}%
                          </span>
                        </div>
                      </div>
                      <Progress value={natureCapitalData.water.value} />
                      <p style={{ fontSize: "14px", color: "#059669" }}>
                        {natureCapitalData.water.unit}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-emerald-200">
                  <CardHeader style={{ paddingBottom: "12px" }}>
                    <CardTitle
                      style={{
                        color: "#065f46",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "18px",
                      }}
                    >
                      <Wind size={20} color="#6b7280" />
                      Carbon Sequestration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "24px",
                            fontWeight: "bold",
                            color: "#065f46",
                          }}
                        >
                          {natureCapitalData.carbon.value}
                        </span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <TrendingUp size={16} color="#10b981" />
                          <span style={{ fontSize: "14px", color: "#059669" }}>
                            {natureCapitalData.carbon.change}%
                          </span>
                        </div>
                      </div>
                      <Progress value={75} />
                      <p style={{ fontSize: "14px", color: "#059669" }}>
                        {natureCapitalData.carbon.unit}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-emerald-200">
                  <CardHeader style={{ paddingBottom: "12px" }}>
                    <CardTitle
                      style={{
                        color: "#065f46",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "18px",
                      }}
                    >
                      <Mountain size={20} color="#f59e0b" />
                      Soil Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "24px",
                            fontWeight: "bold",
                            color: "#065f46",
                          }}
                        >
                          {natureCapitalData.soilHealth.value}
                        </span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          {natureCapitalData.soilHealth.trend === "up" ? (
                            <TrendingUp size={16} color="#10b981" />
                          ) : (
                            <TrendingDown size={16} color="#ef4444" />
                          )}
                          <span
                            style={{
                              fontSize: "14px",
                              color:
                                natureCapitalData.soilHealth.trend === "up"
                                  ? "#059669"
                                  : "#dc2626",
                            }}
                          >
                            {natureCapitalData.soilHealth.change}%
                          </span>
                        </div>
                      </div>
                      <Progress value={natureCapitalData.soilHealth.value} />
                      <p style={{ fontSize: "14px", color: "#059669" }}>
                        {natureCapitalData.soilHealth.unit}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-emerald-200">
                  <CardHeader style={{ paddingBottom: "12px" }}>
                    <CardTitle
                      style={{
                        color: "#065f46",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "18px",
                      }}
                    >
                      <Zap size={20} color="#8b5cf6" />
                      Air Quality
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "24px",
                            fontWeight: "bold",
                            color: "#065f46",
                          }}
                        >
                          {natureCapitalData.airQuality.value}
                        </span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <TrendingUp size={16} color="#10b981" />
                          <span style={{ fontSize: "14px", color: "#059669" }}>
                            {natureCapitalData.airQuality.change}%
                          </span>
                        </div>
                      </div>
                      <Progress value={natureCapitalData.airQuality.value} />
                      <p style={{ fontSize: "14px", color: "#059669" }}>
                        {natureCapitalData.airQuality.unit}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-emerald-200">
                  <CardHeader style={{ paddingBottom: "12px" }}>
                    <CardTitle
                      style={{
                        color: "#065f46",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "18px",
                      }}
                    >
                      <Fish size={20} color="#14b8a6" />
                      Ecosystem Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "24px",
                            fontWeight: "bold",
                            color: "#065f46",
                          }}
                        >
                          {natureCapitalData.ecosystem.value}
                        </span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          {natureCapitalData.ecosystem.trend === "up" ? (
                            <TrendingUp size={16} color="#10b981" />
                          ) : (
                            <TrendingDown size={16} color="#ef4444" />
                          )}
                          <span
                            style={{
                              fontSize: "14px",
                              color:
                                natureCapitalData.ecosystem.trend === "up"
                                  ? "#059669"
                                  : "#dc2626",
                            }}
                          >
                            {natureCapitalData.ecosystem.change}%
                          </span>
                        </div>
                      </div>
                      <Progress value={natureCapitalData.ecosystem.value} />
                      <p style={{ fontSize: "14px", color: "#059669" }}>
                        {natureCapitalData.ecosystem.unit}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Analytics */}
              <Card className="border-emerald-200">
                <CardHeader>
                  <CardTitle
                    style={{
                      color: "#065f46",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <BarChart3 size={20} />
                    Detailed Environmental Analysis
                  </CardTitle>
                  <CardDescription>
                    Comprehensive breakdown of ecosystem health indicators
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(300px, 1fr))",
                      gap: "24px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      <h4 style={{ fontWeight: "600", color: "#065f46" }}>
                        Land Cover Distribution
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: "14px",
                              marginBottom: "4px",
                            }}
                          >
                            <span style={{ color: "#047857" }}>
                              Forest Cover
                            </span>
                            <span
                              style={{ color: "#065f46", fontWeight: "500" }}
                            >
                              68%
                            </span>
                          </div>
                          <Progress value={68} />
                        </div>
                        <div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: "14px",
                              marginBottom: "4px",
                            }}
                          >
                            <span style={{ color: "#047857" }}>Grassland</span>
                            <span
                              style={{ color: "#065f46", fontWeight: "500" }}
                            >
                              22%
                            </span>
                          </div>
                          <Progress value={22} />
                        </div>
                        <div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: "14px",
                              marginBottom: "4px",
                            }}
                          >
                            <span style={{ color: "#047857" }}>
                              Water Bodies
                            </span>
                            <span
                              style={{ color: "#065f46", fontWeight: "500" }}
                            >
                              7%
                            </span>
                          </div>
                          <Progress value={7} />
                        </div>
                        <div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: "14px",
                              marginBottom: "4px",
                            }}
                          >
                            <span style={{ color: "#047857" }}>Other</span>
                            <span
                              style={{ color: "#065f46", fontWeight: "500" }}
                            >
                              3%
                            </span>
                          </div>
                          <Progress value={3} />
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      <h4 style={{ fontWeight: "600", color: "#065f46" }}>
                        Conservation Metrics
                      </h4>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(2, 1fr)",
                          gap: "16px",
                        }}
                      >
                        <div
                          style={{
                            textAlign: "center",
                            padding: "12px",
                            backgroundColor: "#ecfdf5",
                            borderRadius: "8px",
                          }}
                        >
                          <p
                            style={{
                              fontSize: "24px",
                              fontWeight: "bold",
                              color: "#065f46",
                            }}
                          >
                            94%
                          </p>
                          <p style={{ fontSize: "14px", color: "#059669" }}>
                            Protected Area
                          </p>
                        </div>
                        <div
                          style={{
                            textAlign: "center",
                            padding: "12px",
                            backgroundColor: "#ecfdf5",
                            borderRadius: "8px",
                          }}
                        >
                          <p
                            style={{
                              fontSize: "24px",
                              fontWeight: "bold",
                              color: "#065f46",
                            }}
                          >
                            156
                          </p>
                          <p style={{ fontSize: "14px", color: "#059669" }}>
                            Species Count
                          </p>
                        </div>
                        <div
                          style={{
                            textAlign: "center",
                            padding: "12px",
                            backgroundColor: "#ecfdf5",
                            borderRadius: "8px",
                          }}
                        >
                          <p
                            style={{
                              fontSize: "24px",
                              fontWeight: "bold",
                              color: "#065f46",
                            }}
                          >
                            8.2
                          </p>
                          <p style={{ fontSize: "14px", color: "#059669" }}>
                            pH Level
                          </p>
                        </div>
                        <div
                          style={{
                            textAlign: "center",
                            padding: "12px",
                            backgroundColor: "#ecfdf5",
                            borderRadius: "8px",
                          }}
                        >
                          <p
                            style={{
                              fontSize: "24px",
                              fontWeight: "bold",
                              color: "#065f46",
                            }}
                          >
                            12°C
                          </p>
                          <p style={{ fontSize: "14px", color: "#059669" }}>
                            Avg Temp
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  position: "sticky",
                  bottom: 0,
                  backgroundColor: "white",
                  paddingTop: "16px",
                }}
              >
                <ButtonWithCSS variant="outline" onClick={onPrevStep}>
                  <ChevronLeft size={16} style={{ marginRight: "8px" }} /> Back
                  to Categories
                </ButtonWithCSS>
                <ButtonWithCSS>Download Report</ButtonWithCSS>
              </div>
            </div>
          );
        }

      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          zIndex: 1500,
        },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          width: "95%",
          maxWidth: "1400px",
          height: "90vh",
          maxHeight: "900px",
          padding: 0,
          border: "none",
          borderRadius: "16px",
          overflow: "hidden",
          backgroundColor: "#f8fafc",
        },
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(to right, #059669, #047857)",
            color: "white",
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
                Regenera Geovisor Dashboard
              </h2>
              <p style={{ color: "#a7f3d0", marginTop: "4px", margin: 0 }}>
                Environmental Intelligence Platform
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              style={{
                color: "white",
                backgroundColor: "rgba(255,255,255,0.1)",
              }}
            >
              <X size={24} />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            backgroundColor: "white",
            padding: "16px 24px",
            borderBottom: "1px solid #d1fae5",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  fontWeight: "600",
                  backgroundColor: step <= currentStep ? "#10b981" : "#ecfdf5",
                  color: step <= currentStep ? "white" : "#a7f3d0",
                  border: step === currentStep ? "4px solid #a7f3d0" : "none",
                }}
              >
                {step}
              </div>
            ))}
          </div>
          <div
            style={{
              width: "100%",
              backgroundColor: "#ecfdf5",
              borderRadius: "9999px",
              height: "8px",
            }}
          >
            <div
              style={{
                backgroundColor: "#10b981",
                height: "8px",
                borderRadius: "9999px",
                transition: "all 0.3s",
                width: `${((currentStep - 1) / 2) * 100}%`,
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "14px",
              color: "#059669",
              marginTop: "8px",
            }}
          >
            <span>Confirm Area</span>
            <span>Select Category</span>
            <span>View Results</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
          {renderStepContent()}
        </div>
      </div>
    </Modal>
  );
};

export default Dashboard;
