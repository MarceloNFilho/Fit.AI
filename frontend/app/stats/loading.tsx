import { PageSkeleton } from "@/components/ui/page-skeleton";

export default function StatsLoading() {
  return (
    <PageSkeleton.Root>
      <PageSkeleton.Header />

      <div className="flex w-full flex-col px-5">
        <PageSkeleton.StreakBanner />
      </div>

      <div className="flex w-full flex-col gap-3 p-5">
        <PageSkeleton.SectionHeader />

        <div className="md:hidden">
          <PageSkeleton.ConsistencyHeatmap />
        </div>
        <div className="hidden md:block">
          <PageSkeleton.ConsistencyHeatmapWide />
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <PageSkeleton.StatCard />
          <PageSkeleton.StatCard />
          <div className="col-span-2 md:col-span-1">
            <PageSkeleton.StatCardWide />
          </div>
        </div>
      </div>

      <PageSkeleton.BottomNav />
    </PageSkeleton.Root>
  );
}
