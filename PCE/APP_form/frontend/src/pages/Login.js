import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerPushNotificationsPreferences } from "../utils/pushNotifications";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const navigate = useNavigate();


  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/patients/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });

      if (res.status===200) {
        localStorage.setItem("n_utente", identifier);
        console.log("Utente guardado:", identifier);
        navigate("/dashboard");
      } else {
        alert("Utente não encontrado.");
      }
    } catch (err) {
      alert("Erro ao verificar utente.");
    }

    // subscrever notificações push
    let hour = 8;
    try {
      const response = await fetch(`http://localhost:5001/api/push/preferences/${identifier}`);
      if (response.ok) {
        const { notification_hour } = await response.json();
        console.log("Preferências de notificação obtidas:", notification_hour);
        hour = notification_hour || 8;
        
      }
    } catch (err) {
      console.error('Error fetching notification preferences:', err);
    }

    // Register for push notifications
    await registerPushNotificationsPreferences(identifier, hour);
    console.log("Push notifications registered with hour:", hour);

  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: "#f9fafb",
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{
        backgroundColor: "#fff",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        width: "300px",
        textAlign: "center"
      }}>
        <h3 style={{ marginBottom: "20px", color: "#333" }}>Iniciar Sessão</h3>
        <input
          type="text"
          placeholder="Número de utente"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          style={{
            padding: "10px",
            width: "100%",
            marginBottom: "15px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "14px"
          }}
        />
        <button
          onClick={handleLogin}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            width: "100%"
          }}
        >
          Entrar
        </button>
        <button
          onClick={() => navigate("/onboarding")}
          style={{
            padding: "5px 20px",
            backgroundColor: "transparent",
            color: "#007bff",
            borderRadius: "5px",
            cursor: "pointer",
            width: "100%",
            marginTop: "10px",
            fontSize: "14px",
            transition: "background-color 0.2s ease"
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#e7f1ff")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
        >
          Ainda não está registado?
        </button>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "5px 20px",
            backgroundColor: "transparent",
            color: "#007bff",
            borderRadius: "5px",
            cursor: "pointer",
            width: "100%",
            marginTop: "10px",
            fontSize: "12px",
            transition: "background-color 0.2s ease"
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#e7f1ff")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
        >
          Voltar ao Menu Inicial
        </button>
      </div>
    </div>
  );
}
