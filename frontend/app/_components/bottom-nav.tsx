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

const NAV_LABELS: Record<NavPage, string> = {
  home: "Início",
  calendar: "Treinos",
  stats: "Estatísticas",
  profile: "Perfil",
};

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

  const pageNavItems = navItems.filter((item) => !item.isCenter);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-6 rounded-t-[20px] border border-border bg-background px-6 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden">
        {navItems.map(({ key, href, icon: Icon, isCenter }) =>
          isCenter ? (
            <ChatTrigger key={key} />
          ) : (
            <Link
              key={key}
              href={href}
              className={cn(
                "flex items-center p-3",
                key === activePage
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              <Icon className="size-6" />
            </Link>
          ),
        )}
      </nav>

      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 z-50 w-60 flex-col border-r border-border bg-background px-4 py-6">
        <Link
          href="/"
          className="px-3 text-[22px] font-normal uppercase leading-[1.15] text-foreground font-anton"
        >
          Fit.ai
        </Link>

        <nav className="mt-8 flex flex-col gap-1">
          {pageNavItems.map(({ key, href, icon: Icon }) => (
            <Link
              key={key}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium font-inter-tight transition-colors",
                key === activePage
                  ? "text-foreground bg-secondary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
              )}
            >
              <Icon className="size-5" />
              <span>{NAV_LABELS[key as NavPage]}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex justify-center">
          <ChatTrigger />
        </div>
      </aside>
    </>
  );
}
