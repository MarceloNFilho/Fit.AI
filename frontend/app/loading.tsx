import { PageSkeleton } from "@/components/ui/page-skeleton";

export default function HomeLoading() {
  return (
    <PageSkeleton.Root>
      <PageSkeleton.HomeBanner />

      <div className="flex w-full flex-col md:grid md:grid-cols-2 md:gap-6 md:px-5 md:pt-5">
        <div className="flex w-full flex-col gap-3 items-start px-5 pt-5 md:px-0 md:pt-0">
          <PageSkeleton.SectionHeader />
          <PageSkeleton.ConsistencyWeek />
        </div>

        <div className="flex w-full flex-col gap-3 items-start p-5 md:p-0">
          <PageSkeleton.SectionHeader />
          <PageSkeleton.WorkoutDayCard />
        </div>
      </div>

      <PageSkeleton.BottomNav />
    </PageSkeleton.Root>
  );
}
