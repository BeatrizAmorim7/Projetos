import React from "react";
import { useNavigate } from "react-router-dom";
import FormWrapper from "../components/FormWrapper";
import FormHeader from "../components/FormHeader";
import jdt from "../forms_jdt/jdt_person.json";
import design from "../forms_jdt/style_person.json";

export default function Onboarding() {

  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div>
      <FormHeader title="Registar Novo Utente" />
      <FormWrapper name="Registo" jdt={jdt.jdt} design={design} onCancel={handleCancel}/>
    </div>
  );
}
