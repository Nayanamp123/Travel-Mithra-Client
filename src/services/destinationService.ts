import { api } from "./axios";

export const destinationService = {
  async createDestination(name: string, description?: string) {
    const response = await api.post("/destination", {
      name,
      description,
    });

    return response.data;
  },
};
