import React, { useState } from "react";

const initialForm = {
  specie: "",
  tank: "",
  inductionDate: "",
  inductionType: "",
  breedersM: 0,
  breedersF: 0,
  breedersIds: "",
  avgWeight: "",
  hormone: "",
  dose: "",
  doses: "",
  interval: "",
  protocolNotes: "",
  temp: "",
  ph: "",
  oxygen: "",
  photoperiod: "",
  eggs: "",
  semen: "",
  fertilizationRate: "",
  incubator: "",
  incubationTime: "",
  hatchingRate: "",
  incubationNotes: "",
};

const steps = [
  "Dados Básicos",
  "Reprodutores",
  "Protocolo Hormonal",
  "Condições Ambientais",
  "Fertilização e Incubação",
];

interface NewSpawningFormProps {
  initialValues?: typeof initialForm;
  onSubmit?: (values: typeof initialForm) => void;
  mode?: "create" | "edit";
}

export default function NewSpawningForm({
  initialValues,
  onSubmit,
  mode = "create",
}: NewSpawningFormProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialValues || initialForm);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 8px #0001",
        padding: 32,
        maxWidth: 600,
        margin: "0 auto",
      }}
    >
      <h2>{mode === "edit" ? "Editar Desova" : "Nova Desova"}</h2>
      <div style={{ marginBottom: 16 }}>
        <b>
          Etapa {step + 1} de {steps.length}:
        </b>{" "}
        {steps[step]}
      </div>
      {step === 0 && (
        <>
          <label>
            Espécie:{" "}
            <input name="specie" value={form.specie} onChange={handleChange} />
          </label>
          <br />
          <label>
            Tanque:{" "}
            <input name="tank" value={form.tank} onChange={handleChange} />
          </label>
          <br />
          <label>
            Data/hora indução:{" "}
            <input
              name="inductionDate"
              type="datetime-local"
              value={form.inductionDate}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Tipo de desova:{" "}
            <input
              name="inductionType"
              value={form.inductionType}
              onChange={handleChange}
            />
          </label>
          <br />
        </>
      )}
      {step === 1 && (
        <>
          <label>
            Machos:{" "}
            <input
              name="breedersM"
              type="number"
              value={form.breedersM}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Fêmeas:{" "}
            <input
              name="breedersF"
              type="number"
              value={form.breedersF}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            IDs dos peixes:{" "}
            <input
              name="breedersIds"
              value={form.breedersIds}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Peso médio:{" "}
            <input
              name="avgWeight"
              value={form.avgWeight}
              onChange={handleChange}
            />
          </label>
          <br />
        </>
      )}
      {step === 2 && (
        <>
          <label>
            Hormônio:{" "}
            <input
              name="hormone"
              value={form.hormone}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Dose (mg/kg):{" "}
            <input name="dose" value={form.dose} onChange={handleChange} />
          </label>
          <br />
          <label>
            Nº de doses:{" "}
            <input name="doses" value={form.doses} onChange={handleChange} />
          </label>
          <br />
          <label>
            Intervalo entre doses:{" "}
            <input
              name="interval"
              value={form.interval}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Observações:{" "}
            <input
              name="protocolNotes"
              value={form.protocolNotes}
              onChange={handleChange}
            />
          </label>
          <br />
        </>
      )}
      {step === 3 && (
        <>
          <label>
            Temperatura:{" "}
            <input name="temp" value={form.temp} onChange={handleChange} />
          </label>
          <br />
          <label>
            pH: <input name="ph" value={form.ph} onChange={handleChange} />
          </label>
          <br />
          <label>
            Oxigênio:{" "}
            <input name="oxygen" value={form.oxygen} onChange={handleChange} />
          </label>
          <br />
          <label>
            Fotoperíodo:{" "}
            <input
              name="photoperiod"
              value={form.photoperiod}
              onChange={handleChange}
            />
          </label>
          <br />
        </>
      )}
      {step === 4 && (
        <>
          <label>
            Óvulos coletados:{" "}
            <input name="eggs" value={form.eggs} onChange={handleChange} />
          </label>
          <br />
          <label>
            Volume de sêmen:{" "}
            <input name="semen" value={form.semen} onChange={handleChange} />
          </label>
          <br />
          <label>
            Tipo de incubadora:{" "}
            <input
              name="incubator"
              value={form.incubator}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Tempo de incubação:{" "}
            <input
              name="incubationTime"
              value={form.incubationTime}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Observações:{" "}
            <input
              name="incubationNotes"
              value={form.incubationNotes}
              onChange={handleChange}
            />
          </label>
          <br />
        </>
      )}
      <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
        <button onClick={prev} disabled={step === 0}>
          Voltar
        </button>
        {step < steps.length - 1 ? (
          <button onClick={next}>Próxima</button>
        ) : (
          <button
            onClick={() => {
              if (onSubmit) onSubmit(form);
              else
                alert(
                  mode === "edit"
                    ? "Desova editada (mock)!"
                    : "Desova cadastrada (mock)!"
                );
            }}
          >
            {mode === "edit" ? "Salvar" : "Finalizar"}
          </button>
        )}
      </div>
    </div>
  );
}
