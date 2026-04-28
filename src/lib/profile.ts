import type { User } from "@/types/auth";

function titleCase(value: string): string {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function getUserDisplayName(user: User | null | undefined): string {
  if (!user) {
    return "Member";
  }

  const emailName = user.email.split("@")[0] ?? "";
  const parts = emailName.split(/[._-]+/).filter(Boolean);
  const fallbackFirstName = titleCase(parts[0] ?? "Member");
  const fallbackLastInitial = titleCase(parts[1] ?? "").charAt(0);

  return fallbackLastInitial ? `${fallbackFirstName} ${fallbackLastInitial}.` : fallbackFirstName;
}

export function getUserInitials(user: User | null | undefined): string {
  const displayName = getUserDisplayName(user);
  const parts = displayName.replace(".", "").split(/\s+/).filter(Boolean);

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
