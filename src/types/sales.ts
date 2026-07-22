export type SalesExecutive = "Aliya" | "Keerthi";

export type MonthlySalesCustomer = {
  customerId: number;
  customerName: string;
  customerEmail?: string;
  totalAmount: number;
  totalReceived: number;
  totalPendingBalance: number;
  bookingCount: number;
  totalAdults: number;
  totalKids: number;
};

export type MonthlySalesResponse = {
  executive: SalesExecutive;
  year: number;
  month: number;
  customers: MonthlySalesCustomer[];
  totals: {
    totalAmount: number;
    totalReceived: number;
    totalPendingBalance: number;
  };
};

