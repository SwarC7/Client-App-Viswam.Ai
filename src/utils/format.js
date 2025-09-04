// Very small helpers to match server validators

export function normalizePhone(raw) {
  // strip non-digits
  let digits = (raw || "").replace(/\D/g, "");

  // if already starts with 91 and is 12 digits => add +
  if (digits.startsWith("91") && digits.length === 12) return `+${digits}`;

  // if only 10 digits (likely Indian number), prefix +91
  if (digits.length === 10) return `+91${digits}`;

  // if already has + => return as-is
  if ((raw || "").trim().startsWith("+")) return (raw || "").trim();

  // fallback: add +
  return `+${digits}`;
}

export function isStrongPassword(pw) {
  // at least 8 chars, one lower, one upper, one digit, one special
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(pw || "");
}
