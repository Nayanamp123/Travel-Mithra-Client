// services/bookingsService.ts

import { api } from "./axios";

export const bookingService = {
  /* =========================
     ADMIN BOOKING APIS
  ========================= */

  async getAllBookings(params?: any) {
    const response = await api.get("/booking", { params });
    return response.data;
  },

  async getBookingById(id: number) {
    const response = await api.get(`/booking/${id}`);
    return response.data;
  },

  async createBooking(data: {
    customer_id: number;
    destination: string;
    trip_date: string;
    number_of_travellers: number;
    amount: number;
    previous_payments: number;
    received_amount: number;
    payment_status: string;
    booking_status: string;
    sales_executive?: "Aliya" | "Keerthi" | "Sharanya";
  }) {
    const response = await api.post("/booking", data);
    return response.data;
  },

  async updateBooking(id: number, data: any) {
    const response = await api.put(`/booking/${id}`, data);
    return response.data;
  },

  async deleteBooking(id: number) {
    const response = await api.delete(`/booking/${id}`);
    return response.data;
  },

  async getCustomerBookings(customerId: number, params?: any) {
    const response = await api.get(`/booking/customer/${customerId}`, { params });
    return response.data;
  },

  async getCustomerBookingById(customerId: number, bookingId: number) {
    const response = await api.get(`/booking/customer/${customerId}/${bookingId}`);
    return response.data;
  },

  async downloadReceipt(bookingId: number) {
    const response = await api.get(`/receipt/download/${bookingId}`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `receipt-${bookingId}.pdf`);
    document.body.appendChild(link);

    link.click();
    link.remove();
  },

  async getMonthlySalesCustomersByExecutive(
    executive: "Aliya" | "Keerthi" | "Sharanya",
    year: number,
    month: number,
    startDate?: string,
    endDate?: string,
  ) {
    const response = await api.get(`/booking/sales/${executive}/monthly`, {
      params: { year, month, startDate, endDate },
    });

    return response.data;
  },

  async downloadSalesReportPDF(
    executive: "Aliya" | "Keerthi" | "Sharanya",
    year: number,
    month: number,
    startDate?: string,
    endDate?: string,
  ) {
    const params: any = { year, month };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await api.get(`/booking/sales/${executive}/monthly/pdf`, {
      params,
      responseType: "blob",
    });

    const dateStr = startDate && endDate
      ? `${startDate}_to_${endDate}`
      : `${year}_${String(month).padStart(2, "0")}`;

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Sales_Report_${executive}_${dateStr}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

