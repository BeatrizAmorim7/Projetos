import React from "react";
import FormWrapper from "../components/FormWrapper";
import jdt from "../forms_jdt/jdt_pain_2.json";
import design from "../forms_jdt/style_pain_2.json";

export default function PainForm({ onSubmit, onCancel }) {
  return (
    <div>
      <FormWrapper name="Dor" jdt={jdt} design={design} onSubmit={onSubmit} onCancel={onCancel}/>
    </div>
  );
}
