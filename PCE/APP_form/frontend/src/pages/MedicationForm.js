import React from "react";
import FormWrapper from "../components/FormWrapper";
import jdt from "../forms_jdt/jdt_dosagenew.json";
import design from "../forms_jdt/style_dosagenew.json";

export default function MedicationForm({ onSubmit, onCancel }) {
  return (
    <div>
      <FormWrapper name="Medicação" jdt={jdt.jdt} design={design} onSubmit={onSubmit} onCancel={onCancel}/>
    </div>
  );
}

