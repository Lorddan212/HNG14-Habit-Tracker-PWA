"use client";

import { CheckCircle2, Pencil, Trash2 } from "lucide-react";
import { getTodayDateString } from "@/lib/dates";
import { getHabitSlug } from "@/lib/slug";
import { calculateCurrentStreak } from "@/lib/streaks";
import type { Habit } from "@/types/habit";

type HabitCardProps = {
  habit: Habit;
  confirmingDelete: boolean;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
  onDeleteRequest: () => void;
  onEdit: () => void;
  onToggleCompletion: () => void;
};

export function HabitCard({
  habit,
  confirmingDelete,
  onCancelDelete,
  onConfirmDelete,
  onDeleteRequest,
  onEdit,
  onToggleCompletion,
}: HabitCardProps) {
  const slug = getHabitSlug(habit.name) || habit.id;
  const today = getTodayDateString();
  const completedToday = habit.completions.includes(today);
  const streak = calculateCurrentStreak(habit.completions, today);
  const frequencyLabel = habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1);

  return (
    <article
      className={`rounded-[1.9rem] p-5 shadow-[0_20px_64px_rgba(43,37,152,0.10)] transition sm:p-6 ${
        completedToday
          ? "bg-gradient-to-br from-indigo/95 via-success to-primary text-white shadow-lift"
          : "bg-white/86 text-ink backdrop-blur-[20px]"
      }`}
      data-testid={`habit-card-${slug}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className={`text-xs font-extrabold uppercase tracking-[0.16em] ${completedToday ? "text-white/72" : "text-lavender"}`}>
            {frequencyLabel}
          </p>
          <h2 className="mt-2 break-words font-display text-3xl font-black leading-tight tracking-normal">
            {habit.name}
          </h2>
          {habit.description ? (
            <p className={`mt-2 break-words text-sm font-semibold leading-6 ${completedToday ? "text-white/78" : "text-ink-muted"}`}>
              {habit.description}
            </p>
          ) : null}
        </div>

        <div
          className={`shrink-0 rounded-[1.25rem] px-3 py-2 text-center ${
            completedToday ? "bg-white/16" : "bg-surface-container-low"
          }`}
          data-testid={`habit-streak-${slug}`}
        >
          <p className="font-display text-2xl font-black leading-none">{streak}</p>
          <p className={`mt-1 text-[0.68rem] font-extrabold uppercase tracking-[0.12em] ${completedToday ? "text-white/72" : "text-ink-muted"}`}>
            Streak
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          className={`focus-visible-ring inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold sm:flex-none ${
            completedToday ? "bg-white text-indigo" : "bg-primary/10 text-primary"
          }`}
          data-testid={`habit-complete-${slug}`}
          onClick={onToggleCompletion}
          type="button"
        >
          <CheckCircle2 aria-hidden="true" size={18} />
          {completedToday ? "Completed today" : "Mark complete"}
        </button>
        <button
          className={`focus-visible-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold ${
            completedToday ? "bg-white/14 text-white" : "bg-surface-container-low text-ink"
          }`}
          data-testid={`habit-edit-${slug}`}
          onClick={onEdit}
          type="button"
        >
          <Pencil aria-hidden="true" size={17} />
          Edit
        </button>
        <button
          className={`focus-visible-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold ${
            completedToday ? "bg-white/14 text-white" : "bg-magenta/10 text-magenta"
          }`}
          data-testid={`habit-delete-${slug}`}
          onClick={onDeleteRequest}
          type="button"
        >
          <Trash2 aria-hidden="true" size={17} />
          Delete
        </button>
      </div>

      {confirmingDelete ? (
        <div className={`mt-5 rounded-[1.35rem] p-4 ${completedToday ? "bg-white/14" : "bg-surface-container-low"}`}>
          <p className={`text-sm font-bold leading-6 ${completedToday ? "text-white/86" : "text-ink-muted"}`}>
            Delete This Habit Permanently?
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <button
              className="focus-visible-ring inline-flex min-h-11 items-center justify-center rounded-full bg-magenta px-4 py-2 text-sm font-extrabold text-white"
              data-testid="confirm-delete-button"
              onClick={onConfirmDelete}
              type="button"
            >
              Confirm Delete
            </button>
            <button
              className={`focus-visible-ring inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2 text-sm font-extrabold ${
                completedToday ? "bg-white/14 text-white" : "bg-surface-container-highest text-ink"
              }`}
              onClick={onCancelDelete}
              type="button"
            >
              Keep Habit
            </button>
          </div>
        </div>
      ) : null}
    </article>
  );
}
