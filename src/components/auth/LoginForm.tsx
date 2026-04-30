"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { getUsers, saveSession } from "@/lib/storage";
import { AuthShell } from "@/components/auth/AuthShell";
import { authContent } from "@/content/auth";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Email is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    const user = getUsers().find(
      (candidate) => candidate.email === normalizedEmail && candidate.password === password,
    );

    if (!user) {
      setError("Invalid email or password");
      return;
    }

    saveSession({
      userId: user.id,
      email: user.email,
    });
    router.push("/dashboard");
  }

  return (
    <AuthShell title={authContent.login.title} subtitle={authContent.login.subtitle}>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="block text-sm font-extrabold text-ink" htmlFor="login-email">
            Email
          </label>
          <input
            autoComplete="email"
            className="input-shell focus-visible-ring"
            data-testid="auth-login-email"
            id="login-email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
            type="email"
            value={email}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-extrabold text-ink" htmlFor="login-password">
            Password
          </label>
          <div className="relative">
            <input
              autoComplete="current-password"
              className="input-shell focus-visible-ring pr-14"
              data-testid="auth-login-password"
              id="login-password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
              type={showPassword ? "text" : "password"}
              value={password}
            />
            <button
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="focus-visible-ring absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-primary/10 text-primary transition hover:bg-primary hover:text-white"
              data-testid="auth-login-password-toggle"
              onClick={() => setShowPassword((current) => !current)}
              type="button"
            >
              {showPassword ? <EyeOff aria-hidden="true" size={18} /> : <Eye aria-hidden="true" size={18} />}
            </button>
          </div>
        </div>

        {error ? (
          <p aria-live="polite" className="rounded-2xl bg-magenta/10 px-4 py-3 text-sm font-bold text-magenta" role="alert">
            {error}
          </p>
        ) : null}

        <button
          className="primary-button focus-visible-ring min-h-12 w-full px-5 py-3"
          data-testid="auth-login-submit"
          type="submit"
        >
          Enter Dashboard
        </button>
      </form>

      <p className="mt-6 text-center text-sm font-semibold text-ink-muted">
        Building Your First Habit?{" "}
        <Link className="font-extrabold text-primary focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20" href="/signup">
          Create An Account
        </Link>
      </p>
    </AuthShell>
  );
}
