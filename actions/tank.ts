"use server";
import { Animal, AnimalPagination, ResponseError, Tank } from "@/types/types";
import { User } from "@/types/user";
import { decodeToken } from "@/utils/authUtils";
import { CustomError } from "@/utils/customError";
import { CustomConsole } from "@/utils/customLogger";
import { cookies } from "next/headers";
import * as errorMessages from "@/utils/errorMessages.json"

const consoler = new CustomConsole();
const urlApi = process.env.API_URL || "http://localhost:4000";

export const getTanks = async (tankName?:string): Promise<Tank[] | ResponseError> => {
    console.log(`🔁 Initing process to list All Tanks`);
    //get token from cookie
    const token = (await cookies()).get('access_token')
    if (!token) {
        return {
            error: " Token not received",
            statusCode: 401,
        }
    }
    try {
        const response = await fetch(`${urlApi}/tank/getTanks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token!.value}`,
            },
            body:JSON.stringify(
                {
                    tankName:tankName
                }
            )
        });
        //verify if response was ok
        if (!response.ok) {
            const errorMessage: ResponseError = await response.json();
            consoler.error(
                `Error to create animal, error: ${errorMessage?.error}, statusCode: ${response.status}`
            );
            return {
                error: getTankErrorMessage('getTanks', response.status),
                statusCode: response.status,
              };
        }
        //get info as json
        const responseBody: Tank[] = await response.json();
        console.log(`✅ Getted all tanks: `, responseBody.length)
        return responseBody;
    } catch (error: any) {
        // Captura de erros em qualquer ponto
        consoler.error(
            `Error to create animal, error: ${error.message}, statusCode: ${error.statusCode || 500}`
        );
        throw new CustomError(getTankErrorMessage('getTanks', error.statusCode || 500), error.statusCode || 500);
    }
};

export const getTankById = async (tankId?:string): Promise<Tank | ResponseError> => {
    console.log(`🔁 Initing process to get tank with id: ${tankId}`);
    //get token from cookie
    const token = (await cookies()).get('access_token')
    if (!token) {
        return {
            error: " Token not received",
            statusCode: 401,
        }
    }
    try {
        const response = await fetch(`${urlApi}/tank/getTankById?tankId=${tankId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token!.value}`,
            },
        });
        //verify if response was ok
        if (!response.ok) {
            const errorMessage: ResponseError = await response.json();
            consoler.error(
                `Error to get tank by id, error: ${errorMessage?.error}, statusCode: ${response.status}`
            );
            return {
                error: getTankErrorMessage('getTankById', response.status),
                statusCode: response.status,
              };
        }
        //get info as json
        const responseBody: Tank = await response.json();
        console.log(`✅ Getted tank: `, responseBody)
        return responseBody;
    } catch (error: any) {
        // Captura de erros em qualquer ponto
        consoler.error(
            `Error to get tank by id, error: ${error.message}, statusCode: ${error.statusCode || 500}`
        );
        throw new CustomError(getTankErrorMessage('getTankById', error.statusCode || 500), error.statusCode || 500);
    }
};


function getTankErrorMessage(context: string, statusCode: number): string {
    const tankErrors = errorMessages.tankErros as any
    return (
      tankErrors[context]?.statusCode?.[statusCode] ||
      'Erro ao tentar se comunicar com os nossos servidores'
    );
  }
  