"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getValidSession } from "@/lib/storage";
import { SplashScreen } from "@/components/shared/SplashScreen";

export function RootGate() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const session = getValidSession();
      router.replace(session ? "/dashboard" : "/login");
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [router]);

  return <SplashScreen />;
}
