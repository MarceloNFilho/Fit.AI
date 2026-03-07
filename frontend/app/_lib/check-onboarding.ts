import { getHomeData, getMe } from "@/app/_lib/api/fetch-generated";
import dayjs from "dayjs";
import { redirect } from "next/navigation";

export async function checkOnboarding() {
  const [homeResponse, meResponse] = await Promise.all([
    getHomeData(dayjs().format("YYYY-MM-DD")),
    getMe(),
  ]);

  const hasNoProfile = meResponse.status === 200 && meResponse.data === null;
  const hasNoActivePlan = homeResponse.status === 404;

  if (hasNoProfile || hasNoActivePlan) {
    redirect("/onboarding");
  }

  return { homeResponse, meResponse };
}
