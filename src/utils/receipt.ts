import type { Customer } from "../types/travel";
import { balance, money } from "./format";

// Keep PDF size aligned with existing receipt template (MediaBox: 0 0 595 842)
const PAGE_W = 595;
const PAGE_H = 842;

const escapePdfText = (value: string | number) =>
  String(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
};

const fetchAsBase64 = async (url: string) => {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  return arrayBufferToBase64(buf);
};

const makePdfWithBackgroundImage = async (
  backgroundPngBase64: string,
  overlayLines: Array<{ text: string; x: number; y: number; size?: number }>
) => {
  const backgroundBytes = atob(backgroundPngBase64);
  let hex = "";
  for (let i = 0; i < backgroundBytes.length; i++)
    hex += backgroundBytes.charCodeAt(i).toString(16).padStart(2, "0");

  const contentParts: string[] = [];

  // Background
  contentParts.push("q");
  contentParts.push(`0 0 ${PAGE_W} ${PAGE_H} cm`);
  contentParts.push("/Im0 Do");
  contentParts.push("Q");

  // Overlay text (bottom-left origin)
  overlayLines.forEach(({ text, x, y, size = 10 }) => {
    contentParts.push("BT");
    contentParts.push(`/F1 ${size} Tf`);
    contentParts.push(`${x} ${y} Td`);
    contentParts.push(`(${escapePdfText(text)}) Tj`);
    contentParts.push("ET");
  });

  const content = contentParts.join("\n");

  // PDF objects
  const objects: string[] = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 4 0 R >> /XObject << /Im0 6 0 R >> >> /Contents 5 0 R >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,

    // Image XObject embedding raw PNG bytes.
    // If you see broken images in the downloaded PDF, the next step would be switching to a
    // PDF library that properly handles PNG embedding.
    `<< /Type /XObject /Subtype /Image /Width ${PAGE_W} /Height ${PAGE_H} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /Length ${hex.length >> 1}\nstream\n${hex}\nendstream >>`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];

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

export const downloadReceipt = async (customer: Customer) => {
  if (customer.status !== "confirmed") return;

  // Overlay values (initial coordinates; will be tuned for exact pixel match)
  const overlayLines = [
    { text: `Receipt No: ${customer.receiptNo}`, x: 90, y: 728, size: 10 },
    { text: `Date : ${customer.date}`, x: 110, y: 755, size: 10 },

    { text: `Received a sum of`, x: 75, y: 690, size: 10 },
    { text: `₹${money(customer.paidAmount).replace("₹", "")}/-`, x: 165, y: 670, size: 10 },
    { text: `as part payment from ${customer.name}`, x: 75, y: 650, size: 10 },
    { text: `on account of`, x: 75, y: 625, size: 10 },
    { text: `${customer.destination}`, x: 75, y: 602, size: 10 },

    { text: `Group of`, x: 75, y: 575, size: 10 },
    { text: `${customer.group}`, x: 130, y: 575, size: 10 },

    { text: `Payment Mode`, x: 75, y: 545, size: 10 },
    { text: `${customer.paymentMode}`, x: 165, y: 545, size: 10 },

    { text: `Payment Accepted by`, x: 75, y: 520, size: 10 },
    { text: `${customer.acceptedBy || "Travel Mithra Admin"}`, x: 165, y: 495, size: 10 },

    { text: `Total Closing Amount`, x: 75, y: 455, size: 10 },
    { text: `₹${money(customer.totalAmount).replace("₹", "")}/-`, x: 240, y: 435, size: 10 },

    { text: `Previous Payments`, x: 75, y: 395, size: 10 },
    { text: `₹${money(customer.totalAmount - customer.paidAmount).replace("₹", "")}/-`, x: 240, y: 372, size: 10 },

    { text: `Balance to pay`, x: 75, y: 335, size: 10 },
    { text: `₹${money(balance(customer)).replace("₹", "")}/-`, x: 240, y: 313, size: 10 },

    { text: "Remarks if any", x: 75, y: 280, size: 10 },
    { text: customer.remarks || "-", x: 75, y: 255, size: 9 },

    {
      text: "Note : This is a computer generated document hence doesn't require any signature/stamp. *Terms and Condtions Apply .",
      x: 40,
      y: 210,
      size: 8,
    },
  ];

  const templateBase64 = await fetchAsBase64("/assets/receipt-reference.png");
  const blob = await makePdfWithBackgroundImage(templateBase64, overlayLines);

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${customer.receiptNo.split("/").join("-")}-${customer.name}-receipt.pdf`;
  link.click();
  URL.revokeObjectURL(url);
};

