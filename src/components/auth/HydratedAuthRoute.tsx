"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

export function HydratedAuthRoute({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-editorial-wash px-6">
        <div
          aria-label="Loading authentication screen"
          className="flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-surface-container-highest shadow-ambient"
          role="status"
        >
          <span className="h-3 w-3 animate-pulse rounded-full bg-primary" />
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
