import Link from "next/link";
import {
  House,
  Calendar,
  ChartNoAxesColumn,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import dayjs from "dayjs";
import { getHomeData } from "@/app/_lib/api/fetch-generated";
import { cn } from "@/lib/utils";
import { ChatTrigger } from "./chatbot/chat-trigger";

type NavPage = "home" | "calendar" | "stats" | "profile";

interface NavItem {
  key: NavPage | "ai";
  href: string;
  icon: LucideIcon;
  isCenter?: boolean;
}

interface BottomNavProps {
  activePage?: NavPage;
}

export async function BottomNav({ activePage }: BottomNavProps = {}) {
  const homeData = await getHomeData(dayjs().format("YYYY-MM-DD"));

  const calendarHref =
    homeData.status === 200 && homeData.data.activeWorkoutPlanId
      ? `/workout-plans/${homeData.data.activeWorkoutPlanId}`
      : "#";

  const navItems: NavItem[] = [
    { key: "home", href: "/", icon: House },
    { key: "calendar", href: calendarHref, icon: Calendar },
    { key: "ai", href: "#", icon: House, isCenter: true },
    { key: "stats", href: "/stats", icon: ChartNoAxesColumn },
    { key: "profile", href: "/profile", icon: UserRound },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-6 rounded-t-[20px] border border-border bg-background px-6 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      {navItems.map(({ key, href, icon: Icon, isCenter }) =>
        isCenter ? (
          <ChatTrigger key={key} />
        ) : (
          <Link
            key={key}
            href={href}
            className={cn(
              "flex items-center p-3",
              key === activePage ? "text-foreground" : "text-muted-foreground",
            )}
          >
            <Icon className="size-6" />
          </Link>
        ),
      )}
    </nav>
  );
}
