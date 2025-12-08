import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

export const APIService = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await api.get(endpoint);
    return response.data;
  },

  post: async <T>(endpoint: string, data: any): Promise<T> => {
    const response = await api.post(endpoint, data);
    return response.data;
  },

  put: async <T>(endpoint: string, id: string | number, data: any): Promise<T> => {
    const response = await api.put(`${endpoint}/${id}`, data);
    return response.data;
  },

  delete: async (endpoint: string, id: string | number): Promise<void> => {
    await api.delete(`${endpoint}/${id}`);
  },
};