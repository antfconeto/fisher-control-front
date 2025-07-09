"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "../animals/animals.module.css";
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
  const itemsPerPage = 2;
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
      if ("error" in res) throw new Error(res.error);
      setUsers(res.users);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      setErrorMessage(err.message || "Erro ao buscar usuários");
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
      if (modalMode === ModalMode.CREATE) {
        const res = await createUser({
          username: currentUser.username,
          email: currentUser.email,
          role: currentUser.role,
        });
        if ("error" in res) throw new Error(res.error);
      } else if (modalMode === ModalMode.UPDATE && editingUserId) {
        const res = await updateUser(editingUserId, {
          username: currentUser.username,
          email: currentUser.email,
          role: currentUser.role,
        });
        if ("error" in res) throw new Error(res.error);
      }
      setShowModal(false);
      setEditingUserId(null);
      fetchUsers();
    } catch (err: any) {
      setErrorMessage(err.message || "Erro ao salvar usuário");
    }
  };

  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      const res = await deleteUser(userToDelete._id);
      if (typeof res !== "boolean" && "error" in res)
        throw new Error(res.error);
      setShowConfirmModal(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (err: any) {
      setErrorMessage(err.message || "Erro ao deletar usuário");
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

      <div className="page-container">
        <div className="content-container">
          <div className="content-card">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="card-title mb-0">
                <FaUserEdit className="me-2 text-primary" /> Gestão de Usuários
              </h2>
              <button className={styles.createButton} onClick={openCreateModal}>
                <FaPlus /> Criar Novo Usuário
              </button>
            </div>
            <section className={styles.filterSection}>
              <DynamicFilters
                filters={filterFields}
                name="Filtro de Usuários"
              />
            </section>
            {loading ? (
              <div className="loading-container">
                <ClockLoader color="#0a58ca" size={60} />
                <p className="loading-text">Carregando usuários...</p>
              </div>
            ) : (
              <>
                <div className={styles.tableContainer}>
                  {users.length === 0 ? (
                    <div className="w-100 text-center text-muted py-4">
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
        </div>
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
