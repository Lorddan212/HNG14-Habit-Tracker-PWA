import type { Session, User } from "@/types/auth";
import type { Habit } from "@/types/habit";

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function compactDates(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(new Set(value.filter(isString)));
}

function toStoredUser(value: unknown): User | null {
  if (!isRecord(value)) {
    return null;
  }

  const { id, email, password, createdAt } = value;

  if (!isString(id) || !isString(email) || !isString(password) || !isString(createdAt)) {
    return null;
  }

  return {
    id,
    email,
    password,
    createdAt,
  };
}

function toStoredHabit(value: unknown): Habit | null {
  if (!isRecord(value)) {
    return null;
  }

  const { id, userId, name, createdAt } = value;
  const description = isString(value.description) ? value.description : "";

  if (!isString(id) || !isString(userId) || !isString(name) || !isString(createdAt)) {
    return null;
  }

  return {
    id,
    userId,
    name,
    description,
    frequency: "daily",
    createdAt,
    completions: compactDates(value.completions),
  };
}

function compactItems<T>(value: unknown, mapper: (item: unknown) => T | null): T[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.reduce<T[]>((items, item) => {
    const mapped = mapper(item);

    if (mapped) {
      items.push(mapped);
    }

    return items;
  }, []);
}

export function createId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getUsers(): User[] {
  const users = compactItems(readJson<unknown>(STORAGE_KEYS.users, []), toStoredUser);
  writeJson(STORAGE_KEYS.users, users);

  return users;
}

export function saveUsers(users: User[]): void {
  writeJson(STORAGE_KEYS.users, compactItems(users, toStoredUser));
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
  const habits = compactItems(readJson<unknown>(STORAGE_KEYS.habits, []), toStoredHabit);
  writeJson(STORAGE_KEYS.habits, habits);

  return habits;
}

export function saveHabits(habits: Habit[]): void {
  writeJson(STORAGE_KEYS.habits, compactItems(habits, toStoredHabit));
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

export function getUserById(userId: string): User | null {
  return getUsers().find((user) => user.id === userId) ?? null;
}

export function getHabitsForUser(userId: string): Habit[] {
  return getHabits().filter((habit) => habit.userId === userId);
}

export function saveHabitsForUser(userId: string, habitsForUser: Habit[]): void {
  const otherUsersHabits = getHabits().filter((habit) => habit.userId !== userId);
  saveHabits([...otherUsersHabits, ...habitsForUser]);
}

export function updateUser(updatedUser: User): void {
  saveUsers(getUsers().map((user) => (user.id === updatedUser.id ? updatedUser : user)));
}

export function deleteUserAccount(userId: string): void {
  saveUsers(getUsers().filter((user) => user.id !== userId));
  saveHabits(getHabits().filter((habit) => habit.userId !== userId));
  clearSession();
}
