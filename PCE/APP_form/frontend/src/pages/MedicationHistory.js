import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MedicationHistoryPage() {
  const [medicationHistory, setMedicationHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exportStatus, setExportStatus] = useState(null);
  const navigate = useNavigate();
  const identifier = localStorage.getItem("n_utente");
  const nome = localStorage.getItem("patient_name");

  useEffect(() => {
    const fetchMedicationHistory = async () => {
      try {
        const medRes = await fetch(`http://localhost:5001/api/medication-history/${identifier}`);
        if (!medRes.ok) throw new Error("Erro ao procurar histórico de medicação");
        const data = await medRes.json();
        setMedicationHistory(data);
      } catch (err) {
        console.error("Erro na requisição:", err);
      } finally {
        setLoading(false);
      }
    };

    if (identifier) {
      fetchMedicationHistory();
    } else {
      navigate("/");
    }
  }, [identifier, navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("pt-PT");
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Carregando dados...</p>
      </div>
    );
  }

  const handleExportFHIR = async (recordId) => {
    setExportStatus("Exportando...");
    try {
      const response = await fetch("http://localhost:5001/api/fhir/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          n_utente: identifier,
          form_type: "medication",
          record_id: recordId,
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

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Histórico Completo de Medicação</h1>
        <p style={styles.subtitle}>{nome}</p>
        <p style={styles.subtitle}>Nº Utente: {identifier}</p>
        <button
          onClick={() => navigate("/history")}
          style={styles.backButton}
          className="back-button"
        >
          Voltar
        </button>
      </header>
      <div style={styles.content}>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Registos de Medicação</h2>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Data</th>
                  <th style={styles.tableHeader}>Medicamento</th>
                  <th style={styles.tableHeader}>Dose</th>
                  <th style={styles.tableHeader}>Duração</th>
                  <th style={styles.tableHeader}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {medicationHistory.length > 0 ? (
                  medicationHistory.map((item, index) => (
                    <tr key={index} style={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}>
                      <td style={styles.tableCell}>{formatDate(item.created_at)}</td>
                      <td style={styles.tableCell}>{item.nome_medicamento || "N/A"}</td>
                      <td style={styles.tableCell}>{item.dose || "N/A"}</td>
                      <td style={styles.tableCell}>{item.duracao_administracao || "N/A"}</td>
                      <td style={styles.tableCell}>
                        <button
                          onClick={() => handleExportFHIR(item.id)}
                          style={{ ...styles.backButton, backgroundColor: "#2ecc71", padding: "6px 12px" }}
                          className="export-button"
                        >
                          Exportar por FHIR
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={styles.tableCell}>Nenhum registo de medicação encontrado</td>
                  </tr>
                )}
              </tbody>
            </table>
            {exportStatus && <p style={styles.exportStatus}>{exportStatus}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
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
    fontSize: "15px",
    opacity: 0.9,
  },
  backButton: {
    backgroundColor: "#e74c3c",
    border: "none",
    color: "white",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color 0.2s ease",
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
  tableContainer: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },
  tableHeader: {
    backgroundColor: "#f1f1f1",
    color: "#2c3e50",
    padding: "10px",
    textAlign: "left",
    fontWeight: "500",
  },
  tableRowEven: {
    backgroundColor: "#f8f9fa",
  },
  tableRowOdd: {
    backgroundColor: "white",
  },
  tableCell: {
    padding: "10px",
    borderBottom: "1px solid #e0e0e0",
    color: "#34495e",
  },
  exportStatus: {
    marginTop: "10px",
    color: "#2ecc71",
    fontWeight: "500",
    textAlign: "center",
  },
};

// Add spinner and hover styles
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(
  `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`,
  styleSheet.cssRules.length
);
styleSheet.insertRule(
  `
  .back-button:hover {
    background-color: #c0392b;
    transform: translateY(-1px);
  }
`,
  styleSheet.cssRules.length
);
styleSheet.insertRule(
  `
  .export-button:hover {
    background-color: "#27ae60";
    transform: translateY(-1px);
  }
`,
  styleSheet.cssRules.length
);