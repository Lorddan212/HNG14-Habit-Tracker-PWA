import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import Script from "next/script";
import { ServiceWorkerRegistration } from "@/components/pwa/ServiceWorkerRegistration";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "A mobile-first localStorage habit tracker PWA.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#3150fe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${inter.variable} ${manrope.variable}`} lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {process.env.NODE_ENV !== "production" ? (
          <Script
            dangerouslySetInnerHTML={{
              __html: `
                (function () {
                  var isDevHost = ["localhost", "127.0.0.1", "192.168.137.1"].indexOf(window.location.hostname) !== -1;
                  if (!isDevHost || !("serviceWorker" in navigator)) return;

                  var resetKey = "habit-tracker-dev-cache-reset-v2";
                  if (window.sessionStorage.getItem(resetKey) === "done") return;

                  var clearServiceWorkers = navigator.serviceWorker.getRegistrations()
                    .then(function (registrations) {
                      return Promise.all(registrations.map(function (registration) {
                        return registration.unregister();
                      }));
                    });

                  var clearCaches = "caches" in window
                    ? caches.keys().then(function (keys) {
                        return Promise.all(keys.map(function (key) {
                          return caches.delete(key);
                        }));
                      })
                    : Promise.resolve();

                  Promise.all([clearServiceWorkers, clearCaches])
                    .then(function () {
                      window.sessionStorage.setItem(resetKey, "done");
                      window.location.reload();
                    })
                    .catch(function () {
                      window.sessionStorage.setItem(resetKey, "done");
                    });
                })();
              `,
            }}
            id="dev-clear-stale-service-worker"
            strategy="beforeInteractive"
          />
        ) : null}
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
