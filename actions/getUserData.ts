"use server";
import { ResponseError } from "@/types/types";
import { User} from "@/types/user";
import { decodeToken } from "@/utils/authUtils";
import { CustomError } from "@/utils/customError";
import { CustomConsole } from "@/utils/customLogger";
import { cookies } from "next/headers";

const consoler = new CustomConsole();
const urlApi = process.env.API_URL || "http://localhost:5000";

export const getUserData = async (): Promise<Omit<User, 'password'> | ResponseError> => {
  consoler.process(`🔁 Initing process to get UserData`);
  //get token from cookie
  const token = (await cookies()).get('access_token')
  if(!token) {
    return {
      error: " Token not received",
      statusCode: 401,
    }
  }
  //get id from token
  const {id} = decodeToken(token!.value)

  try {
    const response = await fetch(`${urlApi}/user/getUserById?userId=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token!.value}`,
      }
    });
    

    //verify if response was ok
    if (!response.ok) {
      const errorMessage: ResponseError = await response.json();
      consoler.error(
        `Error to get user data, error: ${errorMessage?.error}, statusCode: ${response.status}`
      );
      return errorMessage;
    }
    //get info as json
    const responseBody: User = await response.json();
    consoler.success(`Getted data from user: ${responseBody.username}`);
 
    return responseBody;
  } catch (error: any) {
    // Captura de erros em qualquer ponto
    consoler.error(
      `Error to fetch data user, error: ${error.message}, statusCode: ${error.statusCode || 500}`
    );
    throw new CustomError(
      error.message,
      error.statusCode || 500
    );
  }
};
