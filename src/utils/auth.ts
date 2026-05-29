import { LOCAL_ADMIN_STORAGE_KEY, USER_STORAGE_KEY } from "../constants/storage";
import { demoAdmins } from "../data/admins";
import type { Admin, User } from "../types/travel";
import { apiPost } from "./api";
import { getStored, setStored } from "./storage";

export const findDemoAdmin = (login: string, password: string) =>
  demoAdmins.find((admin) => (admin.userId === login || admin.email === login.toLowerCase()) && admin.password === password);

export const findLocalAdmin = (login: string, password: string) =>
  getStored<Admin>(LOCAL_ADMIN_STORAGE_KEY).find((admin) => (admin.userId === login || admin.email === login.toLowerCase()) && admin.password === password);

export const findLocalUser = (login: string, password: string) =>
  getStored<User>(USER_STORAGE_KEY).find((item) => (item.userId === login || item.email === login.toLowerCase()) && item.password === password);

export const getLoggedUser = () => {
  const userId = sessionStorage.getItem("travelmithra_user_logged_in");
  return getStored<User>(USER_STORAGE_KEY).find((user) => user.userId === userId || user.email === userId);
};

export const registerUser = async (formData: FormData) => {
  const name = String(formData.get("name") || "").trim();
  const userId = String(formData.get("userId") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const phone = String(formData.get("phone") || "").trim();
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!name || !userId || !email || !phone || !password || !confirmPassword) {
    throw new Error("All registration fields are required");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const approvedAdmin = demoAdmins.find((admin) => admin.userId === userId && admin.email === email);

  if (approvedAdmin) {
    try {
      await apiPost("/api/admin/register", { name, adminId: userId, email, password });
    } catch {
      // Keep the demo usable when MySQL credentials are not configured yet.
    }

    const localAdmins = getStored<Admin>(LOCAL_ADMIN_STORAGE_KEY).filter((admin) => admin.userId !== userId && admin.email !== email);
    localAdmins.push({ name, userId, email, phone, password });
    setStored(LOCAL_ADMIN_STORAGE_KEY, localAdmins);
    return;
  }

  const users = getStored<User>(USER_STORAGE_KEY);

  if (users.some((user) => user.userId === userId || user.email === email)) {
    throw new Error("User ID or email is already registered");
  }

  users.push({ name, userId, email, phone, password });
  setStored(USER_STORAGE_KEY, users);
};
