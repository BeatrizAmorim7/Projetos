// frontend/src/components/FormHeader.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const FormHeader = ({ title }) => {
  const navigate = useNavigate();

  return (
    <header style={styles.header}>
      <div>
        <h1 style={styles.title}>{title}</h1>
      </div>
      <button 
        onClick={() => navigate("/")} 
        style={styles.backButton}
      >
        Voltar ao Menu Inicial
      </button>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: "#1976d2",
    color: "white",
    padding: "15px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginBottom: "20px",
  },
  title: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "500",
  },
  patientInfo: {
    marginTop: "5px",
    fontSize: "14px",
    opacity: 0.9,
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  separator: {
    opacity: 0.5,
  },
  backButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    border: "none",
    color: "white",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.2s ease",
    ':hover': {
      backgroundColor: "rgba(255,255,255,0.2)",
    },
  },
};

export default FormHeader;