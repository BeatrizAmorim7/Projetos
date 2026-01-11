import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Modal from "./Modal";
import PainForm from "./PainForm";
import MedicationForm from "./MedicationForm";
import Sidebar from "../components/Sidebar";
import { FaUser, FaPhone, FaHome, FaNotesMedical } from "react-icons/fa";

export default function Dashboard() {
  const [patientData, setPatientData] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(true);
  const [exportStatus, setExportStatus] = useState(null);
  const navigate = useNavigate();
  const identifier = localStorage.getItem("n_utente");

  const [isPainModalOpen, setIsPainModalOpen] = useState(false);
  const [isMedicationModalOpen, setIsMedicationModalOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false); // New state for notification modal
  const [notificationHour, setNotificationHour] = useState(8); // Default to 8 AM
  
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch patient data
        const patientRes = await fetch(`http://localhost:5001/api/patients/${identifier}`);
        if (!patientRes.ok) throw new Error("Erro ao buscar dados do paciente");
        const patient = await patientRes.json();
        setPatientData(patient);
        localStorage.setItem("patient_name", patient.name);

      
      } catch (err) {
        console.error("Erro na requisição:", err);
      } finally {
        setLoading(false);
      }
    };

    if (identifier) {
      fetchData();
    } else {
      navigate("/");
    }
  }, [identifier, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("n_utente");
    localStorage.removeItem("patient_name");
    navigate("/");
  };


  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("pt-PT");
  };

 
  const openPainModal = () => {
    setIsPainModalOpen(true);
  };

  const closePainModal = () => {
    setIsPainModalOpen(false);
  };

  const openMedicationModal = () => {
    setIsMedicationModalOpen(true);
  };

  const closeMedicationModal = () => {
    setIsMedicationModalOpen(false);
  };

  const openNotificationModal = () => {
    setIsNotificationModalOpen(true);
  };

  const closeNotificationModal = () => {
    setIsNotificationModalOpen(false);
  };


  const handlePainSubmit = () => {
    closePainModal();
  };

  const handleMedicationSubmit = () => {
    closeMedicationModal();
  };

  const handleNotificationSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/push/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          n_utente: identifier,
          notification_hour: parseInt(notificationHour),
        }),
      });
      if (!response.ok) throw new Error("Failed to save preferences");
      alert("Preferências de notificação guardadas com sucesso!");
      closeNotificationModal();
    } catch (err) {
      console.error("Error saving notification preferences:", err);
      alert("Erro ao guardar preferências. Tente novamente.");
    }
  };
  

  const handleExportFHIR = async () => {
    setExportStatus("Exportando...");
    try {
      const response = await fetch("http://localhost:5001/api/fhir/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          n_utente: identifier,
          form_type: "personal_info",
          record_id: identifier, // Usar n_utente como record_id para dados pessoais
        }),
      });
      if (!response.ok) throw new Error("Falha ao exportar para FHIR");
      const data = await response.json();
      setExportStatus("Exportação bem-sucedida!");
      console.log("FHIR Export Response:", data);
      setTimeout(() => setExportStatus(null), 3000); // Limpa após 3 segundos
    } catch (err) {
      setExportStatus(`Erro ao exportar: ${err.message}`);
      console.error("Export Error:", err);
      setTimeout(() => setExportStatus(null), 5000); // Limpa após 5 segundos para erros
    }
  };


  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Carregando dados...</p>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div style={{ display: "flex", minHeight: "100vh", background: "#f4f8fb" }}>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
          openPainModal={openPainModal}
          openMedicationModal={openMedicationModal}
          openNotificationModal={openNotificationModal}
          expanded={sidebarExpanded}
          setExpanded={setSidebarExpanded}
        />

        <div
          style={{
            marginLeft: sidebarExpanded ? 220 : 65,
            flex: 1,
            transition: "margin-left 0.3s",
          }}
        >
          <div style={styles.content}>
            <header style={{
              ...styles.header,
              background: "none",
              color: "#222",
              display: "flex",
              alignItems: "center",
              gap: 24,
              marginBottom: 32
            }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #1976d2 60%, #64b5f6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                color: "white",
                fontWeight: 700,
                boxShadow: "0 2px 12px rgba(25, 118, 210, 0.10)"
              }}>
                {patientData?.name ? patientData.name.split(" ").map(n => n[0]).join("").toUpperCase() : "U"}
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: 1 }}>{patientData?.name || "Utente"}</h1>
                <p style={{ margin: "4px 0 0 0", fontSize: 15, color: "#1976d2" }}>Nº Utente: {identifier}</p>
              </div>
            </header>

        {/* Main Content */}
        <div style={styles.content}>
          {activeTab === "info" && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 32
            }}>
              {/* Card 1: Pessoal */}
              <div style={styles.card}>
                <div style={styles.cardIcon}><FaUser /></div>
                <div>
                  <div style={styles.cardLabel}>Nome Completo</div>
                  <div style={styles.cardValue}>{patientData?.name || "N/A"}</div>
                  <div style={styles.cardLabel}>Género</div>
                  <div style={styles.cardValue}>{patientData?.gender || "N/A"}</div>
                  
                </div>
              </div>
              {/* Card 2: Contactos */}
              <div style={styles.card}>
                <div style={styles.cardIcon}><FaPhone /></div>
                <div>
                  <div style={styles.cardLabel}>Tipo de Contacto</div>
                  <div style={styles.cardValue}>{patientData?.communication_type || "N/A"}</div>
                  <div style={styles.cardLabel}>Contacto</div>
                  <div style={styles.cardValue}>{patientData?.communication_value || "N/A"}</div>
                </div>
              </div>
              {/* Card 3: Morada */}
              <div style={styles.card}>
                <div style={styles.cardIcon}><FaHome /></div>
                <div>
                  <div style={styles.cardLabel}>Endereço</div>
                  <div style={styles.cardValue}>{patientData?.address_line || "N/A"}</div>
                  <div style={styles.cardLabel}>Cidade</div>
                  <div style={styles.cardValue}>{patientData?.city || "N/A"}</div>
                  <div style={styles.cardLabel}>Distrito</div>
                  <div style={styles.cardValue}>{patientData?.district || "N/A"}</div>
                  <div style={styles.cardLabel}>Código Postal</div>
                  <div style={styles.cardValue}>{patientData?.postal_code || "N/A"}</div>
                  <div style={styles.cardLabel}>País</div>
                  <div style={styles.cardValue}>{patientData?.country || "N/A"}</div>
                </div>
              </div>
              {/* Card 4: Clínica */}
              <div style={styles.card}>
                <div style={styles.cardIcon}><FaNotesMedical /></div>
                <div>
                  <div style={styles.cardLabel}>Diagnóstico</div>
                  <div style={styles.cardValue}>{patientData?.diagnosis_name || "N/A"}</div>
                  <div style={styles.cardLabel}>Data de Início</div>
                  <div style={styles.cardValue}>{formatDate(patientData?.onset_date)}</div>
                  <div style={styles.cardLabel}>Gravidade</div>
                  <div style={styles.cardValue}>{patientData?.severity || "N/A"}</div>
                  <div style={styles.cardLabel}>Descrição da Gravidade</div>
                  <div style={styles.cardValue}>{patientData?.severity_details || "N/A"}</div>
                  <div style={styles.cardLabel}>Data de Resolução</div>
                  <div style={styles.cardValue}>{formatDate(patientData?.resolution_date)}</div>
                </div>
              </div>
              <button
                    onClick={handleExportFHIR}
                    style={{ ...styles.actionButton, marginTop: "10px", padding: "8px 16px", fontSize: "14px" }}
                  >
                    Exportar por FHIR
              </button>
            </div>
            
          )}
          {exportStatus && <p style={{ textAlign: "center", color: "#2ecc71", marginTop: "10px", fontWeight: "500" }}>{exportStatus}</p>}
          </div>
      </div>
        

      {/* Modals */}
      <Modal
        isOpen={isPainModalOpen}
        onClose={closePainModal}
        title="Registar Dor"
      >
        <PainForm onSubmit={handlePainSubmit} onCancel={closePainModal} />
      </Modal>
      <Modal
        isOpen={isMedicationModalOpen}
        onClose={closeMedicationModal}
        title="Registar Medicação"
      >
        <MedicationForm onSubmit={handleMedicationSubmit} onCancel={closeMedicationModal} />
      </Modal>
      <Modal
        isOpen={isNotificationModalOpen}
        onClose={closeNotificationModal}
        title="Configurar Horário de Notificações"
        customStyle={{ height: "40%", width: "30%"}}
      >
        <div style={{ padding: "10px" }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleNotificationSubmit();
            }}
          >
            <label style={{ display: "block", marginBottom: "15px" }}>
              <span style={{ ...styles.cardLabel, display: "block", marginBottom: "5px" }}>
                Hora do Lembrete (0-23):
              </span>
              <select
                value={notificationHour}
                onChange={(e) => setNotificationHour(e.target.value)}
                style={{
                  padding: "8px",
                  fontSize: "16px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  width: "100%",
                }}
              >
                {[...Array(24)].map((_, i) => (
                  <option key={i} value={i}>{i}:00</option>
                ))}
              </select>
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="submit"
                style={{
                  ...styles.actionButton,
                  padding: "10px",
                  fontSize: "14px",
                  flex: 1,
                }}
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={closeNotificationModal}
                style={{
                  ...styles.actionButton,
                  backgroundColor: "#e74c3c",
                  padding: "10px",
                  fontSize: "14px",
                  flex: 1,
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </Modal>
        </div>
      </div>
    </React.Fragment>
  );
}

const styles = {
  card: {
    background: "white",
    borderRadius: "18px",
    boxShadow: "0 6px 32px rgba(44, 62, 80, 0.10)",
    padding: "32px 28px",
    display: "flex",
    alignItems: "flex-start",
    gap: "18px",
    minHeight: 180,
    animation: "fadeIn 0.7s",
    transition: "box-shadow 0.2s",
  },
  cardIcon: {
    fontSize: 36,
    color: "#1976d2",
    marginRight: 10,
    marginTop: 4,
  },
  cardLabel: {
    fontSize: 13,
    color: "#7f8c8d",
    fontWeight: 500,
    marginTop: 8,
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  cardValue: {
    fontSize: 16,
    color: "#34495e",
    fontWeight: 600,
    marginBottom: 2,
  },

  container: {
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f8f9fa",
  },
  spinner: {
    border: "4px solid rgba(0, 0, 0, 0.1)",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    borderLeftColor: "#1976d2",
    animation: "spin 1s linear infinite",
    marginBottom: "16px",
  },
  navbar: {
    background: "linear-gradient(90deg, #2c3e50 0%, #34495e 100%)",
    color: "white",
    padding: "15px 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  navLinks: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  navButton: {
    backgroundColor: "transparent",
    border: "1px solid rgba(255,255,255,0.3)",
    color: "white",
    padding: "10px 20px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    borderRadius: "6px",
    transition: "all 0.3s ease",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  activeNavButton: {
    backgroundColor: "#1976d2",
    border: "1px solid #1976d2",
    color: "white",
    padding: "10px 20px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    borderRadius: "6px",
    transition: "all 0.3s ease",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
    border: "none",
    color: "white",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.3s ease",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  header: {
    backgroundColor: "#1976d2",
    color: "white",
    padding: "12px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  title: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "500",
  },
  subtitle: {
    margin: "2px 0 0 0",
    fontSize: "12px",
    opacity: 0.9,
  },
  content: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "20px",
  },
  section: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    padding: "20px",
    marginBottom: "20px",
  },
  sectionTitle: {
    margin: "0 0 20px 0",
    color: "#2c3e50",
    fontSize: "20px",
    fontWeight: "600",
    borderBottom: "2px solid #f1f1f1",
    paddingBottom: "10px",
  },
  instruction: {
    color: "#34495e",
    fontSize: "14px",
    textAlign: "center",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "15px",
  },
  infoItem: {
    marginBottom: "10px",
  },
  infoLabel: {
    display: "block",
    fontSize: "14px",
    color: "#7f8c8d",
    fontWeight: "500",
    marginBottom: "5px",
  },
  infoValue: {
    fontSize: "16px",
    color: "#34495e",
    wordBreak: "break-word",
  },
  actionButton: {
    backgroundColor: "#1976d2",
    border: "none",
    color: "white",
    padding: "12px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "500",
    width: "100%",
    transition: "background-color 0.2s ease",
  },
};

// Add spinner animation and hover styles
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(
  `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px);}
    to { opacity: 1; transform: translateY(0);}
  }
`,
  styleSheet.cssRules.length
);
styleSheet.insertRule(
  `
  .nav-button:hover {
    background-color: rgba(255,255,255,0.15);
    border-color: rgba(255,255,255,0.5);
    transform: translateY(-1px);
  }
`,
  styleSheet.cssRules.length
);
styleSheet.insertRule(
  `
  .nav-button.active:hover {
    background-color: #1565c0;
    transform: translateY(-1px);
  }
`,
  styleSheet.cssRules.length
);
styleSheet.insertRule(
  `
  .logout-button:hover {
    background-color: #c0392b;
    transform: translateY(-1px);
    boxShadow: 0 2px 4px rgba(0,0,0,0.2);
  }
`,
  styleSheet.cssRules.length
);
styleSheet.insertRule(
  `
  .action-button:hover {
    background-color: #1565c0;
  }
`,
  styleSheet.cssRules.length
);



styleSheet.insertRule(
  `
  .view-all-button:hover {
    background-color: #1565c0;
    transform: translateY(-1px);
  }
`,
  styleSheet.cssRules.length
);

