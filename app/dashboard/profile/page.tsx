"use client";
import { Button } from "@/components/buttons";
import { useUser } from "@/hooks/userHook";
import { Role } from "@/types/user";
import { Timer, User } from "lucide-react";
import { HiIdentification } from "react-icons/hi";
import { MdEmail } from "react-icons/md";
import { ClockLoader } from "react-spinners";
import styles from "./profile.module.css";
import { useRequest } from "@/hooks/useRequest";
import { logoutAction } from "@/actions/logoutAction";
import { useError } from "@/hooks/useError";
import { ErrorBox } from "@/components/ErrorBox";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { user, setUser, loading } = useUser();
  const { sendRequest } = useRequest();
  const { errorMessage, setErrorMessage } = useError();
  const router = useRouter()
  console.log(user);

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

  async function handleLogout() {
    try {
      const response = await sendRequest(logoutAction);
        window.location.href="/login"
    } catch (error: any) {
        console.log(error)
      let errorMsg = error.message || "Erro Desconhecido";
      setErrorMessage(errorMsg);
    }
  }

  console.log(loading)
  return (
    <>
      {errorMessage ? (
        <ErrorBox
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          otherClassName=""
        />
      ) : (
        <></>
      )}
      <div
        className={`w-100 h-100 d-flex justify-content-center flex-column align-items-center`}
      >
        {!loading && user? (
          <>
            <div className={`bg-light p-5 ${styles.cardProfile}`}>
              {/** Aqui fica o header */}
              <div className="d-flex align-items-center">
                <User
                  className="m-3 bg-primary rounded-circle p-3 justify-content-around text-light"
                  size={100}
                />
                <h1>{user?.username}</h1>
              </div>
              <hr className=" rounded-pill w-100 border border-primary border-2"></hr>
              {/**Aqui fica o body */}
              <div className="d-flex align-items-start flex-column">
                <p className="w-100">
                  <MdEmail className="me-2" color="#0d6efd" size={30} />
                  Email: {user?.email}
                </p>
                <p>
                  <HiIdentification
                    className="me-2"
                    color="#0d6efd"
                    size={30}
                  />
                  Você é um:{" "}
                  {user?.role == Role.ADMIN ? "Administrador" : "Visualizador"}
                </p>
                <p>
                  <Timer className="me-2" color="#0d6efd" size={30} />
                  Perfil Criado em: {timeSince(new Date(user?.createdAt!))}
                </p>
              </div>
              <Button
                variant="danger"
                onClick={(e) => {
                  handleLogout();
                }}
              >
                {" "}
                Sair da conta
              </Button>
            </div>
          </>
        ) : (
          <ClockLoader color="#0d6efd" size={100}/>
        )}
      </div>
    </>
  );
}
