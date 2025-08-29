import { CustomTable, TableColumn } from '@/components/tables/customTable';
import { FaFish, FaFileAlt, FaHashtag, FaEllipsisV } from 'react-icons/fa';
import { BsPencil, BsTrash } from 'react-icons/bs';
import styles from './specie-table.module.css';
import { Specie } from '@/types/types';
import { isAdmin } from '@/utils/authUtils';
import { useUser } from '@/hooks/userHook';
import { useEffect, useRef, useState } from 'react';

interface SpecieTableProps {
  species: Specie[];
  onEdit: (specie: Specie) => void;
  onDelete: (id: string) => void;
}

export const SpecieTable: React.FC<SpecieTableProps> = ({ species, onEdit, onDelete }) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

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

  const columns: TableColumn<Specie>[] = [
    {
      header: 'Nome',
      render: (specie: Specie) => (
        <div className={styles.cellContent}>
          <FaFish /> {specie.name}
        </div>
      ),
    },
    {
      header: 'Descrição',
      render: (specie) => (
        <div className={styles.cellContent}>
          <FaFileAlt /> {specie.description.length > 60 ? specie.description.substring(0, 60) + '...' : specie.description}
        </div>
      ),
    },
    {
      header: 'Quantidade de Animais',
      render: (specie) => (
        <div className={styles.cellContent}>
          <FaHashtag /> {specie.quantity}
        </div>
      ),
    },
  ];

  if (isAdmin(user)) {
    columns.push({
      header: 'Ações',
      render: (specie) => (
        <div className={styles.actionsCell} style={{ position: 'relative' }}>
          <button
            className={styles.ellipsisButton}
            aria-label="Mais opções"
            onClick={() => setOpenMenuId(openMenuId === specie._id ? null : specie._id)}
            tabIndex={0}
          >
            <FaEllipsisV />
          </button>
          {openMenuId === specie._id && (
            <div className={styles.actionMenu} ref={menuRef}>
              <button
                className={styles.menuItem}
                onClick={() => { setOpenMenuId(null); onEdit(specie); }}
              >
                <BsPencil /> Atualizar
              </button>
              <button
                className={styles.menuItem}
                onClick={() => { setOpenMenuId(null); onDelete(specie._id); }}
              >
                <BsTrash /> Deletar
              </button>
            </div>
          )}
        </div>
      ),
    });
  }

  return <CustomTable columns={columns} data={species} />;
};
