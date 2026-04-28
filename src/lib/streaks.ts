function parseDateKey(date: string): Date {
  return new Date(`${date}T00:00:00.000Z`);
}

function formatDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function calculateCurrentStreak(completions: string[], today?: string): number {
  const todayKey = today ?? formatDateKey(new Date());
  const uniqueSortedCompletions = Array.from(new Set(completions)).sort();
  const completionSet = new Set(uniqueSortedCompletions);

  if (!completionSet.has(todayKey)) {
    return 0;
  }

  let streak = 0;
  const cursor = parseDateKey(todayKey);

  while (completionSet.has(formatDateKey(cursor))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return streak;
}
