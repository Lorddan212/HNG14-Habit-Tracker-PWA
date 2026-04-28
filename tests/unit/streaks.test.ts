import { describe, expect, test } from "vitest";
import { calculateCurrentStreak } from "@/lib/streaks";

describe("calculateCurrentStreak", () => {
  test("returns 0 when completions is empty", () => {
    expect(calculateCurrentStreak([], "2026-04-27")).toBe(0);
  });

  test("returns 0 when today is not completed", () => {
    expect(calculateCurrentStreak(["2026-04-26"], "2026-04-27")).toBe(0);
  });

  test("returns the correct streak for consecutive completed days", () => {
    expect(calculateCurrentStreak(["2026-04-25", "2026-04-27", "2026-04-26"], "2026-04-27")).toBe(3);
  });

  test("ignores duplicate completion dates", () => {
    expect(calculateCurrentStreak(["2026-04-27", "2026-04-27", "2026-04-26"], "2026-04-27")).toBe(2);
  });

  test("breaks the streak when a calendar day is missing", () => {
    expect(calculateCurrentStreak(["2026-04-27", "2026-04-25"], "2026-04-27")).toBe(1);
  });
});
