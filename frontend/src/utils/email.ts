export function displayNameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  const name = local.replace(/[._]/g, " ").trim();
  return name.replace(/\b\w/g, (c) => c.toUpperCase());
}
