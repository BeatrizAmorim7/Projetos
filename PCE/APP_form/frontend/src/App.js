import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Home from "./pages/Home";
import PainHistory from "./pages/PainHistory";
import MedicationHistory from "./pages/MedicationHistory";
import History from "./pages/History";
import ArticlesPage from "./pages/ArticlesPage";

// import NotFound from "./pages/NotFound";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/history" element={<History />} />
      <Route path="/pain-history" element={<PainHistory />} />
      <Route path="/medication-history" element={<MedicationHistory />} />
      <Route path="/articles" element={<ArticlesPage />} />
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  </Router>
);

export default App;

