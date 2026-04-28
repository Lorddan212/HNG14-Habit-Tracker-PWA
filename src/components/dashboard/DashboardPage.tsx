"use client";

import { CalendarCheck2, Crown, LogOut, Plus, Settings, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getTodayDateString } from "@/lib/dates";
import { toggleHabitCompletion } from "@/lib/habits";
import { getUserDisplayName, getUserInitials, type ProfiledUser } from "@/lib/profile";
import {
  clearSession,
  createId,
  deleteUserAccount,
  getUsers,
  getHabitsForUser,
  getUserById,
  getValidSession,
  saveSession,
  saveHabitsForUser,
  updateUser,
} from "@/lib/storage";
import type { Session } from "@/types/auth";
import type { Habit } from "@/types/habit";
import { HabitCard } from "@/components/dashboard/HabitCard";
import { HabitForm } from "@/components/dashboard/HabitForm";
import { ProfileSettings } from "@/components/dashboard/ProfileSettings";

export function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [activeUser, setActiveUser] = useState<ProfiledUser | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    const activeSession = getValidSession();

    if (!activeSession) {
      router.replace("/login");
      return;
    }

    setSession(activeSession);
    setActiveUser(getUserById(activeSession.userId));
    setHabits(getHabitsForUser(activeSession.userId));
  }, [router]);

  const completedTodayCount = useMemo(() => {
    const today = getTodayDateString();
    return habits.filter((habit) => habit.completions.includes(today)).length;
  }, [habits]);

  function persistHabits(nextHabits: Habit[]) {
    if (!session) {
      return;
    }

    setHabits(nextHabits);
    saveHabitsForUser(session.userId, nextHabits);
  }

  function openCreateForm() {
    setEditingHabit(null);
    setFormOpen(true);
    setSettingsOpen(false);
  }

  function handleSave(values: { name: string; description: string; frequency: Habit["frequency"] }) {
    if (!session) {
      return;
    }

    if (editingHabit) {
      const nextHabits = habits.map((habit) =>
        habit.id === editingHabit.id
          ? {
              ...habit,
              name: values.name,
              description: values.description,
              frequency: values.frequency,
            }
          : habit,
      );
      persistHabits(nextHabits);
    } else {
      const habit: Habit = {
        id: createId("habit"),
        userId: session.userId,
        name: values.name,
        description: values.description,
        frequency: values.frequency,
        createdAt: new Date().toISOString(),
        completions: [],
      };
      persistHabits([...habits, habit]);
    }

    setFormOpen(false);
    setEditingHabit(null);
  }

  function handleEdit(habit: Habit) {
    setEditingHabit(habit);
    setFormOpen(true);
    setSettingsOpen(false);
    setConfirmingDeleteId(null);
  }

  function handleDelete(habitId: string) {
    persistHabits(habits.filter((habit) => habit.id !== habitId));
    setConfirmingDeleteId(null);
  }

  function handleToggleCompletion(habit: Habit) {
    const today = getTodayDateString();
    const nextHabits = habits.map((candidate) =>
      candidate.id === habit.id ? toggleHabitCompletion(candidate, today) : candidate,
    );
    persistHabits(nextHabits);
  }

  function handleLogout() {
    clearSession();
    router.push("/login");
  }

  function handleProfileSave(values: { firstName: string; lastName: string; email: string; password: string }) {
    if (!activeUser || !session) {
      return;
    }

    if (!values.email) {
      setProfileError("Email is required");
      return;
    }

    if (!values.password) {
      setProfileError("Password is required");
      return;
    }

    const emailOwner = getUsers().find((user) => user.email === values.email && user.id !== activeUser.id);

    if (emailOwner) {
      setProfileError("User already exists");
      return;
    }

    const updatedUser: ProfiledUser = {
      ...activeUser,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
    };

    updateUser(updatedUser);

    const updatedSession = {
      userId: session.userId,
      email: updatedUser.email,
    };

    saveSession(updatedSession);
    setActiveUser(updatedUser);
    setSession(updatedSession);
    setProfileError(null);
  }

  function handleDeleteAccount() {
    if (!session) {
      return;
    }

    deleteUserAccount(session.userId);
    router.push("/signup");
  }

  const displayName = getUserDisplayName(activeUser);
  const initials = getUserInitials(activeUser);

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-editorial-wash px-6">
        <div
          aria-label="Preparing dashboard"
          className="flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-surface-container-highest shadow-ambient"
          role="status"
        >
          <span className="h-3 w-3 animate-pulse rounded-full bg-primary" />
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-[radial-gradient(circle_at_10%_4%,rgba(221,54,182,0.14),transparent_30%),radial-gradient(circle_at_92%_2%,rgba(49,80,254,0.18),transparent_34%),linear-gradient(145deg,#f7f8ff_0%,#eef1ff_48%,#fff8fd_100%)] px-4 py-4 sm:px-6 lg:px-8"
      data-testid="dashboard-page"
    >
      <div className="mx-auto max-w-6xl">
        <header className="glass-panel sticky top-3 z-10 rounded-[1.75rem] px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.2rem] bg-cta-gradient font-display text-base font-black text-white shadow-lift">
                {initials}
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-magenta">Habit Dashboard</p>
                <h1 className="mt-1 font-display text-2xl font-black leading-none tracking-normal text-ink sm:text-3xl">
                  {displayName}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                aria-expanded={settingsOpen}
                aria-label="Open profile settings"
                className={`focus-visible-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold shadow-[0_12px_34px_rgba(49,80,254,0.12)] transition ${
                  settingsOpen ? "bg-primary text-white" : "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                }`}
                data-testid="profile-settings-toggle"
                onClick={() => {
                  setSettingsOpen((current) => !current);
                  setFormOpen(false);
                  setEditingHabit(null);
                }}
                type="button"
              >
                <Settings aria-hidden="true" size={17} />
                Settings
              </button>
              <button
                className="focus-visible-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-red-500/12 px-4 py-2 text-sm font-extrabold text-red-600 shadow-[0_12px_34px_rgba(220,38,38,0.12)] transition hover:bg-red-500 hover:text-white"
                data-testid="auth-logout-button"
                onClick={handleLogout}
                type="button"
              >
                <LogOut aria-hidden="true" size={17} />
                Logout
              </button>
            </div>
          </div>
        </header>

        <section className="mt-6 overflow-hidden rounded-[2rem] bg-[#17153d] p-6 text-white shadow-[0_30px_90px_rgba(43,37,152,0.26)] sm:p-8">
          <div className="grid gap-8 md:grid-cols-[1.05fr_0.95fr] md:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#f7b7ea] backdrop-blur-[20px]">
                <Crown aria-hidden="true" size={15} />
                Private Dashboard
              </div>
              <h2 className="mt-5 max-w-2xl font-display text-4xl font-black leading-[0.96] tracking-normal sm:text-6xl">
                Welcome Back, {displayName}
              </h2>
              <p className="mt-5 max-w-xl text-sm font-semibold leading-6 text-white/70 sm:text-base">
                Curate the routines that shape your week. Complete what matters today, refine what needs a better cue,
                and keep the entire system private to this browser.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[1.5rem] bg-white/12 p-4 backdrop-blur-[20px]">
                <CalendarCheck2 aria-hidden="true" className="mb-4 text-[#9aa8ff]" size={22} />
                <p className="font-display text-4xl font-black">{habits.length}</p>
                <p className="mt-1 text-xs font-extrabold uppercase tracking-[0.14em] text-white/72">Habits</p>
              </div>
              <div className="rounded-[1.5rem] bg-white/12 p-4 backdrop-blur-[20px]">
                <Sparkles aria-hidden="true" className="mb-4 text-[#f7b7ea]" size={22} />
                <p className="font-display text-4xl font-black">{completedTodayCount}</p>
                <p className="mt-1 text-xs font-extrabold uppercase tracking-[0.14em] text-white/72">Done Today</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <aside className="space-y-4 lg:sticky lg:top-28">
            <button
              className="primary-button focus-visible-ring min-h-12 w-full px-5 py-3"
              data-testid="create-habit-button"
              onClick={openCreateForm}
              type="button"
            >
              <Plus aria-hidden="true" size={19} />
              Create Habit
            </button>

            {settingsOpen && activeUser ? (
              <ProfileSettings
                error={profileError}
                onDeleteAccount={handleDeleteAccount}
                onSave={handleProfileSave}
                user={activeUser}
              />
            ) : formOpen ? (
              <HabitForm
                initialHabit={editingHabit}
                onCancel={() => {
                  setFormOpen(false);
                  setEditingHabit(null);
                }}
                onSave={handleSave}
              />
            ) : (
              <div className="rounded-[1.9rem] bg-white/76 p-5 shadow-[0_18px_60px_rgba(49,80,254,0.12)] backdrop-blur-[20px]">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Focus brief</p>
                <h2 className="mt-3 font-display text-2xl font-black tracking-normal text-ink">
                  Build Rituals With A Cadence That Feels Natural
                </h2>
                <p className="mt-3 text-sm font-semibold leading-6 text-ink-muted">
                  Add daily, weekly, or monthly habits. Each card keeps today&apos;s completion clear while preserving your
                  local streak history.
                </p>
              </div>
            )}
          </aside>

          <section aria-label="Habit list" className="space-y-4">
            {habits.length === 0 ? (
              <div
                className="rounded-[2rem] bg-white/82 p-8 text-center shadow-[0_24px_70px_rgba(43,37,152,0.12)] backdrop-blur-[20px] sm:p-12"
                data-testid="empty-state"
              >
                <p className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-primary/10 font-display text-3xl font-black text-primary">
                  0
                </p>
                <h2 className="mt-6 font-display text-3xl font-black tracking-normal text-ink">Your Ritual Board Is Empty</h2>
                <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-6 text-ink-muted">
                  Start with one habit you can repeat this week. A precise cue beats a crowded list every time.
                </p>
              </div>
            ) : (
              habits.map((habit) => (
                <HabitCard
                  confirmingDelete={confirmingDeleteId === habit.id}
                  habit={habit}
                  key={habit.id}
                  onCancelDelete={() => setConfirmingDeleteId(null)}
                  onConfirmDelete={() => handleDelete(habit.id)}
                  onDeleteRequest={() => setConfirmingDeleteId(habit.id)}
                  onEdit={() => handleEdit(habit)}
                  onToggleCompletion={() => handleToggleCompletion(habit)}
                />
              ))
            )}
          </section>
        </section>
      </div>
    </main>
  );
}
