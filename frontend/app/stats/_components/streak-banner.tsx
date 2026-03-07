import Image from "next/image";

interface StreakBannerProps {
  workoutStreak: number;
}

export function StreakBanner({ workoutStreak }: StreakBannerProps) {
  const isActive = workoutStreak > 0;

  return (
    <div className="relative flex w-full flex-col items-center justify-center gap-6 overflow-clip rounded-xl px-5 py-10">
      <Image
        alt=""
        src="/streak-banner.png"
        fill
        className={`pointer-events-none object-cover ${isActive ? "" : "grayscale"}`}
        priority
      />

      <div className="relative flex flex-col items-center gap-3">
        <div className="flex items-start rounded-full border border-background/12 bg-background/12 p-3 backdrop-blur-[4px]">
          <Image
            src={isActive ? "/fire-icon-light.svg" : "/fire-icon-gray.svg"}
            alt="Streak"
            width={32}
            height={32}
          />
        </div>

        <div className="flex flex-col items-center gap-1 text-background">
          <p className="text-center text-5xl font-semibold leading-[0.95] font-inter-tight">
            {workoutStreak} dias
          </p>
          <p className="text-base leading-[1.15] text-background/60 font-inter-tight">
            Sequência Atual
          </p>
        </div>
      </div>
    </div>
  );
}
