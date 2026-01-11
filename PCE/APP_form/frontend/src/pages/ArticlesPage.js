import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function ArticlesPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const navigate = useNavigate();
  const identifier = localStorage.getItem("n_utente");
  const nome = localStorage.getItem("patient_name");

  // Redirecionar para a página inicial se não houver identificador
  useEffect(() => {
    if (!identifier) {
      navigate("/");
    }
  }, [identifier, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("n_utente");
    localStorage.removeItem("patient_name");
    navigate("/");
  };

  const openPainModal = () => navigate("/history"); // Redireciona para a página de histórico
  const openMedicationModal = () => navigate("/history"); // Redireciona para a página de histórico
  const openNotificationModal = () => navigate("/history"); // Redireciona para a página de histórico

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f8fb" }}>
      <Sidebar
        activeTab="articles"
        setActiveTab={() => navigate("/dashboard")}
        onLogout={handleLogout}
        openPainModal={openPainModal}
        openMedicationModal={openMedicationModal}
        openNotificationModal={openNotificationModal}
        expanded={sidebarExpanded}
        setExpanded={setSidebarExpanded}
      />
      <div
        style={{
          marginLeft: sidebarExpanded ? 220 : 59,
          flex: 1,
          transition: "margin-left 0.3s",
          padding: "32px",
        }}
      >
        <header
          style={{
            background: "none",
            color: "#222",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            marginBottom: 32,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #1976d2 60%, #64b5f6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                color: "white",
                fontWeight: 700,
                boxShadow: "0 2px 12px rgba(25, 118, 210, 0.10)",
              }}
            >
              {nome ? nome.split(" ").map((n) => n[0]).join("").toUpperCase() : "U"}
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: 1 }}>
                {nome || "Utente"}
              </h1>
              <p style={{ margin: "4px 0 0 0", fontSize: 12, color: "#1976d2" }}>
                Nº Utente: {identifier}
              </p>
            </div>
          </div>
        </header>

        <div style={styles.content}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Artigos sobre Dor</h3>
            <div style={styles.listContainer}>
              {[
  {
    title: "Pain management techniques – Medical News Today",
    link: "https://www.medicalnewstoday.com/articles/pain-management-techniques#mind-body-techniques",
  },

  {
    title: "Pain Assessment – NCBI Bookshelf",
    link: "https://www.ncbi.nlm.nih.gov/books/NBK572296/",
  },
  {
    title: "Pain Management Overview – NCBI Bookshelf",
    link: "https://www.ncbi.nlm.nih.gov/books/NBK92054/",
  },
  {
    title: "Psychological management of pain – Taylor & Francis Online",
    link: "https://www.tandfonline.com/doi/abs/10.1080/09638280110108841"
  },
  {
    title: "Chronic Pain - Johns Hopkins Medicine",
    link: "https://www.hopkinsmedicine.org/health/conditions-and-diseases/chronic-pain"
  },
  {title: "Living with Chronic Pain – NHS Inform",
    link: "https://www.nhsinform.scot/illnesses-and-conditions/brain-nerves-and-spinal-cord/chronic-pain/living-with-chronic-pain/"
  },
  {title: "Tips for managing chronic pain – Mayo Clinic Health System",
    link: "https://www.mayoclinichealthsystem.org/hometown-health/speaking-of-health/8-tips-for-managing-chronic-pain"
  },
  {title: "A Review of Management of Acute Pain - NCBI",
    link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6179627/"
  }
].map((article, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.listItem,
                    ...(index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd),
                  }}
                >
                  <span style={styles.listItemText}>{article.title}</span>
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.listItemLink}
                  >
                    Consultar
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  content: {
    padding: "0 32px 32px",
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e0e6ed",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: "#34495e",
    margin: 0,
    marginBottom: 8,
  },
  listContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    padding: "8px 0",
    borderRadius: "8px",
    overflow: "hidden",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    border: "1px solid #e0e6ed",
    borderRadius: "8px",
  },
  listItemText: {
    fontSize: "14px",
    color: "#34495e",
    flex: 1,
    textAlign: "left",
  },
  listItemLink: {
    fontSize: "14px",
    color: "#1976d2",
    textDecoration: "none",
    fontWeight: 500,
  },
  tableRowEven: {
    background: "#fff",
  },
  tableRowOdd: {
    background: "#f3f6f9",
  },
};