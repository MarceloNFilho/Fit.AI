import { PageSkeleton } from "@/components/ui/page-skeleton";

export default function WorkoutPlanLoading() {
  return (
    <PageSkeleton.Root>
      <PageSkeleton.WorkoutPlanBanner />

      <div className="flex w-full flex-col gap-3 p-5 md:grid md:grid-cols-2 lg:grid-cols-3">
        <PageSkeleton.WorkoutDayCard />
        <PageSkeleton.WorkoutDayCard />
        <PageSkeleton.WorkoutDayCard />
        <PageSkeleton.WorkoutDayCard />
        <PageSkeleton.WorkoutDayCard />
      </div>

      <PageSkeleton.BottomNav />
    </PageSkeleton.Root>
  );
}
