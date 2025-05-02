"use server";
import { ResponseError } from "@/types/types";
import { User, UserCredentials, UserLoginResponse } from "@/types/user";
import { CookieManager, ICookiesManager } from "@/utils/cookies-manager";
import { CustomError } from "@/utils/customError";
import { CustomConsole } from "@/utils/customLogger";

const consoler = new CustomConsole();
const cookieManager:ICookiesManager = await new CookieManager()

export const logoutAction = async (): Promise<void | ResponseError> => {
  consoler.process(`🔁 Initing process to loggout`);
  
  try {
    await cookieManager.removeCookie("access_token")
  } catch (error: any) {
    consoler.error(
      `Error to fetch logout error: ${error.message}, statusCode: ${error.statusCode || 500}`
    );
    throw new CustomError(
      error.message,
      error.statusCode || 500
    );
  }
};
