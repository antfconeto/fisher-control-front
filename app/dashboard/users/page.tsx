"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "./users.module.css";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaUserEdit,
} from "react-icons/fa";
import { BsSearch } from "react-icons/bs";
import { ErrorBox } from "@/components/ErrorBox";
import { ClockLoader } from "react-spinners";
import { useErrorContext } from "@/contexts/errorContext";
import { CustomModalForm } from "@/components/Forms/CustomModalForm";
import { ConfirmModal } from "@/components/Forms/ConfirmModal/ConfirmModal";
import {
  listUsersPaginated,
  createUser,
  updateUser,
  deleteUser,
} from "@/actions/user";
import { Role, User } from "@/types/user";
import { DynamicFilters } from "@/components/dynamicFilter/dynamicFilters";
import { FilterFieldConfig } from "@/types/components";
import { UserTable } from "@/components/tables/user-tables/user-table";
import { useUser } from "@/hooks/userHook";
import { ResponseError } from "@/types/types";
import { CustomError } from "@/utils/customError";
import { useNotification } from "@/contexts/notificationContext";

enum ModalMode {
  CREATE = "create",
  UPDATE = "update",
}

const defaultFilters = {
  username: "",
  email: "",
  role: "",
  _id: "",
};

export default function UsersPage() {
  const { errorMessage, setErrorMessage } = useErrorContext();
  const { user: loggedInUser } = useUser();
  const { successNotification, errorNotification } = useNotification();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(ModalMode.CREATE);
  const [currentUser, setCurrentUser] = useState<User>({
    _id: "",
    username: "",
    email: "",
    createdAt: new Date(),
    role: Role.VIEWER,
    password: "",
    updatedAt: new Date(),
  });
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Filtros
  const [filters, setFilters] = useState(defaultFilters);

  // Paginação
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filtros dinâmicos
  const filterFields: FilterFieldConfig[] = [
    {
      key: "username",
      label: "Nome",
      icon: BsSearch,
      type: "text",
      size: "medium",
      placeholder: "Nome do usuário",
      value: filters.username,
      onChange: (val) => {
        setCurrentPage(1);
        setFilters((prev) => ({ ...prev, username: val as string }));
      },
    },
    {
      key: "email",
      label: "Email",
      icon: BsSearch,
      type: "text",
      size: "medium",
      placeholder: "Email",
      value: filters.email,
      onChange: (val) => {
        setCurrentPage(1);
        setFilters((prev) => ({ ...prev, email: val as string }));
      },
    },
    {
      key: "role",
      label: "Papel",
      icon: FaUserEdit,
      type: "select",
      size: "small",
      placeholder: "Papel",
      selectOptions: [
        { label: "Todos", value: "" },
        { label: "Administrador", value: "ADMIN" },
        { label: "Visualizador", value: "VIEWER" },
      ],
      value: filters.role,
      onChange: (val) => {
        setCurrentPage(1);
        setFilters((prev) => ({ ...prev, role: val as string }));
      },
    },
  ];

  // Fetch users paginados
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await listUsersPaginated({
        page: currentPage,
        pageSize: itemsPerPage,
        filter: {
          ...filters,
          role: filters.role || undefined,
          username: filters.username || undefined,
          email: filters.email || undefined,
          _id: filters._id || undefined,
        },
      });
      if (res && (res as ResponseError).error) {
        throw new CustomError((res as ResponseError).error, (res as ResponseError).statusCode)
      }
      
      // Filtrar o usuário logado da lista
      const filteredUsers = (res as { users: User[] }).users.filter(user => user._id !== loggedInUser?._id);
      setUsers(filteredUsers);
      setTotalPages((res as { totalPages: number }).totalPages);
    } catch (err: any) {
      const errMsg = err.message || "Erro ao buscar usuários";
      errorNotification("Erro!", errMsg);
      setErrorMessage(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [currentPage, filters]);

  // Modal handlers
  const openCreateModal = useCallback(() => {
    setModalMode(ModalMode.CREATE);
    setCurrentUser({
      _id: "",
      username: "",
      email: "",
      createdAt: new Date(),
      role: Role.VIEWER,
      password: "",
      updatedAt: new Date(),
    });
    setShowModal(true);
  }, []);

  const openUpdateModal = (user: User) => {
    setModalMode(ModalMode.UPDATE);
    setCurrentUser(user);
    setEditingUserId(user._id);
    setShowModal(true);
  };

  // CRUD handlers
  const handleSaveUser = async () => {
    if (!currentUser.username || !currentUser.email) {
      setErrorMessage("Nome e email são obrigatórios!");
      return;
    }
    try {
      if (modalMode === ModalMode.UPDATE && editingUserId) {
        const res = await updateUser(editingUserId, {
          _id: currentUser._id,
          createdAt: currentUser.createdAt,
          updatedAt: currentUser.updatedAt,
          password: currentUser.password,
          username: currentUser.username,
          email: currentUser.email,
          role: currentUser.role,
        });
        if (res && (res as ResponseError).error) {
          throw new CustomError((res as ResponseError).error, (res as ResponseError).statusCode)
        }
        successNotification("Sucesso!", "Usuário atualizado com sucesso");
      }
      setShowModal(false);
      setEditingUserId(null);
      fetchUsers();
    } catch (err: any) {
      const errMsg = err.message || "Erro ao salvar usuário";
      errorNotification("Erro!", errMsg);
      setErrorMessage(errMsg);
    }
  };

  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      const res = await deleteUser(userToDelete._id);
      if (res && (res as ResponseError).error) {
        throw new CustomError((res as ResponseError).error, (res as ResponseError).statusCode)
      }
      successNotification("Sucesso!", "Usuário deletado com sucesso");
      setShowConfirmModal(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (err: any) {
      const errMsg = err.message || "Erro ao deletar usuário";
      errorNotification("Erro!", errMsg);
      setErrorMessage(errMsg);
    }
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

      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <FaUserEdit className={styles.titleIcon} /> Gestão de Usuários
          </h2>
        </div>
        
        <section className={styles.filterSection}>
          <DynamicFilters
            filters={filterFields}
            name="Filtro de Usuários"
          />
        </section>

        {loading ? (
          <div className={styles.loadingContainer}>
            <ClockLoader color="#0a58ca" size={60} />
            <p className={styles.loadingText}>Carregando usuários...</p>
          </div>
        ) : (
          <>
            <div className={styles.tableContainer}>
              {users.length === 0 ? (
                <div className={styles.emptyState}>
                  Nenhum usuário encontrado.
                </div>
              ) : (
                <UserTable
                  users={users}
                  onEdit={openUpdateModal}
                  onDelete={(userId: string) => {
                    setUserToDelete(
                      users.find((u) => u._id === userId) || null
                    );
                    setShowConfirmModal(true);
                  }}
                />
              )}
            </div>
            
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.paginationButton}
                  onClick={() =>
                    setCurrentPage(Math.max(1, currentPage - 1))
                  }
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
          </>
        )}
      </div>

      {/* Modal de Criação/Atualização */}
      {showModal && (
        <CustomModalForm
          title={
            modalMode === ModalMode.CREATE
              ? "Criar Novo Usuário"
              : "Atualizar Usuário"
          }
          onClose={() => setShowModal(false)}
          onSubmit={handleSaveUser}
          fields={[
            {
              name: "username",
              label: "Nome",
              type: "text",
              value: currentUser.username,
              placeholder: "Digite o nome do usuário",
              onChange: (val: string) =>
                setCurrentUser((prev) => ({ ...prev, username: val })),
            },
            {
              name: "email",
              label: "Email",
              type: "email",
              value: currentUser.email,
              placeholder: "Digite o email do usuário",
              onChange: (val: string) =>
                setCurrentUser((prev) => ({ ...prev, email: val })),
            },
            {
              name: "role",
              label: "Papel",
              type: "select",
              value: currentUser.role,
              options: [
                { label: "Administrador", value: "ADMIN" },
                { label: "Visualizador", value: "VIEWER" },
              ],
              onChange: (val: string) =>
                setCurrentUser((prev) => ({ ...prev, role: val as Role })),
            },
          ]}
        />
      )}

      {/* Modal de confirmação de exclusão */}
      {showConfirmModal && (
        <ConfirmModal
          title="Confirmar Exclusão"
          message="Tem certeza de que deseja excluir este usuário? Esta ação não pode ser desfeita."
          onConfirm={handleDeleteUser}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </>
  );
}
