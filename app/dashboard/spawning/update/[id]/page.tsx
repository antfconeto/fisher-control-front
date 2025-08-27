"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./updateSpawn.module.css";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui";
import { useUser } from "@/hooks/userHook";
import { updateSpawnForm, getSpawnFormById } from "@/actions/spawnForm";
import { listAnimals } from "@/actions/animal";
import { SpawningForm, Animal, Monitoring, ResponseError } from "@/types/types";
import { ErrorBox } from "@/components/ErrorBox";
import dayjs from "dayjs";
import { FaPlus, FaTrash, FaArrowLeft } from "react-icons/fa";
import { getUserById } from "@/actions/user";
import { getAnimalByCode } from "@/actions/animal";
import { useNotification } from "@/contexts/notificationContext";

const defaultForm: Omit<SpawningForm, "_id"> = {
  date: new Date(),
  animal_weight: {
    beforeSpawn: 0,
    afterSpawn: 0,
  },
  egg_weight: 0,
  hormone: {
    hour_dosage: "",
    quantity: 0,
  },
  monitoring: [],
  animalId: "",
  user: {
    id: "",
    name: "",
  },
};

// Função para formatar número com até duas casas decimais e vírgula
function formatNumberInput(value: string, maxDecimals: number = 2): string {
  let cleaned = value.replace(/[^\d,\.]/g, "");
  cleaned = cleaned.replace(",", ".");

  const parts = cleaned.split(".");
  if (parts.length > 2) {
    cleaned = parts[0] + "." + parts.slice(1).join("");
  }
  if (parts.length === 2 && parts[1].length > maxDecimals) {
    cleaned = parts[0] + "." + parts[1].substring(0, maxDecimals);
  }
  return cleaned.replace(".", ",");
}

export default function UpdateSpawningPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useUser();
  const [form, setForm] = useState<SpawningForm>({
    ...defaultForm,
    _id: "",
    user: {
      id: user?._id || "",
      name: user?.username || "",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { successNotification, errorNotification } = useNotification();
  const [monitoringTimeError, setMonitoringTimeError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasMonitoringError, setHasMonitoringError] = useState(false);

  // Autocomplete de animal
  const [animalQuery, setAnimalQuery] = useState("");
  const [animalSuggestions, setAnimalSuggestions] = useState<Animal[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Estado para o monitoring
  const [monitoringItems, setMonitoringItems] = useState<Monitoring[]>([
    { hour: "", temperature: 0, hour_degree: 0 }
  ]);

  // Carregar dados do spawning form
  useEffect(() => {
    const loadSpawningForm = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!params.id) {
          setError("ID do spawning form não fornecido");
          return;
        }

        const response = await getSpawnFormById(params.id as string);
        if ("error" in response) {
          setError(response.error);
          return;
        }

        // Carregar dados do usuário
        let userData = null;
        if (response.user && response.user.id) {
          const userResponse = await getUserById(response.user.id);
          if (!("error" in userResponse)) {
            userData = userResponse;
          }
        }

        // Carregar dados do animal
        let animalData = null;
        if (response.animalId) {
          const animalResponse = await getAnimalByCode(response.animalId);
          if (!("error" in animalResponse)) {
            animalData = animalResponse;
            setSelectedAnimal(animalData);
          }
        }

        // Atualizar o formulário com os dados existentes
        setForm({
          _id: response._id,
          date: new Date(response.date),
          animal_weight: response.animal_weight,
          egg_weight: response.egg_weight,
          hormone: response.hormone,
          monitoring: response.monitoring || [],
          animalId: response.animalId,
          user: {
            id: userData?._id || response.user?.id || "",
            name: userData?.username || response.user?.name || "",
          },
        });

        // Atualizar monitoring items
        if (response.monitoring && response.monitoring.length > 0) {
          setMonitoringItems(response.monitoring);
        }

        // Atualizar animal query
        if (animalData) {
          setAnimalQuery(animalData.codeAnimal);
        }

      } catch (error: any) {
        const errMsg = error.message || "Erro ao carregar dados do spawning form";
        errorNotification("Erro!", errMsg);
        setError(errMsg);
      } finally {
        setLoading(false);
      }
    };

    loadSpawningForm();
  }, [params.id]);

  useEffect(() => {
    // Se o campo estiver vazio, buscar todos os animais (até 20)
    if (animalQuery.length === 0) {
      listAnimals(1, 20, {}).then((res) => {
        if (
          res &&
          typeof res === "object" &&
          "animals" in res &&
          Array.isArray(res.animals)
        ) {
          setAnimalSuggestions(res.animals as Animal[]);
        } else {
          setAnimalSuggestions([]);
        }
      });
    } else {
      // Buscar por filtro mesmo com 1 caractere
      listAnimals(1, 10, { codeAnimal: animalQuery }).then((res) => {
        if (
          res &&
          typeof res === "object" &&
          "animals" in res &&
          Array.isArray(res.animals)
        ) {
          setAnimalSuggestions(res.animals as Animal[]);
        } else {
          setAnimalSuggestions([]);
        }
      });
    }
  }, [animalQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Validar horários em tempo real
  useEffect(() => {
    const timeError = validateMonitoringTimes(monitoringItems);
    setMonitoringTimeError(timeError);
    setHasMonitoringError(!!timeError);
  }, [monitoringItems]);

  const validate = () => {
    if (!form.animalId) {
      setError("Selecione um animal");
      return false;
    }
    if (form.animal_weight.beforeSpawn <= 0) {
      setError("Peso antes da desova deve ser maior que 0");
      return false;
    }
    if (form.animal_weight.afterSpawn <= 0) {
      setError("Peso depois da desova deve ser maior que 0");
      return false;
    }
    if (form.animal_weight.afterSpawn >= form.animal_weight.beforeSpawn) {
      setError("Peso depois da desova deve ser menor que o peso antes");
      return false;
    }
    if (form.egg_weight <= 0) {
      setError("Peso dos ovos deve ser maior que 0");
      return false;
    }
    if (!form.hormone.hour_dosage) {
      setError("Hora da dosagem do hormônio é obrigatória");
      return false;
    }
    if (form.hormone.quantity <= 0) {
      setError("Quantidade do hormônio deve ser maior que 0");
      return false;
    }

    // Validar monitoring times
    const timeError = validateMonitoringTimes(monitoringItems);
    if (timeError) {
      setMonitoringTimeError(timeError);
      return false;
    }

    return true;
  };

  const validateMonitoringTimes = (items?: Monitoring[]): string | null => {
    const itemsToValidate = items || monitoringItems;
    const validItems = itemsToValidate.filter(item => item.hour && item.temperature > 0);
    
    if (validItems.length < 2) return null;
    
    // Verificar horários duplicados
    const times = validItems.map(item => item.hour);
    const uniqueTimes = new Set(times);
    if (times.length !== uniqueTimes.size) {
      return "Erro: Existem horários duplicados. Cada horário deve ser único.";
    }
    
    for (let i = 1; i < validItems.length; i++) {
      const currentTime = validItems[i].hour;
      const previousTime = validItems[i - 1].hour;
      
      if (currentTime && previousTime) {
        const currentMinutes = convertTimeToMinutes(currentTime);
        const previousMinutes = convertTimeToMinutes(previousTime);
        
        if (currentMinutes <= previousMinutes) {
          return `Erro na ordem dos horários: ${currentTime} não pode ser igual ou anterior a ${previousTime}. Os horários devem estar em ordem cronológica crescente.`;
        }
      }
    }
    
    return null;
  };

  const convertTimeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setMonitoringTimeError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedForm = {
        ...form,
        monitoring: recalculateHourDegrees(monitoringItems),
      };

      const result = await updateSpawnForm(updatedForm, user?.role);

      if ("error" in result) {
        setError(result.error);
        return;
      }
        successNotification("Sucesso!", "Spawning form atualizado com sucesso!");
        router.push(`/dashboard/spawning/${params.id}`);
    } catch (error: any) {
      const errMsg = error.message || "Erro ao atualizar spawning form";
      errorNotification("Erro!", errMsg);
      setError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    key: keyof Omit<SpawningForm, "monitoring" | "user" | "userId">,
    value: any
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAnimalWeight = (
    key: "beforeSpawn" | "afterSpawn",
    value: number
  ) => {
    setForm((prev) => ({
      ...prev,
      animal_weight: { ...prev.animal_weight, [key]: value },
    }));
  };

  const handleAnimalInput = (value: string) => {
    setAnimalQuery(value);
    setShowSuggestions(true);
    setForm((prev) => ({ ...prev, animalId: "" }));
    setSelectedAnimal(null);
  };

  const handleSelectAnimal = (animal: Animal) => {
    setSelectedAnimal(animal);
    setAnimalQuery(animal.codeAnimal);
    setForm((prev) => ({ ...prev, animalId: animal.codeAnimal }));
    setShowSuggestions(false);
  };

  const addMonitoringItem = () => {
    setMonitoringItems((prev) => [
      ...prev,
      { hour: "", temperature: 0, hour_degree: 0 },
    ]);
  };

  const removeMonitoringItem = (index: number) => {
    setMonitoringItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateMonitoringItem = (index: number, field: keyof Monitoring, value: string | number) => {
    setMonitoringItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const recalculateHourDegrees = (items: Monitoring[]): Monitoring[] => {
    const validItems = items.filter(item => item.hour && item.temperature > 0);
    const sortedItems = validItems.sort((a, b) => {
      const timeA = convertTimeToMinutes(a.hour);
      const timeB = convertTimeToMinutes(b.hour);
      return timeA - timeB;
    });

    return sortedItems.map((item, index) => {
      if (index === 0) {
        return { ...item, hour_degree: 0 };
      } else {
        const previousHourDegree = sortedItems[index - 1].hour_degree || 0;
        const currentTemperature = item.temperature || 0;
        return { ...item, hour_degree: currentTemperature + previousHourDegree };
      }
    });
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Carregando dados do spawning form...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {error && (
        <ErrorBox
          errorMessage={error}
          setErrorMessage={setError}
          otherClassName=""
        />
      )}

      {success && (
        <div className={styles.successMessage}>
          {success}
        </div>
      )}

      <div className={styles.header}>
        <Button
          onClick={() => router.back()}
          variant="secondary"
          className={styles.backButton}
        >
          <FaArrowLeft /> Voltar
        </Button>
        <h1 className={styles.title}>ATUALIZAR DESOVA</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Data da Desova */}
        <div className={styles.formGroup}>
          <label htmlFor="date">Data da Desova *</label>
          <input
            type="date"
            id="date"
            value={dayjs(form.date).format("YYYY-MM-DD")}
            onChange={(e) => handleChange("date", new Date(e.target.value))}
            required
            className={styles.input}
          />
        </div>

        {/* Seleção de Animal */}
        <div className={styles.formGroup}>
          <label htmlFor="animal">Animal *</label>
          <div className={styles.autocompleteContainer} ref={suggestionsRef}>
            <input
              type="text"
              id="animal"
              value={animalQuery}
              onChange={(e) => handleAnimalInput(e.target.value)}
              placeholder="Digite o código do animal"
              required
              className={styles.input}
              disabled
            />
            {showSuggestions && animalSuggestions.length > 0 && (
              <div className={styles.suggestions}>
                {animalSuggestions.map((animal) => (
                  <div
                    key={animal._id}
                    className={styles.suggestionItem}
                    onClick={() => handleSelectAnimal(animal)}
                  >
                    {animal.codeAnimal} - {animal.gender === "F" ? "Fêmea" : "Macho"}
                  </div>
                ))}
              </div>
            )}
          </div>
          <small className={styles.helpText}>
            O animal não pode ser alterado após a criação da desova
          </small>
        </div>

        {/* Peso do Animal */}
        <div className={styles.weightSection}>
          <h3>Peso do Animal</h3>
          <div className={styles.weightGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="beforeSpawn">Peso Antes da Desova (kg) *</label>
              <input
                type="text"
                id="beforeSpawn"
                inputMode="decimal"
                value={formatNumberInput(form.animal_weight.beforeSpawn.toString())}
                onChange={(e) =>
                  handleAnimalWeight(
                    "beforeSpawn",
                    parseFloat(e.target.value.replace(",", ".")) || 0
                  )
                }
                placeholder="0,00"
                required
                className={styles.input}
                step="0.01"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="afterSpawn">Peso Depois da Desova (kg) *</label>
              <input
                type="text"
                id="afterSpawn"
                inputMode="decimal"
                value={formatNumberInput(form.animal_weight.afterSpawn.toString())}
                onChange={(e) =>
                  handleAnimalWeight(
                    "afterSpawn",
                    parseFloat(e.target.value.replace(",", ".")) || 0
                  )
                }
                placeholder="0,00"
                required
                className={styles.input}
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* Peso dos Ovos */}
        <div className={styles.formGroup}>
          <label htmlFor="eggWeight">Peso dos Ovos (kg) *</label>
          <input
            type="text"
            id="eggWeight"
            inputMode="decimal"
            value={formatNumberInput(form.egg_weight.toString())}
            onChange={(e) =>
              handleChange("egg_weight", parseFloat(e.target.value.replace(",", ".")) || 0)
            }
            placeholder="0,00"
            required
            className={styles.input}
            step="0.01"
          />
        </div>

        {/* Hormônio */}
        <div className={styles.hormoneSection}>
          <h3>Hormônio</h3>
          <div className={styles.hormoneGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="hourDosage">Hora da Dosagem *</label>
              <input
                type="time"
                id="hourDosage"
                value={form.hormone.hour_dosage}
                onChange={(e) =>
                  handleChange("hormone", {
                    ...form.hormone,
                    hour_dosage: e.target.value,
                  })
                }
                required
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="quantity">Quantidade (ml) *</label>
              <input
                type="text"
                id="quantity"
                inputMode="decimal"
                value={formatNumberInput(form.hormone.quantity.toString(), 1)}
                onChange={(e) =>
                  handleChange("hormone", {
                    ...form.hormone,
                    quantity: parseFloat(e.target.value.replace(",", ".")) || 0,
                  })
                }
                placeholder="0,0"
                required
                className={styles.input}
                step="0.1"
              />
            </div>
          </div>
        </div>

        {/* Monitoramento */}
        <div className={styles.monitoringSection}>
          <div className={styles.monitoringHeader}>
            <h3>Monitoramento de Temperatura</h3>
            <Button
              type="button"
              onClick={addMonitoringItem}
              variant="secondary"
              className={styles.addButton}
            >
              <FaPlus /> Adicionar Registro
            </Button>
          </div>

          {monitoringTimeError && (
            <div className={styles.errorMessage}>
              ⚠️ {monitoringTimeError}
            </div>
          )}

          {monitoringItems.map((item, index) => (
            <div key={index} className={styles.monitoringItem}>
              <div className={styles.monitoringGrid}>
                <div className={styles.formGroup}>
                  <label>Hora</label>
                  <input
                    type="time"
                    value={item.hour}
                    onChange={(e) => updateMonitoringItem(index, "hour", e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Temperatura (°C)</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={item.temperature === 0 ? "" : item.temperature.toString().replace(".", ",")}
                    onChange={(e) => {
                      const formatted = formatNumberInput(e.target.value, 1);
                      updateMonitoringItem(
                        index,
                        "temperature",
                        parseFloat(formatted.replace(",", ".")) || 0
                      );
                    }}
                    placeholder="0,0"
                    className={styles.input}
                    step="0.1"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Graus-Hora (Calculado)</label>
                  <input
                    type="text"
                    value={item.hour_degree.toString()}
                    disabled
                    className={`${styles.input} ${styles.disabled}`}
                  />
                </div>
                {monitoringItems.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeMonitoringItem(index)}
                    variant="danger"
                    className={styles.removeButton}
                  >
                    <FaTrash />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Botões */}
        <div className={styles.formActions}>
          <Button
            type="button"
            onClick={() => router.back()}
            variant="secondary"
            className={styles.cancelButton}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant={hasMonitoringError ? "danger" : "primary"}
            className={`${styles.submitButton} ${hasMonitoringError ? styles.submitButtonError : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Atualizando..." : "Atualizar Desova"}
          </Button>
        </div>
      </form>
    </div>
  );
} 