// services/customer.service.ts

import { api } from "./axios";

export type CustomerDetails = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
};

type CustomerLoginResponse = {
  token: string;
  customer: CustomerDetails;
};

const CUSTOMER_DETAILS_KEY =
  "travelmithra_customer_details";

const CUSTOMER_TOKEN_KEY =
  "travelmithra_customer_token";

export const customerService = {
  async login(
    email: string,
    password: string,
  ) {
    const response =
      await api.post(
        "/auth/customer/login",
        {
          email,
          password,
        },
      );

    const result =
      response.data as CustomerLoginResponse;

    localStorage.setItem(
      CUSTOMER_DETAILS_KEY,
      JSON.stringify(
        result.customer,
      ),
    );

    localStorage.setItem(
      CUSTOMER_TOKEN_KEY,
      result.token,
    );

    return result.customer;
  },

  async logout() {
    try {
      await api.post(
         "/customer/logout",
        {},
      );
    } finally {
      localStorage.removeItem(
        CUSTOMER_DETAILS_KEY,
      );

      localStorage.removeItem(
        CUSTOMER_TOKEN_KEY,
      );
    }
  },

  getCustomer() {
    const customer =
      localStorage.getItem(
        CUSTOMER_DETAILS_KEY,
      );

    return customer
      ? (JSON.parse(
          customer,
        ) as CustomerDetails)
      : null;
  },

  isLoggedIn() {
    return Boolean(
      localStorage.getItem(
        CUSTOMER_DETAILS_KEY,
      ),
    );
  },

  async getAll() {
    const response = await api.get("/customer");
    return response.data;
  },

  async create(
    data: {
      name: string;
      email: string;
      phone: string;
      password: string;
    },
  ) {
    const response =await api.post("/customer",data);
    return response.data;
  },

  async update(id: number,data: {
      name?: string;
      email?: string;
      phone?: string;
      status?: string;
    },
  ) {
    const response = await api.put(`/customer/${id}`,data);
    return response.data;
  },

  async delete(id: number) {
    const response = await api.delete(`/customer/${id}`);
    return response.data;
  },
};