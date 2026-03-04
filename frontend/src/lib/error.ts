import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

export type EntityErrorPayload = {
  message: string;
  errors: {
    field: string;
    errors: string[];
  }[];
};

export type HttpErrorPayload = {
  message: string;
  [key: string]: unknown;
};

export class HttpError extends Error {
  status: number;
  payload: HttpErrorPayload;
  constructor({
    status,
    payload,
  }: {
    status: number;
    payload: HttpErrorPayload;
  }) {
    super("Http Error");
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  status: 422;
  payload: EntityErrorPayload;
  constructor({
    status,
    payload,
  }: {
    status: 422;
    payload: EntityErrorPayload;
  }) {
    super({ status, payload });
    this.status = status;
    this.payload = payload;

    if (this.payload.errors) {
      const errorMessages = this.payload.errors.map(
        (err) => `${err.field}: ${err.errors.join(", ")}`,
      );
      this.message = errorMessages.join("; ");
    }
  }
}

export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export type ParsedError = {
  message: string;
  fieldErrors?: Record<string, string>;
};

export function parseApiError(error: unknown): ParsedError {
  if (error instanceof EntityError) {
    const fieldErrors: Record<string, string> = {};

    error.payload.errors.forEach(({ field, errors }) => {
      fieldErrors[field] = errors[0];
    });

    return {
      message: error.message,
      fieldErrors,
    };
  }

  if (error instanceof HttpError) {
    return { message: error.payload.message };
  }

  if (typeof error === "object" && error && "message" in error) {
    return {
      message: String((error as { message: unknown }).message),
    };
  }

  return { message: "Unknown error" };
}

export function getErrorMessage(error: unknown): string {
  const parsed = parseApiError(error);
  return parsed.message;
}

export const handleErrorApi = <T extends FieldValues>({
  error,
  setError,
  duration = 3000,
}: {
  error: unknown;
  setError?: UseFormSetError<T>;
  duration?: number;
}) => {
  const parsed = parseApiError(error);

  // form case
  if (setError && parsed.fieldErrors) {
    Object.entries(parsed.fieldErrors).forEach(([field, message]) => {
      setError(field as Path<T>, {
        type: "server",
        message,
      });
    });
    return;
  }

  // fallback toast
  toast.error("Error", {
    description: parsed.message,
    duration,
  });
};
