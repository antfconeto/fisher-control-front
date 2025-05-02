"use client";

import { useEffect, useState } from "react";
import styles from "./animals.module.css";
import {
  BsSearch,
  BsFilter,
  BsInfoCircle,
  BsPencil,
  BsTrash,
} from "react-icons/bs";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaSave,
  FaTimes,
  FaFish,
  FaVenusMars,
  FaCalendarAlt,
  FaBarcode,
  FaWater,
} from "react-icons/fa";
import { Animal, AnimalPagination, ResponseError } from "@/types/types";
import { createAnimal, listAnimals } from "@/actions/animal";
import { useRequest } from "@/hooks/useRequest";
import { useError } from "@/hooks/useError";
import { ErrorBox } from "@/components/ErrorBox";
import { ClockLoader } from "react-spinners";

enum ModalMode {
  CREATE = "create",
  UPDATE = "update",
}

export default function AnimalsPage() {
  //Animals
  const [animals, setAnimals] = useState<Animal[]>([]);
  //Total pages getted from back-en
  const [totalPages, setTotalPages] = useState(1);
  //States for  change visibility modal
  const [showModal, setShowModal] = useState(false);
  //States for define status of modal
  const [modalMode, setModalMode] = useState<ModalMode>(ModalMode.CREATE);
  //States for filter by code
  const [codeFilter, setCodeFilter] = useState<string>('');
  //States for filter by specie
  const [specieFilter, setSpecieFilter] = useState<string>(
    ''
  );
  //States for filter by gender
  const [genderFilter, setGenderFilter] = useState<"M" | "F" | undefined>(
    undefined
  );
  //States for filter by tank
  const [tankFilter, setTankFilter] = useState<string>('');

  const { sendRequest } = useRequest<Animal | ResponseError>();
  const { errorMessage, setErrorMessage } = useError();
  const [loading, setLoading] = useState<boolean>(true)
  //States for current animal selected
  const [currentAnimal, setCurrentAnimal] = useState<Animal>({
    codeAnimal: "",
    _id: "",
    specie: "",
    birthDate: new Date(),
    gender: "M",
    matriz_code: "",
    tankId: "",
  });
  //States for current page selected
  const [currentPage, setCurrentPage] = useState(1);
  //Total items per page
  const itemsPerPage = 5;

  useEffect(() => {
    //Fetch animals when load page
    setLoading(true);
    fetchAnimals();
    setLoading(false);
  }, [currentPage, codeFilter, genderFilter, specieFilter, tankFilter]);
  //Function who fetch load animals in pagination
  const fetchAnimals = async () => {
    try {
  
      const response = await listAnimals(currentPage, itemsPerPage, {
        codeAnimal: codeFilter,
        gender: genderFilter,
        specie: specieFilter,
        tankId: tankFilter,
      }) as AnimalPagination;

        setAnimals(response.animals);
        setTotalPages(response.totalPages);
        //Case the current page is beggert than totalPages retrieve from back-end, its back to first page
        if (response.totalPages < currentPage) {
          setCurrentPage(1);
        }
  
    } catch (error:any ) {
      const errMsg = error?.message || "Erro Desconhecido";
      setErrorMessage(errMsg);
      return false
    }
  };

  //Function who open a creating modal
  const openCreateModal = () => {
    setModalMode(ModalMode.CREATE);
    setCurrentAnimal({
      codeAnimal: "",
      _id: "",
      specie: "",
      birthDate: new Date(),
      gender: "M",
      matriz_code: "",
      tankId: "",
    });
    setShowModal(true);
  };
  //Function who open a updating modal
  const openUpdateModal = (animal: Animal) => {
    setModalMode(ModalMode.UPDATE);
    setCurrentAnimal({
      ...animal,
    });
    setShowModal(true);
  };

  const handleSaveAnimal = async () => {
    if (
      currentAnimal.codeAnimal &&
      currentAnimal.specie &&
      currentAnimal.gender &&
      currentAnimal.birthDate &&
      currentAnimal.tankId
    ) {
      if (modalMode == ModalMode.CREATE) {
        const response = await handleCreateAnimal()
        if(response){
          await fetchAnimals();
          setShowModal(false);
        }
      }

    }
  };

  const handleCreateAnimal = async ():Promise<boolean> => {
    try {
      await sendRequest(createAnimal, currentAnimal);
      return true
    } catch (err: any) {
      const errMsg = err?.error || "Erro desconhecido";
      setErrorMessage(errMsg);
      return false
    }
  };
  const handleDeleteAnimal = (code: string):void => {
    if (confirm("Tem certeza que deseja excluir este animal?")) {
      setAnimals(animals.filter((animal) => animal.codeAnimal !== code));
    }
  };

  const formatDate = (date: Date):string => {
    return new Date(date).toLocaleDateString("pt-BR");
  };
  

  return (
    <>
      {errorMessage && (
        <ErrorBox
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          otherClassName=""
        />
      )}
    { loading && animals.length == 0?  
      <div className="loading-container">
        <ClockLoader color="#0a58ca" size={60} />
        <p className="loading-text">Carregando animais...</p>
      </div>
 : 
 <div className="page-container">
 <div className="content-container">
   <div className="content-card">
     {/* Cabeçalho com título e botão de criar */}
     <div className="d-flex justify-content-between align-items-center mb-4">
       <h2 className="card-title mb-0">
         <FaFish className="me-2 text-primary" /> Gestão de Animais
       </h2>
       <button className={styles.createButton} onClick={openCreateModal}>
         <FaPlus /> Cadastrar Novo Animal
       </button>
     </div>

     {/* Filtros */}
     <section className={styles.filterSection}>
       <div className={styles.filterLabel}>
         <BsFilter /> Filtro por animais
       </div>
       <div className={styles.filterContainer}>
         <div className={styles.searchInput}>
           <BsSearch className={styles.filterIcon} />
           <input
             type="text"
             placeholder="Código do animal"
             value={codeFilter}
             onChange={(e) => {
               setCurrentPage(1);
               setCodeFilter(e.target.value);
             }}
           />
         </div>
         <div className={styles.filterInput}>
           <FaFish className={styles.filterIcon} />
           <input
             type="text"
             placeholder="Espécie"
             value={specieFilter}
             onChange={(e) => {
               setCurrentPage(1);
               setSpecieFilter(e.target.value);
             }}
           />
         </div>
         <div className={styles.filterInput}>
           <FaVenusMars className={styles.filterIcon} />
           <select
             value={genderFilter}
             onChange={(e) => {
               setCurrentPage(1);
               setGenderFilter(e.target.value as "M" | "F" | undefined);
             }}
             className={styles.filterSelect}
           >
             <option value="">Todos</option>
             <option value="M">Macho</option>
             <option value="F">Fêmea</option>
           </select>
         </div>
         <div className={styles.filterInput}>
           <FaWater className={styles.filterIcon} />
           <input
             type="text"
             placeholder="ID do Tanque"
             value={tankFilter}
             onChange={(e) => {
               setCurrentPage(1);
               setTankFilter(e.target.value);
             }}
           />
         </div>
       </div>
     </section>

     {/* Tabela de animais */}
     <div className={styles.tableContainer}>
       <table className={styles.table}>
         <thead>
           <tr>
             <th className={styles.tableHeader}>Código</th>
             <th className={styles.tableHeader}>Espécie</th>
             <th className={styles.tableHeader}>Data de Nascimento</th>
             <th className={styles.tableHeader}>Gênero</th>
             <th className={styles.tableHeader}>Matriz</th>
             <th className={styles.tableHeader}>Tanque</th>
             <th className={styles.tableHeader}>Ações</th>
           </tr>
         </thead>
         <tbody>
           {animals.map((animal: Animal) => (
             <tr key={animal.codeAnimal} className={styles.tableRow}>
               <td className={styles.tableCell}>
                 <div className={styles.cellContent}>
                   <FaBarcode /> {animal.codeAnimal}
                 </div>
               </td>
               <td className={styles.tableCell}>
                 <div className={styles.cellContent}>
                   <FaFish /> {animal.specie}
                 </div>
               </td>
               <td className={styles.tableCell}>
                 <div className={styles.cellContent}>
                   <FaCalendarAlt /> {formatDate(animal.birthDate)}
                 </div>
               </td>
               <td className={styles.tableCell}>
                 <div className={styles.cellContent}>
                   <FaVenusMars />{" "}
                   {animal.gender == "M" ? "Macho" : "Fêmea"}
                 </div>
               </td>
               <td className={styles.tableCell}>{animal.matriz_code}</td>
               <td className={styles.tableCell}>
                 <div className={styles.cellContent}>
                   <FaWater /> {animal.tankId}
                 </div>
               </td>
               <td className={styles.tableCell}>
                 <div className={styles.actionsCell}>
                   <button
                     className={styles.updateButton}
                     onClick={() => openUpdateModal(animal)}
                   >
                     <BsPencil /> Atualizar
                   </button>
                   <button
                     className={styles.deleteButton}
                     onClick={() =>
                       handleDeleteAnimal(animal.codeAnimal)
                     }
                   >
                     <BsTrash /> Deletar
                   </button>
                 </div>
               </td>
             </tr>
           ))}
         </tbody>
       </table>
     </div>

     {/* Paginação */}
     {totalPages > 0 && (
       <div className={styles.pagination}>
         <button
           className={styles.paginationButton}
           onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
           disabled={currentPage === 1}
         >
           <FaChevronLeft /> Anterior
         </button>
         <div className={styles.paginationInfo}>
           Página {currentPage} de {totalPages}
         </div>
         <button
           className={styles.paginationButton}
           onClick={() =>
             setCurrentPage(Math.min(totalPages, currentPage + 1))
           }
           disabled={currentPage === totalPages}
         >
           Próxima <FaChevronRight />
         </button>
       </div>
     )}
   </div>
 </div>
</div>
 }
      {/* Modal de Criação/Atualização */}
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {modalMode === ModalMode.CREATE
                  ? "Cadastrar Novo Animal"
                  : "Atualizar Animal"}
              </h2>
              <button
                className={styles.modalCloseButton}
                onClick={() => setShowModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FaBarcode /> Código do Animal
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={currentAnimal.codeAnimal}
                  onChange={(e) =>
                    setCurrentAnimal({
                      ...currentAnimal,
                      codeAnimal: e.target.value,
                    })
                  }
                  placeholder="Digite o código do animal"
                  disabled={modalMode === ModalMode.UPDATE}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FaFish /> Espécie
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={currentAnimal.specie}
                  onChange={(e) =>
                    setCurrentAnimal({
                      ...currentAnimal,
                      specie: e.target.value,
                    })
                  }
                  placeholder="Digite a espécie do animal"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FaCalendarAlt /> Data de Nascimento
                </label>
                <input
                  type="date"
                  className={styles.formInput}
                  value={currentAnimal.birthDate.toISOString().split("T")[0]}
                  onChange={(e) =>
                    setCurrentAnimal({
                      ...currentAnimal,
                      birthDate: new Date(e.target.value),
                    })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FaVenusMars /> Gênero
                </label>
                <select
                  className={styles.formInput}
                  value={currentAnimal.gender}
                  onChange={(e) =>
                    setCurrentAnimal({
                      ...currentAnimal,
                      gender: e.target.value as any,
                    })
                  }
                >
                  <option value="">Selecione um gênero</option>
                  <option value="Macho">Macho</option>
                  <option value="Fêmea">Fêmea</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Código da Matriz</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={currentAnimal.matriz_code}
                  onChange={(e) =>
                    setCurrentAnimal({
                      ...currentAnimal,
                      matriz_code: e.target.value,
                    })
                  }
                  placeholder="Digite o código da matriz (opcional)"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FaWater /> ID do Tanque
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={currentAnimal.tankId}
                  onChange={(e) =>
                    setCurrentAnimal({
                      ...currentAnimal,
                      tankId: e.target.value,
                    })
                  }
                  placeholder="Digite o ID do tanque"
                />
              </div>
              <div className={styles.infoBox}>
                <h4 className={styles.infoTitle}>
                  <BsInfoCircle /> Informações
                </h4>
                <ul className={styles.infoList}>
                  <li className={styles.infoListItem}>
                    O código do animal deve ser único no sistema.
                  </li>
                  <li className={styles.infoListItem}>
                    É necessário especificar o tanque onde o animal está
                    alocado.
                  </li>
                  <li className={styles.infoListItem}>
                    O código da matriz é opcional e se refere ao animal
                    progenitor.
                  </li>
                </ul>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowModal(false)}
              >
                <FaTimes /> Cancelar
              </button>
              <button className={styles.saveButton} onClick={handleSaveAnimal}>
                <FaSave /> Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
