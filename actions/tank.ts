'use server';
import { ResponseError, Tank } from '@/types/types';
import { CustomError } from '@/utils/customError';
import { CustomConsole } from "@/utils/customLogger";
import { cookies } from "next/headers";
import errorMessages from "@/utils/errorMessages.json";
import { Role } from '@/types/user';

const consoler = new CustomConsole();
const urlApi = process.env.API_URL || "http://localhost:5000";

export const getTanks = async (
  tankName?: string
): Promise<Tank[] | ResponseError> => {

  //get token from cookie
  const token = (await cookies()).get("access_token");
  if (!token) {
    return {
      error: " Token not received",
      statusCode: 401,
    };
  }
  try {
    const response = await fetch(`${urlApi}/tank/getTanks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token!.value}`,
      },
      body: JSON.stringify({
        tankName: tankName,
      }),
    });
    //verify if response was ok
    if (!response.ok) {
      const errorMessage: ResponseError = await response.json();
      consoler.error(
        `Error to create animal, error: ${errorMessage?.error}, statusCode: ${response.status}`
      );
      return {
        error: getTankErrorMessage("getTanks", response.status),
        statusCode: response.status,
      };
    }
    //get info as json
    const responseBody: Tank[] = await response.json();

    return responseBody;
  } catch (error: any) {
    // Captura de erros em qualquer ponto
    consoler.error(
      `Error to create animal, error: ${error.message}, statusCode: ${
        error.statusCode || 500
      }`
    );
    throw new CustomError(
      getTankErrorMessage("getTanks", error.statusCode || 500),
      error.statusCode || 500
    );
  }
};

export const getTankById = async (
  tankId?: string
): Promise<Tank | ResponseError> => {

  //get token from cookie
  const token = (await cookies()).get("access_token");
  if (!token) {
    return {
      error: " Token not received",
      statusCode: 401,
    };
  }
  try {
    const response = await fetch(
      `${urlApi}/tank/getTankById?tankId=${tankId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token!.value}`,
        },
      }
    );
    //verify if response was ok
    if (!response.ok) {
      const errorMessage: ResponseError = await response.json();
      consoler.error(
        `Error to get tank by id, error: ${errorMessage?.error}, statusCode: ${response.status}`
      );
      return {
        error: getTankErrorMessage("getTankById", response.status),
        statusCode: response.status,
      };
    }
    //get info as json
    const responseBody: Tank = await response.json();

    return responseBody;
  } catch (error: any) {
    // Captura de erros em qualquer ponto
    consoler.error(
      `Error to get tank by id, error: ${error.message}, statusCode: ${
        error.statusCode || 500
      }`
    );
    throw new CustomError(
      getTankErrorMessage("getTankById", error.statusCode || 500),
      error.statusCode || 500
    );
  }
};

export const createTank = async (tank: Tank, userRole?: Role): Promise<Tank | ResponseError> => {

  const token = (await cookies()).get("access_token");
  if (!token) {
    return {
      error: "Token not received",
      statusCode: 401,
    };
  }
  try {
    const response = await fetch(`${urlApi}/tank/createTank`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token!.value}`,
        'x-role': userRole ?? 'undefined'
      },
      body: JSON.stringify({ tank }),
    });

    if (!response.ok) {
      const errorMessage: ResponseError = await response.json();
      consoler.error(
        `Error to create tank, error: ${errorMessage?.error}, statusCode: ${response.status}`
      );
      return {
        error: getTankErrorMessage("createTank", response.status),
        statusCode: response.status,
      };
    }

    const responseBody: Tank = await response.json();

    return responseBody;
  } catch (error: any) {
    consoler.error(
      `Error to create tank, error: ${error.message}, statusCode: ${
        error.statusCode || 500
      }`
    );
    throw new CustomError(
      getTankErrorMessage("createTank", error.statusCode || 500),
      error.statusCode || 500
    );
  }
};

export const updateTank = async (tank: Tank, userRole?: Role): Promise<Tank | ResponseError> => {

  const token = (await cookies()).get("access_token");
  if (!token) {
    return {
      error: "Token not received",
      statusCode: 401,
    };
  }
  try {
    const response = await fetch(`${urlApi}/tank/updateTank`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token!.value}`,
        'x-role': userRole ?? 'undefined'
      },
      body: JSON.stringify({ tank }),
    });

    if (!response.ok) {
      const errorMessage: ResponseError = await response.json();
      consoler.error(
        `Error to update tank, error: ${errorMessage?.error}, statusCode: ${response.status}`
      );
      return {
        error: getTankErrorMessage("updateTank", response.status),
        statusCode: response.status,
      };
    }

    const responseBody: Tank = await response.json();

    return responseBody;
  } catch (error: any) {
    consoler.error(
      `Error to update tank, error: ${error.message}, statusCode: ${
        error.statusCode || 500
      }`
    );
    throw new CustomError(
      getTankErrorMessage("updateTank", error.statusCode || 500),
      error.statusCode || 500
    );
  }
};

export const deleteTank = async (
  tankId: string,
  userRole?: Role
): Promise<void | ResponseError> => {

  const token = (await cookies()).get("access_token");
  if (!token) {
    return {
      error: "Token not received",
      statusCode: 401,
    };
  }
  try {
    const response = await fetch(`${urlApi}/tank/deleteTank`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token!.value}`,
        'x-role': userRole ?? 'undefined'
      },
      body: JSON.stringify({ tankId }),
    });

    if (!response.ok) {
      const errorMessage: ResponseError = await response.json();
      consoler.error(
        `Error to delete tank, error: ${errorMessage?.error}, statusCode: ${response.status}`
      );
      return {
        error: getTankErrorMessage("deleteTank", response.status),
        statusCode: response.status,
      };
    }


  } catch (error: any) {
    consoler.error(
      `Error to delete tank, error: ${error.message}, statusCode: ${
        error.statusCode || 500
      }`
    );
    throw new CustomError(
      getTankErrorMessage("deleteTank", error.statusCode || 500),
      error.statusCode || 500
    );
  }
};

function getTankErrorMessage(context: string, statusCode: number): string {
  const tankErrors = errorMessages.tankErros as any;
  return (
    tankErrors[context]?.statusCode?.[statusCode] ||
    "Erro ao tentar se comunicar com os nossos servidores"
  );
}
