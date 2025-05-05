"use server";
import { Animal, AnimalPagination, ResponseError } from "@/types/types";
import { CustomError } from "@/utils/customError";
import { CustomConsole } from "@/utils/customLogger";
import { cookies } from "next/headers";
import * as errorMessages from "@/utils/errorMessages.json"

const consoler = new CustomConsole();
const urlApi = process.env.API_URL || "http://localhost:4000";

export const createAnimal = async (animal:Animal): Promise<Animal | ResponseError> => {
    console.log(`🔁 Initing process to create Animal`, {animal:animal});
    //get token from cookie
    const token = (await cookies()).get('access_token')
    if (!token) {
        return {
            error: " Token not received",
            statusCode: 401,
        }
    }
    try {
        const response = await fetch(`${urlApi}/animal/createAnimal`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token!.value}`,
            },
            body:JSON.stringify({animal:animal})
        });
        //verify if response was ok
        if (!response.ok) {
            const errorMessage: ResponseError = await response.json();
            consoler.error(
                `Error to create animal, error: ${errorMessage?.error}, statusCode: ${response.status}`
            );
            console.log(errorMessage)
            return {
                error: getAnimalErrorMessage('createAnimal', response.status),
                statusCode: response.status,
              };
        }
        //get info as json
        const responseBody: Animal = await response.json();
        consoler.success(`Created animal with code: ${responseBody.codeAnimal}`);
        return responseBody;
    } catch (error: any) {
        // Captura de erros em qualquer ponto
        consoler.error(
            `Error to create animal, error: ${error.message}, statusCode: ${error.statusCode || 500}`
        );
        throw new CustomError(getAnimalErrorMessage('createAnimal', error.statusCode || 500), error.statusCode || 500);
    }
};

export const updateAnimal = async (animal:Animal): Promise<Animal | ResponseError> => {
    console.log(`🔁 Initing process to update Animal`, {animal:animal});
    //get token from cookie
    const token = (await cookies()).get('access_token')
    if (!token) {
        return {
            error: " Token not received",
            statusCode: 401,
        }
    }
    try {
        const response = await fetch(`${urlApi}/animal/updateAnimal`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token!.value}`,
            },
            body:JSON.stringify({animal:animal})
        });
        //verify if response was ok
        if (!response.ok) {
            const errorMessage: ResponseError = await response.json();
            consoler.error(
                `Error to update animal, error: ${errorMessage?.error}, statusCode: ${response.status}`
            );
            console.log(errorMessage)
            return {
                error: getAnimalErrorMessage('updateAnimal', response.status),
                statusCode: response.status,
              };
        }
        //get info as json
        const responseBody: Animal = await response.json();
        consoler.success(`Updated animal with code: ${responseBody.codeAnimal}`);
        return responseBody;
    } catch (error: any) {
        // Captura de erros em qualquer ponto
        consoler.error(
            `Error to update animal, error: ${error.message}, statusCode: ${error.statusCode || 500}`
        );
        throw new CustomError(getAnimalErrorMessage('updateAnimal', error.statusCode || 500), error.statusCode || 500);
    }
};


export const deleteAnimal = async (codeAnimal:string): Promise<Boolean | ResponseError> => {
    console.log(`🔁 Initing process to delete Animal`, {codeAnimal:codeAnimal});
    //get token from cookie
    const token = (await cookies()).get('access_token')
    if (!token) {
        return {
            error: " Token not received",
            statusCode: 401,
        }
    }
    try {
        const response = await fetch(`${urlApi}/animal/deleteAnimal`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token!.value}`,
            },
            body:JSON.stringify({animalCode:codeAnimal})
        });
        //verify if response was ok
        if (!response.ok) {
            const errorMessage: ResponseError = await response.json();
            consoler.error(
                `Error to delete animal, error: ${errorMessage?.error}, statusCode: ${response.status}`
            );
            console.log(errorMessage)
            return {
                error: getAnimalErrorMessage('deleteAnimal', response.status),
                statusCode: response.status,
              };
        }
        //get info as json
        const responseBody: {isDeleted:boolean} = await response.json();
        consoler.success(`Deleted animal with code: ${responseBody.isDeleted}`);
        return responseBody.isDeleted;
    } catch (error: any) {
        // Captura de erros em qualquer ponto
        consoler.error(
            `Error to update animal, error: ${error.message}, statusCode: ${error.statusCode || 500}`
        );
        throw new CustomError(getAnimalErrorMessage('updateAnimal', error.statusCode || 500), error.statusCode || 500);
    }
};

export const listAnimals = async (page:number,pageSize:number,   filter?:{
    tankId?:string,
    codeAnimal?:string,
    specie?:string,
    matriz_code?:string,
    gender?:"M" | "F",
    _id?:string
  }): Promise<AnimalPagination | ResponseError> => {
    console.log("🔁 Fetching all animals...", page,pageSize);
    const token = (await cookies()).get("access_token");
    if (!token) {
        return {
            error: "Token not received",
            statusCode: 401,
        };
    }
    try {
        let url = `${urlApi}/animal/listAnimals`
        console.log(url)
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token.value}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                page:page,
                pageSize:pageSize,
                filter:filter
            })
        });
        if (!response.ok) {
            const errorMessage: ResponseError = await response.json();
            consoler.error(
                `Error fetching animals, error: ${errorMessage?.error}, statusCode: ${response.status}`
            );
            return {
                error: getAnimalErrorMessage('listAnimals', response.status),
                statusCode: response.status,
              };
        }
        const responseBody: AnimalPagination = await response.json();
        consoler.success(`Fetched ${responseBody} animals successfully.`);
        return responseBody;
    } catch (error: any) {
        consoler.error(
            `Error fetching animals, error: ${error.message}, statusCode: ${error.statusCode || 500}`
        );
        throw new CustomError(getAnimalErrorMessage('listAnimals', error.statusCode || 500), error.statusCode || 500);
    }
};

export const getAllAnimalsFromTank = async (tankId:string): Promise<Animal[] | ResponseError> => {
    console.log("🔁 Fetching all animals...", tankId);
    const token = (await cookies()).get("access_token");
    if (!token) {
        return {
            error: "Token not received",
            statusCode: 401,
        };
    }
    try {
        let url = `${urlApi}/animal/getAllAnimalsFromTank?tankId=${tankId}`
        console.log(url)
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token.value}`,
                "Content-Type": "application/json",
            }
        });
        if (!response.ok) {
            const errorMessage: ResponseError = await response.json();
            consoler.error(
                `Error fetching animals, error: ${errorMessage?.error}, statusCode: ${response.status}`
            );
            return {
                error: getAnimalErrorMessage('listAnimals', response.status),
                statusCode: response.status,
              };
        }
        const responseBody: Animal[] = await response.json();
        consoler.success(`Fetched ${responseBody} animals successfully.`);
        return responseBody;
    } catch (error: any) {
        consoler.error(
            `Error fetching animals, error: ${error.message}, statusCode: ${error.statusCode || 500}`
        );
        throw new CustomError(getAnimalErrorMessage('listAnimals', error.statusCode || 500), error.statusCode || 500);
    }
};

function getAnimalErrorMessage(context: string, statusCode: number): string {
  const animalErros = errorMessages.animalErros as any

  return (
    animalErros[context]?.statusCode?.[statusCode] ||
    'Erro ao tentar se comunicar com os nossos servidores'
  );
}
