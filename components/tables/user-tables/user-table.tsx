import { CustomTable, TableColumn } from "@/components/tables/customTable";
import { FaUserEdit, FaTrash, FaUser, FaEllipsisV } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoNewspaperOutline } from "react-icons/io5";
import styles from "@/components/tables/user-tables/user-table.module.css";
import { User } from "@/types/user";
import { useEffect, useRef, useState } from 'react';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete }) => {
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
  const columns: TableColumn<User>[] = [
    {
      header: "Nome",
      render: (user) => (
        <div className={styles.cellContent}>
          <FaUser size={18} /> {user.username}
        </div>
      ),
    },
    {
      header: "Email",
      render: (user) => (
        <div className={styles.cellContent}>
          <MdEmail size={18} /> {user.email}
        </div>
      ),
    },
    {
      header: "Papel",
      render: (user) => (
        <div className={styles.cellContent}>
          <IoNewspaperOutline size={18} /> {user.role === "ADMIN" ? "Administrador" : "Visualizador"}
        </div>
      ),
    },
    {
      header: "Data de Criação",
      render: (user) => (
        <div className={styles.cellContent}>
          {user.createdAt ? new Date(user.createdAt).toLocaleDateString("pt-BR") : ""}
        </div>
      ),
    },
    {
      header: "Ações",
      render: (user) => (
        <div className={styles.actionsCell} style={{ position: 'relative' }}>
          <button
            className={styles.ellipsisButton}
            aria-label="Mais opções"
            onClick={() => setOpenMenuId(openMenuId === user._id ? null : user._id)}
            tabIndex={0}
          >
            <FaEllipsisV />
          </button>
          {openMenuId === user._id && (
            <div className={styles.actionMenu} ref={menuRef}>
              <button
                className={styles.menuItem}
                onClick={() => { setOpenMenuId(null); onEdit(user); }}
              >
                <FaUserEdit /> Atualizar
              </button>
              <button
                className={styles.menuItem}
                onClick={() => { setOpenMenuId(null); onDelete(user._id); }}
              >
                <FaTrash /> Deletar
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return <CustomTable columns={columns} data={users} />;
};