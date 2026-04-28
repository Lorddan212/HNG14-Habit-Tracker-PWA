import type { Session } from "@/types/auth";
import type { Habit } from "@/types/habit";
import type { ProfiledUser } from "@/lib/profile";

export const STORAGE_KEYS = {
  users: "habit-tracker-users",
  session: "habit-tracker-session",
  habits: "habit-tracker-habits",
} as const;

function canUseStorage(): boolean {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function createId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getUsers(): ProfiledUser[] {
  return readJson<ProfiledUser[]>(STORAGE_KEYS.users, []);
}

export function saveUsers(users: ProfiledUser[]): void {
  writeJson(STORAGE_KEYS.users, users);
}

export function getSession(): Session | null {
  return readJson<Session | null>(STORAGE_KEYS.session, null);
}

export function saveSession(session: Session): void {
  writeJson(STORAGE_KEYS.session, session);
}

export function clearSession(): void {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEYS.session);
}

export function getHabits(): Habit[] {
  return readJson<Habit[]>(STORAGE_KEYS.habits, []);
}

export function saveHabits(habits: Habit[]): void {
  writeJson(STORAGE_KEYS.habits, habits);
}

export function getValidSession(): Session | null {
  const session = getSession();

  if (!session) {
    return null;
  }

  const user = getUsers().find(
    (candidate) => candidate.id === session.userId && candidate.email === session.email,
  );

  return user ? session : null;
}

export function getUserById(userId: string): ProfiledUser | null {
  return getUsers().find((user) => user.id === userId) ?? null;
}

export function getHabitsForUser(userId: string): Habit[] {
  return getHabits().filter((habit) => habit.userId === userId);
}

export function saveHabitsForUser(userId: string, habitsForUser: Habit[]): void {
  const otherUsersHabits = getHabits().filter((habit) => habit.userId !== userId);
  saveHabits([...otherUsersHabits, ...habitsForUser]);
}

export function updateUser(updatedUser: ProfiledUser): void {
  saveUsers(getUsers().map((user) => (user.id === updatedUser.id ? updatedUser : user)));
}

export function deleteUserAccount(userId: string): void {
  saveUsers(getUsers().filter((user) => user.id !== userId));
  saveHabits(getHabits().filter((habit) => habit.userId !== userId));
  clearSession();
}
