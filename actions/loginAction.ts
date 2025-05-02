"use server";
import { ResponseError } from "@/types/types";
import { UserCredentials, UserLoginResponse } from "@/types/user";
import { CookieManager, ICookiesManager } from "@/utils/cookies-manager";
import { CustomError } from "@/utils/customError";
import { CustomConsole } from "@/utils/customLogger";
import * as errorMessages from "@/utils/errorMessages.json"

const consoler = new CustomConsole();
const urlApi = process.env.API_URL || "http://localhost:4000";
const cookieManager: ICookiesManager = await new CookieManager();

export const loginAction = async (data: UserCredentials): Promise<UserLoginResponse | ResponseError> => {
  consoler.process(`🔁 Iniciando processo de login para o usuário com email: ${data.email}`);

  try {
    const response = await fetch(`${urlApi}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: data }),
    });

    if (!response.ok) {
      const errorMessage: ResponseError = await response.json();
      consoler.error(
        `Erro ao fazer login para o usuário, erro: ${JSON.stringify(errorMessage)}, statusCode: ${response.status}`
      );
      
      return {
        error: getUserErrorMessage('login', response.status),
        statusCode: response.status,
      };
    }

    const responseBody: UserLoginResponse = await response.json();
    consoler.success(`Usuário logado com sucesso, email: ${data.email}`);

    await cookieManager.createCookie("access_token", responseBody.token);

    return responseBody;
  } catch (error: any) {
    console.log(error)
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || "Erro desconhecido";
    
    consoler.error(
      `Erro ao tentar fazer login para o email: ${data.email}, erro: ${errorMessage}, statusCode: ${statusCode}`
    );

    throw new CustomError(getUserErrorMessage('login', error.statusCode || 500), error.statusCode || 500);
  }
};

function getUserErrorMessage(context: string, statusCode: number): string {
  const userErrors = errorMessages.userErros as any

  return (
    userErrors[context]?.statusCode?.[statusCode] ||
    'Erro desconhecido.'
  );
}

