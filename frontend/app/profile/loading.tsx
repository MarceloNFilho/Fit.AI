import { PageSkeleton } from "@/components/ui/page-skeleton";

export default function ProfileLoading() {
  return (
    <PageSkeleton.Root>
      <PageSkeleton.Header />

      <div className="flex w-full flex-col items-center gap-5 p-5 flex-1">
        <PageSkeleton.ProfileSection />

        <div className="grid w-full grid-cols-2 gap-3">
          <PageSkeleton.StatCard />
          <PageSkeleton.StatCard />
          <PageSkeleton.StatCard />
          <PageSkeleton.StatCard />
        </div>
      </div>

      <PageSkeleton.BottomNav />
    </PageSkeleton.Root>
  );
}
