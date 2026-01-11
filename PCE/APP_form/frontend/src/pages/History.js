import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { IconHappy, IconNeutral, IconConcerned, IconSad } from "../components/IconsPHQ";
import "../components/IconsPHQ.css";
import BodyZoneSVG from "../components/BodyZoneSVG";
import Sidebar from "../components/Sidebar";
import Modal from "./Modal";
import PainForm from "./PainForm";
import MedicationForm from "./MedicationForm";

import {
  Chart as ChartJS,
  LineElement,
  ArcElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement
} from 'chart.js';
import { Bar, Pie, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  BarElement
);


function respostaParaNumero(resposta, campo) {
  if (campo === "life_difficulty") {
    if (resposta === "Not difficult at all") return 0;
    if (resposta === "Somewhat difficult") return 1;
    if (resposta === "Very difficult") return 2;
    if (resposta === "Extremely difficult") return 3;
    return 0;
  }
  if (resposta === "Not at all") return 0;
  if (resposta === "Several days") return 1;
  if (resposta === "More than half the days") return 2;
  if (resposta === "Nearly every day") return 3;
  return 0;
}

function calcularPHQ6Score(phq) {
  const perguntas = [
    'sleep_issues',
    'tiredness',
    'appetite',
    'concentration',
    'self_harm_thoughts',
    'life_difficulty',
  ];
  return perguntas.reduce((total, campo) => {
    const valor = respostaParaNumero(phq[campo], campo);
    console.log(campo, phq[campo], valor);
    return total + valor;
  }, 0);
}

const LineChart = ({ data }) => {
  const labels = data.map(entry => new Date(entry.date).toLocaleDateString('pt-PT'));
  const scores = data.map(entry => entry.score);

  const chartData = {
    labels: labels,
    datasets: [{
      label: 'PHQ-6 Score',
      data: scores,
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.1,
      fill: true,
    }]
  };

  const options = {
    scales: {
      x: {
        type: 'category',
        title: { display: true, text: 'Data', bold: true },
      },
      y: {
        type: 'linear',
        title: { display: true, text: 'Score', bold: true },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: { display: true, position: 'top' },
      title: {
        display: true,
        text: 'Progressão do Score PHQ-6',
        color: '#2d3748',
        font: { size: 16, weight: '600', family: 'Poppins, sans-serif' },
        padding: { top: 10, bottom: 30 },
      },
    },
    maintainAspectRatio: false,
  };


  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};


function getPhqIcon(score) {
  if (score <= 4) return <IconHappy style={{ fontSize: 32 }} />;
  if (score <= 9) return <IconNeutral style={{ fontSize: 32 }} />;
  if (score <= 13) return <IconConcerned style={{ fontSize: 32 }} />;
  return <IconSad style={{ fontSize: 32 }} />;
}


const obterRecomendacoes = (score) => {
  if (score <= 4) {
    return {
      text: "Os seus dados indicam equilíbrio. Continue a investir no seu bem-estar e a cuidar de si!",
      color: '#27ae60' // Verde
    };
  } else if (score <= 9) {
    return {
      text: "Pode estar a experienciar alguns sintomas de depressão leve. Experimente técnicas de relaxamento ou converse com alguém.",
      color: '#f1c40f' // Amarelo
    };
  } else if (score <= 13) {
    return {
      text: "Os seus sintomas de depressão são preocupantes. Considere procurar apoio profissional.",
      color: '#e67e22' // Laranja
    };
  } else {
    return {
      text: "Os seus dados indicam a necessidade de uma avaliação especializada. Por favor, considere procurar ajuda médica com brevidade.",
      color: '#c0392b' // Vermelho
    };
  }
};


// Componente para gráfico circular
const PieChart = ({ data, title, colors }) => {
  const chartData = {
    labels: data.map(item => item[0]),
    datasets: [{
      data: data.map(item => item[1]),
      backgroundColor: colors,
      borderWidth: 0 // Remove bordas das fatias
    }]
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: title,
        color: '#2d3748', // Cor escura
        font: {
          size: 16,
          weight: '600',
          family: 'Poppins, sans-serif'
        },
        padding: {
          top: 10,
          bottom: 30 // Espaço extra
        }
      },
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true, // Ícones circulares
          pointStyle: 'circle'
        }
      }
    },
    cutout: '70%', // Opcional: gráfico "donut"
    maintainAspectRatio: false // Permite redimensionamento
  };

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '300px' }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};


const SymptomsBarChart = ({ data }) => {
  if (!data || data.length === 0) return <p style={{ textAlign: "center", color: "#34495e" }}>Nenhum sintoma associado registado</p>;

  // Define um array de cores (podes personalizar)
  const barColors = [
    "#A8DADC", // azul pastel
    "#FFE0AC", // amarelo pastel
    "#B5EAD7", // verde água pastel
    "#FFB7B2", // rosa pastel
    "#C7CEEA", // lilás pastel
    "#FFDAC1", // pêssego pastel
    "#E2F0CB", // verde claro pastel
    "#B5D6D6", // azul esverdeado pastel
    "#F6DFEB", // rosa/lilás muito claro
    "#FFF5BA"  // amarelo muito claro
  ];

  const chartData = {
    labels: data.map(item => item[0]),
    datasets: [
      {
        label: "Frequência",
        data: data.map(item => item[1]),
        backgroundColor: data.map((_, i) => barColors[i % barColors.length]), // Cores alternadas
        borderRadius: 8,
        barThickness: 24,
      },
    ],
  };

  const options = {
    indexAxis: "y", // barras horizontais
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Frequência dos Sintomas Associados",
        color: "#2d3748",
        font: { size: 16, weight: "600", family: "Poppins, sans-serif" },
        padding: { top: 10, bottom: 30 },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { color: "#34495e", font: { size: 13 } },
        grid: { color: "#e0e6ed" },
      },
      y: {
        ticks: { color: "#34495e", font: { size: 13 } },
        grid: { display: false },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default function History() {
  const [painHistory, setPainHistory] = useState([]);
  const [medicationHistory, setMedicationHistory] = useState([]);
  const [bodySites, setBodySites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const identifier = localStorage.getItem("n_utente");
  const nome = localStorage.getItem("patient_name");

  const [lastZone, setLastZone] = useState(null);
  const [painDates, setPainDates] = useState([]);
  const [isPainModalOpen, setIsPainModalOpen] = useState(false);
  const [isMedicationModalOpen, setIsMedicationModalOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [additionalData, setAdditionalData] = useState({
    phq9: [],
    phq6Scores: [],
  });
  const [topResolvingFactors, setTopResolvingFactors] = useState([]);
  const [topPrecipitatingFactors, setTopPrecipitatingFactors] = useState([]);
  const [suggestions, setSuggestions] = useState({ relief: [], avoid: [] });

  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false); // New state for notification modal
  const [notificationHour, setNotificationHour] = useState(8); // Default to 8 AM
    
  const [associatedSymptoms, setAssociatedSymptoms] = useState([]); // novo state para sintomas associados
  const [symptomFrequencyData, setSymptomFrequencyData] = useState([]);


  const bodyZoneMap = {
    "cabeça": "head",
    "cérebro": "head",
    "olho esquerdo": "left-eye",
    "olho direito": "right-eye",
    "ouvido esquerdo": "left-ear",
    "ouvido direito": "right-ear",
    "nariz": "nose",
    "boca": "mouth",
    "pescoço": "neck",
    "ombro esquerdo": "left-shoulder",
    "ombro direito": "right-shoulder",
    "braço esquerdo": "left-arm",
    "braço direito": "right-arm",
    "cotovelo esquerdo": "left-elbow",
    "cotovelo direito": "right-elbow",
    "mão esquerda": "left-hand",
    "mão direita": "right-hand",
    "peito": "chest",
    "pulmão esquerdo": "left-lung",
    "pulmão direito": "right-lung",
    "coração": "heart",
    "abdómen": "abdomen",
    "estômago": "stomach",
    "fígado": "liver",
    "baço": "spleen",
    "pâncreas": "pancreas",
    "rim esquerdo": "left-kidney",
    "rim direito": "right-kidney",
    "intestino": "intestine",
    "bexiga": "bladder",
    "coluna": "spine",
    "costas": "back",
    "lombar": "lower-back",
    "tronco": "torso",
    "perna esquerda": "left-leg",
    "perna direita": "right-leg",
    "joelho esquerdo": "left-knee",
    "joelho direito": "right-knee",
    "pé esquerdo": "left-foot",
    "pé direito": "right-foot",
  };

  const top5Resolving = topResolvingFactors
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5);

  const top5Precipitating = topPrecipitatingFactors
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5);

  const COLORS_RELIEF = [
  '#A8DADC', // cor base azul-esverdeada
  '#74C2C3', // tom mais escuro
  '#CDEBEC', // tom mais claro
  '#6BB0AF', // tom médio com mais verde
  '#D4F1F0'  // azul muito claro pastel
];

  const COLORS_PRECIPITATING = [  
  '#DDCC77', // cor base dourado suave
  '#C4B85F', // tom um pouco mais escuro
  '#EEE4AA', // tom mais claro
  '#BDAF4C', // dourado com mais contraste
  '#F5F1C3'  // amarelo pastel muito suave
];



  const fetchData = async () => {
    try {
      // Obter histórico de dor
      const painRes = await fetch(`http://localhost:5001/api/pain-history/${identifier}`);
      if (painRes.ok) {
        const painData = await painRes.json();
        setPainHistory(painData);
        setPainDates(
          painData
            .map((item) =>
              item.created_at ? new Date(item.created_at).toISOString().slice(0, 10) : null
            )
            .filter(Boolean)
        );
      }

      // Obter histórico de medicação
      const medRes = await fetch(`http://localhost:5001/api/medication-history/${identifier}`);
      if (medRes.ok) setMedicationHistory(await medRes.json());

      // Obter zonas de dor
      const bodySitesRes = await fetch(`http://localhost:5001/api/pain-body-sites/${identifier}/last`);
      if (bodySitesRes.ok) {
        const bodySitesData = await bodySitesRes.json();
        setBodySites(bodySitesData);
        if (bodySitesData.length > 0) {
          const latestSite = bodySitesData[0];
          setLastZone(
            latestSite ? bodyZoneMap[latestSite.body_site.toLowerCase()] || null : null
          );
        }
      }

      // Obter dados PHQ-9
      const phq9Res = await fetch(`http://localhost:5001/api/phq9/${identifier}`);
      if (phq9Res.ok) {
        const phq9Data = await phq9Res.json();
        phq9Data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        const lastPhqForm = phq9Data[phq9Data.length - 1];
        const phq6Scores = lastPhqForm
          ? [{ id_symptom: lastPhqForm.id_symptom, score: calcularPHQ6Score(lastPhqForm) }]
          : [];
        setAdditionalData((prev) => ({ ...prev, phq9: phq9Data, phq6Scores }));
      }

      // ir buscar sintomas associados

      const symptomsRes = await fetch(`http://localhost:5001/api/associated-symptoms/${identifier}`);
      let symptomsData = [];
      if (symptomsRes.ok) {
        symptomsData = await symptomsRes.json();
      }
      setAssociatedSymptoms(symptomsData);

      const symptomFrequency = {};
      symptomsData.forEach(item => {
        const nome = (item.name || "").trim().toLowerCase();
        // Ignora vazio, só 1 letra, só ponto, só traço, ou frases que contenham "nenhum" ou "nada"
        if (
          nome.length > 1 &&
          !/^[.-]$/.test(nome) &&
          !/^[a-záéíóúâêîôûãõç]$/i.test(nome) && // ignora só uma letra
          !nome.includes("nenhum") &&
          !nome.includes("nada") &&
          !nome.includes("sem sintomas associados")

        ) {
          symptomFrequency[nome] = (symptomFrequency[nome] || 0) + 1;
        }
      });
      const symptomFrequencyData = Object.entries(symptomFrequency).sort((a, b) => b[1] - a[1]);
      setSymptomFrequencyData(symptomFrequencyData);
      
      // Ir buscar os fatores precipitantes e de alívio em paralelo
      const [precipitatingRes, resolvingRes] = await Promise.all([
        fetch(`http://localhost:5001/api/precipitating-factors/${identifier}`),
        fetch(`http://localhost:5001/api/resolving-factors/${identifier}`)
      ]);

      let topPrecipitating = [];
      if (precipitatingRes.ok) {
        const precipitatingData = await precipitatingRes.json();
        const precipitatingCounts = precipitatingData.reduce((acc, factor) => {
          acc[factor.factor] = (acc[factor.factor] || 0) + 1;
          return acc;
        }, {});
        topPrecipitating = Object.entries(precipitatingCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3);
        setTopPrecipitatingFactors(topPrecipitating);
      }

      let topResolving = [];
      if (resolvingRes.ok) {
        const resolvingData = await resolvingRes.json();
        const resolvingCounts = resolvingData.reduce((acc, factor) => {
          acc[factor.factor] = (acc[factor.factor] || 0) + 1;
          return acc;
        }, {});
        topResolving = Object.entries(resolvingCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3);
        setTopResolvingFactors(topResolving);
      }

      // Gerar sugestões com os dados obtidos
      const reliefSuggestions = topResolving.map(([factor]) => `- ${factor}`);
      const avoidSuggestions = topPrecipitating.map(([factor]) => `- ${factor}`);

      setSuggestions({
        relief: reliefSuggestions,
        avoid: avoidSuggestions
      });

    
      const phq9ResTodos = await fetch(`http://localhost:5001/api/phq9/${identifier}`);
      if (phq9Res.ok) {
        const phq9Data = await phq9ResTodos.json();
        phq9Data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        const phq6Scores = phq9Data.map(entry => ({
          date: entry.created_at,
          score: calcularPHQ6Score(entry)
        }));
        setAdditionalData((prev) => ({ ...prev, phq9: phq9Data, phq6Scores }));
      }
      
    } catch (err) {
      console.error("Erro na requisição:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (identifier) {
      fetchData();
    } else {
      navigate("/");
    }
  }, [identifier, navigate]);
  

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("pt-PT");
  };

  const handleLogout = () => {
    localStorage.removeItem("n_utente");
    localStorage.removeItem("patient_name");
    navigate("/");
  };

  const openPainModal = () => setIsPainModalOpen(true);
  const closePainModal = () => {setIsPainModalOpen(false);};
  const openMedicationModal = () => setIsMedicationModalOpen(true);
  const closeMedicationModal = () => {setIsMedicationModalOpen(false);};

  const openNotificationModal = () => {setIsNotificationModalOpen(true);};

  const closeNotificationModal = () => {setIsNotificationModalOpen(false);};

  const handlePainSubmit = () => {
    closePainModal();
    fetchData();
  };

  const handleMedicationSubmit = () => {
    closeMedicationModal();
    fetchData();
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
          activeTab="history"
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

              <div style={{
                margin: "0 0 32px 0",
                paddingLeft: 8,
                paddingTop: 8,
              }}>
                <span style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 400,
                  fontSize: 22,
                  color: "#222",
                  letterSpacing: 0.2,
                  opacity: 0.92,
                  lineHeight: 1.3,
                  display: "block"
                }}>
                  {nome ? `Olá, ${nome}.` : "Olá."}
                </span>
                <span style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 300,
                  fontSize: 18,
                  color: "#34495e",
                  letterSpacing: 0.1,
                  opacity: 0.85,
                  marginTop: 4,
                  display: "block"
                }}>
                  Como está a sentir-se hoje?
                </span>
              </div>

            </div>
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              marginTop: -17 // Sobe ligeiramente o boneco
            }}>
              {(() => {
                const lastPhq =
                  additionalData.phq6Scores && additionalData.phq6Scores.length > 0
                    ? additionalData.phq6Scores[additionalData.phq6Scores.length - 1].score
                    : null;
                if (lastPhq === null || lastPhq === undefined)
                  return <span style={styles.phqText}>Sem PHQ-6</span>;
                return (
                  <>
                    <div style={{ marginBottom: 2 }}>{getPhqIcon(lastPhq)}</div>
                    <span style={styles.phqText}>Último score PHQ-6: {lastPhq}</span>
                  </>
                );
              })()}
            </div>

          </header>



          <div style={styles.content}>
            <div style={styles.topRow}>
              <div style={styles.svgCard}>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: "#1976d2",
                    textAlign: "center",
                    marginTop: 13,
                    fontFamily: "Poppins, sans-serif",
                    padding: "8px 16px",
                    borderRadius: "12px",
                  }}
                >
                  Última zona de dor registada
                </h3>
                <div style={styles.svgContainer}>
                  <BodyZoneSVG
                    lastZone={lastZone}
                    width="80"
                    height="80"
                    className="svg-with-shadow"
                  />
                </div>
              </div>

              <div style={styles.calendarCard}>
                <Calendar
                  tileClassName={({ date, view }) => {
                    if (view === "month") {
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, "0");
                      const day = String(date.getDate()).padStart(2, "0");
                      const dateStr = `${year}-${month}-${day}`;
                      return painDates.includes(dateStr) ? "pain-day" : null;
                    }
                  }}
                  locale="pt-PT"
                  calendarType="iso8601"
                  formatShortWeekday={(_, date) => {
                    const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
                    return dias[date.getDay()];
                  }}
                  className="full-width-calendar"
                />
              </div>
            </div>

            <div style={styles.tablesRow}>
              <div style={styles.card}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <h3 style={styles.cardTitle}>Registo de Dores</h3>
                  <button
                    onClick={() => navigate("/pain-history")}
                    style={styles.viewAllButton}
                    className="view-all-button"
                  >
                    Ver Todos
                  </button>
                </div>
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.headerTitle}>Data</th>
                        <th style={styles.headerTitle}>Sintoma</th>
                        <th style={styles.headerTitle}>Descrição</th>
                      </tr>
                    </thead>
                    <tbody>
                      {painHistory.length > 0 ? (
                        [...new Map(painHistory.map((item) => [item.id, item])).values()]
                          .slice(0, 3)
                          .map((item, index) => (
                            <tr
                              key={item.id}
                              style={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}
                            >
                              <td style={styles.tableCell}>{formatDate(item.created_at)}</td>
                              <td style={styles.tableCell}>{item.name || "N/A"}</td>
                              <td style={styles.tableCell}>{item.description || "N/A"}</td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td colSpan="3" style={styles.tableCell}>
                            Nenhum registo de dor encontrado
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={styles.card}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <h3 style={styles.cardTitle}>Registo de Medicamentos</h3>
                  <button
                    onClick={() => navigate("/medication-history")}
                    style={styles.viewAllButton}
                    className="view-all-button"
                  >
                    Ver Todos
                  </button>
                </div>
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.headerTitle}>Data</th>
                        <th style={styles.headerTitle}>Medicamento</th>
                        <th style={styles.headerTitle}>Dose</th>
                        <th style={styles.headerTitle}>Duração</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medicationHistory.length > 0 ? (
                        medicationHistory.slice(0, 3).map((item, index) => (
                          <tr
                            key={index}
                            style={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}
                          >
                            <td style={styles.tableCell}>{formatDate(item.created_at)}</td>
                            <td style={styles.tableCell}>{item.nome_medicamento || "N/A"}</td>
                            <td style={styles.tableCell}>{item.dose || "N/A"}</td>
                            <td style={styles.tableCell}>
                              {item.duracao_administracao || "N/A"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" style={styles.tableCell}>
                            Nenhum registo de medicação encontrado
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Gráficos e Sugestões */}
          <div style={styles.chartsRow}>
            <div style={styles.chartCard}>
              {top5Resolving.length > 0 ? (
                <PieChart 
                  data={top5Resolving} 
                  title="Top Fatores de Alívio" 
                  colors= {COLORS_RELIEF}
                />
              ) : (
                <p style={{ textAlign: "center", color: "#34495e" }}>
                  Nenhum fator de alívio registado
                </p>
              )}
            </div>
            <div style={styles.chartCard}>
              {top5Precipitating.length > 0 ? (
                <PieChart 
                  data={top5Precipitating} 
                  title="Top Fatores Precipitantes" 
                  colors= {COLORS_PRECIPITATING}
                />
              ) : (
                <p style={{ textAlign: "center", color: "#34495e" }}>
                  Nenhum fator precipitante registado
                </p>
              )}
            </div>
          </div>

                    
          <div style={styles.suggestionsCard}>
            <h3 style={styles.cardTitle2}>Sugestões</h3>
            {(suggestions.relief?.length > 0 || suggestions.avoid?.length > 0) ? (
              <div style={styles.suggestionColumns}>
                {suggestions.relief?.length > 0 && (
                  <div style={styles.reliefCard}>
                    <h4 style={styles.suggestionSubtitle}>Considere fazer ou usar:</h4>
                    <ul style={styles.suggestionList}>
                      {suggestions.relief.map((item, index) => (
                        <li key={`relief-${index}`} style={styles.suggestionItem}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {suggestions.avoid?.length > 0 && (
                  <div style={styles.avoidCard}>
                    <h4 style={styles.suggestionSubtitle}>Tente evitar:</h4>
                    <ul style={styles.suggestionList}>
                      {suggestions.avoid.map((item, index) => (
                        <li key={`avoid-${index}`} style={styles.suggestionItem}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p style={{ color: "#34495e" }}>Nenhuma sugestão disponível</p>
            )}
          </div>

          </div>



          <div style={styles.phqChartContainer}>
            {additionalData.phq6Scores.length > 0 ? (
              <div style={styles.chartAndRecommendations}>
                <div style={styles.chartWrapper}>
                  <LineChart data={additionalData.phq6Scores} />
                </div>
                <div style={styles.recommendationContainer}>
                  <h4 style={styles.recommendationTitle}>Recomendações para o seu bem-estar</h4>
                  <p style={styles.recommendationText}>
                    O seu score PHQ-6 atual é: <span style={{ fontWeight: 'bold', color: obterRecomendacoes(additionalData.phq6Scores[additionalData.phq6Scores.length - 1].score).color }}>
                      {additionalData.phq6Scores[additionalData.phq6Scores.length - 1].score}
                    </span>
                  </p>
                  <p style={{ ...styles.recommendationText, color: obterRecomendacoes(additionalData.phq6Scores[additionalData.phq6Scores.length - 1].score).color }}>
                    {obterRecomendacoes(additionalData.phq6Scores[additionalData.phq6Scores.length - 1].score).text}
                  </p>
                </div>
              </div>
            ) : (
              <p style={{ textAlign: "center", color: "#34495e" }}>Nenhuma pontuação PHQ-6 registada</p>
            )}
          </div>


          <div style={{ ...styles.card, margin: "40px auto", maxWidth: 600 }}>
            <SymptomsBarChart data={symptomFrequencyData} />
          </div>

          <Modal 
            isOpen={isPainModalOpen} 
            onClose={closePainModal} 
            title="Registar Dor">
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
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f4f8fb",
    borderRadius: 4,
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
  content: {
    padding: "0 32px 32px",
  },
  topRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "50px",
    marginBottom: 32,
    flexWrap: "wrap",
  },
  calendarCard: {
    background: "none",
    borderRadius: 15,
    padding: 16,
    boxShadow: "none",
    border: "none",
    minWidth: 420,
    maxWidth: 500,
    marginLeft: "110px", 
  },
  svgCard: {
    borderRadius: 12,
    padding: 0,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e0e6ed",
    minWidth: 300,
    maxWidth: 300,
    height: 350,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#fff",
    flexDirection: "column",
  },
  svgContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "95%",
    padding: 0,
  },
  tablesRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: 48,
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e0e6ed",
  },
  headerTitle: {
    padding: "12px 16px",
    textAlign: "center",
    background: "#f8fafc",
    color: "#34495e",
    fontWeight: 600,
    border: "none",
    fontSize: 14,
  },
  tableContainer: {
    overflowX: "auto",
    borderRadius: 8,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 14,
  },
  tableCell: {
    padding: "12px 16px",
    textAlign: "center",
    border: "1px solid #e0e6ed",
    color: "#34495e",
  },
  tableRowEven: {
    background: "#fff",
  },
  tableRowOdd: {
    background: "#f3f6f9",
  },
  viewAllButton: {
    background: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    transition: "none",
  },
  phqText: {
    marginLeft: 8,
    fontWeight: 500,
    color: "#34495e",
    fontSize: 14,
  },
  chartsRow: {
    display: "flex",
    justifyContent: "center",
    gap:220,
    marginTop: 32,
    flexWrap: "wrap",
  },
  chartCard: {
    background: "#fff",
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e0e6ed",
    width: "300px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  suggestionsCard: {
    background: "#fff",
   borderRadius: 12,
    padding: 24,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e0e6ed",
    marginTop: 48,
  },
    cardTitle2: {
    fontSize: 18,
    fontWeight: 600,
    color: "#34495e",
    margin: 0,
    marginBottom: 16,
    fontFamily: "Poppins, sans-serif", // Adicionado para igualar ao PieChart
    letterSpacing: 0.2, // Opcional, para ficar igual ao PieChart
    textAlign: "center", // Centraliza o título
    paddingBottom: 8, // Espaço abaixo do título
  },


  phqChartContainer: {
    background: "#fff",
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e0e6ed",
    marginTop: 32,
    width: "100%",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: "#34495e",
    margin: 0,
    marginBottom: 16,
  },
  chartAndRecommendations: {
    display: "flex",
    flexDirection: "row",
    gap: 40,
    alignItems: "flex-start",
    "@media (max-width: 768px)": {
      flexDirection: "column", // Empilha em telas pequenas
    },
  },
  chartWrapper: {
    flex: 1,
    maxWidth: "60%",
    height: "300px", // Garante espaço suficiente para o gráfico
    "@media (max-width: 768px)": {
      maxWidth: "100%", // Gráfico ocupa toda a largura em telas pequenas
      height: "300px", // Altura reduzida para mobile
    },
  },
  recommendationContainer: {
    flex: 1,
    maxWidth: "40%",
    padding: 16,
    background: "#f9f9f9",
    borderRadius: 8,
    border: "1px solid #e0e6ed",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    "@media (max-width: 768px)": {
      maxWidth: "100%", // Recomendações ocupam toda a largura em telas pequenas
    },
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "#34495e",
    margin: 0,
    marginBottom: 12,
  },
  recommendationText: {
    fontSize: 14,
    color: "#34495e",
    lineHeight: 1.5,
    margin: "8px 0",
  },
  suggestionColumns: {
    display: "flex",
    justifyContent: "space-between",
    gap: 24,
    flexWrap: "wrap",
  },
  reliefCard: {
    flex: 1,
    minWidth: 280,
    backgroundColor: "#e9f9ee", // tom esverdeado claro
    border: "1px solid #b6e2c3",
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
  },
  avoidCard: {
    flex: 1,
    minWidth: 280,
    backgroundColor: "#fdecea", // tom avermelhado claro
    border: "1px solid #f5c2c7",
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
  },
  suggestionSubtitle: {
    fontSize: 15,
    margin: "0 0 8px 0",
    fontWeight: 600,
    color: "#34495e",
  },
  suggestionList: {
    fontSize: 14,
    paddingLeft: 20,
    marginTop: 0,
    marginBottom: 0,
  },
  suggestionItem: {
    marginBottom: 6,
    color: "#34495e",
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