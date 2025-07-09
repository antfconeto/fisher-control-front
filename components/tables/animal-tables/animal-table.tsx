import { CustomTable, TableColumn } from '@/components/tables/customTable';
import { FaBarcode, FaCalendarAlt, FaVenusMars, FaWater, FaEllipsisV } from 'react-icons/fa';
import { BsPencil, BsTrash } from 'react-icons/bs';
import { formatDate } from '@/utils/dateFunctions';
import styles from './animal-table.module.css';
import { Animal, Specie, Tank } from '@/types/types';
import { useEffect, useRef, useState } from 'react';

interface AnimalTableProps {
  animals: Animal[];
  species: Specie[];
  tanks: Tank[];
  onEdit: (animal: Animal) => void;
  onDelete: (codeAnimal: string) => void;
}

export const AnimalTable: React.FC<AnimalTableProps> = ({ animals, tanks, species, onEdit, onDelete }) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha o menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }
    if (openMenuId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

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
          <FaWater /> 
          {species.find((specie) => specie._id === animal.specie)?.name}
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
        <div className={styles.actionsCell} style={{ position: 'relative' }}>
          <button
            className={styles.ellipsisButton}
            aria-label="Mais opções"
            onClick={() => setOpenMenuId(openMenuId === animal.codeAnimal ? null : animal.codeAnimal)}
            tabIndex={0}
          >
            <FaEllipsisV />
          </button>
          {openMenuId === animal.codeAnimal && (
            <div className={styles.actionMenu} ref={menuRef}>
              <button
                className={styles.menuItem}
                onClick={() => { setOpenMenuId(null); onEdit(animal); }}
              >
                <BsPencil /> Atualizar
              </button>
              <button
                className={styles.menuItem}
                onClick={() => { setOpenMenuId(null); onDelete(animal.codeAnimal); }}
              >
                <BsTrash /> Deletar
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return <CustomTable columns={columns} data={animals} />;
};
