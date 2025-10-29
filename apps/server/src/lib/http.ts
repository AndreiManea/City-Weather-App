import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';

export class AppError extends Error {
  public readonly status: number;
  public readonly code: string;
  constructor(message: string, status = 500, code = 'INTERNAL_SERVER_ERROR') {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function createHttpClient(baseURL?: string, timeoutMs = 10_000): AxiosInstance {
  const instance = axios.create({ baseURL, timeout: timeoutMs });
  return instance;
}

export async function httpWithRetry<T>(
  client: AxiosInstance,
  config: AxiosRequestConfig,
  retries = 2,
  retryDelayMs = 300,
): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await client.request<T>(config);
      return res.data as T;
    } catch (err) {
      lastErr = err;
      const axiosErr = err as AxiosError;
      const status = axiosErr.response?.status;
      const isRetryable =
        axiosErr.code === 'ECONNABORTED' || !status || (status >= 500 && status < 600);
      if (!isRetryable || attempt === retries) break;
      await new Promise((r) => setTimeout(r, retryDelayMs * (attempt + 1)));
    }
  }
  throw lastErr;
}
