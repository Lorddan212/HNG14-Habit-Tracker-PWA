import { describe, expect, test } from "vitest";
import { toggleHabitCompletion } from "@/lib/habits";
import type { Habit } from "@/types/habit";

const baseHabit: Habit = {
  id: "habit-1",
  userId: "user-1",
  name: "Drink Water",
  description: "Eight glasses",
  frequency: "daily",
  createdAt: "2026-04-27T00:00:00.000Z",
  completions: [],
};

describe("toggleHabitCompletion", () => {
  test("adds a completion date when the date is not present", () => {
    const result = toggleHabitCompletion(baseHabit, "2026-04-27");

    expect(result.completions).toContain("2026-04-27");
  });

  test("removes a completion date when the date already exists", () => {
    const result = toggleHabitCompletion(
      {
        ...baseHabit,
        completions: ["2026-04-27"],
      },
      "2026-04-27",
    );

    expect(result.completions).not.toContain("2026-04-27");
  });

  test("does not mutate the original habit object", () => {
    const habit = {
      ...baseHabit,
      completions: ["2026-04-26"],
    };

    toggleHabitCompletion(habit, "2026-04-27");

    expect(habit.completions).toEqual(["2026-04-26"]);
  });

  test("does not return duplicate completion dates", () => {
    const result = toggleHabitCompletion(
      {
        ...baseHabit,
        completions: ["2026-04-27", "2026-04-27"],
      },
      "2026-04-26",
    );

    expect(result.completions).toEqual(["2026-04-26", "2026-04-27"]);
  });
});
