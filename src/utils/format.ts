import type { Customer } from "../types/travel";

export const today = new Date().toISOString().split("T")[0];

export const money = (value: number) => `Rs.${Number(value).toLocaleString("en-IN")}/-`;

export const balance = (customer: Customer) => Number(customer.totalAmount) - Number(customer.paidAmount);

export const makeReceiptNo = () => {
  const date = new Date();
  const stamp = `${String(date.getDate()).padStart(2, "0")}${String(date.getMonth() + 1).padStart(2, "0")}${date.getFullYear()}`;
  return `TMH/${Math.floor(2000 + Math.random() * 8000)}/${stamp}`;
};
