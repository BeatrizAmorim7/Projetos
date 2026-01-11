import React from "react";
import { FaUser, FaHeartbeat, FaPills, FaHistory, FaSignOutAlt, FaBook, FaRegBell } from "react-icons/fa";

import { useNavigate } from "react-router-dom";

export default function Sidebar({
  
  activeTab,
  setActiveTab,
  onLogout,
  openPainModal,
  openMedicationModal,
  openNotificationModal,
  expanded,
  setExpanded
}) {

  const navigate = useNavigate();

  return (
    <div
      style={{
        width: expanded ? 200 : 60,
        background: "linear-gradient(180deg, #1976d2 0%, #64b5f6 100%)",
        color: "white",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        transition: "width 0.2s",
        zIndex: 1100,
        boxShadow: "2px 0 8px rgba(25, 118, 210, 0.08)",
        display: "flex",
        flexDirection: "column",
        alignItems: expanded ? "flex-start" : "center",
        paddingTop: 30,
      }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      
    >
      <SidebarButton
        icon={<FaUser size={22} />}
        label="Informações"
        active={activeTab === "info"}
        onClick={() => setActiveTab("info")}
        expanded={expanded}
      />
      <SidebarButton
        icon={<FaHeartbeat size={22} />}
        label="Registar Dor"
        onClick={openPainModal}
        expanded={expanded}
      />
      <SidebarButton
        icon={<FaPills size={22} />}
        label="Registar Med"
        onClick={openMedicationModal}
        expanded={expanded}
      />
      <SidebarButton
        icon={<FaHistory size={22} />}
        label="Histórico"
        active={activeTab === "history"}
        onClick={() => navigate("/history")}
        expanded={expanded}
      />
      <SidebarButton
        icon={<FaBook size={22} />}
        label="Artigos"
        active={activeTab === "articles"}
        onClick={() => navigate("/articles")}
        expanded={expanded}
      />
      <SidebarButton
        icon={<FaRegBell size={22} />}
        label="Notificações"
        onClick={openNotificationModal}
        expanded={expanded}
      />
      <div style={{ flexGrow: 1 }} />
      <SidebarButton
        icon={<FaSignOutAlt size={22} />}
        label="Sair"
        onClick={onLogout}
        expanded={expanded}
        danger
      />
    </div>
  );
}

function SidebarButton({ icon, label, active, onClick, expanded, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: expanded ? "flex-start" : "center", 
        width: "100%",
        background: active ? "#1565c0" : "transparent",
        border: "none",
        color: danger ? "#ffb4a2" : "white",
        padding: expanded ? "14px 28px" : "14px 0",
        fontSize: "15px",
        fontWeight: active ? 600 : 400,
        cursor: "pointer",
        outline: "none",
        borderRadius: "0 20px 20px 0",
        marginBottom: 10,
        transition: "background 0.2s, color 0.2s",
        boxShadow: active ? "0 2px 8px rgba(25, 118, 210, 0.10)" : "none"
      }}
    >
      {icon}
      {expanded && <span style={{ marginLeft: 18 }}>{label}</span>}
    </button>
  );
}