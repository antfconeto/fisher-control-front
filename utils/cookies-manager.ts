
import { cookies } from "next/headers";
import { CustomConsole } from "./customLogger";

export interface ICookiesManager{
    createCookie(name:string, data:any):Promise<boolean>;
    getCookie(name:string):Promise<any>;
    removeCookie(name:string):Promise<boolean>;
}

export class CookieManager implements ICookiesManager{
    private consoler:CustomConsole;
    constructor() {
        this.consoler = new CustomConsole()
    }
   async createCookie(name: string, data: any): Promise<boolean> {
        try {
            
            (await cookies()).set(name, data);
            this.consoler.success(`Cookie created with success`)
            return true
        } catch (error:any) {
            this.consoler.error(` Error creating cookie: ${error.message}`);
            return false
        }
    }
   async getCookie(name: string): Promise<any> {
        try {
            const response = await (await cookies()).get(name);
            this.consoler.success(` Cookie getted with success`)
            return response
        } catch (error:any) {
            this.consoler.error(` Error getting cookie: ${error.message}`);
            return false
        }
    }
    async removeCookie(name: string): Promise<boolean> {
        try {
            await (await cookies()).delete(name);
            this.consoler.success(` Cookie deleted with success`)
            return true
        } catch (error:any) {
            this.consoler.error(` Error deleting cookie: ${error.message}`);
            return false
        }
    }
}