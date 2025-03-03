import { OperationLog } from "@/types/types";

export interface ICustomConsole {
  log(message: string): void;
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  debug(message: string): void;
  success(message: string): void;
  process(message: string): void;
}
export class CustomConsole implements ICustomConsole {
  private prefix: string;

  constructor(prefix: string = "LOG") {
    this.prefix = prefix;
  }

  log(message: string): void {
    console.log(`[${this.prefix}] ${message}`);
  }

  success(message: string): void {
    console.log(`[${this.prefix}] - ${OperationLog.SUCCESS} - ${message}`);
  }

  process(message: string): void {
    console.log(`[${this.prefix}] - ${OperationLog.PROCESSING} - ${message}`);
  }

  info(message: string): void {
    console.info(`[${this.prefix}] - ${OperationLog.INFO} - ${message}`);
  }

  warn(message: string): void {
    console.warn(`[${this.prefix}] - ${OperationLog.WARNING} - ${message}`);
  }

  error(message: string): void {
    console.error(`[${this.prefix}] - ${OperationLog.ERROR} - ${message}`);
  }

  debug(message: string): void {
    if (process.env.DEBUG === "true") {
      console.debug(`[${this.prefix}] - ${OperationLog.INFO} - ${message}`);
    }
  }
}
