"use server";
import * as errorMessages from "@/utils/errorMessages.json"
import { ResponseError } from "@/types/types";
import { cookies } from "next/headers";
import { decodeToken } from "@/utils/authUtils";
import { CustomError } from "@/utils/customError";
const API_URL = process.env.API_URL || "http://localhost:4000";

/**
 * Sends a request to join a Fish Manager.
 * @param userId - The ID of the user making the request.
 * @param fishManagerId - The ID of the Fish Manager to join.
 * @returns A boolean indicating whether the request was successful.
 * @throws {ResponseError} If the request fails.
 */
export async function requestToJoinFishManager(
  fishManagerId: string
): Promise<boolean | ResponseError> {
  try {
      const token = (await cookies()).get('access_token')
      if(!token) {
        return {
          error: " Token not received",
          statusCode: 401,
        }
      }
      //get id from token
      const {id} = decodeToken(token!.value)

    const response = await fetch(`${API_URL}/fishManager/requestToJoin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token!.value}`,
      },
      body: JSON.stringify({ userId:id, fishManagerId }),
    });

    if (!response.ok) {
      const error: ResponseError = await response.json();
      console.error(
        `❌ Error requesting to join Fish Manager: ${error.error}, Status Code: ${response.status}`
      );
        return {
          error: getFishManagerErrorMessage('requestToJoin', response.status),
          statusCode: response.status,
        };
      
    }

    const result: boolean = await response.json();
    console.info(`✅ Successfully requested to join Fish Manager: ${fishManagerId}`);
    return result;
  } catch (error: any) {
    console.error(`❌ Error in requestToJoinFishManager: ${error.message}`);
    throw new CustomError(getFishManagerErrorMessage('requestToJoin', error.statusCode || 500), error.statusCode || 500);
  }
}

function getFishManagerErrorMessage(context: string, statusCode: number): string {
  const fishManagerErros = errorMessages.fishManager as any
  return (
    fishManagerErros[context][statusCode] ||
    'Erro desconhecido.'
  );
}
