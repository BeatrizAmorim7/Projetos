function extractPatientData(rawJson) {
    // Função auxiliar para extrair texto de diferentes formatos
    function extractValue(input) {
        if (!input) return '';
        
        // Se for string JSON (Draft.js)
        if (typeof input === 'string' && input.startsWith('{')) {
            try {
                const parsed = JSON.parse(input);
                if (parsed.blocks) {
                    return parsed.blocks.map(b => b.text).join('\n');
                }
                return '';
            } catch {
                return '';
            }
        }
        
        // Se for array com objetos que contêm value
        if (Array.isArray(input) && input[0]?.value) {
            return extractValue(input[0].value);
        }
        
        // Se for objeto com propriedade text (como gender)
        if (typeof input === 'object' && input.text) {
            return input.text;
        }
        
        // Se já for string simples
        if (typeof input === 'string') {
            return input;
        }
        
        return '';
    }

    const data = {
        personalInfo: {},
        address: {},
        contact: {},
        diagnosis: {}
    };

    try {
        const root = typeof rawJson === 'string' ? JSON.parse(rawJson) : rawJson;

        // Informações Pessoais
        data.personalInfo = {
            name: extractValue(root["items.0.0.items.0.value"]),
            identifier: extractValue(root["items.0.0.items.1.value"]),
            gender: extractValue(root["items.0.1.items.0.value"])
        };

        // Endereço
        data.address = {
            addressLine: extractValue(root["items.0.0.items.2.items.0.value"]),
            city: extractValue(root["items.0.0.items.2.items.1.value"]),
            district: extractValue(root["items.0.0.items.2.items.2.value"]),
            postalCode: extractValue(root["items.0.0.items.2.items.3.value"]),
            country: extractValue(root["items.0.0.items.2.items.4.value"])
        };

        // Contato
        data.contact = {
            communicationType: extractValue(root["items.0.0.items.3.items.0.value"]),
            communicationValue: extractValue(root["items.0.0.items.3.items.1.value"])
        };

        // Diagnóstico
        data.diagnosis = {
            name: extractValue(root["items.0.2.items.0.value"]),
            onsetDate: root["items.0.2.items.1.value.date"] || '',
            onsetTime: root["items.0.2.items.1.value.time"] || '',
            severity: extractValue(root["items.0.2.items.2.value"]),
            severityDescription: root["items.0.2.items.2.value"]?.description || '',
            severityDetails: extractValue(root["items.0.2.items.3.value"]),
            resolutionDate: root["items.0.2.items.4.value.date"] || '',
            resolutionTime: root["items.0.2.items.4.value.time"] || ''
        };

    } catch (err) {
        console.error("Erro ao processar o JSON:", err);
        return null;
    }

    return data;
}


module.exports = { extractPatientData };