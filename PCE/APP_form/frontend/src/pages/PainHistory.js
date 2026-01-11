import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PainHistoryPage() {
  const [painHistory, setPainHistory] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [additionalData, setAdditionalData] = useState({
    bodySites: [],
    precipitatingFactors: [],
    resolvingFactors: [],
    associatedSymptoms: [],
    examinationFindings: [],
    mediaFiles: [],
    phq9: [],
  });
  const [loading, setLoading] = useState(true);
  const [exportStatus, setExportStatus] = useState(null); // State for export feedback
  const navigate = useNavigate();
  const identifier = localStorage.getItem("n_utente");
  const nome = localStorage.getItem("patient_name");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch pain history
        const painRes = await fetch(`http://localhost:5001/api/pain-history/${identifier}`);
        if (!painRes.ok) throw new Error("Erro ao obter histórico de dor");
        const painData = await painRes.json();
        setPainHistory(painData);

        // Fetch body sites
        const bodySitesRes = await fetch(`http://localhost:5001/api/pain-body-sites/${identifier}`);
        if (bodySitesRes.ok) {
          const bodySitesData = await bodySitesRes.json();
          setAdditionalData(prev => ({ ...prev, bodySites: bodySitesData }));
        }

        // Fetch precipitating factors
        const precipitatingRes = await fetch(`http://localhost:5001/api/precipitating-factors/${identifier}`);
        if (precipitatingRes.ok) {
          const precipitatingData = await precipitatingRes.json();
          setAdditionalData(prev => ({ ...prev, precipitatingFactors: precipitatingData }));
        }

        // Fetch resolving factors
        const resolvingRes = await fetch(`http://localhost:5001/api/resolving-factors/${identifier}`);
        if (resolvingRes.ok) {
          const resolvingData = await resolvingRes.json();
          setAdditionalData(prev => ({ ...prev, resolvingFactors: resolvingData }));
        }

        // Fetch associated symptoms
        const associatedRes = await fetch(`http://localhost:5001/api/associated-symptoms/${identifier}`);
        if (associatedRes.ok) {
          const associatedData = await associatedRes.json();
          setAdditionalData(prev => ({ ...prev, associatedSymptoms: associatedData }));
        }

        // Fetch examination findings
        const examFindingsRes = await fetch(`http://localhost:5001/api/examination-findings/${identifier}`);
        if (examFindingsRes.ok) {
          const examFindingsData = await examFindingsRes.json();
          setAdditionalData(prev => ({ ...prev, examinationFindings: examFindingsData }));
        }

        // Fetch media files
        const mediaFilesRes = await fetch(`http://localhost:5001/api/media-files/${identifier}`);
        if (mediaFilesRes.ok) {
          const mediaFilesData = await mediaFilesRes.json();
          setAdditionalData(prev => ({ ...prev, mediaFiles: mediaFilesData }));
        }

        // Fetch PHQ-9 assessments
        const phq9Res = await fetch(`http://localhost:5001/api/phq9/${identifier}`);
        if (phq9Res.ok) {
          const phq9Data = await phq9Res.json();
          setAdditionalData(prev => ({ ...prev, phq9: phq9Data }));
        }
        
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

  const toggleRow = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("pt-PT");
  };

  const getAdditionalDataForSymptom = (idSymptom) => {
    return {
      bodySites: additionalData.bodySites.filter(item => item.id_symptom === idSymptom),
      precipitatingFactors: additionalData.precipitatingFactors.filter(item => item.id_symptom === idSymptom),
      resolvingFactors: additionalData.resolvingFactors.filter(item => item.id_symptom === idSymptom),
      associatedSymptoms: additionalData.associatedSymptoms.filter(item => item.id_symptom === idSymptom),
      examinationFindings: additionalData.examinationFindings.filter(item => item.id_symptom === idSymptom),
      mediaFiles: additionalData.mediaFiles.filter(item => 
        additionalData.examinationFindings.some(ef => ef.id_symptom === idSymptom && ef.id === item.id_exam_findings)
      ),
      phq9: additionalData.phq9.filter(item => item.id_symptom === idSymptom),
    };
  };

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
          form_type: "pain",
          record_id: recordId,
        }),
      });
      if (!response.ok) throw new Error("Falha ao exportar para FHIR");
      const data = await response.json();
      setExportStatus("Exportação bem-sucedida!");
      console.log("FHIR Export Response:", data);
      setTimeout(() => setExportStatus(null), 3000); // Clear after 3 seconds
    } catch (err) {
      setExportStatus(`Erro ao exportar: ${err.message}`);
      console.error("Export Error:", err);
      setTimeout(() => setExportStatus(null), 5000); // Clear after 5 seconds for errors
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
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Histórico Completo de Dor</h1>
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
          <h2 style={styles.sectionTitle}>Registos de Dor</h2>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}></th>
                    <th style={styles.tableHeader}>Data</th>
                    <th style={styles.tableHeader}>Sintoma</th>
                    <th style={styles.tableHeader}>Descrição</th>
                    <th style={styles.tableHeader}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {painHistory.length > 0 ? (
                  [...new Map(painHistory.map(item => [item.id, item])).values()].map((item, index) => {
                    const isExpanded = expandedRows[item.id];
                    const additionalDataForSymptom = getAdditionalDataForSymptom(item.id);

                    return (
                      <React.Fragment key={item.id}>
                        <tr style={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}>
                          <td style={styles.tableCell}>
                            <button
                              onClick={() => toggleRow(item.id)}
                              style={styles.expandButton}
                              className="expand-button"
                            >
                              {isExpanded ? "−" : "+"}
                            </button>
                          </td>
                            <td style={styles.tableCell}>{formatDate(item.created_at)}</td>
                            <td style={styles.tableCell}>{item.name || "N/A"}</td>
                            <td style={styles.tableCell}>{item.description || "N/A"}</td>
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
                        {isExpanded && (
                          <tr style={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}>
<td colSpan="5" style={styles.expandedCell}>
  <div style={styles.expandedContent}>
    <h4 style={styles.expandedTitle}>Detalhes do Registo de Dor</h4>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "32px" }}>
      {/* Coluna 1 */}
      <div style={{ flex: 1, minWidth: 260 }}>
        <div style={styles.detailBlock}>
          <h5 style={styles.expandedSubtitle}>Informações do Sintoma</h5>
          <table style={styles.detailTable}>
            <tbody>
              <tr>
                <td><strong>Sintoma:</strong></td>
                <td>{item.name || "N/A"}</td>
              </tr>
              <tr>
                <td><strong>Ocorrência:</strong></td>
                <td>{item.occurrence || "N/A"}</td>
              </tr>
              <tr>
                <td><strong>Progressão:</strong></td>
                <td>{item.progression || "N/A"}</td>
              </tr>
              <tr>
                <td><strong>Descrição:</strong></td>
                <td>{item.description || "N/A"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={styles.detailBlock}>
          <h5 style={styles.expandedSubtitle}>Abbey Pain Scale</h5>
          <table style={styles.detailTable}>
            <tbody>
              <tr>
                <td><strong>Categoria de Dor:</strong></td>
                <td>{item.pain_score_category || "N/A"}</td>
              </tr>
              <tr>
                <td><strong>Tipo de Dor:</strong></td>
                <td>{item.pain_type || "N/A"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={styles.detailBlock}>
          <h5 style={styles.expandedSubtitle}>Locais de Dor</h5>
          {additionalDataForSymptom.bodySites.length > 0 ? (
            <ul style={styles.detailList}>
              {additionalDataForSymptom.bodySites.map(site => (
                <li key={site.id}>{site.body_site || "N/A"}</li>
              ))}
            </ul>
          ) : (
            <span style={styles.detailEmpty}>Nenhum local de dor registado.</span>
          )}
        </div>
        <div style={styles.detailBlock}>
          <h5 style={styles.expandedSubtitle}>Fatores Precipitantes</h5>
          {additionalDataForSymptom.precipitatingFactors.length > 0 ? (
            <ul style={styles.detailList}>
              {additionalDataForSymptom.precipitatingFactors.map(factor => (
                <li key={factor.id}>{factor.factor || "N/A"}</li>
              ))}
            </ul>
          ) : (
            <span style={styles.detailEmpty}>Nenhum fator precipitante registado.</span>
          )}
        </div>
        <div style={styles.detailBlock}>
          <h5 style={styles.expandedSubtitle}>Fatores de Alívio</h5>
          {additionalDataForSymptom.resolvingFactors.length > 0 ? (
            <ul style={styles.detailList}>
              {additionalDataForSymptom.resolvingFactors.map(factor => (
                <li key={factor.id}>{factor.factor || "N/A"}</li>
              ))}
            </ul>
          ) : (
            <span style={styles.detailEmpty}>Nenhum fator de alívio registado.</span>
          )}
        </div>
      </div>
      {/* Coluna 2 */}
      <div style={{ flex: 1, minWidth: 260 }}>
        <div style={styles.detailBlock}>
          <h5 style={styles.expandedSubtitle}>Sintomas Associados</h5>
          {additionalDataForSymptom.associatedSymptoms.length > 0 ? (
            <ul style={styles.detailList}>
              {additionalDataForSymptom.associatedSymptoms.map(symptom => (
                <li key={symptom.id}>
                  <strong>{symptom.name || "N/A"}:</strong> {symptom.description || "N/A"}
                  {symptom.occurrence && <> (Ocorrência: {symptom.occurrence})</>}
                  {symptom.severity && <> (Gravidade: {symptom.severity})</>}
                </li>
              ))}
            </ul>
          ) : (
            <span style={styles.detailEmpty}>Nenhum sintoma associado registado.</span>
          )}
        </div>
        <div style={styles.detailBlock}>
          <h5 style={styles.expandedSubtitle}>Examination Findings</h5>
          {additionalDataForSymptom.examinationFindings.length > 0 ? (
            <ul style={styles.detailList}>
              {additionalDataForSymptom.examinationFindings.map(finding => (
                <li key={finding.id}><strong>Local:</strong> {finding.system_examined || "N/A"}</li>
              ))}
            </ul>
          ) : (
            <span style={styles.detailEmpty}>Nenhum dado de Examination Findings registado.</span>
          )}
        </div>
        <div style={styles.detailBlock}>
          <h5 style={styles.expandedSubtitle}>Arquivos de Media</h5>
          {additionalDataForSymptom.mediaFiles.length > 0 ? (
            <ul style={styles.detailList}>
              {additionalDataForSymptom.mediaFiles.map(file => (
                <li key={file.id}>
                  <a href={file.file_dir} target="_blank" rel="noopener noreferrer">
                    {file.content_name || "Arquivo sem nome"}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <span style={styles.detailEmpty}>Nenhum arquivo de media registado.</span>
          )}
        </div>
        <div style={styles.detailBlock}>
          <h5 style={styles.expandedSubtitle}>Avaliação PHQ-9</h5>
          {additionalDataForSymptom.phq9.length > 0 ? (
            additionalDataForSymptom.phq9.map(phq => (
              <table key={phq.id} style={styles.detailTable}>
                <tbody>
                  <tr>
                    <td><strong>Problemas de Sono:</strong></td>
                    <td>{phq.sleep_issues || "N/A"}</td>
                  </tr>
                  <tr>
                    <td><strong>Cansaço:</strong></td>
                    <td>{phq.tiredness || "N/A"}</td>
                  </tr>
                  <tr>
                    <td><strong>Apetite:</strong></td>
                    <td>{phq.appetite || "N/A"}</td>
                  </tr>
                  <tr>
                    <td><strong>Concentração:</strong></td>
                    <td>{phq.concentration || "N/A"}</td>
                  </tr>
                  <tr>
                    <td><strong>Pensamentos Autodestrutivos:</strong></td>
                    <td>{phq.self_harm_thoughts || "N/A"}</td>
                  </tr>
                  <tr>
                    <td><strong>Dificuldade no Dia a Dia:</strong></td>
                    <td>{phq.life_difficulty || "N/A"}</td>
                  </tr>
                </tbody>
              </table>
            ))
          ) : (
            <span style={styles.detailEmpty}>Nenhuma avaliação PHQ-9 registada.</span>
          )}
        </div>
      </div>
    </div>
  </div>
</td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" style={styles.tableCell}>Nenhum registo de dor encontrado</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {exportStatus && (
            <div style={styles.statusMessage} className={exportStatus.includes("Erro") ? "error" : ""}>
              {exportStatus}
            </div>
          )}
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
  expandedCell: {
    padding: "15px",
    backgroundColor: "#f5f6f5",
  },
  expandedContent: {
    padding: "15px",
    borderRadius: "4px",
    backgroundColor: "white",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  expandedTitle: {
    margin: "0 0 15px 0",
    color: "#2c3e50",
    fontSize: "16px",
    fontWeight: "600",
  },
  expandedSection: {
    marginBottom: "15px",
  },
  expandedSubtitle: {
    margin: "0 0 10px 0",
    color: "#34495e",
    fontSize: "14px",
    fontWeight: "500",
  },
  list: {
    margin: 0,
    paddingLeft: "20px",
  },
  contentSection: {
    marginBottom: "10px",
    padding: "10px",
    backgroundColor: "#f8f9fa",
    borderRadius: "4px",
  },
  expandButton: {
    // backgroundColor: "#1976d2",
    border: "none",
    color: "blue",
    width: "24px",
    height: "24px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.2s ease",
  },
  statusMessage: {
  marginTop: "10px",
  padding: "10px",
  borderRadius: "4px",
  textAlign: "center",
  color: "white",
  fontWeight: "500",
  backgroundColor: "#2ecc71",
  },

  detailBlock: {
  marginBottom: "18px",
  background: "#f8f9fa",
  borderRadius: "6px",
  padding: "12px 16px",
  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
},
detailTable: {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "13px",
  marginBottom: "0",
},
detailList: {
  margin: 0,
  paddingLeft: "20px",
  fontSize: "13px",
},
detailEmpty: {
  color: "#b0b0b0",
  fontStyle: "italic",
  fontSize: "13px",
}
};


// Add spinner and hover styles
const styleSheet = document.styleSheets[0];
if (styleSheet) {
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
    .expand-button:hover {
      background-color: #1565c0;
    }
  `,
    styleSheet.cssRules.length
  );
  styleSheet.insertRule(
    `
    .statusMessage {
      background-color: #2ecc71;
    }
  `,
    styleSheet.cssRules.length
  );
  styleSheet.insertRule(
    `
    .statusMessage.error {
      background-color: #e74c3c;
    }
  `,
    styleSheet.cssRules.length
  );
} else {
  console.warn("No writable stylesheet found for dynamic rule insertion.");
}