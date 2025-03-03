"use server";
import { ResponseError } from "@/types/types";
import { User, UserCredentials, UserLoginResponse } from "@/types/user";
import { CookieManager, ICookiesManager } from "@/utils/cookies-manager";
import { CustomError } from "@/utils/customError";
import { CustomConsole } from "@/utils/customLogger";

const consoler = new CustomConsole();
const urlApi = process.env.API_URL || "http://localhost:5000";
const cookieManager:ICookiesManager = await new CookieManager()

export const signUpAction = async (data: User): Promise<UserLoginResponse | ResponseError> => {
  consoler.process(`🔁 Initing process to SignUp for user with email: ${JSON.stringify(data)}`);
  
  try {
    const response = await fetch(`${urlApi}/user/signUp`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: data }),
    });

    if (!response.ok) {
      const errorMessage: ResponseError = await response.json();
      consoler.error(
        `Error to signUp user, error: ${errorMessage?.error}, statusCode: ${response.status}`
      );
      return {
        error: errorMessage.error,
        statusCode: response.status,
      };
    }
    console.log(response.status)
    const responseBody: UserLoginResponse = await response.json();
    
    consoler.success(`User signpup  successfully with email: ${data.email}`);
    
    await cookieManager.createCookie('access_token', responseBody.token);
    return responseBody;
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || "Erro desconhecido";
    consoler.error(
      `Error to fetch signpup for email: ${data.email}, error: ${error.message}, statusCode: ${error.statusCode || 500}`
    );
    return {
      error: errorMessage,
      statusCode: statusCode,
    };
  }
};
