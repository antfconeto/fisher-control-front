import { CustomTable, TableColumn } from "@/components/tables/customTable";
import { FaUserEdit, FaTrash, FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoNewspaperOutline } from "react-icons/io5";
import styles from "@/components/tables/user-tables/user-table.module.css";
import { User } from "@/types/user";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete }) => {
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
        <div className={styles.actionsCell}>
          <button
            className={styles.updateButton}
            onClick={() => onEdit(user)}
          >
            <FaUserEdit /> Atualizar
          </button>
          <button
            className={styles.deleteButton}
            onClick={() => onDelete(user._id)}
          >
            <FaTrash /> Deletar
          </button>
        </div>
      ),
    },
  ];

  return <CustomTable columns={columns} data={users} />;
};