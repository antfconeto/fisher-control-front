import { CustomTable, TableColumn } from '@/components/tables/customTable';
import { FaBarcode, FaFish, FaCalendarAlt, FaVenusMars, FaWater } from 'react-icons/fa';
import { BsPencil, BsTrash } from 'react-icons/bs';
import { formatDate } from '@/utils/dateFunctions';
import styles from './animal-table.module.css';
import { Animal, Tank } from '@/types/types';

interface AnimalTableProps {
  animals: Animal[];
  tanks: Tank[];
  onEdit: (animal: Animal) => void;
  onDelete: (codeAnimal: string) => void;
}

export const AnimalTable: React.FC<AnimalTableProps> = ({ animals, tanks, onEdit, onDelete }) => {
  const columns: TableColumn<Animal>[] = [
    {
      header: 'Código',
      render: (animal) => (
        <div className={styles.cellContent}>
          <FaBarcode /> {animal.codeAnimal}
        </div>
      ),
    },
    {
      header: 'Espécie',
      render: (animal) => (
        <div className={styles.cellContent}>
          <FaFish /> {animal.specie}
        </div>
      ),
    },
    {
      header: 'Data de Nascimento',
      render: (animal) => (
        <div className={styles.cellContent}>
          <FaCalendarAlt /> {formatDate(animal.birthDate)}
        </div>
      ),
    },
    {
      header: 'Gênero',
      render: (animal) => (
        <div className={styles.cellContent}>
          <FaVenusMars /> {animal.gender === 'M' ? 'Macho' : 'Fêmea'}
        </div>
      ),
    },
    {
      header: 'Matriz',
      render: (animal) => animal.matriz_code,
    },
    {
      header: 'Tanque',
      render: (animal) => (
        <div className={styles.cellContent}>
          <FaWater /> {tanks.find((tank) => tank._id === animal.tankId)?.name}
        </div>
      ),
    },
    {
      header: 'Ações',
      render: (animal) => (
        <div className={styles.actionsCell}>
          <button
            className={styles.updateButton}
            onClick={() => onEdit(animal)}
          >
            <BsPencil /> Atualizar
          </button>
          <button
            className={styles.deleteButton}
            onClick={() => onDelete(animal.codeAnimal)}
          >
            <BsTrash /> Deletar
          </button>
        </div>
      ),
    },
  ];

  return <CustomTable columns={columns} data={animals} />;
};
