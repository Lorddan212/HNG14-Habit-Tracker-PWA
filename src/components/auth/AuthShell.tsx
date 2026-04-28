import type { ReactNode } from "react";
import { ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  const proofPoints = [
    { label: "Private By Design", icon: ShieldCheck },
    { label: "Streak Insight", icon: TrendingUp },
    { label: "Offline Ready", icon: Sparkles },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_12%_10%,rgba(221,54,182,0.18),transparent_30%),radial-gradient(circle_at_88%_4%,rgba(49,80,254,0.22),transparent_34%),linear-gradient(140deg,#f9faff_0%,#eef1ff_52%,#fff7fd_100%)] px-4 py-6 sm:px-6">
      <section className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="order-2 overflow-hidden rounded-[2rem] bg-[#17153d] p-6 text-white shadow-[0_30px_90px_rgba(43,37,152,0.24)] sm:p-9 lg:order-1">
          <div className="max-w-2xl">
            <p className="font-body text-xs font-black uppercase tracking-[0.2em] text-[#f7b7ea]">
              Private Habit Tracker
            </p>
            <h1 className="mt-5 font-display text-5xl font-black leading-[0.95] tracking-normal sm:text-7xl">
              Habit Tracker
            </h1>
            <p className="mt-6 max-w-xl text-base font-semibold leading-7 text-white/72 sm:text-lg">
              A quiet operating system for personal rituals, built for people who want their routines to feel intentional,
              measured, and beautifully contained.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {proofPoints.map(({ label, icon: Icon }) => (
              <div className="rounded-[1.35rem] bg-white/10 p-4 backdrop-blur-[20px]" key={label}>
                <Icon aria-hidden="true" className="text-[#9aa8ff]" size={20} />
                <p className="mt-4 text-sm font-extrabold leading-5 text-white">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[1.5rem] bg-white/[0.08] p-5 backdrop-blur-[20px]">
            <p className="text-sm font-semibold leading-6 text-white/72">
              Your account, streaks, and habits stay on this device through localStorage. No external account service,
              no remote database, no syncing behind the curtain.
            </p>
          </div>
        </div>

        <div className="order-1 rounded-[2rem] bg-white/78 p-5 shadow-[0_24px_80px_rgba(49,80,254,0.14)] backdrop-blur-[20px] sm:p-8 lg:order-2">
          <div className="mb-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-magenta">Member Access</p>
            <h2 className="mt-3 font-display text-4xl font-black leading-tight tracking-normal text-ink">{title}</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-ink-muted">{subtitle}</p>
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}
