"use server";
import { ResponseError } from "@/types/types";
import { UserCredentials, UserLoginResponse } from "@/types/user";
import { CookieManager, ICookiesManager } from "@/utils/cookies-manager";
import { CustomError } from "@/utils/customError";
import { CustomConsole } from "@/utils/customLogger";
import { NextApiRequest, NextApiResponse } from "next";

const consoler = new CustomConsole();
const urlApi = process.env.API_URL || "http://localhost:5000";
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
        `Erro ao fazer login para o usuário, erro: ${errorMessage?.error}, statusCode: ${response.status}`
      );
      
      return {
        error: errorMessage.error,
        statusCode: response.status,
      };
    }

    const responseBody: UserLoginResponse = await response.json();
    consoler.success(`Usuário logado com sucesso, email: ${data.email}`);

    await cookieManager.createCookie("access_token", responseBody.token);

    return responseBody;
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || "Erro desconhecido";

    consoler.error(
      `Erro ao tentar fazer login para o email: ${data.email}, erro: ${errorMessage}, statusCode: ${statusCode}`
    );

    return {
      error: errorMessage,
      statusCode: statusCode,
    };
  }
};
