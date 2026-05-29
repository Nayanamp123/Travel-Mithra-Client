const customers = [
  {
    id: 1,
    receiptNo: "TMH/1906/08042026",
    date: "08/04/2026",
    name: "SMITHA",
    address: "Padamugal, Kakkanadu, Cochin",
    destination: "KASHMIR 17 APR26",
    group: "3 ADULT",
    paymentMode: "BANK TRANSFER",
    acceptedBy: "SHARANYA RATHEESH",
    totalAmount: 138000,
    paidAmount: 42000,
    previousPayments: 30000,
    remarks: "",
  },
  {
    id: 2,
    receiptNo: "TMH/1907/09042026",
    date: "09/04/2026",
    name: "ANJALI NAIR",
    address: "Vyttila, Ernakulam",
    destination: "MUNNAR FAMILY PACKAGE",
    group: "2 ADULT, 1 CHILD",
    paymentMode: "UPI",
    acceptedBy: "ADMIN",
    totalAmount: 36000,
    paidAmount: 18000,
    previousPayments: 0,
    remarks: "Hotel balance pending",
  },
  {
    id: 3,
    receiptNo: "TMH/1908/10042026",
    date: "10/04/2026",
    name: "RAHUL MENON",
    address: "Thrissur, Kerala",
    destination: "DUBAI TOUR",
    group: "4 ADULT",
    paymentMode: "CASH",
    acceptedBy: "ADMIN",
    totalAmount: 220000,
    paidAmount: 100000,
    previousPayments: 50000,
    remarks: "Passport copies received",
  },
];

const ADMIN_SESSION_KEY = "travelmithra_admin_logged_in";

if (sessionStorage.getItem(ADMIN_SESSION_KEY) !== "true") {
  window.location.href = "index.html";
}

const money = (value) => `Rs.${Number(value).toLocaleString("en-IN")}/-`;
const balance = (customer) => customer.totalAmount - customer.paidAmount - customer.previousPayments;
const params = new URLSearchParams(window.location.search);
const customer = customers.find((item) => item.id === Number(params.get("id"))) || customers[0];

const setText = (id, value) => {
  document.querySelector(id).textContent = value || "-";
};

const escapePdfText = (value) => String(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

const makePdf = (lines) => {
  const content = [
    "BT",
    "/F1 22 Tf",
    "50 790 Td",
    "(Travel Mithra Holidays) Tj",
    "/F1 12 Tf",
    "0 -26 Td",
    "(KS3, Heavenly Plaza, Padamugal, Kakkanadu, Cochin - 21) Tj",
    "0 -18 Td",
    "(PH: 8129430111) Tj",
    "/F1 18 Tf",
    "0 -34 Td",
    "(PAYMENT RECEIPT) Tj",
    "/F1 12 Tf",
    ...lines.flatMap((line) => ["0 -22 Td", `(${escapePdfText(line)}) Tj`]),
    "ET",
  ].join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
};

const downloadReceipt = (item) => {
  const lines = [
    `Receipt No: ${item.receiptNo}`,
    `Date: ${item.date}`,
    `Customer: ${item.name}`,
    `Address: ${item.address}`,
    `Destination: ${item.destination}`,
    `Group: ${item.group}`,
    `Payment Mode: ${item.paymentMode}`,
    `Payment Accepted By: ${item.acceptedBy}`,
    `Current Paid Amount: ${money(item.paidAmount)}`,
    `Previous Payments: ${money(item.previousPayments)}`,
    `Total Paid: ${money(item.paidAmount + item.previousPayments)}`,
    `Total Amount: ${money(item.totalAmount)}`,
    `Balance Amount: ${money(balance(item))}`,
    `Remarks: ${item.remarks || "-"}`,
    "Note: This is a computer generated document. Terms and Conditions Apply.",
  ];
  const url = URL.createObjectURL(makePdf(lines));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${item.receiptNo.replaceAll("/", "-")}-${item.name}-receipt.pdf`;
  link.click();
  URL.revokeObjectURL(url);
};

setText("#customerName", customer.name);
setText("#receiptNo", customer.receiptNo);
setText("#receiptDate", customer.date);
setText("#address", customer.address);
setText("#destination", customer.destination);
setText("#group", customer.group);
setText("#remarks", customer.remarks);
setText("#paymentMode", customer.paymentMode);
setText("#acceptedBy", customer.acceptedBy);
setText("#totalAmount", money(customer.totalAmount));
setText("#paidAmount", money(customer.paidAmount));
setText("#previousPayments", money(customer.previousPayments));
setText("#totalPaidAmount", money(customer.paidAmount + customer.previousPayments));
setText("#balanceAmount", money(balance(customer)));

document.querySelector("#backButton").addEventListener("click", () => {
  window.location.href = "index.html";
});

document.querySelector("#downloadReceiptButton").addEventListener("click", () => {
  downloadReceipt(customer);
});
