"use client";
import { Button } from "@/components/Buttons/Buttons";
import { useUser } from "@/hooks/userHook";
import { Role } from "@/types/user";
import { Check, LogOut, Mail, User as UserIcon } from "lucide-react";
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

export default function Profile() {
  const { user, loading } = useUser();
  const { sendRequest } = useRequest();
  const { errorMessage, setErrorMessage } = useError();
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  function handleClose() {
    setShowEditModal(false);
  }

  function handleShow() {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
      });
    }
    setShowEditModal(true);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleClose();
    alert("Perfil atualizado com sucesso!");
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

  if (errorMessage) {
    return (
      <ErrorBox
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        otherClassName=""
      />
    );
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
      <div className="page-container">
        <div className="content-container">
          {/* Informações do Perfil */}
          <div className="content-card">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="card-title mb-0">
                <UserIcon className="me-2 text-primary" /> Perfil do Usuário
              </h2>
            </div>

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
              <Button
                variant="primary"
                onClick={handleShow}
                otherClassName="d-flex align-items-center"
              >
                <MdEdit className="me-2" size={18} /> Editar Perfil
              </Button>
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
                variant="danger"
                onClick={handleLogout}
                otherClassName="d-flex align-items-center"
              >
                <LogOut size={18} className="me-2" /> Sair da conta
              </Button>
            </div>
          </div>
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
    </>
  );
}
