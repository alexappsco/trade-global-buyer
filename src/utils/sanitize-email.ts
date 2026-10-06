const PLACEHOLDER_EMAIL_DOMAIN = "invalid.local";

export function sanitizeEmail(value?: string | null): string {
  const email = (value ?? "").trim();
  if (!email) return "";

  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  if (domain === PLACEHOLDER_EMAIL_DOMAIN) return "";

  return email;
}
