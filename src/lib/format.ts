import { format, differenceInCalendarMonths, differenceInCalendarDays, addMonths } from "date-fns";

/** Format an ISO date string as "12 August 2026". Falls back to the raw value if unparsable. */
export function formatDateLong(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return format(d, "d MMMM yyyy");
}

/** Today as yyyy-MM-dd, for auto-filling <input type="date"> */
export function todayISODate(): string {
  return format(new Date(), "yyyy-MM-dd");
}

/** Capitalizes each word of a name: "priya SHAH" -> "Priya Shah" */
export function autoCapitalizeName(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(" ");
}

const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen",
];
const TENS = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
];

function threeDigitsToWords(n: number): string {
  let str = "";
  if (n >= 100) {
    str += ONES[Math.floor(n / 100)] + " Hundred ";
    n %= 100;
  }
  if (n >= 20) {
    str += TENS[Math.floor(n / 10)] + " ";
    n %= 10;
  }
  if (n > 0) {
    str += ONES[n] + " ";
  }
  return str.trim();
}

/**
 * Converts a number to words using the Indian numbering system
 * (Crore / Lakh / Thousand), e.g. 1250000 -> "Twelve Lakh Fifty Thousand".
 */
export function numberToIndianWords(value: number): string {
  if (!Number.isFinite(value)) return "";
  const num = Math.round(Math.abs(value));
  if (num === 0) return "Zero";

  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const rest = num % 1000;

  const parts: string[] = [];
  if (crore) parts.push(`${threeDigitsToWords(crore)} Crore`);
  if (lakh) parts.push(`${threeDigitsToWords(lakh)} Lakh`);
  if (thousand) parts.push(`${threeDigitsToWords(thousand)} Thousand`);
  if (rest) parts.push(threeDigitsToWords(rest));

  return parts.join(" ").replace(/\s+/g, " ").trim();
}

/** e.g. 1250000 -> "Rupees Twelve Lakh Fifty Thousand Only" */
export function salaryToWords(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value.replace(/[^0-9.]/g, "")) : value;
  if (!num || Number.isNaN(num)) return "";
  return `Rupees ${numberToIndianWords(num)} Only`;
}

/** Formats a number as ₹ with Indian comma grouping, e.g. 1250000 -> "₹12,50,000" */
export function formatINR(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value.replace(/[^0-9.]/g, "")) : value;
  if (!num || Number.isNaN(num)) return "";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}

/** Human-readable duration between two ISO dates, e.g. "6 Months" or "45 Days" */
export function calculateDuration(startISO?: string, endISO?: string): string {
  if (!startISO || !endISO) return "";
  const start = new Date(startISO);
  const end = new Date(endISO);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "";

  const months = differenceInCalendarMonths(end, start);
  if (months >= 1) {
    const remDays = differenceInCalendarDays(end, addMonths(start, months));
    return remDays > 0 ? `${months} Months, ${remDays} Days` : `${months} Months`;
  }
  const days = differenceInCalendarDays(end, start);
  return `${days} Days`;
}

/** Adds a probation period (in months) to a joining date, returns ISO date string */
export function calculateProbationEndDate(joiningISO?: string, months = 3): string {
  if (!joiningISO) return "";
  const start = new Date(joiningISO);
  if (Number.isNaN(start.getTime())) return "";
  return format(addMonths(start, months), "yyyy-MM-dd");
}

/** Generates a sequential-looking Employee ID, e.g. TH-2026-0042 */
export function generateEmployeeId(seed?: number): string {
  const year = new Date().getFullYear();
  const n = seed ?? Math.floor(Math.random() * 9000) + 100;
  return `TH-${year}-${String(n).padStart(4, "0")}`;
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/** Accepts Indian 10-digit mobile numbers, with optional +91 prefix */
export function isValidIndianPhone(value: string): boolean {
  return /^(\+91[-\s]?)?[6-9]\d{9}$/.test(value.replace(/\s+/g, ""));
}

export function slugifyFileName(value: string): string {
  return value.replace(/[\\/:*?"<>|]+/g, "").trim();
}
