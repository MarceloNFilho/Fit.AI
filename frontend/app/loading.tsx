import { PageSkeleton } from "@/components/ui/page-skeleton";

export default function HomeLoading() {
  return (
    <PageSkeleton.Root>
      <PageSkeleton.HomeBanner />

      <div className="flex w-full flex-col gap-3 items-start px-5 pt-5">
        <PageSkeleton.SectionHeader />
        <PageSkeleton.ConsistencyWeek />
      </div>

      <div className="flex w-full flex-col gap-3 items-start p-5">
        <PageSkeleton.SectionHeader />
        <PageSkeleton.WorkoutDayCard />
      </div>

      <PageSkeleton.BottomNav />
    </PageSkeleton.Root>
  );
}
