import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

export type EntityErrorPayload = {
  message: string;
  errors: {
    field: string;
    messages: string[];
    // errors: string[];
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
        (err) => `${err.field}: ${err.messages.join(", ")}`,
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

export const handleErrorApi = <T extends FieldValues>({
  error,
  setError,
  duration = 5000,
}: {
  error: unknown;
  setError?: UseFormSetError<T>;
  duration?: number;
}) => {
  if (error instanceof EntityError) {
    if (setError) {
      error.payload.errors.forEach(({ field, messages }) => {
        setError(field as Path<T>, {
          type: "server",
          message: messages[0],
        });
      });
    } else {
      toast.error("Validation Error", {
        description: error.message,
        duration,
        style: { whiteSpace: "pre-line" },
      });
    }
    return;
  }

  if (error instanceof HttpError) {
    toast.error("Error", { description: error.payload.message, duration });
    return;
  }

  if (typeof error === "object" && error && "message" in error) {
    toast.error("Error", {
      description: String((error as { message: unknown }).message),
      duration,
    });
    return;
  }

  toast.error("Error", { description: "Unknown error", duration });
};
