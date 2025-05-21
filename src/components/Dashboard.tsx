"use client";

import type React from "react";
import Modal from "react-modal";
import {
  X,
  ChevronRight,
  BarChart2,
  Map,
  Droplets,
  Wind,
  Thermometer,
} from "lucide-react";

// Set the app element for accessibility
Modal.setAppElement("#root");

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
  // Define the topics
  const topics = [
    { id: "biodiversity", name: "Biodiversity", icon: <BarChart2 size={24} /> },
    { id: "landcover", name: "Land Cover", icon: <Map size={24} /> },
    { id: "water", name: "Water Resources", icon: <Droplets size={24} /> },
    { id: "climate", name: "Climate", icon: <Thermometer size={24} /> },
    { id: "carbon", name: "Carbon Flux", icon: <Wind size={24} /> },
  ];

  // Render different content based on the current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div style={styles.stepContent}>
            <h3 style={styles.stepTitle}>Step 1: Confirm Study Area</h3>
            <div style={styles.areaInfo}>
              <div style={styles.areaCard}>
                <h4 style={styles.areaCardTitle}>Selected Area</h4>
                <p style={styles.areaCardValue}>{areaInKm.toFixed(2)} km²</p>
              </div>

              <div style={styles.mapPreview}>
                {selectedArea ? (
                  <div style={styles.mapPlaceholder}>
                    <Map size={48} />
                    <p>Area Selected</p>
                  </div>
                ) : (
                  <div style={styles.mapPlaceholder}>
                    <p>No area selected</p>
                  </div>
                )}
              </div>
            </div>
            <button
              style={styles.nextButton}
              onClick={onNextStep}
              disabled={!selectedArea}
            >
              Confirm Area <ChevronRight size={16} />
            </button>
          </div>
        );

      case 2:
        return (
          <div style={styles.stepContent}>
            <h3 style={styles.stepTitle}>Step 2: Select Study Topic</h3>
            <div style={styles.topicGrid}>
              {topics.map((topic) => (
                <div
                  key={topic.id}
                  style={{
                    ...styles.topicCard,
                    ...(selectedTopic === topic.id
                      ? styles.topicCardSelected
                      : {}),
                  }}
                  onClick={() => onTopicSelect(topic.id)}
                >
                  <div style={styles.topicIcon}>{topic.icon}</div>
                  <div style={styles.topicName}>{topic.name}</div>
                </div>
              ))}
            </div>
            <div style={styles.buttonGroup}>
              <button style={styles.backButton} onClick={onPrevStep}>
                Back
              </button>
              <button
                style={styles.nextButton}
                onClick={onNextStep}
                disabled={!selectedTopic}
              >
                View Results <ChevronRight size={16} />
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div style={styles.stepContent}>
            <h3 style={styles.stepTitle}>
              Step 3:{" "}
              {selectedTopic
                ? topics.find((t) => t.id === selectedTopic)?.name
                : ""}{" "}
              Analysis
            </h3>

            <div style={styles.resultsContainer}>
              <div style={styles.chartContainer}>
                <div style={styles.chartPlaceholder}>
                  <BarChart2 size={48} color="#3498db" />
                  <p>Environmental Impact Analysis</p>
                  <div style={styles.chartDescription}>
                    This chart shows the environmental impact analysis for the
                    selected area. The data is based on satellite imagery and
                    ground observations.
                  </div>
                </div>
              </div>

              <div style={styles.statsContainer}>
                <div style={styles.statCard}>
                  <h4>Area Coverage</h4>
                  <p>{areaInKm.toFixed(2)} km²</p>
                  <div style={styles.statTrend}>
                    <span style={{ color: "#10b981" }}>↑ 2.4%</span> from last
                    year
                  </div>
                </div>

                <div style={styles.statCard}>
                  <h4>Biodiversity Index</h4>
                  <p>{(Math.random() * 100).toFixed(1)}%</p>
                  <div style={styles.statTrend}>
                    <span style={{ color: "#ef4444" }}>↓ 1.2%</span> from last
                    year
                  </div>
                </div>

                <div style={styles.statCard}>
                  <h4>Carbon Sequestration</h4>
                  <p>{(Math.random() * 1000).toFixed(0)} tons</p>
                  <div style={styles.statTrend}>
                    <span style={{ color: "#10b981" }}>↑ 5.7%</span> from last
                    year
                  </div>
                </div>

                <div style={styles.statCard}>
                  <h4>Water Quality</h4>
                  <p>{(Math.random() * 50).toFixed(1)} index</p>
                  <div style={styles.statTrend}>
                    <span style={{ color: "#10b981" }}>↑ 3.2%</span> from last
                    year
                  </div>
                </div>
              </div>

              <div style={styles.detailedStats}>
                <h4 style={styles.detailedStatsTitle}>Detailed Analysis</h4>
                <div style={styles.detailedStatsContent}>
                  <div style={styles.detailedStatItem}>
                    <h5>Forest Cover</h5>
                    <div style={styles.progressBar}>
                      <div
                        style={{
                          ...styles.progressBarFill,
                          width: `${Math.random() * 100}%`,
                          backgroundColor: "#10b981",
                        }}
                      ></div>
                    </div>
                    <p>{(Math.random() * 100).toFixed(1)}% of total area</p>
                  </div>

                  <div style={styles.detailedStatItem}>
                    <h5>Agricultural Land</h5>
                    <div style={styles.progressBar}>
                      <div
                        style={{
                          ...styles.progressBarFill,
                          width: `${Math.random() * 100}%`,
                          backgroundColor: "#f59e0b",
                        }}
                      ></div>
                    </div>
                    <p>{(Math.random() * 100).toFixed(1)}% of total area</p>
                  </div>

                  <div style={styles.detailedStatItem}>
                    <h5>Water Bodies</h5>
                    <div style={styles.progressBar}>
                      <div
                        style={{
                          ...styles.progressBarFill,
                          width: `${Math.random() * 100}%`,
                          backgroundColor: "#3b82f6",
                        }}
                      ></div>
                    </div>
                    <p>{(Math.random() * 100).toFixed(1)}% of total area</p>
                  </div>

                  <div style={styles.detailedStatItem}>
                    <h5>Urban Development</h5>
                    <div style={styles.progressBar}>
                      <div
                        style={{
                          ...styles.progressBarFill,
                          width: `${Math.random() * 100}%`,
                          backgroundColor: "#6366f1",
                        }}
                      ></div>
                    </div>
                    <p>{(Math.random() * 100).toFixed(1)}% of total area</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.buttonGroup}>
              <button style={styles.backButton} onClick={onPrevStep}>
                Back to Topic Selection
              </button>
              <button style={styles.downloadButton}>Download Report</button>
            </div>
          </div>
        );

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
          width: "90%",
          maxWidth: "1200px",
          height: "80vh",
          maxHeight: "800px",
          padding: 0,
          border: "none",
          borderRadius: "12px",
          overflow: "hidden",
        },
      }}
    >
      <div style={styles.dashboardContainer}>
        <div style={styles.header}>
          <h2 style={styles.title}>Geo-Visor Dashboard</h2>
          <button style={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div style={styles.progressBar}>
          <div style={styles.progressSteps}>
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                style={{
                  ...styles.progressStep,
                  ...(step <= currentStep ? styles.progressStepActive : {}),
                  ...(step === currentStep ? styles.progressStepCurrent : {}),
                }}
              >
                {step}
              </div>
            ))}
          </div>
          <div style={styles.progressLine}>
            <div
              style={{
                ...styles.progressLineFill,
                width: `${((currentStep - 1) / 2) * 100}%`,
              }}
            />
          </div>
        </div>

        <div style={styles.content}>{renderStepContent()}</div>
      </div>
    </Modal>
  );
};

// Inline styles
const styles = {
  dashboardContainer: {
    display: "flex",
    flexDirection: "column" as const,
    height: "100%",
    backgroundColor: "#f8f9fa",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    backgroundColor: "#2c3e50",
    color: "white",
  },
  title: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 600,
  },
  closeButton: {
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer",
    padding: "4px",
    borderRadius: "4px",
  },

  progressSteps: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  progressStep: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#e9ecef",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    color: "#6c757d",
  },
  progressStepActive: {
    backgroundColor: "#3498db",
    color: "white",
    zIndex: 1000,
  },
  progressStepCurrent: {
    boxShadow: "0 0 0 3px rgba(52, 152, 219, 0.3)",
  },
  progressLine: {
    height: "4px",
    backgroundColor: "#e9ecef",
    position: "relative" as const,
    marginTop: "4px",
  },
  progressLineFill: {
    height: "100%",
    backgroundColor: "#3498db",
    transition: "width 0.3s ease",
  },
  content: {
    padding: "24px",
    overflowY: "auto" as "auto",
    flex: 1,
    // height: "calc(80vh - 140px)",
    height: "100%",
  },
  stepContent: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "24px",
  },
  stepTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 600,
    color: "#2c3e50",
  },
  areaInfo: {
    display: "flex",
    gap: "24px",
    flexWrap: "wrap" as const,
  },
  areaCard: {
    flex: "1 1 300px",
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "16px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  areaCardTitle: {
    margin: "0 0 8px 0",
    fontSize: "14px",
    color: "#6c757d",
  },
  areaCardValue: {
    margin: 0,
    fontSize: "24px",
    fontWeight: 600,
    color: "#2c3e50",
  },
  mapPreview: {
    flex: "1 1 300px",
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "16px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    height: "200px",
  },
  mapPlaceholder: {
    height: "100%",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: "4px",
    color: "#6c757d",
  },
  nextButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "10px 16px",
    fontWeight: 600,
    cursor: "pointer",
    alignSelf: "flex-end" as const,
    transition: "all 0.2s ease",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  topicGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "16px",
  },
  topicCard: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "16px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    border: "2px solid transparent",
  },
  topicCardSelected: {
    borderColor: "#3498db",
    backgroundColor: "#ebf5fb",
  },
  topicIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    backgroundColor: "#f8f9fa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#3498db",
  },
  topicName: {
    fontWeight: 600,
    color: "#2c3e50",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "16px",
  },
  backButton: {
    backgroundColor: "#f1f5f9",
    color: "#334155",
    border: "none",
    borderRadius: "6px",
    padding: "10px 16px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
  resultsContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "24px",
  },
  chartContainer: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "16px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    height: "300px",
  },
  chartPlaceholder: {
    height: "100%",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: "4px",
    color: "#6c757d",
  },
  downloadButton: {
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "10px 16px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  chartDescription: {
    fontSize: "14px",
    color: "#6c757d",
    marginTop: "12px",
    textAlign: "center" as const,
    maxWidth: "80%",
  },

  detailedStats: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "16px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    marginTop: "24px",
  },
  detailedStatsTitle: {
    margin: "0 0 16px 0",
    fontSize: "16px",
    fontWeight: 600,
    color: "#2c3e50",
  },
  detailedStatsContent: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "16px",
  },
  detailedStatItem: {
    padding: "12px",
    backgroundColor: "#f8f9fa",
    borderRadius: "6px",
  },
  progressBar: {
    height: "35px",
    backgroundColor: "#e9ecef",
    borderRadius: "10px",
    margin: "8px 5px",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: "4px",
  },
  statsContainer: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap" as const,
    marginTop: "24px",
  },
  statCard: {
    flex: "1 1 200px",
    backgroundColor: "#f9f9f9",
    padding: "16px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  statTrend: {
    marginTop: "8px",
    fontSize: "12px",
    color: "#6c757d",
  },
};

export default Dashboard;
