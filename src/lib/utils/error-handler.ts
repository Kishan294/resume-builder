import { toast } from "sonner";
import { TRPCError } from "@trpc/server";

export interface AppError {
  code: string;
  message: string;
  details?: unknown;
}

export class AppErrorHandler {
  static handle(error: unknown, context?: string): AppError {
    console.error(`Error in ${context || "unknown context"}:`, error);

    if (error instanceof TRPCError) {
      return this.handleTRPCError(error);
    }

    if (error instanceof Error) {
      return {
        code: "UNKNOWN_ERROR",
        message: error.message,
        details: error.stack,
      };
    }

    return {
      code: "UNKNOWN_ERROR",
      message: "An unexpected error occurred",
      details: error,
    };
  }

  private static handleTRPCError(error: TRPCError): AppError {
    switch (error.code) {
      case "UNAUTHORIZED":
        return {
          code: "UNAUTHORIZED",
          message: "You must be logged in to perform this action",
        };
      case "FORBIDDEN":
        return {
          code: "FORBIDDEN",
          message: "You do not have permission to perform this action",
        };
      case "NOT_FOUND":
        return {
          code: "NOT_FOUND",
          message: "The requested resource was not found",
        };
      case "BAD_REQUEST":
        return {
          code: "BAD_REQUEST",
          message: "Invalid request data",
          details: error.cause,
        };
      case "INTERNAL_SERVER_ERROR":
        return {
          code: "INTERNAL_SERVER_ERROR",
          message: "An internal server error occurred",
        };
      default:
        return {
          code: error.code,
          message: error.message,
        };
    }
  }

  static showToast(error: AppError) {
    switch (error.code) {
      case "UNAUTHORIZED":
        toast.error("Please log in to continue");
        break;
      case "FORBIDDEN":
        toast.error("Access denied");
        break;
      case "NOT_FOUND":
        toast.error("Item not found");
        break;
      case "BAD_REQUEST":
        toast.error("Invalid data provided");
        break;
      default:
        toast.error(error.message);
    }
  }
}

export function withErrorHandling<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  context?: string
) {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      const appError = AppErrorHandler.handle(error, context);
      AppErrorHandler.showToast(appError);
      return null;
    }
  };
}
