import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { getTodayDateString } from "@/lib/dates";
import { STORAGE_KEYS } from "@/lib/storage";
import type { Session, User } from "@/types/auth";
import type { Habit } from "@/types/habit";

const user: User = {
  id: "user-1",
  email: "person@example.com",
  password: "secret",
  createdAt: "2026-04-27T00:00:00.000Z",
};

const session: Session = {
  userId: user.id,
  email: user.email,
};

function seedDashboard(habits: Habit[] = []) {
  window.localStorage.setItem(STORAGE_KEYS.users, JSON.stringify([user]));
  window.localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
  window.localStorage.setItem(STORAGE_KEYS.habits, JSON.stringify(habits));
}

async function renderDashboard() {
  render(<DashboardPage />);
  return screen.findByTestId("dashboard-page");
}

describe("habit form", () => {
  test("shows a validation error when habit name is empty", async () => {
    seedDashboard();
    const browserUser = userEvent.setup();
    await renderDashboard();

    await browserUser.click(screen.getByTestId("create-habit-button"));
    await browserUser.click(screen.getByTestId("habit-save-button"));

    expect(screen.getByRole("alert")).toHaveTextContent("Habit name is required");
  });

  test("creates a new habit and renders it in the list", async () => {
    seedDashboard();
    const browserUser = userEvent.setup();
    await renderDashboard();

    await browserUser.click(screen.getByTestId("create-habit-button"));
    await browserUser.type(screen.getByTestId("habit-name-input"), "Drink Water");
    await browserUser.type(screen.getByTestId("habit-description-input"), "Eight glasses");
    await browserUser.click(screen.getByTestId("habit-frequency-select"));
    await browserUser.click(screen.getByTestId("habit-frequency-option-weekly"));
    await browserUser.click(screen.getByTestId("habit-save-button"));

    const storedHabit = (JSON.parse(window.localStorage.getItem(STORAGE_KEYS.habits) ?? "[]") as Habit[])[0];

    expect(screen.getByTestId("habit-card-drink-water")).toBeInTheDocument();
    expect(storedHabit.frequency).toBe("weekly");
  });

  test("edits an existing habit and preserves immutable fields", async () => {
    const habit: Habit = {
      id: "habit-1",
      userId: user.id,
      name: "Drink Water",
      description: "Eight glasses",
      frequency: "daily",
      createdAt: "2026-04-27T00:00:00.000Z",
      completions: ["2026-04-27"],
    };
    seedDashboard([habit]);
    const browserUser = userEvent.setup();
    await renderDashboard();

    await browserUser.click(screen.getByTestId("habit-edit-drink-water"));
    await browserUser.clear(screen.getByTestId("habit-name-input"));
    await browserUser.type(screen.getByTestId("habit-name-input"), "Read Books");
    await browserUser.clear(screen.getByTestId("habit-description-input"));
    await browserUser.type(screen.getByTestId("habit-description-input"), "Ten pages");
    await browserUser.click(screen.getByTestId("habit-frequency-select"));
    await browserUser.click(screen.getByTestId("habit-frequency-option-monthly"));
    await browserUser.click(screen.getByTestId("habit-save-button"));

    const storedHabit = (JSON.parse(window.localStorage.getItem(STORAGE_KEYS.habits) ?? "[]") as Habit[])[0];

    expect(screen.getByTestId("habit-card-read-books")).toBeInTheDocument();
    expect(storedHabit).toMatchObject({
      id: "habit-1",
      userId: user.id,
      createdAt: "2026-04-27T00:00:00.000Z",
      completions: ["2026-04-27"],
      name: "Read Books",
      description: "Ten pages",
      frequency: "monthly",
    });
  });

  test("deletes a habit only after explicit confirmation", async () => {
    const habit: Habit = {
      id: "habit-1",
      userId: user.id,
      name: "Drink Water",
      description: "",
      frequency: "daily",
      createdAt: "2026-04-27T00:00:00.000Z",
      completions: [],
    };
    seedDashboard([habit]);
    const browserUser = userEvent.setup();
    await renderDashboard();

    await browserUser.click(screen.getByTestId("habit-delete-drink-water"));

    expect(screen.getByTestId("habit-card-drink-water")).toBeInTheDocument();

    await browserUser.click(screen.getByTestId("confirm-delete-button"));

    await waitFor(() => {
      expect(screen.queryByTestId("habit-card-drink-water")).not.toBeInTheDocument();
    });
  });

  test("toggles completion and updates the streak display", async () => {
    const habit: Habit = {
      id: "habit-1",
      userId: user.id,
      name: "Drink Water",
      description: "",
      frequency: "daily",
      createdAt: "2026-04-27T00:00:00.000Z",
      completions: [],
    };
    seedDashboard([habit]);
    const browserUser = userEvent.setup();
    await renderDashboard();

    await browserUser.click(screen.getByTestId("habit-complete-drink-water"));

    const streak = within(screen.getByTestId("habit-streak-drink-water"));
    const storedHabit = (JSON.parse(window.localStorage.getItem(STORAGE_KEYS.habits) ?? "[]") as Habit[])[0];

    expect(streak.getByText("1")).toBeInTheDocument();
    expect(storedHabit.completions).toContain(getTodayDateString());
  });

  test("updates profile settings and refreshes the dashboard name", async () => {
    seedDashboard();
    const browserUser = userEvent.setup();
    await renderDashboard();

    expect(screen.queryByTestId("profile-settings")).not.toBeInTheDocument();

    await browserUser.click(screen.getByTestId("profile-settings-toggle"));

    expect(screen.getByTestId("profile-settings")).toBeInTheDocument();

    await browserUser.clear(screen.getByTestId("profile-first-name-input"));
    await browserUser.type(screen.getByTestId("profile-first-name-input"), "Maya");
    await browserUser.clear(screen.getByTestId("profile-last-name-input"));
    await browserUser.type(screen.getByTestId("profile-last-name-input"), "Cole");
    await browserUser.clear(screen.getByTestId("profile-email-input"));
    await browserUser.type(screen.getByTestId("profile-email-input"), "maya@example.com");
    await browserUser.clear(screen.getByTestId("profile-password-input"));
    await browserUser.type(screen.getByTestId("profile-password-input"), "new-secret");
    await browserUser.click(screen.getByTestId("profile-save-button"));

    const storedUsers = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.users) ?? "[]");
    const storedSession = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.session) ?? "null");

    expect(await screen.findByText("Maya C.")).toBeInTheDocument();
    expect(storedUsers[0]).toMatchObject({
      firstName: "Maya",
      lastName: "Cole",
      email: "maya@example.com",
      password: "new-secret",
    });
    expect(storedSession).toEqual({
      userId: user.id,
      email: "maya@example.com",
    });
  });

  test("deletes the profile only after explicit confirmation", async () => {
    const habit: Habit = {
      id: "habit-1",
      userId: user.id,
      name: "Drink Water",
      description: "",
      frequency: "daily",
      createdAt: "2026-04-27T00:00:00.000Z",
      completions: [],
    };
    seedDashboard([habit]);
    const browserUser = userEvent.setup();
    await renderDashboard();

    await browserUser.click(screen.getByTestId("profile-settings-toggle"));
    await browserUser.click(screen.getByTestId("profile-delete-button"));

    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEYS.users) ?? "[]")).toHaveLength(1);

    await browserUser.click(screen.getByTestId("confirm-delete-account-button"));

    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEYS.users) ?? "[]")).toEqual([]);
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEYS.habits) ?? "[]")).toEqual([]);
    expect(window.localStorage.getItem(STORAGE_KEYS.session)).toBeNull();
  });
});
