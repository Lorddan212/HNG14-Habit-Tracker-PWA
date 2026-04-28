import { expect, test } from "@playwright/test";

const users = [
  {
    id: "user-1",
    email: "person@example.com",
    password: "secret",
    createdAt: "2026-04-27T00:00:00.000Z",
  },
  {
    id: "user-2",
    email: "other@example.com",
    password: "secret",
    createdAt: "2026-04-27T00:00:00.000Z",
  },
];

const session = {
  userId: "user-1",
  email: "person@example.com",
};

async function clearStorage(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.evaluate(() => window.localStorage.clear());
}

async function seedStorage(
  page: import("@playwright/test").Page,
  data: {
    activeSession?: typeof session;
    habits?: unknown[];
    seededUsers?: typeof users;
  } = {},
) {
  await page.goto("/login");
  await page.evaluate(
    ({ activeSession, habits, seededUsers }) => {
      window.localStorage.clear();
      window.localStorage.setItem("habit-tracker-users", JSON.stringify(seededUsers));

      if (activeSession) {
        window.localStorage.setItem("habit-tracker-session", JSON.stringify(activeSession));
      }

      window.localStorage.setItem("habit-tracker-habits", JSON.stringify(habits));
    },
    {
      activeSession: data.activeSession,
      habits: data.habits ?? [],
      seededUsers: data.seededUsers ?? users,
    },
  );
}

test.describe("Habit Tracker app", () => {
  test("shows the splash screen and redirects unauthenticated users to /login", async ({ page }) => {
    await clearStorage(page);

    await page.goto("/");

    await expect(page.getByTestId("splash-screen")).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });

  test("redirects authenticated users from / to /dashboard", async ({ page }) => {
    await seedStorage(page, { activeSession: session });

    await page.goto("/");

    await expect(page.getByTestId("splash-screen")).toBeVisible();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByTestId("dashboard-page")).toBeVisible();
  });

  test("prevents unauthenticated access to /dashboard", async ({ page }) => {
    await clearStorage(page);

    await page.goto("/dashboard");

    await expect(page).toHaveURL(/\/login$/);
  });

  test("signs up a new user and lands on the dashboard", async ({ page }) => {
    await clearStorage(page);
    await page.goto("/signup");

    await page.getByTestId("auth-signup-email").fill("new@example.com");
    await page.getByTestId("auth-signup-password").fill("secret");
    await page.getByTestId("auth-signup-submit").click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByTestId("dashboard-page")).toBeVisible();
  });

  test("logs in an existing user and loads only that user's habits", async ({ page }) => {
    await seedStorage(page, {
      habits: [
        {
          id: "habit-1",
          userId: "user-1",
          name: "Drink Water",
          description: "",
          frequency: "daily",
          createdAt: "2026-04-27T00:00:00.000Z",
          completions: [],
        },
        {
          id: "habit-2",
          userId: "user-2",
          name: "Read Books",
          description: "",
          frequency: "daily",
          createdAt: "2026-04-27T00:00:00.000Z",
          completions: [],
        },
      ],
    });

    await page.getByTestId("auth-login-email").fill("person@example.com");
    await page.getByTestId("auth-login-password").fill("secret");
    await page.getByTestId("auth-login-submit").click();

    await expect(page.getByTestId("dashboard-page")).toBeVisible();
    await expect(page.getByTestId("habit-card-drink-water")).toBeVisible();
    await expect(page.getByTestId("habit-card-read-books")).toHaveCount(0);
  });

  test("creates a habit from the dashboard", async ({ page }) => {
    await seedStorage(page, { activeSession: session });
    await page.goto("/dashboard");

    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("Drink Water");
    await page.getByTestId("habit-description-input").fill("Eight glasses");
    await page.getByTestId("habit-save-button").click();

    await expect(page.getByTestId("habit-card-drink-water")).toBeVisible();
  });

  test("completes a habit for today and updates the streak", async ({ page }) => {
    await seedStorage(page, {
      activeSession: session,
      habits: [
        {
          id: "habit-1",
          userId: "user-1",
          name: "Drink Water",
          description: "",
          frequency: "daily",
          createdAt: "2026-04-27T00:00:00.000Z",
          completions: [],
        },
      ],
    });
    await page.goto("/dashboard");

    await page.getByTestId("habit-complete-drink-water").click();

    await expect(page.getByTestId("habit-streak-drink-water")).toContainText("1");
  });

  test("persists session and habits after page reload", async ({ page }) => {
    await seedStorage(page, { activeSession: session });
    await page.goto("/dashboard");

    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("Drink Water");
    await page.getByTestId("habit-save-button").click();
    await page.reload();

    await expect(page.getByTestId("dashboard-page")).toBeVisible();
    await expect(page.getByTestId("habit-card-drink-water")).toBeVisible();
  });

  test("logs out and redirects to /login", async ({ page }) => {
    await seedStorage(page, { activeSession: session });
    await page.goto("/dashboard");

    await page.getByTestId("auth-logout-button").click();

    await expect(page).toHaveURL(/\/login$/);
  });

  test("loads the cached app shell when offline after the app has been loaded once", async ({ page, context }) => {
    await clearStorage(page);
    await page.goto("/login");
    await expect(page.getByTestId("auth-login-submit")).toBeVisible();

    await page.evaluate(async () => {
      if (!("serviceWorker" in navigator)) {
        return false;
      }

      return Promise.race([
        navigator.serviceWorker.ready.then(() => true),
        new Promise((resolve) => {
          window.setTimeout(() => resolve(false), 3000);
        }),
      ]);
    });

    await context.setOffline(true);
    await page.goto("/login", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("Habit Tracker")).toBeVisible();
    await context.setOffline(false);
  });
});
