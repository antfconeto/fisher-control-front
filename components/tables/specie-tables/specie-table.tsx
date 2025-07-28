import { CustomTable, TableColumn } from '@/components/tables/customTable';
import { LuBook, LuFilePenLine, LuFishSymbol } from "react-icons/lu";
import { BsPencil, BsTrash } from 'react-icons/bs';
import styles from './specie-table.module.css';
import { Specie } from '@/types/types';
import { isAdmin } from '@/utils/authUtils';
import { useAuth } from '@/contexts/authContext';

interface SpecieTableProps {
  species: Specie[];
  onEdit: (specie: Specie) => void;
  onDelete: (id: string) => void;
}

export const SpecieTable: React.FC<SpecieTableProps> = ({ species, onEdit, onDelete }) => {
  const { user } = useAuth();
  const columns: TableColumn<Specie>[] = [
    {
      header: 'Nome',
      render: (specie:Specie) => (
        <div className={styles.cellContent}>
          <LuFishSymbol size={18}/> {specie.name}
        </div>
      ),
    },
    {
      header: 'Descrição',
      render: (specie) => (
        <div className={styles.cellContent}>
          <LuFilePenLine size={18}/> {specie.description}
        </div>
      ),
    },
    {
      header: 'Quantidade de Animais',
      render: (specie) => (
        <div className={styles.cellContent}>
          <LuBook size={18}/>{specie.quantity}
        </div>
      ),
    },


  ];
  if(isAdmin(user)){
    columns.push(    {
      header: 'Ações',
      render: (species) => (
        <div className={styles.actionsCell}>
          <button
            className={styles.updateButton}
            onClick={() => onEdit(species)}
          >
            <BsPencil /> Atualizar
          </button>
          <button
            className={styles.deleteButton}
            onClick={() => onDelete(species._id)}
          >
            <BsTrash /> Deletar
          </button>
        </div>
      ),
    },)
  }
  return <CustomTable columns={columns} data={species} />;
};
