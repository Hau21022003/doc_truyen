import envConfig from "@/config";
import {
  EntityError,
  EntityErrorPayload,
  HttpError,
  HttpErrorPayload,
} from "@/lib/error";
import { HTTP_STATUS, SHARED_ENDPOINTS } from "@/shared/constants";
import { authEvents } from "@/shared/events/auth.events";
import { redirect } from "next/navigation";

// Biến để theo dõi trạng thái refresh token
let isRefreshing = false;
const refreshSubscribers: ((success: boolean) => void)[] = [];

type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
  params?: Record<string, string | number | boolean>;
  timeout?: number; // Thêm timeout option ms
};

export const isClient = () => typeof window !== "undefined";

/**
 * Xây dựng URL với params query
 */
const buildUrl = (
  url: string,
  baseURL: string,
  params?: Record<string, string | number | boolean>,
): string => {
  // Nếu url đã là URL đầy đủ, sử dụng nó trực tiếp
  const fullUrl = url.startsWith("http")
    ? url
    : `${baseURL.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;

  if (!params) return fullUrl;

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const separator = fullUrl.includes("?") ? "&" : "?";
  return `${fullUrl}${separator}${searchParams.toString()}`;
};

const parseResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return response.json() as Promise<T>;
  } else if (contentType?.includes("text/")) {
    return response.text() as unknown as Promise<T>;
  }

  return response.blob() as unknown as Promise<T>;
};

export const redirectToLogin = () => {
  // Phát sự kiện token hết hạn trước khi redirect
  authEvents.tokenExpired();

  if (typeof window !== "undefined") {
    window.location.href = "/login";
  } else {
    redirect("/login");
  }
};

/**
 * Thực hiện refresh token
 */
const handleRefreshToken = async (): Promise<boolean> => {
  if (isRefreshing) {
    // Nếu đang refresh, đợi kết quả
    return new Promise((resolve) => {
      refreshSubscribers.push(resolve);
    });
  }

  isRefreshing = true;

  try {
    const response = await fetch(
      `${envConfig.NEXT_PUBLIC_API_ENDPOINT}${SHARED_ENDPOINTS.AUTH.REFRESH}`,
      {
        method: "POST",
        credentials: "include",
      },
    );
    if (!response.ok) {
      throw new Error(`Refresh failed with status: ${response.status}`);
    }

    // Thông báo cho tất cả các request đang chờ rằng refresh thành công
    refreshSubscribers.forEach((resolve) => resolve(true));
    refreshSubscribers.length = 0;

    return true;
  } catch (error) {
    // Thông báo cho tất cả các request đang chờ rằng refresh thất bại
    refreshSubscribers.forEach((resolve) => resolve(false));
    refreshSubscribers.length = 0;

    // Chuyển hướng đến trang login
    redirectToLogin();

    return false;
  } finally {
    isRefreshing = false;
  }
};

/**
 * Xử lý lỗi từ API response
 */
const handleErrorResponse = async <T>(
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
  url: string,
  options: CustomOptions,
  errorResponse: { status: number; payload: any },
): Promise<{ status: number; payload: T }> => {
  switch (errorResponse.status) {
    case HTTP_STATUS.ENTITY_ERROR:
      throw new EntityError(
        errorResponse as {
          status: 422;
          payload: EntityErrorPayload;
        },
      );
    case HTTP_STATUS.UNAUTHORIZED:
      // trường hợp login xử lý như bình thường
      if (url === SHARED_ENDPOINTS.AUTH.LOGIN) {
        throw new HttpError(
          errorResponse as { status: number; payload: HttpErrorPayload },
        );
      }

      // Trường hợp không phải login thì refresh token
      const refreshSuccess = await handleRefreshToken();
      if (refreshSuccess) {
        // Gọi lại request ban đầu với token mới
        return request(method, url, options);
      }

      // Nếu refresh không thành công, chuyển sang login
      redirectToLogin();
      throw new HttpError(
        errorResponse as { status: number; payload: HttpErrorPayload },
      );

    default:
      throw new HttpError(
        errorResponse as { status: number; payload: HttpErrorPayload },
      );
  }
};

const processError = (error: unknown, timeout?: number): Error => {
  if (error instanceof Error && error.name === "AbortError") {
    return new Error(
      timeout ? `Request timeout after ${timeout}ms` : "Request was cancelled",
    );
  }

  if (error instanceof Error) return error;

  return new Error("Unknown error occurred");
};

/**
 * Tạo AbortController cho timeout nếu chưa có signal.
 * Sử dụng signal từ options hoặc từ timeout controller
 */
const resolveSignal = (
  timeout?: number,
  externalSignal?: AbortSignal | null,
): { signal?: AbortSignal; controller?: AbortController } => {
  if (externalSignal) return { signal: externalSignal };

  if (!timeout) return {};

  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeout);

  return { signal: controller.signal, controller };
};

const request = async <T>(
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
  url: string,
  options: CustomOptions = {},
): Promise<{ status: number; payload: T }> => {
  const {
    params,
    body,
    headers = {},
    timeout,
    signal,
    // Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì lấy từ envConfig.NEXT_PUBLIC_API_ENDPOINT
    // Nếu truyền baseUrl thì lấy giá trị truyền vào
    // Truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến Next.js Server
    baseUrl = envConfig.NEXT_PUBLIC_API_ENDPOINT,
    ...fetchOptions
  } = options;

  let parsedBody: FormData | string | undefined = undefined;
  if (body instanceof FormData) {
    parsedBody = body;
  } else if (body) {
    parsedBody = JSON.stringify(body);
  }

  const baseHeaders: {
    [key: string]: string;
  } =
    parsedBody instanceof FormData
      ? {}
      : {
          "Content-Type": "application/json",
        };

  const fullUrl = buildUrl(url, baseUrl, params);

  const { signal: finalSignal } = resolveSignal(timeout, signal);

  const requestOptions: RequestInit = {
    ...fetchOptions,
    credentials: "include",
    headers: {
      ...baseHeaders,
      ...headers,
    },
    body: parsedBody,
    method,
    signal: finalSignal,
  };

  try {
    const res = await fetch(fullUrl, requestOptions);

    const payload = await parseResponse<Response>(res);

    const data = {
      status: res.status,
      payload: payload as T,
    };

    if (!res.ok) {
      return handleErrorResponse(method, url, options, data);
    }

    return data;
  } catch (error) {
    throw processError(error, timeout);
  }
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined,
  ) {
    return request<Response>("GET", url, options);
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined,
  ) {
    return request<Response>("POST", url, { ...options, body });
  },
  put<Response>(
    url: string,
    body?: any,
    options?: Omit<CustomOptions, "body"> | undefined,
  ) {
    return request<Response>("PUT", url, { ...options, body });
  },
  patch<Response>(
    url: string,
    body?: any,
    options?: Omit<CustomOptions, "body"> | undefined,
  ) {
    return request<Response>("PATCH", url, { ...options, body });
  },
  delete<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined,
  ) {
    return request<Response>("DELETE", url, { ...options });
  },
};

export default http;
