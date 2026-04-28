export function SplashScreen() {
  return (
    <main
      className="flex min-h-screen items-center justify-center overflow-hidden bg-editorial-wash px-6"
      data-testid="splash-screen"
    >
      <section className="relative w-full max-w-sm text-center">
        <div className="glass-panel mx-auto flex aspect-square w-28 items-center justify-center rounded-[2rem]">
          <div className="h-14 w-14 rounded-[1.35rem] bg-cta-gradient shadow-lift" />
        </div>
        <h1 className="mt-8 font-display text-5xl font-black leading-none tracking-normal text-ink">
          Habit Tracker
        </h1>
      </section>
    </main>
  );
}
