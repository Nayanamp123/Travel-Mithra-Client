export type View = "home" | "user" | "admin";
export type AuthMode = "login" | "register";
export type PaymentStatus = "pending" | "confirmed";

export type Admin = {
  name: string;
  userId: string;
  email: string;
  phone?: string;
  password: string;
};

export type User = {
  name: string;
  userId: string;
  email: string;
  phone: string;
  password: string;
};

export type Customer = {
  id: string;
  receiptNo: string;
  date: string;
  name: string;
  userId?: string;
  address: string;
  destination: string;
  group: string;
  paymentMode: string;
  acceptedBy: string;
  totalAmount: number;
  paidAmount: number;
  status: PaymentStatus;
  remarks: string;
};

export type TourOption = {
  value: string;
  label: string;
  price: number;
};

export type PendingTripSearch = {
  destination: string;
  date: string;
  guests: string;
};

export type PaymentFormState = {
  destination: string;
  tripDate: string;
  travellers: string;
  amount: string;
  paymentMode: string;
};
