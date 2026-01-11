import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: "#f0f4f8",
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{
        backgroundColor: "#ffffff",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        textAlign: "center"
      }}>
        <h2 style={{ marginBottom: "30px", color: "#333" }}>Bem-vindo</h2>
        <button
          onClick={() => navigate("/onboarding")}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            marginBottom: "20px",
            fontSize: "16px",
            cursor: "pointer",
            width: "200px"
          }}
        >
          Registar novo utente
        </button>
        <br />
        <button
          onClick={() => navigate("/login")}
          style={{
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
            width: "200px"
          }}
        >
          Utente já registado
        </button>
      </div>
    </div>
  );
}
