"use client";

import { FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff, Save, Trash2, UserRound } from "lucide-react";
import type { User } from "@/types/auth";

type ProfileSettingsValues = {
  email: string;
  password: string;
};

type ProfileSettingsProps = {
  user: User;
  error: string | null;
  onDeleteAccount: () => void;
  onSave: (values: ProfileSettingsValues) => void;
};

export function ProfileSettings({ user, error, onDeleteAccount, onSave }: ProfileSettingsProps) {
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState(user.password);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    setEmail(user.email);
    setPassword(user.password);
  }, [user]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({
      email: email.trim().toLowerCase(),
      password,
    });
  }

  return (
    <section
      className="rounded-[1.9rem] bg-white/78 p-5 shadow-[0_18px_60px_rgba(49,80,254,0.12)] backdrop-blur-[20px]"
      data-testid="profile-settings"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[1.15rem] bg-primary/10 text-primary">
          <UserRound aria-hidden="true" size={20} />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Profile Settings</p>
          <h2 className="mt-2 font-display text-2xl font-black tracking-normal text-ink">Your Local Profile</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-ink-muted">
            Change your login email, reset your local password, or delete this browser-only account.
          </p>
        </div>
      </div>

      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="block text-sm font-extrabold text-ink" htmlFor="profile-email">
            Email
          </label>
          <input
            autoComplete="email"
            className="input-shell focus-visible-ring"
            data-testid="profile-email-input"
            id="profile-email"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-extrabold text-ink" htmlFor="profile-password">
            Password
          </label>
          <div className="relative">
            <input
              autoComplete="new-password"
              className="input-shell focus-visible-ring pr-14"
              data-testid="profile-password-input"
              id="profile-password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type={showPassword ? "text" : "password"}
              value={password}
            />
            <button
              aria-label={showPassword ? "Hide profile password" : "Show profile password"}
              className="focus-visible-ring absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-primary/10 text-primary transition hover:bg-primary hover:text-white"
              data-testid="profile-password-toggle"
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
          data-testid="profile-save-button"
          type="submit"
        >
          <Save aria-hidden="true" size={18} />
          Save Profile
        </button>
      </form>

      <div className="mt-5 rounded-[1.35rem] bg-red-500/10 p-4">
        <p className="text-sm font-extrabold text-red-700">Delete Account</p>
        <p className="mt-1 text-sm font-semibold leading-6 text-red-700/78">
          This removes your local profile, active session, and every habit owned by this account.
        </p>

        {confirmingDelete ? (
          <div className="mt-4 flex flex-col gap-2">
            <button
              className="focus-visible-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-extrabold text-white shadow-[0_12px_34px_rgba(220,38,38,0.22)]"
              data-testid="confirm-delete-account-button"
              onClick={onDeleteAccount}
              type="button"
            >
              <Trash2 aria-hidden="true" size={17} />
              Confirm Delete Account
            </button>
            <button
              className="focus-visible-ring inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-extrabold text-red-600"
              onClick={() => setConfirmingDelete(false)}
              type="button"
            >
              Keep Account
            </button>
          </div>
        ) : (
          <button
            className="focus-visible-ring mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-red-600/12 px-4 py-2 text-sm font-extrabold text-red-700 transition hover:bg-red-600 hover:text-white"
            data-testid="profile-delete-button"
            onClick={() => setConfirmingDelete(true)}
            type="button"
          >
            <Trash2 aria-hidden="true" size={17} />
            Delete Account
          </button>
        )}
      </div>
    </section>
  );
}
