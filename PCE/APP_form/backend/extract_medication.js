
function extractMedicationData(flatJson) {

    let name = null;
    let dose = null;
    let duration = null;

    // Nome da medicação
    const nameKey = "items.0.0.items.0.value";
    if (typeof flatJson[nameKey] === "string") {
    try {
        const parsed = JSON.parse(flatJson[nameKey]);
        name = parsed.blocks?.[0]?.text || null;
    } catch (err) {
        console.warn("Erro ao fazer parse do nome da medicação:", err);
    }
    }

    // Dose (valor numérico)
    const doseValueKey = "items.0.0.items.1.items.0.value.value";
    if (flatJson[doseValueKey] != null) {
    dose = Number(flatJson[doseValueKey]) || null;
    }

    // Duração (valor)
    const durationKey = "items.0.0.items.1.items.1.value";
    const arr = flatJson[durationKey];
    if (Array.isArray(arr) && arr.length > 0) {
    duration = arr[0].value != null ? String(arr[0].value) : null;
    }

    return { name, dose, duration };
}

module.exports = { extractMedicationData };

