
import styles from "@/components/tables/animal-tables/animal-table.module.css"
import { Animal, Tank } from "@/types/types";
import { FaBarcode, FaCalendarAlt, FaFish, FaVenusMars, FaWater } from "react-icons/fa";
import { BsPencil, BsTrash } from "react-icons/bs";

export interface AnimalTableProps {
  animals:Animal[];
  tanks:Tank[];
  onEdit:(animal:Animal)=>void;
  onDelete:(codeAnimal:string)=>void;
}

const formatDate = (date: Date):string => {
  return new Date(date).toLocaleDateString("pt-BR");
};


export const AnimalTable: React.FC<AnimalTableProps> = ({ animals, tanks, onEdit, onDelete }) => {
  return (
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
                   <FaWater /> {(tanks.find((tank)=>tank._id == animal.tankId))?.name}
                 </div>
               </td>
               <td className={styles.tableCell}>
                 <div className={styles.actionsCell}>
                   <button
                     className={styles.updateButton}
                     onClick={()=>onEdit(animal)}
                   >
                     <BsPencil /> Atualizar
                   </button>
                   <button
                     className={styles.deleteButton}
                     onClick={() =>
                       onDelete(animal.codeAnimal)
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
    );
  }