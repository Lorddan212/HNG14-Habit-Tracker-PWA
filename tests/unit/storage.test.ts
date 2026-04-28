import { describe, expect, test } from "vitest";
import {
  clearSession,
  getHabits,
  getUsers,
  getValidSession,
  saveHabits,
  saveHabitsForUser,
  saveSession,
  STORAGE_KEYS,
} from "@/lib/storage";
import type { Habit } from "@/types/habit";

describe("storage helpers", () => {
  test("returns fallback values when stored JSON is invalid", () => {
    window.localStorage.setItem(STORAGE_KEYS.users, "not-json");

    expect(getUsers()).toEqual([]);
  });

  test("clears the active session", () => {
    saveSession({
      userId: "user-1",
      email: "person@example.com",
    });

    clearSession();

    expect(window.localStorage.getItem(STORAGE_KEYS.session)).toBeNull();
  });

  test("returns null when a stored session does not match a user", () => {
    saveSession({
      userId: "missing-user",
      email: "person@example.com",
    });

    expect(getValidSession()).toBeNull();
  });

  test("saves habits for one user without removing other users habits", () => {
    const firstHabit: Habit = {
      id: "habit-1",
      userId: "user-1",
      name: "Drink Water",
      description: "",
      frequency: "daily",
      createdAt: "2026-04-27T00:00:00.000Z",
      completions: [],
    };
    const secondHabit: Habit = {
      id: "habit-2",
      userId: "user-2",
      name: "Read Books",
      description: "",
      frequency: "daily",
      createdAt: "2026-04-27T00:00:00.000Z",
      completions: [],
    };

    saveHabits([firstHabit, secondHabit]);
    saveHabitsForUser("user-1", [{ ...firstHabit, name: "Walk Outside" }]);

    expect(getHabits()).toEqual([secondHabit, { ...firstHabit, name: "Walk Outside" }]);
  });
});
