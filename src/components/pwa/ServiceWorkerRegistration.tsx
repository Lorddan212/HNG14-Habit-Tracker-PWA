"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    const workerUrl = process.env.NODE_ENV === "production" ? "/sw.js" : "/sw-dev.js";

    if (process.env.NODE_ENV !== "production" && "caches" in window) {
      caches.keys().then((keys) => {
        keys.forEach((key) => {
          caches.delete(key);
        });
      });
    }

    navigator.serviceWorker.register(workerUrl, { updateViaCache: "none" }).catch(() => {
      // The app remains usable if registration is unavailable.
    });
  }, []);

  return null;
}
