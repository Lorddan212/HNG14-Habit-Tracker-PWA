import { describe, expect, test } from "vitest";
import { validateHabitName } from "@/lib/validators";

describe("validateHabitName", () => {
  test("returns an error when habit name is empty", () => {
    expect(validateHabitName("   ")).toEqual({
      valid: false,
      value: "",
      error: "Habit name is required",
    });
  });

  test("returns an error when habit name exceeds 60 characters", () => {
    const result = validateHabitName("a".repeat(61));

    expect(result.valid).toBe(false);
    expect(result.error).toBe("Habit name must be 60 characters or fewer");
  });

  test("returns a trimmed value when habit name is valid", () => {
    expect(validateHabitName("  Read Books  ")).toEqual({
      valid: true,
      value: "Read Books",
      error: null,
    });
  });
});
