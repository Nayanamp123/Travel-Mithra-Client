// services/bookingService.ts

import { api } from "./axios";

export const bookingService = {

  /* =========================
     ADMIN BOOKING APIS
  ========================= */

  async getAllBookings(
    params?: any,
  ) {

    const response =
      await api.get(
        "/booking",
        {
          params,
        },
      );

    return response.data;
  },



  async getBookingById(
    id: number,
  ) {

    const response =
      await api.get(
        `/booking/${id}`,
      );

    return response.data;
  },



  async createBooking(
    data: {
      customer_id: number;
      destination: string;
      trip_date: string;
      number_of_travellers: number;
      amount: number;
      previous_payments: number;
      received_amount: number;
      payment_status: string;
      booking_status: string;
    },
  ) {


    const response =
      await api.post(
        "/booking",
        data,
      );

    return response.data;
  },



  async updateBooking(
    id: number,
    data: any,
  ) {

    const response =
      await api.put(
        `/booking/${id}`,
        data,
      );

    return response.data;
  },



  async deleteBooking(
    id: number,
  ) {

    const response =
      await api.delete(
        `/booking/${id}`,
      );

    return response.data;
  },

  async getCustomerBookings(
    customerId: number,
    params?: any,
  ) {

    const response =
      await api.get(
        `/booking/customer/${customerId}`,
        {
          params,
        },
      );

    return response.data;
  },



  async getCustomerBookingById(
    customerId: number,
    bookingId: number,
  ) {

    const response =
      await api.get(
        `/booking/customer/${customerId}/${bookingId}`,
      );

    return response.data;
  },

  
  async downloadReceipt(
  bookingId: number,
) {

  const response =
    await api.get(
      `/receipt/download/${bookingId}`,
      {
        responseType: "blob",
      },
    );

  // CREATE FILE URL
  const url =
    window.URL.createObjectURL(
      new Blob([response.data]),
    );

  // CREATE LINK
  const link =
    document.createElement("a");

  link.href = url;

  link.setAttribute(
    "download",
    `receipt-${bookingId}.pdf`,
  );

  document.body.appendChild(
    link,
  );

  // DOWNLOAD FILE
  link.click();

  // CLEANUP
  link.remove();
},
};