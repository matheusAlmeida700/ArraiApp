import { api } from "../apiClient";

interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
}

export const userService = {
  getAll: () => api.getAll(),
  getById: (id: string) => api.getById(id),
  create: (user: CreateUserData) => api.create(user),
  update: (id: string, updates: UpdateUserData) => api.update(id, updates),
  delete: (id: string) => api.delete(id),
  login: (email: string, password: string) =>
    api.auth.login({ email, password }),
  register: (username: string, email: string, cpf: string, password: string) =>
    api.auth.register({ username, email, cpf, password }),
};

export const userDataService = {
  updateXp: (userId: string, xpToAdd: number) =>
    api.user.updateXp(userId, xpToAdd),
  updateCoins: (userId: string, coinsToAdd: number) =>
    api.user.updateCoins(userId, coinsToAdd),
  generateVoucher: (cpf: string, email: string, type: string) =>
    api.user.generateVoucher(cpf, email, type),
};
