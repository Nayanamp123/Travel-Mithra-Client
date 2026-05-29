import { api } from "./axios";

export type AdminDetails = {
  id: number;
  name: string;
  admin_id: string;
  email: string;
  role: string;
};

type AdminLoginResponse = {
  token: string;
  admin: AdminDetails;
};

const ADMIN_DETAILS_KEY =
  "travelmithra_admin_details";

const ADMIN_TOKEN_KEY =
  "travelmithra_admin_token";

export const adminService = {
  async login(
    email: string,
    password: string,
  ) {
    const response = await api.post("/auth/admin/login",
        {email,password}
      );
    const result = response.data as AdminLoginResponse;
    localStorage.setItem(
      ADMIN_DETAILS_KEY,
      JSON.stringify(result.admin),
    );
    localStorage.setItem(
      ADMIN_TOKEN_KEY,
      result.token,
    );
    return result.admin;
  },

  async logout() {
    try {
      await api.post("/admin/logout",{});
    } finally {
      localStorage.removeItem(
        ADMIN_DETAILS_KEY,
      );
      localStorage.removeItem(
        ADMIN_TOKEN_KEY,
      );
    }
  },
  getAdmin() {
    const admin = localStorage.getItem(ADMIN_DETAILS_KEY);
    return admin
      ? (JSON.parse(admin) as AdminDetails) : null;
    },
  isLoggedIn() {
    return Boolean(
      localStorage.getItem(
        ADMIN_DETAILS_KEY,
      ),
    );
  },
};