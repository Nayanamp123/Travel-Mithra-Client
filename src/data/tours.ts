import type { PendingTripSearch, TourOption } from "../types/travel";

export const tourOptions: TourOption[] = [
  { value: "Leh - Ladakh - Kargil", label: "Leh - Ladakh - Kargil - Rs.65,000", price: 65000 },
  { value: "Malaysia Package", label: "Malaysia Package - Rs.46,000", price: 46000 },
  { value: "Exciting Lakshadweep", label: "Exciting Lakshadweep - Rs.36,000", price: 36000 },
  { value: "Kashmir Holiday", label: "Kashmir Holiday - Rs.1,38,000", price: 138000 },
  { value: "Munnar Escape", label: "Munnar Escape - Rs.36,000", price: 36000 },
  { value: "Dubai Tour", label: "Dubai Tour - Rs.2,20,000", price: 220000 },
  { value: "Bali Vacation", label: "Bali Vacation - Rs.1,42,000", price: 142000 },
  { value: "Kerala Packages", label: "Kerala Packages - Rs.48,000", price: 48000 },
];

export const destinationNameMap: Record<string, string> = {
  Lakshadweep: "Exciting Lakshadweep",
  "Leh - Ladakh": "Leh - Ladakh - Kargil",
  Malaysia: "Malaysia Package",
};

export const initialPendingTrip: PendingTripSearch = { destination: "", date: "", guests: "1" };

export const featuredTours = [
  {
    imageClass: "mountain-img",
    title: "Leh - Ladakh - Kargil",
    address: "Travel Mithra Holidays F10, Heavenly Plaza Kakkanad, Cochin - 21",
    price: "From Rs.69900.00",
    duration: "6 Night 7 Days",
    rating: "4.6",
    featured: true,
  },
  {
    imageClass: "city-img",
    title: "Malaysia Package",
    address: "Travel Mithra Holidays F10, Heavenly Plaza, Padamugal, Kakkanad",
    price: "From Rs.48000.00",
    duration: "4 days",
    rating: "4.4",
    featured: true,
  },
  {
    imageClass: "beach-img",
    title: "Exciting Lakshadweep",
    address: "Travel Mithra Holidays F10, Heavenly Plaza, Padamugal, Cochin - 21",
    price: "From Rs.38000.00",
    duration: "10 days",
    rating: "3.6",
    featured: false,
  },
];

export const destinationCards = [
  { className: "destination-card lakshadweep", title: "Lakshadweep", subtitle: "Agatti Island, India", kicker: "" },
  { className: "destination-card vietnam", title: "Vietnam", subtitle: "Ha Long Bay, Vietnam", kicker: "Wildlife" },
  { className: "destination-card thailand", title: "Thailand", subtitle: "Phuket, Thailand", kicker: "" },
  { className: "destination-card ladakh", title: "Leh - Ladakh", subtitle: "Ladakh, India", kicker: "" },
  { className: "destination-card malaysia", title: "Malaysia", subtitle: "Kuala Lumpur, Malaysia", kicker: "" },
];
