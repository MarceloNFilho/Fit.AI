import { authClient } from "@/app/_lib/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getMe } from "@/app/_lib/api/fetch-generated";
import { checkOnboarding } from "@/app/_lib/check-onboarding";
import Image from "next/image";
import { Weight, Ruler, BicepsFlexed, User } from "lucide-react";
import { BottomNav } from "@/app/_components/bottom-nav";
import { StatCard } from "@/app/stats/_components/stat-card";
import { LogoutButton } from "./_components/logout-button";

export default async function ProfilePage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) {
    return redirect("/auth");
  }

  await checkOnboarding();

  const meResponse = await getMe();

  if (meResponse.status !== 200) {
    return redirect("/auth");
  }

  const profileData = meResponse.data;
  const userName = session.data.user.name ?? "";
  const userImage = session.data.user.image;

  return (
    <div className="flex min-h-dvh flex-col items-center bg-background pb-24 md:ml-60 md:pb-8">
      <div className="flex h-14 w-full items-center px-5 md:hidden">
        <p className="text-[22px] font-normal uppercase leading-[1.15] text-foreground font-anton">
          Fit.ai
        </p>
      </div>

      <div className="flex w-full flex-col items-center gap-5 p-5 flex-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative size-[52px] shrink-0 overflow-hidden rounded-full">
              {userImage ? (
                <Image
                  src={userImage}
                  alt={userName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-muted">
                  <User className="size-6 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <p className="text-lg font-semibold leading-[1.05] text-foreground font-inter-tight">
                {profileData?.userName ?? userName}
              </p>
              <p className="text-sm leading-[1.15] text-foreground/70 font-inter-tight">
                Plano Básico
              </p>
            </div>
          </div>
        </div>

        <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard
            icon={Weight}
            value={
              profileData
                ? (profileData.weightInGrams / 1000)
                    .toFixed(1)
                    .replace(/\.0$/, "")
                : "--"
            }
            label="KG"
          />
          <StatCard
            icon={Ruler}
            value={profileData ? String(profileData.heightInCentimeters) : "--"}
            label="CM"
          />
          <StatCard
            icon={BicepsFlexed}
            value={profileData ? `${profileData.bodyFatPercentage}%` : "--%"}
            label="GC"
          />
          <StatCard
            icon={User}
            value={profileData ? String(profileData.age) : "--"}
            label="ANOS"
          />
        </div>

        <div className="mt-auto">
          <LogoutButton />
        </div>
      </div>

      <BottomNav activePage="profile" />
    </div>
  );
}
