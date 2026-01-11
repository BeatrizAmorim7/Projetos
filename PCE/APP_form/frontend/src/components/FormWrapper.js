import { Form } from "protected-aidaforms";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

const FormWrapper = ({ name, jdt, design, onSubmit, onCancel }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(""); // Novo estado para erro

  const saveComposition = async (values) => {
    let n_utente = localStorage.getItem("n_utente");

    let endpoint = "compositions"; // padrão
    let composition_type = "pessoa"; // padrão

    // Determinar rota conforme o tipo de formulário
    if (name.toLowerCase().includes("med")){
      endpoint = "composition_med";
      composition_type = "med";
    } else if (name.toLowerCase().includes("dor")) {
      endpoint = "composition_dor";
      composition_type = "dor";
    }

    try {
      setError(""); // Limpa erro anterior
      const response = await fetch(`http://localhost:5001/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          n_utente,
          composition: values ,
          composition_type
        }),
      });
      // if (!response.ok) throw new Error("Erro ao guardar");
      if (!response.ok) {
        const result = await response.json();
        if (result.error && result.error.includes("Utente já existe")) {
          setError("Já existe um utente com esse identificador.");
          alert("Já existe um utente com esse identificador.");
          return;
        }
        throw new Error(result.error || "Erro ao guardar");
      }

      const result = await response.json();
      
      console.log("Guardado com sucesso:", result);
      console.log("n_utente:", n_utente);
      
      if (onSubmit) onSubmit(); // chama o onSubmit do PainForm/Modal
      
      if (composition_type === "pessoa") { // nos outros casos, o modal fecha sozinho e não é preciso redirecionar
        n_utente = result.n_utente; // Atualiza n_utente se retornado (só retorna quando é person)
        localStorage.setItem("n_utente", n_utente); // Guarda o n_utente atualizado
        navigate("/dashboard", { state: { success: true } });
      }

    } catch (err) {
      setError(err.message || "Erro ao submeter composição");
      console.error("Erro ao submeter composição:", err);
      alert(err.message || "Erro ao submeter composição");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      {error && (
        <div style={{ color: "red", marginBottom: 10 }}>
          {error}
        </div>
      )}
      <Form
        key={name}
        template={jdt}
        formDesign={JSON.stringify(design)}
        showPrint={false}
        editMode={true}
        submitButtonDisabled={false}
        canSubmit={true}
        onSubmit={(values) => saveComposition(values)}
        saveButtonDisabled={false}
        canSave={false}
        canCancel={true}
        onCancel={() => onCancel()}
        dlm={{}}
        professionalTasks={["Registar Pedido", "Consultar Pedido", "Anular Pedido"]}
      />
    </div>
  );
};
export default FormWrapper;