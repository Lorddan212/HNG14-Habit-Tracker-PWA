"use client";

import { FormEvent, useState } from "react";
import { CalendarDays, ChevronDown, Save, X } from "lucide-react";
import { validateHabitName } from "@/lib/validators";
import type { Habit } from "@/types/habit";

type HabitFormValues = {
  name: string;
  description: string;
  frequency: Habit["frequency"];
};

type HabitFormProps = {
  initialHabit?: Habit | null;
  onCancel: () => void;
  onSave: (values: HabitFormValues) => void;
};

export function HabitForm({ initialHabit, onCancel, onSave }: HabitFormProps) {
  const [name, setName] = useState(initialHabit?.name ?? "");
  const [description, setDescription] = useState(initialHabit?.description ?? "");
  const [frequency, setFrequency] = useState<Habit["frequency"]>(initialHabit?.frequency ?? "daily");
  const [frequencyOpen, setFrequencyOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const frequencyOptions: Array<{ label: string; value: Habit["frequency"] }> = [
    { label: "Daily", value: "daily" },
  ];
  const activeFrequency = frequencyOptions.find((option) => option.value === frequency) ?? frequencyOptions[0];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = validateHabitName(name);

    if (!result.valid) {
      setError(result.error);
      return;
    }

    setError(null);
    onSave({
      name: result.value,
      description: description.trim(),
      frequency,
    });
  }

  return (
    <form
      className="space-y-5 rounded-[1.9rem] bg-white/82 p-5 shadow-[0_24px_70px_rgba(43,37,152,0.14)] backdrop-blur-[20px] sm:p-6"
      data-testid="habit-form"
      onSubmit={handleSubmit}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-magenta">
            {initialHabit ? "Refine Habit" : "New Habit"}
          </p>
          <h2 className="mt-2 font-display text-3xl font-black leading-tight tracking-normal text-ink">
            {initialHabit ? "Edit This Habit" : "Create A Habit"}
          </h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-ink-muted">
            Give the habit a clear name and a useful cue. This tracker keeps the required cadence daily.
          </p>
        </div>
        <button
          aria-label="Close habit form"
          className="ghost-button focus-visible-ring h-10 w-10 shrink-0 p-0"
          onClick={onCancel}
          type="button"
        >
          <X aria-hidden="true" size={18} />
        </button>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-extrabold text-ink" htmlFor="habit-name">
          Habit Name
        </label>
        <input
          className="input-shell focus-visible-ring"
          data-testid="habit-name-input"
          id="habit-name"
          maxLength={80}
          onChange={(event) => setName(event.target.value)}
          placeholder="Morning walk"
          value={name}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-extrabold text-ink" htmlFor="habit-description">
          Description
        </label>
        <textarea
          className="input-shell focus-visible-ring min-h-28 resize-y"
          data-testid="habit-description-input"
          id="habit-description"
          onChange={(event) => setDescription(event.target.value)}
          placeholder="A short cue or reason that makes the habit easier to start."
          value={description}
        />
      </div>

      <div className="space-y-2">
        <span className="block text-sm font-extrabold text-ink" id="habit-frequency-label">
          Frequency
        </span>
        <div className="relative" data-testid="habit-frequency-menu">
          <button
            aria-controls="habit-frequency-options"
            aria-expanded={frequencyOpen}
            aria-haspopup="listbox"
            aria-labelledby="habit-frequency-label"
            className="focus-visible-ring flex min-h-16 w-full items-center justify-between gap-3 rounded-[1.5rem] bg-white px-5 text-left text-base font-black text-indigo shadow-[inset_0_0_0_4px_rgba(49,80,254,0.20),0_18px_44px_rgba(43,37,152,0.10)] transition hover:shadow-[inset_0_0_0_4px_rgba(49,80,254,0.32),0_22px_54px_rgba(43,37,152,0.14)]"
            data-testid="habit-frequency-select"
            onClick={() => setFrequencyOpen((current) => !current)}
            type="button"
          >
            <span className="flex items-center gap-3">
              <CalendarDays aria-hidden="true" className="text-primary" size={18} />
              {activeFrequency.label}
            </span>
            <ChevronDown
              aria-hidden="true"
              className={`text-primary transition ${frequencyOpen ? "rotate-180" : ""}`}
              size={18}
            />
          </button>

          {frequencyOpen ? (
            <div
              aria-labelledby="habit-frequency-label"
              className="absolute left-1 right-1 top-[calc(100%-2px)] z-30 overflow-hidden rounded-b-[1.1rem] bg-white shadow-[0_24px_60px_rgba(43,37,152,0.18)] ring-1 ring-indigo/20"
              id="habit-frequency-options"
              role="listbox"
            >
              {frequencyOptions.map((option) => {
                const selected = option.value === frequency;

                return (
                  <button
                    aria-selected={selected}
                    className={`block min-h-10 w-full px-14 text-left text-base font-semibold transition ${
                      selected ? "bg-[#236bd4] text-white" : "bg-white text-ink hover:bg-primary/10"
                    }`}
                    data-testid={`habit-frequency-option-${option.value}`}
                    key={option.value}
                    onClick={() => {
                      setFrequency(option.value);
                      setFrequencyOpen(false);
                    }}
                    role="option"
                    type="button"
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      {error ? (
        <p aria-live="polite" className="rounded-2xl bg-magenta/10 px-4 py-3 text-sm font-bold text-magenta" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          className="primary-button focus-visible-ring min-h-12 flex-1 px-5 py-3"
          data-testid="habit-save-button"
          type="submit"
        >
          <Save aria-hidden="true" size={18} />
          Save Habit
        </button>
        <button className="secondary-button focus-visible-ring min-h-12 px-5 py-3" onClick={onCancel} type="button">
          Cancel
        </button>
      </div>
    </form>
  );
}
