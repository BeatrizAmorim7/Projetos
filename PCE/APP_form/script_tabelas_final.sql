-------------------- TABELAS UTENTE --------------------

-- Criar tabela para informações pessoais
CREATE TABLE IF NOT EXISTS personal_info (
    n_utente VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255),
    gender VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela para endereço
CREATE TABLE IF NOT EXISTS address (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    n_utente VARCHAR(50) NOT NULL,
    address_line VARCHAR(255),
    city VARCHAR(100),
    district VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (n_utente) REFERENCES personal_info(n_utente) ON DELETE CASCADE
);

-- Criar tabela para informações de contacto
CREATE TABLE IF NOT EXISTS contact (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    n_utente VARCHAR(50) NOT NULL,
    communication_type VARCHAR(50),
    communication_value VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (n_utente) REFERENCES personal_info(n_utente) ON DELETE CASCADE
);

-- Criar tabela para diagnóstico
CREATE TABLE IF NOT EXISTS diagnosis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    n_utente VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    onset_date DATE,
    onset_time TIME,
    severity VARCHAR(50),
    severity_description TEXT,
    severity_details TEXT,
    resolution_date DATE,
    resolution_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (n_utente) REFERENCES personal_info(n_utente) ON DELETE CASCADE
);

-- Criar tabela para composições EHR
CREATE TABLE IF NOT EXISTS composition (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    n_utente VARCHAR(50) NOT NULL,
    composition JSONB NOT NULL,
    composition_type VARCHAR(20) NOT NULL DEFAULT 'personal',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (n_utente) REFERENCES personal_info(n_utente) ON DELETE CASCADE
);


-------------------- TABELA MEDICAÇÃO --------------------

CREATE TABLE patient_medication (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  n_utente VARCHAR(50) NOT NULL,
  nome_medicamento TEXT NOT NULL,
  dose TEXT,                        
  duracao_administracao TEXT,                  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (n_utente) REFERENCES personal_info(n_utente) ON DELETE CASCADE
);

-------------------- TABELAS DOR --------------------

-- Tabela pain_symptom
CREATE TABLE pain_symptom (
    id UUID PRIMARY KEY,
    n_utente VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    occurrence VARCHAR(255),
    progression VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (n_utente) REFERENCES personal_info(n_utente) ON DELETE CASCADE
);

-- Tabela body_sites
CREATE TABLE body_sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_symptom UUID NOT NULL,
    body_site TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_symptom) REFERENCES pain_symptom(id) ON DELETE CASCADE
);

-- Tabela precipitating_factor
CREATE TABLE precipitating_factor (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_symptom UUID NOT NULL,
    factor VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_symptom) REFERENCES pain_symptom(id) ON DELETE CASCADE
);

-- Tabela resolving_factor
CREATE TABLE resolving_factor (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_symptom UUID NOT NULL,
    factor VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_symptom) REFERENCES pain_symptom(id) ON DELETE CASCADE
);

-- Tabela associated_symptom
CREATE TABLE associated_symptom (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_symptom UUID NOT NULL,
    name VARCHAR(255),
    description TEXT,
    occurrence VARCHAR(255),
    severity VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_symptom) REFERENCES pain_symptom(id) ON DELETE CASCADE
);

-- Tabela examination_findings
CREATE TABLE examination_findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_symptom UUID NOT NULL,
    system_examined VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_symptom) REFERENCES pain_symptom(id) ON DELETE CASCADE
);

-- Tabela media_files
CREATE TABLE media_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_exam_findings UUID NOT NULL,
    file_dir VARCHAR(255),
    content_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_exam_findings) REFERENCES examination_findings(id) ON DELETE CASCADE
);

-- Tabela abbey_pain_scale
CREATE TABLE abbey_pain_scale (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_symptom UUID NOT NULL,
    pain_score_category VARCHAR(255),
    pain_type VARCHAR(255),
    date DATE,
    time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_symptom) REFERENCES pain_symptom(id) ON DELETE CASCADE
);

-- Tabela phq9
CREATE TABLE phq9 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_symptom UUID NOT NULL,
    sleep_issues VARCHAR(255),
    tiredness VARCHAR(255),
    appetite VARCHAR(255),
    concentration VARCHAR(255),
    self_harm_thoughts VARCHAR(255),
    life_difficulty VARCHAR(255),
    date DATE,
    time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_symptom) REFERENCES pain_symptom(id) ON DELETE CASCADE
);


--------------------- TABELA NOTIFICAÇÕES ---------------------
CREATE TABLE push_preferences (
  n_utente VARCHAR(50) PRIMARY KEY,
  notification_hour INTEGER CHECK (notification_hour >= 0 AND notification_hour <= 23),
  subscription JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (n_utente) REFERENCES personal_info(n_utente) ON DELETE CASCADE
);