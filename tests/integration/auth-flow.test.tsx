import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { STORAGE_KEYS } from "@/lib/storage";
import type { User } from "@/types/auth";

describe("auth flow", () => {
  test("submits the signup form and creates a session", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    expect(screen.getByTestId("auth-signup-email")).toBeRequired();
    expect(screen.getByTestId("auth-signup-password")).toBeRequired();

    await user.type(screen.getByTestId("auth-signup-email"), "person@example.com");
    await user.type(screen.getByTestId("auth-signup-password"), "secret");
    await user.click(screen.getByTestId("auth-signup-password-toggle"));

    expect(screen.getByTestId("auth-signup-password")).toHaveAttribute("type", "text");

    await user.click(screen.getByTestId("auth-signup-password-toggle"));

    expect(screen.getByTestId("auth-signup-password")).toHaveAttribute("type", "password");

    await user.click(screen.getByTestId("auth-signup-submit"));

    const users = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.users) ?? "[]") as User[];
    const session = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.session) ?? "null");

    expect(users).toHaveLength(1);
    expect(users[0]).toEqual({
      id: users[0].id,
      email: "person@example.com",
      password: "secret",
      createdAt: users[0].createdAt,
    });
    expect(session).toEqual({
      userId: users[0].id,
      email: "person@example.com",
    });
  });

  test("shows an error for duplicate signup email", async () => {
    const existingUser: User = {
      id: "user-1",
      email: "person@example.com",
      password: "secret",
      createdAt: "2026-04-27T00:00:00.000Z",
    };
    window.localStorage.setItem(STORAGE_KEYS.users, JSON.stringify([existingUser]));

    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByTestId("auth-signup-email"), "person@example.com");
    await user.type(screen.getByTestId("auth-signup-password"), "secret");
    await user.click(screen.getByTestId("auth-signup-submit"));

    expect(screen.getByRole("alert")).toHaveTextContent("User already exists");
  });

  test("submits the login form and stores the active session", async () => {
    const existingUser: User = {
      id: "user-1",
      email: "person@example.com",
      password: "secret",
      createdAt: "2026-04-27T00:00:00.000Z",
    };
    window.localStorage.setItem(STORAGE_KEYS.users, JSON.stringify([existingUser]));

    const user = userEvent.setup();
    render(<LoginForm />);

    expect(screen.getByTestId("auth-login-email")).toBeRequired();
    expect(screen.getByTestId("auth-login-password")).toBeRequired();

    await user.type(screen.getByTestId("auth-login-email"), "person@example.com");
    await user.type(screen.getByTestId("auth-login-password"), "secret");
    await user.click(screen.getByTestId("auth-login-password-toggle"));

    expect(screen.getByTestId("auth-login-password")).toHaveAttribute("type", "text");

    await user.click(screen.getByTestId("auth-login-password-toggle"));

    expect(screen.getByTestId("auth-login-password")).toHaveAttribute("type", "password");

    await user.click(screen.getByTestId("auth-login-submit"));

    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEYS.session) ?? "null")).toEqual({
      userId: "user-1",
      email: "person@example.com",
    });
  });

  test("shows an error for invalid login credentials", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByTestId("auth-login-email"), "person@example.com");
    await user.type(screen.getByTestId("auth-login-password"), "wrong");
    await user.click(screen.getByTestId("auth-login-submit"));

    expect(screen.getByRole("alert")).toHaveTextContent("Invalid email or password");
  });
});
