import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { CustomConsole } from "./customLogger";
import { CustomError } from "./customError";

const logger = new CustomConsole();

function getCookieValue(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = getCookieValue("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    logger.info(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    logger.error(`Request interceptor error: ${error}`);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    logger.info(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    const { response } = error;

    if (response) {
      logger.error(
        `API Error: ${response.status} ${response.config.url} ${response.data}`
      );

      // Handle specific error cases
      switch (response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          window.location.href = "/login";
          break;
        case 403:
          // Forbidden
          throw new CustomError("Access denied", 403);
        case 404:
          // Not found
          throw new CustomError("Resource not found", 404);
        case 500:
          // Server error
          throw new CustomError("Internal server error", 500);
        default:
          // Other errors
          const message = response.data?.message || "An error occurred";
          throw new CustomError(message, response.status);
      }
    } else {
      // Network error
      logger.error(`Network error: ${error.message}`);
      throw new CustomError("Network error - please check your connection", 0);
    }
  }
);

// API service methods
export const apiService = {
  // GET request
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return api.get(url, config).then((response) => response.data);
  },

  // POST request
  post: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return api.post(url, data, config).then((response) => response.data);
  },

  // PUT request
  put: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return api.put(url, data, config).then((response) => response.data);
  },

  // DELETE request
  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return api.delete(url, config).then((response) => response.data);
  },

  // PATCH request
  patch: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return api.patch(url, data, config).then((response) => response.data);
  },
};

export default api;
