import { PageSkeleton } from "@/components/ui/page-skeleton";

export default function WorkoutDayLoading() {
  return (
    <PageSkeleton.Root>
      <div className="flex w-full flex-col gap-5 p-5">
        <PageSkeleton.WorkoutDayHeader />
        <PageSkeleton.WorkoutDayCover />

        <div className="flex flex-col gap-3 w-full md:grid md:grid-cols-2">
          <PageSkeleton.ExerciseCard />
          <PageSkeleton.ExerciseCard />
          <PageSkeleton.ExerciseCard />
          <PageSkeleton.ExerciseCard />
        </div>
      </div>

      <PageSkeleton.BottomNav />
    </PageSkeleton.Root>
  );
}
