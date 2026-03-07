import { Skeleton } from "@/components/ui/skeleton";
import {
  House,
  Calendar,
  ChartNoAxesColumn,
  UserRound,
  Sparkles,
} from "lucide-react";

function Root({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center bg-background pb-24">
      {children}
    </div>
  );
}

function Header() {
  return (
    <div className="flex h-14 w-full items-center px-5">
      <p className="text-[22px] font-normal uppercase leading-[1.15] text-foreground font-anton">
        Fit.ai
      </p>
    </div>
  );
}

function HomeBanner() {
  return (
    <div className="relative flex h-[296px] w-full flex-col items-start justify-between overflow-hidden rounded-b-[20px] px-5 pb-10 pt-5">
      <Skeleton className="absolute inset-0 rounded-b-[20px] rounded-t-none" />

      <Skeleton className="relative h-[26px] w-16" />

      <div className="relative flex w-full items-end justify-between">
        <div className="flex gap-1.5">
          <Skeleton className="size-[52px] shrink-0 rounded-full" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <Skeleton className="h-9 w-16 rounded-full" />
      </div>
    </div>
  );
}

function WorkoutPlanBanner() {
  return (
    <div className="relative flex h-[296px] w-full flex-col items-start justify-between overflow-hidden rounded-b-[20px] px-5 pb-10 pt-5">
      <Skeleton className="absolute inset-0 rounded-b-[20px] rounded-t-none" />

      <Skeleton className="relative h-[26px] w-16" />

      <div className="relative flex w-full items-end justify-between">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-7 w-28 rounded-full" />
          <Skeleton className="h-7 w-44" />
        </div>
      </div>
    </div>
  );
}

function ConsistencyWeek() {
  return (
    <div className="flex gap-3 items-stretch w-full">
      <div className="flex items-center justify-between rounded-xl border border-border p-5 flex-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1.5 items-center">
            <Skeleton className="size-5 rounded-md" />
            <Skeleton className="h-3 w-2" />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 rounded-xl bg-streak-bg px-5">
        <Skeleton className="h-5 w-8 bg-streak-text/20" />
      </div>
    </div>
  );
}

function WorkoutDayCard() {
  return (
    <div className="relative flex h-[200px] w-full flex-col items-start justify-between overflow-hidden rounded-xl p-5">
      <Skeleton className="absolute inset-0 rounded-xl" />

      <div className="relative">
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>

      <div className="relative flex flex-col gap-2 items-start">
        <Skeleton className="h-7 w-40" />
        <div className="flex gap-2 items-start">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}

function StatCard() {
  return (
    <div className="flex flex-1 flex-col items-center gap-5 rounded-xl border p-5">
      <Skeleton className="size-[34px] rounded-full" />
      <div className="flex flex-col items-center gap-1.5">
        <Skeleton className="h-7 w-12" />
        <Skeleton className="h-3 w-8" />
      </div>
    </div>
  );
}

function StatCardWide() {
  return (
    <div className="flex flex-1 flex-col items-center gap-5 rounded-xl border p-5">
      <Skeleton className="size-[34px] rounded-full" />
      <div className="flex flex-col items-center gap-1.5">
        <Skeleton className="h-7 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

function StreakBanner() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center gap-6 overflow-clip rounded-xl px-5 py-10">
      <Skeleton className="absolute inset-0" />

      <div className="relative flex flex-col items-center gap-3">
        <Skeleton className="size-14 rounded-full" />
        <div className="flex flex-col items-center gap-1">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-5 w-28" />
        </div>
      </div>
    </div>
  );
}

function ConsistencyHeatmap() {
  return (
    <div className="w-full rounded-xl border border-border p-4">
      <div className="flex flex-col gap-1">
        <div className="flex gap-1 mb-1">
          <Skeleton className="h-3 w-6" />
          <Skeleton className="h-3 w-6 ml-auto" />
          <Skeleton className="h-3 w-6 ml-auto" />
        </div>
        {Array.from({ length: 7 }).map((_, row) => (
          <div key={row} className="flex gap-1">
            {Array.from({ length: 12 }).map((_, col) => (
              <Skeleton key={col} className="aspect-square flex-1 rounded-md" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileSection() {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="size-[52px] shrink-0 rounded-full" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

function ExerciseCard() {
  return (
    <div className="flex w-full items-start justify-between rounded-xl border border-border p-4">
      <div className="flex flex-1 flex-col gap-3 justify-center">
        <div className="flex w-full items-center justify-between">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="size-5 rounded-full" />
        </div>
        <div className="flex gap-1.5 items-start">
          <Skeleton className="h-[22px] w-16 rounded-full" />
          <Skeleton className="h-[22px] w-16 rounded-full" />
          <Skeleton className="h-[22px] w-14 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function WorkoutDayCover() {
  return (
    <div className="relative flex h-[200px] w-full flex-col items-start justify-between overflow-hidden rounded-xl p-5">
      <Skeleton className="absolute inset-0 rounded-xl" />

      <div className="relative">
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>

      <div className="relative flex w-full items-end justify-between">
        <div className="flex flex-col gap-2 items-start">
          <Skeleton className="h-7 w-40" />
          <div className="flex gap-2 items-start">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-9 w-20 rounded-full" />
      </div>
    </div>
  );
}

function WorkoutDayHeader() {
  return (
    <div className="flex w-full items-center justify-between">
      <Skeleton className="size-10 rounded-md" />
      <Skeleton className="h-5 w-20" />
      <div className="size-6" />
    </div>
  );
}

function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-6 rounded-t-[20px] border border-border bg-background px-6 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center p-3 text-muted-foreground">
        <House className="size-6" />
      </div>
      <div className="flex items-center p-3 text-muted-foreground">
        <Calendar className="size-6" />
      </div>
      <div className="flex items-center justify-center rounded-full bg-primary p-4">
        <Sparkles className="size-6 text-primary-foreground" />
      </div>
      <div className="flex items-center p-3 text-muted-foreground">
        <ChartNoAxesColumn className="size-6" />
      </div>
      <div className="flex items-center p-3 text-muted-foreground">
        <UserRound className="size-6" />
      </div>
    </nav>
  );
}

function SectionHeader() {
  return (
    <div className="flex w-full items-center justify-between">
      <Skeleton className="h-6 w-28" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export const PageSkeleton = {
  Root,
  Header,
  HomeBanner,
  WorkoutPlanBanner,
  ConsistencyWeek,
  WorkoutDayCard,
  StatCard,
  StatCardWide,
  StreakBanner,
  ConsistencyHeatmap,
  ProfileSection,
  ExerciseCard,
  WorkoutDayCover,
  WorkoutDayHeader,
  BottomNav,
  SectionHeader,
};
