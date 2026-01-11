import React from "react";

export default function Modal({ isOpen, onClose, title, children, customStyle }) {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={{ ...styles.modal, ...customStyle }}>
        <div style={styles.header}>
          <h2 style={styles.title}>{title}</h2>
          <button onClick={onClose} style={styles.closeButton} className="close-button">
            ×
          </button>
        </div>
        <div style={styles.content}>{children}</div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "white",
    borderRadius: "8px",
    width: "90%",
    maxWidth: "700px",
    height: "90%",
    maxHeight: "700px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#1976d2",
    color: "white",
    padding: "12px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "500",
  },
  closeButton: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "18px",
    cursor: "pointer",
    padding: "0 10px",
  },
  content: {
    padding: "20px",
    maxHeight: "80vh",
    overflowY: "auto",
  },
};

// Add hover style for close button
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(
  `
  .close-button:hover {
    color: #bbdefb;
  }
`,
  styleSheet.cssRules.length
);