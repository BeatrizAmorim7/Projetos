const { v4: uuidv4 } = require("uuid");

const extractTextFromDraftJs = (raw) => {
  try {
    const parsed = JSON.parse(raw);
    return parsed.blocks[0]?.text || null;
  } catch {
    return null;
  }
};


function extractPainData(flatJson, n_utente) {
  return {
    id: uuidv4(),
    n_utente: n_utente,
    name: extractTextFromDraftJs(flatJson["items.0.0.items.0.value"]),
    occurrence: flatJson["items.0.0.items.2.value"]?.text || null,
    progression: flatJson["items.0.0.items.3.value"]?.[0]?.text || null,
    description: extractTextFromDraftJs(flatJson["items.0.0.items.6.value"]),
  };
}

function extractBodySites(flatJson, symptomId) {
  const items = flatJson["items.0.0.items.1.value"] || [];
  if (!Array.isArray(items)) {
    return [];
  }
  return items
    .map((item) => ({
      id: uuidv4(),
      id_symptom: symptomId,
      body_site: extractTextFromDraftJs(item?.value),
    }))
    .filter((bs) => bs.body_site);
}



function extractPrecipitatingFactors(flatJson, symptomId) {
  const items = flatJson["items.0.0.items.4.value"] || [];
  if (!Array.isArray(items)) {
    return [];
  }
  return items
    .map((item) => ({
      id: uuidv4(),
      id_symptom: symptomId,
      factor: extractTextFromDraftJs(item?.values?.["items.0.0.items.4.items.0.value"]),
    }))
    .filter((f) => f.factor);
}

function extractResolvingFactors(flatJson, symptomId) {
  const items = flatJson["items.0.0.items.5.value"] || [];
  // Se items não for um array, tratamos como vazio
  if (!Array.isArray(items)) {
    return [];
  }
  // Mapeamos cada item do array
  return items
    .map((item) => {
      const factorValue = item?.values?.["items.0.0.items.5.items.0.value"];
      return {
        id: uuidv4(),
        id_symptom: symptomId,
        factor: extractTextFromDraftJs(factorValue),
      };
    })
    .filter((f) => f.factor); // Filtra apenas fatores válidos
}


function extractAssociatedSymptoms(flatJson, symptomId) {
  return [{
    id: uuidv4(),
    id_symptom: symptomId,
    name: extractTextFromDraftJs(flatJson["items.0.0.items.7.items.0.value"]),
    description: extractTextFromDraftJs(flatJson["items.0.0.items.7.items.1.value"]),
    occurrence: flatJson["items.0.0.items.7.items.2.value"]?.text || null,
    severity: flatJson["items.0.0.items.7.items.3.value"]?.text || null,
  }].filter((s) => s.name);
}

function extractExaminationFindings(flatJson, symptomId) {
  return {
    id: uuidv4(),
    id_symptom: symptomId,
    system_examined: extractTextFromDraftJs(flatJson["items.0.1.items.0.value"]),
  };
}


function extractMediaFiles(flatJson, examId) {
  return [{
    id: uuidv4(),
    id_exam_findings: examId,
    file_dir: extractTextFromDraftJs(flatJson["items.0.1.items.1.items.0.value"]),
    content_name: extractTextFromDraftJs(flatJson["items.0.1.items.1.items.1.value"]),
  }].filter((f) => f.file_dir || f.content_name);
}

function extractPainAssessment(flatJson, symptomId) {
  return {
    id: uuidv4(),
    id_symptom: symptomId,
    pain_score_category: flatJson["items.0.2.items.0.value"]?.text || null,
    pain_type: flatJson["items.0.2.items.1.value"]?.text || null,
    date: flatJson["items.0.2.items.2.value.date"] || null,
    time: flatJson["items.0.2.items.2.value.time"] || null,
  };
}

function extractPhq9Assessment(flatJson, symptomId) {
  return {
    id: uuidv4(),
    id_symptom: symptomId,
    sleep_issues: flatJson["items.0.3.items.0.items.0.value"]?.text || null,
    tiredness: flatJson["items.0.3.items.0.items.1.value"]?.text || null,
    appetite: flatJson["items.0.3.items.0.items.2.value"]?.text || null,
    concentration: flatJson["items.0.3.items.0.items.3.value"]?.text || null,
    self_harm_thoughts: flatJson["items.0.3.items.0.items.4.value"]?.text || null,
    life_difficulty: flatJson["items.0.3.items.0.items.5.value"]?.text || null,
    date: flatJson["items.0.3.items.0.items.6.value.date"] || null,
    time: flatJson["items.0.3.items.0.items.6.value.time"] || null,
  };
}

module.exports = {
  extractTextFromDraftJs,
  extractPainData,
  extractBodySites,
  extractPrecipitatingFactors,
  extractResolvingFactors,
  extractAssociatedSymptoms,
  extractExaminationFindings,
  extractMediaFiles,
  extractPainAssessment,
  extractPhq9Assessment,
};

