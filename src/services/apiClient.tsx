import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number = 500, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const API_ENDPOINTS = {
  users: `${API_BASE_URL}/users`,
  user: (id: string) => `${API_BASE_URL}/users/${id}`,
  userLogin: `${API_BASE_URL}/auth/login`,
  userRegister: `${API_BASE_URL}/auth/register`,
  xp: (id: string, amount: number) =>
    `${API_BASE_URL}/users/${id}/increment-xp?amount=${amount}`,
  coins: (id: string, amount: number) =>
    `${API_BASE_URL}/users/${id}/increment-coins?amount=${amount}`,
  vouchers: `${API_BASE_URL}/vouchers`,
};

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

const REQUEST_TIMEOUT = 30000;

/**
 * Simplified fetch function with timeout and error handling
 */
async function apiFetch<T = any>(
  url: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<T> {
  const { timeout = REQUEST_TIMEOUT, headers = {}, ...rest } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const token = localStorage.getItem("auth_token");

    const requestHeaders = {
      ...DEFAULT_HEADERS,
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(url, {
      ...rest,
      headers: requestHeaders,
      signal: controller.signal,
    });

    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new ApiError(
        data.message || `Request failed with status ${response.status}`,
        response.status,
        data
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("Request timeout", 408);
    }

    throw new ApiError(
      error instanceof Error ? error.message : "Unknown error occurred",
      500
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

const invalidateQueries = (queryKey: string | string[], id?: string) => {
  if (id) {
    queryClient.invalidateQueries({ queryKey: [queryKey, id] });
  } else {
    queryClient.invalidateQueries({ queryKey: [queryKey] });
  }
};

export const api = {
  getAll: async () => {
    const url = API_ENDPOINTS.users;

    try {
      const response = await apiFetch(url);
      const items = response;

      if (!items || !Array.isArray(items)) {
        console.error("Invalid response format from API");
        return [];
      }

      return items;
    } catch (error) {
      console.error(`Error fetching items:`, error);
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      if (!id) {
        throw new Error("Invalid ID format");
      }

      const url = API_ENDPOINTS.user(id);

      const response = await apiFetch(url);
      const item = response;

      if (!item || !item.id) {
        throw new Error(`Item not found or invalid data format`);
      }

      return item;
    } catch (error) {
      console.error(`Error fetching item with ID ${id}:`, error);
      throw error;
    }
  },

  create: async (data: any) => {
    const url = API_ENDPOINTS.users;
    try {
      const response = await apiFetch(url, {
        method: "POST",
        body: JSON.stringify(data),
      });

      return response;
    } catch (error) {
      console.error(`Error creating item:`, error);
      throw error;
    }
  },

  update: async (id: string, updates: any) => {
    try {
      if (!id) {
        throw new Error("Invalid ID format");
      }

      const url = API_ENDPOINTS.user(id);

      const response = await apiFetch(url, {
        method: "PUT",
        body: JSON.stringify(updates),
      });

      return response;
    } catch (error) {
      console.error(`Error updating item with ID ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      if (!id) {
        throw new Error("Invalid ID format");
      }

      const url = API_ENDPOINTS.user(id);

      await apiFetch(url, { method: "DELETE" });

      return true;
    } catch (error) {
      console.error(`Error deleting item with ID ${id}:`, error);
      throw error;
    }
  },

  auth: {
    login: async (credentials: { email: string; password: string }) => {
      return await apiFetch(API_ENDPOINTS.userLogin, {
        method: "POST",
        body: JSON.stringify(credentials),
      });
    },

    register: async (userData: {
      username: string;
      email: string;
      cpf: string;
      password: string;
    }) => {
      return await apiFetch(API_ENDPOINTS.userRegister, {
        method: "POST",
        body: JSON.stringify(userData),
      });
    },
  },

  user: {
    updateCoins: async (userId: string, coinsToAdd: number) => {
      try {
        if (!userId) {
          throw new Error("Invalid ID format");
        }

        const url = API_ENDPOINTS.coins(userId, coinsToAdd);

        const response = await apiFetch(url, {
          method: "POST",
        });

        return response;
      } catch (error) {
        console.error(`Error updating item:`, error);
        throw error;
      }
    },
    generateVoucher: async (cpf: string, email: string, type: string) => {
      try {
        const url = API_ENDPOINTS.vouchers;

        const response = await apiFetch(url, {
          method: "POST",
          body: JSON.stringify({ cpf: cpf, email: email, type: type }),
        });

        return response;
      } catch (error) {
        console.error(`Error creating voucher:`, error);
        throw error;
      }
    },
    updateXp: async (userId: string, xpToAdd: number) => {
      try {
        if (!userId) {
          throw new Error("Invalid ID format");
        }

        const url = API_ENDPOINTS.xp(userId, xpToAdd);

        const response = await apiFetch(url, {
          method: "POST",
        });

        return response;
      } catch (error) {
        console.error(`Error updating item:`, error);
        throw error;
      }
    },
  },
};

export default api;
