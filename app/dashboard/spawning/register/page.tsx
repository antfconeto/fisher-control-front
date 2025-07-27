"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./register.module.css";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { useUser } from "@/hooks/userHook";
import { createSpawnForm } from "@/actions/spawnForm";
import { listAnimals } from "@/actions/animal";
import { SpawningForm, Animal, Monitoring } from "@/types/types";
import { ErrorBox } from "@/components/ErrorBox";
import dayjs from "dayjs";
import { FaPlus, FaTrash } from "react-icons/fa";

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

export default function RegisterSpawningPage() {
  const router = useRouter();
  const { user } = useUser();
  const [form, setForm] = useState<Omit<SpawningForm, "_id" | "userId">>({
    ...defaultForm,
    user: {
      id: user?._id || "",
      name: user?.username || "",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [monitoringTimeError, setMonitoringTimeError] = useState<string | null>(null);

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

  // Fechar sugestões ao clicar fora
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

  // Atualizar o form.monitoring quando monitoringItems mudar
  useEffect(() => {
    setForm(prev => ({
      ...prev,
      monitoring: monitoringItems.filter(item => 
        item.hour && item.temperature > 0
      )
    }));
  }, [monitoringItems]);

  // Recalcular hour_degree sempre que a temperatura mudar
  useEffect(() => {
    const hasTemperatureChanges = monitoringItems.some(item => item.temperature > 0);
    if (hasTemperatureChanges) {
      setMonitoringItems(prev => recalculateHourDegrees(prev));
    }
  }, [monitoringItems.map(item => item.temperature).join(',')]);

  // Validação
  const validate = () => {
    if (!form.date) return "Data da desova é obrigatória.";
    if (!form.animalId) return "Selecione um animal válido.";
    if (!form.animal_weight.beforeSpawn)
      return "Peso antes da desova é obrigatório.";
    if (!form.animal_weight.afterSpawn)
      return "Peso depois da desova é obrigatório.";
    if (!form.egg_weight) return "Peso dos ovos é obrigatório.";
    
    // Validação dos horários do monitoring
    const monitoringError = validateMonitoringTimes();
    if (monitoringError) return monitoringError;
    
    return null;
  };

  // Função para validar se os horários estão em ordem cronológica
  const validateMonitoringTimes = (items?: Monitoring[]): string | null => {
    const itemsToValidate = items || monitoringItems;
    const filledItems = itemsToValidate.filter(item => item.hour && item.temperature > 0);
    
    if (filledItems.length < 2) return null; // Precisa de pelo menos 2 itens para validar
    
    // Verificar horários duplicados
    const times = filledItems.map(item => item.hour);
    const uniqueTimes = new Set(times);
    if (times.length !== uniqueTimes.size) {
      return "Erro: Existem horários duplicados. Cada horário deve ser único.";
    }
    
    for (let i = 1; i < filledItems.length; i++) {
      const currentTime = filledItems[i].hour;
      const previousTime = filledItems[i - 1].hour;
      
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

  // Função para converter horário (HH:MM) em minutos para comparação
  const convertTimeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setMonitoringTimeError(null);
    const validation = validate();
    if (validation) {
      setError(validation);
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await createSpawnForm({
        ...form,
        animalId: selectedAnimal ? selectedAnimal.codeAnimal : form.animalId,
        user: {
          id: user?._id || "",
          name: user?.username || "",
        },
        userId: user?._id || "",
      } as any);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setSuccess("Desova registrada com sucesso!");
      setTimeout(() => router.push("/dashboard/spawning"), 1500);
    } catch (err: any) {
      setError(err.message || "Erro ao registrar desova");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handlers de campos
  const handleChange = (
    key: keyof Omit<SpawningForm, "_id" | "monitoring" | "user" | "userId">,
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

  // Handler do autocomplete
  const handleAnimalInput = (value: string) => {
    setAnimalQuery(value);
    setForm((prev) => ({ ...prev, animalId: value }));
    setShowSuggestions(true);
    setSelectedAnimal(null);
  };

  const handleSelectAnimal = (animal: Animal) => {
    setForm((prev) => ({ ...prev, animalId: animal.codeAnimal }));
    setAnimalQuery(animal.codeAnimal);
    setSelectedAnimal(animal);
    setShowSuggestions(false);
  };

  // Handlers para monitoring
  const addMonitoringItem = () => {
    setMonitoringItems(prev => {
      const newItems = [...prev, { hour: "", temperature: 0, hour_degree: 0 }];
      const recalculatedItems = recalculateHourDegrees(newItems);
      
      // Validar horários em tempo real
      const timeError = validateMonitoringTimes(recalculatedItems);
      setMonitoringTimeError(timeError);
      
      return recalculatedItems;
    });
  };

  const removeMonitoringItem = (index: number) => {
    setMonitoringItems(prev => {
      const filteredItems = prev.filter((_, i) => i !== index);
      const recalculatedItems = recalculateHourDegrees(filteredItems);
      
      // Validar horários em tempo real
      const timeError = validateMonitoringTimes(recalculatedItems);
      setMonitoringTimeError(timeError);
      
      return recalculatedItems;
    });
  };

  const updateMonitoringItem = (index: number, field: keyof Monitoring, value: string | number) => {
    setMonitoringItems(prev => {
      const updatedItems = prev.map((item, i) => 
        i === index 
          ? { ...item, [field]: value }
          : item
      );
      
      // Recalcular hour_degree para todos os itens após a mudança
      const recalculatedItems = recalculateHourDegrees(updatedItems);
      
      // Validar horários em tempo real
      const timeError = validateMonitoringTimes(recalculatedItems);
      setMonitoringTimeError(timeError);
      
      return recalculatedItems;
    });
  };

  // Função para recalcular hour_degree automaticamente
  const recalculateHourDegrees = (items: Monitoring[]): Monitoring[] => {
    return items.map((item, index) => {
      if (index === 0) {
        // Primeiro item sempre tem hour_degree = 0
        return { ...item, hour_degree: 0 };
      } else {
        // Para os demais itens, hour_degree = temperatura_atual + hour_degree_anterior
        // Exemplo: 
        // 9:00 - temp 30°C - hour_degree: 0 (primeiro)
        // 10:00 - temp 20°C - hour_degree: 20 + 0 = 20
        // 11:00 - temp 26°C - hour_degree: 26 + 20 = 46
        // 12:00 - temp 19°C - hour_degree: 19 + 46 = 65
        const previousHourDegree = items[index - 1].hour_degree || 0;
        const currentTemperature = item.temperature || 0;
        return { ...item, hour_degree: currentTemperature + previousHourDegree };
      }
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Registrar Nova Desova</h2>
      {error && (
        <ErrorBox
          errorMessage={error}
          setErrorMessage={setError}
          otherClassName=""
        />
      )}
      {success && <div className={styles.successMsg}>{success}</div>}
      <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
        <div className={styles.formGroup}>
          <label>Data da desova*</label>
          <input
            type="date"
            value={dayjs(form.date).format("YYYY-MM-DD")}
            onChange={(e) => handleChange("date", new Date(e.target.value))}
            required
          />
        </div>
        <div className={styles.formGroup} style={{ position: "relative" }}>
          <label>ID do animal*</label>
          <input
            type="text"
            value={animalQuery}
            onChange={(e) => handleAnimalInput(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Digite o código ou nome do animal"
            required
            autoComplete="off"
            className={styles.inputAutocomplete}
          />
          {showSuggestions && animalSuggestions.length > 0 && (
            <div className={styles.suggestionsBox} ref={suggestionsRef}>
              {animalSuggestions.map((animal) => (
                <div
                  key={animal.codeAnimal}
                  className={styles.suggestionItem}
                  onClick={() => handleSelectAnimal(animal)}
                >
                  <strong>{animal.codeAnimal}</strong>
                  {animal.specie && <> - {animal.specie}</>}
                  {animal.gender && (
                    <> - {animal.gender === "F" ? "Fêmea" : "Macho"}</>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={styles.formGroupRow}>
          <div className={styles.formGroup}>
            <label>Peso antes da desova (kg)*</label>
            <input
              type="text"
              inputMode="decimal"
              value={
                form.animal_weight.beforeSpawn === 0
                  ? ""
                  : form.animal_weight.beforeSpawn.toString().replace(".", ",")
              }
              onChange={(e) => {
                const formatted = formatNumberInput(e.target.value, 2);
                setForm((prev) => ({
                  ...prev,
                  animal_weight: {
                    ...prev.animal_weight,
                    beforeSpawn: parseFloat(formatted.replace(",", ".")) || 0,
                  },
                }));
              }}
              required
              placeholder="0,00"
              maxLength={8}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Peso depois da desova (kg)*</label>
            <input
              type="text"
              inputMode="decimal"
              value={
                form.animal_weight.afterSpawn === 0
                  ? ""
                  : form.animal_weight.afterSpawn.toString().replace(".", ",")
              }
              onChange={(e) => {
                const formatted = formatNumberInput(e.target.value, 2);
                setForm((prev) => ({
                  ...prev,
                  animal_weight: {
                    ...prev.animal_weight,
                    afterSpawn: parseFloat(formatted.replace(",", ".")) || 0,
                  },
                }));
              }}
              required
              placeholder="0,00"
              maxLength={8}
            />
          </div>
        </div>
        <div className={styles.formGroup}>
          <label>Peso dos ovos (kg)*</label>
          <input
            type="text"
            inputMode="decimal"
            value={
              form.egg_weight === 0
                ? ""
                : form.egg_weight.toString().replace(".", ",")
            }
            onChange={(e) => {
              const formatted = formatNumberInput(e.target.value, 2);
              setForm((prev) => ({
                ...prev,
                egg_weight: parseFloat(formatted.replace(",", ".")) || 0,
              }));
            }}
            required
            placeholder="0,00"
            maxLength={8}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Hora da Dosagem</label>
          <input
            type="time"
            value={form.hormone.hour_dosage}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                hormone: {
                  ...prev.hormone,
                  hour_dosage: e.target.value,
                },
              }))
            }
            placeholder="HH:MM"
            maxLength={5}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Quantidade Hormônio (ml)</label>
          <input
            type="number"
            min={0}
            step={0.1}
            value={form.hormone.quantity === 0 ? "" : form.hormone.quantity}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                hormone: {
                  ...prev.hormone,
                  quantity: parseFloat(e.target.value) || 0,
                },
              }))
            }
            placeholder="0,0"
          />
        </div>

        {/* Seção de Monitoramento */}
        <div className={styles.formGroup}>
          <div className={styles.monitoringHeader}>
            <label>Monitoramento de Temperatura</label>
            <Button
              type="button"
              variant="secondary"
              onClick={addMonitoringItem}
              style={{ padding: "0.5rem", minWidth: "auto" }}
            >
              <FaPlus /> Adicionar
            </Button>
          </div>
          <small style={{ color: "#666", fontSize: "0.9rem", marginBottom: "1rem", display: "block" }}>
            💡 Graus-Hora são calculados automaticamente: temperatura atual + graus-hora anterior
          </small>
          {monitoringTimeError && (
            <div className={styles.monitoringTimeError}>
              ⚠️ {monitoringTimeError}
            </div>
          )}
          
          {monitoringItems.map((item, index) => (
            <div key={index} className={styles.monitoringItem}>
              <div className={styles.monitoringInputs}>
                <div className={styles.monitoringInput}>
                  <label>Hora</label>
                  <input
                    type="time"
                    value={item.hour}
                    onChange={(e) => updateMonitoringItem(index, "hour", e.target.value)}
                    placeholder="HH:MM"
                  />
                </div>
                <div className={styles.monitoringInput}>
                  <label>Temperatura (°C)</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={item.temperature === 0 ? "" : item.temperature.toString().replace(".", ",")}
                    onChange={(e) => {
                      const formatted = formatNumberInput(e.target.value, 1);
                      updateMonitoringItem(index, "temperature", parseFloat(formatted.replace(",", ".")) || 0);
                    }}
                    placeholder="0,0"
                    maxLength={5}
                  />
                </div>
                <div className={styles.monitoringInput}>
                  <label>Graus-Hora (Calculado)</label>
                  <input
                    type="text"
                    value={item.hour_degree === 0 ? "0" : item.hour_degree.toString()}
                    readOnly
                    className={styles.inputReadonly}
                    placeholder="0"
                  />
                </div>
                {monitoringItems.length > 1 && (
                  <div className={styles.monitoringRemove}>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => removeMonitoringItem(index)}
                      style={{ padding: "0.5rem", minWidth: "auto", backgroundColor: "#dc3545", color: "white" }}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.formGroup}>
          <label>Autor</label>
          <input
            type="text"
            value={user?.username || ""}
            readOnly
            className={styles.inputReadonly}
          />
        </div>
        <div className={styles.formActions}>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Registrando..." : "Registrar Desova"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/dashboard/spawning")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
