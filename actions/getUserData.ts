"use server";
import { ResponseError } from "@/types/types";
import { User } from "@/types/user";
import { decodeToken } from "@/utils/authUtils";
import { CustomError } from "@/utils/customError";
import { CustomConsole } from "@/utils/customLogger";
import { cookies } from "next/headers";
import errorMessages from "@/utils/errorMessages.json";
import { redirect } from "next/navigation";

const consoler = new CustomConsole();
const urlApi = process.env.API_URL || "http://localhost:5000";

export const getUserData = async (): Promise<
  Omit<User, "password"> | ResponseError
> => {
  consoler.process(`🔁 Initing process to get UserData`);
  //get token from cookie
  const token = (await cookies()).get("access_token");
  if (!token) {
    consoler.warn(`Token not found in cookies`);
    return {
      error: "Token not received",
      statusCode: 401,
    };
  }

  try {
    //get id from token
    const { id } = decodeToken(token!.value);

    if (!id) {
      consoler.error(`No user ID found in token`);
      return {
        error: "Invalid token: no user ID",
        statusCode: 401,
      };
    }

    const response = await fetch(`${urlApi}/user/getUserById?userId=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token!.value}`,
      },
    });

    //verify if response was ok
    if (!response.ok) {
      const errorMessage: ResponseError = await response.json();
      consoler.error(
        `Error to get user data, error: ${errorMessage?.error}, statusCode: ${response.status}`
      );
      console.log(getUserErrorMessage("getData", response.status));
      return {
        error: getUserErrorMessage("getData", response.status),
        statusCode: response.status,
      };
    }
    //get info as json
    const responseBody: User = await response.json();
    consoler.success(`Getted data from user: ${responseBody.username}`);
    return responseBody;
  } catch (error: any) {
    // Captura de erros em qualquer ponto
    consoler.error(
      `Error to fetch data user, error: ${error.message}, statusCode: ${
        error.statusCode || 500
      }`
    );

    // Se for erro de decodificação de token, retornar erro 401
    if (error.message && error.message.includes("decode token")) {
      return {
        error: "Token inválido ou expirado",
        statusCode: 401,
      };
    }

    if (error.message == "fetch failed") {
      redirect("/api-error");
    }
    throw new CustomError(
      getUserErrorMessage("getData", error.statusCode || 500),
      error.statusCode || 500
    );
  }
};

function getUserErrorMessage(context: string, statusCode: number): string {
  const userErrors = (errorMessages as any).userErros;

  return userErrors[context]?.statusCode?.[statusCode] || "Erro desconhecido.";
}
