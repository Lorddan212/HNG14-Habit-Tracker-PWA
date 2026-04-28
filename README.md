# Habit Tracker PWA

A mobile-first Habit Tracker Progressive Web App built with Next.js App Router, React, TypeScript, Tailwind CSS, localStorage, Vitest, React Testing Library, and Playwright.

## Project Overview

The app supports local signup, login, logout, password visibility toggles, email-derived dashboard greetings, profile editing from the dashboard navbar, account deletion with confirmation, habit creation, editing, deletion with confirmation, daily completion toggles, current streak calculation, daily-only frequency storage, persistence across reloads, and a cached PWA app shell after first load. It intentionally uses localStorage only: no backend, database, remote auth provider, Firebase, Supabase, or API service.

## Setup Instructions

```bash
npm install
```

## Run Instructions

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Editing Page Content

Login and signup titles/subtitles are centralized in:

```txt
src/content/auth.ts
```

Edit `authContent.login` for the login page and `authContent.signup` for the signup page.

Shared auth-side branding copy lives in:

```txt
src/components/auth/AuthShell.tsx
```

## Test Instructions

```bash
npm run test:unit
npm run test:integration
npm run test:e2e
npm test
```

`npm run test:unit` generates coverage and enforces at least 80% line coverage for files under `src/lib`.

## Local Persistence Structure

The app uses these exact keys:

- `habit-tracker-users`: JSON array of users shaped exactly as `{ id, email, password, createdAt }`
- `habit-tracker-session`: JSON session shaped as `{ userId, email }`
- `habit-tracker-habits`: JSON array of habits shaped as `{ id, userId, name, description, frequency, createdAt, completions }`

Habit completions are unique `YYYY-MM-DD` strings. Frequency is stored as `daily`, matching the technical requirements document. Habits are filtered by the active session's `userId`, so each user only sees their own list. Deleting an account removes that user, the active session, and all habits owned by that user from localStorage.

## How PWA Support Was Implemented

`public/manifest.json` defines the installable app metadata and icon entries. `public/sw.js` precaches the app shell routes and runtime-caches fetched GET assets with network-first behavior for online freshness. The client registers the service worker through `src/components/pwa/ServiceWorkerRegistration.tsx`. Production registers the caching worker, while development registers `public/sw-dev.js`, a no-op worker that avoids stale cached Next.js chunks during `npm run dev`. After a successful first load, the production app can render a cached shell offline without hard crashing.

## Trade-offs or Limitations

- Passwords are stored in plain localStorage because this is a strict local-only implementation.
- Sessions are device-local and browser-local.
- Completion toggles operate on today only, and the stored habit cadence is daily-only.
- The frequency dropdown is a custom React menu so its open state can be styled consistently across browsers while still storing the required `daily` value.
- Profile settings are opened from the dashboard navbar settings button. To preserve the strict `User` localStorage shape, profile editing updates email and password; the dashboard greeting is derived from the email local-part.
- Offline behavior is app-shell oriented; local data remains available through localStorage, but there is no server sync.
- Typography uses Manrope and Inter through Next.js font optimization.

## Required Test File Mapping

- `tests/unit/slug.test.ts`: verifies stable slug generation for habit test ids.
- `tests/unit/validators.test.ts`: verifies habit name trimming and validation messages.
- `tests/unit/streaks.test.ts`: verifies current streak rules, duplicates, and missing-day behavior.
- `tests/unit/habits.test.ts`: verifies immutable completion toggling and duplicate prevention.
- `tests/integration/auth-flow.test.tsx`: verifies signup, password visibility toggles, required email/password fields, duplicate signup rejection, login, and invalid login errors.
- `tests/integration/habit-form.test.tsx`: verifies validation, daily frequency selection, create, edit preservation, habit delete confirmation, completion toggling, streak display, profile email/password editing, and account delete confirmation.
- `tests/e2e/app.spec.ts`: verifies route redirects, auth flow, user-scoped habits, habit creation/completion, reload persistence, logout, and cached app shell offline behavior.
