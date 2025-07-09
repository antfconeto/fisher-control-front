"use client";
import React, { useState, useEffect, Suspense } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  ProgressBar,
  Alert,
} from "react-bootstrap";
import {
  FaArrowLeft,
  FaSave,
  FaFish,
  FaThermometerHalf,
  FaFlask,
  FaEgg,
} from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./new.module.css";

const steps = [
  { id: 0, title: "Dados Básicos", icon: FaFish },
  { id: 1, title: "Reprodutores", icon: FaFish },
  { id: 2, title: "Protocolo Hormonal", icon: FaFlask },
  { id: 3, title: "Condições Ambientais", icon: FaThermometerHalf },
  { id: 4, title: "Fertilização e Incubação", icon: FaEgg },
];

const initialForm = {
  // Dados Básicos
  specie: "",
  tank: "",
  inductionDate: "",
  inductionType: "induzida",

  // Reprodutores
  breedersM: "",
  breedersF: "",
  breedersIds: "",
  avgWeight: "",

  // Protocolo Hormonal
  hormone: "",
  dose: "",
  doses: "",
  interval: "",
  protocolNotes: "",

  // Condições Ambientais
  temp: "",
  ph: "",
  oxygen: "",
  photoperiod: "",

  // Fertilização e Incubação
  eggs: "",
  semen: "",
  fertilizationRate: "",
  incubator: "",
  incubationTime: "",
  hatchingRate: "",
  incubationNotes: "",
};

function NewSpawningForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dados mockados
  const species = [
    "Tilápia",
    "Tambaqui",
    "Pacu",
    "Pirarucu",
    "Matrinxã",
    "Pintado",
  ];
  const tanks = [
    "Tanque A1",
    "Tanque A2",
    "Tanque B1",
    "Tanque B2",
    "Tanque C1",
  ];
  const hormones = ["HCG", "LHRH-a", "Ovaprim", "Natural"];

  useEffect(() => {
    const specieParam = searchParams.get("specie");
    if (specieParam) {
      setForm((prev) => ({ ...prev, specie: specieParam }));
    }
  }, [searchParams]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Limpar erro do campo quando usuário começa a digitar
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Dados Básicos
        if (!form.specie) newErrors.specie = "Espécie é obrigatória";
        if (!form.tank) newErrors.tank = "Tanque é obrigatório";
        if (!form.inductionDate)
          newErrors.inductionDate = "Data de indução é obrigatória";
        break;

      case 1: // Reprodutores
        if (!form.breedersM || parseInt(form.breedersM) <= 0)
          newErrors.breedersM = "Quantidade de machos deve ser maior que 0";
        if (!form.breedersF || parseInt(form.breedersF) <= 0)
          newErrors.breedersF = "Quantidade de fêmeas deve ser maior que 0";
        break;

      case 2: // Protocolo Hormonal
        if (form.inductionType === "induzida") {
          if (!form.hormone) newErrors.hormone = "Hormônio é obrigatório";
          if (!form.dose) newErrors.dose = "Dose é obrigatória";
        }
        break;

      case 3: // Condições Ambientais
        if (!form.temp) newErrors.temp = "Temperatura é obrigatória";
        if (!form.ph) newErrors.ph = "pH é obrigatório";
        break;

      case 4: // Fertilização e Incubação
        if (!form.eggs) newErrors.eggs = "Quantidade de óvulos é obrigatória";
        if (!form.fertilizationRate)
          newErrors.fertilizationRate = "Taxa de fertilização é obrigatória";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setLoading(true);

    // Simular envio
    setTimeout(() => {
      setLoading(false);
      alert("Desova registrada com sucesso!");
      router.push("/dashboard/spawining");
    }, 2000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Espécie *</Form.Label>
                <Form.Select
                  name="specie"
                  value={form.specie}
                  onChange={handleChange}
                  isInvalid={!!errors.specie}
                  className={styles.formSelect}
                >
                  <option value="">Selecione uma espécie</option>
                  {species.map((specie) => (
                    <option key={specie} value={specie}>
                      {specie}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.specie}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tanque *</Form.Label>
                <Form.Select
                  name="tank"
                  value={form.tank}
                  onChange={handleChange}
                  isInvalid={!!errors.tank}
                  className={styles.formSelect}
                >
                  <option value="">Selecione um tanque</option>
                  {tanks.map((tank) => (
                    <option key={tank} value={tank}>
                      {tank}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.tank}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Data de Indução *</Form.Label>
                <Form.Control
                  type="date"
                  name="inductionDate"
                  value={form.inductionDate}
                  onChange={handleChange}
                  isInvalid={!!errors.inductionDate}
                  className={styles.formInput}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.inductionDate}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tipo de Indução</Form.Label>
                <Form.Select
                  name="inductionType"
                  value={form.inductionType}
                  onChange={handleChange}
                  className={styles.formSelect}
                >
                  <option value="induzida">Induzida</option>
                  <option value="natural">Natural</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        );

      case 1:
        return (
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Quantidade de Machos *</Form.Label>
                <Form.Control
                  type="number"
                  name="breedersM"
                  value={form.breedersM}
                  onChange={handleChange}
                  placeholder="Ex: 5"
                  isInvalid={!!errors.breedersM}
                  className={styles.formInput}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.breedersM}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Quantidade de Fêmeas *</Form.Label>
                <Form.Control
                  type="number"
                  name="breedersF"
                  value={form.breedersF}
                  onChange={handleChange}
                  placeholder="Ex: 8"
                  isInvalid={!!errors.breedersF}
                  className={styles.formInput}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.breedersF}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>IDs dos Reprodutores</Form.Label>
                <Form.Control
                  type="text"
                  name="breedersIds"
                  value={form.breedersIds}
                  onChange={handleChange}
                  placeholder="Ex: T001, T002, T003..."
                  className={styles.formInput}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Peso Médio (g)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  name="avgWeight"
                  value={form.avgWeight}
                  onChange={handleChange}
                  placeholder="Ex: 250.5"
                  className={styles.formInput}
                />
              </Form.Group>
            </Col>
          </Row>
        );

      case 2:
        return (
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Hormônio *</Form.Label>
                <Form.Select
                  name="hormone"
                  value={form.hormone}
                  onChange={handleChange}
                  isInvalid={!!errors.hormone}
                  className={styles.formSelect}
                  disabled={form.inductionType === "natural"}
                >
                  <option value="">Selecione um hormônio</option>
                  {hormones.map((hormone) => (
                    <option key={hormone} value={hormone}>
                      {hormone}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.hormone}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Dose (mg/kg) *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="dose"
                  value={form.dose}
                  onChange={handleChange}
                  placeholder="Ex: 0.5"
                  isInvalid={!!errors.dose}
                  className={styles.formInput}
                  disabled={form.inductionType === "natural"}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.dose}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Número de Doses</Form.Label>
                <Form.Control
                  type="number"
                  name="doses"
                  value={form.doses}
                  onChange={handleChange}
                  placeholder="Ex: 2"
                  className={styles.formInput}
                  disabled={form.inductionType === "natural"}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Intervalo entre Doses (h)</Form.Label>
                <Form.Control
                  type="number"
                  name="interval"
                  value={form.interval}
                  onChange={handleChange}
                  placeholder="Ex: 12"
                  className={styles.formInput}
                  disabled={form.inductionType === "natural"}
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Observações do Protocolo</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="protocolNotes"
                  value={form.protocolNotes}
                  onChange={handleChange}
                  placeholder="Observações sobre o protocolo hormonal..."
                  className={styles.formTextarea}
                />
              </Form.Group>
            </Col>
          </Row>
        );

      case 3:
        return (
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Temperatura da Água (°C) *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  name="temp"
                  value={form.temp}
                  onChange={handleChange}
                  placeholder="Ex: 28.5"
                  isInvalid={!!errors.temp}
                  className={styles.formInput}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.temp}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>pH da Água *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  name="ph"
                  value={form.ph}
                  onChange={handleChange}
                  placeholder="Ex: 7.2"
                  isInvalid={!!errors.ph}
                  className={styles.formInput}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.ph}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Oxigênio Dissolvido (mg/L)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  name="oxygen"
                  value={form.oxygen}
                  onChange={handleChange}
                  placeholder="Ex: 6.5"
                  className={styles.formInput}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Fotoperíodo (horas)</Form.Label>
                <Form.Control
                  type="number"
                  name="photoperiod"
                  value={form.photoperiod}
                  onChange={handleChange}
                  placeholder="Ex: 12"
                  className={styles.formInput}
                />
              </Form.Group>
            </Col>
          </Row>
        );

      case 4:
        return (
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Quantidade de Óvulos Coletados *</Form.Label>
                <Form.Control
                  type="number"
                  name="eggs"
                  value={form.eggs}
                  onChange={handleChange}
                  placeholder="Ex: 45000"
                  isInvalid={!!errors.eggs}
                  className={styles.formInput}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.eggs}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Volume de Sêmen (mL)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  name="semen"
                  value={form.semen}
                  onChange={handleChange}
                  placeholder="Ex: 2.5"
                  className={styles.formInput}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Taxa de Fertilização (%) *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  name="fertilizationRate"
                  value={form.fertilizationRate}
                  onChange={handleChange}
                  placeholder="Ex: 85.5"
                  isInvalid={!!errors.fertilizationRate}
                  className={styles.formInput}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.fertilizationRate}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Incubadora</Form.Label>
                <Form.Control
                  type="text"
                  name="incubator"
                  value={form.incubator}
                  onChange={handleChange}
                  placeholder="Ex: Incubadora Zuga"
                  className={styles.formInput}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tempo de Incubação (horas)</Form.Label>
                <Form.Control
                  type="number"
                  name="incubationTime"
                  value={form.incubationTime}
                  onChange={handleChange}
                  placeholder="Ex: 72"
                  className={styles.formInput}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Taxa de Eclosão (%)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  name="hatchingRate"
                  value={form.hatchingRate}
                  onChange={handleChange}
                  placeholder="Ex: 90.0"
                  className={styles.formInput}
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Observações da Incubação</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="incubationNotes"
                  value={form.incubationNotes}
                  onChange={handleChange}
                  placeholder="Observações sobre a fertilização e incubação..."
                  className={styles.formTextarea}
                />
              </Form.Group>
            </Col>
          </Row>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.title}>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => router.back()}
            className={styles.backButton}
          >
            <FaArrowLeft /> Voltar
          </Button>
          <h1 className={styles.pageTitle}>
            <FaEgg className={styles.pageTitleIcon} /> Nova Desova
          </h1>
        </div>
      </div>

      {/* Progress Bar */}
      <Card className={`${styles.progressCard} mb-4`}>
        <Card.Body>
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className={styles.progressText}>
                Etapa {currentStep + 1} de {steps.length}
              </span>
              <span className={styles.progressText}>
                {Math.round(((currentStep + 1) / steps.length) * 100)}%
              </span>
            </div>
            <ProgressBar
              now={((currentStep + 1) / steps.length) * 100}
              variant="primary"
              className={styles.progressBar}
            />
          </div>

          <div className={styles.stepsContainer}>
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`${styles.stepItem} ${
                  index <= currentStep ? styles.activeStep : styles.inactiveStep
                }`}
              >
                <div className={styles.stepIcon}>
                  <step.icon />
                </div>
                <small className={styles.stepTitle}>{step.title}</small>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Form Content */}
      <Card className={styles.formCard}>
        <Card.Header className={styles.formHeader}>
          <h4 className={styles.formTitle}>
            {React.createElement(steps[currentStep].icon, {
              className: styles.formTitleIcon,
            })}
            {steps[currentStep].title}
          </h4>
        </Card.Header>
        <Card.Body className={styles.formBody}>{renderStepContent()}</Card.Body>
      </Card>

      {/* Navigation Buttons */}
      <div className={styles.navigationContainer}>
        <Button
          variant="outline-secondary"
          onClick={prevStep}
          disabled={currentStep === 0}
          className={styles.navButton}
        >
          Anterior
        </Button>

        <div>
          {currentStep < steps.length - 1 ? (
            <Button
              variant="primary"
              onClick={nextStep}
              className={styles.nextButton}
            >
              Próximo
            </Button>
          ) : (
            <Button
              variant="success"
              onClick={handleSubmit}
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2" />
                  Salvando...
                </>
              ) : (
                <>
                  <FaSave className="me-2" />
                  Finalizar Desova
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Error Summary */}
      {Object.keys(errors).length > 0 && (
        <Alert variant="danger" className={styles.errorAlert}>
          <strong>Por favor, corrija os seguintes erros:</strong>
          <ul className="mb-0 mt-2">
            {Object.values(errors).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}
    </div>
  );
}

export default function NewSpawningPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <NewSpawningForm />
    </Suspense>
  );
}
