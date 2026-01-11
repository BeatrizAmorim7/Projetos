import React, { useRef, useState } from "react";
import "./BodyZoneSVG.css";

export default function BodyZoneSVG({ lastZone }) {
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, text: "" });
  const containerRef = useRef(null);

  // Função para calcular posição relativa ao container
  function handleTooltip(e, text) {
    const rect = containerRef.current.getBoundingClientRect();
    setTooltip({
      show: true,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      text
    });
  }

  return (
    <div
      ref={containerRef}
      style={{ perspective: 600, width: 160, height: 240, position: "relative" }}
    >
      <svg
        width="160"
        height="240"
        viewBox="0 0 160 240"
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#b0bec5", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#95a5a6", stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        {/* Head */}
        <circle
          id="head"
          cx="80"
          cy="40"
          r="30"
          fill={lastZone === "head" ? "#e74c3c" : "url(#bodyGradient)"}
          style={{
            filter: lastZone === "head" ? "drop-shadow(0 0 8px #e74c3c)" : "none",
            transition: "fill 0.3s ease",
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Cabeça")}
          onMouseMove={e => handleTooltip(e, "Cabeça")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Left Eye */}
        <circle
          id="left-eye"
          cx="70"
          cy="35"
          r="4"
          style={{
            opacity: lastZone === "left-eye" ? 1 : 0,
            filter: lastZone === "left-eye" ? "drop-shadow(0 0 8px #e74c3c)" : "none",
            transition: "opacity 0.3s, filter 0.3s"
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Olho esquerdo")}
          onMouseMove={e => handleTooltip(e, "Olho esquerdo")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Right Eye */}
        <circle
          id="right-eye"
          cx="90"
          cy="35"
          r="4"
          style={{
            opacity: lastZone === "right-eye" ? 1 : 0,
            filter: lastZone === "right-eye" ? "drop-shadow(0 0 8px #e74c3c)" : "none",
            transition: "opacity 0.3s, filter 0.3s"
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Olho direito")}
          onMouseMove={e => handleTooltip(e, "Olho direito")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Nose */}
        <ellipse
          id="nose"
          cx="80"
          cy="45"
          rx="3"
          ry="5"
          style={{
            opacity: lastZone === "nose" ? 1 : 0,
            filter: lastZone === "nose" ? "drop-shadow(0 0 8px #e74c3c)" : "none",
            transition: "opacity 0.3s, filter 0.3s"
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Nariz")}
          onMouseMove={e => handleTooltip(e, "Nariz")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Mouth */}
        <path
          id="mouth"
          d="M74 52 Q80 56 86 52"
          fill="none"
          stroke={lastZone === "mouth" ? "#e74c3c" : "#b0bec5"}
          strokeWidth="2"
          style={{
            opacity: lastZone === "mouth" ? 1 : 0,
            filter: lastZone === "mouth" ? "drop-shadow(0 0 8px #e74c3c)" : "none",
            transition: "opacity 0.3s, filter 0.3s"
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Boca")}
          onMouseMove={e => handleTooltip(e, "Boca")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Left Ear */}
        <ellipse
          id="left-ear"
          cx="50"
          cy="46"
          rx="2"
          ry="5"
          fill={lastZone === "left-ear" ? "#e74c3c" : "rgba(0, 0, 0, 0.05)"}
          transform="rotate(-5 50 46)"
          style={{
            filter: lastZone === "left-ear" ? "drop-shadow(0 0 5px #e74c3c)" : "none",
            transition: "fill 0.3s ease",
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Orelha esquerda")}
          onMouseMove={e => handleTooltip(e, "Orelha esquerda")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Right Ear */}
        <ellipse
          id="right-ear"
          cx="110"
          cy="46"
          rx="2"
          ry="5"
          fill={lastZone === "right-ear" ? "#e74c3c" : "rgba(0, 0, 0, 0.05)"}
          transform="rotate(5 110 46)"
          style={{
            filter: lastZone === "right-ear" ? "drop-shadow(0 0 5px #e74c3c)" : "none",
            transition: "fill 0.3s ease",
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Orelha direita")}
          onMouseMove={e => handleTooltip(e, "Orelha direita")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Neck */}
        <rect
          id="neck"
          x="74"
          y="72"
          width="12"
          height="16"
          rx="4"
          ry="4"
          fill={lastZone === "neck" ? "#e74c3c" : "url(#bodyGradient)"}
          style={{
            filter: lastZone === "neck" ? "drop-shadow(0 0 8px #e74c3c)" : "none",
            transition: "fill 0.3s ease",
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Pescoço")}
          onMouseMove={e => handleTooltip(e, "Pescoço")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Left Shoulder */}
        <circle
          id="left-shoulder"
          cx="50"
          cy="80"
          r="5"
          fill={lastZone === "left-shoulder" ? "#e74c3c" : "url(#bodyGradient)"}
          style={{
            filter: lastZone === "left-shoulder" ? "drop-shadow(0 0 8px #e74c3c)" : "none",
            transition: "fill 0.3s ease",
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Ombro esquerdo")}
          onMouseMove={e => handleTooltip(e, "Ombro esquerdo")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Right Shoulder */}
        <circle
          id="right-shoulder"
          cx="110"
          cy="80"
          r="5"
          fill={lastZone === "right-shoulder" ? "#e74c3c" : "url(#bodyGradient)"}
          style={{
            filter: lastZone === "right-shoulder" ? "drop-shadow(0 0 8px #e74c3c)" : "none",
            transition: "fill 0.3s ease",
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Ombro direito")}
          onMouseMove={e => handleTooltip(e, "Ombro direito")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Torso */}
        <rect
          id="torso"
          x="50"
          y="70"
          width="60"
          height="90"
          rx="25"
          fill={lastZone === "torso" ? "#e74c3c" : "url(#bodyGradient)"}
          style={{
            filter: lastZone === "torso" ? "drop-shadow(0 0 8px #e74c3c)" : "none",
            transition: "fill 0.3s ease",
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Torso")}
          onMouseMove={e => handleTooltip(e, "Torso")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Chest */}
        <rect
          id="chest"
          x="50"
          y="70"
          width="60"
          height="40"
          rx="15"
          fill={lastZone === "chest" ? "#e74c3c" : "url(#bodyGradient)"}
          style={{
            opacity: lastZone === "chest" ? 1 : 0,
            filter: lastZone === "chest" ? "drop-shadow(0 0 8px #e74c3c)" : "none",
            transition: "opacity 0.3s, filter 0.3s"
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Peito")}
          onMouseMove={e => handleTooltip(e, "Peito")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Abdomen */}
        <rect
          id="abdomen"
          x="50"
          y="110"
          width="60"
          height="50"
          rx="15"
          fill={lastZone === "abdomen" ? "#e74c3c" : "url(#bodyGradient)"}
          style={{
            opacity: lastZone === "abdomen" ? 1 : 0,
            filter: lastZone === "abdomen" ? "drop-shadow(0 0 8px #e74c3c)" : "none",
            transition: "opacity 0.3s, filter 0.3s"
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Abdomén")}
          onMouseMove={e => handleTooltip(e, "Abdomén")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Spine */}
        <rect
          id="spine"
          x="75"
          y="70"
          width="10"
          height="90"
          style={{
            opacity: lastZone === "spine" ? 1 : 0,
            filter: lastZone === "spine" ? "drop-shadow(0 0 8px #e74c3c)" : "none",
            transition: "opacity 0.3s, filter 0.3s"
          }}
          fill={lastZone === "spine" ? "#e74c3c" : "url(#bodyGradient)"}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Coluna")}
          onMouseMove={e => handleTooltip(e, "Coluna")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Back */}
        <rect
          id="back"
          x="50"
          y="70"
          width="60"
          height="90"
          rx="25"
          fill={lastZone === "back" ? "#e74c3c" : "url(#bodyGradient)"}
          style={{
            opacity: lastZone === "back" ? 1 : 0,
            filter: lastZone === "back" ? "drop-shadow(0 0 8px #e74c3c)" : "none",
            transition: "opacity 0.3s, filter 0.3s"
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Costas")}
          onMouseMove={e => handleTooltip(e, "Costas")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Lower Back */}
        <rect
          id="lower-back"
          x="50"
          y="120"
          width="60"
          height="40"
          rx="15"
          fill={lastZone === "lower-back" ? "#e74c3c" : "url(#bodyGradient)"}
          style={{
            opacity: lastZone === "lower-back" ? 1 : 0,
            filter: lastZone === "lower-back" ? "drop-shadow(0 0 8px #e74c3c)" : "none",
            transition: "opacity 0.3s, filter 0.3s"
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Parte inferior das costas")}
          onMouseMove={e => handleTooltip(e, "Parte inferior das costas")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Left Arm */}
        <line
          id="left-arm"
          x1="50"
          y1="80"
          x2="40"
          y2="150"
          stroke={lastZone === "left-arm" ? "#e74c3c" : "#b0bec5"}
          strokeWidth="12"
          strokeLinecap="round"
          style={{
            filter: lastZone === "left-arm" ? "drop-shadow(0 0 8px #e74c3c)" : "none",
            transition: "stroke 0.3s ease",
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Braço esquerdo")}
          onMouseMove={e => handleTooltip(e, "Braço esquerdo")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Right Arm */}
        <line
          id="right-arm"
          x1="110"
          y1="80"
          x2="120"
          y2="150"
          stroke={lastZone === "right-arm" ? "#e74c3c" : "#b0bec5"}
          strokeWidth="12"
          strokeLinecap="round"
          style={{
            filter: lastZone === "right-arm" ? "drop-shadow(0 0 8px #e74c3c)" : "none",
            transition: "stroke 0.3s ease",
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Braço direito")}
          onMouseMove={e => handleTooltip(e, "Braço direito")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Left Elbow */}
        <circle
          id="left-elbow"
          cx="45"
          cy="115"
          r="6"
          fill={lastZone === "left-elbow" ? "#e74c3c" : "#b0bec5"}
          style={{
            opacity: lastZone === "left-elbow" ? 1 : 0,
            filter: lastZone === "left-elbow" ? "drop-shadow(0 0 8px #e74c3c)" : "none",
            transition: "opacity 0.3s, filter 0.3s"
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Cotovelo esquerdo")}
          onMouseMove={e => handleTooltip(e, "Cotovelo esquerdo")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Right Elbow */}
        <circle
          id="right-elbow"
          cx="115"
          cy="115"
          r="6"
          fill={lastZone === "right-elbow" ? "#e74c3c" : "#b0bec5"}
          style={{
            opacity: lastZone === "right-elbow" ? 1 : 0,
            filter: lastZone === "right-elbow" ? "drop-shadow(0 0 8px #e74c3c)" : "none",
            transition: "opacity 0.3s, filter 0.3s"
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Cotovelo direito")}
          onMouseMove={e => handleTooltip(e, "Cotovelo direito")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Left Hand */}
        <ellipse
          id="left-hand"
          cx="40"
          cy="150"
          rx="8"
          ry="6"
          fill={lastZone === "left-hand" ? "#e74c3c" : "#b0bec5"}
          style={{
            opacity: lastZone === "left-hand" ? 1 : 0,
            filter: lastZone === "left-hand" ? "drop-shadow(0 0 8px #e74c3c)" : "none",
            transition: "opacity 0.3s, filter 0.3s"
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Mão esquerda")}
          onMouseMove={e => handleTooltip(e, "Mão esquerda")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Right Hand */}
        <ellipse
          id="right-hand"
          cx="120"
          cy="150"
          rx="8"
          ry="6"
          fill={lastZone === "right-hand" ? "#e74c3c" : "#b0bec5"}
          style={{
            opacity: lastZone === "right-hand" ? 1 : 0,
            filter: lastZone === "right-hand" ? "drop-shadow(0 0 8px #e74c3c)" : "none",
            transition: "opacity 0.3s, filter 0.3s"
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Mão direita")}
          onMouseMove={e => handleTooltip(e, "Mão direita")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Left Leg */}
        <line
          id="left-leg"
          x1="65"
          y1="160"
          x2="60"
          y2="230"
          stroke={lastZone === "left-leg" ? "#e74c3c" : "#b0bec5"}
          strokeWidth="16"
          strokeLinecap="round"
          style={{
            filter: lastZone === "left-leg" ? "drop-shadow(0 0 8px #e74c3c)" : "none",
            transition: "stroke 0.3s ease",
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Perna esquerda")}
          onMouseMove={e => handleTooltip(e, "Perna esquerda")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Right Leg */}
        <line
          id="right-leg"
          x1="95"
          y1="160"
          x2="100"
          y2="230"
          stroke={lastZone === "right-leg" ? "#e74c3c" : "#b0bec5"}
          strokeWidth="16"
          strokeLinecap="round"
          style={{
            filter: lastZone === "right-leg" ? "drop-shadow(0 0 8px #e74c3c)" : "none",
            transition: "stroke 0.3s ease",
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Perna direita")}
          onMouseMove={e => handleTooltip(e, "Perna direita")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Left Knee */}
        <circle
          id="left-knee"
          cx={62.5}
          cy={195}
          r="6"
          fill={lastZone === "left-knee" ? "#e74c3c" : "#b0bec5"}
          style={{
            opacity: lastZone === "left-knee" ? 1 : 0,
            filter: lastZone === "left-knee" ? "drop-shadow(0 0 8px #e74c3c)" : "none",
            transition: "opacity 0.3s, filter 0.3s"
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Joelho esquerdo")}
          onMouseMove={e => handleTooltip(e, "Joelho esquerdo")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Right Knee */}
        <circle
          id="right-knee"
          cx={97.5}
          cy={195}
          r="6"
          fill={lastZone === "right-knee" ? "#e74c3c" : "#b0bec5"}
          style={{
            opacity: lastZone === "right-knee" ? 1 : 0,
            filter: lastZone === "right-knee" ? "drop-shadow(0 0 8px #e74c3c)" : "none",
            transition: "opacity 0.3s, filter 0.3s"
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Joelho direito")}
          onMouseMove={e => handleTooltip(e, "Joelho direito")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Left Foot */}
        <ellipse
          id="left-foot"
          cx={60}
          cy={230}
          rx="8"
          ry="6"
          fill={lastZone === "left-foot" ? "#e74c3c" : "#b0bec5"}
          style={{
            opacity: lastZone === "left-foot" ? 1 : 0,
            filter: lastZone === "left-foot" ? "drop-shadow(0 0 8px #e74c3c)" : "none",
            transition: "opacity 0.3s, filter 0.3s"
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Pé esquerdo")}
          onMouseMove={e => handleTooltip(e, "Pé esquerdo")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Right Foot */}
        <ellipse
          id="right-foot"
          cx={100}
          cy={230}
          rx="8"
          ry="6"
          fill={lastZone === "right-foot" ? "#e74c3c" : "#b0bec5"}
          style={{
            opacity: lastZone === "right-foot" ? 1 : 0,
            filter: lastZone === "right-foot" ? "drop-shadow(0 0 8px #e74c3c)" : "none",
            transition: "opacity 0.3s, filter 0.3s"
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Pé direito")}
          onMouseMove={e => handleTooltip(e, "Pé direito")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Internal Organs */}

        {/* Heart */}
        <ellipse
          id="heart"
          cx="80"
          cy="110"
          rx="10"
          ry="12"
          fill="#e74c3c"
          style={{
            opacity: lastZone === "heart" ? 1 : 0,
            filter: lastZone === "heart" ? "drop-shadow(0 0 8px #e74c3c)" : "none",
            transition: "opacity 0.3s, filter 0.3s"
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Coração")}
          onMouseMove={e => handleTooltip(e, "Coração")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Left Lung */}
        <ellipse
          id="left-lung"
          cx="70"
          cy="100"
          rx="10"
          ry="16"
          fill="#e74c3c"
          style={{
            opacity: lastZone === "left-lung" ? 1 : 0,
            filter: lastZone === "left-lung" ? "drop-shadow(0 0 8px #e74c3c)" : "none",
            transition: "opacity 0.3s, filter 0.3s"
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Pulmão esquerdo")}
          onMouseMove={e => handleTooltip(e, "Pulmão esquerdo")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Right Lung */}
        <ellipse
          id="right-lung"
          cx="90"
          cy="100"
          rx="10"
          ry="16"
          fill="#e74c3c"
          style={{
            opacity: lastZone === "right-lung" ? 1 : 0,
            filter: lastZone === "right-lung" ? "drop-shadow(0 0 8px #e74c3c)" : "none",
            transition: "opacity 0.3s, filter 0.3s"
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Pulmão direito")}
          onMouseMove={e => handleTooltip(e, "Pulmão direito")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Liver */}
        <ellipse
          id="liver"
          cx="85"
          cy="130"
          rx="14"
          ry="8"
          fill="#e74c3c"
          style={{
            opacity: lastZone === "liver" ? 1 : 0,
            filter: lastZone === "liver" ? "drop-shadow(0 0 8px #e74c3c)" : "none",
            transition: "opacity 0.3s, filter 0.3s"
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Figado")}
          onMouseMove={e => handleTooltip(e, "Figado")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Stomach */}
        <ellipse
          id="stomach"
          cx="75"
          cy="130"
          rx="10"
          ry="8"
          fill="#e74c3c"
          style={{
            opacity: lastZone === "stomach" ? 1 : 0,
            filter: lastZone === "stomach" ? "drop-shadow(0 0 8px #e74c3c)" : "none",
            transition: "opacity 0.3s, filter 0.3s"
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Estômago")}
          onMouseMove={e => handleTooltip(e, "Estômago")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Spleen */}
        <ellipse
          id="spleen"
          cx="65"
          cy="130"
          rx="6"
          ry="7"
          fill="#e74c3c"
          style={{
            opacity: lastZone === "spleen" ? 1 : 0,
            filter: lastZone === "spleen" ? "drop-shadow(0 0 8px #e74c3c)" : "none",
            transition: "opacity 0.3s, filter 0.3s"
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Baço")}
          onMouseMove={e => handleTooltip(e, "Baço")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Pancreas */}
        <ellipse
          id="pancreas"
          cx="80"
          cy="140"
          rx="8"
          ry="4"
          fill="#e74c3c"
          style={{
            opacity: lastZone === "pancreas" ? 1 : 0,
            filter: lastZone === "pancreas" ? "drop-shadow(0 0 8px #e74c3c)" : "none",
            transition: "opacity 0.3s, filter 0.3s"
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Pâncreas")}
          onMouseMove={e => handleTooltip(e, "Pâncreas")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Left Kidney */}
        <ellipse
          id="left-kidney"
          cx="70"
          cy="145"
          rx="5"
          ry="8"
          fill="#e74c3c"
          style={{
            opacity: lastZone === "left-kidney" ? 1 : 0,
            filter: lastZone === "left-kidney" ? "drop-shadow(0 0 8px #e74c3c)" : "none",
            transition: "opacity 0.3s, filter 0.3s"
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Rim esquerdo")}
          onMouseMove={e => handleTooltip(e, "Rim esquerdo")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Right Kidney */}
        <ellipse
          id="right-kidney"
          cx="90"
          cy="145"
          rx="5"
          ry="8"
          fill="#e74c3c"
          style={{
            opacity: lastZone === "right-kidney" ? 1 : 0,
            filter: lastZone === "right-kidney" ? "drop-shadow(0 0 8px #e74c3c)" : "none",
            transition: "opacity 0.3s, filter 0.3s"
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Rim direito")}
          onMouseMove={e => handleTooltip(e, "Rim direito")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Intestine */}
        <ellipse
          id="intestine"
          cx="80"
          cy="160"
          rx="14"
          ry="10"
          fill="#e74c3c"
          style={{
            opacity: lastZone === "intestine" ? 1 : 0,
            filter: lastZone === "intestine" ? "drop-shadow(0 0 8px #e74c3c)" : "none",
            transition: "opacity 0.3s, filter 0.3s"
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Intestino")}
          onMouseMove={e => handleTooltip(e, "Intestino")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />

        {/* Bladder */}
        <ellipse
          id="bladder"
          cx="80"
          cy="180"
          rx="8"
          ry="6"
          fill="#e74c3c"
          style={{
            opacity: lastZone === "bladder" ? 1 : 0,
            filter: lastZone === "bladder" ? "drop-shadow(0 0 8px #e74c3c)" : "none",
            transition: "opacity 0.3s, filter 0.3s"
          }}
          className="body-part"
          onMouseEnter={e => handleTooltip(e, "Bexiga")}
          onMouseMove={e => handleTooltip(e, "Bexiga")}
          onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, text: "" })}
        />
      </svg>

      {tooltip.show && (
        <div
          style={{
            position: "absolute",
            top: tooltip.y - 40,
            left: tooltip.x + 10,
            background: "#222",
            color: "#fff",
            padding: "6px 14px",
            borderRadius: "16px",
            fontSize: 13,
            pointerEvents: "none",
            boxShadow: "0 2px 8px rgba(44,62,80,0.13)",
            zIndex: 9999,
            whiteSpace: "nowrap"
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}