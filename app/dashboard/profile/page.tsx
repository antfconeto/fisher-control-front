"use client";
import { Button } from "@/components/buttons/buttons";
import { useUser } from "@/hooks/userHook";
import { Role, User } from "@/types/user";
import { Check, LogOut, Mail, User as UserIcon, Trash2 } from "lucide-react";
import { FaUser, FaCalendarAlt, FaClock, FaShieldAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { ClockLoader } from "react-spinners";
import styles from "./profile.module.css";
import { useRequest } from "@/hooks/useRequest";
import { logoutAction } from "@/actions/logoutAction";
import { useError } from "@/hooks/useError";
import { ErrorBox } from "@/components/ErrorBox";
import { useState } from "react";
import { Modal, Form } from "react-bootstrap";
import { ConfirmModal } from "@/components/Forms/ConfirmModal/ConfirmModal";
import { deleteUser, updateUser } from "@/actions/user";
import { ResponseError } from "@/types/types";
import { useNotification } from "@/contexts/notificationContext";

export default function Profile() {
  const { user, loading } = useUser();
  const { sendRequest } = useRequest();
  const { errorMessage, setErrorMessage } = useError();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState<Omit<User, "password" | "createdAt" | "updatedAt">>({
    _id:"",
    role: Role.VIEWER,
    username: "",
    email: "",
  });
  const { successNotification } = useNotification();

  function handleClose() {
    setShowEditModal(false);
  }

  function handleShow() {
    if (user) {
      setFormData({
        _id: user._id,
        role: user.role,
        username: user.username,
        email: user.email,
      });
    }
    setShowEditModal(true);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev: Omit<User, "password" | "createdAt" | "updatedAt">) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    let response = await updateUser(user._id, formData) as User | ResponseError;
    if ((response as ResponseError).error) {
      setErrorMessage((response as ResponseError).error);
    } else {
      successNotification("Perfil atualizado com sucesso!", "success");
    }
    window.location.href = "/dashboard/profile";
    handleClose();
  }
  function handleDeleteShow() {
    setShowDeleteModal(true);
  }

  function handleDeleteClose() {
    setShowDeleteModal(false);
  }

  async function handleDeleteUser() {
    if (!user) return;
    
    setIsDeleting(true);
    try {
      handleDeleteClose();
      let response =await deleteUser(user._id);
      if ((response as ResponseError).error) {
        setErrorMessage((response as ResponseError).error);
      } else {
        successNotification("Conta deletada com sucesso!", "success");
      }
      window.location.href = "/login";
    } catch (error: unknown) {
 
      const errorMsg =
        error instanceof Error ? error.message : "Erro ao deletar usuário";
      setErrorMessage(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  }

  function timeSince(date: Date): string {
    const now = new Date();
    let seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const years = Math.floor(seconds / (365 * 24 * 60 * 60));
    seconds %= 365 * 24 * 60 * 60;
    const months = Math.floor(seconds / (30 * 24 * 60 * 60));
    seconds %= 30 * 24 * 60 * 60;
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds %= 24 * 60 * 60;
    const hours = Math.floor(seconds / (60 * 60));
    seconds %= 60 * 60;
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;

    const parts = [];
    if (years > 0) parts.push(`${years} anos`);
    if (months > 0) parts.push(`${months} meses`);
    if (days > 0) parts.push(`${days} dias`);
    if (hours > 0) parts.push(`${hours} horas`);
    if (minutes > 0) parts.push(`${minutes} minutos`);
    if (seconds > 0) parts.push(`${seconds} segundos`);

    return parts.join(", ");
  }

  function formatDate(dateInput: Date | string): string {
    const date =
      typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  async function handleLogout() {
    try {
      await sendRequest(logoutAction);
      window.location.href = "/login";
    } catch (error: unknown) {
      console.log(error);
      const errorMsg =
        error instanceof Error ? error.message : "Erro Desconhecido";
      setErrorMessage(errorMsg);
    }
  }

  if (loading || !user) {
    return (
      <div className="loading-container">
        <ClockLoader color="#0a58ca" size={60} />
        <p className="loading-text">Carregando informações do perfil...</p>
      </div>
    );
  }

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
            <div className={styles.profileHeader}>
              <div className="d-flex align-items-center">
                <div className={styles.profilePicture}>
                  <UserIcon className="text-light" size={60} />
                </div>
                <div className="ms-3">
                  <h1 className={styles.profileName}>{user.username}</h1>
                  <div className={styles.profileRole}>
                    {user.role === Role.ADMIN
                      ? "Administrador"
                      : "Visualizador"}
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2">
                <Button
                  variant="primary"
                  onClick={handleShow}
                  otherClassName="d-flex align-items-center"
                >
                  <MdEdit className="me-2" size={18} /> Editar Perfil
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDeleteShow}
                  otherClassName="d-flex align-items-center"
                >
                  <Trash2 className="me-2" size={18} /> Deletar Conta
                </Button>
              </div>
            </div>

            {/* Cards de informações */}
            <div className="row mt-4">
              <div className="col-md-6 mb-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Informações Pessoais</h5>
                  </div>
                  <div className="card-body">
                    <div className={styles.infoItem}>
                      <div className={styles.infoIcon}>
                        <Mail size={22} />
                      </div>
                      <div>
                        <span className={styles.infoLabel}>Email:</span>
                        {user.email}
                      </div>
                    </div>

                    <div className={styles.infoItem}>
                      <div className={styles.infoIcon}>
                        <FaUser size={22} />
                      </div>
                      <div>
                        <span className={styles.infoLabel}>Tipo de Conta:</span>
                        {user.role === Role.ADMIN
                          ? "Administrador"
                          : "Visualizador"}
                      </div>
                    </div>

                    <div className={styles.infoItem}>
                      <div className={styles.infoIcon}>
                        <FaShieldAlt size={22} />
                      </div>
                      <div>
                        <span className={styles.infoLabel}>Status:</span>
                        <span
                          className={`${styles.statusBadge} ${styles.statusActive}`}
                        >
                          <Check size={14} className="me-1" /> Ativo
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Atividade da Conta</h5>
                  </div>
                  <div className="card-body">
                    <div className={styles.infoItem}>
                      <div className={styles.infoIcon}>
                        <FaCalendarAlt size={22} />
                      </div>
                      <div>
                        <span className={styles.infoLabel}>
                          Data de Criação:
                        </span>
                        {user.createdAt
                          ? formatDate(user.createdAt.toString())
                          : ""}
                      </div>
                    </div>

                    <div className={styles.infoItem}>
                      <div className={styles.infoIcon}>
                        <FaClock size={22} />
                      </div>
                      <div>
                        <span className={styles.infoLabel}>
                          Conta Ativa há:
                        </span>
                        {timeSince(new Date(user.createdAt || ""))}
                      </div>
                    </div>

                    <div className={styles.infoItem}>
                      <div className={styles.infoIcon}>
                        <FaUser size={22} />
                      </div>
                      <div>
                        <span className={styles.infoLabel}>
                          Última Atualização:
                        </span>
                        {user.updatedAt
                          ? formatDate(user.updatedAt.toString())
                          : "Não disponível"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Botão de Logout */}
            <div className="d-flex justify-content-center mt-3">
              <Button
                variant="secondary"
                onClick={handleLogout}
                otherClassName="d-flex align-items-center"
              >
                <LogOut size={18} className="me-2" /> Sair da conta
              </Button>
            </div>
          </div>

      {/* Modal de Edição */}
      <Modal show={showEditModal} onHide={handleClose} centered>
        <Modal.Header closeButton className={styles.modalHeader}>
          <Modal.Title>Editar Perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <Form.Label className={styles.formLabel}>
                Nome de Usuário
              </Form.Label>
              <Form.Control
                className={styles.formInput}
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <Form.Label className={styles.formLabel}>Email</Form.Label>
              <Form.Control
                className={styles.formInput}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={handleClose}
                otherClassName="me-2"
              >
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Salvar Alterações
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de Confirmação de Deletar */}
      {showDeleteModal && (
        <ConfirmModal
          title="Deletar Conta"
          message="Esta ação é irreversível. Ao deletar sua conta, todos os seus dados serão permanentemente removidos, você perderá acesso a todas as funcionalidades do sistema e não será possível recuperar sua conta posteriormente. Tem certeza de que deseja continuar?"
          onConfirm={handleDeleteUser}
          onCancel={handleDeleteClose}
          isSubmitting={isDeleting}
        />
      )}
    </>
  );
}
