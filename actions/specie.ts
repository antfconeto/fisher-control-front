"use server";
import { Specie } from "@/types/types";
import { ResponseError } from "@/types/types";
import { CustomError } from "@/utils/customError";
import { CustomConsole } from "@/utils/customLogger";
import { cookies } from "next/headers";
import errorMessages from "@/utils/errorMessages.json";
const consoler = new CustomConsole();
const urlApi = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const createSpecie = async (
  specie: Specie
): Promise<Specie | ResponseError> => {
  console.log(`🔁 Initing process to create specie`, { specie });
  //get token from cookie
  const token = (await cookies()).get("access_token");
  if (!token) {
    return {
      error: " Token not received",
      statusCode: 401,
    };
  }
  try {
    const response = await fetch(`${urlApi}/specie/createSpecie`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token!.value}`,
      },
      body: JSON.stringify({ specie: specie }),
    });
    //verify if response was ok
    if (!response.ok) {
      const errorMessage: ResponseError = await response.json();
      consoler.error(
        `Error to create specie, error: ${errorMessage?.error}, statusCode: ${response.status}`
      );
      console.log(errorMessage);
      return {
        error: getSpecieErrorMessage("createSpecie", response.status),
        statusCode: response.status,
      };
    }
    //get info as json
    const responseBody: Specie = await response.json();
    consoler.success(`Created specie with code: ${responseBody.color}`);
    return responseBody;
  } catch (error: any) {
    // Captura de erros em qualquer ponto
    consoler.error(
      `Error to create specie, error: ${error.message}, statusCode: ${
        error.statusCode || 500
      }`
    );
    throw new CustomError(
      getSpecieErrorMessage("createSpecie", error.statusCode || 500),
      error.statusCode || 500
    );
  }
};

export const deleteSpecie = async (
  specieId: string
): Promise<boolean | ResponseError> => {
  console.log(`🔁 Initing process to delete specie`);
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
      `${urlApi}/specie/deleteSpecie?specieId=${specieId}`,
      {
        method: "DELETE",
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
        `Error to delete specie, error: ${errorMessage?.error}, statusCode: ${response.status}`
      );
      console.log(errorMessage);
      return {
        error: getSpecieErrorMessage("deleteSpecie", response.status),
        statusCode: response.status,
      };
    }
    //get info as json
    const responseBody: { isDeleted: boolean } = await response.json();
    consoler.success(`Deleted specie with code: ${responseBody}`);
    return responseBody.isDeleted;
  } catch (error: any) {
    // Captura de erros em qualquer ponto
    consoler.error(
      `Error to delete specie, error: ${error.message}, statusCode: ${
        error.statusCode || 500
      }`
    );
    throw new CustomError(
      getSpecieErrorMessage("deleteSpecie", error.statusCode || 500),
      error.statusCode || 500
    );
  }
};

export const updateSpecie = async (
  specie: Specie
): Promise<Specie | ResponseError> => {
  console.log(`🔁 Initing process to update specie`, { specie });
  //get token from cookie
  const token = (await cookies()).get("access_token");
  if (!token) {
    return {
      error: " Token not received",
      statusCode: 401,
    };
  }
  try {
    const response = await fetch(`${urlApi}/specie/updateSpecie`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token!.value}`,
      },
      body: JSON.stringify({ specie: specie }),
    });
    //verify if response was ok
    if (!response.ok) {
      const errorMessage: ResponseError = await response.json();
      consoler.error(
        `Error to update specie, error: ${errorMessage?.error}, statusCode: ${response.status}`
      );
      console.log(errorMessage);
      return {
        error: getSpecieErrorMessage("updateSpecie", response.status),
        statusCode: response.status,
      };
    }
    //get info as json
    const responseBody: Specie = await response.json();
    consoler.success(`Updated specie with code: ${responseBody.color}`);
    return responseBody;
  } catch (error: any) {
    // Captura de erros em qualquer ponto
    consoler.error(
      `Error to update specie, error: ${error.message}, statusCode: ${
        error.statusCode || 500
      }`
    );
    throw new CustomError(
      getSpecieErrorMessage("updateSpecie", error.statusCode || 500),
      error.statusCode || 500
    );
  }
};

export const getAllSpecies = async (): Promise<Specie[] | ResponseError> => {
  console.log(`🔁 Initing process to get all specie`);
  //get token from cookie
  const token = (await cookies()).get("access_token");
  if (!token) {
    return {
      error: " Token not received",
      statusCode: 401,
    };
  }
  try {
    const response = await fetch(`${urlApi}/specie/getAllSpecies`, {
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
        `Error to get all specie, error: ${errorMessage?.error}, statusCode: ${response.status}`
      );
      console.log(errorMessage);
      return {
        error: getSpecieErrorMessage("getAllSpecies", response.status),
        statusCode: response.status,
      };
    }
    //get info as json
    const responseBody: Specie[] = await response.json();
    consoler.success(`Getted all species with code`);
    return responseBody;
  } catch (error: any) {
    // Captura de erros em qualquer ponto
    consoler.error(
      `Error to get all specie, error: ${error.message}, statusCode: ${
        error.statusCode || 500
      }`
    );
    throw new CustomError(
      getSpecieErrorMessage("getAllSpecies", error.statusCode || 500),
      error.statusCode || 500
    );
  }
};

export const getAllQuantityAnimalsFromSpecie = async (
  specieId: string
): Promise<number | ResponseError> => {
  console.log(`🔁 Initing process to get all specie`);
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
      `${urlApi}/animal/getAllQuantityAnimalsFromSpecie`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token!.value}`,
        },
        body: JSON.stringify({ specieId: specieId }),
      }
    );
    //verify if response was ok
    if (!response.ok) {
      const errorMessage: ResponseError = await response.json();
      consoler.error(
        `Error to get all specie, error: ${errorMessage?.error}, statusCode: ${response.status}`
      );
      console.log(errorMessage);
      return {
        error: getSpecieErrorMessage(
          "getAllQuantityAnimalsFromSpecie",
          response.status
        ),
        statusCode: response.status,
      };
    }
    //get info as json
    const responseBody: number = await response.json();
    consoler.success(`Getted all species with code`);
    return responseBody;
  } catch (error: any) {
    // Captura de erros em qualquer ponto
    consoler.error(
      `Error to get all specie, error: ${error.message}, statusCode: ${
        error.statusCode || 500
      }`
    );
    throw new CustomError(
      getSpecieErrorMessage("getAllSpecies", error.statusCode || 500),
      error.statusCode || 500
    );
  }
};

export const getSpecieById = async (
  specieId: string
): Promise<Specie | ResponseError> => {
  console.log(`🔁 Initing process to get specie`, { specieId });
  //get token from cookie
  const token = (await cookies()).get("access_token");
  if (!token) {
    return {
      error: " Token not received",
      statusCode: 401,
    };
  }
  try {
    const response = await fetch(`${urlApi}/specie/getSpecieById`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token!.value}`,
      },
      body: JSON.stringify({ specieId: specieId }),
    });
    //verify if response was ok
    if (!response.ok) {
      const errorMessage: ResponseError = await response.json();
      consoler.error(
        `Error to retrieve specie, error: ${errorMessage?.error}, statusCode: ${response.status}`
      );
      console.log(errorMessage);
      return {
        error: getSpecieErrorMessage("getSpecieById", response.status),
        statusCode: response.status,
      };
    }
    //get info as json
    const responseBody: Specie = await response.json();
    consoler.success(`Retrieved specie with code: ${responseBody.color}`);
    return responseBody;
  } catch (error: any) {
    // Captura de erros em qualquer ponto
    consoler.error(
      `Error to retrieve specie, error: ${error.message}, statusCode: ${
        error.statusCode || 500
      }`
    );
    throw new CustomError(
      getSpecieErrorMessage("getSpecieById", error.statusCode || 500),
      error.statusCode || 500
    );
  }
};

function getSpecieErrorMessage(context: string, statusCode: number): string {
  const specieErros = errorMessages.specieErros as any;

  return (
    specieErros[context]?.statusCode?.[statusCode] ||
    "Erro ao tentar se comunicar com os nossos servidores"
  );
}
