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
        <PageSkeleton.ConsistencyHeatmap />

        <div className="flex gap-3">
          <PageSkeleton.StatCard />
          <PageSkeleton.StatCard />
        </div>

        <PageSkeleton.StatCardWide />
      </div>

      <PageSkeleton.BottomNav />
    </PageSkeleton.Root>
  );
}
