import type { User } from "@/types/auth";

export type ProfiledUser = User & {
  firstName?: string;
  lastName?: string;
};

function titleCase(value: string): string {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function getUserDisplayName(user: ProfiledUser | null | undefined): string {
  if (!user) {
    return "Member";
  }

  const firstName = titleCase(user.firstName ?? "");
  const lastInitial = titleCase(user.lastName ?? "").charAt(0);

  if (firstName && lastInitial) {
    return `${firstName} ${lastInitial}.`;
  }

  if (firstName) {
    return firstName;
  }

  const emailName = user.email.split("@")[0] ?? "";
  const parts = emailName.split(/[._-]+/).filter(Boolean);
  const fallbackFirstName = titleCase(parts[0] ?? "Member");
  const fallbackLastInitial = titleCase(parts[1] ?? "").charAt(0);

  return fallbackLastInitial ? `${fallbackFirstName} ${fallbackLastInitial}.` : fallbackFirstName;
}

export function getUserInitials(user: ProfiledUser | null | undefined): string {
  const displayName = getUserDisplayName(user);
  const parts = displayName.replace(".", "").split(/\s+/).filter(Boolean);

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
