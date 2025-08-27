"use server";
import { cookies } from "next/headers";
import { CustomConsole } from "@/utils/customLogger";
import { CustomError } from "@/utils/customError";
import errorMessages from "@/utils/errorMessages.json";
import { ResponseError } from "@/types/types";
import { User } from "@/types/user";
import { CookieManager, ICookiesManager } from "@/utils/cookies-manager";

const consoler = new CustomConsole();
const cookieManager:ICookiesManager = await new CookieManager()
const urlApi = process.env.API_URL || "http://localhost:5000";
// ...existing imports...

export const listUsersPaginated = async ({
  page,
  pageSize,
  filter,
}: {
  page: number;
  pageSize: number;
  filter: {
    username?: string;
    email?: string;
    role?: string;
    _id?: string;
  };
}): Promise<{ users: User[]; totalPages: number } | ResponseError> => {
  consoler.process("🔁 Iniciando busca paginada de usuários");
  const token = (await cookies()).get("access_token");
  if (!token) {
    return { error: "Token não recebido", statusCode: 401 };
  }
  try {
    const response = await fetch(`${urlApi}/user/listUsersPaginated`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify({
        page,
        pageSize,
        filter,
      }),
    });
    if (!response.ok) {
      const errorMessage: ResponseError = await response.json();
      consoler.error(`Erro ao buscar usuários: ${errorMessage?.error}`);
      return {
        error: getUserErrorMessage("listUsersPaginated", response.status),
        statusCode: response.status,
      };
    }
    const data = await response.json();
    return {
      users: data.users || [],
      totalPages: data.totalPages || 1,
    };
  } catch (error: any) {
    consoler.error(`Erro ao buscar usuários: ${error.message}`);
    throw new CustomError(
      getUserErrorMessage("listUsersPaginated", error.statusCode || 500),
      error.statusCode || 500
    );
  }
};

export const createUser = async (
  user: Partial<User>
): Promise<User | ResponseError> => {
  consoler.process("🔁 Criando usuário");
  const token = (await cookies()).get("access_token");
  if (!token) {
    return { error: "Token não recebido", statusCode: 401 };
  }
  try {
    const response = await fetch(`${urlApi}/user/createUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      const errorMessage: ResponseError = await response.json();
      consoler.error(`Erro ao criar usuário: ${errorMessage?.error}`);
      return {
        error: getUserErrorMessage("createUser", response.status),
        statusCode: response.status,
      };
    }
    return await response.json();
  } catch (error: any) {
    consoler.error(`Erro ao criar usuário: ${error.message}`);
    throw new CustomError(
      getUserErrorMessage("createUser", error.statusCode || 500),
      error.statusCode || 500
    );
  }
};

export const getAccessToken = async (
  userId: string
): Promise<string | ResponseError> => {
  consoler.process("🔁 Pegando um novo token de usuário");
  const token = (await cookies()).get("access_token");
  if (!token) {
    return { error: "Token não recebido", statusCode: 401 };
  }
  try {
    const response = await fetch(`${urlApi}/user/getAccessToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify(userId),
    });
    if (!response.ok) {
      const errorMessage: ResponseError = await response.json();
      consoler.error(`Erro ao pegar um token de usuário: ${errorMessage?.error}`);
      return {
        error: getUserErrorMessage("getAccessToken", response.status),
        statusCode: response.status,
      };
    }
    return (await response.json()).token;
  } catch (error: any) {
    consoler.error(`Erro ao pegar um token de usuário: ${error.message}`);
    throw new CustomError(
      getUserErrorMessage("getAccessToken", error.statusCode || 500),
      error.statusCode || 500
    );
  }
};

export const updateUser = async (
  id: string,
  user: Partial<User>
): Promise<User | ResponseError> => {
  consoler.process("🔁 Atualizando usuário");
  const token = (await cookies()).get("access_token");
  if (!token) {
    return { error: "Token não recebido", statusCode: 401 };
  }

  try {
    const response = await fetch(`${urlApi}/user/updateUser/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify({
        user: user
      }),
    });
    if (!response.ok) {
      const errorMessage: ResponseError = await response.json();
      consoler.error(`Erro ao atualizar usuário: ${errorMessage.statusCode}`);
      return {
        error: getUserErrorMessage("updateUser", errorMessage.statusCode),
        statusCode: errorMessage?.statusCode,
      };
    }
    return await response.json();
  } catch (error: any) {
    consoler.error(`Erro ao atualizar usuário: ${error.message}`);
    throw new CustomError(
      getUserErrorMessage("updateUser", error.statusCode || 500),
      error.statusCode || 500
    );
  }
};

export const deleteUser = async (
  id: string
): Promise<boolean | ResponseError> => {
  consoler.process("🔁 Deletando usuário");
  const token = (await cookies()).get("access_token");
  if (!token) {
    return { error: "Token não recebido", statusCode: 401 };
  }
  try {
    const response = await fetch(`${urlApi}/user/deleteUser`, {
      method: "DELETE",
      body: JSON.stringify({ userId: id }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
    });
    if (!response.ok) {
      const errorMessage: ResponseError = await response.json();
      consoler.error(`Erro ao deletar usuário: ${errorMessage?.error}`);
      return {
        error: getUserErrorMessage("deleteUser", response.status),
        statusCode: response.status,
      };
    }
    await cookieManager.removeCookie("access_token")
    return true;
  } catch (error: any) {
    consoler.error(`Erro ao deletar usuário: ${error.message}`);
    throw new CustomError(
      getUserErrorMessage("deleteUser", error.statusCode || 500),
      error.statusCode || 500
    );
  }
};

export const getUserById = async (
  userId: string
): Promise<User | ResponseError> => {
  const token = (await cookies()).get("access_token");
  if (!token) {
    return { error: "Token não recebido", statusCode: 401 };
  }
  try {
    const response = await fetch(
      `${urlApi}/user/getUserById?userId=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.value}`,
        },
      }
    );
    if (!response.ok) {
      const errorMessage: ResponseError = await response.json();
      return {
        error: errorMessage?.error || "Erro ao buscar usuário por ID",
        statusCode: response.status,
      };
    }
    const responseBody: User = await response.json();
    return responseBody;
  } catch (error: any) {
    return {
      error: error.message || "Erro desconhecido ao buscar usuário por ID",
      statusCode: 500,
    };
  }
};

function getUserErrorMessage(context: string, statusCode: number): string {
  const userErrors = errorMessages.userErros as any;
  return userErrors[context]?.statusCode?.[statusCode] || "Erro desconhecido.";
}
